import crypto from "node:crypto";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { HttpError, badRequest, text, email, password, code, normalizeSchoolId, normalizeName } from "../http.js";
import { hashPassword, verifyPassword, verifyAgainstDummy, randomCode, sha256 } from "../security.js";
import { startSession, endSession, endAllSessions, toUser } from "../sessions.js";

const CODE_MINUTES = 10; // how long an email code works
const CODE_ATTEMPTS = 5; // wrong guesses allowed per code
const RESEND_SECONDS = 60; // wait before another code can be sent
const LOCK_AFTER = 5; // wrong passwords in a row before the account locks
const LOCK_MINUTES = 15;

// Same message for a wrong ID and a wrong password, so the login form can't
// be used to find out which accounts exist.
const WRONG_LOGIN = "Wrong student ID, email, or password.";
const WRONG_CODE = "That code is wrong or has expired. Ask for a new one.";

// Finds an account by student/employee ID or by email.
async function findAccount(db, identifier) {
  const byEmail = identifier.includes("@");
  const { rows } = await db.query(
    `SELECT u.*, a.school_id, a.full_name, a.role, a.status
       FROM users u
       LEFT JOIN allowlist a ON a.id = u.allowlist_id
      WHERE ${byEmail ? "u.email = $1" : "a.school_id = $1"}`,
    [byEmail ? identifier.toLowerCase() : normalizeSchoolId(identifier)]
  );
  return rows[0] || null;
}

function sameHash(a, b) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

// Creates a new email code (replacing unused ones) and returns it.
// owner is { allowlistId } for registration or { userId } for a reset.
async function issueCode(db, purpose, owner, to) {
  const column = owner.allowlistId ? "allowlist_id" : "user_id";
  const ownerId = owner.allowlistId || owner.userId;

  const { rows } = await db.query(
    `SELECT created_at FROM email_codes WHERE ${column} = $1 AND purpose = $2 ORDER BY created_at DESC LIMIT 1`,
    [ownerId, purpose]
  );
  if (rows[0] && Date.now() - rows[0].created_at.getTime() < RESEND_SECONDS * 1000) {
    throw new HttpError(429, "Wait a minute before asking for another code.");
  }

  await db.query(`UPDATE email_codes SET used_at = now() WHERE ${column} = $1 AND purpose = $2 AND used_at IS NULL`, [
    ownerId,
    purpose,
  ]);
  const value = randomCode();
  await db.query(
    `INSERT INTO email_codes (purpose, ${column}, email, code_hash, expires_at)
     VALUES ($1, $2, $3, $4, now() + make_interval(mins => $5))`,
    [purpose, ownerId, to, sha256(value), CODE_MINUTES]
  );
  return value;
}

// Checks a code and marks it used. Wrong guesses are counted, and a code
// stops working after CODE_ATTEMPTS of them.
async function useCode(db, purpose, owner, to, value) {
  const column = owner.allowlistId ? "allowlist_id" : "user_id";
  const ownerId = owner.allowlistId || owner.userId;
  const { rows } = await db.query(
    `SELECT id, code_hash, attempts FROM email_codes
      WHERE ${column} = $1 AND purpose = $2 AND email = $3 AND used_at IS NULL AND expires_at > now()
      ORDER BY created_at DESC LIMIT 1`,
    [ownerId, purpose, to]
  );
  const row = rows[0];
  if (!row || row.attempts >= CODE_ATTEMPTS) throw badRequest(WRONG_CODE);
  if (!sameHash(sha256(value), row.code_hash)) {
    await db.query("UPDATE email_codes SET attempts = attempts + 1 WHERE id = $1", [row.id]);
    throw badRequest(WRONG_CODE);
  }
  const used = await db.query("UPDATE email_codes SET used_at = now() WHERE id = $1 AND used_at IS NULL", [row.id]);
  if (used.rowCount === 0) throw badRequest(WRONG_CODE);
}

