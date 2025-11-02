-- Reference Library Schema
-- For hallmarks, makers, patterns, and identification guides

-- Categories (China, Glass, Silver, Furniture, etc.)
CREATE TABLE reference_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT, -- emoji or icon name
  image_url TEXT, -- category header image
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Makers/Manufacturers
CREATE TABLE reference_makers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES reference_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT, -- rich text for SEO
  founding_year INTEGER,
  closing_year INTEGER, -- NULL if still active
  country TEXT,
  logo_url TEXT,
  website_url TEXT,
  history TEXT, -- longer historical content
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  -- Stats
  view_count INTEGER DEFAULT 0,
  search_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_makers_category ON reference_makers(category_id);
CREATE INDEX idx_makers_country ON reference_makers(country);

-- Patterns/Styles/Lines within a maker
CREATE TABLE reference_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  maker_id UUID NOT NULL REFERENCES reference_makers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT, -- rich SEO content
  year_introduced INTEGER,
  year_discontinued INTEGER,
  materials TEXT[], -- ['porcelain', 'gold trim', etc.]
  colors TEXT[], -- main colors for filtering
  style_period TEXT, -- 'Art Deco', 'Victorian', etc.
  rarity TEXT CHECK (rarity IN ('common', 'uncommon', 'rare', 'very_rare', 'extremely_rare')),
  estimated_value_min DECIMAL(10, 2),
  estimated_value_max DECIMAL(10, 2),
  value_notes TEXT, -- context about values
  identification_tips TEXT, -- how to spot authentic pieces
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  -- Stats
  view_count INTEGER DEFAULT 0,
  search_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(maker_id, slug)
);

CREATE INDEX idx_patterns_maker ON reference_patterns(maker_id);
CREATE INDEX idx_patterns_rarity ON reference_patterns(rarity);
CREATE INDEX idx_patterns_style ON reference_patterns(style_period);

-- Reference Images (multiple per pattern for Google Lens SEO)
CREATE TABLE reference_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_id UUID NOT NULL REFERENCES reference_patterns(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt_text TEXT NOT NULL, -- critical for SEO
  caption TEXT,
  item_type TEXT, -- 'plate', 'cup', 'teapot', etc.
  view_angle TEXT, -- 'front', 'back', 'side', 'detail', 'hallmark'
  is_primary BOOLEAN DEFAULT FALSE, -- featured image
  sort_order INTEGER DEFAULT 0,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  source_attribution TEXT, -- credit if from external source
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_images_pattern ON reference_images(pattern_id);
CREATE INDEX idx_images_primary ON reference_images(pattern_id, is_primary) WHERE is_primary = TRUE;

-- Hallmarks (stamps/marks that identify makers)
CREATE TABLE reference_hallmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  maker_id UUID NOT NULL REFERENCES reference_makers(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  date_range_start INTEGER, -- year started using this mark
  date_range_end INTEGER, -- year stopped using this mark
  country_code TEXT, -- country code in mark (e.g., 'ENGLAND', 'GERMANY')
  mark_type TEXT, -- 'backstamp', 'impressed', 'printed', 'hand-painted'
  identification_notes TEXT,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hallmarks_maker ON reference_hallmarks(maker_id);
CREATE INDEX idx_hallmarks_country ON reference_hallmarks(country_code);

-- User-submitted reference entries (moderation workflow)
CREATE TABLE reference_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  submission_type TEXT NOT NULL CHECK (submission_type IN ('maker', 'pattern', 'hallmark', 'correction')),

  -- Data payload (flexible JSON for different submission types)
  data JSONB NOT NULL,

  -- If it's a correction/addition to existing entry
  related_maker_id UUID REFERENCES reference_makers(id) ON DELETE CASCADE,
  related_pattern_id UUID REFERENCES reference_patterns(id) ON DELETE CASCADE,

  -- Moderation
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  reviewer_notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_submissions_status ON reference_submissions(status);
CREATE INDEX idx_submissions_user ON reference_submissions(submitted_by);
CREATE INDEX idx_submissions_type ON reference_submissions(submission_type);

-- Reference search history (for analytics and improving search)
CREATE TABLE reference_search_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_query TEXT NOT NULL,
  category_id UUID REFERENCES reference_categories(id) ON DELETE SET NULL,
  results_count INTEGER,
  clicked_maker_id UUID REFERENCES reference_makers(id) ON DELETE SET NULL,
  clicked_pattern_id UUID REFERENCES reference_patterns(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_search_log_query ON reference_search_log(search_query);
CREATE INDEX idx_search_log_category ON reference_search_log(category_id);

-- Full text search configuration
CREATE INDEX idx_makers_search ON reference_makers USING GIN (
  to_tsvector('english', name || ' ' || COALESCE(description, ''))
);

CREATE INDEX idx_patterns_search ON reference_patterns USING GIN (
  to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || COALESCE(identification_tips, ''))
);

-- Trigger for updated_at
CREATE TRIGGER update_reference_categories_updated_at
  BEFORE UPDATE ON reference_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reference_makers_updated_at
  BEFORE UPDATE ON reference_makers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reference_patterns_updated_at
  BEFORE UPDATE ON reference_patterns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies

-- Categories: Public read
ALTER TABLE reference_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON reference_categories FOR SELECT USING (true);
CREATE POLICY "Only admins can modify categories" ON reference_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND account_type = 'admin')
);

