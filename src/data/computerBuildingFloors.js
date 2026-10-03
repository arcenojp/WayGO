// Computer Building (RTS Campus) floor plans.
// Rooms and stairs are [x, y] polygons in the artwork's pixel space
// (0,0 = top-left, artwork is 1440 x 1727). A stair's `group` is shared by
// the stairs on each floor that belong to the same staircase.
//
// Notes on the source artwork:
// - A stray hallway-sized shape that appears on every floor was left out.
// - Floor 2's bottom staircase is labeled "1st Floor", but floor 1 has no
//   matching landing.

export const COMPUTER_BUILDING_ARTWORK_SIZE = { width: 1440, height: 1727 };

export const COMPUTER_BUILDING_FLOORS = [
  {
    id: "floor1",
    label: "1st Floor",
    artworkFile: "computer-building-floor1.svg",
    rooms: [
      {
        id: "cb1_compe__it_faculty_room_1",
        name: "CompE/ IT Faculty Room",
        polygon: [[797.5, 1246.5], [1325.5, 1246.5], [1325.5, 1494.5], [797.5, 1494.5]],
        photos: [],
      },
      {
        id: "cb1_cb_12_2",
        name: "CB-12",
        polygon: [[797.5, 825.5], [1325.5, 825.5], [1325.5, 1241.5], [797.5, 1241.5]],
        photos: [],
      },
      {
        id: "cb1_cb_14_3",
        name: "CB-14",
        polygon: [[797.5, 222.5], [1325.5, 222.5], [1325.5, 656.5], [797.5, 656.5]],
        photos: [],
      },
      {
        id: "cb1_computer_custodian_office_4",
        name: "Computer Custodian Office",
        polygon: [[938.5, 661.5], [1325.5, 661.5], [1325.5, 820.5], [938.5, 820.5]],
        photos: [],
      },
      {
        id: "cb1_it_laboratory_5",
        name: "IT Laboratory",
        polygon: [[129.5, 688.5], [619.5, 688.5], [619.5, 1150.5], [129.5, 1150.5]],
        photos: [],
      },
      {
        id: "cb1_microprocessor_laboratory_6",
        name: "Microprocessor Laboratory",
        polygon: [[129.5, 222.5], [619.5, 222.5], [619.5, 683.5], [129.5, 683.5]],
        photos: [],
      },
      {
        id: "cb1_cr_female_7",
        name: "CR FEMALE",
        polygon: [[385.5, 87.5], [619.5, 87.5], [619.5, 182.5], [385.5, 182.5]],
        photos: [],
      },
      {
        id: "cb1_cr_male_8",
        name: "CR MALE",
        polygon: [[128.5, 87.5], [362.5, 87.5], [362.5, 182.5], [128.5, 182.5]],
        photos: [],
      },
    ],
    stairs: [
      {
        id: "cb1_stair_top_to2",
        name: "Main Stairs (to Floor 2)",
        group: "top",
        polygon: [[908.5, 108.5], [1325.5, 108.5], [1325.5, 204.5], [908.5, 204.5]],
        toFloorId: "floor2",
      },
    ],
  },
  {
    id: "floor2",
    label: "2nd Floor",
    artworkFile: "computer-building-floor2.svg",
    rooms: [
      {
        id: "cb2_cr_female_1",
        name: "CR FEMALE",
        polygon: [[385.5, 106.5], [619.5, 106.5], [619.5, 201.5], [385.5, 201.5]],
        photos: [],
      },
      {
        id: "cb2_cr_male_2",
        name: "CR MALE",
        polygon: [[128.5, 106.5], [362.5, 106.5], [362.5, 201.5], [128.5, 201.5]],
        photos: [],
      },
      {
        id: "cb2_cb_27_it_faculty_6",
        name: "CB-27\nIT Faculty",
        polygon: [[128.5, 1191.5], [619.5, 1191.5], [619.5, 1491.5], [128.5, 1491.5]],
        photos: [],
      },
      {
        id: "cb2_cb_23_7",
        name: "CB-23",
        polygon: [[128.5, 549.5], [619.5, 549.5], [619.5, 849.5], [128.5, 849.5]],
        photos: [],
      },
      {
        id: "cb2_cb_21_8",
        name: "CB-21",
        polygon: [[128.5, 228.5], [619.5, 228.5], [619.5, 528.5], [128.5, 528.5]],
        photos: [],
      },
      {
        id: "cb2_cb_25_9",
        name: "CB-25",
        polygon: [[128.5, 870.5], [619.5, 870.5], [619.5, 1170.5], [128.5, 1170.5]],
        photos: [],
      },
      {
        id: "cb2_cb_26_drawing_room_10",
        name: "CB-26 Drawing Room",
        polygon: [[802.5, 899.5], [1329.5, 899.5], [1329.5, 1447.5], [802.5, 1447.5]],
        photos: [],
      },
      {
        id: "cb2_cb_24_11",
        name: "CB-24",
        polygon: [[802.5, 576.5], [1329.5, 576.5], [1329.5, 876.5], [802.5, 876.5]],
        photos: [],
      },
      {
        id: "cb2_cb_22_12",
        name: "CB-22",
        polygon: [[802.5, 255.5], [1329.5, 255.5], [1329.5, 555.5], [802.5, 555.5]],
        photos: [],
      },
    ],
    stairs: [
      {
        id: "cb2_stair_top_to1",
        name: "Main Stairs (to Floor 1)",
        group: "top",
        polygon: [[1014.5, 127.5], [1329.5, 127.5], [1329.5, 223.5], [1014.5, 223.5]],
        toFloorId: "floor1",
      },
      {
        id: "cb2_stair_bottom_to1",
        name: "Secondary Stairs (to Floor 1)",
        group: "bottom",
        polygon: [[897.5, 1462.5], [1314.5, 1462.5], [1314.5, 1558.5], [897.5, 1558.5]],
        toFloorId: "floor1",
      },
      {
        id: "cb2_stair_bottom_to3",
        name: "Secondary Stairs (to Floor 3)",
        group: "bottom",
        polygon: [[897.5, 1581.5], [1314.5, 1581.5], [1314.5, 1677.5], [897.5, 1677.5]],
        toFloorId: "floor3",
      },
      {
        id: "cb2_stair_top_to3",
        name: "Main Stairs (to Floor 3)",
        group: "top",
        polygon: [[659.5, 16.5], [756.5, 16.5], [756.5, 191.3], [659.5, 191.3]],
        toFloorId: "floor3",
      },
    ],
  },
  {
    id: "floor3",
    label: "3rd Floor",
    artworkFile: "computer-building-floor3.svg",
    rooms: [
      {
        id: "cb3_cr_female_1",
        name: "CR FEMALE",
        polygon: [[385.5, 106.5], [619.5, 106.5], [619.5, 201.5], [385.5, 201.5]],
        photos: [],
      },
      {
        id: "cb3_cr_male_2",
        name: "CR MALE",
        polygon: [[128.5, 106.5], [362.5, 106.5], [362.5, 201.5], [128.5, 201.5]],
        photos: [],
      },
      {
        id: "cb3_cb_37_it_department_office_4",
        name: "CB-37 IT Department Office",
        polygon: [[128.5, 1191.5], [619.5, 1191.5], [619.5, 1491.5], [128.5, 1491.5]],
        photos: [],
      },
      {
        id: "cb3_cb_33_5",
        name: "CB-33",
        polygon: [[128.5, 549.5], [619.5, 549.5], [619.5, 849.5], [128.5, 849.5]],
        photos: [],
      },
      {
        id: "cb3_cb_31_6",
        name: "CB-31",
        polygon: [[128.5, 228.5], [619.5, 228.5], [619.5, 528.5], [128.5, 528.5]],
        photos: [],
      },
      {
        id: "cb3_cb_35_7",
        name: "CB-35",
        polygon: [[128.5, 870.5], [619.5, 870.5], [619.5, 1170.5], [128.5, 1170.5]],
        photos: [],
      },
      {
        id: "cb3_cb_36_design_room_8",
        name: "CB-36 Design Room",
        polygon: [[802.5, 899.5], [1329.5, 899.5], [1329.5, 1447.5], [802.5, 1447.5]],
        photos: [],
      },
      {
        id: "cb3_cb_34_9",
        name: "CB-34",
        polygon: [[802.5, 576.5], [1329.5, 576.5], [1329.5, 876.5], [802.5, 876.5]],
        photos: [],
      },
      {
        id: "cb3_cb_32_10",
        name: "CB-32",
        polygon: [[802.5, 255.5], [1329.5, 255.5], [1329.5, 555.5], [802.5, 555.5]],
        photos: [],
      },
    ],
    stairs: [
      {
        id: "cb3_stair_bottom_to2",
        name: "Secondary Stairs (to Floor 2)",
        group: "bottom",
        polygon: [[897.5, 1581.5], [1314.5, 1581.5], [1314.5, 1677.5], [897.5, 1677.5]],
        toFloorId: "floor2",
      },
      {
        id: "cb3_stair_top_to2",
        name: "Main Stairs (to Floor 2)",
        group: "top",
        polygon: [[662.5, 20.5], [759.5, 20.5], [759.5, 195.3], [662.5, 195.3]],
        toFloorId: "floor2",
      },
    ],
  },
];