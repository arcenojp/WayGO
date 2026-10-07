import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { HttpError, notFound, errorHandler } from "./http.js";
import { userFromRequest } from "./sessions.js";
import { authRouter } from "./routes/auth.js";
import { adminRouter } from "./routes/admin.js";

export function createApp({ db, mailer, config }) {
  const app = express();
  app.disable("x-powered-by");
  if (config.trustProxy) app.set("trust proxy", config.trustProxy);

  app.use(helmet());
  if (config.frontendOrigins.length > 0) {
    app.use(cors({ origin: config.frontendOrigins, credentials: true }));
  }

  // Requests that change something must come from the WayGo site itself (or
  // a listed frontend), so another website can't act with a user's cookie.
  app.use((req, res, next) => {
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
    const origin = req.get("origin");
    if (!origin) return next(); // not sent by a browser page (e.g. curl, server-to-server)
    const sameHost = (() => {
      try {
        return new URL(origin).host === req.get("host");
      } catch {
        return false;
      }
    })();
    if (sameHost || config.frontendOrigins.includes(origin)) return next();
    next(new HttpError(403, "This request isn't allowed from that site."));
  });

  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  // Who's signed in, for every request (null when no one is).
  app.use(async (req, res, next) => {
    req.user = await userFromRequest(db, req);
    next();
  });

  app.get("/health", (req, res) => res.json({ ok: true }));
  app.use("/auth", authRouter({ db, mailer, config }));
  app.use("/admin", adminRouter({ db, config }));

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
