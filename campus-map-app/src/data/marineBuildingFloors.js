// Marine Engineering Building (RTS Campus) floor plans.
// Rooms and stairs are [x, y] polygons in the artwork's pixel space
// (0,0 = top-left). The 1st floor (the Figma redesign) is 2460 x 1024;
// floors 2-3 are 2460 x 1540, redrawn in the same style from the
// original plans at 1.6x, with an elevator added on each. A stair's `group`
// is shared by the stairs on each floor that belong to the same staircase.
// "lower" connects floors 1-2, "upper" connects floors 2-3.

export const MARINE_BUILDING_ARTWORK_SIZE = { width: 2460, height: 1540 };

export const MARINE_BUILDING_FLOORS = [
  {
    id: "floor1",
    label: "1st Floor",
    artworkFile: "marine-building-floor1.svg",
    artworkSize: { width: 2460, height: 1024 },
    // Where people walk in (directions start here): the corridor opening at the bottom left.
    entrance: [567, 1005],
    rooms: [
      { id: "mb1_elevator", name: "Elevator", polygon: [[478, 141], [751, 141], [751, 296], [478, 296]], photos: [] },
      { id: "mb1_marine_administration_office_1", name: "Marine Administration Office", polygon: [[467.5, 388.5], [803.5, 388.5], [803.5, 570.5], [467.5, 570.5]], photos: [] },
      { id: "mb1_medical_dental_clinic_2", name: "Medical/ Dental Clinic (RTS Campus)", polygon: [[901, 148], [1270, 148], [1270, 377], [901, 377]], photos: [] },
      { id: "mb1_13m_3", name: "13M", polygon: [[1283, 148], [1577, 148], [1577, 335], [1283, 335]], photos: [] },
      { id: "mb1_14m_4", name: "14M", polygon: [[1592, 148], [1889, 148], [1889, 335], [1592, 335]], photos: [] },
      { id: "mb1_machine_shop_5", name: "Machine Shop (marine)", polygon: [[1277, 349], [1901.7, 349], [1901.7, 138], [2140, 138], [2140, 681], [1277, 681]], photos: [] },
      { id: "mb1_gas_welding_shop_6", name: "Gas Welding Shop", polygon: [[1199, 667.5], [1723, 667.5], [1723, 622], [1840, 622], [1840, 905], [1199, 905]], photos: [] },
      { id: "mb1_mock_engine_room_7", name: "Mock Engine Room", polygon: [[813, 386], [1270, 386], [1270, 573], [813, 573]], photos: [] },
      { id: "mb1_cr_8", name: "CR (marine building)", polygon: [[606, 878], [1020, 878], [1020, 1022], [606, 1022]], photos: [] },
    ],
    stairs: [
      {
        id: "mb1_stair_lower_to2",
        name: "Stairs (to Floor 2)",
        group: "lower",
        polygon: [[464, 650], [596, 650], [596, 806], [464, 806]],
        toFloorId: "floor2",
      },
    ],
  },
  {
    id: "floor2",
    label: "2nd Floor",
    artworkFile: "marine-building-floor2.svg",
    rooms: [
      { id: "mb2_shipboard_training_office_1", name: "Shipboard Training Office", polygon: [[118, 369.6], [468.4, 369.6], [468.4, 731.2], [118, 731.2]], photos: [] },
      { id: "mb2_elevator", name: "Elevator", polygon: [[239.6, 94.4], [553.2, 94.4], [553.2, 342.4], [239.6, 342.4]], photos: [] },
      { id: "mb2_simulator_room_2", name: "Simulator Room", polygon: [[579.6, 120.8], [982.8, 120.8], [982.8, 626.4], [579.6, 626.4]], photos: [] },
      { id: "mb2_23m_3", name: "23M", polygon: [[1029.2, 120.8], [1430.8, 120.8], [1430.8, 626.4], [1029.2, 626.4]], photos: [] },
      { id: "mb2_25m_4", name: "25M", polygon: [[1482, 120.8], [1883.6, 120.8], [1883.6, 626.4], [1482, 626.4]], photos: [] },
      { id: "mb2_27m_5", name: "27M", polygon: [[1930, 116], [2333.2, 116], [2333.2, 621.6], [1930, 621.6]], photos: [] },
      { id: "mb2_22m_6", name: "22M", polygon: [[696.4, 940], [1130, 940], [1130, 1396], [696.4, 1396]], photos: [] },
      { id: "mb2_24m_7", name: "24M", polygon: [[1181.2, 940], [1613.2, 940], [1613.2, 1396], [1181.2, 1396]], photos: [] },
      { id: "mb2_26m_drafting_room_avr_8", name: "26M - Drafting Room/AVR", polygon: [[1653.2, 940], [2333.2, 940], [2333.2, 1396], [1653.2, 1396]], photos: [] },
    ],
    stairs: [
      {
        id: "mb2_stair_lower_to1",
        name: "Stairs (to Floor 1)",
        group: "lower",
        polygon: [[502.5, 1061.4], [644.7, 1061.4], [644.7, 1392.8], [502.5, 1392.8]],
        toFloorId: "floor1",
      },
      {
        id: "mb2_stair_upper_to3",
        name: "Stairs (to Floor 3)",
        group: "upper",
        polygon: [[300.4, 1064.2], [442.6, 1064.2], [442.6, 1395.5], [300.4, 1395.5]],
        toFloorId: "floor3",
      },
    ],
  },
  {
    id: "floor3",
    label: "3rd Floor",
    artworkFile: "marine-building-floor3.svg",
    rooms: [
      { id: "mb3_library_1", name: "Library (RTS Campus)", polygon: [[607.6, 125.6], [2293.2, 125.6], [2293.2, 1392], [607.6, 1392], [607.6, 667.2], [391.6, 667.2], [391.6, 420], [607.6, 420]], photos: [] },
      { id: "mb3_elevator", name: "Elevator", polygon: [[273.2, 112], [570.8, 112], [570.8, 352], [273.2, 352]], photos: [] },
      { id: "mb3_room_unlabeled", name: "Room (unlabeled)", polygon: [[84.4, 102.4], [257.2, 102.4], [257.2, 720], [84.4, 720]], photos: [] },
    ],
    stairs: [
      {
        id: "mb3_stair_upper_to2",
        name: "Stairs (to Floor 2)",
        group: "upper",
        polygon: [[354, 1061.6], [496.2, 1061.6], [496.2, 1393], [354, 1393]],
        toFloorId: "floor2",
      },
    ],
  },
];
