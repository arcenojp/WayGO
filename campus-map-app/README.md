# WayGo Frontend

The campus map, search, wayfinding, and the login, registration and admin
pages. React + Vite, Tailwind CSS and Leaflet. For the project overview, see
the [main README](../README.md); for the API, see [Backend](../Backend/README.md).

---
## Getting Started

Requires Node.js 22 or newer (20.19+ works for the frontend alone).

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

---
## Project Structure

```
public/                 logo
src/
  assets/               floor plan and campus map artwork (SVG)
    photos/             room and building photos (see its README)
  components/           map, floor plan, search and UI components
  data/
    campuses.js         campuses and buildings
    *Floors.js          traced rooms and stairs for each building
    rtsBuildingShapes.js  clickable building shapes on the RTS map
    rtsWalkways.js      walkways and doors for directions on the RTS map
    campusGeo.js        campus outlines on the home map
    searchIndex.js      search
    photos.js           photo loading
  api/                  requests to the backend (client.js, auth.js, admin.js)
  auth/                 login state, AuthProvider, RequireAuth
  pages/                Dashboard, CampusPage, BuildingPage, LoginPage,
                        RegisterPage, ForgotPasswordPage, AdminPage
  utils/                CSV reading for the admin import
  theme.js              colors and room icons
```

---
## Adding Content

**Photos:** see [src/assets/photos/README.md](src/assets/photos/README.md).

**A building's floor plans:**

1. Add one SVG per floor to `src/assets/`.
2. Create `src/data/<building>Floors.js` with each floor's rooms and stairs as
   `[x, y]` polygons in the SVG's pixel space. Stairs on different floors that
   belong to the same staircase share a `group`.
3. Register the floors and artwork in `src/pages/BuildingPage.jsx` (or
   `CampusPage.jsx` for a single-building campus) and set
   `usesFloorPlanArtwork: true` on the building in `src/data/campuses.js`.
4. For an RTS building, add its door to `BUILDING_DOORS` in
   `src/data/rtsWalkways.js` so search can show directions to it. Mark stairs
   students can't use with `staffOnly: true` so directions skip them.

---
## Connecting a backend

The frontend is ready for a login backend. Until one is connected it runs
without login and every page is open, which is how it's deployed now.

**Turning it on:** copy `.env.example` to `.env.local` and set
`VITE_API_URL` to the backend's address (for example `http://localhost:4000`).
On Vercel, add the same variable under Project Settings → Environment
Variables and redeploy. Once it's set, the map pages need a signed-in user,
`/login` shows the login form, and the header has a profile menu with Log out.

**Endpoints the frontend calls** (all JSON; see `src/api/auth.js`):

| Method and path | Body | Success | Failure |
|---|---|---|---|
| `GET /auth/me` | none | `200 { user }` | `401` when not signed in |
| `POST /auth/login` | `{ identifier, password }` | `200 { user }` and sets the session cookie | `401` for a wrong ID or password; other errors as `{ message }` |
| `POST /auth/logout` | none | `204` and clears the session cookie | |

`identifier` is a student ID or an email address. `user` is
`{ id, name, role, studentId?, email? }`, where `role` is `student`,
`faculty`, `staff` or `admin`. Error messages in `{ message }` (for
example "Your account is locked") are shown on the login form.

**Sessions:** the backend keeps the session in an `httpOnly` cookie; the
frontend never stores a token. Every request is sent with
`credentials: "include"`, so the backend must allow the site's origin with
CORS and `Access-Control-Allow-Credentials: true`.

**Deploying with the backend:** browsers like Safari block login cookies from
a different site, so route the API through this site: add a Vercel rewrite
from `/api/:path*` to the backend (before the existing rewrite) and set
`VITE_API_URL=/api`. [Backend/README.md](../Backend/README.md#deploying) has the exact steps.
