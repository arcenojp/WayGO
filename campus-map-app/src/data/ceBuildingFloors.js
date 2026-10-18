// CE Building (RTS Campus) floor plans.
// Rooms and stairs are [x, y] polygons in the artwork's pixel space
// (0,0 = top-left, artwork is 2460 x 1600). A stair's `group` is shared by
// the stairs on each floor that belong to the same staircase.
//
// Notes on the artwork:
// - Redrawn in the Senior High style from the original plans, 1.6x larger.
// - Floor 1 has two rooms labeled "Material Testing Laboratory".
// - "CE Lobby" is an open area, mapped as a clickable rectangle.

export const CE_BUILDING_ARTWORK_SIZE = { width: 2460, height: 1600 };

export const CE_BUILDING_FLOORS = [
  {
    id: "floor1",
    label: "1st Floor",
    artworkFile: "ce-building-floor1.svg",
    // Wider than the other floors: room for the entrance label outside the wall.
    artworkSize: { width: 2760, height: 1600 },
    // Where people walk in (directions start here): the "Entrance" arrow.
    entrance: [2318, 1392],
    rooms: [
      { id: "ce1_drawing_room_1", name: "Drawing Room", polygon: [[116.4, 148], [607.6, 148], [607.6, 511.2], [116.4, 511.2]], photos: [] },
      { id: "ce1_soil_laboratory_2", name: "Soil Laboratory", polygon: [[649.2, 148], [964.4, 148], [964.4, 511.2], [649.2, 511.2]], photos: [] },
      { id: "ce1_material_testing_laboratory_3", name: "Material Testing Laboratory", polygon: [[1007.6, 148], [1770.8, 148], [1770.8, 511.2], [1007.6, 511.2]], photos: [] },
      { id: "ce1_ce_laboratory_custodian_office_4", name: "CE Laboratory Custodian Office", polygon: [[1820.4, 148], [2287.6, 148], [2287.6, 511.2], [1820.4, 511.2]], photos: [] },
      { id: "ce1_cr_5", name: "CR", polygon: [[116.4, 765.6], [327.6, 765.6], [327.6, 1010.4], [116.4, 1010.4]], photos: [] },
      { id: "ce1_cr_6", name: "CR", polygon: [[116.4, 1042.4], [327.6, 1042.4], [327.6, 1287.2], [116.4, 1287.2]], photos: [] },
      { id: "ce1_taek_kwon_do_training_room_7", name: "Taek Kwon Do Training Room", polygon: [[367.6, 772], [882.8, 772], [882.8, 1287.2], [367.6, 1287.2]], photos: [] },
      { id: "ce1_material_testing_laboratory_8", name: "Material Testing Laboratory", polygon: [[1286, 765.6], [2079.6, 765.6], [2079.6, 1293.6], [1286, 1293.6]], photos: [] },
    ],
    stairs: [
      {
        id: "ce1_stair_west_to2",
        name: "West Stairs (to Floor 2)",
        group: "west",
        polygon: [[1076.4, 765.6], [1222.5, 765.6], [1222.5, 1287.7], [1076.4, 1287.7]],
        toFloorId: "floor2",
      },
      {
        id: "ce1_stair_east_to2",
        name: "East Stairs (to Floor 2)",
        group: "east",
        polygon: [[2143.6, 772], [2289.7, 772], [2289.7, 1294.1], [2143.6, 1294.1]],
        toFloorId: "floor2",
      },
    ],
  },
  {
    id: "floor2",
    label: "2nd Floor",
    artworkFile: "ce-building-floor2.svg",
    rooms: [
      { id: "ce2_cr_1", name: "CR", polygon: [[110.8, 112.8], [322, 112.8], [322, 298.4], [110.8, 298.4]], photos: [] },
      { id: "ce2_cr_2", name: "CR", polygon: [[110.8, 325.6], [322, 325.6], [322, 511.2], [110.8, 511.2]], photos: [] },
      { id: "ce2_ce_25_3", name: "CE-25", polygon: [[398.8, 148], [870.8, 148], [870.8, 511.2], [398.8, 511.2]], photos: [] },
      { id: "ce2_ce_24_4", name: "CE-24", polygon: [[890, 148], [1358.8, 148], [1358.8, 511.2], [890, 511.2]], photos: [] },
      { id: "ce2_ce_23_5", name: "CE-23", polygon: [[1378, 148], [1861.2, 148], [1861.2, 511.2], [1378, 511.2]], photos: [] },
      { id: "ce2_ce_21_6", name: "CE-21", polygon: [[1878.8, 148], [2349.2, 148], [2349.2, 511.2], [1878.8, 511.2]], photos: [] },
      { id: "ce2_ce_26_7", name: "CE-26", polygon: [[106, 765.6], [621.2, 765.6], [621.2, 1280.8], [106, 1280.8]], photos: [] },
      { id: "ce2_ce_lobby_8", name: "CE Lobby", polygon: [[629.2, 779.2], [1072.4, 779.2], [1072.4, 1292.8], [629.2, 1292.8]], photos: [] },
      { id: "ce2_ce_22_9", name: "CE-22", polygon: [[1507.6, 765.6], [2078.8, 765.6], [2078.8, 1293.6], [1507.6, 1293.6]], photos: [] },
    ],
    stairs: [
      {
        id: "ce2_stair_west_to1",
        name: "West Stairs (to Floor 1)",
        group: "west",
        polygon: [[1076.4, 765.6], [1222.5, 765.6], [1222.5, 1287.7], [1076.4, 1287.7]],
        toFloorId: "floor1",
      },
      {
        id: "ce2_stair_east_to1",
        name: "East Stairs (to Floor 1)",
        group: "east",
        polygon: [[2143.6, 772], [2289.7, 772], [2289.7, 1294.1], [2143.6, 1294.1]],
        toFloorId: "floor1",
      },
    ],
  },
];
