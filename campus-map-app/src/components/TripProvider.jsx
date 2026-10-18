import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navigation } from "lucide-react";
import CenteredCard from "./CenteredCard";
import { TripContext } from "./tripContext";
import { stepsFor } from "./guideSteps";
import { C } from "../theme";

/**
 * Directions picked from search. Choosing a room or building first shows a
 * card with the steps (`pending`); the map only moves once the user starts.
 * The started `trip` stays available to the sidebar, which highlights the
 * current step, until the user arrives or ends it.
 */
export default function TripProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [pending, setPending] = useState(null);
  const [trip, setTrip] = useState(null);
  const [floorId, setFloorId] = useState(null);

  const value = useMemo(() => {
    const start = () => {
      const entry = pending;
      setPending(null);
      setTrip({ entry, steps: stepsFor(entry), arrived: false });
      setFloorId(null);
      const fromElsewhere = location.pathname !== entry.path;
      if (entry.via && fromElsewhere) {
        // Walk there on the campus map first; the building page comes next.
        navigate(entry.via.campusPath, {
          state: {
            route: {
              buildingId: entry.via.buildingId,
              label: entry.kind === "room" ? entry.label : null,
              next: { path: entry.path, state: entry.state },
            },
          },
        });
        return;
      }
      // Coming from another page means entering the building, so the floor
      // plan starts at the entrance floor and points to the stairs.
      navigate(entry.path, { state: { ...entry.state, guide: fromElsewhere } });
    };
    return {
      trip,
      floorId,
      preview: setPending,
      start,
      end: () => setTrip(null),
      arrive: () => setTrip((t) => (t ? { ...t, arrived: true } : t)),
      reportFloor: setFloorId,
    };
  }, [pending, trip, floorId, location.pathname, navigate]);

  return (
    <TripContext.Provider value={value}>
      {children}
      {pending && <GuideCard entry={pending} onStart={value.start} onCancel={() => setPending(null)} />}
    </TripContext.Provider>
  );
}

function GuideCard({ entry, onStart, onCancel }) {
  const steps = stepsFor(entry);
  const { place } = entry;
  const where = [place.buildingName, place.floorLabel].filter(Boolean).join(" · ");
  return (
    <CenteredCard onClose={onCancel} label={`Directions to ${entry.label}`}>
      <h2 className="text-xl font-semibold pr-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {entry.label}
      </h2>
      <p className="text-sm mt-1 opacity-80">{where || place.campusName}</p>
      {where && <p className="text-sm opacity-80">{place.campusName}</p>}

      <ol className="mt-5 flex flex-col gap-3">
        {steps.map((step, i) => (
          <li key={step.kind} className="flex items-start gap-3">
            <span
              className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold"
              style={{ background: C.brand, color: "#FFFFFF" }}
            >
              {i + 1}
            </span>
            <span className="pt-0.5">{step.text}</span>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={onStart}
          className="flex items-center gap-2 px-4 py-2.5 rounded-md font-semibold"
          style={{ background: C.brand, color: "#FFFFFF" }}
        >
          <Navigation size={17} />
          Start directions
        </button>
        <button onClick={onCancel} className="px-3 py-2.5 rounded-md opacity-80 hover:opacity-100">
          Cancel
        </button>
      </div>
    </CenteredCard>
  );
}
