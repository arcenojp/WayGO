// Senior High Building (RTS Campus) floor plans.
// Rooms and stairs are [x, y] polygons in the artwork's pixel space
// (0,0 = top-left, artwork is 997 x 3689). A stair's `group` is shared by
// the stairs on each floor that belong to the same staircase.
// Staircases are numbered 1-4 from the north (Alumni) end; "sN-low"
// connects floors 1-2 and "sN-up" connects floors 2-3.
//
// Notes on the source artwork:
// - All 3rd-floor stairs are labeled "3rd Floor"; they lead to floor 2.
// - Floor 1 has a hidden duplicate of the north CR boxes; it was left out.
// - The small box between the SHS labs on floors 2-3 has no label.

const rect = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];

export const SENIOR_HIGH_ARTWORK_SIZE = { width: 997, height: 3689 };

// Classroom column shared by floors 2 and 3, top to bottom: x10 ... x01.
const upperClassrooms = (floorNum) =>
  [
    [10, 434.5, 857.5, 257],
    [9, 434.5, 1066.5, 257],
    [8, 434.5, 1275.5, 257],
    [7, 434.5, 1734.5, 257],
    [6, 434.5, 1943.5, 257],
    [5, 434.5, 2152.5, 257],
    [4, 424.5, 2611.5, 258],
    [3, 424.5, 2820.5, 258],
    [2, 424.5, 3029.5, 258],
    [1, 429.5, 3476.5, 258],
  ].map(([n, x, y, w]) => {
    const name = `HS-${floorNum}${String(n).padStart(2, "0")}`;
    return {
      id: `sh${floorNum}_${name.toLowerCase().replace("-", "_")}`,
      name,
      polygon: rect(x, y, w, 204),
      photos: [],
    };
  });

const STAIR = { w: 279, h: 97.5 };