-- Makers: Public read
ALTER TABLE reference_makers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Makers are viewable by everyone" ON reference_makers FOR SELECT USING (true);
CREATE POLICY "Only admins can modify makers" ON reference_makers FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND account_type = 'admin')
);

-- Patterns: Public read
ALTER TABLE reference_patterns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patterns are viewable by everyone" ON reference_patterns FOR SELECT USING (true);
CREATE POLICY "Only admins can modify patterns" ON reference_patterns FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND account_type = 'admin')
);

-- Images: Public read
ALTER TABLE reference_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reference images are viewable by everyone" ON reference_images FOR SELECT USING (true);
CREATE POLICY "Only admins can modify images" ON reference_images FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND account_type = 'admin')
);

-- Hallmarks: Public read
ALTER TABLE reference_hallmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Hallmarks are viewable by everyone" ON reference_hallmarks FOR SELECT USING (true);
CREATE POLICY "Only admins can modify hallmarks" ON reference_hallmarks FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND account_type = 'admin')
);

-- Submissions: Users can create, admins can moderate
ALTER TABLE reference_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own submissions" ON reference_submissions FOR SELECT USING (
  submitted_by = auth.uid() OR
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND account_type = 'admin')
);
CREATE POLICY "Authenticated users can create submissions" ON reference_submissions FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND submitted_by = auth.uid()
);
CREATE POLICY "Admins can moderate submissions" ON reference_submissions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND account_type = 'admin')
);

-- Search log: Public insert, admin read
ALTER TABLE reference_search_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can log searches" ON reference_search_log FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view search logs" ON reference_search_log FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND account_type = 'admin')
);

-- Helper function: Search reference library
CREATE OR REPLACE FUNCTION search_reference_library(
  search_query TEXT,
  category_filter UUID DEFAULT NULL,
  limit_results INTEGER DEFAULT 20
)
RETURNS TABLE (
  type TEXT,
  id UUID,
  name TEXT,
  description TEXT,
  image_url TEXT,
  maker_name TEXT,
  category_name TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  -- Search makers
  SELECT
    'maker'::TEXT,
    m.id,
    m.name,
    m.description,
    m.logo_url,
    NULL::TEXT AS maker_name,
    c.name AS category_name,
    ts_rank(
      to_tsvector('english', m.name || ' ' || COALESCE(m.description, '')),
      plainto_tsquery('english', search_query)
    ) AS rank
  FROM reference_makers m
  JOIN reference_categories c ON c.id = m.category_id
  WHERE
    to_tsvector('english', m.name || ' ' || COALESCE(m.description, '')) @@ plainto_tsquery('english', search_query)
    AND (category_filter IS NULL OR m.category_id = category_filter)

  UNION ALL

  -- Search patterns
  SELECT
    'pattern'::TEXT,
    p.id,
    p.name,
    p.description,
    ri.image_url,
    m.name AS maker_name,
    c.name AS category_name,
    ts_rank(
      to_tsvector('english', p.name || ' ' || COALESCE(p.description, '') || ' ' || COALESCE(p.identification_tips, '')),
      plainto_tsquery('english', search_query)
    ) AS rank
  FROM reference_patterns p
  JOIN reference_makers m ON m.id = p.maker_id
  JOIN reference_categories c ON c.id = m.category_id
  LEFT JOIN LATERAL (
    SELECT image_url FROM reference_images
    WHERE pattern_id = p.id AND is_primary = TRUE
    LIMIT 1
  ) ri ON TRUE
  WHERE
    to_tsvector('english', p.name || ' ' || COALESCE(p.description, '') || ' ' || COALESCE(p.identification_tips, '')) @@ plainto_tsquery('english', search_query)
    AND (category_filter IS NULL OR m.category_id = category_filter)

  ORDER BY rank DESC
  LIMIT limit_results;
END;
$$ LANGUAGE plpgsql;

-- Insert default categories
INSERT INTO reference_categories (name, slug, description, icon, sort_order) VALUES
  ('China & Porcelain', 'china-porcelain', 'Fine china, porcelain, and ceramic collectibles including dishes, figurines, and decorative pieces.', '🏺', 1),
  ('Glass & Crystal', 'glass-crystal', 'Depression glass, art glass, crystal, and vintage glassware from renowned makers.', '🥃', 2),
  ('Silver & Metalware', 'silver-metalware', 'Sterling silver, silver plate, pewter, copper, and brass items including flatware and hollowware.', '🥄', 3),
  ('Furniture', 'furniture', 'Antique and vintage furniture styles, makers, and identifying characteristics.', '🪑', 4),
  ('Jewelry', 'jewelry', 'Vintage and antique jewelry, costume jewelry, and fine jewelry identification.', '💍', 5),
  ('Textiles & Linens', 'textiles-linens', 'Vintage fabrics, quilts, linens, lace, and textile patterns.', '🧵', 6),
  ('Pottery & Stoneware', 'pottery-stoneware', 'Art pottery, utilitarian stoneware, and American pottery makers.', '🏺', 7),
  ('Toys & Games', 'toys-games', 'Vintage toys, dolls, games, and collectible playthings.', '🎲', 8);
