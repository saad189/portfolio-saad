// Al-Sadiq Flour Mills — ONE building filling its plot (x 239–440 × y 0–99), as Saad described (v8).
// Sections (layout inside the building guessed): 5-storey mill section (NE), bran store behind it (SE),
// wheat godown (middle), packing hall + flour godown (SW), 2-storey office annex with balcony (NW).
// No open yard inside the plot: trucks side-load along the 11 ft north apron (branch road) and the 19 ft west strip.
import * as THREE from 'three';
import { SITE } from '../site.js';
import { M, P, box, boxR, slabR, slab, cyl, floorsBlock, gableShed, shutter, hopper, elevator, strut, segBox, railRect, panel, label, tag, truck, person, waterTank, acUnit, desk, partition, counter, mergeByMaterial, solarArray } from '../lib.js';

const cutLabel = (parent, text, x, y, h, floor) => {
  const l = label(parent, text, x, y, h, 'cut', 1); l.userData.cutOnly = true;
  if (floor === 0) l.userData.groundOnly = true; else if (floor > 0) l.userData.upper = true;
  return l;
};
const FH = 13;
const R = {
  tower: { x1: 360, y1: 29, x2: 440, y2: 99 },
  bran: { x1: 360, y1: 0, x2: 440, y2: 29 },
  wheat: { x1: 300, y1: 0, x2: 360, y2: 99 },
  pack: { x1: 239, y1: 0, x2: 300, y2: 68 },
  annex: { x1: 239, y1: 68, x2: 300, y2: 99 },
};

export function build(scene) {
  const Z = SITE.flour.zone, g = new THREE.Group(); g.name = 'flour'; scene.add(g);
  slabR(g, Z, 0.2, M.concrete);
  slab(g, [[239, 99], [440, 99], [440, 110], [239, 110]], 0.2, M.concrete);                 // 11 ft north apron to the branch road
  slab(g, [[220, 0], [239, 0], [239, 110], [220, 110]], 0.2, M.concrete);                  // 19 ft west strip along the main road
  tower(g); bran(g); wheat(g); pack(g); annex(g); solar(g);
  // trucks side-loading parallel to the building
  truck(g, 330, 104.5, -Math.PI / 2, true); person(g, 322, 100.5, 0.2); person(g, 338, 100.5, 0.2, M.kurta2);
  truck(g, 229.5, 30, 0, false); person(g, 236, 22, 0.2, M.kurta3);
  label(g, 'Al-Sadiq Flour Mills · one building', 340, 50, 92, 'major', 1);
  return g;
}

