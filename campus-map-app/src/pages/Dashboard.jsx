import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { Building2, ChevronRight } from "lucide-react";
import AppShell from "../components/AppShell";
import HomeMap from "../components/HomeMap";
import { useSidebarSlot } from "../components/sidebarSlot";
import { CAMPUSES, SCHOOL } from "../data/campuses";
import { C } from "../theme";

const HOW_TO = [
  "Search for a room, office or building above.",
  "Check the steps, then tap Start directions.",
  "Follow the glowing path and arrow, floor by floor.",
];

function campusSummary(campus) {
  if (campus.type === "multi") {
    const buildings = Object.values(campus.buildings);
    const withPlans = buildings.filter((b) => b.usesFloorPlanArtwork).length;
    return `${buildings.length} places · ${withPlans} floor plans`;
  }
  const n = campus.floors.length;
  return `${n} ${n === 1 ? "floor" : "floors"}`;
}

const sectionLabel = "text-xs font-semibold uppercase tracking-wider mb-2";

// Campus shortcuts and a quick how-to, shown in the sidebar on wide screens.
function HomeSidebar() {
  const sidebarSlot = useSidebarSlot();
  if (!sidebarSlot) return null;
  return createPortal(
    <div className="flex flex-col gap-6">
      <section>
        <h2 className={sectionLabel} style={{ color: C.inkSoft }}>
          Campuses
        </h2>
        <div className="flex flex-col gap-2">
          {Object.entries(CAMPUSES).map(([id, campus]) => (
            <Link
              key={id}
              to={`/campus/${id}`}
              className="waygo-hover-tint flex items-center gap-3 rounded-md border px-3 py-2.5 transition-colors"
              style={{ borderColor: C.line, background: C.surface }}
            >
              <span className="shrink-0 w-9 h-9 rounded-md flex items-center justify-center" style={{ background: C.brandTint, color: C.brandDark }}>
                <Building2 size={18} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-semibold text-sm leading-snug">{campus.name}</span>
                <span className="block text-xs leading-snug" style={{ color: C.inkSoft }}>
                  {campus.tagline}
                </span>
                <span className="block text-xs font-medium mt-0.5" style={{ color: C.brandDark }}>
                  {campusSummary(campus)}
                </span>
              </span>
              <ChevronRight size={16} className="shrink-0" style={{ color: C.inkSoft }} />
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className={sectionLabel} style={{ color: C.inkSoft }}>
          How to find a room
        </h2>
        <ol className="flex flex-col gap-2.5">
          {HOW_TO.map((step, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <span
                className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{ background: C.brand, color: "#FFFFFF" }}
              >
                {i + 1}
              </span>
              <span className="pt-0.5" style={{ color: C.ink }}>
                {step}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>,
    sidebarSlot
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <AppShell
      crumbs={[{ label: SCHOOL, to: "/" }]}
      subtitle="Select a campus to explore its buildings and floor plans."
    >
      <HomeMap onSelect={(id) => navigate(`/campus/${id}`)} />
      <HomeSidebar />
    </AppShell>
  );
}
