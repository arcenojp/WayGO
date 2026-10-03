import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, MapPin, Building2, DoorOpen } from "lucide-react";
import { search } from "../data/searchIndex";
import { C } from "../theme";

const KIND_ICON = { campus: MapPin, building: Building2, room: DoorOpen };

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const results = search(query);

  useEffect(() => {
    function onClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function goTo(entry) {
    setQuery("");
    setOpen(false);
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
  }

  function onKeyDown(e) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      goTo(results[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div
        className="waygo-search flex items-center gap-2.5 px-3 py-2.5 md:px-4 md:py-3 rounded-lg border transition-shadow"
        style={{ borderColor: C.line, background: C.paper }}
      >
        <Search size={18} style={{ color: C.brand, flexShrink: 0 }} />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(-1);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search rooms, buildings, campuses"
          aria-label="Search rooms, buildings, campuses"
          className="flex-1 text-base bg-transparent outline-none min-w-0"
          style={{ color: C.ink }}
        />
      </div>

      {open && query && (
        <div
          className="absolute left-0 right-0 mt-1.5 rounded-lg border shadow-lg z-30 max-h-80 overflow-y-auto"
          style={{ background: C.paper, borderColor: C.line }}
        >
          {results.length === 0 ? (
            <div className="px-3 py-3 text-sm" style={{ color: C.inkSoft }}>
              No matches for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            results.map((entry, i) => {
              const Icon = KIND_ICON[entry.kind] || DoorOpen;
              const active = i === activeIndex;
              return (
                <button
                  key={`${entry.path}-${entry.label}-${i}`}
                  onClick={() => goTo(entry)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className="w-full flex items-start gap-2.5 px-4 py-2.5 text-left transition-colors"
                  style={{ background: active ? C.accentSoft : "transparent" }}
                >
                  <Icon size={17} style={{ color: C.accent, marginTop: 3, flexShrink: 0 }} />
                  <span className="min-w-0">
                    <span className="block text-base font-medium truncate" style={{ color: C.ink }}>
                      {entry.label}
                    </span>
                    {entry.sublabel && (
                      <span className="block text-sm truncate" style={{ color: C.inkSoft }}>
                        {entry.sublabel}
                      </span>
                    )}
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