// ---------- 5-storey mill section ----------
function tower(g) {
  const t = new THREE.Group(); t.name = 'mill'; g.add(t);
  const r = R.tower;
  floorsBlock(t, r, 5, FH, M.flour, { parapet: 3.5, parapetMat: M.flourTrim, bands: M.flourTrim, colSpacing: 16, skip: 'W' });
  // west wall only above the godown roof (the godown abuts below), so the section reads as one building
  box(t, 360, 29, 360.8, 99, 5 * FH - 28, M.flour, 28).userData.cut = true;
  box(t, 360, 29, 360.8, 99, 3.5, M.flourTrim, 5 * FH).userData.cut = true;
  const roofZ = 5 * FH + 0.9;
  [[box(t, 404, 56, 426, 74, 12, M.flour, roofZ)], [box(t, 403.5, 55.5, 426.5, 74.5, 1, M.flourTrim, roofZ + 12)]].forEach(([m]) => { m.userData.cut = true; });
  const kit = new THREE.Group(); kit.userData.cut = true; t.add(kit);
  waterTank(kit, 430, 40, roofZ); waterTank(kit, 436, 40, roofZ, 0xe9e9e4);
  [[372, 90], [380, 90], [388, 90]].forEach(([x, y]) => { cyl(kit, x, y, 2.2, 7, M.whitePaint, roofZ + 4, 16); hopper(kit, x, y, roofZ + 0.5, 3, 3, 0.7, 0.7, 3.5, M.whitePaint); });
  boxR(kit, { x1: 408, y1: 82, x2: 422, y2: 94 }, 12, M.steel, roofZ);
  segBox(kit, [372, 94], [408, 94], 1.4, 1.4, M.steel, roofZ + 9);
  const sg = new THREE.Mesh(new THREE.PlaneGeometry(64, 8), M.sign); sg.position.copy(P(400, 99.7, 58)); sg.rotation.y = Math.PI; sg.userData.cut = true; sg.userData.keep = true; t.add(sg);
  // pneumatic flour line from the mill to the packing hall, on a rack over the wheat godown roof
  strut(t, [361, 40, 30], [296, 40, 30], 1.2, M.stainless, true);
  [345, 325, 305].forEach(x => strut(t, [x, 40, 26.5], [x, 40, 30], 0.4, M.steelDark));
  strut(t, [296, 40, 30], [292, 40, 22], 1.2, M.stainless, true);
  machinery(t);
  tag(t, r, { name: 'Flour mill · 5-storey mill section', status: 'existing', size: '80 × 70 ft · 5 × 13 ft floors', area: '28,000 sq ft (5 floors)', notes: 'Part of the single Al-Sadiq building (whole plot 201 × 99 ft ≈ 4.4 kanal, ≈44,000 sq ft covered across all sections). Orange walls, pink-red floor bands, the sign on the north face. Floors (guessed): ground = flour + bran bins and MCC; 1st = 10 roller mills; 2nd = purifiers + bran finishers; 3rd = plansifters; 4th = wheat cleaning + tempering. Flour goes by pneumatic line over the godown roof to the packing hall.', round: 8 });
  mergeByMaterial(t);
}
function machinery(t) {
  const z = (f) => f * FH + 0.8, fl = [];
  for (let f = 0; f < 5; f++) { const q = new THREE.Group(); if (f > 0) q.userData.upper = true; t.add(q); fl.push(q); }
  // ground: flour/bran bins on legs + MCC
  [372, 386, 400].forEach(x => [48, 66].forEach(y => { [[-3.5, -3.5], [3.5, -3.5], [-3.5, 3.5], [3.5, 3.5]].forEach(([a, b]) => box(fl[0], x + a - .25, y + b - .25, x + a + .25, y + b + .25, 4, M.machineBlue, z(0))); hopper(fl[0], x, y, z(0) + 4, 8, 8, 1, 1, 3, M.cream); box(fl[0], x - 4, y - 4, x + 4, y + 4, 5, M.machineGreen, z(0) + 7); }));
  box(fl[0], 420, 34, 436, 48, 10, M.plaster, z(0));
  // 1st: roller mills, two rows of five, pneumatic pipes to the ceiling
  for (let i = 0; i < 5; i++) [50, 72].forEach(y => { const x = 368 + i * 13; box(fl[1], x, y, x + 5, y + 3.4, 4.8, M.machine, z(1)); hopper(fl[1], x + 2.5, y + 1.7, z(1) + 4.8, 4, 2.6, 1, 1, 1.6, M.machineBlue); [x + 1.2, x + 3.8].forEach(px => cyl(fl[1], px, y + 1.7, 0.35, FH - 6.4, M.stainless, z(1) + 6.4, 8)); });
  // 2nd: purifiers + bran finishers
  [44, 58, 72].forEach(y => box(fl[2], 370, y, 382, y + 3.5, 4.2, M.machine, z(2)));
  [44, 58, 72].forEach(y => box(fl[2], 394, y, 404, y + 3.5, 4.2, M.machine, z(2)));
  [[414, 48], [414, 66]].forEach(([x, y]) => box(fl[2], x, y, x + 8, y + 3, 3.5, M.machineGreen, z(2)));
  // 3rd: plansifters hung from the frame above
  [[370, 46], [386, 46], [370, 68], [386, 68]].forEach(([x, y]) => { box(fl[3], x, y, x + 10, y + 10, 7, M.whitePaint, z(3) + 1.5); [[x + 1, y + 1], [x + 9, y + 1], [x + 1, y + 9], [x + 9, y + 9]].forEach(([px, py]) => strut(fl[3], [px, py, z(3) + 8.5], [px, py, z(4) - 0.8], 0.15, M.steelDark)); });
  // 4th: wheat cleaning + tempering bins
  [[370, 44], [382, 44]].forEach(([x, y]) => { box(fl[4], x, y, x + 8, y + 3, 4, M.machineBlue, z(4)); cyl(fl[4], x + 4, y + 1.5, 1.2, 1.8, M.motor, z(4) + 4, 10); });
  box(fl[4], 396, 44, 406, 47, 3.6, M.machineGreen, z(4));
  [[414, 76], [424, 76], [434, 76]].forEach(([x, y]) => { hopper(fl[4], x, y, z(4) + 0.5, 7, 7, 1, 1, 3, M.cream); boxR(fl[4], { x1: x - 3.5, y1: y - 3.5, x2: x + 3.5, y2: y + 3.5 }, 7, M.cladGreen, z(4) + 3.5); });
  [[364, 92], [364, 86]].forEach(([x, y]) => box(fl[0], x - .9, y - 1.3, x + .9, y + 1.3, 5 * FH - 1, M.machineGreen, z(0)));
  person(fl[1], 404, 86, z(1)); person(fl[3], 378, 62, z(3)); person(fl[0], 392, 40, z(0));
  [['Flour + bran bins · MCC', 0, 9], ['Roller mills', 1, 7], ['Purifiers + bran finishers', 2, 7], ['Plansifters', 3, 10], ['Wheat cleaning + tempering', 4, 9]]
    .forEach(([s, f, h]) => cutLabel(t, s, 400, 60, z(f) + h, f > 0 ? 1 : undefined));
}

