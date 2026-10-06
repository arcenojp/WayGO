import { randomToken, sha256 } from "./security.js";

export const COOKIE_NAME = "waygo_session";

function cookieOptions(config) {
  return {
    httpOnly: true, // page scripts can't read it
    secure: config.cookieSecure,
    sameSite: config.cookieSameSite,
    path: "/",
  };
}

// Creates a session for the user and sets the cookie on the response.
export async function startSession(db, config, res, userId) {
  const token = randomToken();
  const expiresAt = new Date(Date.now() + config.sessionDays * 24 * 60 * 60 * 1000);
  await db.query("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, $3)", [
    sha256(token),
    userId,
    expiresAt,
  ]);
  res.cookie(COOKIE_NAME, token, { ...cookieOptions(config), expires: expiresAt });
}

export async function endSession(db, config, req, res) {
  const token = req.cookies?.[COOKIE_NAME];
  if (token) await db.query("DELETE FROM sessions WHERE token_hash = $1", [sha256(token)]);
  res.clearCookie(COOKIE_NAME, cookieOptions(config));
}

// Signs the user out everywhere, e.g. after a password reset.
export const endAllSessions = (db, userId) => db.query("DELETE FROM sessions WHERE user_id = $1", [userId]);

// The user behind the request's cookie, or null. Blocked members and
// expired sessions count as signed out.
export async function userFromRequest(db, req) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  const { rows } = await db.query(
    `SELECT u.id, u.is_admin, u.name, u.email, a.school_id, a.full_name, a.role, a.status
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       LEFT JOIN allowlist a ON a.id = u.allowlist_id
      WHERE s.token_hash = $1 AND s.expires_at > now()`,
    [sha256(token)]
  );
  const row = rows[0];
  if (!row || (!row.is_admin && row.status !== "approved")) return null;
  return toUser(row);
}

// The user object sent to the frontend (see the frontend's src/api/auth.js).
export function toUser(row) {
  return row.is_admin
    ? { id: row.id, name: row.name, role: "admin", email: row.email }
    : { id: row.id, name: row.full_name, role: row.role, studentId: row.school_id, email: row.email };
}
