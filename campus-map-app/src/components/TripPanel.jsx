import { useLocation } from "react-router-dom";
import { Check, Navigation, X } from "lucide-react";
import { useTrip } from "./tripContext";
import { currentStep } from "./guideSteps";
import { C } from "../theme";

/**
 * The started directions in the sidebar: every step, with the current one
 * highlighted and the ones before it checked off.
 */
export default function TripPanel() {
  const tripState = useTrip();
  const location = useLocation();
  if (!tripState?.trip) return null;
  const { trip, floorId, end } = tripState;
  const current = currentStep(trip, location.pathname, floorId);

  return (
    <section className="rounded-lg p-4" style={{ background: C.brandTint, border: `1px solid ${C.brandLine}` }} aria-label="Directions">
      <div className="flex items-center gap-2 mb-3">
        <Navigation size={16} style={{ color: C.brand }} />
        <h2 className="flex-1 text-sm font-semibold truncate" style={{ color: C.brandDark }}>
          {trip.arrived ? "You've arrived" : `To ${trip.entry.label}`}
        </h2>
        <button onClick={end} aria-label="End directions" className="rounded p-0.5 waygo-hover-tint" style={{ color: C.inkSoft }}>
          <X size={16} />
        </button>
      </div>
      <ol className="flex flex-col gap-2.5">
        {trip.steps.map((step, i) => {
          const done = i < current;
          const now = i === current;
          return (
            <li key={step.kind} className="flex items-start gap-2.5 text-sm" style={{ color: now ? C.ink : C.inkSoft, fontWeight: now ? 600 : 400 }}>
              <span
                className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{
                  background: done || now ? C.brand : C.surface,
                  color: done || now ? "#FFFFFF" : C.brandDark,
                  border: `1.5px solid ${C.brand}`,
                }}
              >
                {done ? <Check size={14} /> : i + 1}
              </span>
              <span className="pt-0.5">{step.text}</span>
            </li>
          );
        })}
      </ol>
      {trip.arrived && (
        <button onClick={end} className="mt-3 text-sm font-semibold waygo-link">
          Done
        </button>
      )}
    </section>
  );
}
