# Room & Building Photos

Photos placed in this folder appear automatically in the room and building
cards. No code changes are needed; only the file name matters.

## Naming rule

```
<name from the tables below>-<number>.<jpg | jpeg | png | webp>
```

- **`-1` is the first photo**, `-2` the second, and so on. Photos are shown
  in that order, and people can swipe or click through them when there's
  more than one.
- Use the name **exactly** as written in the tables (underscores, not dashes
  or spaces). Capital letters don't matter: `CB1_CB_12_2-1.JPG` works too.
- A file whose name doesn't end in `-<number>` is ignored, and the browser's
  developer console shows a warning naming the file.
- **Folders are just for keeping things tidy.** A photo is matched by its
  file name only, so it still works if it lands in the wrong folder.

**Examples**

| File | Shows up as |
|---|---|
| `computer-building/cb1_cb_12_2-1.jpg` | CB-12, first photo |
| `computer-building/cb1_cb_12_2-2.jpg` | CB-12, second photo |
| `marine-building/mb2_22m_6-1.png` | 22M, first photo |
| `buildings/gym-1.jpg` | STS - Gymnasium, first photo |

## Photo tips

- **Landscape** (wider than tall) photos fit the panel best. They're cropped
  to fill it.
- Keep each photo **under ~500 KB**, around 1600 px wide at most. Big phone
  photos (4–10 MB) make the app slow to load. Any "resize image" tool or
  website can shrink them first.
- Prefer `.jpg` (or `.webp`) for photos. `.png` files are much bigger.

## Uploading on GitHub (in the browser)

1. In your repository, open `src/assets/photos/` and then the right folder
   (for example `computer-building/`).
2. Click **Add file → Upload files**, drag your renamed photos in, and click
   **Commit changes**.
3. Your local copy doesn't update by itself. Run `git pull` in the project
   folder to get the photos before running `npm run dev`. If the site is
   hosted (Vercel, Netlify, GitHub Pages…), it picks them up on its next
   build.

The `.gitkeep` files only exist so Git keeps these folders while they're
empty. Leave them or delete them, either is fine.

## Where the names come from

Room names are each room's `id` in its `src/data/*Floors.js` file. Building
names are the building's key in `src/data/campuses.js`. If a room is added
or renamed, use its `id` from those files.

Some room names appear on more than one floor (like "CR MALE"). Each one
still has its own file name, so check the **Floor** column.

Buildings that open a floor plan (Computer Building, Marine Engineering
Building, Senior High Building, New Building, CE Building, Tennis Court)
show photos per **room**, not for the whole building. Tennis Court doesn't
support room photos yet, since it still uses a placeholder room list until
its floor plan is added.

---

## Every file name

Only the first photo's name is shown. For more photos, change `-1` to
`-2`, `-3`, …

### Main Building (Main Campus) → `main-building/`

