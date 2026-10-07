// Entry point for hosting the API on Vercel as a serverless function.
// Locally, `npm run dev` uses src/server.js instead.
import { loadConfig } from "../src/config.js";
import { createPool } from "../src/db.js";
import { createMailer } from "../src/mailer.js";
import { createApp } from "../src/app.js";

const config = loadConfig();

export default createApp({ db: createPool(config), mailer: createMailer(config), config });
