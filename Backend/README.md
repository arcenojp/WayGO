# WayGo Backend

Login, registration and admin API for the WayGo campus map (see the
[main README](../README.md) for the whole project). Only people on
the school's allowlist (students, faculty and staff, added by an admin) can
create an account, and every account is verified with a code sent to its
email.

**Stack:** Node.js 22, Express 5, PostgreSQL.

---
## Getting Started

You don't need to install PostgreSQL: `npm run db:local` runs a local copy.

```bash
npm install
cp .env.example .env        # on Windows: copy .env.example .env
npm run db:local            # terminal 1: keep running
npm run migrate             # terminal 2: creates the tables
npm run create-admin -- admin@school.edu.ph "Your Name"
npm run dev                 # API on http://localhost:4000
```

Then run the frontend with `VITE_API_URL=http://localhost:4000` in its
`.env.local`. Without SMTP settings, email codes are printed in the backend's
terminal instead of being sent.

| Command | What it does |
|---|---|
| `npm run dev` | Starts the API and restarts it when code changes |
| `npm start` | Starts the API (for hosting) |
| `npm run migrate` | Creates or updates the database tables |
| `npm run create-admin -- <email> "<Name>"` | Creates an admin, or sets a new password for one |
| `npm run db:local` | Runs PostgreSQL on this computer for development |
| `npm test` | Runs the API tests against a throwaway database |

---
## How It Works

**Registration (two steps)**
1. The person enters their student or employee ID, full name and email. The ID
   must be on the allowlist and approved, and the name must match the record
   (case, spacing and accents are ignored). A 6-digit code is emailed.
2. They enter the code and choose a password. The account is created and
   they're signed in.

**Login:** student ID or email, plus password. Students, faculty, staff and
admins all use the same form; the account's role decides what they can do.

**Forgot password:** a code is sent to the account's email; entering it sets a
new password and signs the account out on every device.

**Admins** manage the allowlist: add people one at a time or import a list,
approve, block (which signs the person out at once), reset a registration so
the person can register again, or remove them.

---
## API

All requests and replies are JSON. Errors reply `{ message }`, written to be
shown to users.

| Method and path | Body | Reply |
|---|---|---|
| `GET /auth/me` | | `{ user }`, or 401 when signed out |
| `POST /auth/login` | `{ identifier, password }` | `{ user }` and sets the session cookie |
| `POST /auth/logout` | | 204 and clears the cookie |
| `POST /auth/register/start` | `{ schoolId, fullName, email }` | `{ message }`; emails a code |
| `POST /auth/register/verify` | `{ schoolId, email, code, password }` | 201 `{ user }`; signs in |
| `POST /auth/password/forgot` | `{ identifier }` | `{ message }` (same reply whether or not the account exists) |
| `POST /auth/password/reset` | `{ identifier, code, password }` | 204 |
| `GET /admin/stats` | | `{ total, registered, pending, blocked }` |
| `GET /admin/allowlist?q=&status=&limit=&offset=` | | `{ entries, total }` |
| `POST /admin/allowlist` | `{ schoolId, fullName, role?, status? }` | 201 `{ entry }` |
| `POST /admin/allowlist/import` | `{ entries: [{ schoolId, fullName, role? }], status? }` | `{ added, skipped, errors }` |
| `PATCH /admin/allowlist/:id` | `{ fullName?, role?, status? }` | `{ entry }` |
| `POST /admin/allowlist/:id/reset-registration` | | 204 |
| `DELETE /admin/allowlist/:id` | | 204 |

`user` is `{ id, name, role, studentId?, email }` with `role` one of `student`,
`faculty`, `staff` or `admin`. Allowlist `role` is `student`, `faculty` or
`staff`; `status` is `pending`, `approved` or `blocked`. `/admin` routes need
an admin account.

---
## Security

- **Passwords** are hashed with scrypt and a random salt; they're never stored
  or logged in plain text.
- **Sessions** use a random token in an `httpOnly` cookie, which page scripts
  can't read. The database stores only a hash of the token, and sessions
  expire after `SESSION_DAYS`.
- **Email codes** are stored hashed, expire after 10 minutes, stop working
  after 5 wrong tries, and can be re-sent once a minute.
- **Five wrong passwords** in a row lock the account for 15 minutes, and each
  IP address has a limit on login and code requests.
- **Login doesn't reveal accounts:** a wrong ID and a wrong password get the
  same message and take the same time.
- **Other websites can't act for a signed-in user:** requests that change
  data must come from the WayGo site or an address in `FRONTEND_ORIGINS`.
- **SQL** always uses parameters, never text pasted into queries.
- Security headers come from Helmet.

---
## Deploying

1. **Database:** create a PostgreSQL database (Neon, Render or Supabase all
   have free tiers). Set `DATABASE_URL` and `DATABASE_SSL=true`.
2. **API:** deploy to a Node host such as Render or Railway. Connect the
   GitHub repo and set the **root directory** to `Backend` (the frontend is in
   `campus-map-app` in the same repo), with `npm install` as the build command
   and `npm start` as the start command.
   Set the variables from `.env.example`, with `NODE_ENV=production`,
   `TRUST_PROXY=1`, your SMTP settings, and `FRONTEND_ORIGINS` set to the
   site's address (e.g. `https://way-go-seven.vercel.app`). Then run
   `npm run migrate` and `npm run create-admin` once from the host's shell.
3. **Frontend:** send `/api` to the backend through Vercel, so the site and
   API share an address and the login cookie works in every browser (Safari
   and others block cookies from a different site). In the frontend's
   `vercel.json`, add this rewrite **before** the existing one:

   ```json
   { "source": "/api/:path*", "destination": "https://YOUR-BACKEND-HOST/:path*" }
   ```

   Then set `VITE_API_URL=/api` in Vercel's environment variables and redeploy.
