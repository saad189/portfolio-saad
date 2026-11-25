// Round 6 — front zone (trapezoid between the drying loop and the road frontage).
// "Today": the old rice mill still stands (ghosted). Option (toggle "Options", on by default): the hybrid
// recommended in the front-zone doc — petrol pump at the west end, a shop row, and a mill front
// (trolley holding area, visitor parking, sales + admin office beside the gate).
import * as THREE from 'three';
import { SITE, ytop } from '../site.js';
import { M, P, box, boxR, slab, slabR, segBox, cyl, block, floorsBlock, ghost, label, tag, car, truck, tractor, person, trees, waterTank, acUnit, railRect, panel, stairFlight, partition, bed, counter, solarArray, shutter, strut, worldBox, gableShed, mergeByMaterial } from '../lib.js';

const U = [220 / 228.166, 60.5 / 228.166], N = [-U[1], U[0]];
const at = (t, off = 0) => [U[0] * t + N[0] * off, 528 + U[1] * t + N[1] * off];   // t = ft along the frontage from the west corner
const ang = Math.atan2(U[1], U[0]);
let _sf = null;
const SHOPFRONT = () => { if (!_sf) { _sf = M.shutter.clone(); _sf.map = M.shutter.map.clone(); _sf.map.repeat.set(2.6, 6); _sf.map.needsUpdate = true; } return _sf; };

export function build(scene) {
  const g0 = new THREE.Group(); g0.name = 'front'; scene.add(g0);
  const g = new THREE.Group(); g.userData.frontOrig = true; g0.add(g);           // v18: the whole original front zone swaps out when a variation is shown in place
  today(g);
  hybrid(g);
  staffFlats(g);
  return g0;
}

