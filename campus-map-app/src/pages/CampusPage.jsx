import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import AppShell from "../components/AppShell";
import { useTrip } from "../components/tripContext";
import CampusSiteMap from "../components/CampusSiteMap";
import FloorPlan from "../components/FloorPlan";
import FloorPlanViewer from "../components/FloorPlanViewer";
import RoomPanel from "../components/RoomPanel";
import BuildingPanel from "../components/BuildingPanel";
import { CAMPUSES, SCHOOL } from "../data/campuses";
import { MAIN_BUILDING_FLOORS, FLOOR_ARTWORK_SIZE } from "../data/mainBuildingFloors";
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
  const trip = useTrip();
  const campus = CAMPUSES[campusId];
  // Directions from search: { buildingId, label, next: { path, state } }
  const route = location.state?.route;

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
    <AppShell crumbs={crumbs} backTo="/" backLabel="All campuses" title={campus.name}>
        <div>
          {campus.usesFloorPlanArtwork && FLOOR_PLAN_CAMPUSES[campusId] ? (
            <div className="max-w-7xl mx-auto">
              <FloorPlanViewer
                buildingName={campus.name}
                floors={FLOOR_PLAN_CAMPUSES[campusId].floors}
                artworkUrls={FLOOR_PLAN_CAMPUSES[campusId].artworkUrls}
                artworkSize={FLOOR_PLAN_CAMPUSES[campusId].artworkSize}
                onRoomSelect={setRoom}
                initialFloorId={location.state?.floorId}
                highlightRoomName={location.state?.roomName}
                highlightKey={location.key}
                guideFromEntrance={location.state?.guide}
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
              route={route}
              routeKey={location.key}
              onEndRoute={() => {
                trip.end();
                navigate(location.pathname, { replace: true });
              }}
              onSelectBuilding={(buildingId) => {
                const building = campus.buildings[buildingId];
                if (route?.buildingId === buildingId && !building?.imageOnly) {
                  // Arriving by directions: the floor plan starts at the
                  // entrance floor and guides the user up the stairs.
                  navigate(route.next.path, { state: { ...route.next.state, guide: true } });
                } else if (building?.imageOnly) {
                  setSelectedBuilding({ id: buildingId, ...building });
                  // A photo-only building is the end of the route.
                  if (route?.buildingId === buildingId) {
                    trip.arrive();
                    navigate(location.pathname, { replace: true });
                  }
                } else {
                  navigate(`/campus/${campusId}/building/${buildingId}`);
                }
              }}
            />
          )}
        </div>
      <RoomPanel room={room} onClose={() => setRoom(null)} />
      <BuildingPanel building={selectedBuilding} onClose={() => setSelectedBuilding(null)} />
    </AppShell>
  );
}
