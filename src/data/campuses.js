export const SCHOOL = "Western Institute of Technology";

/*
  Campus data.

  - type: "single" opens straight to the building's floor plan; "multi"
    shows a site map of clickable buildings.
  - usesFloorPlanArtwork: the building has traced floor plans (the
    *Floors.js files). Its `floors` here is a summary (floor labels and
    room names) used by search.
  - imageOnly: a simple building with no floor plan; shows photos only.
  - Placeholder floors use { id, label, rooms: [{ name, type, capacity? }] },
    where type is a key of ROOM_ICON in theme.js.
*/

import { MAIN_BUILDING_FLOORS } from "./mainBuildingFloors";
import { COMPUTER_BUILDING_FLOORS } from "./computerBuildingFloors";
import { MARINE_BUILDING_FLOORS } from "./marineBuildingFloors";
import { PRACTICUM_CENTER_FLOORS } from "./practicumCenterFloors";
import { SENIOR_HIGH_FLOORS } from "./seniorHighFloors";
import { NEW_BUILDING_FLOORS } from "./newBuildingFloors";
import { CE_BUILDING_FLOORS } from "./ceBuildingFloors";

const mainBuildingFloorsSummary = MAIN_BUILDING_FLOORS.map((f) => ({
  id: f.id,
  label: f.label,
  rooms: f.rooms.map((r) => ({ name: r.name })),
}));

const computerBuildingFloorsSummary = COMPUTER_BUILDING_FLOORS.map((f) => ({
  id: f.id,
  label: f.label,
  rooms: f.rooms.map((r) => ({ name: r.name })),
}));

const marineBuildingFloorsSummary = MARINE_BUILDING_FLOORS.map((f) => ({
  id: f.id,
  label: f.label,
  rooms: f.rooms.map((r) => ({ name: r.name })),
}));

const practicumCenterFloorsSummary = PRACTICUM_CENTER_FLOORS.map((f) => ({
  id: f.id,
  label: f.label,
  rooms: f.rooms.map((r) => ({ name: r.name })),
}));

const seniorHighFloorsSummary = SENIOR_HIGH_FLOORS.map((f) => ({
  id: f.id,
  label: f.label,
  rooms: f.rooms.map((r) => ({ name: r.name })),
}));

const newBuildingFloorsSummary = NEW_BUILDING_FLOORS.map((f) => ({
  id: f.id,
  label: f.label,
  rooms: f.rooms.map((r) => ({ name: r.name })),
}));

const ceBuildingFloorsSummary = CE_BUILDING_FLOORS.map((f) => ({
  id: f.id,
  label: f.label,
  rooms: f.rooms.map((r) => ({ name: r.name })),
}));

export const CAMPUSES = {
  main: {
    name: "Main Campus",
    tagline: "Engineering, Sciences & Administration",
    type: "single",
    usesFloorPlanArtwork: true,
    about:
      "The Main Building's floor plans are fully interactive — real traced layouts, not a simple room list, across all 4 floors.",
    floors: mainBuildingFloorsSummary,
  },

  practicum: {
    name: "Practicum Center",
    tagline: "Applied Skills Training Facility",
    type: "single",
    usesFloorPlanArtwork: true,
    about:
      "The Practicum Center's floor plan is fully interactive — a real traced layout, not a simple room list.",
    floors: practicumCenterFloorsSummary,
  },

  rts: {
    name: "RTS Campus",
    tagline: "Athletics, Residence & Sports Science",
    type: "multi",
    // Building shapes and positions come from the RTS map artwork
    // (rts-campus-map.svg, rtsBuildingShapes.js).
    buildings: {
      physicalPlant: {
        name: "Physical Plant & Facilities Department",
        imageOnly: true,
        photos: [],
      },
      // Unlabeled on the map; rename here and in rtsBuildingShapes.js.
      annexNorth: {
        name: "Unlabeled Annex (near Gymnasium)",
        imageOnly: true,
        photos: [],
      },
      gym: {
        name: "STS - Gymnasium",
        imageOnly: true,
        photos: [],
      },
      rotcOffice: {
        name: "ROTC Office",
        imageOnly: true,
        photos: [],
      },
      smallGrandStand: {
        name: "SGS - Small Grand Stand",
        imageOnly: true,
        photos: [],
      },
      seniorHigh: {
        name: "Senior High Building",
        usesFloorPlanArtwork: true,
        floors: seniorHighFloorsSummary,
      },
      meLabs: {
        name: "ME Laboratories",
        imageOnly: true,
        photos: [],
      },
      machineShop: {
        name: "Machine Shop",
        imageOnly: true,
        photos: [],
      },
      ceBuilding: {
        name: "CE Building",
        usesFloorPlanArtwork: true,
        floors: ceBuildingFloorsSummary,
      },
      newBuilding: {
        name: "New Building",
        usesFloorPlanArtwork: true,
        floors: newBuildingFloorsSummary,
      },
      underConstruction: {
        name: "Building Under Construction",
        imageOnly: true,
        photos: [],
      },
      eeLab: {
        name: "EE/Electronics Lab Custodian's Office",
        imageOnly: true,
        photos: [],
      },
      computerBuilding: {
        name: "Computer Building",
        usesFloorPlanArtwork: true,
        floors: computerBuildingFloorsSummary,
      },
      // Unlabeled on the map; rename here and in rtsBuildingShapes.js.
      annexEast: {
        name: "Unlabeled Annex (near Marine Engineering)",
        imageOnly: true,
        photos: [],
      },
      marineEngineering: {
        name: "Marine Engineering Building",
        usesFloorPlanArtwork: true,
        floors: marineBuildingFloorsSummary,
      },
      canteen: {
        name: "Canteen",
        imageOnly: true,
        photos: [],
      },
      swimmingPool: {
        name: "Swimming Pool Area",
        imageOnly: true,
        photos: [],
      },
      tennisCourt: {
        name: "Tennis Court",
        floors: [
          {
            id: "g",
            label: "Ground Floor",
            rooms: [{ name: "Court", type: "hall" }],
          },
        ],
      },
    },
  },
};
