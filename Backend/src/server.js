import { loadConfig } from "./config.js";
import { createPool } from "./db.js";
import { createMailer } from "./mailer.js";
import { createApp } from "./app.js";

const config = loadConfig();
const db = createPool(config);
const app = createApp({ db, mailer: createMailer(config), config });

const server = app.listen(config.port, () => {
  console.log(`WayGo backend listening on http://localhost:${config.port}`);
  if (!config.smtp) console.log("No SMTP settings: email codes will be printed here instead of sent.");
});

function shutdown() {
  server.close(() => db.end().then(() => process.exit(0)));
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
