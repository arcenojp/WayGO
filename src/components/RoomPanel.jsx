import { DoorOpen } from "lucide-react";
import { C, ROOM_ICON } from "../theme";
import PhotoGallery from "./PhotoGallery";
import CenteredCard from "./CenteredCard";
import { photosFor } from "../data/photos";

export default function RoomPanel({ room, onClose }) {
  if (!room) return null;
  const Icon = ROOM_ICON[room.type] || DoorOpen;
  const hasPhotoSupport = room.photos !== undefined;

  return (
    <CenteredCard onClose={onClose} label={room.name}>
      {hasPhotoSupport && <PhotoGallery key={room.id} photos={photosFor(room.id, room.photos)} heightClass="h-48 md:h-64" />}

      {room.type && (
        <div className="flex items-center gap-2 mb-2" style={{ color: C.amber }}>
          <Icon size={16} />
          <span className="text-xs uppercase tracking-wide" style={{ letterSpacing: "0.06em" }}>
            {room.type}
          </span>
        </div>
      )}
      <div className="text-xl font-semibold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {room.name}
      </div>
      <div className="text-sm opacity-80">
        {room.buildingName} · {room.floorLabel}
      </div>
      {room.capacity && <div className="text-sm opacity-80 mt-1">Capacity: {room.capacity}</div>}
    </CenteredCard>
  );
}
