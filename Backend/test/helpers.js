// Starts a throwaway PostgreSQL and the app for tests.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import EmbeddedPostgres from "embedded-postgres";
import { createPool } from "../src/db.js";
import { runMigrations } from "../src/migrate.js";
import { createApp } from "../src/app.js";
import { hashPassword } from "../src/security.js";

export async function startTestServer() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "waygo-test-"));
  const port = 20000 + Math.floor(Math.random() * 20000);
  const pg = new EmbeddedPostgres({
    databaseDir: path.join(dir, "db"),
    user: "postgres",
    password: "test",
    port,
    persistent: false,
    onLog: () => {},
  });
  await pg.initialise();
  await pg.start();
  await pg.createDatabase("waygo_test");

  const pool = createPool({ databaseUrl: `postgres://postgres:test@localhost:${port}/waygo_test` });
  await runMigrations(pool);

  // Captures sent codes instead of emailing them.
  const mails = [];
  const mailer = { sendCode: async (to, code, purpose) => void mails.push({ to, code, purpose }) };
  const config = {
    production: false,
    frontendOrigins: ["http://localhost:5173"],
    sessionDays: 7,
    cookieSameSite: "lax",
    cookieSecure: false,
    trustProxy: 0,
    rateLimit: false,
  };
  const app = createApp({ db: pool, mailer, config });
  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  const baseUrl = `http://localhost:${server.address().port}`;

  return {
    baseUrl,
    pool,
    mails,
    lastCode: (to) => [...mails].reverse().find((m) => m.to === to)?.code,
    async createAdmin(email, password) {
      await pool.query("INSERT INTO users (is_admin, name, email, password_hash) VALUES (true, 'Test Admin', $1, $2)", [
        email,
        await hashPassword(password),
      ]);
    },
    async close() {
      await new Promise((resolve) => server.close(resolve));
      await pool.end();
      await pg.stop();
      fs.rmSync(dir, { recursive: true, force: true });
    },
  };
}

// A browser-like client that keeps the session cookie between requests.
export function client(baseUrl) {
  let cookie = "";
  return async function request(method, url, body, headers = {}) {
    const res = await fetch(baseUrl + url, {
      method,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(cookie ? { Cookie: cookie } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
      const pair = setCookie.split(";")[0];
      cookie = pair.endsWith("=") ? "" : pair;
    }
    const text = await res.text();
    return { status: res.status, body: text ? JSON.parse(text) : null, setCookie };
  };
}
