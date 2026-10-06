// Settings from environment variables (see .env.example).

function bool(value, fallback = false) {
  if (value === undefined || value === "") return fallback;
  return ["1", "true", "yes"].includes(String(value).toLowerCase());
}

export function loadConfig(env = process.env) {
  const production = env.NODE_ENV === "production";
  const config = {
    production,
    port: Number(env.PORT) || 4000,
    frontendOrigins: (env.FRONTEND_ORIGINS || "")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean),
    databaseUrl: env.DATABASE_URL,
    databaseSsl: bool(env.DATABASE_SSL),
    sessionDays: Number(env.SESSION_DAYS) || 7,
    cookieSameSite: (env.COOKIE_SAMESITE || "lax").toLowerCase(),
    // Browsers only accept SameSite=None cookies over HTTPS.
    cookieSecure: production || (env.COOKIE_SAMESITE || "").toLowerCase() === "none",
    trustProxy: Number(env.TRUST_PROXY) || 0,
    smtp: env.SMTP_HOST
      ? {
          host: env.SMTP_HOST,
          port: Number(env.SMTP_PORT) || 465,
          secure: (Number(env.SMTP_PORT) || 465) === 465,
          auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
        }
      : null,
    mailFrom: env.MAIL_FROM || "WayGo <no-reply@example.com>",
    rateLimit: true,
  };

  if (!config.databaseUrl) throw new Error("DATABASE_URL is not set. Copy .env.example to .env.");
  if (!["lax", "strict", "none"].includes(config.cookieSameSite)) {
    throw new Error("COOKIE_SAMESITE must be lax, strict or none.");
  }
  if (production && !config.smtp) {
    throw new Error("SMTP_HOST is required in production so users receive their codes.");
  }
  return config;
}
