import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageHeader from "./PageHeader";
import Breadcrumb from "./Breadcrumb";
import SearchBar from "./SearchBar";
import ProfileMenu from "./ProfileMenu";
import { SidebarSlotContext } from "./sidebarSlot";
import TripPanel from "./TripPanel";
import { useMediaQuery, WIDE_QUERY } from "./useMediaQuery";
import { C } from "../theme";

/**
 * Page layout for the map pages. On wide screens a sidebar holds the logo,
 * search, navigation, page title and the map's controls, so the map gets
 * the window's full height. Phones and tablets keep the header on top.
 *
 * Props: crumbs, backTo, backLabel (as PageHeader), title, subtitle,
 * children (the page content, usually a map).
 */
export default function AppShell({ crumbs, backTo, backLabel, title, subtitle, children }) {
  const wide = useMediaQuery(WIDE_QUERY);
  const [slot, setSlot] = useState(null);

  const page = { background: C.paper, color: C.ink, fontFamily: "'IBM Plex Sans', sans-serif" };

  if (!wide) {
    return (
      <div className="min-h-screen w-full" style={page}>
        <PageHeader crumbs={crumbs} backTo={backTo} backLabel={backLabel} />
        <main className="px-4 py-3 md:px-6 md:py-5 waygo-page-in">
          {title && (
            <h1 className="text-xl md:text-2xl font-semibold mb-3 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-sm mb-4 text-center mx-auto" style={{ color: C.inkSoft, maxWidth: "48ch" }}>
              {subtitle}
            </p>
          )}
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full" style={page}>
      <aside
        className="w-72 shrink-0 sticky top-0 h-screen flex flex-col gap-5 px-5 py-5"
        style={{ borderTop: `3px solid ${C.brand}`, borderRight: `1px solid ${C.line}` }}
      >
        <div className="flex items-center gap-2.5">
          <Link to="/" aria-label="WayGo home" className="shrink-0 rounded-sm">
            <img src="/WayGo-logo.svg" alt="" className="w-10 h-10" />
          </Link>
          <Link
            to="/"
            className="flex-1 text-xl font-bold tracking-tight rounded-sm"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: C.brandDark }}
          >
            WayGo
          </Link>
          <ProfileMenu />
        </div>

        <SearchBar />

        <div className="flex flex-col gap-3">
          <Breadcrumb items={crumbs} />
          {backTo && (
            <Link
              to={backTo}
              className="waygo-hover-tint self-start flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-md border transition-colors"
              style={{ borderColor: C.brandLine, color: C.brandDark }}
            >
              <ArrowLeft size={15} />
              {backLabel}
            </Link>
          )}
        </div>

        {(title || subtitle) && (
          <div className="pt-4" style={{ borderTop: `1px solid ${C.line}` }}>
            {title && (
              <h1 className="text-2xl font-semibold leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm mt-2" style={{ color: C.inkSoft }}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        <TripPanel />

        {/* The map's controls render here (see FloorPlanViewer). */}
        <div ref={setSlot} className="flex-1 min-h-0 overflow-y-auto -mx-1 px-1" />
      </aside>

      <main className="flex-1 min-w-0 p-4 waygo-page-in">
        <SidebarSlotContext.Provider value={slot}>{children}</SidebarSlotContext.Provider>
      </main>
    </div>
  );
}
