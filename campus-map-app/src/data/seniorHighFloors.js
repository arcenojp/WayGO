// Senior High Building (RTS Campus) floor plans.
// Rooms and stairs are [x, y] polygons in the artwork's pixel space
// (0,0 = top-left, artwork is 2460 x 1024). The building is drawn sideways:
// the north (Alumni) end is on the left and the entrance from the Marine
// Building is on the right. A stair's `group` is shared by the stairs on
// each floor that belong to the same staircase.
// Staircases are numbered 1-4 from the north end; "sN-low" connects floors
// 1-2 and "sN-up" connects floors 2-3.
//
// Notes on the artwork:
// - The 1st floor is the Figma redesign; floors 2-3 were drawn to match it.
// - The small box at the north end of floors 2-3 has no label.

const rect = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];

export const SENIOR_HIGH_ARTWORK_SIZE = { width: 2460, height: 1024 };

// Floors 2 and 3 share one layout: the classroom row (x10 ... x01, north to
// south), and four staircase slots, each with the flight up on the left and
// the flight down on the right.
const ROW_TOP = 237;
const ROW_HEIGHT = 345;
const upperClassrooms = (floorNum) =>
  [
    [10, 544, 135],
    [9, 683, 135],
    [8, 822, 135],
    [7, 1101, 150],
    [6, 1255, 150],
    [5, 1409, 150],
    [4, 1703, 135],
    [3, 1842, 135],
    [2, 1981, 135],
    [1, 2260, 195],
  ].map(([n, x, w]) => {
    const name = `HS-${floorNum}${String(n).padStart(2, "0")}`;
    return {
      id: `sh${floorNum}_${name.toLowerCase().replace("-", "_")}`,
      name,
      polygon: rect(x, ROW_TOP, w, ROW_HEIGHT),
      photos: [],
    };
  });

const STAIR_SLOTS = [410, 967, 1569, 2126];
const FLIGHT = { y: 120, w: 60, h: 380, gap: 4 };
const flight = (x) => rect(x, FLIGHT.y, FLIGHT.w, FLIGHT.h);

export const SENIOR_HIGH_FLOORS = [
  {
    id: "floor1",
    label: "1st Floor",
    artworkFile: "senior-high-floor1.svg",
    // Where people walk in (directions start here): "Entrance from Marine Building".
    entrance: [2420, 680],
    rooms: [
      { id: "sh1_alumni_office", name: "Alumni Office", polygon: rect(7, 237, 189, 257), photos: [] },
      { id: "sh1_alumni_d", name: "Alumni D", polygon: rect(203, 239, 137, 247), photos: [] },
      { id: "sh1_alumni_c", name: "Alumni C", polygon: rect(346, 238, 137, 248), photos: [] },
      { id: "sh1_alumni_b", name: "Alumni B", polygon: rect(2, 644, 137, 258), photos: [] },
      { id: "sh1_alumni_a", name: "Alumni A", polygon: rect(149, 644, 137, 258), photos: [] },
      { id: "sh1_cr_female_north", name: "CR Female", polygon: rect(286, 659, 176, 85), photos: [] },
      { id: "sh1_cr_male_north", name: "CR Male", polygon: rect(292, 776, 164, 81), photos: [] },
      { id: "sh1_elevator", name: "Elevator", polygon: rect(496, 720, 173, 196), photos: [] },
      { id: "sh1_hs_110", name: "HS-110", polygon: rect(566, 238, 145, 345), photos: [] },
      { id: "sh1_hs_109", name: "HS-109", polygon: rect(714, 237, 145, 345), photos: [] },
      { id: "sh1_hs_108", name: "HS-108", polygon: rect(862, 235, 145, 345), photos: [] },
      { id: "sh1_hs_107", name: "HS-107", polygon: rect(1142, 235, 145, 345), photos: [] },
      { id: "sh1_hs_106", name: "HS-106", polygon: rect(1288, 235, 145, 345), photos: [] },
      { id: "sh1_hs_105", name: "HS-105", polygon: rect(1435, 235, 145, 345), photos: [] },
      { id: "sh1_cr_female_south", name: "CR Female", polygon: rect(1583, 261, 90, 205), photos: [] },
      { id: "sh1_cr_male_south", name: "CR Male", polygon: rect(1582, 483, 90, 205), photos: [] },
      { id: "sh1_hs_104", name: "HS-104", polygon: rect(1793, 246, 145, 346), photos: [] },
      { id: "sh1_hs_103", name: "HS-103", polygon: rect(1942, 246, 145, 346), photos: [] },
      { id: "sh1_hs_102", name: "HS-102", polygon: rect(2090, 245, 145, 346), photos: [] },
      { id: "sh1_hs_101", name: "HS-101", polygon: rect(2315, 244, 145, 346), photos: [] },
    ],
    stairs: [
      [1, rect(490, 137, 72, 355)],
      [2, rect(1011, 136, 70, 373)],
      [3, rect(1720, 134, 72, 372)],
      [4, rect(2240, 112, 70, 373)],
    ].map(([n, polygon]) => ({
      id: `sh1_stair_${n}_to2`,
      name: `Stairs ${n} (to Floor 2)`,
      group: `s${n}-low`,
      polygon,
      toFloorId: "floor2",
    })),
  },
  {
    id: "floor2",
    label: "2nd Floor",
    artworkFile: "senior-high-floor2.svg",
    rooms: [
      { id: "sh2_shs_lab_1", name: "SHS LAB-1", polygon: rect(7, 237, 393, 248), photos: [] },
      { id: "sh2_room_unlabeled", name: "Room (unlabeled)", polygon: rect(7, 505, 120, 122), photos: [] },
      { id: "sh2_shs_lab_2", name: "SHS LAB-2", polygon: rect(2, 644, 460, 258), photos: [] },
      { id: "sh2_elevator", name: "Elevator", polygon: rect(496, 720, 173, 196), photos: [] },
      ...upperClassrooms(2),
    ],
    stairs: STAIR_SLOTS.flatMap((x, i) => [
      {
        id: `sh2_stair_${i + 1}_to3`,
        name: `Stairs ${i + 1} (to Floor 3)`,
        group: `s${i + 1}-up`,
        polygon: flight(x),
        toFloorId: "floor3",
      },
      {
        id: `sh2_stair_${i + 1}_to1`,
        name: `Stairs ${i + 1} (to Floor 1)`,
        group: `s${i + 1}-low`,
        polygon: flight(x + FLIGHT.w + FLIGHT.gap),
        toFloorId: "floor1",
      },
    ]),
  },
  {
    id: "floor3",
    label: "3rd Floor",
    artworkFile: "senior-high-floor3.svg",
    rooms: [
      { id: "sh3_shs_lab_3", name: "SHS LAB-3", polygon: rect(7, 237, 393, 248), photos: [] },
      { id: "sh3_room_unlabeled", name: "Room (unlabeled)", polygon: rect(7, 505, 120, 122), photos: [] },
      { id: "sh3_shs_lab_4", name: "SHS LAB-4", polygon: rect(2, 644, 460, 258), photos: [] },
      { id: "sh3_elevator", name: "Elevator", polygon: rect(496, 720, 173, 196), photos: [] },
      ...upperClassrooms(3),
    ],
    // Each flight down sits over the 2nd floor's flight up.
    stairs: STAIR_SLOTS.map((x, i) => ({
      id: `sh3_stair_${i + 1}_to2`,
      name: `Stairs ${i + 1} (to Floor 2)`,
      group: `s${i + 1}-up`,
      polygon: flight(x),
      toFloorId: "floor2",
    })),
  },
];
