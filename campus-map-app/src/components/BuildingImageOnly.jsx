import PhotoGallery from "./PhotoGallery";

/**
 * Photo view for buildings without a floor plan (imageOnly in campuses.js).
 */
export default function BuildingImageOnly({ photos }) {
  return (
    <div className="max-w-2xl">
      <PhotoGallery photos={photos} heightClass="h-72" />
    </div>
  );
}
