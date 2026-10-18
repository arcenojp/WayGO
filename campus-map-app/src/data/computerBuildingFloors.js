// Computer Building (RTS Campus) floor plans.
// Rooms and stairs are [x, y] polygons in the artwork's pixel space
// (0,0 = top-left, artwork is 1520 x 1850). A stair's `group` is shared by
// the stairs on each floor that belong to the same staircase.
//
// Notes on the artwork:
// - Redrawn in the Senior High style from the original plans.
// - The old plans had no hallway to the CR MALE rooms; a passage in front of
//   the CRs was added so directions can reach them.
// - Floor 1 is drawn about 100px further left than floors 2 and 3; each
//   floor's polygons match its own artwork.

export const COMPUTER_BUILDING_ARTWORK_SIZE = { width: 1520, height: 1850 };

export const COMPUTER_BUILDING_FLOORS = [
  {
    id: "floor1",
    label: "1st Floor",
    artworkFile: "computer-building-floor1.svg",
    // Wider than the other floors: room for the entrance label outside the wall.
    artworkSize: { width: 1700, height: 1850 },
    // Where people walk in (directions start here): the "Entrance" arrow.
    entrance: [1440, 1725],
    rooms: [
      { id: "cb1_compe__it_faculty_room_1", name: "CompE/ IT Faculty Room", polygon: [[735.5, 1299.5], [1263.5, 1299.5], [1263.5, 1547.5], [831, 1547.5], [831, 1641], [735.5, 1641]], photos: [] },
      { id: "cb1_cb_12_2", name: "CB-12", polygon: [[735.5, 878.5], [1263.5, 878.5], [1263.5, 1294.5], [735.5, 1294.5]], photos: [] },
      { id: "cb1_cb_14_3", name: "CB-14", polygon: [[735.5, 275.5], [1263.5, 275.5], [1263.5, 709.5], [735.5, 709.5]], photos: [] },
      { id: "cb1_computer_custodian_office_4", name: "Computer Custodian Office", polygon: [[876.5, 714.5], [1263.5, 714.5], [1263.5, 873.5], [876.5, 873.5]], photos: [] },
      { id: "cb1_it_laboratory_5", name: "IT Laboratory", polygon: [[63.5, 762.5], [553.5, 762.5], [553.5, 1224.5], [63.5, 1224.5]], photos: [] },
      { id: "cb1_microprocessor_laboratory_6", name: "Microprocessor Laboratory", polygon: [[63.5, 296.5], [553.5, 296.5], [553.5, 757.5], [63.5, 757.5]], photos: [] },
      { id: "cb1_cr_female_7", name: "CR FEMALE", polygon: [[319.5, 161.5], [553.5, 161.5], [553.5, 246.5], [319.5, 246.5]], photos: [] },
      { id: "cb1_cr_male_8", name: "CR MALE", polygon: [[62.5, 161.5], [296.5, 161.5], [296.5, 246.5], [62.5, 246.5]], photos: [] },
    ],
    stairs: [
      {
        id: "cb1_stair_top_to2",
        name: "Main Stairs (to Floor 2)",
        group: "top",
        polygon: [[842.5, 161.5], [1259.5, 161.5], [1259.5, 257.5], [842.5, 257.5]],
        toFloorId: "floor2",
      },
      {
        id: "cb1_stair_bottom_to2",
        name: "Secondary Stairs (to Floor 2)",
        group: "bottom",
        polygon: [[829.5, 1545.5], [1272.5, 1545.5], [1272.5, 1641.5], [829.5, 1641.5]],
        toFloorId: "floor2",
      },
    ],
  },
  {
    id: "floor2",
    label: "2nd Floor",
    artworkFile: "computer-building-floor2.svg",
    rooms: [
      { id: "cb2_cr_female_1", name: "CR FEMALE", polygon: [[425.5, 160], [659.5, 160], [659.5, 240], [425.5, 240]], photos: [] },
      { id: "cb2_cr_male_2", name: "CR MALE", polygon: [[168.5, 160], [402.5, 160], [402.5, 240], [168.5, 240]], photos: [] },
      { id: "cb2_cb_27_it_faculty_6", name: "CB-27\nIT Faculty", polygon: [[168.5, 1251.5], [659.5, 1251.5], [659.5, 1551.5], [168.5, 1551.5]], photos: [] },
      { id: "cb2_cb_23_7", name: "CB-23", polygon: [[168.5, 609.5], [659.5, 609.5], [659.5, 909.5], [168.5, 909.5]], photos: [] },
      { id: "cb2_cb_21_8", name: "CB-21", polygon: [[168.5, 288.5], [659.5, 288.5], [659.5, 588.5], [168.5, 588.5]], photos: [] },
      { id: "cb2_cb_25_9", name: "CB-25", polygon: [[168.5, 930.5], [659.5, 930.5], [659.5, 1230.5], [168.5, 1230.5]], photos: [] },
      { id: "cb2_cb_26_drawing_room_10", name: "CB-26 Drawing Room", polygon: [[842.5, 959.5], [1369.5, 959.5], [1369.5, 1507.5], [842.5, 1507.5]], photos: [] },
      { id: "cb2_cb_24_11", name: "CB-24", polygon: [[842.5, 636.5], [1369.5, 636.5], [1369.5, 936.5], [842.5, 936.5]], photos: [] },
      { id: "cb2_cb_22_12", name: "CB-22", polygon: [[842.5, 315.5], [1369.5, 315.5], [1369.5, 615.5], [842.5, 615.5]], photos: [] },
    ],
    stairs: [
      {
        id: "cb2_stair_top_to1",
        name: "Main Stairs (to Floor 1)",
        group: "top",
        polygon: [[1054.5, 187.5], [1369.5, 187.5], [1369.5, 283.5], [1054.5, 283.5]],
        toFloorId: "floor1",
      },
      {
        id: "cb2_stair_bottom_to1",
        name: "Secondary Stairs (to Floor 1)",
        group: "bottom",
        polygon: [[937.5, 1522.5], [1354.5, 1522.5], [1354.5, 1618.5], [937.5, 1618.5]],
        toFloorId: "floor1",
      },
      {
        id: "cb2_stair_bottom_to3",
        name: "Secondary Stairs (to Floor 3)",
        group: "bottom",
        polygon: [[937.5, 1641.5], [1354.5, 1641.5], [1354.5, 1737.5], [937.5, 1737.5]],
        toFloorId: "floor3",
      },
      {
        id: "cb2_stair_top_to3",
        name: "Main Stairs (to Floor 3)",
        group: "top",
        polygon: [[699.5, 76.5], [796.5, 76.5], [796.5, 251.3], [699.5, 251.3]],
        toFloorId: "floor3",
      },
    ],
  },
  {
    id: "floor3",
    label: "3rd Floor",
    artworkFile: "computer-building-floor3.svg",
    rooms: [
      { id: "cb3_cr_female_1", name: "CR FEMALE", polygon: [[425.5, 160], [659.5, 160], [659.5, 240], [425.5, 240]], photos: [] },
      { id: "cb3_cr_male_2", name: "CR MALE", polygon: [[168.5, 160], [402.5, 160], [402.5, 240], [168.5, 240]], photos: [] },
      { id: "cb3_cb_37_it_department_office_4", name: "CB-37 IT Department Office", polygon: [[168.5, 1251.5], [659.5, 1251.5], [659.5, 1551.5], [168.5, 1551.5]], photos: [] },
      { id: "cb3_cb_33_5", name: "CB-33", polygon: [[168.5, 609.5], [659.5, 609.5], [659.5, 909.5], [168.5, 909.5]], photos: [] },
      { id: "cb3_cb_31_6", name: "CB-31", polygon: [[168.5, 288.5], [659.5, 288.5], [659.5, 588.5], [168.5, 588.5]], photos: [] },
      { id: "cb3_cb_35_7", name: "CB-35", polygon: [[168.5, 930.5], [659.5, 930.5], [659.5, 1230.5], [168.5, 1230.5]], photos: [] },
      { id: "cb3_cb_36_design_room_8", name: "CB-36 Design Room", polygon: [[842.5, 959.5], [1369.5, 959.5], [1369.5, 1507.5], [842.5, 1507.5]], photos: [] },
      { id: "cb3_cb_34_9", name: "CB-34", polygon: [[842.5, 636.5], [1369.5, 636.5], [1369.5, 936.5], [842.5, 936.5]], photos: [] },
      { id: "cb3_cb_32_10", name: "CB-32", polygon: [[842.5, 315.5], [1369.5, 315.5], [1369.5, 615.5], [842.5, 615.5]], photos: [] },
    ],
    stairs: [
      {
        id: "cb3_stair_bottom_to2",
        name: "Secondary Stairs (to Floor 2)",
        group: "bottom",
        polygon: [[937.5, 1641.5], [1354.5, 1641.5], [1354.5, 1737.5], [937.5, 1737.5]],
        toFloorId: "floor2",
      },
      {
        id: "cb3_stair_top_to2",
        name: "Main Stairs (to Floor 2)",
        group: "top",
        polygon: [[702.5, 80.5], [799.5, 80.5], [799.5, 255.3], [702.5, 255.3]],
        toFloorId: "floor2",
      },
    ],
  },
];
