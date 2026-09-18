# WayGO
---
## Overview

WayGo is a web app that helps students, visitors, and staff find their way around a school with multiple physically separate campuses. Open one dashboard, see every campus on a real map, drill into a campus to see its buildings, and drill into a building to find the right floor and room.

---
## Core Features
1. Interactive Campus Map – Allows students to view and explore the school campus, 
buildings, and facilities. 
2. Room and Building Search – Allows users to search for a specific classroom, department, 
office, laboratory, or building. 
3. Building and Floor Navigation – Shows the building and floor where a selected room or 
department is located. 
4. Location Details – Displays information such as building name, floor number, room 
number, and facility type. 
5. Directions/Wayfinding – Provides a route from the user's starting location to the 
selected destination. 
6. Campus Area Selection – Allows users to select different campus areas and explore their 
locations. 
User Personas
User Persona Description Main Need
New Student A student who is unfamiliar 
with the campus
Find classrooms and 
buildings easily
First-Year Student A student who is still 
learning the campus layout
Navigate to different 
departments and rooms
Transferee A student coming from 
another school
Quickly locate unfamiliar 
facilities
Senior High Student A student who may not 
know all areas of the 
campus
Find assigned rooms and 
buildings
Faculty/Staff Teachers and employees 
who need to locate 
campus facilities
Quickly find rooms, offices, 
and departments
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