export const SENIOR_HIGH_FLOORS = [
  {
    id: "floor1",
    label: "1st Floor",
    artworkFile: "senior-high-floor1.svg",
    rooms: [
      { id: "sh1_alumni_b", name: "Alumni B", polygon: rect(190.5, 49.5, 191, 193), photos: [] },
      { id: "sh1_alumni_a", name: "Alumni A", polygon: rect(190.5, 259.5, 191, 193), photos: [] },
      { id: "sh1_alumni_office", name: "Alumni Office", polygon: rect(501.5, 50.5, 190, 269), photos: [] },
      { id: "sh1_alumni_d", name: "Alumni D", polygon: rect(500.5, 370.5, 191, 193), photos: [] },
      { id: "sh1_alumni_c", name: "Alumni C", polygon: rect(500.5, 580.5, 191, 193), photos: [] },
      { id: "sh1_cr_male_north", name: "CR Male", polygon: rect(218.5, 474.5, 151, 111), photos: [] },
      { id: "sh1_cr_female_north", name: "CR Female", polygon: rect(218.5, 590.5, 151, 111), photos: [] },
      { id: "sh1_elevator", name: "Elevator", polygon: rect(177.5, 739.5, 163, 130), photos: [] },
      { id: "sh1_hs_110", name: "HS-110", polygon: rect(434.5, 900.5, 257, 204), photos: [] },
      { id: "sh1_hs_109", name: "HS-109", polygon: rect(434.5, 1109.5, 257, 204), photos: [] },
      { id: "sh1_hs_108", name: "HS-108", polygon: rect(434.5, 1318.5, 257, 204), photos: [] },
      { id: "sh1_hs_107", name: "HS-107", polygon: rect(434.5, 1718.5, 257, 204), photos: [] },
      { id: "sh1_hs_106", name: "HS-106", polygon: rect(434.5, 1927.5, 257, 204), photos: [] },
      { id: "sh1_hs_105", name: "HS-105", polygon: rect(434.5, 2136.5, 257, 204), photos: [] },
      { id: "sh1_cr_male_south", name: "CR Male", polygon: rect(351.5, 2347.5, 151, 111), photos: [] },
      { id: "sh1_cr_female_south", name: "CR Female", polygon: rect(520.5, 2347.5, 151, 111), photos: [] },
      { id: "sh1_hs_104", name: "HS-104", polygon: rect(424.5, 2654.5, 258, 204), photos: [] },
      { id: "sh1_hs_103", name: "HS-103", polygon: rect(424.5, 2863.5, 258, 204), photos: [] },
      { id: "sh1_hs_102", name: "HS-102", polygon: rect(424.5, 3072.5, 258, 204), photos: [] },
      { id: "sh1_hs_101", name: "HS-101", polygon: rect(424.5, 3419.5, 258, 204), photos: [] },
    ],
    stairs: [
      [1, 501.5, 788.5],
      [2, 488.7, 1545.5],
      [3, 488.7, 2534.5],
      [4, 509.5, 3299.5],
    ].map(([n, x, y]) => ({
      id: `sh1_stair_${n}_to2`,
      name: `Stairs ${n} (to Floor 2)`,
      group: `s${n}-low`,
      polygon: rect(x, y, STAIR.w, STAIR.h),
      toFloorId: "floor2",
    })),
  },
  {
    id: "floor2",
    label: "2nd Floor",
    artworkFile: "senior-high-floor2.svg",
    rooms: [
      { id: "sh2_shs_lab_2", name: "SHS LAB-2", polygon: rect(181.5, 240.5, 191, 385), photos: [] },
      { id: "sh2_room_unlabeled", name: "Room (unlabeled)", polygon: rect(382.5, 240.5, 110, 152), photos: [] },
      { id: "sh2_shs_lab_1", name: "SHS LAB-1", polygon: rect(502.5, 240.5, 190, 376), photos: [] },
      { id: "sh2_elevator", name: "Elevator", polygon: rect(181.5, 675.5, 163, 128), photos: [] },
      ...upperClassrooms(2),
    ],
    stairs: [
      // [staircase, x, y of flight to 3rd, y of flight to 1st]
      [1, 499.5, 629.5, 501.5, 745.5],
      [2, 488.7, 1502.5, 488.5, 1617.5],
      [3, 490.5, 2375.5, 488.7, 2491.5],
      [4, 477.5, 3249.5, 476.5, 3361.5],
    ].flatMap(([n, upX, upY, lowX, lowY]) => [
      {
        id: `sh2_stair_${n}_to3`,
        name: `Stairs ${n} (to Floor 3)`,
        group: `s${n}-up`,
        polygon: rect(upX, upY, STAIR.w, STAIR.h),
        toFloorId: "floor3",
      },
      {
        id: `sh2_stair_${n}_to1`,
        name: `Stairs ${n} (to Floor 1)`,
        group: `s${n}-low`,
        polygon: rect(lowX, lowY, STAIR.w, STAIR.h),
        toFloorId: "floor1",
      },
    ]),
  },
  {
    id: "floor3",
    label: "3rd Floor",
    artworkFile: "senior-high-floor3.svg",
    rooms: [
      { id: "sh3_shs_lab_4", name: "SHS LAB-4", polygon: rect(181.5, 240.5, 191, 385), photos: [] },
      { id: "sh3_room_unlabeled", name: "Room (unlabeled)", polygon: rect(382.5, 240.5, 110, 152), photos: [] },
      { id: "sh3_shs_lab_3", name: "SHS LAB-3", polygon: rect(502.5, 240.5, 190, 376), photos: [] },
      { id: "sh3_elevator", name: "Elevator", polygon: rect(181.5, 675.5, 163, 128), photos: [] },
      ...upperClassrooms(3),
    ],
    stairs: [
      [1, 500.5, 705.5],
      [2, 487.5, 1575.5],
      [3, 488.5, 2456.5],
      [4, 480.5, 3319.5],
    ].map(([n, x, y]) => ({
      id: `sh3_stair_${n}_to2`,
      name: `Stairs ${n} (to Floor 2)`,
      group: `s${n}-up`,
      polygon: rect(x, y, STAIR.w, STAIR.h),
      toFloorId: "floor2",
    })),
  },
];
