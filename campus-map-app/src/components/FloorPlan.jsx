import { useState, useEffect } from "react";
import { Layers, Users, DoorOpen } from "lucide-react";
import { C, ROOM_ICON } from "../theme";

export default function FloorPlan({
  buildingName,
  floorList,
  onRoomSelect,
  initialFloorId,
  highlightRoomName,
}) {
  const [floorId, setFloorId] = useState(initialFloorId || floorList[0].id);

  // Find the searched room, if any.
  const targetFloor =
    highlightRoomName && floorList.find((f) => f.rooms.some((r) => r.name === highlightRoomName));
  const targetRoom = targetFloor?.rooms.find((r) => r.name === highlightRoomName);

  // Switch to the searched floor once per search.
  const searchKey = `${initialFloorId}|${highlightRoomName}`;
  const [handledKey, setHandledKey] = useState(null);
  if (searchKey !== handledKey) {
    setHandledKey(searchKey);
    const id = targetFloor?.id || initialFloorId;
    if (id) setFloorId(id);
  }

  // Open the searched room's card.
  useEffect(() => {
    if (targetRoom) onRoomSelect({ ...targetRoom, floorLabel: targetFloor.label, buildingName });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightRoomName]);

  const floor = floorList.find((f) => f.id === floorId) || floorList[0];

  return (
    <div>
      <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6">
        <Layers size={28} className="hidden sm:block shrink-0" style={{ color: C.inkSoft }} />
        <div className="flex w-full sm:w-auto gap-1.5 sm:gap-2 md:gap-3 sm:flex-wrap justify-center">
          {floorList
            .slice()
            .reverse()
            .map((f) => (
              <button
                key={f.id}
                onClick={() => setFloorId(f.id)}
                className="flex-1 sm:flex-none px-1 py-2.5 text-[15px] sm:min-w-[7rem] sm:px-6 sm:py-3 sm:text-lg md:min-w-[8.5rem] md:px-8 md:py-4 md:text-xl rounded-md border-2 transition-colors whitespace-nowrap waygo-hover-tint"
                style={{
                  borderColor: C.brand,
                  background: f.id === floorId ? C.brand : undefined,
                  color: f.id === floorId ? "#FFFFFF" : C.brandDark,
                  fontWeight: f.id === floorId ? 600 : 500,
                }}
              >
                {f.label}
              </button>
            ))}
        </div>
      </div>

      <div
        className="grid gap-2 p-4 rounded-sm"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", background: C.paperDark, border: `1px solid ${C.line}` }}
      >
        {floor.rooms.map((room, i) => {
          const Icon = ROOM_ICON[room.type] || DoorOpen;
          return (
            <button
              key={i}
              onClick={() => onRoomSelect({ ...room, floorLabel: floor.label, buildingName })}
              className="flex flex-col items-start gap-2 p-3 rounded-sm border text-left transition-colors"
              style={{ background: C.paper, borderColor: C.line }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.accent;
                e.currentTarget.style.background = C.accentSoft;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.line;
                e.currentTarget.style.background = C.paper;
              }}
            >
              <Icon size={16} style={{ color: C.accent }} />
              <span className="text-sm font-medium leading-tight" style={{ color: C.ink }}>
                {room.name}
              </span>
              {room.capacity && (
                <span className="text-xs flex items-center gap-1" style={{ color: C.inkSoft }}>
                  <Users size={11} /> {room.capacity}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
