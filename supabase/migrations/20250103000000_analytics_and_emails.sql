-- Analytics tracking for listings and events

CREATE TABLE listing_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,

  -- Daily aggregates
  date DATE NOT NULL,

  -- Metrics
  views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  click_throughs INTEGER DEFAULT 0, -- clicks to website/phone
  guestbook_views INTEGER DEFAULT 0,

  -- Geographic breakdown
  visitor_states JSONB DEFAULT '{}', -- {"CA": 45, "NY": 23}
  visitor_cities JSONB DEFAULT '{}', -- {"Los Angeles": 30, "San Diego": 15}

  -- Referral sources
  referral_sources JSONB DEFAULT '{}', -- {"google": 50, "direct": 30}

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(listing_id, date)
);

CREATE INDEX listing_analytics_listing_date_idx ON listing_analytics(listing_id, date DESC);
CREATE INDEX listing_analytics_date_idx ON listing_analytics(date DESC);

-- Event analytics
CREATE TABLE event_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,

  date DATE NOT NULL,

  views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  route_adds INTEGER DEFAULT 0, -- added to route planner

  visitor_states JSONB DEFAULT '{}',
  visitor_cities JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(event_id, date)
);

CREATE INDEX event_analytics_event_date_idx ON event_analytics(event_id, date DESC);

-- Email preferences
CREATE TABLE email_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL UNIQUE,

  -- Preferences
  weekly_digest BOOLEAN DEFAULT true,
  new_sales_nearby BOOLEAN DEFAULT true,
  monthly_stats BOOLEAN DEFAULT true, -- for shop owners
  marketing BOOLEAN DEFAULT true,

  -- Frequency
  digest_day TEXT DEFAULT 'friday' CHECK (digest_day IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),

  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email queue (for async sending)
CREATE TABLE email_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  recipient_email TEXT NOT NULL,
  recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,

  template TEXT NOT NULL, -- 'welcome', 'monthly_stats', 'weekly_digest'
  subject TEXT NOT NULL,

  -- Template data
  data JSONB DEFAULT '{}',

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMPTZ,
  error_message TEXT,

  -- Scheduling
  scheduled_for TIMESTAMPTZ DEFAULT NOW(),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX email_queue_status_idx ON email_queue(status) WHERE status = 'pending';
CREATE INDEX email_queue_scheduled_idx ON email_queue(scheduled_for) WHERE status = 'pending';

-- Function to track listing view
CREATE OR REPLACE FUNCTION track_listing_view(
  p_listing_id UUID,
  p_visitor_id TEXT, -- session ID or user ID
  p_state TEXT DEFAULT NULL,
  p_city TEXT DEFAULT NULL,
  p_referrer TEXT DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  today DATE := CURRENT_DATE;
BEGIN
  -- Insert or update daily analytics
  INSERT INTO listing_analytics (listing_id, date, views, unique_visitors, visitor_states, visitor_cities, referral_sources)
  VALUES (
    p_listing_id,
    today,
    1,
    1,
    CASE WHEN p_state IS NOT NULL THEN jsonb_build_object(p_state, 1) ELSE '{}'::jsonb END,
    CASE WHEN p_city IS NOT NULL THEN jsonb_build_object(p_city, 1) ELSE '{}'::jsonb END,
    CASE WHEN p_referrer IS NOT NULL THEN jsonb_build_object(p_referrer, 1) ELSE '{}'::jsonb END
  )
  ON CONFLICT (listing_id, date) DO UPDATE SET
    views = listing_analytics.views + 1,
    visitor_states = CASE
      WHEN p_state IS NOT NULL THEN
        jsonb_set(
          listing_analytics.visitor_states,
          ARRAY[p_state],
          to_jsonb(COALESCE((listing_analytics.visitor_states->p_state)::int, 0) + 1)
        )
      ELSE listing_analytics.visitor_states
    END,
    visitor_cities = CASE
      WHEN p_city IS NOT NULL THEN
        jsonb_set(
          listing_analytics.visitor_cities,
          ARRAY[p_city],
          to_jsonb(COALESCE((listing_analytics.visitor_cities->p_city)::int, 0) + 1)
        )
      ELSE listing_analytics.visitor_cities
    END,
    referral_sources = CASE
      WHEN p_referrer IS NOT NULL THEN
        jsonb_set(
          listing_analytics.referral_sources,
          ARRAY[p_referrer],
          to_jsonb(COALESCE((listing_analytics.referral_sources->p_referrer)::int, 0) + 1)
        )
      ELSE listing_analytics.referral_sources
    END;
END;
$$ LANGUAGE plpgsql;

-- Function to get monthly stats for a listing
CREATE OR REPLACE FUNCTION get_listing_monthly_stats(
  p_listing_id UUID,
  p_month DATE DEFAULT DATE_TRUNC('month', CURRENT_DATE)
)
RETURNS TABLE (
  total_views BIGINT,
  total_unique_visitors BIGINT,
  avg_daily_views NUMERIC,
  top_state TEXT,
  top_city TEXT,
  growth_percent NUMERIC
) AS $$
DECLARE
  prev_month DATE := p_month - INTERVAL '1 month';
  current_total BIGINT;
  previous_total BIGINT;
BEGIN
  -- Current month stats
  SELECT
    COALESCE(SUM(views), 0),
    COALESCE(SUM(unique_visitors), 0),
    COALESCE(AVG(views), 0)
  INTO
    current_total,
    total_unique_visitors,
    avg_daily_views
  FROM listing_analytics
  WHERE listing_id = p_listing_id
    AND date >= p_month
    AND date < p_month + INTERVAL '1 month';

  total_views := current_total;

  -- Previous month for growth calculation
  SELECT COALESCE(SUM(views), 0)
  INTO previous_total
  FROM listing_analytics
  WHERE listing_id = p_listing_id
    AND date >= prev_month
    AND date < p_month;

  -- Calculate growth
  IF previous_total > 0 THEN
    growth_percent := ((current_total - previous_total)::NUMERIC / previous_total) * 100;
  ELSE
    growth_percent := CASE WHEN current_total > 0 THEN 100 ELSE 0 END;
  END IF;

  -- Top state (simplified - would need more complex query for real implementation)
  top_state := 'CA'; -- Placeholder
  top_city := 'Los Angeles'; -- Placeholder

  RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security
ALTER TABLE listing_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;

-- Shop owners can view analytics for their claimed listings
CREATE POLICY "Shop owners view own listing analytics" ON listing_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_analytics.listing_id
      AND listings.claimed_by = auth.uid()
    )
  );

-- Admins can view all analytics
CREATE POLICY "Admins view all analytics" ON listing_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.account_type = 'admin'
    )
  );

-- Users can manage their own email preferences
CREATE POLICY "Users manage own email prefs" ON email_preferences
  FOR ALL USING (auth.uid() = user_id);