// ---------- staff flats (v12; v21 layout; v24: moved off the back of the petrol pump into the middle of the old trolley area) ----------
// G + 2, long side north–south. u runs along the building (south → north; stair core + entrance at the north end, onto the mill
// front), v across it (west outer wall → gallery, gallery on the east). Ground: 4 bachelor rooms, kitchen + eating, shared
// bathrooms + wuzu, mosque room by the entrance. 1st: 7 staff rooms + shared bathrooms by the stair. 2nd: 4 family flats.
export const STAFF_FLATS = { x0: 135.5, y0: 410.6, len: 99, dep: 20, gal: 5.5, core: 9.5 };
function staffFlats(g) {
  const sf = new THREE.Group(); sf.name = 'staffFlats'; sf.userData.option = true; g.add(sf);
  const S = STAFF_FLATS, FH = 10.5, FL = 3, BW = S.len / 8, T = pumpTex();
  const PT = (u, v) => [S.x0 + v, S.y0 + u];
  const LR = (u1, v1, u2, v2) => ({ x1: S.x0 + Math.min(v1, v2), y1: S.y0 + Math.min(u1, u2), x2: S.x0 + Math.max(v1, v2), y2: S.y0 + Math.max(u1, u2) });
  const B = (grp, u1, v1, u2, v2, h, mat, z = 0, cast = true) => { const r = LR(u1, v1, u2, v2); return box(grp, r.x1, r.y1, r.x2, r.y2, h, mat, z, cast); };
  const BED = (grp, u1, v1, u2, v2, z) => { const r = LR(u1, v1, u2, v2); bed(grp, r.x1, r.y1, r.x2, r.y2, z); };
  const PART = (grp, u1, v1, u2, v2, z, h) => partition(grp, PT(u1, v1), PT(u2, v2), z, h);
  const up = (o) => { o.userData.upper = true; return o; }, up2 = (o) => { o.userData.upper = true; o.userData.upper2 = true; return o; }, cut = (o) => { o.userData.cut = true; return o; };
  const R = LR(0, 0, S.len, S.dep), C = LR(S.len, 0, S.len + S.core, S.dep + S.gal), plot = LR(-0.6, -0.6, S.len + S.core + 0.6, S.dep + S.gal + 0.6);
  slab(sf, [[plot.x1, plot.y1], [plot.x2, plot.y1], [plot.x2, plot.y2], [plot.x1, plot.y2]], 0.3, M.slab);
  [floorsBlock(sf, R, FL, FH, M.beige, { parapet: 3, colSpacing: 12.4, sides: { E: M.plaster }, bands: M.plaster }),
   floorsBlock(sf, C, FL, FH, M.plaster, { parapet: 3, colSpacing: 9 })].forEach(fb => fb.children.forEach(m => { if (m.userData.upper && m.position.y > 1.9 * FH) m.userData.upper2 = true; }));
  cut(B(sf, S.len, 4, S.len + S.core, 16, 8, M.plaster, FL * FH));                                                // stair head room on the roof
  // open gallery (east): floor slabs, columns, railings, roof; unit doors + small gallery windows (west windows from the facade texture)
  for (let f = 0; f < FL; f++) {
    const U = f === 2 ? up2 : f ? up : (o) => o, z = f * FH;
    U(B(sf, 0, S.dep, S.len, S.dep + S.gal, 0.6, M.slab, f ? z : 0.3));
    for (let u = 0.4; u <= S.len; u += 12.4) U(B(sf, u - .4, S.dep + S.gal - 0.8, u + .4, S.dep + S.gal, FH, M.plaster, z));
    if (f) { const r = panel(sf, PT(0, S.dep + S.gal - 0.2), PT(S.len, S.dep + S.gal - 0.2), z + 0.6, 3.4, M.railBlue); if (r) U(r); }
    for (let k = 0; k < 8; k++) { const u = BW * k + 2; U(cut(B(sf, u, S.dep - .1, u + 3, S.dep + .2, 7, M.timber, z + 0.6))); U(cut(B(sf, u + 5.5, S.dep - .1, u + 9, S.dep + .2, 3, M.glass, z + 4))); }
  }
  cut(B(sf, -0.3, S.dep, S.len + 0.3, S.dep + S.gal + 0.3, 0.8, M.slab, FL * FH - 0.8));
  cut(B(sf, S.len + S.core - .2, 9, S.len + S.core + .1, 17, 7.5, M.timber, 0.3));                                 // entrance door (north)
  B(sf, S.len + S.core, 7.5, S.len + S.core + 3, 18.5, 0.4, M.steelDark, 8.5);                                     // canopy
  for (let f = 0; f < FL; f++) { const z = f * FH, g2 = new THREE.Group(); if (f) g2.userData.upper = true; if (f === 2) g2.userData.upper2 = true; sf.add(g2);
    stairFlight(g2, [...PT(S.len + 2.7, 2.5), z + 0.3], [...PT(S.len + 2.7, 15), z + FH / 2], 3.6, M.steelDark); stairFlight(g2, [...PT(S.len + 6.9, 15), z + FH / 2], [...PT(S.len + 6.9, 2.5), z + FH], 3.6, M.steelDark); }
  // ---- interiors (cut-away: top floor → middle floor → ground floor) ----
  const z0 = 0.6, z1 = FH + 0.8, zt = (FL - 1) * FH + 0.8;
  const g0 = new THREE.Group(); sf.add(g0);
  const g1 = new THREE.Group(); g1.userData.upper = true; sf.add(g1);
  const top = new THREE.Group(); top.userData.upper = true; top.userData.upper2 = true; sf.add(top);
  const cl = (text, u, v, z, flag) => { const [x, y] = PT(u, v); const l = label(sf, text, x, y, z, 'cut', 1); l.userData.cutOnly = true; l.userData[flag] = true; return l; };
  const bathBlock = (grp, u0, z, nWC, wuzu) => {                     // WCs along the west wall, showers in the middle, basins + wuzu by the gallery door
    const w = BW / nWC;
    PART(grp, u0 + 0.2, 7, u0 + BW - 0.2, 7, z, 7.5);
    for (let i = 1; i < nWC; i++) PART(grp, u0 + i * w, 0.8, u0 + i * w, 7, z, 7.5);
    for (let i = 0; i < nWC; i++) { const c = u0 + (i + 0.5) * w; B(grp, c - .7, 1.3, c + .7, 3.3, 1.3, M.whitePaint, z); B(grp, c - .6, 0.9, c + .6, 1.3, 2.4, M.whitePaint, z); }
    PART(grp, u0 + BW / 2, 7, u0 + BW / 2, 12.6, z, 7.5);
    [u0 + BW / 4, u0 + 3 * BW / 4].forEach(c => { B(grp, c - 1.6, 7.6, c + 1.6, 11.8, 0.15, M.tile, z, false); cyl(grp, ...PT(c, 8), 0.12, 6.6, M.steel, z, 6); B(grp, c - .5, 7.8, c + .5, 8.5, 0.2, M.steel, z + 6.6); });
    B(grp, u0 + 0.4, 13.6, u0 + 1.8, 19, 2.8, M.slab, z); [15, 17.6].forEach(v => B(grp, u0 + 0.6, v - .5, u0 + 1.6, v + .5, 0.25, M.whitePaint, z + 2.8));
    if (wuzu) { B(grp, u0 + BW - 6.8, 13.8, u0 + BW - 0.6, 15, 1.1, M.stoneDark, z); B(grp, u0 + BW - 6.8, 15.4, u0 + BW - 0.6, 15.8, 0.3, M.steel, z + 2.8); for (let u = u0 + BW - 6.4; u < u0 + BW - 0.8; u += 1.3) cyl(grp, ...PT(u, 15.6), 0.08, 0.6, M.steel, z + 2.5, 6); }
  };
  // ground: 4 bachelor rooms (bays 0–3), kitchen + eating (bay 4), bathrooms + wuzu (bay 5), mosque room (bays 6–7, by the entrance)
  [1, 2, 3, 4, 5, 6].forEach(k => PART(g0, BW * k, 0.8, BW * k, S.dep - .2, z0));
  for (let k = 0; k < 4; k++) { const u0 = BW * k;
    [[1, 4], [7.5, 10.5]].forEach(([v1, v2]) => { BED(g0, u0 + 0.8, v1, u0 + 5.9, v2, z0); BED(g0, u0 + 6.5, v1, u0 + 11.6, v2, z0); });
    B(g0, u0 + 7, 17.4, u0 + 11.6, 19, 5.5, M.steelBlue, z0); }
  const k4 = BW * 4;
  B(g0, k4 + 0.6, 1, k4 + BW - 0.6, 3.3, 3, M.slab, z0);
  B(g0, k4 + 1.4, 1.3, k4 + 5, 3, 0.4, M.darkMetal, z0 + 3); [k4 + 2.3, k4 + 4.1].forEach(u => cyl(g0, ...PT(u, 2.15), 0.75, 1.2, M.stainless, z0 + 3.4, 14));
  B(g0, k4 + 1.1, 0.9, k4 + 5.3, 3.2, 1.2, M.stainless, z0 + 6.8); B(g0, k4 + 6.8, 1.3, k4 + 9.2, 3, 0.5, M.steel, z0 + 2.6);
  [5, 6.6].forEach(v => cyl(g0, ...PT(k4 + BW - 1.4, v), 0.6, 3.2, M.trimRed, z0, 10)); B(g0, k4 + 0.8, 4.6, k4 + 3.2, 7, 6, M.whitePaint, z0);
  B(g0, k4 + 2.5, 11.5, k4 + 9.8, 14.3, 0.2, M.wood, z0 + 2.4); B(g0, k4 + 2.8, 11.8, k4 + 9.5, 14, 2.4, M.darkMetal, z0);
  [10.6, 15.2].forEach(v => B(g0, k4 + 2.5, v - .5, k4 + 9.8, v + .5, 1.5, M.wood, z0));
  bathBlock(g0, BW * 5, z0, 3, true);
  const m0 = BW * 6, mc = BW * 7;                                                                                  // mosque: mihrab on the west (qibla) wall
  B(g0, mc - 2.6, 0.8, mc + 2.6, 1.5, 8.2, T.dome, z0); B(g0, mc + 3.2, 1.5, mc + 6, 4.4, 3, M.wood, z0); B(g0, mc + 3.2, 1.5, mc + 6, 2.6, 1.4, M.wood, z0 + 3);
  for (let i = 0; i < 4; i++) B(g0, m0 + 1.4, 3.4 + i * 3.6, m0 + 2 * BW - 1.4, 6.2 + i * 3.6, 0.08, SFM().rug, z0, false);   // prayer-rug rows parallel to the qibla wall
  B(g0, m0 + 0.6, 17.6, m0 + 3, 19.5, 4.5, M.wood, z0); person(g0, ...PT(mc, 9), z0, M.kurta3);
  cl('Mosque room · ≈40–50', mc, 10, z0 + 4, 'groundOnly'); cl('Bathrooms + wuzu', BW * 5.5, 10, z0 + 4, 'groundOnly');
  cl('Kitchen + eating', BW * 4.5, 10, z0 + 4, 'groundOnly'); cl('Bachelor rooms · 16 beds', BW * 2, 10, z0 + 4, 'groundOnly');
  // 1st floor: 7 staff rooms (bays 0–6) + shared bathrooms next to the stair (bay 7)
  for (let k = 1; k < 8; k++) PART(g1, BW * k, 0.8, BW * k, S.dep - .2, z1);
  for (let k = 0; k < 7; k++) { const u0 = BW * k;
    BED(g1, u0 + 0.8, 1, u0 + 5.9, 4, z1); BED(g1, u0 + 6.5, 1, u0 + 11.6, 4, z1);
    B(g1, u0 + 1, 9, u0 + 4.4, 11.4, 2.5, M.wood, z1); B(g1, u0 + 7, 17.4, u0 + 11.6, 19, 5.5, M.steelBlue, z1); }
  bathBlock(g1, BW * 7, z1, 2, false);
  cl('Staff rooms · 7 × 2 beds', BW * 3.5, 10, z1 + 4, 'firstOnly'); cl('Bathrooms', BW * 7.5, 10, z1 + 4, 'firstOnly');
  // 2nd floor: 4 family flats — two rooms, kitchen, own bath
  for (let k = 0; k < 4; k++) {
    const u0 = 24.75 * k, um = u0 + 12.375; if (k) PART(top, u0, 0.8, u0, S.dep - .2, zt);
    PART(top, um, 0.8, um, S.dep - 6, zt); PART(top, u0 + 0.3, S.dep - 7, u0 + 6, S.dep - 7, zt); PART(top, u0 + 6, S.dep - 7, u0 + 6, S.dep - .3, zt);
    BED(top, u0 + 1.2, 1.2, u0 + 6.4, 7.6, zt); BED(top, um + 1.2, 1.2, um + 6.4, 4.4, zt); BED(top, um + 6.8, 1.2, um + 11.6, 4.4, zt);
    B(top, um + 1, S.dep - 2.4, um + 9, S.dep - 0.6, 3, M.slab, zt); B(top, u0 + 7, 11, u0 + 11, 13, 2.4, M.wood, zt);
    B(top, u0 + 0.9, S.dep - 6.4, u0 + 2.3, S.dep - 4.6, 1.3, M.whitePaint, zt); B(top, u0 + 3, S.dep - 6.5, u0 + 5.6, S.dep - 4, 0.15, M.tile, zt, false);
  }
  cl('Family flats · 4 (own bath + kitchen)', S.len / 2, 10, zt + 4, 'upper2');
  const ms = pumpSign(sf, T.masjid, 12, 1.6, ...PT(mc, S.dep + 0.45), 8.3, Math.PI / 2); ms.userData.cut = true;   // mosque sign over its doors
  // roof (hidden in cut-away): tanks + solar rows
  const roofG = new THREE.Group(); roofG.userData.cut = true; sf.add(roofG);
  [10, 35, 60, 85].forEach(u => waterTank(roofG, ...PT(u, 3.5), FL * FH));
  [6, 20, 34, 48, 62, 76, 90].forEach(u => solarArray(roofG, ...PT(u, 12.5), FL * FH + 2, 14, 8, 0.2, 0));
  person(sf, ...PT(S.len + S.core + 2.5, 12), 0.3, M.kurta); person(sf, ...PT(40, S.dep + 2.5), 0.6, M.kurta2);
  tag(sf, plot, {
    name: 'Staff flats (proposed)', status: 'new', size: '≈25.5 × 108.5 ft incl. stair core · G + 2 · long side north–south',
    area: '≈8,300 sq ft built (3 floors × ≈2,760)',
    notes: 'Housing for mill staff, moved in v24 off the back of the petrol pump (homes can’t stand behind a pump) into the middle of the old trolley-holding area. Placement: long side north–south between store B (west, next to the pump) and store A on the old weighbridge spot (east); entrance and stair at the north end, onto the mill front. Ground floor: 4 bachelor rooms (16 beds; bunks would make 24), a kitchen with an eating area, a shared bathroom block with a wuzu bench, and a mosque room for ≈40–50 right by the entrance so mill workers can use it too, with the mihrab on the west (qibla) wall. 1st floor: 7 staff rooms (2 beds each) sharing one bathroom block by the stair. 2nd floor: 4 family flats (two rooms, kitchen and their own bath). Gallery: open, along the east side, onto a ≈6.5 ft walkway; from the 1st floor up the west windows look over store B’s roof. Pump safety: the tanks are now ≈105 ft away (they were ≈65 ft), with store B in between. Watch: the south end faces the drying loop, so expect harvest dust and tractor noise; foundations can be sized for a 3rd floor (4 more family flats). Cut-away: once for the 2nd floor, twice for the 1st floor, three times for the ground floor.',
    finance: {
      rows: [
        ['Units', 'Ground: mosque room, shared bathrooms + wuzu, kitchen + eating, 4 bachelor rooms (16 beds) · 1st: 7 staff rooms (14 beds) + shared bathrooms · 2nd: 4 family flats'],
        ['Built area', '≈8,300 sq ft (3 floors × ≈2,760 incl. gallery + stair)'],
        ['Build cost', 'Rs 3.5–4.5 cr (≈ Rs 4,000–5,000/sq ft, basic finish, plus tanks, solar, sewer)'],
        ['— per family flat (2nd floor)', '≈ Rs 30–38 lakh'],
        ['— per bed (rooms on ground + 1st)', '≈ Rs 6–8 lakh, mosque room, kitchen and bathrooms included'],
        ['With a 3rd floor later', '+4 family flats ≈ Rs 1.2–1.5 cr'],
      ],
      note: 'Planning estimate at Nov 2026 rates; land already owned. Same building and cost as v21, only turned and moved. Staff housing pays back in retention and in house-rent allowance saved rather than rent, so no ROI is shown.',
    },
    round: 24,
  });
  label(sf, 'Staff flats · G+2', ...PT(S.len / 2, 12), 38, '', 1);
  mergeByMaterial(sf);
}