// ---------- bran / by-product store behind the mill section ----------
function bran(g) {
  const b = new THREE.Group(); b.name = 'bran'; g.add(b);
  const r = R.bran;
  floorsBlock(b, r, 1, 18, M.orangeWall, { parapet: 2.5, parapetMat: M.flourTrim, colSpacing: 20, skip: 'N' });
  [[364, 4, 380, 24], [384, 4, 400, 24], [404, 4, 420, 24]].forEach(([a, c, d, e], i) => { box(b, a, c, d, e, 0.5, M.pallet, 0.2); box(b, a + .2, c + .2, d - .2, e - .2, 9 - i, M.jute, 0.7); });
  tag(b, r, { name: 'Flour mill · bran store', status: 'existing', size: '80 × 29 ft · 1 storey', area: '2,320 sq ft', notes: 'Single-storey section behind the mill block for bran and by-products (guessed), against the south boundary wall.', round: 8 });
  cutLabel(b, 'Bran + by-products', 392, 14, 13);
  mergeByMaterial(b);
}

// ---------- wheat godown (bagged wheat in through the north doors, intake pit + elevator to the mill) ----------
function wheat(g) {
  const w = new THREE.Group(); w.name = 'wheatGodown'; g.add(w);
  const r = R.wheat;
  gableShed(w, r, { axis: 'y', eave: 22, rise: 5, plinth: 1, wall: M.orangeWall, plinthMat: M.flourTrim, roof: M.roof, trim: M.flourTrim, louvre: false, overhang: 1, cut: true, frames: 25 });
  [315, 345].forEach(x => shutter(w, x, 99, 'N', 12, 13, M.flourTrim, true));
  const stack = (x1, y1, x2, y2, h) => { box(w, x1, y1, x2, y2, 0.5, M.pallet, 0.2); box(w, x1 + .2, y1 + .2, x2 - .2, y2 - .2, h, M.jute, 0.7); };
  [[4, 24], [30, 50], [56, 76]].forEach(([y1, y2], i) => { stack(303, y1, 325, y2, 11 - i); stack(331, y1, 350, y2, 10 + (i % 2)); });
  box(w, 340, 84, 352, 94, 0.3, M.grating, 0.2);                                        // intake pit (bags cut here)
  elevator(w, 356, 92, 76, { platform: 3 });
  strut(w, [356, 92, 77], [364, 86, 66], 1.1, M.steel, true);
  person(w, 344, 82, 0.2); person(w, 328, 60, 0.2, M.kurta3);
  tag(w, r, { name: 'Flour mill · wheat godown', status: 'existing', size: '60 × 99 ft · high single storey', area: '5,940 sq ft', notes: 'Section of the single building (guessed use). Bagged wheat is unloaded by hand from trucks parked parallel on the north apron, stacked inside, and emptied into an intake pit by the mill section; a 76 ft elevator lifts it to the cleaning floor. Bagged intake avoids trucks backing across the branch road to tip.', round: 8 });
  label(w, 'Wheat godown', 330, 50, 32, '', 1);
  cutLabel(w, 'Wheat bags', 327, 40, 14); cutLabel(w, 'Intake pit + elevator', 348, 89, 8);
  mergeByMaterial(w);
}

