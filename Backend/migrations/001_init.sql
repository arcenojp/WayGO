-- People allowed to register: students, faculty and staff, added by an admin.
-- school_id is a student or employee ID, stored trimmed and uppercase.
CREATE TABLE allowlist (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  school_id   text NOT NULL UNIQUE,
  full_name   text NOT NULL,
  role        text NOT NULL CHECK (role IN ('student', 'faculty', 'staff')),
  status      text NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'blocked')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Accounts. A member account belongs to one allowlist entry and takes its
-- name and role from it; an admin account has no allowlist entry.
CREATE TABLE users (
  id             bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  allowlist_id   bigint UNIQUE REFERENCES allowlist (id) ON DELETE CASCADE,
  is_admin       boolean NOT NULL DEFAULT false,
  name           text,
  email          text NOT NULL UNIQUE,  -- stored lowercase
  password_hash  text NOT NULL,
  failed_logins  integer NOT NULL DEFAULT 0,
  locked_until   timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  CHECK (is_admin = (allowlist_id IS NULL)),
  CHECK (NOT is_admin OR name IS NOT NULL)
);

-- Signed-in sessions. Only a hash of the cookie's token is stored, so a
-- leaked database can't be used to sign in.
CREATE TABLE sessions (
  token_hash  text PRIMARY KEY,
  user_id     bigint NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  expires_at  timestamptz NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX sessions_user_id ON sessions (user_id);

-- One-time email codes. "register" codes belong to an allowlist entry (no
-- account yet); "reset" codes belong to an account. Codes are stored hashed.
CREATE TABLE email_codes (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  purpose       text NOT NULL CHECK (purpose IN ('register', 'reset')),
  allowlist_id  bigint REFERENCES allowlist (id) ON DELETE CASCADE,
  user_id       bigint REFERENCES users (id) ON DELETE CASCADE,
  email         text NOT NULL,
  code_hash     text NOT NULL,
  attempts      integer NOT NULL DEFAULT 0,
  expires_at    timestamptz NOT NULL,
  used_at       timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  CHECK ((purpose = 'register') = (allowlist_id IS NOT NULL AND user_id IS NULL)),
  CHECK ((purpose = 'reset') = (user_id IS NOT NULL AND allowlist_id IS NULL))
);
CREATE INDEX email_codes_allowlist ON email_codes (allowlist_id) WHERE allowlist_id IS NOT NULL;
CREATE INDEX email_codes_user ON email_codes (user_id) WHERE user_id IS NOT NULL;