function today(g) {
  const z = new THREE.Group(); z.userData.optionOff = true; g.add(z);
  const pts = [[0, 410], [165, 410], [165, ytop(165) - 2], [0, 528 - 2]];
  const s = slab(z, pts, 0.4, M.ghost, 0); s.renderOrder = 2;
  ghost(z, { x1: 122, y1: 418, x2: 161, y2: 541 }, 30);
  ghost(z, { x1: 8, y1: 420, x2: 105, y2: 470 }, 18);
  tag(z, { x1: 0, y1: 410, x2: 195, y2: 581.6 }, { name: 'Front zone (today)', status: 'review', size: 'Trapezoid, 202 ft of frontage', area: '≈28,200 sq ft ≈ 6.3 kanal', notes: 'The old rice mill stands here until the new one runs; its machinery building (≈39 × 123 ft) moves back to the milling hall. Turn on "Options" to see the recommended hybrid layout.', round: 6 });
  label(z, 'Front zone · old mill (today)', 70, 495, 6, 'review', 1);
}

function hybrid(g) {
  const o = new THREE.Group(); o.userData.option = true; g.add(o);

  // ---------- A. petrol pump (west end, ≈2.5 kanal) — v24: laid out after Saad's reference drawing, fitted to the real plot and
  // mirrored so cars enter at the east end (traffic on this side of the road drives west) and leave at the west end ----------
  const pp = new THREE.Group(); pp.name = 'pump'; o.add(pp);
  const PX = 111, PY = 440, T = pumpTex(), zf = 0.8;
  slab(pp, [[0, PY], [PX, PY], [PX, ytop(PX)], [0, 528]], 0.3, M.concrete);
  segBox(pp, [0, PY], [PX, PY], 1.1, 8, M.brick); segBox(pp, [PX, PY], [PX, ytop(PX)], 1.1, 8, M.brick);          // back wall (trolley strip) + east wall
  // frontage: exit (west, t 2–28), kerbed landscaped median (t 30–74), entry (east, t 76–102), planted corner by the entry
  slab(pp, [at(0, 0), at(30, 0), at(30, 18), at(0, 18)], 0.25, M.road, -0.05); slab(pp, [at(74, 0), at(104, 0), at(104, 18), at(74, 18)], 0.25, M.road, -0.05);
  slab(pp, [at(30, 0), at(74, 0), at(74, 16), at(30, 16)], 0.2, M.grass, -0.05);
  slab(pp, [at(30, -1.5), at(74, -1.5), at(74, -7), at(30, -7)], 0.9, M.slab);
  segBox(pp, at(30, -1.5), at(74, -1.5), 0.5, 1.2, M.yellow); segBox(pp, at(30, -7), at(74, -7), 0.5, 1.2, M.yellow);
  for (let t = 33; t < 72; t += 5.5) { const [x, y] = at(t, -4.2); box(pp, x - 2, y - 1, x + 2, y + 1, 1.8, M.hedge, 0.9); }
  slab(pp, [[101.5, 521], [110.4, 521], [110.4, ytop(110.4) - 1.2], at(105, -1.2)], 0.5, M.grass);
  trees(pp, [[...at(42, -4.2), 0.42, 0], [...at(62, -4.2), 0.42, 0], [106.5, 532, 0.48, 0], [106.5, 545, 0.42, 0]], 41);
  // back row, west: fenced underground tank farm — 20,000 L petrol, 30,000 L diesel, 10,000 L HOBC — vent pipes, fill point
  const TF = { x1: 1.5, y1: 441, x2: 29, y2: 463 };
  box(pp, TF.x1, TF.y1, TF.x2, TF.y2, 0.1, M.slab, 0.3, false);
  [7, 15, 23].forEach(x => { cyl(pp, x, 452, 2.3, 0.15, M.steelDark, 0.4, 18); cyl(pp, x, 452, 1.4, 0.2, M.steel, 0.45, 14); });
  [444, 447, 450].forEach(y => { cyl(pp, 2.2, y, 0.2, 14, M.steel, 0, 6); cyl(pp, 2.2, y, 0.35, 0.6, M.steelDark, 14, 8); });
  box(pp, 24, 459.6, 28.2, 462.4, 3, M.steelDark, 0.3); segBox(pp, [24.5, 459.5], [24.5, 454], 0.3, 0.3, M.steel, 0.5);
  panel(pp, [TF.x1, TF.y2], [TF.x2 - 6, TF.y2], 0.3, 6, M.railBlue); panel(pp, [TF.x2, TF.y1 + 0.6], [TF.x2, TF.y2], 0.3, 6, M.railBlue);
  [[TF.x1, TF.y2], [TF.x2 - 6, TF.y2], [TF.x2, TF.y2], [TF.x2, TF.y1 + 0.6]].forEach(([x, y]) => box(pp, x - .2, y - .2, x + .2, y + .2, 6.3, M.steelDark, 0.3));
  // back row, middle: sales building ≈56 × 20 ft — prayer room (masjid), washrooms M / F, cash room, manager’s office, mart / tuck shop
  const SB = { x1: 32, y1: 441, x2: 88, y2: 461 };
  floorsBlock(pp, SB, 1, 13, M.office, { parapet: 2, roof: M.slab, sides: { N: M.plaster } });
  [41, 46.5, 52, 58, 65].forEach(x => partition(pp, [x, SB.y1 + .8], [x, SB.y2 - .8], zf, 9.5));
  box(pp, 32.8, 448.5, 33.4, 453.5, 7.5, T.dome, zf); [35.2, 38.2].forEach(x => box(pp, x, 442.5, x + 2.4, 459.4, 0.08, SFM().rug, zf, false));   // mihrab on the west wall + rugs
  [[42.5, 444], [42.5, 448], [48, 444], [48, 448]].forEach(([x, y]) => box(pp, x, y, x + 1.4, y + 1.8, 1.3, M.whitePaint, zf));                    // WCs
  [[44.6, 457], [50.1, 457]].forEach(([x, y]) => box(pp, x, y, x + 1.4, y + 2.6, 2.8, M.slab, zf));                                              // basins
  box(pp, 53, 442, 56, 445, 4, M.darkMetal, zf); box(pp, 53, 449, 57, 451.5, 2.6, M.wood, zf);                                                 // cash room: safe + counter
  box(pp, 59.5, 446, 63.5, 448.5, 2.6, M.wood, zf); box(pp, 60.8, 443.4, 62.2, 444.8, 3, M.cushion, zf);                                        // manager: desk + chair
  [445, 449.5, 454].forEach(y => box(pp, 70, y, 84, y + 1.6, 6, M.steelBlue, zf));                                                            // mart shelves
  box(pp, 65.4, 442, 67, 455, 7, M.whitePaint, zf); box(pp, 66.2, 456, 72, 458.5, 3.5, M.slab, zf);                                            // fridges + counter
  [[35, 2.6, M.timber], [42.4, 2.6, M.timber], [48, 2.6, M.timber], [59.5, 2.6, M.timber], [74, 4, M.glass]].forEach(([x, w, m]) => cutMesh(box(pp, x, SB.y2 - .4, x + w, SB.y2 + .4, 7.5, m, 0.3)));   // doors
  cutMesh(box(pp, 66, SB.y2 - .2, 87, SB.y2 + .35, 9, M.glass, 1.2));                                                                          // mart glass front
  box(pp, 31.5, 461, 88.5, 464.5, 0.5, M.canopyBand, 11.6); [32, 60, 88].forEach(x => box(pp, x - .3, 464, x + .3, 464.5, 11.6, M.steel, 0));   // front canopy
  cutMesh(pumpSign(pp, T.mart, 20, 2.4, 76.5, SB.y2 + 0.45, 13.9)); cutMesh(pumpSign(pp, T.masjid, 8, 1.3, 36.5, 464.6, 10.6));
  const rf0 = new THREE.Group(); rf0.userData.cut = true; pp.add(rf0);
  waterTank(rf0, 84, 445, 13); acUnit(rf0, 70, 444, 13); acUnit(rf0, 77, 444, 13); solarArray(rf0, 50, 451, 14.6, 28, 14, 0.2, 0);
  [['Prayer room (masjid)', 36.5], ['Washrooms M / F', 46.5], ['Cash room', 55], ['Manager', 61.5], ['Mart · tuck shop', 76.5]].forEach(([t, x]) => { const l = label(pp, t, x, 451, 6, 'cut', 1); l.userData.cutOnly = true; });
  // east side: service + lube bay (400 sq ft), 3 parking bays, 3 solar-shaded bays, planted corner by the entry
  block(pp, { x1: 91, y1: 441, x2: 110.4, y2: 461 }, 1, 14, M.ops, { parapet: 1.5 });
  shutter(pp, 100.7, 461, 'N', 12, 11, M.yellow); pumpSign(pp, T.tyre, 18, 2, 100.7, 461.4, 12.4, Math.PI);
  [463, 472, 481, 490, 501, 510, 519].forEach(y => box(pp, 93, y - .2, 110.4, y + .2, 0.05, M.whitePaint, 0.32, false));
  car(pp, 103, 467.5, -Math.PI / 2, 0xffffff); car(pp, 103, 476.5, -Math.PI / 2, 0x2b2f36); car(pp, 103, 496.5, -Math.PI / 2, 0xb0b5ba); car(pp, 103, 514.5, -Math.PI / 2, 0x7a1f1f);
  [[94, 492.5], [94, 518.5], [109.8, 492.5], [109.8, 518.5]].forEach(([x, y]) => box(pp, x - .3, y - .3, x + .3, y + .3, 9, M.steel, 0.3));
  solarArray(pp, 101.9, 505.5, 9.6, 17.6, 27, 0.1, 0);
  // forecourt: steel canopy ≈56 × 28 ft over 4 islands / 8 dispensers (outer east island = high-flow diesel for trucks + the mills’ tractors)
  const C = { x1: 14, y1: 478, x2: 70, y2: 506 };
  [16, 42, 68].forEach(x => [480, 504].forEach(y => box(pp, x - .7, y - .7, x + .7, y + .7, 17.3, M.whitePaint, 0.3)));
  boxR(pp, C, 2.6, M.canopyWhite, 17.3); box(pp, C.x1 + 2, C.y1 + 2, C.x2 - 2, C.y2 - 2, 0.12, T.led, 17.2);
  [[C.x1 - .2, C.y1 - .2, C.x2 + .2, C.y1 + .4], [C.x1 - .2, C.y2 - .4, C.x2 + .2, C.y2 + .2], [C.x1 - .2, C.y1, C.x1 + .4, C.y2], [C.x2 - .4, C.y1, C.x2 + .2, C.y2]].forEach(([a, b, c, d]) => box(pp, a, b, c, d, 2.4, M.canopyBand, 17.6));
  pumpSign(pp, T.fascia, 50, 2, 42, C.y2 + 0.25, 18.8, Math.PI); pumpSign(pp, T.fascia, 50, 2, 42, C.y1 - 0.25, 18.8, 0);
  const island = (x1, x2, y, hiflow) => {
    box(pp, x1, y - 1.7, x2, y + 1.7, 0.6, M.slab, 0.3); box(pp, x1 - .3, y - 1.7, x1 + 1, y + 1.7, 0.7, M.yellow, 0.3); box(pp, x2 - 1, y - 1.7, x2 + .3, y + 1.7, 0.7, M.yellow, 0.3);
    [x1 + 3.6, x2 - 3.6].forEach(x => { box(pp, x - 1.3, y - .8, x + 1.3, y + .8, hiflow ? 6.5 : 5.8, M.canopyWhite, 0.9); box(pp, x - 1.35, y - .85, x + 1.35, y + .85, 1, hiflow ? M.yellow : M.canopyBand, hiflow ? 6.4 : 5.7); box(pp, x - .8, y - .9, x + .8, y - .85, 0.9, T.screen, 3.8); box(pp, x - .8, y + .85, x + .8, y + .9, 0.9, T.screen, 3.8); });
  };
  island(20, 34, 485); island(46, 60, 485); island(20, 34, 499); island(46, 60, 499, true);
  car(pp, 27, 489.5, Math.PI / 2, 0xffffff); car(pp, 53, 480.8, Math.PI / 2, 0x2b2f36); car(pp, 27, 503.4, Math.PI / 2, 0xb0b5ba); truck(pp, 52, 503.6, Math.PI / 2, true);
  person(pp, 33, 488, 0.3, M.kurta2); person(pp, 59, 497.5, 0.3, M.kurta3);
  box(pp, 3, 488, 6, 491, 6, M.steelBlue, 0.3); cyl(pp, 4.5, 489.5, 0.9, 1, M.trimRed, 6.3, 12);                                                // air / water point
  const [px, py] = at(31, -4.2); box(pp, px - .6, py - .6, px + .6, py + .6, 4, M.stoneDark, 0.9);                                                 // fuel totem by the exit
  const pl = new THREE.Mesh(new THREE.BoxGeometry(6.5, 20, 1.1), [M.canopyBand, M.canopyBand, M.canopyBand, M.canopyBand, T.pylon, T.pylon]); pl.position.copy(P(px, py, 14.9)); pl.rotation.y = Math.atan2(N[0], -N[1]) + Math.PI; pl.castShadow = true; pp.add(pl);
  [[8, 470], [88, 470], [90, 528]].forEach(([x, y]) => { cyl(pp, x, y, 0.3, 24, M.steel, 0, 8); box(pp, x - 2, y - .5, x + 2, y + .5, 0.8, M.steelDark, 24); });
  pumpArrow(pp, ...at(89, 6), Math.PI + 0.27); pumpArrow(pp, 83, 515, Math.PI); pumpArrow(pp, 83, 494, Math.PI); pumpArrow(pp, 60, 471, Math.PI / 2); pumpArrow(pp, 30, 471, Math.PI / 2);
  pumpArrow(pp, 66, 492, Math.PI / 2); pumpArrow(pp, 8, 500, 0.15); pumpArrow(pp, ...at(15, 6), 0.27);
  tag(pp, { x1: 0, y1: PY, x2: PX, y2: 556 }, {
    name: 'Option: petrol pump', status: 'review', size: '≈111 ft wide · 88–118 ft deep · ≈115 ft of frontage', area: '≈11,400 sq ft ≈ 2.5 kanal',
    notes: 'v24: laid out after Saad’s reference drawing for a 2.5 kanal pump, fitted to the real plot and mirrored so cars enter at the east end and leave at the west (traffic on this side of the road drives west). Frontage: a 26 ft entry (east) and a 26 ft exit (west) with a kerbed, planted median between them, the fuel totem by the exit and a planted corner by the entry. Forecourt: a steel canopy ≈56 × 28 ft over 4 islands with 8 dispensers for petrol, HOBC and diesel; the outer east island is a high-flow diesel lane for trucks and the mills’ tractors (17 ft clear). Sales building (back row, ≈56 × 20 ft): mart / tuck shop, manager’s office, cash room, male and female washrooms and a prayer room (masjid) with its own door. Tank farm (south-west corner, fenced): 20,000 L petrol, 30,000 L diesel and 10,000 L HOBC underground, vent pipes on the west wall and a fill point. East side: a 400 sq ft service + lube bay, 3 parking bays and 3 solar-shaded bays; air / water point on the exit side. Behind the pump: the 30 ft strip is now the trolley holding strip, because homes can’t stand behind a pump; the staff flats moved east into the middle of the old trolley area. Branding left neutral (OMC not chosen).',
    finance: {
      rows: [
        ['Build cost', 'Rs 3.6–5.0 cr (≈ 2.7–3.8 cr if the OMC funds tanks, dispensers + branding)'],
        ['— forecourt, canopy, 8 dispensers, 60,000 L of tanks', 'Rs 2.2–3.0 cr'],
        ['— sales building + lube bay (≈1,520 sq ft)', 'Rs 0.8–1.0 cr'],
        ['— solar carport, median + planting, licences / NOCs, working capital', 'Rs 0.6–1.0 cr'],
        ['Fuel margin', 'Rs 9.98/L dealer margin (since Aug 2026)'],
        ['Net per year (4,000 L/day incl. the mills’ own diesel)', '≈ Rs 0.8 cr (fuel ≈ 0.6 + mart / lube ≈ 0.2)'],
        ['Range', '2,500 L/day ≈ 0.35 cr · 6,000 L/day ≈ 1.5 cr'],
        ['ROI on build cost', '≈ 18 %/yr (7–40 %)'],
        ['Payback', '≈ 5.5 years (2.5–14)'],
      ],
      note: 'Tank stock: 60,000 L is ≈ 15 days at 4,000 L/day. Decide only after a 7-day traffic count and 2–3 OMC offers. Confirm the Explosives Department NOC distances: tanks to the paddy store (≈30 ft south of the tank farm), the trolley strip and the boiler; the staff flats are now ≈105 ft away. Land already owned.',
    },
    round: 24,
  });
  label(pp, 'Option: petrol pump', 42, 492, 24, 'review', 1);
  label(pp, 'Sales building · mart, office, washrooms, masjid', 60, 451, 17, '', 2); label(pp, 'Tank farm (UST)', 15, 452, 6, '', 2); label(pp, 'Service + lube', 100.7, 451, 16, '', 2);
  label(pp, 'Parking', 102, 476, 6, '', 2); label(pp, 'Solar-shaded parking', 102, 505, 12, '', 2); label(pp, 'Hi-flow diesel', 53, 499, 9, '', 2); label(pp, 'Air / water', 4.5, 489.5, 8, '', 2);
  label(pp, 'Entry', ...at(89, 9), 2, 'road', 2); label(pp, 'Exit', ...at(15, 9), 2, 'road', 2);

  // ---------- B. shop row on the frontage (6 shops) ----------
  const sh = new THREE.Group(); sh.name = 'shops'; o.add(sh);
  const T0 = 116, W = 10.6, D = 22;
  slab(sh, [at(T0, 0), at(T0 + 6 * W, 0), at(T0 + 6 * W, 18), at(T0, 18)], 0.25, M.road, -0.05);   // parking strip in front
  for (let i = 0; i < 6; i++) {
    const s0 = new THREE.Group(); sh.add(s0);
    const c = at(T0 + (i + 0.5) * W, -D / 2);
    const b = new THREE.Mesh(new THREE.BoxGeometry(W - 0.3, 12, D), [M.house, M.house, M.slab, M.slab, M.house, SHOPFRONT()]);
    b.position.copy(P(c[0], c[1], 6)); b.rotation.y = ang; b.castShadow = true; b.receiveShadow = true; s0.add(b);
    const cn = new THREE.Mesh(new THREE.BoxGeometry(W, 0.4, 4), i % 2 ? M.canopyBand : M.trimRed); const cc = at(T0 + (i + 0.5) * W, 1.8); cn.position.copy(P(cc[0], cc[1], 9.5)); cn.rotation.y = ang; s0.add(cn);
  }
  segBox(sh, at(T0 + 6 * W + 0.3, -0.6), [195, ytop(195) - 0.6], 1.1, 9, M.brick);   // wall from the last shop to the gate pillar
  const [x1, y1] = at(T0 + 3 * W, -D - 0.5), back = new THREE.Mesh(new THREE.BoxGeometry(6 * W + 1, 9, 1.1), M.brick); back.position.copy(P(x1, y1, 4.5)); back.rotation.y = ang; sh.add(back);
  car(sh, ...at(T0 + 1.5 * W, 9), ang + Math.PI / 2 - Math.PI / 2, 0x7a1f1f);
  person(sh, ...at(T0 + 4 * W, 5)); person(sh, ...at(T0 + 4.4 * W, 6), 0, M.kurta3);
  tag(sh, null, { name: 'Option: shop row', status: 'review', size: '6 shops ≈ 10.6 × 22 ft, ≈64 ft of frontage', notes: 'Small shops facing the road with a parking strip in front: tyre and puncture, lubricants, a dhaba, and a retail counter for your own rice and flour. Rent estimate in the doc: 14–29 lakh/yr for 6–8 shops.', round: 6 });
  label(sh, 'Option: shop row', ...at(T0 + 3 * W, -6), 16, 'review', 1);

  // ---------- C. mill front: trolley holding area, visitor parking, sales + admin office ----------
  const mf = new THREE.Group(); mf.name = 'millFront'; o.add(mf);
  slab(mf, [[PX, 410], [165, 410], [165, 515], [195, 515], [195, 522], [PX, 522]], 0.3, M.road);
  trolleyStrip(o);                                                                                       // v24: trolley holding moved behind the pump
  storeShed(mf, { x1: 112, y1: 412, x2: 130, y2: 506 }, STORE_B, { name: 'storeB', eave: 16, rise: 2 });  // v24: store B, between the pump and the flats
  slab(mf, [[165, 410], [195, 410], [195, 515], [165, 515]], 0.3, M.concrete);                             // old weighbridge bay + loop corner, paved
  storeShed(mf, SITE.frontStore, STORE_A, { name: 'storeA', eave: 20, rise: 3 });                         // store A on the old weighbridge spot (v20/v21)
  slab(mf, [[PX, 522], [168, 522], [168, ytop(168) - 23.5], [PX, ytop(PX) - 23.5]], 0.3, M.asphalt);
  [[118, 529.5], [127, 529.5], [136, 529.5], [145, 529.5], [154, 529.5]].forEach(([x, y], i) => car(mf, x, y, 0, [0xffffff, 0x1f2a44, 0xb0b5ba, 0x7a1f1f, 0xd8d8d8][i]));
  const off = { x1: 168, y1: 523, x2: 193.5, y2: 548 };
  block(mf, off, 1, 11, M.office, { parapet: 3 });
  box(mf, 193.5, 530, 196, 541, 0.5, M.steelDark, 10);
  waterTank(mf, 172, 527, 11); acUnit(mf, 180, 545, 11); acUnit(mf, 186, 545, 11);
  trees(mf, [[118, 515, 0.45, 0], [164.6, 515, 0.42, 0], [164.6, 470, 0.4, 0]], 77);
  tag(mf, { x1: PX, y1: 410, x2: 195, y2: 560 }, { name: 'Option: mill front', status: 'review', notes: 'The part of the front zone between the petrol pump and the mill’s main road, in the original (hybrid) layout. Visitor parking and a single-storey sales counter + visitor reception beside the gate (the head office itself is in the east block, so this stays small). v24 behind them, west to east: store B against the pump’s east wall, the staff flats (moved here from behind the pump) and store A on the old weighbridge spot. Trolley holding moved to the strip behind the pump (v24); the trolleys reach the weighbridge at the end of the main road through the drying loop. The old mill is demolished in this option.', round: 24 });
  label(mf, 'Sales counter + reception', 180.75, 535.5, 16, 'review', 2);
  label(mf, 'Visitor parking', 136, 532, 8, 'review', 2);
  mergeByMaterial(pp); mergeByMaterial(sh); mergeByMaterial(mf);
}