// ---------- packing hall + flour godown (dispatch from the west strip) ----------
function pack(g) {
  const p = new THREE.Group(); p.name = 'packing'; g.add(p);
  const r = R.pack;
  gableShed(p, r, { axis: 'y', eave: 22, rise: 5, plinth: 1, wall: M.orangeWall, plinthMat: M.flourTrim, roof: M.roof, trim: M.flourTrim, louvre: false, overhang: 1, cut: true, frames: 23 });
  [18, 46].forEach(y => shutter(p, 239, y, 'W', 12, 13, M.flourTrim, true));
  [[284, 22], [284, 34], [284, 46]].forEach(([x, y]) => { box(p, x, y, x + 8, y + 5, 6, M.machine, 0.2); hopper(p, x + 4, y + 2.5, 6.2, 6, 4, 1, 1, 3, M.machineBlue); box(p, x - 6, y + 1.5, x, y + 3.5, 2.6, M.machineBlue, 0.2); });
  const stack = (x1, y1, x2, y2, h) => { box(p, x1, y1, x2, y2, 0.5, M.pallet, 0.2); box(p, x1 + .2, y1 + .2, x2 - .2, y2 - .2, h, M.bags, 0.7); };
  [[4, 18], [24, 40], [48, 64]].forEach(([y1, y2], i) => { stack(244, y1, 258, y2, 9 + i); stack(262, y1, 276, y2, 10 - i); });
  person(p, 280, 30, 0.2); person(p, 260, 21, 0.2, M.kurta2);
  tag(p, r, { name: 'Flour mill · packing hall + flour godown', status: 'existing', size: '61 × 68 ft · high single storey', area: '4,148 sq ft', notes: 'Section of the single building (guessed use). Flour arrives by pneumatic line from the mill section, is bagged on three packers and stacked; dispatch from two shutters on the west side, with trucks loading parallel in the 19 ft strip along the main road.', round: 8 });
  label(p, 'Packing + flour godown', 269.5, 34, 32, '', 1);
  cutLabel(p, 'Packers', 288, 34, 12); cutLabel(p, 'Flour bags', 260, 32, 15);
  mergeByMaterial(p);
}