| Floor | Room | File name (first photo) |
|---|---|---|
| 1st Floor | Student Gov Office | `f1_student_gov_office_0-1.jpg` |
| 1st Floor | Student Affairs Office | `f1_student_affairs_office_2-1.jpg` |
| 1st Floor | Guidance Counselor | `f1_guidance_counselor_7-1.jpg` |
| 1st Floor | Academic Counsel | `f1_academic_counsel_8-1.jpg` |
| 1st Floor | Medical/Dental Clinic (Main) | `f1_medical_dental_clinic__main_9-1.jpg` |
| 1st Floor | Cashier | `f1_cashier_10-1.jpg` |
| 1st Floor | Registrar Office | `f1_registrar_office_11-1.jpg` |
| 1st Floor | Comptroller Office | `f1_comptroller_office_12-1.jpg` |
| 1st Floor | Accounting Office | `f1_accounting_office_13-1.jpg` |
| 1st Floor | Registrar Office | `f1_registrar_office_14-1.jpg` |
| 1st Floor | Elevator | `f1_elevator_15-1.jpg` |
| 1st Floor | SHS Office | `f1_shs_office_16-1.jpg` |
| 1st Floor | Inventory and Supply | `f1_inventory_and_supply_17-1.jpg` |
| 1st Floor | Room 109 | `f1_room_109_18-1.jpg` |
| 1st Floor | CHEM LAB 1 | `f1_chem_lab_1_19-1.jpg` |
| 1st Floor | CHEM LAB 2 | `f1_chem_lab_2_20-1.jpg` |
| 1st Floor | CHEM LAB3 and Inv | `f1_chem_lab3_and_inv_21-1.jpg` |
| 1st Floor | Room 106 | `f1_room_106_22-1.jpg` |
| 1st Floor | Room 107 | `f1_room_107_23-1.jpg` |
| 1st Floor | Room 108 | `f1_room_108_24-1.jpg` |
| 1st Floor | CR 1st floor (Main) | `f1_cr_1st_floor__main_25-1.jpg` |
| 1st Floor | CANTEEN | `f1_canteen_26-1.jpg` |
| 1st Floor | Electrical Utility Room | `f1_electrical_utility_room_27-1.jpg` |
| 1st Floor | Waiting Area | `f1_waiting_area_28-1.jpg` |
| 2nd Floor | President's Office | `f2_president_s_office_0-1.jpg` |
| 2nd Floor | RM-216 | `f2_rm_216_7-1.jpg` |
| 2nd Floor | RM-218 | `f2_rm_218_8-1.jpg` |
| 2nd Floor | College of Arts & Science Heads Office | `f2_college_of_arts___science_heads_office_9-1.jpg` |
| 2nd Floor | College of Arts & Science Deans Office | `f2_college_of_arts___science_deans_office_10-1.jpg` |
| 2nd Floor | Elevator | `f2_elevator_11-1.jpg` |
| 2nd Floor | RM-221 | `f2_rm_221_12-1.jpg` |
| 2nd Floor | RM-220 Faculty Room | `f2_rm_220_faculty_room_13-1.jpg` |
| 2nd Floor | RM-222 | `f2_rm_222_14-1.jpg` |
| 2nd Floor | RM-208 | `f2_rm_208_15-1.jpg` |
| 2nd Floor | RM-207 | `f2_rm_207_16-1.jpg` |
| 2nd Floor | RM-206 | `f2_rm_206_17-1.jpg` |
| 2nd Floor | RM-205 | `f2_rm_205_18-1.jpg` |
| 2nd Floor | HM-Kitchen | `f2_hm_kitchen_19-1.jpg` |
| 2nd Floor | Mini HM-Bar Counter | `f2_mini_hm_bar_counter_20-1.jpg` |
| 2nd Floor | HM-Mini Restaurant | `f2_hm_mini_restaurant_21-1.jpg` |
| 2nd Floor | HM-Mini Hotel | `f2_hm_mini_hotel_22-1.jpg` |
| 2nd Floor | RM-210 (Computer Lab) | `f2_rm_210__computer_lab_23-1.jpg` |
| 2nd Floor | RM-219 | `f2_rm_219_24-1.jpg` |
| 2nd Floor | RM-217 | `f2_rm_217_25-1.jpg` |
| 2nd Floor | RM-215 | `f2_rm_215_26-1.jpg` |
| 2nd Floor | RM-213 | `f2_rm_213_27-1.jpg` |
| 2nd Floor | CR Male (Main 2nd floor) | `f2_cr_male__main_2nd_floor_30-1.jpg` |
| 2nd Floor | CR Female (Main 2nd floor) | `f2_cr_female__main_2nd_floor_31-1.jpg` |
| 2nd Floor | Photo Room/DIO Office | `f2_photo_room_dio_office_32-1.jpg` |
| 2nd Floor | HM Department Head Office | `f2_hm_department_head_office_33-1.jpg` |
| 3rd Floor | Ladies Social Hall | `f3_ladies_social_hall_0-1.jpg` |
| 3rd Floor | RM-314 | `f3_rm_314_7-1.jpg` |
| 3rd Floor | RM-316 | `f3_rm_316_8-1.jpg` |
| 3rd Floor | RM-312 CBA Faculty Room | `f3_rm_312_cba_faculty_room_9-1.jpg` |
| 3rd Floor | College of Business & Accountancy Deans Office | `f3_college_of_business___accountancy_deans_office_10-1.jpg` |
| 3rd Floor | Elevator | `f3_elevator_11-1.jpg` |
| 3rd Floor | RM-320 | `f3_rm_320_12-1.jpg` |
| 3rd Floor | RM-319 | `f3_rm_319_13-1.jpg` |
| 3rd Floor | RM-318 CBA Outreach Office & Accountancy Head Office | `f3_rm_318_cba_outreach_office___accountancy_head_office_14-1.jpg` |
| 3rd Floor | RM-321 | `f3_rm_321_15-1.jpg` |
| 3rd Floor | RM-308 | `f3_rm_308_16-1.jpg` |
| 3rd Floor | RM-309 | `f3_rm_309_17-1.jpg` |
| 3rd Floor | RM-307 | `f3_rm_307_18-1.jpg` |
| 3rd Floor | RM-306 | `f3_rm_306_19-1.jpg` |
| 3rd Floor | RM-305 | `f3_rm_305_20-1.jpg` |
| 3rd Floor | RM-304 | `f3_rm_304_21-1.jpg` |
| 3rd Floor | RM-303 | `f3_rm_303_22-1.jpg` |
| 3rd Floor | RM-302 | `f3_rm_302_23-1.jpg` |
| 3rd Floor | RM-301 | `f3_rm_301_24-1.jpg` |
| 3rd Floor | RM-310 (Computer Lab) | `f3_rm_310__computer_lab_25-1.jpg` |
| 3rd Floor | RM-317 | `f3_rm_317_26-1.jpg` |
| 3rd Floor | RM-315 | `f3_rm_315_27-1.jpg` |
| 3rd Floor | RM-313 | `f3_rm_313_28-1.jpg` |
| 3rd Floor | CR Male (Main 2nd floor) | `f3_cr_male__main_2nd_floor_31-1.jpg` |
| 3rd Floor | CR Female (Main 2nd floor) | `f3_cr_female__main_2nd_floor_32-1.jpg` |
| 4th Floor | WIT Main Library | `f4_wit_main_library_1-1.jpg` |
| 4th Floor | Elevator | `f4_elevator_2-1.jpg` |
| 4th Floor | Room (unlabeled) | `f4_room__unlabeled_3-1.jpg` |
| 4th Floor | Room (unlabeled) | `f4_room__unlabeled_4-1.jpg` |
| 4th Floor | Room (unlabeled) | `f4_room__unlabeled_5-1.jpg` |
| 4th Floor | Terrace | `f4_terrace_6-1.jpg` |
| 4th Floor | CR Male (Main 2nd floor) | `f4_cr_male__main_2nd_floor_8-1.jpg` |
| 4th Floor | CR Female (Main 2nd floor) | `f4_cr_female__main_2nd_floor_9-1.jpg` |

