-- Turns on row level security with no policies, which blocks every role
-- except the tables' owner. The backend connects as the owner, so it's
-- unaffected; this stops hosts that publish tables automatically (such as
-- Supabase's Data API) from exposing them, including password hashes.
ALTER TABLE allowlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE schema_migrations ENABLE ROW LEVEL SECURITY;
