// Marine Engineering Building (RTS Campus) floor plans.
// Rooms and stairs are [x, y] polygons in the artwork's pixel space
// (0,0 = top-left, artwork is 1440 x 1024). A stair's `group` is shared by
// the stairs on each floor that belong to the same staircase.
// "lower" connects floors 1-2, "upper" connects floors 2-3.

export const MARINE_BUILDING_ARTWORK_SIZE = { width: 1440, height: 1024 };

export const MARINE_BUILDING_FLOORS = [
  {
    id: "floor1",
    label: "1st Floor",
    artworkFile: "marine-building-floor1.svg",
    rooms: [
      {
        id: "mb1_marine_administration_office_1",
        name: "Marine Administration Office",
        polygon: [[200.5, 247.5], [459.5, 247.5], [459.5, 429.5], [200.5, 429.5]],
        photos: [],
      },
      {
        id: "mb1_medical_dental_clinic_2",
        name: "Medical/ Dental Clinic (RTS Campus)",
        polygon: [[516.5, 247.5], [729.5, 247.5], [729.5, 429.5], [516.5, 429.5]],
        photos: [],
      },
      {
        id: "mb1_13m_3",
        name: "13M",
        polygon: [[744.5, 247.5], [957.5, 247.5], [957.5, 429.5], [744.5, 429.5]],
        photos: [],
      },
      {
        id: "mb1_14m_4",
        name: "14M",
        polygon: [[974.5, 247.5], [1189.5, 247.5], [1189.5, 429.5], [974.5, 429.5]],
        photos: [],
      },
      {
        id: "mb1_machine_shop_5",
        name: "Machine Shop (marine)",
        polygon: [[1206.5, 237.5], [1402.5, 237.5], [1402.5, 775.5], [679.5, 775.5], [679.5, 448.5], [1206.5, 448.5]],
        photos: [],
      },
      {
        id: "mb1_gas_welding_shop_6",
        name: "Gas Welding Shop",
        polygon: [[1085, 751], [1170.5, 751], [1170.5, 929.5], [679.5, 929.5], [679.5, 780.5], [1085, 780.5]],
        photos: [],
      },
      {
        id: "mb1_mock_engine_room_7",
        name: "Mock Engine Room",
        polygon: [[298.5, 625.5], [666.5, 625.5], [666.5, 775.5], [298.5, 775.5]],
        photos: [],
      },
      {
        id: "mb1_cr_8",
        name: "CR (marine building)",
        polygon: [[272.5, 822.5], [587.5, 822.5], [587.5, 929.5], [272.5, 929.5]],
        photos: [],
      },
    ],
    stairs: [
      {
        id: "mb1_stair_lower_to2",
        name: "Stairs (to Floor 2)",
        group: "lower",
        polygon: [[196.6, 569.5], [292.6, 569.5], [292.6, 776.5], [196.6, 776.5]],
        toFloorId: "floor2",
      },
    ],
  },
  {
    id: "floor2",
    label: "2nd Floor",
    artworkFile: "marine-building-floor2.svg",
    rooms: [
      {
        id: "mb2_shipboard_training_office_1",
        name: "Shipboard Training Office",
        polygon: [[28.5, 78.5], [284.5, 78.5], [284.5, 391.5], [28.5, 391.5]],
        photos: [],
      },
      {
        id: "mb2_simulator_room_2",
        name: "Simulator Room",
        polygon: [[313.5, 75.5], [565.5, 75.5], [565.5, 391.5], [313.5, 391.5]],
        photos: [],
      },
      {
        id: "mb2_23m_3",
        name: "23M",
        polygon: [[594.5, 75.5], [845.5, 75.5], [845.5, 391.5], [594.5, 391.5]],
        photos: [],
      },
      {
        id: "mb2_25m_4",
        name: "25M",
        polygon: [[877.5, 75.5], [1128.5, 75.5], [1128.5, 391.5], [877.5, 391.5]],
        photos: [],
      },
      {
        id: "mb2_27m_5",
        name: "27M",
        polygon: [[1157.5, 72.5], [1409.5, 72.5], [1409.5, 388.5], [1157.5, 388.5]],
        photos: [],
      },
      {
        id: "mb2_22m_6",
        name: "22M",
        polygon: [[386.5, 587.5], [657.5, 587.5], [657.5, 872.5], [386.5, 872.5]],
        photos: [],
      },
      {
        id: "mb2_24m_7",
        name: "24M",
        polygon: [[689.5, 587.5], [959.5, 587.5], [959.5, 872.5], [689.5, 872.5]],
        photos: [],
      },
      {
        id: "mb2_26m_drafting_room_avr_8",
        name: "26M - Drafting Room/AVR",
        polygon: [[984.5, 587.5], [1409.5, 587.5], [1409.5, 872.5], [984.5, 872.5]],
        photos: [],
      },
    ],
    stairs: [
      {
        id: "mb2_stair_lower_to1",
        name: "Stairs (to Floor 1)",
        group: "lower",
        polygon: [[265.3, 663.4], [354.2, 663.4], [354.2, 870.5], [265.3, 870.5]],
        toFloorId: "floor1",
      },
      {
        id: "mb2_stair_upper_to3",
        name: "Stairs (to Floor 3)",
        group: "upper",
        polygon: [[139.0, 665.1], [227.9, 665.1], [227.9, 872.2], [139.0, 872.2]],
        toFloorId: "floor3",
      },
    ],
  },
  {
    id: "floor3",
    label: "3rd Floor",
    artworkFile: "marine-building-floor3.svg",
    rooms: [
      {
        id: "mb3_library_1",
        name: "Library (RTS Campus)",
        polygon: [[28.5, 78.5], [1384.5, 78.5], [1384.5, 870], [331, 870], [331, 417], [28.5, 417]],
        photos: [],
      },
    ],
    stairs: [
      {
        id: "mb3_stair_upper_to2",
        name: "Stairs (to Floor 2)",
        group: "upper",
        polygon: [[172.5, 663.5], [261.4, 663.5], [261.4, 870.6], [172.5, 870.6]],
        toFloorId: "floor2",
      },
    ],
  },
];
