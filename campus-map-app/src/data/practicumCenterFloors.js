// WIT Science Building floor plan (single floor, no stairs). Its id in the
// app is still "practicum", the building's former name.
// Rooms are [x, y] polygons in the artwork's pixel space (0,0 = top-left,
// artwork is 2353 x 1217).

export const PRACTICUM_CENTER_ARTWORK_SIZE = { width: 2353, height: 1217 };

export const PRACTICUM_CENTER_FLOORS = [
  {
    id: "floor1",
    label: "Ground Floor",
    artworkFile: "practicum-center-floor1.svg",
    // Where people walk in (directions start here): the Entrance arrow.
    entrance: [1925, 1110],
    rooms: [
      {
        id: "pc1_hm_hotel_1",
        name: "HM Hotel",
        polygon: [[138, 777], [1832, 777], [1832, 1093.5], [408.2, 1093.5], [408.2, 1168], [138, 1168]],
        photos: [],
      },
      {
        // Renamed from Room 4; the id is kept for its photo.
        id: "pc1_room_4_2",
        name: "Room 7",
        polygon: [[138, 379], [479, 379], [479, 653], [138, 653]],
        photos: [],
      },
      {
        id: "pc1_physic_lab_1_3",
        name: "Physics Lab 1",
        polygon: [[486, 379], [830, 379], [830, 653], [486, 653]],
        photos: [],
      },
      {
        id: "pc1_faculty_room_4",
        name: "Faculty Room",
        polygon: [[837, 379], [1187, 379], [1187, 653], [837, 653]],
        photos: [],
      },
      {
        id: "pc1_physic_lab_2_5",
        name: "Physics Lab 2",
        polygon: [[1196, 379], [1540, 379], [1540, 653], [1196, 653]],
        photos: [],
      },
      {
        id: "pc1_room_1_6",
        name: "Room 1",
        polygon: [[1547, 453], [1956, 453], [1956, 653], [1547, 653]],
        photos: [],
      },
      {
        id: "pc1_room_2_7",
        name: "Room 2",
        polygon: [[1547, 240], [1956, 240], [1956, 447], [1547, 447]],
        photos: [],
      },
      {
        id: "pc1_room_3_8",
        name: "Room 3",
        polygon: [[1547, 22], [1956, 22], [1956, 233], [1547, 233]],
        photos: [],
      },
      {
        id: "pc1_cr_male_9",
        name: "CR MALE",
        polygon: [[1996, 692], [2222, 692], [2222, 804], [1996, 804]],
        photos: [],
      },
      {
        id: "pc1_cr_female_10",
        name: "CR FEMALE",
        polygon: [[1996, 807], [2222, 807], [2222, 921], [1996, 921]],
        photos: [],
      },
      {
        id: "pc1_guard_post_11",
        name: "Guard Post",
        polygon: [[1997, 924], [2222, 924], [2222, 1062], [1997, 1062]],
        photos: [],
      },
    ],
    stairs: [],
  },
];
