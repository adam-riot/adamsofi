-- ═══════════════════════════════════════════════════════════
-- AdamSofi - Neon Postgres schema
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
  lang         TEXT NOT NULL DEFAULT 'ms',  -- 'ms' | 'en' | 'zh'
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

-- ── EBOOKS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ebooks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  description  TEXT,
  cover_url    TEXT,
  file_url     TEXT NOT NULL,        -- hosted PDF, pasted by admin (Vercel Blob / Drive / etc)
  price        INTEGER NOT NULL,     -- price in sen (RM29.00 = 2900), matches Billplz's cent-based amount
  status       TEXT DEFAULT 'draft', -- 'draft' | 'published'
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS ebooks_updated_at ON ebooks;
CREATE TRIGGER ebooks_updated_at
  BEFORE UPDATE ON ebooks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── EBOOK ORDERS (Billplz) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS ebook_orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ebook_id        UUID NOT NULL REFERENCES ebooks(id),
  buyer_name      TEXT NOT NULL,
  buyer_email     TEXT NOT NULL,
  buyer_phone     TEXT,
  amount          INTEGER NOT NULL,       -- sen, snapshot of ebooks.price at purchase time
  status          TEXT DEFAULT 'pending', -- 'pending' | 'paid' | 'failed'
  billplz_bill_id TEXT UNIQUE,
  download_token  TEXT DEFAULT encode(gen_random_bytes(32), 'hex'),
  delivered_file_path TEXT, -- per-buyer watermarked copy (private store); falls back to ebooks.file_url if null
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  paid_at         TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS ebook_orders_bill_idx ON ebook_orders (billplz_bill_id);

ALTER TABLE ebook_orders ADD COLUMN IF NOT EXISTS delivered_file_path TEXT;