### Practicum Center → `practicum-center/`

| Floor | Room | File name (first photo) |
|---|---|---|
| Ground Floor | HM Hotel | `pc1_hm_hotel_1-1.jpg` |
| Ground Floor | Room 4 | `pc1_room_4_2-1.jpg` |
| Ground Floor | Physic Lab 1 | `pc1_physic_lab_1_3-1.jpg` |
| Ground Floor | Faculty Room | `pc1_faculty_room_4-1.jpg` |
| Ground Floor | Physic Lab 2 | `pc1_physic_lab_2_5-1.jpg` |
| Ground Floor | Room 1 | `pc1_room_1_6-1.jpg` |
| Ground Floor | Room 2 | `pc1_room_2_7-1.jpg` |
| Ground Floor | Room 3 | `pc1_room_3_8-1.jpg` |
| Ground Floor | CR MALE | `pc1_cr_male_9-1.jpg` |
| Ground Floor | CR FEMALE | `pc1_cr_female_10-1.jpg` |
| Ground Floor | Guard Post | `pc1_guard_post_11-1.jpg` |

### Computer Building (RTS Campus) → `computer-building/`

| Floor | Room | File name (first photo) |
|---|---|---|
| 1st Floor | CompE/ IT Faculty Room | `cb1_compe__it_faculty_room_1-1.jpg` |
| 1st Floor | CB-12 | `cb1_cb_12_2-1.jpg` |
| 1st Floor | CB-14 | `cb1_cb_14_3-1.jpg` |
| 1st Floor | Computer Custodian Office | `cb1_computer_custodian_office_4-1.jpg` |
| 1st Floor | IT Laboratory | `cb1_it_laboratory_5-1.jpg` |
| 1st Floor | Microprocessor Laboratory | `cb1_microprocessor_laboratory_6-1.jpg` |
| 1st Floor | CR FEMALE | `cb1_cr_female_7-1.jpg` |
| 1st Floor | CR MALE | `cb1_cr_male_8-1.jpg` |
| 2nd Floor | CR FEMALE | `cb2_cr_female_1-1.jpg` |
| 2nd Floor | CR MALE | `cb2_cr_male_2-1.jpg` |
| 2nd Floor | CB-27 IT Faculty | `cb2_cb_27_it_faculty_6-1.jpg` |
| 2nd Floor | CB-23 | `cb2_cb_23_7-1.jpg` |
| 2nd Floor | CB-21 | `cb2_cb_21_8-1.jpg` |
| 2nd Floor | CB-25 | `cb2_cb_25_9-1.jpg` |
| 2nd Floor | CB-26 Drawing Room | `cb2_cb_26_drawing_room_10-1.jpg` |
| 2nd Floor | CB-24 | `cb2_cb_24_11-1.jpg` |
| 2nd Floor | CB-22 | `cb2_cb_22_12-1.jpg` |
| 3rd Floor | CR FEMALE | `cb3_cr_female_1-1.jpg` |
| 3rd Floor | CR MALE | `cb3_cr_male_2-1.jpg` |
| 3rd Floor | CB-37 IT Department Office | `cb3_cb_37_it_department_office_4-1.jpg` |
| 3rd Floor | CB-33 | `cb3_cb_33_5-1.jpg` |
| 3rd Floor | CB-31 | `cb3_cb_31_6-1.jpg` |
| 3rd Floor | CB-35 | `cb3_cb_35_7-1.jpg` |
| 3rd Floor | CB-36 Design Room | `cb3_cb_36_design_room_8-1.jpg` |
| 3rd Floor | CB-34 | `cb3_cb_34_9-1.jpg` |
| 3rd Floor | CB-32 | `cb3_cb_32_10-1.jpg` |

