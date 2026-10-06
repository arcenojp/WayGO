// npm run migrate: creates or updates the database tables.
import { loadConfig } from "../src/config.js";
import { createPool } from "../src/db.js";
import { runMigrations } from "../src/migrate.js";

const pool = createPool(loadConfig());
try {
  const applied = await runMigrations(pool);
  console.log(applied.length ? `Applied: ${applied.join(", ")}` : "Database is up to date.");
} finally {
  await pool.end();
}
