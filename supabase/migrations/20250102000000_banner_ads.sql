-- Banner Ads Table for Local Shop Advertising

CREATE TABLE banner_ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ad Details
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT NOT NULL,

  -- Placement
  position TEXT NOT NULL CHECK (position IN ('top', 'sidebar', 'content', 'footer')),

  -- Geographic Targeting
  target_states TEXT[], -- ['CA', 'NY'] or NULL for all states
  target_cities TEXT[], -- ['Los Angeles', 'New York'] or NULL for all cities

  -- Scheduling
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  active BOOLEAN DEFAULT TRUE,

  -- Analytics
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,

  -- Billing
  purchased_by UUID REFERENCES users(id) ON DELETE SET NULL,
  price_paid DECIMAL(10, 2),

  CONSTRAINT valid_dates CHECK (end_date > start_date)
);

-- Indexes
CREATE INDEX banner_ads_position_idx ON banner_ads(position);
CREATE INDEX banner_ads_active_idx ON banner_ads(active) WHERE active = true;
CREATE INDEX banner_ads_dates_idx ON banner_ads(start_date, end_date);
CREATE INDEX banner_ads_states_idx ON banner_ads USING GIN(target_states);
CREATE INDEX banner_ads_cities_idx ON banner_ads USING GIN(target_cities);

-- Row Level Security
ALTER TABLE banner_ads ENABLE ROW LEVEL SECURITY;

-- Anyone can view active ads
CREATE POLICY "Anyone can view active ads" ON banner_ads
  FOR SELECT USING (active = true AND NOW() BETWEEN start_date AND end_date);

-- Users can view their own ads
CREATE POLICY "Users can view own ads" ON banner_ads
  FOR SELECT USING (auth.uid() = purchased_by);

-- Only admins can insert/update/delete
CREATE POLICY "Admins can manage ads" ON banner_ads
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.account_type = 'admin'
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_banner_ads_updated_at BEFORE UPDATE ON banner_ads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-deactivate expired ads
CREATE OR REPLACE FUNCTION deactivate_expired_ads()
RETURNS void AS $$
BEGIN
  UPDATE banner_ads
  SET active = false
  WHERE active = true
  AND end_date < NOW();
END;
$$ LANGUAGE plpgsql;

-- You can run this daily via a cron job or Supabase function
