/*
  Loads room and building photos from src/assets/photos/.

  File name format: <room id or building key>-<number>.<ext>, e.g.
  mb2_22m_6-1.jpg. Numbers set the display order. Folders and letter case
  don't matter. See src/assets/photos/README.md for all names.
*/
const files = import.meta.glob("../assets/photos/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", {
  eager: true,
  query: "?url",
  import: "default",
});

const PHOTOS = {};
for (const [path, url] of Object.entries(files)) {
  const match = path.match(/([^/]+)-(\d+)\.[a-z]+$/i);
  if (!match) {
    console.warn(`[photos] Skipped "${path}": name must end in -1, -2, … (see src/assets/photos/README.md)`);
    continue;
  }
  const [, id, order] = match;
  (PHOTOS[id.toLowerCase()] ||= []).push({ order: Number(order), url });
}
for (const list of Object.values(PHOTOS)) list.sort((a, b) => a.order - b.order);

/** Photo URLs for a room id or building key, in -1, -2, … order. */
export function photosFor(id, extra = []) {
  return [...extra, ...(PHOTOS[String(id).toLowerCase()] || []).map((p) => p.url)];
}
