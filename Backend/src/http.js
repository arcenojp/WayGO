// Errors with an HTTP status and a message safe to show users.
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const badRequest = (message) => new HttpError(400, message);

// Reads a required string field from a JSON body, trimmed.
export function text(body, field, label, { max = 200 } = {}) {
  const value = typeof body?.[field] === "string" ? body[field].trim() : "";
  if (!value) throw badRequest(`Enter your ${label}.`);
  if (value.length > max) throw badRequest(`${label[0].toUpperCase()}${label.slice(1)} is too long.`);
  return value;
}

export function email(body, field = "email") {
  const value = text(body, field, "email address", { max: 254 }).toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) throw badRequest("Enter a valid email address.");
  return value;
}

export function password(body, field = "password") {
  const value = typeof body?.[field] === "string" ? body[field] : "";
  if (value.length < 8) throw badRequest("Use at least 8 characters for your password.");
  if (value.length > 128) throw badRequest("Use 128 characters or fewer for your password.");
  return value;
}

export function code(body, field = "code") {
  const value = text(body, field, "6-digit code", { max: 20 }).replace(/\s/g, "");
  if (!/^\d{6}$/.test(value)) throw badRequest("Enter the 6-digit code from your email.");
  return value;
}

// Student and employee IDs are compared trimmed and uppercase.
export const normalizeSchoolId = (value) => value.trim().toUpperCase();

// Names match ignoring case, extra spaces and accents (so "Arceño" = "Arceno").
export const normalizeName = (value) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function notFound(req, res) {
  res.status(404).json({ message: "Not found" });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) return res.status(err.status).json({ message: err.message });
  if (err.type === "entity.parse.failed") return res.status(400).json({ message: "The request body isn't valid JSON." });
  if (err.type === "entity.too.large") return res.status(413).json({ message: "The request is too large." });
  console.error(err);
  res.status(500).json({ message: "Something went wrong. Try again." });
}
