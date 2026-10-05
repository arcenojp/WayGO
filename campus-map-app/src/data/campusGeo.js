/*
  Traced from a real GeoJSON export (geojson.io) over the school's actual
  street map. Each campus is a Polygon so it can be filled and clicked as
  an area on top of real road/building basemap tiles.

  To retrace or update: draw over the map at geojson.io, export, then
  copy each feature's coordinate ring in here (wrap it in one extra
  array level to turn a traced LineString into a Polygon ring, as done
  below), and set a "name" + "slug" in properties. "slug" must match a
  key in CAMPUSES (src/data/campuses.js).
*/
export const CAMPUS_GEOJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "RTS Campus", slug: "rts", color: "#6FA47E", centroid: [10.708681, 122.563485] },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [122.563141, 10.709635],
            [122.563617, 10.710203],
            [122.563706, 10.710216],
            [122.56398, 10.710014],
            [122.564296, 10.708477],
            [122.564117, 10.708349],
            [122.563966, 10.708255],
            [122.563925, 10.708053],
            [122.563582, 10.7075],
            [122.563507, 10.707446],
            [122.563205, 10.707905],
            [122.563088, 10.70808],
            [122.562835, 10.707938],
            [122.562629, 10.708248],
            [122.563267, 10.708639],
            [122.563267, 10.709023],
            [122.563123, 10.709603],
            [122.563141, 10.709635],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Practicum Center", slug: "practicum", color: "#D89B3C", centroid: [10.710556, 122.564809] },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [122.5646, 10.71044],
            [122.564781, 10.710657],
            [122.564753, 10.710684],
            [122.564806, 10.710754],
            [122.565071, 10.710547],
            [122.564842, 10.710254],
            [122.5646, 10.71044],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Main Campus", slug: "main", color: "#1F6E8C", centroid: [10.71096, 122.566029] },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [122.565741, 10.710969],
            [122.565967, 10.710617],
            [122.566109, 10.710699],
            [122.566092, 10.71072],
            [122.566156, 10.710765],
            [122.566424, 10.711057],
            [122.566155, 10.711403],
            [122.565962, 10.711193],
            [122.565932, 10.711201],
            [122.565749, 10.710977],
            [122.565741, 10.710969],
          ],
        ],
      },
    },
  ],
};

// Roughly centers the map over all three campuses on first load.
export const MAP_CENTER = [10.709731, 122.564461];
export const MAP_ZOOM = 17;