# WayGO - Campus Interactive Map and Wayfinding System
---
## Overview

WayGo is a web app that helps students, visitors, and staff find their way around a school with multiple physically separate campuses. Open one dashboard, see every campus on a real map, drill into a campus to see its buildings, and drill into a building to find the right floor and room.

---
## Core Features
1. Interactive Campus Map – Allows students to view and explore the school campus, buildings, and facilities.
2. Room and Building Search – Allows users to search for a specific classroom, department, office, laboratory, or building.
3. Building and Floor Navigation – Shows the building and floor where a selected room or department is located.
4. Location Details – Displays information such as building name, floor number, room number, and facility type.
5. Directions/Wayfinding – Provides a route from the user's starting location to the selected destination.
6. Campus Area Selection – Allows users to select different campus areas and explore their locations.

---
## User Personas

| User Persona | Description | Main Need |
|---|---|---|
| New Student | A student who is unfamiliar with the campus | Find classrooms and buildings easily |
| First-Year Student | A student who is still learning the campus layout | Navigate to different departments and rooms |
| Transferee | A student coming from another school | Quickly locate unfamiliar facilities |
| Senior High Student | A student who may not know all areas of the campus | Find assigned rooms and buildings |
| Faculty/Staff | Teachers and employees who need to locate campus facilities | Quickly find rooms, offices, and departments |

---
## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) + React Router, Tailwind CSS v4, Leaflet / react-leaflet |
| Map data | OpenStreetMap tiles + hand-traced campus/building GeoJSON |
| Backend (target) | Node.js + Express (REST API) |
| Database (target) | PostgreSQL |

---
## System Architecture Diagram

![System architecture diagram](System-Architecture-Diagram.drawio.png)

---
## Getting Started

Requires Node.js 20.19 or newer.

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
  api/                  requests to the backend (client.js, auth.js)
  auth/                 login state, AuthProvider, RequireAuth
  pages/                Dashboard, CampusPage, BuildingPage, LoginPage
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
CORS and `Access-Control-Allow-Credentials: true`. If the backend is on a
different domain than the site, the cookie needs `SameSite=None; Secure`.
