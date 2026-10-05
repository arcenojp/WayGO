// Practicum Center floor plan (single floor, no stairs).
// Rooms are [x, y] polygons in the artwork's pixel space (0,0 = top-left,
// artwork is 1440 x 1024).

export const PRACTICUM_CENTER_ARTWORK_SIZE = { width: 1440, height: 1024 };

export const PRACTICUM_CENTER_FLOORS = [
  {
    id: "floor1",
    label: "Ground Floor",
    artworkFile: "practicum-center-floor1.svg",
    rooms: [
      {
        id: "pc1_hm_hotel_1",
        name: "HM Hotel",
        polygon: [[34.5, 635.5], [964.5, 635.5], [964.5, 936.5], [34.5, 936.5]],
        photos: [],
      },
      {
        id: "pc1_room_4_2",
        name: "Room 4",
        polygon: [[34.5, 395.5], [217.5, 395.5], [217.5, 556.5], [34.5, 556.5]],
        photos: [],
      },
      {
        id: "pc1_physic_lab_1_3",
        name: "Physic Lab 1",
        polygon: [[230.5, 395.5], [411.5, 395.5], [411.5, 556.5], [230.5, 556.5]],
        photos: [],
      },
      {
        id: "pc1_faculty_room_4",
        name: "Faculty Room",
        polygon: [[425.5, 395.5], [608.5, 395.5], [608.5, 556.5], [425.5, 556.5]],
        photos: [],
      },
      {
        id: "pc1_physic_lab_2_5",
        name: "Physic Lab 2",
        polygon: [[621.5, 395.5], [803.5, 395.5], [803.5, 556.5], [621.5, 556.5]],
        photos: [],
      },
      {
        id: "pc1_room_1_6",
        name: "Room 1",
        polygon: [[817.5, 395.5], [1000.5, 395.5], [1000.5, 556.5], [817.5, 556.5]],
        photos: [],
      },
      {
        id: "pc1_room_2_7",
        name: "Room 2",
        polygon: [[817.5, 219.5], [1000.5, 219.5], [1000.5, 379.5], [817.5, 379.5]],
        photos: [],
      },
      {
        id: "pc1_room_3_8",
        name: "Room 3",
        polygon: [[817.5, 43.5], [1000.5, 43.5], [1000.5, 204.5], [817.5, 204.5]],
        photos: [],
      },
      {
        id: "pc1_cr_male_9",
        name: "CR MALE",
        polygon: [[1059.5, 594.5], [1154.5, 594.5], [1154.5, 682.5], [1059.5, 682.5]],
        photos: [],
      },
      {
        id: "pc1_cr_female_10",
        name: "CR FEMALE",
        polygon: [[1059.5, 693.5], [1154.5, 693.5], [1154.5, 781.5], [1059.5, 781.5]],
        photos: [],
      },
      {
        id: "pc1_guard_post_11",
        name: "Guard Post",
        polygon: [[1060.5, 793.5], [1152.5, 793.5], [1152.5, 906.5], [1060.5, 906.5]],
        photos: [],
      },
    ],
    stairs: [],
  },
];
