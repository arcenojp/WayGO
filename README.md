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
  pages/                Dashboard, CampusPage, BuildingPage
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
