-- ============================================================
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. Notes
CREATE TABLE IF NOT EXISTS notes (
  id         TEXT    PRIMARY KEY,
  title      TEXT    NOT NULL,
  content    TEXT    NOT NULL,
  color      TEXT    NOT NULL DEFAULT '#5A5272',
  created_at BIGINT  NOT NULL
);
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON notes;
CREATE POLICY "Allow all" ON notes FOR ALL USING (true) WITH CHECK (true);

-- 2. Custom Projects
CREATE TABLE IF NOT EXISTS custom_projects (
  id            TEXT    PRIMARY KEY,
  label         TEXT    NOT NULL,
  description   TEXT    DEFAULT '',
  logo_data_url TEXT    DEFAULT '',
  iframe_url    TEXT    NOT NULL,
  bg            TEXT    NOT NULL DEFAULT '#849C92',
  created_at    BIGINT  NOT NULL
);
ALTER TABLE custom_projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON custom_projects;
CREATE POLICY "Allow all" ON custom_projects FOR ALL USING (true) WITH CHECK (true);

-- 3. Gallery Photos
CREATE TABLE IF NOT EXISTS gallery_photos (
  id           TEXT    PRIMARY KEY,
  src          TEXT    NOT NULL,
  storage_path TEXT,
  description  TEXT,
  created_at   BIGINT  NOT NULL
);
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON gallery_photos;
CREATE POLICY "Allow all" ON gallery_photos FOR ALL USING (true) WITH CHECK (true);
