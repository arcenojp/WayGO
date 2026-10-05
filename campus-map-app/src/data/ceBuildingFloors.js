// CE Building (RTS Campus) floor plans.
// Rooms and stairs are [x, y] polygons in the artwork's pixel space
// (0,0 = top-left, artwork is 1440 x 1024). A stair's `group` is shared by
// the stairs on each floor that belong to the same staircase.
//
// Notes on the source artwork:
// - Floor 1 has two rooms labeled "Material Testing Laboratory".
// - "CE 22" is named "CE-22" to match the other room numbers.
// - "CE Lobby" is an open area, mapped as a clickable rectangle.

const rect = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];

export const CE_BUILDING_ARTWORK_SIZE = { width: 1440, height: 1024 };

export const CE_BUILDING_FLOORS = [
  {
    id: "floor1",
    label: "1st Floor",
    artworkFile: "ce-building-floor1.svg",
    rooms: [
      { id: "ce1_drawing_room_1", name: "Drawing Room", polygon: rect(24, 92.5, 307, 227), photos: [] },
      { id: "ce1_soil_laboratory_2", name: "Soil Laboratory", polygon: rect(357, 92.5, 197, 227), photos: [] },
      { id: "ce1_material_testing_laboratory_3", name: "Material Testing Laboratory", polygon: rect(581, 92.5, 477, 227), photos: [] },
      { id: "ce1_ce_laboratory_custodian_office_4", name: "CE Laboratory Custodian Office", polygon: rect(1089, 92.5, 292, 227), photos: [] },
      { id: "ce1_cr_5", name: "CR", polygon: rect(24, 478.5, 132, 153), photos: [] },
      { id: "ce1_cr_6", name: "CR", polygon: rect(24, 651.5, 132, 153), photos: [] },
      { id: "ce1_taek_kwon_do_training_room_7", name: "Taek Kwon Do Training Room", polygon: rect(181, 482.5, 322, 322), photos: [] },
      { id: "ce1_material_testing_laboratory_8", name: "Material Testing Laboratory", polygon: rect(755, 478.5, 496, 330), photos: [] },
    ],
    stairs: [
      {
        id: "ce1_stair_west_to2",
        name: "West Stairs (to Floor 2)",
        group: "west",
        polygon: rect(624, 478.5, 91.3, 326.3),
        toFloorId: "floor2",
      },
      {
        id: "ce1_stair_east_to2",
        name: "East Stairs (to Floor 2)",
        group: "east",
        polygon: rect(1291, 482.5, 91.3, 326.3),
        toFloorId: "floor2",
      },
    ],
  },
  {
    id: "floor2",
    label: "2nd Floor",
    artworkFile: "ce-building-floor2.svg",
    rooms: [
      { id: "ce2_cr_1", name: "CR", polygon: rect(20.5, 70.5, 132, 116), photos: [] },
      { id: "ce2_cr_2", name: "CR", polygon: rect(20.5, 203.5, 132, 116), photos: [] },
      { id: "ce2_ce_25_3", name: "CE-25", polygon: rect(200.5, 92.5, 295, 227), photos: [] },
      { id: "ce2_ce_24_4", name: "CE-24", polygon: rect(507.5, 92.5, 293, 227), photos: [] },
      { id: "ce2_ce_23_5", name: "CE-23", polygon: rect(812.5, 92.5, 302, 227), photos: [] },
      { id: "ce2_ce_21_6", name: "CE-21", polygon: rect(1125.5, 92.5, 294, 227), photos: [] },
      { id: "ce2_ce_26_7", name: "CE-26", polygon: rect(17.5, 478.5, 322, 322), photos: [] },
      { id: "ce2_ce_lobby_8", name: "CE Lobby", polygon: rect(344.5, 487, 277, 321), photos: [] },
      { id: "ce2_ce_22_9", name: "CE-22", polygon: rect(893.5, 478.5, 357, 330), photos: [] },
    ],
    stairs: [
      {
        id: "ce2_stair_west_to1",
        name: "West Stairs (to Floor 1)",
        group: "west",
        polygon: rect(624, 478.5, 91.3, 326.3),
        toFloorId: "floor1",
      },
      {
        id: "ce2_stair_east_to1",
        name: "East Stairs (to Floor 1)",
        group: "east",
        polygon: rect(1291, 482.5, 91.3, 326.3),
        toFloorId: "floor1",
      },
    ],
  },
];
