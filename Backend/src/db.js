import pg from "pg";

// Bigint ids come back from PostgreSQL as strings; ours fit in a JS number.
pg.types.setTypeParser(pg.types.builtins.INT8, Number);

export function createPool({ databaseUrl, databaseSsl }) {
  return new pg.Pool({
    connectionString: databaseUrl,
    ssl: databaseSsl ? { rejectUnauthorized: false } : undefined,
    max: 10,
  });
}

// Runs fn(client) inside a transaction; rolls back if it throws.
export async function transaction(pool, fn) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
