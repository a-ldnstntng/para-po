CREATE TABLE IF NOT EXISTS routes (
  id TEXT PRIMARY KEY,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  raw_text TEXT NOT NULL,
  confirms INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS route_steps (
  id TEXT PRIMARY KEY,
  route_id TEXT NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  mode TEXT CHECK (mode IN ('jeep','tricycle','bus','uv_express','walk','mrt','lrt','pnr','grab')) NOT NULL,
  line_label TEXT,
  landmark TEXT,
  instruction TEXT NOT NULL,
  fare_estimate_php INTEGER,
  notes TEXT,
  lat REAL,
  lng REAL
);
