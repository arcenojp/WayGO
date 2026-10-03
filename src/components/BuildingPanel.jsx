import PhotoGallery from "./PhotoGallery";
import CenteredCard from "./CenteredCard";
import { photosFor } from "../data/photos";

/**
 * Photo card for buildings without a floor plan, opened from the RTS map.
 */
export default function BuildingPanel({ building, onClose }) {
  if (!building) return null;

  return (
    <CenteredCard onClose={onClose} label={building.name} width="max-w-xl">
      <PhotoGallery key={building.id} photos={photosFor(building.id, building.photos)} heightClass="h-56 md:h-80" />

      <div className="text-xl font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {building.name}
      </div>
    </CenteredCard>
  );
}
