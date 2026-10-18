// New Building (RTS Campus) floor plans.
// Rooms and stairs are [x, y] polygons in the artwork's pixel space
// (0,0 = top-left). A stair's `group` is shared by
// the stairs on each floor that belong to the same staircase.
// Redrawn in the Senior High style from the original plans: floor 1 at 1.6x
// (2460 x 1760, its own artworkSize), floors 2-3 at 1.25x (2460 x 1400).
// "lower" connects floors 1-2, "upper" connects floors 2-3. Fire exits lead
// outside, so they're rooms, not stairs.
//
// Rooms are named "Room 1" ... "Room 11" (drawn as R1 ... R11 in the original
// plans); ids of rooms that already had photos were kept.

export const NEW_BUILDING_ARTWORK_SIZE = { width: 2460, height: 1400 };

export const NEW_BUILDING_FLOORS = [
  {
    id: "floor1",
    label: "1st Floor",
    artworkFile: "new-building-floor1.svg",
    // Where people walk in (directions start here): the "Entrance" arrow, bottom middle.
    entrance: [1214, 1592],
    artworkSize: { width: 2460, height: 1760 },
    rooms: [
      { id: "nb1_cr_male_1", name: "CR MALE", polygon: [[245.2, 226.4], [451.6, 226.4], [451.6, 378.4], [245.2, 378.4]], photos: [] },
      { id: "nb1_cr_female_2", name: "CR FEMALE", polygon: [[496.4, 226.4], [702.8, 226.4], [702.8, 378.4], [496.4, 378.4]], photos: [] },
      { id: "nb1_faculty_3", name: "Faculty", polygon: [[237.2, 420], [789.2, 420], [789.2, 1138.4], [237.2, 1138.4]], photos: [] },
      { id: "nb1_coe_deans_office_4", name: "Coe Deans Office", polygon: [[1010, 226.4], [1504.4, 226.4], [1504.4, 1170.4], [1010, 1170.4]], photos: [] },
      { id: "nb1_r1_5", name: "Room 1", polygon: [[1733.2, 226.4], [2214.8, 226.4], [2214.8, 696.8], [1733.2, 696.8]], photos: [] },
      { id: "nb1_r2_6", name: "Room 2", polygon: [[1733.2, 704.8], [2214.8, 704.8], [2214.8, 1172], [1733.2, 1172]], photos: [] },
      { id: "nb1_elevator_7", name: "Elevator", polygon: [[246.8, 1162.4], [579.6, 1162.4], [579.6, 1399.2], [246.8, 1399.2]], photos: [] },
    ],
    stairs: [
      {
        id: "nb1_stair_lower_to2",
        name: "Stairs (to Floor 2)",
        group: "lower",
        polygon: [[1032.4, 1210.4], [1518, 1210.4], [1518, 1367.4], [1032.4, 1367.4]],
        toFloorId: "floor2",
      },
    ],
  },
  {
    id: "floor2",
    label: "2nd Floor",
    artworkFile: "new-building-floor2.svg",
    rooms: [
      { id: "nb2_r6_1", name: "Room 6", polygon: [[222.9, 224.4], [609.1, 224.4], [609.1, 580.6], [222.9, 580.6]], photos: [] },
      { id: "nb2_r7_2", name: "Room 7", polygon: [[222.9, 586.9], [609.1, 586.9], [609.1, 941.9], [222.9, 941.9]], photos: [] },
      { id: "nb2_cr_male_3", name: "CR MALE", polygon: [[797.9, 234.4], [959.1, 234.4], [959.1, 353.1], [797.9, 353.1]], photos: [] },
      { id: "nb2_cr_female_4", name: "CR FEMALE", polygon: [[994.1, 234.4], [1155.4, 234.4], [1155.4, 353.1], [994.1, 353.1]], photos: [] },
      { id: "nb2_r5_5", name: "Room 5", polygon: [[797.9, 421.9], [1216.6, 421.9], [1216.6, 910.6], [797.9, 910.6]], photos: [] },
      { id: "nb2_conference_room_6", name: "Conference Room", polygon: [[1410.4, 234.4], [1766.6, 234.4], [1766.6, 910.6], [1410.4, 910.6]], photos: [] },
      { id: "nb2_r4_7", name: "Room 4", polygon: [[1976.6, 234.4], [2352.9, 234.4], [2352.9, 570.6], [1976.6, 570.6]], photos: [] },
      { id: "nb2_r3_8", name: "Room 3", polygon: [[1976.6, 576.9], [2352.9, 576.9], [2352.9, 910.6], [1976.6, 910.6]], photos: [] },
      { id: "nb2_elevator_9", name: "Elevator", polygon: [[801.6, 938.1], [1061.6, 938.1], [1061.6, 1123.1], [801.6, 1123.1]], photos: [] },
      { id: "nb2_fire_exit_left", name: "Fire Exit (left)", polygon: [[639.8, 95], [760.1, 95], [760.1, 218.8], [639.8, 218.8]], photos: [] },
      { id: "nb2_fire_exit_10", name: "Fire Exit (middle)", polygon: [[1252.3, 95], [1372.6, 95], [1372.6, 218.8], [1252.3, 218.8]], photos: [] },
      { id: "nb2_fire_exit_right", name: "Fire Exit (right)", polygon: [[1804.8, 95], [1925.1, 95], [1925.1, 218.8], [1804.8, 218.8]], photos: [] },
    ],
    stairs: [
      {
        id: "nb2_stair_lower_to1",
        name: "Stairs (to Floor 1)",
        group: "lower",
        polygon: [[1409.1, 945.6], [1788.5, 945.6], [1788.5, 1068.3], [1409.1, 1068.3]],
        toFloorId: "floor1",
      },
      {
        id: "nb2_stair_upper_to3",
        name: "Stairs (to Floor 3)",
        group: "upper",
        polygon: [[1410.4, 1089.4], [1789.8, 1089.4], [1789.8, 1212], [1410.4, 1212]],
        toFloorId: "floor3",
      },
    ],
  },
  {
    id: "floor3",
    label: "3rd Floor",
    artworkFile: "new-building-floor3.svg",
    rooms: [
      { id: "nb3_room_11", name: "Room 11", polygon: [[165.4, 231.9], [541.6, 231.9], [541.6, 578.1], [165.4, 578.1]], photos: [] },
      { id: "nb3_room_10", name: "Room 10", polygon: [[165.4, 584.4], [541.6, 584.4], [541.6, 929.4], [165.4, 929.4]], photos: [] },
      { id: "nb3_audio_visual_room_3", name: "Audio Visual Room", polygon: [[797.9, 224.4], [1644.1, 224.4], [1644.1, 910.6], [797.9, 910.6]], photos: [] },
      { id: "nb3_room_9", name: "Room 9", polygon: [[1898.5, 231.9], [2276, 231.9], [2276, 578.1], [1898.5, 578.1]], photos: [] },
      { id: "nb3_room_8", name: "Room 8", polygon: [[1898.5, 584.4], [2276, 584.4], [2276, 929.4], [1898.5, 929.4]], photos: [] },
      { id: "nb3_elevator_4", name: "Elevator", polygon: [[794.1, 935.6], [1061.6, 935.6], [1061.6, 1125.6], [794.1, 1125.6]], photos: [] },
      { id: "nb3_fire_exit_5", name: "Fire Exit (left)", polygon: [[617.3, 99.4], [737.6, 99.4], [737.6, 223.1], [617.3, 223.1]], photos: [] },
      { id: "nb3_fire_exit_right", name: "Fire Exit (right)", polygon: [[1716, 99.4], [1836.4, 99.4], [1836.4, 223.1], [1716, 223.1]], photos: [] },
    ],
    stairs: [
      {
        id: "nb3_stair_upper_to2",
        name: "Stairs (to Floor 2)",
        group: "upper",
        polygon: [[1409.1, 945.6], [1788.5, 945.6], [1788.5, 1068.3], [1409.1, 1068.3]],
        toFloorId: "floor2",
      },
    ],
  },
];
