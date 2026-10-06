// npm run db:local: runs PostgreSQL on this computer for development, with
// no install needed. Data is kept in .local-db/ between runs. Uses the
// port, user, password and database name from DATABASE_URL in .env.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import EmbeddedPostgres from "embedded-postgres";

const url = new URL(process.env.DATABASE_URL || "postgres://postgres:waygo-local@localhost:5433/waygo");
if (!["localhost", "127.0.0.1"].includes(url.hostname)) {
  console.error("DATABASE_URL points to another computer. db:local only runs a database on this one.");
  process.exit(1);
}

const dataDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".local-db");
const firstRun = !fs.existsSync(dataDir);
const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: decodeURIComponent(url.username || "postgres"),
  password: decodeURIComponent(url.password || "postgres"),
  port: Number(url.port) || 5432,
  persistent: true,
  onLog: () => {},
});

if (firstRun) await pg.initialise();
await pg.start();
if (firstRun) await pg.createDatabase(url.pathname.slice(1) || "waygo");

console.log(`Local database running on port ${url.port}. Press Ctrl+C to stop.`);
if (firstRun) console.log("First run: now run `npm run migrate` in another terminal to create the tables.");

const stop = async () => {
  await pg.stop();
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
