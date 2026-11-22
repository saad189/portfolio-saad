// Rice mill zone (x 0–195 × y 0–169) — round 2 detail.
// Saila plant lives in saila.js. Buildings here have cut-away walls/roofs (toggle "Cut-away") to show what's inside.
import * as THREE from 'three';
import { SITE } from '../site.js';
import { M, P, box, boxR, slab, slabR, trees, cyl, gableShed, shutter, block, freeZone, label, tag, truck, tractor, car, segBox, strut, hopper, person, waterTank, acUnit, mergeByMaterial, railRect } from '../lib.js';
import * as saila from './saila.js';
import * as offices from './offices.js';

const cutLabel = (parent, text, x, y, h) => { const l = label(parent, text, x, y, h, 'cut', 1); l.userData.cutOnly = true; return l; };

export function build(scene) {
  const R = SITE.rice, g = new THREE.Group(); g.name = 'rice'; scene.add(g);
  slabR(g, R.zone, 0.2, M.concrete);

  // ---------- saila plant (existing, from photos) ----------
  mergeByMaterial(saila.build(g));
  freeZone(g, R.sailaFree, 'Saila expansion · kept free');

  // ---------- boiler house (new, husk-fired) ----------
  const b = new THREE.Group(); b.name = 'boiler'; g.add(b);
  gableShed(b, { x1: 0, y1: 15, x2: 33, y2: 50 }, { axis: 'y', eave: 22, rise: 3.5, wall: M.cladGrey, roof: M.roof, trim: M.trimGreen, cut: true, frames: 12 });
  // boiler shell on saddles, front smokebox, husk feed hopper + screw, ID fan, feed-water tank
  const shell = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.2, 20, 28), M.boilerShell); shell.rotation.x = Math.PI / 2; shell.position.copy(P(15, 31, 8)); shell.castShadow = true; b.add(shell);
  [24, 38].forEach(y => box(b, 11.5, y - 1, 18.5, y + 1, 4.2, M.pedestal, 0.2));
  box(b, 10.5, 19, 19.5, 21, 9, M.steelDark, 3.5);                                       // smokebox / front
  box(b, 11, 41, 19, 45, 6, M.steelDark, 0.2);                                           // furnace front
  hopper(b, 15, 46.5, 8, 7, 4.5, 1.5, 1.5, 5, M.steelGreen);
  strut(b, [15, 46.5, 8], [15, 42.5, 6], 1.2, M.steelGreen, true);                       // husk screw into the furnace
  const fan = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 1.8, 22), M.steelBlue); fan.rotation.z = Math.PI / 2; fan.position.copy(P(27, 26, 4)); b.add(fan);
  strut(b, [15, 20, 12], [27, 26, 6.4], 1.6, M.steelDark, true);                         // flue to ID fan
  strut(b, [27, 26, 6.4], [33, 34.5, 15], 1.6, M.steelDark, true);                       // ID fan to multicyclone
  cyl(b, 5, 21, 2.5, 5, M.steel, 9); [[3.4, 19.4], [6.6, 19.4], [3.4, 22.6], [6.6, 22.6]].forEach(([x, y]) => box(b, x - .2, y - .2, x + .2, y + .2, 9, M.steelDark, 0.2));
  cyl(b, 39, 21, 3, 95, M.chimney, 0, 20, 2.1);                                         // chimney
  cyl(b, 39, 21, 3.3, 1.2, M.trimRed, 82); cyl(b, 39, 21, 3.3, 1.2, M.trimRed, 88);
  boxR(b, { x1: 35, y1: 29, x2: 42.5, y2: 40 }, 18, M.steel);                            // multicyclone / dust collector
  hopper(b, 38.75, 34.5, 18, 7.5, 11, 7.5, 11, 0.01, M.steel);
  segBox(b, [33, 34.5], [35, 34.5], 2, 2, M.steelDark, 14);
  strut(b, [39, 29.5, 12], [39, 23.5, 12], 1.6, M.steelDark, true);                     // cyclone -> chimney
  // steam main to the saila plant on pipe racks
  segBox(b, [20, 50], [20, 99], 1, 1, M.stainless, 14);
  for (let y = 54; y < 98; y += 8) box(b, 19.4, y - .3, 20.6, y + .3, 14, M.steelDark);
  shutter(b, 33, 25, 'E', 10, 12, false, true);
  tag(b, R.boiler, { name: 'Boiler house', status: 'new', notes: 'Husk-fired fire-tube boiler (≈8 ft shell on saddles) with a screw feeder from the husk store next door, ID fan, multicyclone dust collector and a ≈95 ft chimney. Steam runs north to the saila plant on a pipe rack at 14 ft.', round: 2 });
  label(b, 'Boiler', 16, 32, 30, '', 1);
  cutLabel(b, 'Boiler shell', 15, 31, 14); cutLabel(b, 'Multicyclone', 38.75, 34.5, 22);
  mergeByMaterial(b);

  // ---------- v23: rice mill hall = milling hall + finished goods in ONE building (owner's call) ----------
  // Ridge east–west, against the south wall with a one-truck back lane behind it; milling in the west part, packing + finished
  // goods in the east part, docks on the east wall. The middle of the zone becomes an open yard up to the saila plant.
  const h = new THREE.Group(); h.name = 'millHall'; g.add(h);
  const MH = R.millHall;
  gableShed(h, MH, { eave: 30, rise: 7, wall: M.cladGrey, roof: M.roof, trim: M.trimGreen, cut: true, frames: 24 });
  const hh = boxR(h, { x1: 59.5, y1: 98, x2: 69.5, y2: 109 }, 46, M.cladGreen); hh.userData.cut = true;       // elevator head house over the intake
  box(h, 59.1, 97.6, 69.9, 109.4, 1, M.trimGreen, 46).userData.cut = true;
  [30, 50, 70, 90].forEach(y => shutter(h, MH.x2, y, 'E', 12, 14, true, true));                                 // 4 dispatch docks
  [24, 36, 44, 56, 64, 76, 84, 96].forEach(y => box(h, MH.x2, y - 1, MH.x2 + 0.8, y + 1, 2.4, M.tyre, 1));        // dock bumpers
  [19, 107].forEach(y => cyl(h, MH.x2 + 2, y, 0.6, 3.5, M.yellow, 0, 10));
  shutter(h, 152, MH.y2, 'N', 12, 14, true, true);                                                              // finished goods ↔ yard
  shutter(h, 92, MH.y2, 'N', 14, 16, true, true);                                                               // milling: maintenance ↔ yard
  // dust partition between milling and finished goods, with an opening for the product line + forklifts
  box(h, 127.8, 16.9, 128.4, 38, 16, M.cladGrey, 0.2); box(h, 127.8, 50, 128.4, 109.1, 16, M.cladGrey, 0.2);
  millMachinery(h);
  // packing line at the opening, then bag stacks on pallets (50 kg bags) with aisles to the four docks
  box(h, 130, 40, 135, 44, 7, M.machine, 0.2); hopper(h, 132.5, 42, 7.2, 5, 4, 1, 1, 3, M.machineBlue);
  box(h, 135, 41, 141, 43, 2.6, M.machineBlue, 0.2); box(h, 137, 39, 139, 40.5, 4.5, M.machine, 0.2);
  const stack = (x1, y1, x2, y2, hgt) => { box(h, x1, y1, x2, y2, 0.5, M.pallet, 0.2); box(h, x1 + .2, y1 + .2, x2 - .2, y2 - .2, hgt, M.bags, 0.7); };
  [[144, 152], [155, 163], [166, 174]].forEach(([x1, x2], i) => [[18.5, 24], [36, 44], [56, 64], [76, 84], [96, 107]].forEach(([y1, y2], j) => stack(x1, y1, x2, y2, [10.8, 9, 7.2, 10.8, 5.4, 9][(i + j) % 6])));
  person(h, 136, 46); person(h, 160, 50);
  // paddy from the saila tempering bins: enclosed belt gallery ≈28 ft up across the yard, one trestle
  strut(h, [46.5, 157, 27.7], [59.5, 106, 27.2], 3, M.steelGreen);
  [[52, 131.5], [54.4, 131.5]].forEach(([x, y]) => box(h, x - .4, y - .4, x + .4, y + .4, 26, M.steelGreen, 0.2));
  strut(h, [52, 131.5, 2], [54.4, 131.5, 24], 0.3, M.steel); strut(h, [54.4, 131.5, 2], [52, 131.5, 24], 0.3, M.steel);
  // husk: walled bay in the south-west corner, overhead belt across the west lane to the boiler
  strut(h, [58.5, 44, 18], [33.5, 44, 13], 2, M.steelGreen);
  tag(h, MH, { name: 'Rice mill hall (milling + finished goods, one building)', status: 'relocated', size: '120 × 94 ft · eaves 30 ft · ridge east–west', area: '≈11,280 sq ft (milling ≈6,580 + packing and finished goods ≈4,700)',
    notes: 'v23, after the owner’s review: the milling hall and the finished-goods godown are now one building, turned east–west and set against the south wall with only a ≈15 ft one-way truck lane behind it. That frees the middle of the rice zone as an open yard right up to the saila plant’s east face. Paddy comes from the saila tempering bins along an overhead belt gallery (≈28 ft up, one trestle) into the intake elevator at the north-west corner. The milling line runs in three rows: north row west → east (destoner, pre-cleaner, huskers, husk aspirator, paddy separator), middle row back east → west (whiteners, polishers, grader), south row (colour sorters) to the product bins, then through an opening in the dust partition to the packing line and the finished-goods stacks in the east part. Four docks on the east wall load trucks side-on from the ≈17.5 ft apron (one-way southbound into the back lane); shutters on the north wall open onto the yard for tractors, small trucks and maintenance. Husk drops into a walled husk bay in the south-west corner and goes by an overhead belt across the west lane to the boiler; the MCC room sits beside it. ≈11,280 sq ft, about 5 % more than the two halls it replaces (6,500 + 4,200 sq ft), and one roof instead of two. Machine positions are indicative until the real machine list is in. Turn on Cut-away to see inside.', round: 23 });
  label(h, 'Rice mill hall · milling + finished goods', 118, 63, 44, 'major', 1);
  label(h, 'Belt gallery from the tempering bins', 53, 131.5, 31, '', 2); label(h, 'Husk belt to boiler', 45, 44, 20, '', 2);
  cutLabel(h, 'Packing line', 134, 42, 12); cutLabel(h, 'Finished goods · bag stacks', 159, 60, 14);
  mergeByMaterial(h);

  // ---------- v23: one-way truck loop round the rice mill hall + open yard ----------
  // weighbridge (end of the main road) → back lane west → west lane north → open yard → strip in front of the rice office east →
  // main road. Dispatch trucks enter the east apron from that strip, load at the docks and leave south into the back lane.
  const ln = new THREE.Group(); ln.name = 'lanes'; g.add(ln);
  slabR(ln, R.apron, 0.3, M.concrete);
  box(ln, 43.2, 15.2, MH.x2, 15.55, 0.05, M.yellow, 0.22, false); box(ln, 57.6, 15.7, 57.95, MH.y2, 0.05, M.yellow, 0.22, false);
  const ash = new THREE.Shape([[-1.2, -4], [1.2, -4], [1.2, 0], [3, 0], [0, 4.5], [-3, 0], [-1.2, 0]].map(([a, b]) => new THREE.Vector2(a, b)));
  const ag = new THREE.ShapeGeometry(ash); ag.rotateX(-Math.PI / 2);
  [[170, 8, Math.PI / 2], [128, 8, Math.PI / 2], [86, 8, Math.PI / 2], [50.6, 34, 0], [50.6, 84, 0], [132, 118, -Math.PI / 2], [176, 118, -Math.PI / 2], [186.8, 100, Math.PI], [186.8, 24, Math.PI]]
    .forEach(([x, y, r]) => { const a = new THREE.Mesh(ag, M.whitePaint); a.position.copy(P(x, y, 0.36)); a.rotation.y = r; ln.add(a); });
  truck(ln, 110, 8, Math.PI / 2, true); truck(ln, 50.6, 62, 0, false); truck(ln, 152, 118, -Math.PI / 2, true); truck(ln, 186.8, 62, Math.PI, true);
  tractor(ln, 70, 142, Math.PI / 2, true, 0); person(ln, 48, 120, 0.2, M.kurta2);
  tag(ln, null, { name: 'Truck circulation (one-way loop)', status: 'infra', size: 'Back lane ≈15 ft · west lane ≈15 ft · office strip 16 ft · east apron ≈17.5 ft', notes: 'v23: with the rice mill hall against the south wall, trucks go round it one way. From the weighbridge at the end of the main road: west along the back lane behind the hall, north up the west lane (between the boiler and the hall), into the open yard, then east along the strip in front of the rice office back to the main road. Dispatch trucks turn off that strip into the east apron, load at the four docks and carry on south into the back lane. Each lane takes one truck at a time; the open yard is where trucks and tractor-trolleys wait or turn. The old two-way lanes (west lane, east–west lane, link to the drying loop) are gone: the yard now opens straight onto the drying loop’s south side.', round: 23 });
  label(ln, 'Back lane · one-way ≈15 ft', 140, 8, 3, 'road', 2); label(ln, 'West lane · one-way', 50.6, 50, 3, 'road', 2);
  label(ln, 'One-way to the main road', 160, 118, 3, 'road', 2); label(ln, 'Dock apron', 186.8, 82, 3, 'road', 2);
  freeZone(g, { x1: 60, y1: 113, x2: 117, y2: 166 }, 'Open yard · access to the saila plant');
  // v17: the space freed by shortening the rice office (x 174–195 × y 126–167) is left open and paved; bollards protect the office's east door
  slab(ln, [[174, 126], [195, 126], [195, 167], [174, 167]], 0.27, M.road);
  [[175.5, 132], [175.5, 144], [175.5, 150]].forEach(([x, y]) => cyl(ln, x, y, 0.35, 3, M.yellow, 0.27, 10));

  // ---------- rice mill operations office (v7, offices.js) ----------
  offices.buildOps(g);

  return g;
}

