-- Marks allowlist entries that people added themselves by signing up (rather
-- than an admin adding them). Until such a person finishes registering they
-- can correct the name they typed; names an admin entered or edited must
-- match.
ALTER TABLE allowlist ADD COLUMN self_added boolean NOT NULL DEFAULT false;