// ---------- 2-storey office annex with balcony (north-west corner) ----------
function annex(g) {
  const a = new THREE.Group(); a.name = 'annex'; g.add(a);
  const r = R.annex, AF = 11, z0 = 0.8, z1 = AF + 0.8;
  floorsBlock(a, r, 2, AF, M.annex, { parapet: 3, parapetMat: M.flourTrim, bands: M.flourTrim, colSpacing: 15, skip: 'S' });
  box(a, 241, 99, 298, 104, 0.7, M.slab, AF - 0.4);                                     // balcony over the north apron
  panel(a, [241, 104], [298, 104], AF + 0.3, 3.4, M.railBlue);
  [245, 260, 280, 294].forEach(x => box(a, x - .4, 103.2, x + .4, 104, AF - 0.4, M.plaster));
  box(a, 266, 98.8, 273, 99.6, 8, M.glass, 0.2).userData.cut = true;
  acUnit(a, 248, 74, 2 * AF); acUnit(a, 256, 74, 2 * AF); waterTank(a, 292, 74, 2 * AF);
  const g0 = new THREE.Group(), g1 = new THREE.Group(); g1.userData.upper = true; a.add(g0, g1);
  partition(g0, [262, 68.7], [262, 98.2], z0, 9.4); partition(g0, [280, 68.7], [280, 98.2], z0, 9.4);
  [[246, 76, 'N'], [254, 76, 'N'], [246, 88, 'S'], [254, 88, 'S']].forEach(([x, y, f]) => desk(g0, x, y, z0, f));
  counter(g0, 264, 90, 278, 92.5, z0, 3.4, M.wood); desk(g0, 288, 80, z0, 'N'); desk(g0, 288, 90, z0, 'S');
  partition(g1, [262, 68.7], [262, 98.2], z1, 9.4); partition(g1, [280, 68.7], [280, 98.2], z1, 9.4);
  desk(g1, 250, 84, z1, 'E'); desk(g1, 290, 84, z1, 'W'); counter(g1, 264, 74, 278, 86, z1, 2.6, M.wood);
  cutLabel(a, 'Despatch + accounts clerks', 250, 82, z0 + 7, 0); cutLabel(a, 'Reception', 271, 91, z0 + 7, 0); cutLabel(a, 'Purchase', 290, 85, z0 + 7, 0);
  cutLabel(a, 'Mill manager', 250, 84, z1 + 7, 1); cutLabel(a, 'Staff room', 271, 80, z1 + 7, 1); cutLabel(a, 'Shift office', 290, 84, z1 + 7, 1);
  tag(a, r, { name: 'Flour mill · office annex', status: 'existing', size: '61 × 31 ft · 2 storeys', area: '3,782 sq ft (2 floors)', notes: 'The 2-storey part with the balcony from the photo, placed at the north-west corner facing the branch road (position guessed). Ground: reception, despatch + accounts clerks, purchase. First: mill manager, staff room, shift office. Senior management sits in the head office.', round: 8 });
  label(a, 'Office annex', 269.5, 84, 28, '', 1);
  mergeByMaterial(a);
}

// ---------- rooftop solar on the back (south) part of the building ----------
function solar(g) {
  const s = new THREE.Group(); s.name = 'roofSolar'; s.userData.cut = true; g.add(s);
  // bran store flat roof (18 ft): three south-facing rows on low frames
  [5.5, 13.5, 21.5].forEach(y => { solarArray(s, 400, y, 20, 72, 7, 0.26, 0); [366, 384, 400, 416, 434].forEach(x => box(s, x - .2, y - .2, x + .2, y + .2, 1.6, M.steel, 18)); });
  // gable roofs of the wheat godown and the packing hall: flush panels on both slopes
  const slope = (cxRidge, halfW, eave, rise, y0, y1) => {
    const a = Math.atan2(rise, halfW), w = halfW - 2, len = w / Math.cos(a), cy = (y0 + y1) / 2, d = y1 - y0;
    [[1, -a], [-1, a]].forEach(([sgn, rz]) => { const cx = cxRidge + sgn * (1 + w / 2), z = eave + rise * (1 - (1 + w / 2) / halfW) + 0.65; solarArray(s, cx, cy, z, len, d, 0, rz); });
  };
  slope(330, 30, 22, 5, 4, 50);      // wheat godown (south half)
  slope(269.5, 30.5, 22, 5, 4, 64);  // packing hall (whole roof)
  tag(s, { x1: 239, y1: 0, x2: 440, y2: 64 }, { name: 'Flour mill · rooftop solar', status: 'existing', size: 'Bran store roof + both godown roofs (back of the building)', area: '≈7,000 sq ft of panels as drawn', notes: 'Saad: there are solar panels on the back of the flour mill too. Shown on the low back sections: three tilted rows on the bran store’s flat roof and flush panels on both slopes of the wheat godown (south half) and the packing hall. As drawn ≈7,000 sq ft of panels ≈140 kWp at today’s panel ratings; the real array layout and size are guessed.', round: 9 });
  mergeByMaterial(s);
}
