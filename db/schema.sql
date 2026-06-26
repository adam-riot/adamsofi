-- ═══════════════════════════════════════════════════════════
-- AdamSofi — Neon Postgres schema
-- Run in the Neon SQL editor (or psql) once.
-- Access control is enforced at the app layer (no RLS needed).
-- ═══════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS pgcrypto;  -- gen_random_uuid(), gen_random_bytes()

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
  status       TEXT DEFAULT 'draft',   -- 'draft' | 'published'
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
CREATE INDEX IF NOT EXISTS page_views_created_idx ON page_views (created_at);
