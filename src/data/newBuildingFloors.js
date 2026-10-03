// New Building (RTS Campus) floor plans.
// Rooms and stairs are [x, y] polygons in the artwork's pixel space
// (0,0 = top-left). A stair's `group` is shared by
// the stairs on each floor that belong to the same staircase.
// Floor 1's artwork is 1440 x 1024; floors 2-3 are 2022 x 1024, so each
// floor sets its own artworkSize. "lower" connects floors 1-2, "upper"
// connects floors 2-3. Fire exits lead outside, so they're rooms, not stairs.
//
// Note: floors 2 and 3 both have rooms labeled "R6" and "R7".

const rect = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];

export const NEW_BUILDING_ARTWORK_SIZE = { width: 2022, height: 1024 };

export const NEW_BUILDING_FLOORS = [
  {
    id: "floor1",
    label: "1st Floor",
    artworkFile: "new-building-floor1.svg",
    artworkSize: { width: 1440, height: 1024 },
    rooms: [
      { id: "nb1_cr_male_1", name: "CR MALE", polygon: rect(114.5, 146.5, 129, 95), photos: [] },
      { id: "nb1_cr_female_2", name: "CR FEMALE", polygon: rect(271.5, 146.5, 129, 95), photos: [] },
      { id: "nb1_faculty_3", name: "Faculty", polygon: rect(109.5, 267.5, 345, 449), photos: [] },
      { id: "nb1_coe_deans_office_4", name: "Coe Deans Office", polygon: rect(592.5, 146.5, 309, 590), photos: [] },
      { id: "nb1_r1_5", name: "R1", polygon: rect(1044.5, 146.5, 301, 294), photos: [] },
      { id: "nb1_r2_6", name: "R2", polygon: rect(1044.5, 445.5, 301, 292), photos: [] },
      { id: "nb1_elevator_7", name: "Elevator", polygon: rect(115.5, 731.5, 208, 148), photos: [] },
    ],
    stairs: [
      {
        id: "nb1_stair_lower_to2",
        name: "Stairs (to Floor 2)",
        group: "lower",
        polygon: rect(606.5, 761.5, 303.5, 98.1),
        toFloorId: "floor2",
      },
    ],
  },
  {
    id: "floor2",
    label: "2nd Floor",
    artworkFile: "new-building-floor2.svg",
    rooms: [
      { id: "nb2_r6_1", name: "R6", polygon: rect(191.5, 147.5, 309, 285), photos: [] },
      { id: "nb2_r7_2", name: "R7", polygon: rect(191.5, 437.5, 309, 284), photos: [] },
      { id: "nb2_cr_male_3", name: "CR MALE", polygon: rect(651.5, 155.5, 129, 95), photos: [] },
      { id: "nb2_cr_female_4", name: "CR FEMALE", polygon: rect(808.5, 155.5, 129, 95), photos: [] },
      { id: "nb2_r5_5", name: "R5", polygon: rect(651.5, 305.5, 335, 391), photos: [] },
      { id: "nb2_conference_room_6", name: "Conference Room", polygon: rect(1141.5, 155.5, 285, 541), photos: [] },
      { id: "nb2_r4_7", name: "R4", polygon: rect(1594.5, 155.5, 301, 269), photos: [] },
      { id: "nb2_r3_8", name: "R3", polygon: rect(1594.5, 429.5, 301, 267), photos: [] },
      { id: "nb2_elevator_9", name: "Elevator", polygon: rect(654.5, 718.5, 208, 148), photos: [] },
      { id: "nb2_fire_exit_10", name: "Fire Exit", polygon: rect(1015, 44, 96.3, 99), photos: [] },
    ],
    stairs: [
      {
        id: "nb2_stair_lower_to1",
        name: "Stairs (to Floor 1)",
        group: "lower",
        polygon: rect(1140.5, 724.5, 303.5, 98.1),
        toFloorId: "floor1",
      },
      {
        id: "nb2_stair_upper_to3",
        name: "Stairs (to Floor 3)",
        group: "upper",
        polygon: rect(1141.5, 839.5, 303.5, 98.1),
        toFloorId: "floor3",
      },
    ],
  },
  {
    id: "floor3",
    label: "3rd Floor",
    artworkFile: "new-building-floor3.svg",
    rooms: [
      { id: "nb3_r6_1", name: "R6", polygon: rect(145.5, 153.5, 301, 277), photos: [] },
      { id: "nb3_r7_2", name: "R7", polygon: rect(145.5, 435.5, 301, 276), photos: [] },
      { id: "nb3_audio_visual_room_3", name: "Audio Visual Room", polygon: rect(651.5, 147.5, 1192, 549), photos: [] },
      { id: "nb3_elevator_4", name: "Elevator", polygon: rect(648.5, 716.5, 214, 152), photos: [] },
      { id: "nb3_fire_exit_5", name: "Fire Exit", polygon: rect(507, 47.5, 96.3, 99), photos: [] },
    ],
    stairs: [
      {
        id: "nb3_stair_upper_to2",
        name: "Stairs (to Floor 2)",
        group: "upper",
        polygon: rect(1140.5, 724.5, 303.5, 98.1),
        toFloorId: "floor2",
      },
    ],
  },
];
