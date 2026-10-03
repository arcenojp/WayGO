import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import FloorPlan from "../components/FloorPlan";
import FloorPlanViewer from "../components/FloorPlanViewer";
import BuildingImageOnly from "../components/BuildingImageOnly";
import RoomPanel from "../components/RoomPanel";
import { CAMPUSES, SCHOOL } from "../data/campuses";
import { COMPUTER_BUILDING_FLOORS, COMPUTER_BUILDING_ARTWORK_SIZE } from "../data/computerBuildingFloors";
import { C } from "../theme";
import { photosFor } from "../data/photos";
import cbFloor1Url from "../assets/computer-building-floor1.svg?url";
import cbFloor2Url from "../assets/computer-building-floor2.svg?url";
import cbFloor3Url from "../assets/computer-building-floor3.svg?url";
import { MARINE_BUILDING_FLOORS, MARINE_BUILDING_ARTWORK_SIZE } from "../data/marineBuildingFloors";
import mbFloor1Url from "../assets/marine-building-floor1.svg?url";
import mbFloor2Url from "../assets/marine-building-floor2.svg?url";
import mbFloor3Url from "../assets/marine-building-floor3.svg?url";
import { SENIOR_HIGH_FLOORS, SENIOR_HIGH_ARTWORK_SIZE } from "../data/seniorHighFloors";
import shFloor1Url from "../assets/senior-high-floor1.svg?url";
import shFloor2Url from "../assets/senior-high-floor2.svg?url";
import shFloor3Url from "../assets/senior-high-floor3.svg?url";
import { NEW_BUILDING_FLOORS, NEW_BUILDING_ARTWORK_SIZE } from "../data/newBuildingFloors";
import nbFloor1Url from "../assets/new-building-floor1.svg?url";
import nbFloor2Url from "../assets/new-building-floor2.svg?url";
import nbFloor3Url from "../assets/new-building-floor3.svg?url";
import { CE_BUILDING_FLOORS, CE_BUILDING_ARTWORK_SIZE } from "../data/ceBuildingFloors";
import ceFloor1Url from "../assets/ce-building-floor1.svg?url";
import ceFloor2Url from "../assets/ce-building-floor2.svg?url";

// Buildings with traced floor plans, keyed by buildingId.
const FLOOR_PLAN_BUILDINGS = {
  computerBuilding: {
    floors: COMPUTER_BUILDING_FLOORS,
    artworkSize: COMPUTER_BUILDING_ARTWORK_SIZE,
    artworkUrls: {
      "computer-building-floor1.svg": cbFloor1Url,
      "computer-building-floor2.svg": cbFloor2Url,
      "computer-building-floor3.svg": cbFloor3Url,
    },
  },
  marineEngineering: {
    floors: MARINE_BUILDING_FLOORS,
    artworkSize: MARINE_BUILDING_ARTWORK_SIZE,
    artworkUrls: {
      "marine-building-floor1.svg": mbFloor1Url,
      "marine-building-floor2.svg": mbFloor2Url,
      "marine-building-floor3.svg": mbFloor3Url,
    },
  },
  seniorHigh: {
    floors: SENIOR_HIGH_FLOORS,
    artworkSize: SENIOR_HIGH_ARTWORK_SIZE,
    artworkUrls: {
      "senior-high-floor1.svg": shFloor1Url,
      "senior-high-floor2.svg": shFloor2Url,
      "senior-high-floor3.svg": shFloor3Url,
    },
  },
  newBuilding: {
    floors: NEW_BUILDING_FLOORS,
    artworkSize: NEW_BUILDING_ARTWORK_SIZE,
    artworkUrls: {
      "new-building-floor1.svg": nbFloor1Url,
      "new-building-floor2.svg": nbFloor2Url,
      "new-building-floor3.svg": nbFloor3Url,
    },
  },
  ceBuilding: {
    floors: CE_BUILDING_FLOORS,
    artworkSize: CE_BUILDING_ARTWORK_SIZE,
    artworkUrls: {
      "ce-building-floor1.svg": ceFloor1Url,
      "ce-building-floor2.svg": ceFloor2Url,
    },
  },
};

export default function BuildingPage() {
  const { campusId, buildingId } = useParams();
  const location = useLocation();
  const [room, setRoom] = useState(null);
  const campus = CAMPUSES[campusId];
  const building = campus?.buildings?.[buildingId];

  if (!campus || !building) {
    return (
      <div className="p-8">
        <p>Building not found.</p>
      </div>
    );
  }

  const crumbs = [
    { label: SCHOOL, to: "/" },
    { label: campus.name, to: `/campus/${campusId}` },
    { label: building.name, to: `/campus/${campusId}/building/${buildingId}` },
  ];

  return (
    <div className="min-h-screen w-full" style={{ background: C.paper, color: C.ink, fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <PageHeader crumbs={crumbs} backTo={`/campus/${campusId}`} backLabel="Site map" />
      <main className="px-4 py-5 md:px-6 md:py-8 max-w-5xl mx-auto">
        <h1 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {building.name}
        </h1>
        {building.imageOnly ? (
          <BuildingImageOnly photos={photosFor(buildingId, building.photos)} />
        ) : building.usesFloorPlanArtwork && FLOOR_PLAN_BUILDINGS[buildingId] ? (
          <FloorPlanViewer
            buildingName={building.name}
            floors={FLOOR_PLAN_BUILDINGS[buildingId].floors}
            artworkUrls={FLOOR_PLAN_BUILDINGS[buildingId].artworkUrls}
            artworkSize={FLOOR_PLAN_BUILDINGS[buildingId].artworkSize}
            onRoomSelect={setRoom}
            initialFloorId={location.state?.floorId}
            highlightRoomName={location.state?.roomName}
            highlightKey={location.key}
          />
        ) : (
          <FloorPlan
            buildingName={building.name}
            floorList={building.floors}
            onRoomSelect={setRoom}
            initialFloorId={location.state?.floorId}
            highlightRoomName={location.state?.roomName}
          />
        )}
      </main>
      <RoomPanel room={room} onClose={() => setRoom(null)} />
    </div>
  );
}
