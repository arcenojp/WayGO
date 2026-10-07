// npm run create-admin -- <email> "<Full Name>"
// Creates an admin account, or sets a new password for an existing admin.
// Asks for the password (hidden), or reads it from ADMIN_PASSWORD.
import readline from "node:readline";
import { loadConfig } from "../src/config.js";
import { createPool } from "../src/db.js";
import { hashPassword, PASSWORD_MIN, PASSWORD_MAX } from "../src/security.js";

function askHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => {
      if (s.startsWith(question)) process.stdout.write(s);
    };
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
  });
}

const [emailArg, ...nameParts] = process.argv.slice(2);
const email = (emailArg || "").trim().toLowerCase();
const name = nameParts.join(" ").trim();
if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
  console.error('Usage: npm run create-admin -- <email> "<Full Name>"');
  process.exit(1);
}

const password = process.env.ADMIN_PASSWORD || (await askHidden("Password for the admin account: "));
if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
  console.error(`Use ${PASSWORD_MIN} to ${PASSWORD_MAX} characters for the password.`);
  process.exit(1);
}

const pool = createPool(loadConfig());
try {
  const existing = (await pool.query("SELECT id, is_admin FROM users WHERE email = $1", [email])).rows[0];
  const hash = await hashPassword(password);
  if (existing && !existing.is_admin) {
    console.error("That email belongs to a student or staff account, not an admin.");
    process.exitCode = 1;
  } else if (existing) {
    await pool.query(
      "UPDATE users SET password_hash = $2, name = COALESCE(NULLIF($3, ''), name), failed_logins = 0, locked_until = NULL WHERE id = $1",
      [existing.id, hash, name]
    );
    console.log(`Updated the admin account ${email}.`);
  } else {
    if (!name) {
      console.error('Add the admin\'s name: npm run create-admin -- <email> "<Full Name>"');
      process.exitCode = 1;
    } else {
      await pool.query("INSERT INTO users (is_admin, name, email, password_hash) VALUES (true, $1, $2, $3)", [
        name,
        email,
        hash,
      ]);
      console.log(`Created the admin account ${email}.`);
    }
  }
} finally {
  await pool.end();
}