### Marine Engineering Building (RTS Campus) → `marine-building/`

| Floor | Room | File name (first photo) |
|---|---|---|
| 1st Floor | Marine Administration Office | `mb1_marine_administration_office_1-1.jpg` |
| 1st Floor | Medical/ Dental Clinic (RTS Campus) | `mb1_medical_dental_clinic_2-1.jpg` |
| 1st Floor | 13M | `mb1_13m_3-1.jpg` |
| 1st Floor | 14M | `mb1_14m_4-1.jpg` |
| 1st Floor | Machine Shop (marine) | `mb1_machine_shop_5-1.jpg` |
| 1st Floor | Gas Welding Shop | `mb1_gas_welding_shop_6-1.jpg` |
| 1st Floor | Mock Engine Room | `mb1_mock_engine_room_7-1.jpg` |
| 1st Floor | CR (marine building) | `mb1_cr_8-1.jpg` |
| 2nd Floor | Shipboard Training Office | `mb2_shipboard_training_office_1-1.jpg` |
| 2nd Floor | Simulator Room | `mb2_simulator_room_2-1.jpg` |
| 2nd Floor | 23M | `mb2_23m_3-1.jpg` |
| 2nd Floor | 25M | `mb2_25m_4-1.jpg` |
| 2nd Floor | 27M | `mb2_27m_5-1.jpg` |
| 2nd Floor | 22M | `mb2_22m_6-1.jpg` |
| 2nd Floor | 24M | `mb2_24m_7-1.jpg` |
| 2nd Floor | 26M - Drafting Room/AVR | `mb2_26m_drafting_room_avr_8-1.jpg` |
| 3rd Floor | Library (RTS Campus) | `mb3_library_1-1.jpg` |

### Senior High Building (RTS Campus) → `senior-high/`