// v23: indicative parboiled-rice milling line in the west part of the rice mill hall, in three rows (north row west → east,
// middle row east → west, south row to the product bins by the packing opening).
function millMachinery(h) {
  const m = new THREE.Group(); m.name = 'machinery'; h.add(m);
  const Z = 0.2;
  const leg4 = (x1, y1, x2, y2, hgt, mat = M.machineBlue) => [[x1, y1], [x2, y1], [x1, y2], [x2, y2]].forEach(([x, y]) => box(m, x - .25, y - .25, x + .25, y + .25, hgt, mat, Z));
  const elev = (x, y, hgt = 27) => { box(m, x - .9, y - 1.3, x + .9, y + 1.3, hgt, M.machineGreen, Z); box(m, x - 1.2, y - 1.8, x + 1.2, y + 1.8, 2.4, M.machineGreen, Z + hgt); };
  elev(62, 104, 26);                                                                                             // intake (gallery from the saila bins)
  // north row: destoner + pre-cleaner, rubber-roll huskers, husk aspirator, paddy separator
  box(m, 66, 98, 74, 106, 1.2, M.machineBlue, Z); box(m, 66.5, 98.5, 73.5, 105.5, 4, M.machine, Z + 1.2); hopper(m, 70, 102, Z + 5.2, 5, 5, 1, 1, 2.5, M.machine);
  box(m, 77, 99, 83, 105, 6, M.machine, Z);
  [[86, 99.5], [93, 99.5]].forEach(([x, y]) => { box(m, x, y, x + 5, y + 4.5, 6, M.machine, Z); hopper(m, x + 2.5, y + 2.25, Z + 6, 3.5, 3.5, 1, 1, 2.5, M.machine); cyl(m, x + 5.6, y + 2.25, 0.9, 1.6, M.motor, Z + 1); });
  box(m, 101, 98.5, 108, 104, 8, M.machineGreen, Z);
  strut(m, [104.5, 101, 8], [104.5, 101, 26], 1.4, M.steel, true); strut(m, [104.5, 101, 26], [72, 101, 26], 1.4, M.steel, true);
  strut(m, [72, 101, 26], [72, 46, 26], 1.4, M.steel, true); strut(m, [72, 46, 26], [70, 42, 15], 1.4, M.steel, true);   // husk pipe to the husk bay
  leg4(111, 95, 124, 103, 3); box(m, 111, 95, 124, 103, 4.5, M.machine, Z + 3); box(m, 112, 96, 123, 102, 0.6, M.machineBlue, Z + 7.5);
  // middle row: whiteners x3, silky polishers x2, grader
  [118, 110, 102].forEach(x => { box(m, x - 2, 76, x + 2, 82, 3, M.machineBlue, Z); cyl(m, x, 79, 1.5, 6.5, M.machine, Z + 3); hopper(m, x, 79, Z + 9.5, 2.4, 2.4, 0.8, 0.8, 1.6, M.machine); cyl(m, x + 2.6, 79, 0.9, 2, M.motor, Z + 1); });
  [[88, 76.5], [80, 76.5]].forEach(([x, y]) => { box(m, x, y, x + 5, y + 5, 3, M.machineBlue, Z); cyl(m, x + 2.5, y + 2.5, 1.4, 5.5, M.machine, Z + 3); });
  leg4(64, 75, 74, 83, 3); box(m, 64, 75, 74, 83, 3.5, M.machine, Z + 3); hopper(m, 69, 79, Z + 6.5, 4, 4, 1, 1, 2, M.machine);
  // south row: colour sorters x2, then product bins on legs by the packing opening
  [[82, 56], [91, 56]].forEach(([x, y]) => { box(m, x, y, x + 6, y + 4.5, 7, M.whitePaint, Z); box(m, x + 0.5, y - 0.05, x + 5.5, y + 0.1, 2.5, M.glass, Z + 3.5); hopper(m, x + 3, y + 2.25, Z + 7, 5, 3.5, 1.2, 1.2, 2.2, M.whitePaint); });
  [[108, 40], [115, 40], [108, 47], [115, 47]].forEach(([x, y]) => { leg4(x, y, x + 6, y + 6, 8); hopper(m, x + 3, y + 3, Z + 5, 6, 6, 1, 1, 3, M.cream); box(m, x, y, x + 6, y + 6, 6, M.machineGreen, Z + 8); });
  // bucket elevators between the rows + overhead conveyor along the north wall
  [[126, 96], [98, 86], [77, 86], [62, 70], [100, 58]].forEach(([x, y]) => elev(x, y));
  box(m, 70, 106.6, 127, 108.4, 1.6, M.machineGreen, Z + 27.6);
  // husk bay (south-west corner, 12 ft walls, open top) + MCC room
  box(m, 59, 49.4, 77, 50.2, 12, M.brick, Z); box(m, 76.2, 28, 77, 50.2, 12, M.brick, Z); box(m, 59, 27.6, 77, 28.4, 12, M.brick, Z);
  const pile = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), M.husk);
  pile.scale.set(7.5, 6.5, 9.5); pile.position.copy(P(67.5, 39, Z)); pile.castShadow = true; pile.receiveShadow = true; m.add(pile);
  box(m, 59, 17, 72, 26, 10, M.plaster, Z); box(m, 58.8, 16.8, 72.2, 26.2, 0.6, M.slab, Z + 10);
  person(m, 96, 90, Z); person(m, 100, 66, Z);
  [['Intake elevator', 62, 104, 30], ['Destoner', 70, 102, 10], ['Huskers', 91, 102, 10], ['Husk aspirator', 104.5, 101, 10], ['Paddy separator', 117.5, 99, 10], ['Whiteners', 110, 79, 12], ['Polishers', 86, 79, 10], ['Grader', 69, 79, 10], ['Colour sorters', 88, 58, 10], ['Product bins', 115, 47, 16], ['Husk bay', 67.5, 39, 14], ['MCC room', 65.5, 21.5, 12]]
    .forEach(([t, x, y, z]) => cutLabel(h, t, x, y, z));
}
