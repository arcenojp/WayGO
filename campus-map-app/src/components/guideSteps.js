/**
 * Step-by-step directions for a search result, shown before the map moves
 * and in the sidebar during the trip. Each step has a `kind` so the
 * sidebar can tell which one the user is on:
 *
 *   start   arrive at the campus (or its gate)
 *   path    follow the glowing path on the campus map
 *   open    open a building that has no walking route
 *   stairs  go up to the room's floor
 *   find    find the room
 *   tap     tap the building at the end of the path
 */
export function stepsFor(entry) {
  const { place } = entry;
  if (!place) return [];
  const { campusName, buildingName, floorLabel, floorIndex, imageOnly } = place;
  const steps = [];

  if (entry.via) {
    steps.push({ kind: "start", text: `Enter at the ${campusName} gate` });
    steps.push({ kind: "path", text: `Follow the glowing path to ${buildingName}` });
  } else {
    steps.push({ kind: "start", text: `Go to ${campusName}` });
    if (buildingName) steps.push({ kind: "open", text: `Open ${buildingName}` });
  }

  if (entry.kind === "room") {
    if (floorIndex > 0) steps.push({ kind: "stairs", text: `Take the stairs up to the ${floorLabel}` });
    steps.push({ kind: "find", text: `Find ${entry.label} on the ${floorLabel}` });
  } else if (entry.via) {
    steps.push({ kind: "tap", text: `Tap ${buildingName} to see its ${imageOnly ? "photos" : "floors"}` });
  }
  return steps;
}

/**
 * Which step the user is on, from the page they're on and the floor shown.
 * Returns steps.length once they've arrived.
 */
export function currentStep(trip, pathname, floorId) {
  const { entry, steps, arrived } = trip;
  if (arrived) return steps.length;
  const at = (kind) => steps.findIndex((s) => s.kind === kind);
  if (pathname === entry.path) {
    const target = entry.state?.floorId;
    if (at("stairs") >= 0 && floorId && floorId !== target) return at("stairs");
    if (at("find") >= 0) return at("find");
    return steps.length - 1;
  }
  if (entry.via && pathname === entry.via.campusPath) return at("path");
  return 0;
}
