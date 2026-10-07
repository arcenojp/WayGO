import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { startTestServer, client } from "./helpers.js";

let t;
let admin;
const ADMIN_EMAIL = "admin@school.test";
const ADMIN_PASSWORD = "admin-pass-123";

before(async () => {
  t = await startTestServer();
  await t.createAdmin(ADMIN_EMAIL, ADMIN_PASSWORD);
  admin = client(t.baseUrl);
  const res = await admin("POST", "/auth/login", { identifier: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  assert.equal(res.status, 200);
});

after(async () => {
  await t?.close();
});

async function addEntry(entry) {
  const res = await admin("POST", "/admin/allowlist", entry);
  assert.equal(res.status, 201, JSON.stringify(res.body));
  return res.body.entry;
}

async function register(c, { schoolId, fullName, email, password }) {
  const start = await c("POST", "/auth/register/start", { schoolId, fullName, email });
  assert.equal(start.status, 200, JSON.stringify(start.body));
  return c("POST", "/auth/register/verify", { schoolId, email, code: t.lastCode(email), password });
}

test("no session means signed out", async () => {
  const res = await client(t.baseUrl)("GET", "/auth/me");
  assert.equal(res.status, 401);
});

test("admin login sets an httpOnly cookie and /auth/me returns the admin", async () => {
  const c = client(t.baseUrl);
  const wrong = await c("POST", "/auth/login", { identifier: ADMIN_EMAIL, password: "nope-nope-nope" });
  assert.equal(wrong.status, 401);
  assert.equal(wrong.body.message, "Wrong student ID, email, or password.");

  const ok = await c("POST", "/auth/login", { identifier: ADMIN_EMAIL.toUpperCase(), password: ADMIN_PASSWORD });
  assert.equal(ok.status, 200);
  assert.match(ok.setCookie, /HttpOnly/i);
  assert.equal(ok.body.user.role, "admin");

  const me = await c("GET", "/auth/me");
  assert.deepEqual(me.body.user, ok.body.user);
});

test("unknown accounts get the same answer as wrong passwords", async () => {
  const res = await client(t.baseUrl)("POST", "/auth/login", { identifier: "9999-99999", password: "whatever-123" });
  assert.equal(res.status, 401);
  assert.equal(res.body.message, "Wrong student ID, email, or password.");
});

test("admin endpoints need an admin", async () => {
  assert.equal((await client(t.baseUrl)("GET", "/admin/allowlist")).status, 401);
});

test("admin manages the allowlist", async () => {
  const entry = await addEntry({ schoolId: " 2023-00001 ", fullName: "Juan  Dela Cruz", role: "student" });
  assert.equal(entry.schoolId, "2023-00001");
  assert.equal(entry.fullName, "Juan Dela Cruz");
  assert.equal(entry.status, "approved");

  const dup = await admin("POST", "/admin/allowlist", { schoolId: "2023-00001", fullName: "Someone Else" });
  assert.equal(dup.status, 409);
  const badRole = await admin("POST", "/admin/allowlist", { schoolId: "X-1", fullName: "A B", role: "janitor" });
  assert.equal(badRole.status, 400);

  const imported = await admin("POST", "/admin/allowlist/import", {
    entries: [
      { schoolId: "2024-10001", fullName: "Liza Ramos" },
      { schoolId: "2023-00001", fullName: "Juan Dela Cruz" },
      { schoolId: "", fullName: "No Id" },
      { schoolId: "EMP-0007", fullName: "Prof Reyes", role: "faculty" },
    ],
  });
  assert.equal(imported.status, 200);
  assert.deepEqual(
    { added: imported.body.added, skipped: imported.body.skipped, errorRows: imported.body.errors.map((e) => e.row) },
    { added: 2, skipped: 1, errorRows: [3] }
  );

  const search = await admin("GET", "/admin/allowlist?q=ramos");
  assert.equal(search.body.total, 1);
  assert.equal(search.body.entries[0].schoolId, "2024-10001");
});

test("registration checks the allowlist, name and status", async () => {
  await addEntry({ schoolId: "2023-00456", fullName: "María Santos" });
  await addEntry({ schoolId: "2024-00111", fullName: "Ana Lim", status: "pending" });
  const c = client(t.baseUrl);
  const start = (body) => c("POST", "/auth/register/start", body);

  assert.equal((await start({ schoolId: "1111-11111", fullName: "Nobody", email: "n@x.test" })).status, 400);
  const wrongName = await start({ schoolId: "2023-00456", fullName: "Maria Cruz", email: "m@x.test" });
  assert.equal(wrongName.body.message, "The name doesn't match our records for this ID.");
  assert.equal((await start({ schoolId: "2024-00111", fullName: "Ana Lim", email: "a@x.test" })).status, 403);

  // Case, spacing and accents don't matter.
  const ok = await start({ schoolId: "2023-00456", fullName: "maria   SANTOS", email: "Maria@School.test" });
  assert.equal(ok.status, 200);
  assert.equal(t.mails.at(-1).to, "maria@school.test");
  assert.equal(t.mails.at(-1).purpose, "register");

  const again = await start({ schoolId: "2023-00456", fullName: "María Santos", email: "maria@school.test" });
  assert.equal(again.status, 429, "a new code needs a short wait");
});

test("registration with a code creates the account and signs in", async () => {
  const c = client(t.baseUrl);
  const verify = (code) =>
    c("POST", "/auth/register/verify", { schoolId: "2023-00456", email: "maria@school.test", code, password: "maria-pass-1" });

  const realCode = t.lastCode("maria@school.test");
  const wrongCode = realCode === "000000" ? "111111" : "000000";
  assert.equal((await verify(wrongCode)).status, 400);
  const short = await c("POST", "/auth/register/verify", {
    schoolId: "2023-00456",
    email: "maria@school.test",
    code: realCode,
    password: "short",
  });
  assert.equal(short.status, 400);

  const ok = await verify(realCode);
  assert.equal(ok.status, 201, JSON.stringify(ok.body));
  assert.deepEqual(ok.body.user, {
    id: ok.body.user.id,
    name: "María Santos",
    role: "student",
    studentId: "2023-00456",
    email: "maria@school.test",
  });
  assert.equal((await c("GET", "/auth/me")).body.user.studentId, "2023-00456");

  assert.equal((await verify(realCode)).status, 400, "a code works once");
  const twice = await c("POST", "/auth/register/start", {
    schoolId: "2023-00456",
    fullName: "María Santos",
    email: "other@school.test",
  });
  assert.equal(twice.status, 409);
});

test("passwords and session tokens are stored hashed", async () => {
  const { rows } = await t.pool.query("SELECT password_hash FROM users WHERE email = 'maria@school.test'");
  assert.match(rows[0].password_hash, /^scrypt\$/);
  assert.ok(!rows[0].password_hash.includes("maria-pass-1"));

  const login = await client(t.baseUrl)("POST", "/auth/login", { identifier: "2023-00456", password: "maria-pass-1" });
  const token = login.setCookie.split(";")[0].split("=")[1];
  const stored = await t.pool.query("SELECT 1 FROM sessions WHERE token_hash = $1", [token]);
  assert.equal(stored.rowCount, 0, "the raw token is never stored");
});

test("login works with the student ID or the email", async () => {
  const byId = await client(t.baseUrl)("POST", "/auth/login", { identifier: " 2023-00456 ", password: "maria-pass-1" });
  const byEmail = await client(t.baseUrl)("POST", "/auth/login", { identifier: "MARIA@school.test", password: "maria-pass-1" });
  assert.equal(byId.status, 200);
  assert.equal(byEmail.status, 200);
});

test("students can't use admin endpoints", async () => {
  const c = client(t.baseUrl);
  await c("POST", "/auth/login", { identifier: "2023-00456", password: "maria-pass-1" });
  assert.equal((await c("GET", "/admin/allowlist")).status, 403);
});

test("five wrong passwords lock the account for a while", async () => {
  const c = client(t.baseUrl);
  const attempt = (password) => c("POST", "/auth/login", { identifier: "2023-00456", password });
  for (let i = 0; i < 4; i++) assert.equal((await attempt("wrong-password")).status, 401);
  assert.equal((await attempt("wrong-password")).status, 429);
  assert.equal((await attempt("maria-pass-1")).status, 429, "even the right password waits");

  await t.pool.query("UPDATE users SET locked_until = now() - interval '1 second' WHERE email = 'maria@school.test'");
  assert.equal((await attempt("maria-pass-1")).status, 200);
});

test("forgot password resets it and signs out every session", async () => {
  const old = client(t.baseUrl);
  await old("POST", "/auth/login", { identifier: "2023-00456", password: "maria-pass-1" });

  const before = t.mails.length;
  const unknown = await client(t.baseUrl)("POST", "/auth/password/forgot", { identifier: "0000-00000" });
  assert.equal(unknown.status, 200);
  assert.equal(t.mails.length, before, "no email for an unknown account");

  const c = client(t.baseUrl);
  const forgot = await c("POST", "/auth/password/forgot", { identifier: "2023-00456" });
  assert.equal(forgot.body.message, unknown.body.message, "same reply either way");
  const resetCode = t.lastCode("maria@school.test");
  assert.equal(t.mails.at(-1).purpose, "reset");

  const reset = await c("POST", "/auth/password/reset", { identifier: "2023-00456", code: resetCode, password: "new-pass-456" });
  assert.equal(reset.status, 204);
  assert.equal((await old("GET", "/auth/me")).status, 401, "old session ended");

  const login = (password) => client(t.baseUrl)("POST", "/auth/login", { identifier: "2023-00456", password });
  assert.equal((await login("maria-pass-1")).status, 401);
  assert.equal((await login("new-pass-456")).status, 200);
});

test("a code stops working after five wrong tries", async () => {
  await t.pool.query("UPDATE email_codes SET created_at = created_at - interval '2 minutes'");
  const c = client(t.baseUrl);
  await c("POST", "/auth/password/forgot", { identifier: "maria@school.test" });
  const real = t.lastCode("maria@school.test");
  const wrong = real === "123456" ? "654321" : "123456";
  for (let i = 0; i < 5; i++) {
    await c("POST", "/auth/password/reset", { identifier: "2023-00456", code: wrong, password: "x-pass-0000" });
  }
  const res = await c("POST", "/auth/password/reset", { identifier: "2023-00456", code: real, password: "x-pass-0000" });
  assert.equal(res.status, 400);
});

test("blocking someone signs them out and stops their login", async () => {
  const student = client(t.baseUrl);
  await student("POST", "/auth/login", { identifier: "2023-00456", password: "new-pass-456" });
  const entry = (await admin("GET", "/admin/allowlist?q=2023-00456")).body.entries[0];
  assert.equal(entry.registered, true);

  const blocked = await admin("PATCH", `/admin/allowlist/${entry.id}`, { status: "blocked" });
  assert.equal(blocked.body.entry.status, "blocked");
  assert.equal((await student("GET", "/auth/me")).status, 401);
  const login = await student("POST", "/auth/login", { identifier: "2023-00456", password: "new-pass-456" });
  assert.equal(login.status, 403);
  assert.equal(login.body.message, "Your access has been blocked. Contact the admin.");

  await admin("PATCH", `/admin/allowlist/${entry.id}`, { status: "approved" });
  assert.equal((await student("POST", "/auth/login", { identifier: "2023-00456", password: "new-pass-456" })).status, 200);
});

test("resetting a registration lets the person register again", async () => {
  const entry = (await admin("GET", "/admin/allowlist?q=2023-00456")).body.entries[0];
  assert.equal((await admin("POST", `/admin/allowlist/${entry.id}/reset-registration`)).status, 204);
  assert.equal((await admin("GET", "/admin/allowlist?q=2023-00456")).body.entries[0].registered, false);

  await t.pool.query("UPDATE email_codes SET created_at = created_at - interval '2 minutes'");
  const res = await register(client(t.baseUrl), {
    schoolId: "2023-00456",
    fullName: "Maria Santos",
    email: "maria.new@school.test",
    password: "fresh-pass-789",
  });
  assert.equal(res.status, 201, JSON.stringify(res.body));
});

test("logout ends the session and clears the cookie", async () => {
  const c = client(t.baseUrl);
  await c("POST", "/auth/login", { identifier: "2023-00456", password: "fresh-pass-789" });
  const out = await c("POST", "/auth/logout");
  assert.equal(out.status, 204);
  assert.match(out.setCookie, /waygo_session=;/);
  assert.equal((await c("GET", "/auth/me")).status, 401);
});

test("requests from other websites are refused", async () => {
  const c = client(t.baseUrl);
  const evil = await c("POST", "/auth/login", { identifier: ADMIN_EMAIL, password: ADMIN_PASSWORD }, { Origin: "https://evil.example" });
  assert.equal(evil.status, 403);
  const allowed = await c("POST", "/auth/login", { identifier: ADMIN_EMAIL, password: ADMIN_PASSWORD }, { Origin: "http://localhost:5173" });
  assert.equal(allowed.status, 200);
});

test("stats and delete", async () => {
  const stats = await admin("GET", "/admin/stats");
  assert.deepEqual(stats.body, { total: 5, registered: 1, pending: 1, blocked: 0 });
  const entry = (await admin("GET", "/admin/allowlist?q=EMP-0007")).body.entries[0];
  assert.equal((await admin("DELETE", `/admin/allowlist/${entry.id}`)).status, 204);
  assert.equal((await admin("GET", "/admin/stats")).body.total, 4);
});
