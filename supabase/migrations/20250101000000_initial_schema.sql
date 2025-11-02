-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create enum types
CREATE TYPE listing_type AS ENUM (
  'antique_shop',
  'thrift_store',
  'consignment_shop',
  'flea_market',
  'auction_house',
  'estate_sale_company'
);

CREATE TYPE event_type AS ENUM ('yard_sale', 'estate_sale');
CREATE TYPE account_type AS ENUM ('user', 'shop_owner', 'admin');
CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'rejected');

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  verified BOOLEAN DEFAULT FALSE,
  account_type account_type DEFAULT 'user',
  idme_verified BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Anyone can read tags
CREATE POLICY "Anyone can view tags" ON tags
  FOR SELECT USING (true);

-- Listings table (shops, stores, flea markets, etc.)
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  type listing_type NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone TEXT,
  website TEXT,
  description TEXT,
  hours JSONB,
  parent_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  claimed BOOLEAN DEFAULT FALSE,
  claimed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  verified BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  photo_urls TEXT[] DEFAULT '{}'
);

-- Create index for geo queries
CREATE INDEX listings_location_idx ON listings USING GIST (
  ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Create indexes for common queries
CREATE INDEX listings_type_idx ON listings(type);
CREATE INDEX listings_city_state_idx ON listings(city, state);
CREATE INDEX listings_parent_id_idx ON listings(parent_id);

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved listings
CREATE POLICY "Anyone can view listings" ON listings
  FOR SELECT USING (true);

-- Authenticated users can create listings
CREATE POLICY "Authenticated users can create listings" ON listings
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update listings they claimed
CREATE POLICY "Users can update claimed listings" ON listings
  FOR UPDATE USING (auth.uid() = claimed_by);

-- Events table (yard sales and estate sales)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  type event_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  photo_urls TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  moderation_status moderation_status DEFAULT 'pending',
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL
);

-- Create index for geo queries
CREATE INDEX events_location_idx ON events USING GIST (
  ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Create indexes for common queries
CREATE INDEX events_type_idx ON events(type);
CREATE INDEX events_start_time_idx ON events(start_time);
CREATE INDEX events_moderation_status_idx ON events(moderation_status);
CREATE INDEX events_city_state_idx ON events(city, state);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved events
CREATE POLICY "Anyone can view approved events" ON events
  FOR SELECT USING (moderation_status = 'approved' OR auth.uid() = created_by);

-- Authenticated users can create events
CREATE POLICY "Authenticated users can create events" ON events
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own events
CREATE POLICY "Users can update own events" ON events
  FOR UPDATE USING (auth.uid() = created_by);

-- Users can delete their own events
CREATE POLICY "Users can delete own events" ON events
  FOR DELETE USING (auth.uid() = created_by);

-- Listing tags junction table
CREATE TABLE listing_tags (
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (listing_id, tag_id)
);

ALTER TABLE listing_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view listing tags" ON listing_tags
  FOR SELECT USING (true);

-- Event tags junction table
CREATE TABLE event_tags (
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (event_id, tag_id)
);

ALTER TABLE event_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view event tags" ON event_tags
  FOR SELECT USING (true);

-- Guestbook entries
CREATE TABLE guestbook_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  description TEXT,
  photo_urls TEXT[] DEFAULT '{}',
  social_links JSONB,
  moderation_status moderation_status DEFAULT 'pending'
);

CREATE INDEX guestbook_listing_idx ON guestbook_entries(listing_id);
CREATE INDEX guestbook_moderation_status_idx ON guestbook_entries(moderation_status);

ALTER TABLE guestbook_entries ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved guestbook entries
CREATE POLICY "Anyone can view approved guestbook entries" ON guestbook_entries
  FOR SELECT USING (moderation_status = 'approved' OR auth.uid() = user_id);

-- Authenticated users can create guestbook entries
CREATE POLICY "Authenticated users can create guestbook entries" ON guestbook_entries
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own guestbook entries
CREATE POLICY "Users can update own guestbook entries" ON guestbook_entries
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own guestbook entries
CREATE POLICY "Users can delete own guestbook entries" ON guestbook_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Routes table (saved user routes)
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  event_ids UUID[] NOT NULL,
  custom_stops JSONB,
  route_data JSONB
);

CREATE INDEX routes_user_id_idx ON routes(user_id);

ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

-- Users can only view their own routes
CREATE POLICY "Users can view own routes" ON routes
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own routes
CREATE POLICY "Users can create routes" ON routes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own routes
CREATE POLICY "Users can update own routes" ON routes
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own routes
CREATE POLICY "Users can delete own routes" ON routes
  FOR DELETE USING (auth.uid() = user_id);

-- Functions

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON routes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment tag usage count
CREATE OR REPLACE FUNCTION increment_tag_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement tag usage count
CREATE OR REPLACE FUNCTION decrement_tag_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE tags SET usage_count = usage_count - 1 WHERE id = OLD.tag_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Triggers for tag usage count
CREATE TRIGGER increment_listing_tag_usage AFTER INSERT ON listing_tags
  FOR EACH ROW EXECUTE FUNCTION increment_tag_usage();

CREATE TRIGGER decrement_listing_tag_usage AFTER DELETE ON listing_tags
  FOR EACH ROW EXECUTE FUNCTION decrement_tag_usage();

CREATE TRIGGER increment_event_tag_usage AFTER INSERT ON event_tags
  FOR EACH ROW EXECUTE FUNCTION increment_tag_usage();

CREATE TRIGGER decrement_event_tag_usage AFTER DELETE ON event_tags
  FOR EACH ROW EXECUTE FUNCTION decrement_tag_usage();

-- Function to create user record on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
