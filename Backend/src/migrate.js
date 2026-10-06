import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { transaction } from "./db.js";

const MIGRATIONS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "migrations");

// Applies migrations/*.sql in name order, each once, and records them in
// schema_migrations. Returns the names applied this time.
export async function runMigrations(pool) {
  await pool.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    name text PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now()
  )`);
  const done = new Set((await pool.query("SELECT name FROM schema_migrations")).rows.map((r) => r.name));
  const files = (await fs.readdir(MIGRATIONS_DIR)).filter((f) => f.endsWith(".sql")).sort();

  const applied = [];
  for (const file of files) {
    if (done.has(file)) continue;
    const sql = await fs.readFile(path.join(MIGRATIONS_DIR, file), "utf8");
    await transaction(pool, async (client) => {
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [file]);
    });
    applied.push(file);
  }
  return applied;
}
