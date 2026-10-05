import { useState } from "react";
import { ImageOff, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Photo carousel with previous/next buttons and dots. Shows a placeholder
 * when there are no photos.
 */
export default function PhotoGallery({ photos, heightClass = "h-40" }) {
  const [index, setIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <div
        className={`w-full ${heightClass} rounded-sm flex flex-col items-center justify-center gap-2 mb-3`}
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <ImageOff size={22} className="opacity-40" />
        <span className="text-xs opacity-50">No photos yet</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${heightClass} rounded-sm overflow-hidden mb-3`}>
      <img src={photos[index]} alt="" className="w-full h-full object-cover" />
      {photos.length > 1 && (
        <>
          <button
            onClick={() => setIndex((i) => (i - 1 + photos.length) % photos.length)}
            className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.5)" }}
            aria-label="Previous photo"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setIndex((i) => (i + 1) % photos.length)}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.5)" }}
            aria-label="Next photo"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1">
            {photos.map((_, i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: i === index ? "white" : "rgba(255,255,255,0.4)" }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