| Floor | Room | File name (first photo) |
|---|---|---|
| 1st Floor | Alumni B | `sh1_alumni_b-1.jpg` |
| 1st Floor | Alumni A | `sh1_alumni_a-1.jpg` |
| 1st Floor | Alumni Office | `sh1_alumni_office-1.jpg` |
| 1st Floor | Alumni D | `sh1_alumni_d-1.jpg` |
| 1st Floor | Alumni C | `sh1_alumni_c-1.jpg` |
| 1st Floor | CR Male (north end, by the Alumni offices) | `sh1_cr_male_north-1.jpg` |
| 1st Floor | CR Female (north end, by the Alumni offices) | `sh1_cr_female_north-1.jpg` |
| 1st Floor | Elevator | `sh1_elevator-1.jpg` |
| 1st Floor | HS-110 | `sh1_hs_110-1.jpg` |
| 1st Floor | HS-109 | `sh1_hs_109-1.jpg` |
| 1st Floor | HS-108 | `sh1_hs_108-1.jpg` |
| 1st Floor | HS-107 | `sh1_hs_107-1.jpg` |
| 1st Floor | HS-106 | `sh1_hs_106-1.jpg` |
| 1st Floor | HS-105 | `sh1_hs_105-1.jpg` |
| 1st Floor | CR Male (middle, after HS-105) | `sh1_cr_male_south-1.jpg` |
| 1st Floor | CR Female (middle, after HS-105) | `sh1_cr_female_south-1.jpg` |
| 1st Floor | HS-104 | `sh1_hs_104-1.jpg` |
| 1st Floor | HS-103 | `sh1_hs_103-1.jpg` |
| 1st Floor | HS-102 | `sh1_hs_102-1.jpg` |
| 1st Floor | HS-101 | `sh1_hs_101-1.jpg` |
| 2nd Floor | SHS LAB-2 | `sh2_shs_lab_2-1.jpg` |
| 2nd Floor | Room (unlabeled, between the labs) | `sh2_room_unlabeled-1.jpg` |
| 2nd Floor | SHS LAB-1 | `sh2_shs_lab_1-1.jpg` |
| 2nd Floor | Elevator | `sh2_elevator-1.jpg` |
| 2nd Floor | HS-210 | `sh2_hs_210-1.jpg` |
| 2nd Floor | HS-209 | `sh2_hs_209-1.jpg` |
| 2nd Floor | HS-208 | `sh2_hs_208-1.jpg` |
| 2nd Floor | HS-207 | `sh2_hs_207-1.jpg` |
| 2nd Floor | HS-206 | `sh2_hs_206-1.jpg` |
| 2nd Floor | HS-205 | `sh2_hs_205-1.jpg` |
| 2nd Floor | HS-204 | `sh2_hs_204-1.jpg` |
| 2nd Floor | HS-203 | `sh2_hs_203-1.jpg` |
| 2nd Floor | HS-202 | `sh2_hs_202-1.jpg` |
| 2nd Floor | HS-201 | `sh2_hs_201-1.jpg` |
| 3rd Floor | SHS LAB-4 | `sh3_shs_lab_4-1.jpg` |
| 3rd Floor | Room (unlabeled, between the labs) | `sh3_room_unlabeled-1.jpg` |
| 3rd Floor | SHS LAB-3 | `sh3_shs_lab_3-1.jpg` |
| 3rd Floor | Elevator | `sh3_elevator-1.jpg` |
| 3rd Floor | HS-310 | `sh3_hs_310-1.jpg` |
| 3rd Floor | HS-309 | `sh3_hs_309-1.jpg` |
| 3rd Floor | HS-308 | `sh3_hs_308-1.jpg` |
| 3rd Floor | HS-307 | `sh3_hs_307-1.jpg` |
| 3rd Floor | HS-306 | `sh3_hs_306-1.jpg` |
| 3rd Floor | HS-305 | `sh3_hs_305-1.jpg` |
| 3rd Floor | HS-304 | `sh3_hs_304-1.jpg` |
| 3rd Floor | HS-303 | `sh3_hs_303-1.jpg` |
| 3rd Floor | HS-302 | `sh3_hs_302-1.jpg` |
| 3rd Floor | HS-301 | `sh3_hs_301-1.jpg` |

### New Building (RTS Campus) → `new-building/`

