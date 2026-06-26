-- ═══════════════════════════════════════════════════════════
-- AdamSofi — initial schema
-- Run in Supabase SQL editor (or `supabase db push`)
-- ═══════════════════════════════════════════════════════════

-- ── BLOG ARTICLES ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS articles (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  excerpt      TEXT,
  content      TEXT NOT NULL,
  cover_url    TEXT,
  category     TEXT DEFAULT 'Umum',
  tags         TEXT[] DEFAULT '{}',
  status       TEXT DEFAULT 'draft',  -- 'draft' | 'published'
  views        INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS articles_updated_at ON articles;
CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── NEWSLETTER SUBSCRIBERS ─────────────────────────────────
CREATE TABLE IF NOT EXISTS subscribers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email             TEXT NOT NULL UNIQUE,
  name              TEXT,
  status            TEXT DEFAULT 'active',  -- 'active' | 'unsubscribed'
  unsubscribe_token TEXT DEFAULT encode(gen_random_bytes(32), 'hex'),
  subscribed_at     TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at   TIMESTAMPTZ
);

-- ── ORDER INQUIRIES (hubungi form) ─────────────────────────
CREATE TABLE IF NOT EXISTS inquiries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama        TEXT NOT NULL,
  whatsapp    TEXT NOT NULL,
  email       TEXT NOT NULL,
  bisnes      TEXT NOT NULL,
  pakej       TEXT NOT NULL,
  addons      TEXT[] DEFAULT '{}',
  penerangan  TEXT,
  status      TEXT DEFAULT 'new',  -- 'new' | 'contacted' | 'closed'
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── PAGE VIEWS ANALYTICS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS page_views (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page       TEXT NOT NULL,
  slug       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- RLS POLICIES
-- Note: server routes use the SERVICE ROLE key (bypasses RLS) for
-- writes like unsubscribe, view increment, and broadcasts. Public
-- (anon) access is intentionally minimal.
-- ═══════════════════════════════════════════════════════════

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read published" ON articles;
CREATE POLICY "public read published" ON articles
  FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "auth full access articles" ON articles;
CREATE POLICY "auth full access articles" ON articles
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public can subscribe" ON subscribers;
CREATE POLICY "public can subscribe" ON subscribers
  FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "auth read subscribers" ON subscribers;
CREATE POLICY "auth read subscribers" ON subscribers
  FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public submit inquiry" ON inquiries;
CREATE POLICY "public submit inquiry" ON inquiries
  FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "auth manage inquiries" ON inquiries;
CREATE POLICY "auth manage inquiries" ON inquiries
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public track views" ON page_views;
CREATE POLICY "public track views" ON page_views
  FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "auth read views" ON page_views;
CREATE POLICY "auth read views" ON page_views
  FOR SELECT USING (auth.role() = 'authenticated');