export function authRouter({ db, mailer, config }) {
  const router = Router();

  // Per-IP limits on top of the per-account lock.
  const limiter = (limit) =>
    config.rateLimit
      ? rateLimit({
          windowMs: 15 * 60 * 1000,
          limit,
          standardHeaders: "draft-8",
          legacyHeaders: false,
          message: { message: "Too many attempts. Try again in a few minutes." },
        })
      : (req, res, next) => next();

  router.get("/me", (req, res) => {
    if (!req.user) throw new HttpError(401, "Not signed in.");
    res.json({ user: req.user });
  });

  router.post("/login", limiter(30), async (req, res) => {
    const identifier = text(req.body, "identifier", "student ID or email", { max: 254 });
    const pw = typeof req.body?.password === "string" ? req.body.password : "";
    if (!pw) throw badRequest("Enter your password.");

    const account = await findAccount(db, identifier);
    if (!account || pw.length > 128) {
      await verifyAgainstDummy(pw.slice(0, 128));
      throw new HttpError(401, WRONG_LOGIN);
    }
    if (account.locked_until && account.locked_until > new Date()) {
      throw new HttpError(429, `Too many failed attempts. Try again in ${LOCK_MINUTES} minutes.`);
    }

    if (!(await verifyPassword(pw, account.password_hash))) {
      const { rows } = await db.query(
        `UPDATE users SET
           failed_logins = CASE WHEN failed_logins + 1 >= $2 THEN 0 ELSE failed_logins + 1 END,
           locked_until  = CASE WHEN failed_logins + 1 >= $2 THEN now() + make_interval(mins => $3) ELSE locked_until END
         WHERE id = $1
         RETURNING locked_until > now() AS locked`,
        [account.id, LOCK_AFTER, LOCK_MINUTES]
      );
      if (rows[0]?.locked) throw new HttpError(429, `Too many failed attempts. Try again in ${LOCK_MINUTES} minutes.`);
      throw new HttpError(401, WRONG_LOGIN);
    }

    if (!account.is_admin && account.status !== "approved") {
      throw new HttpError(
        403,
        account.status === "blocked"
          ? "Your access has been blocked. Contact the admin."
          : "Your access is waiting for admin approval."
      );
    }

    await db.query("UPDATE users SET failed_logins = 0, locked_until = NULL WHERE id = $1", [account.id]);
    await startSession(db, config, res, account.id);
    res.json({ user: toUser(account) });
  });

  router.post("/logout", async (req, res) => {
    await endSession(db, config, req, res);
    res.status(204).end();
  });

  // Registration step 1: check the allowlist and email a code.
  router.post("/register/start", limiter(10), async (req, res) => {
    const schoolId = normalizeSchoolId(text(req.body, "schoolId", "student or employee ID", { max: 50 }));
    const fullName = text(req.body, "fullName", "full name");
    const to = email(req.body);

    const { rows } = await db.query(
      `SELECT a.*, u.id AS user_id FROM allowlist a LEFT JOIN users u ON u.allowlist_id = a.id WHERE a.school_id = $1`,
      [schoolId]
    );
    const entry = rows[0];
    if (!entry) throw badRequest("This ID isn't on the allowlist. Contact the admin.");
    if (normalizeName(entry.full_name) !== normalizeName(fullName)) {
      throw badRequest("The name doesn't match our records for this ID.");
    }
    if (entry.status === "pending") throw new HttpError(403, "Your ID is waiting for admin approval.");
    if (entry.status === "blocked") throw new HttpError(403, "This ID has been blocked. Contact the admin.");
    if (entry.user_id) throw new HttpError(409, "This ID is already registered. Use Forgot password if it's yours.");

    const taken = await db.query("SELECT 1 FROM users WHERE email = $1", [to]);
    if (taken.rowCount > 0) throw new HttpError(409, "That email is already used by another account.");

    const value = await issueCode(db, "register", { allowlistId: entry.id }, to);
    try {
      await mailer.sendCode(to, value, "register");
    } catch (err) {
      console.error(err);
      throw new HttpError(502, "We couldn't send the email. Check the address and try again.");
    }
    res.json({ message: "We sent a 6-digit code to your email." });
  });

  // Registration step 2: check the code, set the password, and sign in.
  router.post("/register/verify", limiter(20), async (req, res) => {
    const schoolId = normalizeSchoolId(text(req.body, "schoolId", "student or employee ID", { max: 50 }));
    const to = email(req.body);
    const value = code(req.body);
    const pw = password(req.body);

    const { rows } = await db.query(
      `SELECT a.*, u.id AS user_id FROM allowlist a LEFT JOIN users u ON u.allowlist_id = a.id WHERE a.school_id = $1`,
      [schoolId]
    );
    const entry = rows[0];
    if (!entry || entry.status !== "approved" || entry.user_id) throw badRequest(WRONG_CODE);

    await useCode(db, "register", { allowlistId: entry.id }, to, value);

    let user;
    try {
      const inserted = await db.query(
        "INSERT INTO users (allowlist_id, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
        [entry.id, to, await hashPassword(pw)]
      );
      user = inserted.rows[0];
    } catch (err) {
      if (err.code === "23505") throw new HttpError(409, "This ID or email is already registered.");
      throw err;
    }

    await startSession(db, config, res, user.id);
    res.status(201).json({ user: toUser({ ...entry, id: user.id, email: to, is_admin: false }) });
  });

  // Forgot password step 1: email a code. The reply is the same whether or
  // not the account exists.
  router.post("/password/forgot", limiter(10), async (req, res) => {
    const identifier = text(req.body, "identifier", "student ID or email", { max: 254 });
    const account = await findAccount(db, identifier);
    if (account && (account.is_admin || account.status === "approved")) {
      try {
        const value = await issueCode(db, "reset", { userId: account.id }, account.email);
        mailer.sendCode(account.email, value, "reset").catch((err) => console.error(err));
      } catch (err) {
        if (!(err instanceof HttpError)) throw err; // resend cooldown: stay quiet
      }
    }
    res.json({ message: "If this account exists, we sent a code to its email." });
  });

  // Forgot password step 2: check the code and set a new password. Signs the
  // account out everywhere.
  router.post("/password/reset", limiter(20), async (req, res) => {
    const identifier = text(req.body, "identifier", "student ID or email", { max: 254 });
    const value = code(req.body);
    const pw = password(req.body);

    const account = await findAccount(db, identifier);
    if (!account) throw badRequest(WRONG_CODE);
    await useCode(db, "reset", { userId: account.id }, account.email, value);

    await db.query("UPDATE users SET password_hash = $2, failed_logins = 0, locked_until = NULL WHERE id = $1", [
      account.id,
      await hashPassword(pw),
    ]);
    await endAllSessions(db, account.id);
    res.status(204).end();
  });

  return router;
}