// ---------- v24: trolley holding strip behind the petrol pump (the old staff-flats strip, x 0–111 × y 410–440) ----------
// Three east → west queue lanes parallel to the drying loop's north leg, under an open-sided solar roof falling 5° to the south.
// Trolleys leave the loop at the east end, queue westward and rejoin the loop at its north-west corner (then down past the
// paddy-store doors and round to the main road and the weighbridge at its far end).
export const TROLLEY_STRIP = { x1: 0.6, y1: 410.6, x2: 110.6, y2: 439.6, low: 16, slope: 5, across: 28, rows: 3, wp: 650 };
function trolleyStrip(o) {
  const ts = new THREE.Group(); ts.name = 'trolleyStrip'; o.add(ts);
  const R = TROLLEY_STRIP, a = R.slope * Math.PI / 180, H = (y) => R.low + (y - R.y1) * Math.tan(a), T = pumpTex();
  const cut = (m) => { m.userData.cut = true; return m; };
  slab(ts, [[0.6, 410.2], [111, 410.2], [111, 440], [0.6, 440]], 0.3, M.road);
  [420.2, 429.8].forEach(y => { for (let x = 47; x < 108; x += 8) box(ts, x, y - .15, x + 4.5, y + .15, 0.05, M.whitePaint, 0.32, false); });
  box(ts, 45.6, 410.6, 46, 439.6, 0.05, M.yellow, 0.32, false);
  [415.4, 425, 434.6].forEach(y => pumpArrow(ts, 99, y, Math.PI / 2));
  pumpArrow(ts, 104, 405, Math.PI / 2 - 0.5); pumpArrow(ts, 50, 405, Math.PI / 2 + 0.55);
  // frames: columns on two lines, sloped rafters, eave beams, LED lights
  const xs = [1.3, 23.2, 45.1, 67, 88.9, 110.1], ys = [411.3, 439];
  xs.forEach(x => {
    ys.forEach(y => { box(ts, x - .45, y - .45, x + .45, y + .45, H(y) - 2.3, M.steelDark, 0); box(ts, x - .9, y - .9, x + .9, y + .9, 0.6, M.slab, 0); });
    strut(ts, [x, ys[0] - 0.6, H(ys[0] - 0.6) - 1.6], [x, ys[1] + 0.6, H(ys[1] + 0.6) - 1.6], 1.4, M.steelDark);
  });
  ys.forEach(y => strut(ts, [xs[0], y, H(y) - 2.3], [xs[5], y, H(y) - 2.3], 0.8, M.steelDark));
  [12, 34, 56, 78, 100].forEach(x => box(ts, x - .9, 424.5, x + .9, 425.5, 0.3, T.led, H(425) - 2.8));
  // roof sheets, purlins, gutter + fascia and the panels, tilted 5° (low edge south)
  const L = (R.y2 - R.y1) / Math.cos(a), W = R.x2 - R.x1, cx = (R.x1 + R.x2) / 2, cy = (R.y1 + R.y2) / 2;
  const rf = new THREE.Group(); rf.position.copy(P(cx, cy, H(cy))); rf.rotation.x = a; ts.add(rf);
  const add = (geo, mat, px, py, pz) => { const m = new THREE.Mesh(geo, mat); m.position.set(px, py, pz); m.castShadow = true; m.receiveShadow = true; cut(m); rf.add(m); return m; };
  add(worldBox(W, 0.25, L), M.roof, 0, 0, 0);
  for (let z = -L / 2 + 1.5; z <= L / 2 - 1.4; z += 4.4) add(worldBox(W - 0.4, 0.6, 0.35), M.steelDark, 0, -0.45, z);
  add(worldBox(W + 0.4, 0.9, 0.9), M.steelDark, 0, -0.2, L / 2 + 0.35); add(worldBox(W + 0.4, 1.4, 0.3), M.steelDark, 0, 0.1, -L / 2 - 0.15);
  const PW = 3.72, PL = 7.815, GAP = 0.066, rowW = R.across * PW + (R.across - 1) * GAP, span = R.rows * PL + (R.rows - 1) * GAP;
  const pg = new THREE.BoxGeometry(PW - 0.04, 0.12, PL - 0.04), uv = pg.attributes.uv;
  for (let k = 0; k < uv.count; k++) uv.setXY(k, uv.getX(k) * 6, uv.getY(k) * 3.3);
  for (let r = 0; r < R.rows; r++) {
    const zc = span / 2 - (r + 0.5) * PL - r * GAP;
    for (let c = 0; c < R.across; c++) add(pg, M.solar, -rowW / 2 + PW / 2 + c * (PW + GAP), 0.32, zc);
    [0.3, -0.3].forEach(e => add(new THREE.BoxGeometry(rowW, 0.12, 0.2), M.steel, 0, 0.2, zc + e * PL));
  }
  xs.forEach(x => cyl(ts, x + 0.9, 410.9, 0.3, R.low, M.steelDark, 0, 8));
  box(ts, 106.8, 436.4, 109.6, 438.6, 5, M.whitePaint, 1);                                                    // inverter
  [[56, 415.4], [90, 415.4], [62, 425], [58, 434.6], [92, 434.6]].forEach(([x, y]) => tractor(ts, x, y, Math.PI / 2, true, 0));
  tractor(ts, 20, 430, Math.PI / 2, true, 0); person(ts, 100, 420.5, 0.3);
  const n = R.across * R.rows, kwp = (n * R.wp / 1000).toFixed(1);
  tag(ts, { x1: 0, y1: 410, x2: 111, y2: 440 }, {
    name: 'Option: trolley holding strip + solar roof', status: 'review', size: '≈110 × 29 ft roof · open sides · 16 ft (south) to ≈18.5 ft (north)',
    area: `≈3,190 sq ft covered · ${n} × ${R.wp} W ≈ ${kwp} kWp`,
    notes: 'v24: the trolley holding area moved here, onto the old staff-flats strip behind the petrol pump: trolleys can stand behind a pump, homes can’t. Lanes: three east → west queue lanes run parallel to the drying loop’s north leg; trolleys leave the loop at the east end, queue under the roof and rejoin the loop at its north-west corner. Route: from there down past the paddy-store doors and round the loop to the main road, then to the weighbridge at its far end. Walls: the pump’s back wall closes the north side and store B the east end. Pocket: the west end (x 0–46, north of the paddy store) holds empty trolleys or overflow. Capacity: ≈6 tractor-trolleys in the lanes plus ≈2 in the pocket (the old holding area took ≈8). Roof: open-sided, one 5° slope falling south, keeps paddy and drivers dry and carries 84 × 650 W panels flush on the sheets (≈55 kWp). The store room and stock bay of the old holding area are replaced by store B.',
    finance: {
      rows: [
        ['Capacity (as modelled)', `≈ ${kwp} kWp · ${n} × ${R.wp} W · 1 × 50 kW inverter`],
        ['Energy per year', '≈ 68–74 MWh (≈ 1,250–1,350 kWh per kWp)'],
        ['Steel roof (frames, purlins, sheets, gutters, footings, LED lights)', 'Rs 0.5–0.75 cr (≈ Rs 1,500–2,300/sq ft)'],
        ['Solar (flush-mounted, turnkey)', 'Rs 0.33–0.44 cr (≈ Rs 60–80/W)'],
        ['Total', 'Rs 0.85–1.2 cr'],
        ['Net per year (power used in the mill)', '≈ Rs 18–24 lakh'],
        ['Payback', 'Solar alone ≈ 1.5–2.5 yrs · with the roof ≈ 3.5–6.5 yrs'],
      ],
      note: 'Planning estimates at Nov 2026 prices, on the same basis as the other solar cards (B2 off-peak Rs 22.83 + taxes; net-billing exports earn only ≈ Rs 8–11/unit). Confirm with the Explosives Department that a roofed trolley queue behind the pump is acceptable (no homes, no open flames).',
    },
    round: 24,
  });
  label(ts, `Option: trolley holding strip · ≈${Math.round(+kwp)} kWp`, 62, 425, 23, 'review', 1);
  label(ts, 'In from the drying loop', 104, 403, 2, 'road', 2); label(ts, 'Out → loop → weighbridge', 50, 403, 2, 'road', 2); label(ts, 'Pocket · empty trolleys', 22, 425, 3, '', 2);
  mergeByMaterial(ts);
}

