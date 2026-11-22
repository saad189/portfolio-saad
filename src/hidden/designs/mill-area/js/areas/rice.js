// Rice mill zone (x 0–195 × y 0–169) — round 2 detail.
// Saila plant lives in saila.js. Buildings here have cut-away walls/roofs (toggle "Cut-away") to show what's inside.
import * as THREE from 'three';
import { SITE } from '../site.js';
import { M, P, box, boxR, slab, slabR, trees, cyl, gableShed, shutter, block, freeZone, label, tag, truck, car, segBox, strut, hopper, person, waterTank, acUnit, mergeByMaterial, railRect } from '../lib.js';
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

  // ---------- milling hall (new PEB, existing machinery moved back) ----------
  const h = new THREE.Group(); h.name = 'hall'; g.add(h);
  gableShed(h, R.hall, { eave: 32, rise: 6, wall: M.cladGrey, roof: M.roof, trim: M.trimGreen, cut: true, frames: 26 });
  const hh = boxR(h, { x1: 45, y1: 138, x2: 55, y2: 150 }, 52, M.cladGreen); hh.userData.cut = true;   // elevator head house
  box(h, 44.6, 137.6, 55.4, 150.4, 1, M.trimGreen, 52).userData.cut = true;
  shutter(h, 93.2, 60, 'E', 14, 16, true, true);                                          // to finished goods
  shutter(h, 68, 39, 'S', 12, 14, true, true);                                            // husk / service
  shutter(h, 93.2, 135, 'E', 14, 16, true, true);                                         // maintenance
  hallMachinery(h);
  tag(h, R.hall, { name: 'Milling hall', status: 'relocated', notes: 'New PEB shed (portal frames every ≈26 ft, brick plinth, cladding, green louvres, elevator head house) for the existing machinery moved back from the front. Turn on Cut-away to see the line inside. The machine line-up shown is indicative (a standard parboiled-rice line); it will be matched to the real machines once their list or photos are in.', round: 2 });
  label(h, 'Milling hall', 68.2, 82, 46, 'major', 1);
  mergeByMaterial(h);

  // ---------- husk store (new, open-sided) ----------
  const k = new THREE.Group(); k.name = 'husk'; g.add(k);
  const hr = R.husk;
  box(k, hr.x1, hr.y1, hr.x2, hr.y1 + 0.9, 8, M.brick); box(k, hr.x1, hr.y1, hr.x1 + 0.9, hr.y2, 8, M.brick); box(k, hr.x2 - 0.9, hr.y1, hr.x2, hr.y2, 8, M.brick);
  [[hr.x1 + .5, hr.y2 - .5], [hr.x2 - .5, hr.y2 - .5], [hr.x1 + .5, hr.y1 + .5], [hr.x2 - .5, hr.y1 + .5]].forEach(([x, y]) => box(k, x - .4, y - .4, x + .4, y + .4, 18, M.steelDark));
  const roof = box(k, hr.x1 - 1, hr.y1 - 1, hr.x2 + 1, hr.y2 + 2, 0.4, M.roof, 18); roof.rotation.x = 0.06;
  const pile = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), M.husk);
  pile.scale.set(10, 9, 9); pile.position.copy(P(55.6, 26.5, 0)); pile.castShadow = true; pile.receiveShadow = true; k.add(pile);
  strut(k, [55, 39, 18], [55, 31, 14], 2, M.steelGreen);                                  // husk conveyor from the hall
  strut(k, [44, 24, 4], [33, 26, 8], 1.4, M.steelGreen, true);                            // screw feed to the boiler
  tag(k, hr, { name: 'Husk store', status: 'new', notes: 'Open-sided store with brick walls on three sides. Husk from the milling hall arrives by conveyor; a screw feeds it to the boiler next door.', round: 2 });
  label(k, 'Husk', 55.6, 26.5, 22, '', 2);

  freeZone(g, R.service, 'Service / fire lane');
  // ---------- two-way truck lanes between the buildings (v9) ----------
  const ln = new THREE.Group(); ln.name = 'lanes'; g.add(ln);
  const dash = (a, b, horiz) => { const L = horiz ? b[0] - a[0] : b[1] - a[1]; for (let t = 4; t < L - 4; t += 14) { const x = horiz ? a[0] + t : a[0], y = horiz ? a[1] : a[1] + t; box(ln, horiz ? x : x - .25, horiz ? y - .25 : y, horiz ? x + 7 : x + .25, horiz ? y + .25 : y + 7, 0.05, M.whitePaint, 0.22, false); } };
  dash([108.1, 2], [108.1, 124], false);            // west lane centre line (29.8 ft wide)
  dash([125, 113], [193, 113], true);               // east–west lane centre line (26 ft wide)
  dash([106.6, 128], [106.6, 167], false);          // link to the drying loop (26.8 ft wide)
  [[R.laneW, '29.8 ft'], [R.laneEW, '26 ft'], [R.laneN, '26.8 ft']].forEach(([r, w]) => { box(ln, r.x1, r.y1, r.x1 + .35, r.y2, 0.05, M.yellow, 0.22, false); box(ln, r.x2 - .35, r.y1, r.x2, r.y2, 0.05, M.yellow, 0.22, false); });
  truck(ln, 112, 112.5 - 6.5, -Math.PI / 2, true); truck(ln, 146, 113 + 6.5, Math.PI / 2, false);   // two trucks passing in the 26 ft lane
  truck(ln, 101, 40, 0, true); truck(ln, 115.2, 70, Math.PI, false);                                   // and in the west lane
  tag(ln, null, { name: 'Two-way truck lanes', status: 'infra', size: 'West 29.8 ft · east–west 26 ft · link 26.8 ft', notes: 'Every gap between rice-mill buildings is at least 26 ft, so two trucks (≈8.5 ft each) can pass with room to spare: west lane between the milling hall and finished goods, east–west lane between finished goods and the office (main road ↔ west lane), and a link from the west lane up to the drying loop.', round: 9 });
  // v17: the space freed by shortening the rice office (x 174–195 × y 126–167) is left open and paved, so trucks can swing
  // through the lane / main-road corner freely; a few bollards protect the office's east door
  slab(ln, [[174, 126], [195, 126], [195, 167], [174, 167]], 0.27, M.road);
  [[175.5, 132], [175.5, 144], [175.5, 150]].forEach(([x, y]) => cyl(ln, x, y, 0.35, 3, M.yellow, 0.27, 10));
  truck(ln, 186, 118, -Math.PI / 4, true);                                                                          // truck taking the curve out of the lane
  label(ln, 'Two-way lane · 26 ft', 150, 113, 3, 'road', 2); label(ln, 'Two-way lane · 29.8 ft', 108, 90, 3, 'road', 2); label(ln, 'Link to drying loop', 106.6, 150, 3, 'road', 2);

  // ---------- finished goods + packing (new PEB) ----------
  const f = new THREE.Group(); f.name = 'fg'; g.add(f);
  gableShed(f, R.fg, { eave: 26, rise: 5, wall: M.cladWhite, roof: M.roofWhite, trim: M.trimRed, cut: true, frames: 24 });
  [40, 75].forEach(y => shutter(f, 123, y, 'W', 14, 16, true, true));
  [18, 40, 62, 84].forEach(y => shutter(f, 173, y, 'E', 12, 14, true, true));
  box(f, 173, 8, 180, 97, 4, M.slab);
  segBox(f, [180, 8], [180, 97], 0.25, 3.5, M.rail, 4);
  [12, 24, 34, 46, 56, 68, 78, 90].forEach(y => box(f, 180, y - 1, 180.8, y + 1, 2.4, M.tyre, 1));
  [10, 95].forEach(y => cyl(f, 182, y, 0.6, 3.5, M.yellow, 0, 10));
  // packing line by the west door: bagging scale, stitcher, belt
  box(f, 126, 34, 131, 38, 7, M.machine, 0.2); hopper(f, 128.5, 36, 7.2, 5, 4, 1, 1, 3, M.machineBlue);
  box(f, 131, 35, 137, 37, 2.6, M.machineBlue, 0.2);
  box(f, 133, 33, 135, 34.5, 4.5, M.machine, 0.2);
  // bag stacks on pallets (50 kg bags), aisles to the docks
  const stack = (x1, y1, x2, y2, hgt) => { box(f, x1, y1, x2, y2, 0.5, M.pallet, 0.2); box(f, x1 + .2, y1 + .2, x2 - .2, y2 - .2, hgt, M.bags, 0.7); };
  [[138, 146], [149, 157], [160, 168]].forEach(([x1, x2], i) => [[10, 22], [25, 37], [43, 55], [58, 70], [80, 92]].forEach(([y1, y2], j) => stack(x1, y1, x2, y2, [10.8, 9, 7.2, 10.8, 5.4, 9][(i + j) % 6])));
  person(f, 132, 40); person(f, 158, 40);
  tag(f, R.fg, { name: 'Finished goods + packing', status: 'new', size: '50 × 95 ft', area: '4,750 sq ft', notes: 'v9: extended north from 70 to 95 ft (+36%). White PEB warehouse with red trim. Rice comes in through two west doors from the milling hall, is bagged on the packing line, stacked on pallets (≈15 blocks of 50 kg bags) and shipped from four raised docks on the east side. The 22 ft apron suits side-loading with trucks parked parallel to the dock; backing in square to the dock would need about 45 ft.', round: 2 });
  label(f, 'Finished goods', 148, 52, 34, 'major', 1);
  cutLabel(f, 'Packing line', 130, 36, 12); cutLabel(f, 'Bag stacks', 153, 40, 14);
  mergeByMaterial(f);
  slabR(g, R.apron, 0.35, M.concrete);
  label(g, 'Loading apron', 186, 18, 1, '', 2);
  truck(g, 185.5, 40, 0, false); person(g, 179, 46, 4);

  // ---------- rice mill operations office (v7, offices.js) ----------
  offices.buildOps(g);

  return g;
}

