import crypto from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(crypto.scrypt);

// Passwords are hashed with scrypt (built into Node) and a random salt.
// Stored as "scrypt$<salt>$<hash>", both base64.
const KEY_LENGTH = 64;

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = await scrypt(password, salt, KEY_LENGTH);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export async function verifyPassword(password, stored) {
  const [scheme, saltB64, hashB64] = String(stored).split("$");
  if (scheme !== "scrypt" || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64");
  const actual = await scrypt(password, Buffer.from(saltB64, "base64"), expected.length);
  return crypto.timingSafeEqual(actual, expected);
}

// A hash compared against when the account doesn't exist, so a wrong ID
// takes as long as a wrong password and timing doesn't reveal accounts.
let dummyHash;
export async function verifyAgainstDummy(password) {
  dummyHash ||= await hashPassword("not-a-real-password");
  await verifyPassword(password, dummyHash);
  return false;
}

export const randomToken = () => crypto.randomBytes(32).toString("base64url");

export const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");

// Six-digit email code.
export const randomCode = () => String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 128;