// ---------- stores in the original front zone: A (old weighbridge spot, v20/v21) and B (v24, between the pump and the flats) ----------
// Plain clear-span PEB sheds (white cladding, red trim like finished goods), roller shutters at both ends, so they can change use later.
const STORE_A = {
  name: 'Option: store A (old weighbridge spot)', status: 'review', size: '25 × 96 ft · 20 ft eaves · clear span', area: '2,400 sq ft ≈ 10.7 marla',
  notes: 'A plain store on the old weighbridge bay (the weighbridge moved to the end of the main road in v20), matching finished goods: white cladding, red trim. Length: since v21 it runs the full depth of the old trolley area, y 412–508. Doors: roller shutters at both ends, north onto the mill front and south onto the paved corner by the drying loop. Today: bagged stock, drums, tarps and spare trolley tyres (≈280 t of bags if filled). Later: deliberately a simple shell on a strong floor, so it can become a workshop + spare-parts store, a garage for the mills’ tractors and trolleys, extra paddy or rice storage, a sales / dealer godown, or shops facing the road; the east wall faces the main road and can take a shutter. Neighbours (v24): the staff flats’ gallery walkway runs along its west side. Not in the three variations (each uses this strip).',
  finance: { rows: [['Build cost', 'Rs 0.55–0.7 cr (≈ Rs 2,200–3,000/sq ft: PEB frame + cladding, brick plinth, floor slab, 2 roller shutters, lights)'], ['Holds', '≈ 280 t of bagged paddy or rice, or ≈ 8 tractor-trolleys under cover'], ['Paving the old bay', 'Rs 3–5 lakh (most of it is already concrete)']], note: 'Planning estimate at Nov 2026 prices. Storage pays back in avoided rent and spoilage rather than income, so no ROI is shown.' },
  round: 24,
};
const STORE_B = {
  name: 'Option: store B (between the pump and the staff flats)', status: 'review', size: '18 × 94 ft · 16 ft eaves · clear span', area: '≈1,690 sq ft ≈ 7.5 marla',
  notes: 'v24: a second plain store on part of the old trolley-holding area, against the petrol pump’s east wall. Buffer: it stands between the pump and the staff flats, so nobody lives next to the pump wall. Doors: roller shutters at both ends, north onto the mill front and south onto the drying loop (the trolley strip’s entry is right beside it). Uses: bagged paddy or rice overflow, tarps and empty jute bags, spare trolley tyres and tools (it takes over from the old holding area’s store room and stock bay), or a workshop later. Lower than store A (16 ft eaves) so the flats’ upper-floor west windows look over it.',
  finance: { rows: [['Build cost', 'Rs 0.37–0.5 cr (≈ Rs 2,200–3,000/sq ft)'], ['Holds', '≈ 170 t of bagged paddy or rice']], note: 'Planning estimate at Nov 2026 prices; no ROI shown (storage).' },
  round: 24,
};
function storeShed(parent, r, info, opts = {}) {
  const st = new THREE.Group(); st.name = opts.name || 'store'; parent.add(st);
  const eave = opts.eave || 20, cx = (r.x1 + r.x2) / 2, w = r.x2 - r.x1;
  gableShed(st, r, { eave, rise: opts.rise || 3, wall: M.cladWhite, roof: M.roofWhite, trim: M.trimRed, cut: true, frames: 24 });
  shutter(st, cx, r.y2, 'N', Math.min(12, w - 6), Math.min(14, eave - 4), true, true); shutter(st, cx, r.y1, 'S', Math.min(12, w - 6), Math.min(14, eave - 4), true, true);
  const stack = (x1, y1, x2, y2, h) => { box(st, x1, y1, x2, y2, 0.5, M.pallet, 0.3); box(st, x1 + .2, y1 + .2, x2 - .2, y2 - .2, h, M.bags, 0.8); };
  const sx1 = cx + 1.5, sx2 = r.x2 - 1.5, hmax = eave - 8;
  for (let y = r.y1 + 8, i = 0; y + 11 < r.y2 - 6; y += 16, i++) stack(sx1, y, sx2, y + 11, Math.min(hmax, [9, 10.5, 7.5, 9, 10.5, 8][i % 6]));
  [[r.x1 + 3, r.y1 + 8], [r.x1 + 5.5, r.y1 + 8], [r.x1 + 3, r.y1 + 10.5], [r.x1 + 5.5, r.y1 + 10.5]].forEach(([x, y]) => cyl(st, x, y, 1, 3, M.steelBlue, 0.3, 12));
  [r.y1 + 14, r.y1 + 17].forEach(y => cyl(st, r.x1 + 4, y, 1.4, 2.8, M.tyre, 0.3, 14));
  box(st, r.x1 + 2, r.y2 - 14, r.x1 + 7, r.y2 - 6, 1.2, M.tarp, 0.3);
  tag(st, r, info);
  label(st, info.name, cx, (r.y1 + r.y2) / 2, eave + 6, 'review', 1);
  mergeByMaterial(st);
  return st;
}

