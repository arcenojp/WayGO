import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import CampusSiteMap from "../components/CampusSiteMap";
import FloorPlan from "../components/FloorPlan";
import FloorPlanViewer from "../components/FloorPlanViewer";
import RoomPanel from "../components/RoomPanel";
import BuildingPanel from "../components/BuildingPanel";
import { CAMPUSES, SCHOOL } from "../data/campuses";
import { MAIN_BUILDING_FLOORS, FLOOR_ARTWORK_SIZE } from "../data/mainBuildingFloors";
import { C } from "../theme";
import mainFloor1Url from "../assets/main-building-floor1.svg?url";
import mainFloor2Url from "../assets/main-building-floor2.svg?url";
import mainFloor3Url from "../assets/main-building-floor3.svg?url";
import mainFloor4Url from "../assets/main-building-floor4.svg?url";
import { PRACTICUM_CENTER_FLOORS, PRACTICUM_CENTER_ARTWORK_SIZE } from "../data/practicumCenterFloors";
import pcFloor1Url from "../assets/practicum-center-floor1.svg?url";

// Single-building campuses with traced floor plans, keyed by campusId.
const FLOOR_PLAN_CAMPUSES = {
  main: {
    floors: MAIN_BUILDING_FLOORS,
    artworkSize: FLOOR_ARTWORK_SIZE,
    artworkUrls: {
      "main-building-floor1.svg": mainFloor1Url,
      "main-building-floor2.svg": mainFloor2Url,
      "main-building-floor3.svg": mainFloor3Url,
      "main-building-floor4.svg": mainFloor4Url,
    },
  },
  practicum: {
    floors: PRACTICUM_CENTER_FLOORS,
    artworkSize: PRACTICUM_CENTER_ARTWORK_SIZE,
    artworkUrls: {
      "practicum-center-floor1.svg": pcFloor1Url,
    },
  },
};

export default function CampusPage() {
  const { campusId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [room, setRoom] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const campus = CAMPUSES[campusId];

  if (!campus) {
    return (
      <div className="p-8">
        <p>Campus not found.</p>
      </div>
    );
  }

  const crumbs = [
    { label: SCHOOL, to: "/" },
    { label: campus.name, to: `/campus/${campusId}` },
  ];

  return (
    <div className="min-h-screen w-full" style={{ background: C.paper, color: C.ink, fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <PageHeader crumbs={crumbs} backTo="/" backLabel="All campuses" />
      <main className="py-5 md:py-8">
        <div className="px-4 md:px-6 max-w-5xl mx-auto">
          <h1 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {campus.name}
          </h1>
        </div>

        <div className="px-4 md:px-6">
          {campus.usesFloorPlanArtwork && FLOOR_PLAN_CAMPUSES[campusId] ? (
            <div className="max-w-5xl mx-auto">
              <FloorPlanViewer
                buildingName={campus.name}
                floors={FLOOR_PLAN_CAMPUSES[campusId].floors}
                artworkUrls={FLOOR_PLAN_CAMPUSES[campusId].artworkUrls}
                artworkSize={FLOOR_PLAN_CAMPUSES[campusId].artworkSize}
                onRoomSelect={setRoom}
                initialFloorId={location.state?.floorId}
                highlightRoomName={location.state?.roomName}
                highlightKey={location.key}
              />
            </div>
          ) : campus.type === "single" ? (
            <FloorPlan
              buildingName={campus.name}
              floorList={campus.floors}
              onRoomSelect={setRoom}
              initialFloorId={location.state?.floorId}
              highlightRoomName={location.state?.roomName}
            />
          ) : (
            <CampusSiteMap
              campusId={campusId}
              onSelectBuilding={(buildingId) => {
                const building = campus.buildings[buildingId];
                if (building?.imageOnly) {
                  setSelectedBuilding({ id: buildingId, ...building });
                } else {
                  navigate(`/campus/${campusId}/building/${buildingId}`);
                }
              }}
            />
          )}
        </div>
      </main>
      <RoomPanel room={room} onClose={() => setRoom(null)} />
      <BuildingPanel building={selectedBuilding} onClose={() => setSelectedBuilding(null)} />
    </div>
  );
}