// Indicative parboiled-rice milling line, north (paddy in from the tempering bins) to south (rice out to finished goods).
function hallMachinery(h) {
  const m = new THREE.Group(); m.name = 'machinery'; h.add(m);
  const Z = 0.2;
  const leg4 = (x1, y1, x2, y2, hgt, mat = M.machineBlue) => [[x1, y1], [x2, y1], [x1, y2], [x2, y2]].forEach(([x, y]) => box(m, x - .25, y - .25, x + .25, y + .25, hgt, mat, Z));
  const elev = (x, y, hgt = 27) => { box(m, x - .9, y - 1.3, x + .9, y + 1.3, hgt, M.machineGreen, Z); box(m, x - 1.2, y - 1.8, x + 1.2, y + 1.8, 2.4, M.machineGreen, Z + hgt); };
  // intake from the tempering bins (gallery enters at the north-west)
  elev(47, 157, 26);
  // destoner + pre-cleaner
  box(m, 52, 152, 60, 160, 1.2, M.machineBlue, Z); box(m, 52.5, 152.5, 59.5, 159.5, 4, M.machine, Z + 1.2); hopper(m, 56, 156, Z + 5.2, 5, 5, 1, 1, 2.5, M.machine);
  box(m, 63, 153, 69, 159, 6, M.machine, Z);
  // rubber-roll huskers + husk aspirator (pipe takes husk to the husk store)
  [[50, 129], [57, 129]].forEach(([x, y]) => { box(m, x, y, x + 5, y + 4.5, 6, M.machine, Z); hopper(m, x + 2.5, y + 2.25, Z + 6, 3.5, 3.5, 1, 1, 2.5, M.machine); cyl(m, x + 5.6, y + 2.25, 0.9, 1.6, M.motor, Z + 1); });
  box(m, 65, 128.5, 72, 134, 8, M.machineGreen, Z);
  strut(m, [69, 131, 8], [69, 131, 27], 1.4, M.steel, true); strut(m, [69, 131, 27], [69, 44, 27], 1.4, M.steel, true); strut(m, [69, 44, 27], [56, 41, 22], 1.4, M.steel, true);
  // paddy separator (tray type)
  leg4(48, 110, 61, 118, 3); box(m, 48, 110, 61, 118, 4.5, M.machine, Z + 3); box(m, 49, 111, 60, 117, 0.6, M.machineBlue, Z + 7.5);
  // whiteners (vertical) x3
  [50, 58, 66].forEach(x => { box(m, x - 2, 95, x + 2, 101, 3, M.machineBlue, Z); cyl(m, x, 98, 1.5, 6.5, M.machine, Z + 3); hopper(m, x, 98, Z + 9.5, 2.4, 2.4, 0.8, 0.8, 1.6, M.machine); cyl(m, x + 2.6, 98, 0.9, 2, M.motor, Z + 1); });
  // silky polishers x2
  [[50, 80], [60, 80]].forEach(([x, y]) => { box(m, x, y, x + 5, y + 5, 3, M.machineBlue, Z); cyl(m, x + 2.5, y + 2.5, 1.4, 5.5, M.machine, Z + 3); });
  // grader / rotary sifter
  leg4(48, 64, 58, 72, 3); box(m, 48, 64, 58, 72, 3.5, M.machine, Z + 3); hopper(m, 53, 68, Z + 6.5, 4, 4, 1, 1, 2, M.machine);
  // colour sorters x2
  [[63, 64], [72, 64]].forEach(([x, y]) => { box(m, x, y, x + 6, y + 4.5, 7, M.whitePaint, Z); box(m, x + 0.5, y - 0.05, x + 5.5, y + 0.1, 2.5, M.glass, Z + 3.5); hopper(m, x + 3, y + 2.25, Z + 7, 5, 3.5, 1.2, 1.2, 2.2, M.whitePaint); });
  // product bins on legs + bagging by the east door
  [[76, 44], [83, 44], [76, 51], [83, 51]].forEach(([x, y]) => { leg4(x, y, x + 6, y + 6, 8); hopper(m, x + 3, y + 3, Z + 5, 6, 6, 1, 1, 3, M.cream); box(m, x, y, x + 6, y + 6, 6, M.machineGreen, Z + 8); });
  box(m, 86, 58, 91, 63, 6, M.machine, Z);
  // bucket elevators between stages, overhead conveyor along the west side
  [[46, 122], [46, 106], [46, 90], [46, 75], [62, 58]].forEach(([x, y]) => elev(x, y));
  box(m, 45.8, 52, 47.6, 161, 1.6, M.machineGreen, Z + 27.6);
  // MCC / electrical room in the south-west corner
  box(m, 44, 40, 56, 50, 10, M.plaster, Z); box(m, 43.8, 39.8, 56.2, 50.2, 0.6, M.slab, Z + 10);
  person(m, 62, 120, Z); person(m, 80, 70, Z);
  [['Intake elevator', 47, 157, 30], ['Destoner', 56, 156, 10], ['Huskers', 56, 131, 10], ['Husk aspirator', 68.5, 131, 10], ['Paddy separator', 54.5, 114, 10], ['Whiteners', 58, 98, 12], ['Polishers', 57.5, 82.5, 10], ['Grader', 53, 68, 10], ['Colour sorters', 70, 66, 10], ['Product bins + bagging', 83, 51, 16], ['MCC room', 50, 45, 12]]
    .forEach(([t, x, y, z]) => cutLabel(h, t, x, y, z));
}