function cutMesh(m) { m.userData.cut = true; return m; }

// ---------- v21 staff-flats material ----------
let _sfm = null;
function SFM() { if (!_sfm) _sfm = { rug: new THREE.MeshStandardMaterial({ color: 0x2f6b45, roughness: 0.95 }) }; return _sfm; }

// ---------- v15 pump helpers: signs, materials, arrows ----------
let _pt = null;
function pumpTex() {
  if (_pt) return _pt;
  const tex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); draw(x, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
  const band = (text, bg, fg, size, w = 1024, h = 96) => tex(w, h, (x) => { x.fillStyle = bg; x.fillRect(0, 0, w, h); x.fillStyle = fg; x.font = `bold ${size}px sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, w / 2, h * 0.55); });
  const std = (o) => new THREE.MeshStandardMaterial({ roughness: 0.6, ...o });
  _pt = {
    led: std({ color: 0xffffff, emissive: 0xfff8e8, emissiveIntensity: 0.9 }),
    screen: std({ color: 0x0b2a1c, emissive: 0x2bd47a, emissiveIntensity: 0.6 }),
    dome: std({ color: 0x2e8b57, metalness: 0.3, roughness: 0.4 }),
    fascia: std({ map: band('FUEL STATION  ·  24/7  ·  PETROL  ·  HOBC  ·  DIESEL', '#0f7a4a', '#ffffff', 52, 2048, 96) }),
    mart: std({ map: band('MART  ·  TUCK SHOP', '#f2c230', '#0f3d27', 64), emissive: 0x332200 }),
    tyre: std({ map: band('SERVICE  ·  LUBE  ·  TYRE', '#1d2329', '#f2c230', 56) }),
    masjid: std({ map: band('MASJID', '#1f6b45', '#ffffff', 64), emissive: 0x0a2a18 }),
    pylon: std({ emissive: 0x222222, map: tex(256, 512, (x, w, h) => {
      x.fillStyle = '#0f7a4a'; x.fillRect(0, 0, w, h); x.fillStyle = '#f2c230'; x.fillRect(0, 0, w, 90);
      x.fillStyle = '#0f3d27'; x.font = 'bold 54px sans-serif'; x.textAlign = 'center'; x.fillText('FUEL', w / 2, 64);
      [['PETROL', 'Rs —'], ['HOBC', 'Rs —'], ['DIESEL', 'Rs —'], ['HI-FLOW', 'Rs —']].forEach(([a, b], i) => { const y = 140 + i * 90; x.fillStyle = '#082a1a'; x.fillRect(16, y - 40, w - 32, 72); x.fillStyle = '#ffffff'; x.font = 'bold 26px sans-serif'; x.textAlign = 'left'; x.fillText(a, 28, y + 6); x.fillStyle = '#ff4433'; x.textAlign = 'right'; x.fillText(b, w - 28, y + 6); });
      x.fillStyle = '#ffffff'; x.font = 'bold 22px sans-serif'; x.textAlign = 'center'; x.fillText('MART · LUBE · MASJID', w / 2, 500);
    }) }),
  };
  return _pt;
}
function pumpSign(parent, mat, w, h, x, y, z, rotY = Math.PI) { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); m.position.copy(P(x, y, z)); m.rotation.y = rotY; m.userData.keep = true; parent.add(m); return m; }
const _arrowGeo = (() => { const s = new THREE.Shape([[-1.2, -4], [1.2, -4], [1.2, 0], [3, 0], [0, 4.5], [-3, 0], [-1.2, 0]].map(([a, b]) => new THREE.Vector2(a, b))); const g = new THREE.ShapeGeometry(s); g.rotateX(-Math.PI / 2); return g; })();
function pumpArrow(parent, x, y, dir) { const a = new THREE.Mesh(_arrowGeo, M.whitePaint); a.position.copy(P(x, y, 0.36)); a.rotation.y = dir; parent.add(a); }