| Floor | Room | File name (first photo) |
|---|---|---|
| 1st Floor | CR MALE | `nb1_cr_male_1-1.jpg` |
| 1st Floor | CR FEMALE | `nb1_cr_female_2-1.jpg` |
| 1st Floor | Faculty | `nb1_faculty_3-1.jpg` |
| 1st Floor | Coe Deans Office | `nb1_coe_deans_office_4-1.jpg` |
| 1st Floor | R1 | `nb1_r1_5-1.jpg` |
| 1st Floor | R2 | `nb1_r2_6-1.jpg` |
| 1st Floor | Elevator | `nb1_elevator_7-1.jpg` |
| 2nd Floor | R6 | `nb2_r6_1-1.jpg` |
| 2nd Floor | R7 | `nb2_r7_2-1.jpg` |
| 2nd Floor | CR MALE | `nb2_cr_male_3-1.jpg` |
| 2nd Floor | CR FEMALE | `nb2_cr_female_4-1.jpg` |
| 2nd Floor | R5 | `nb2_r5_5-1.jpg` |
| 2nd Floor | Conference Room | `nb2_conference_room_6-1.jpg` |
| 2nd Floor | R4 | `nb2_r4_7-1.jpg` |
| 2nd Floor | R3 | `nb2_r3_8-1.jpg` |
| 2nd Floor | Elevator | `nb2_elevator_9-1.jpg` |
| 2nd Floor | Fire Exit | `nb2_fire_exit_10-1.jpg` |
| 3rd Floor | R6 | `nb3_r6_1-1.jpg` |
| 3rd Floor | R7 | `nb3_r7_2-1.jpg` |
| 3rd Floor | Audio Visual Room | `nb3_audio_visual_room_3-1.jpg` |
| 3rd Floor | Elevator | `nb3_elevator_4-1.jpg` |
| 3rd Floor | Fire Exit | `nb3_fire_exit_5-1.jpg` |

### CE Building (RTS Campus) → `ce-building/`

| Floor | Room | File name (first photo) |
|---|---|---|
| 1st Floor | Drawing Room | `ce1_drawing_room_1-1.jpg` |
| 1st Floor | Soil Laboratory | `ce1_soil_laboratory_2-1.jpg` |
| 1st Floor | Material Testing Laboratory (top row) | `ce1_material_testing_laboratory_3-1.jpg` |
| 1st Floor | CE Laboratory Custodian Office | `ce1_ce_laboratory_custodian_office_4-1.jpg` |
| 1st Floor | CR (upper) | `ce1_cr_5-1.jpg` |
| 1st Floor | CR (lower) | `ce1_cr_6-1.jpg` |
| 1st Floor | Taek Kwon Do Training Room | `ce1_taek_kwon_do_training_room_7-1.jpg` |
| 1st Floor | Material Testing Laboratory (bottom row) | `ce1_material_testing_laboratory_8-1.jpg` |
| 2nd Floor | CR (upper) | `ce2_cr_1-1.jpg` |
| 2nd Floor | CR (lower) | `ce2_cr_2-1.jpg` |
| 2nd Floor | CE-25 | `ce2_ce_25_3-1.jpg` |
| 2nd Floor | CE-24 | `ce2_ce_24_4-1.jpg` |
| 2nd Floor | CE-23 | `ce2_ce_23_5-1.jpg` |
| 2nd Floor | CE-21 | `ce2_ce_21_6-1.jpg` |
| 2nd Floor | CE-26 | `ce2_ce_26_7-1.jpg` |
| 2nd Floor | CE Lobby | `ce2_ce_lobby_8-1.jpg` |
| 2nd Floor | CE-22 | `ce2_ce_22_9-1.jpg` |

### RTS Campus buildings → `buildings/`

These are the RTS Campus buildings that show a photo panel instead of a
floor plan when clicked on the map.

| Building | File name (first photo) |
|---|---|
| Physical Plant & Facilities Department | `physicalPlant-1.jpg` |
| Unlabeled Annex (near Gymnasium) | `annexNorth-1.jpg` |
| STS - Gymnasium | `gym-1.jpg` |
| ROTC Office | `rotcOffice-1.jpg` |
| SGS - Small Grand Stand | `smallGrandStand-1.jpg` |
| ME Laboratories | `meLabs-1.jpg` |
| Machine Shop | `machineShop-1.jpg` |
| Building Under Construction | `underConstruction-1.jpg` |
| EE/Electronics Lab Custodian's Office | `eeLab-1.jpg` |
| Unlabeled Annex (near Marine Engineering) | `annexEast-1.jpg` |
| Canteen | `canteen-1.jpg` |
| Swimming Pool Area | `swimmingPool-1.jpg` |
