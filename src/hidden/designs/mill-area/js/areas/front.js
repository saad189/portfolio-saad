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

// ---------- v12: staff flats in the strip between the drying loop wall and the pump (x 0–111 × y 410–440) ----------
// G + 2, open gallery on the north, stair core at the east end opening onto the mill front. Shown with Options (the old mill
// stands here today). v21: ground = mosque room, shared bathrooms + wuzu, kitchen + eating area, 4 bachelor rooms;
// 1st floor = 7 staff rooms + shared bathrooms; 2nd floor = 4 family flats (own bath + kitchen).
export const STAFF_FLATS = { plot: { x1: 0, y1: 410, x2: 111, y2: 440 }, rooms: { x1: 1.5, y1: 412, x2: 100.5, y2: 432 }, core: { x1: 100.5, y1: 412, x2: 110, y2: 437.5 } };
function staffFlats(g) {
  const sf = new THREE.Group(); sf.name = 'staffFlats'; sf.userData.option = true; g.add(sf);
  const F = STAFF_FLATS, R = F.rooms, C = F.core, FH = 10.5, FL = 3, up = (o) => { o.userData.upper = true; return o; }, cut = (o) => { o.userData.cut = true; return o; };
  slab(sf, [[0.6, 410.6], [111, 410.6], [111, 439.4], [0.6, 439.4]], 0.3, M.slab);
  const up2 = (o) => { o.userData.upper = true; o.userData.upper2 = true; return o; };
  [floorsBlock(sf, R, FL, FH, M.beige, { parapet: 3, colSpacing: 12.4, sides: { N: M.plaster }, bands: M.plaster }),
   floorsBlock(sf, C, FL, FH, M.plaster, { parapet: 3, colSpacing: 9 })].forEach(fb => fb.children.forEach(m => { if (m.userData.upper && m.position.y > 1.9 * FH) m.userData.upper2 = true; }));
  box(sf, C.x1, C.y1 + 4, C.x2, C.y1 + 16, 8, M.plaster, FL * FH).userData.cut = true;                      // stair head room on the roof
  // open gallery (north): floor slabs, columns, railings, roof
  for (let f = 0; f < FL; f++) {
    const U = f === 2 ? up2 : f ? up : (o) => o;
    const z = f * FH, sl = box(sf, R.x1, R.y2, R.x2, 437.5, 0.6, M.slab, f ? z : 0.3); U(sl);
    for (let x = R.x1 + 0.4; x <= R.x2; x += 12.4) { const c = box(sf, x - .4, 436.7, x + .4, 437.5, FH, M.plaster, z); U(c); }
    if (f) { const r = panel(sf, [R.x1, 437.3], [R.x2, 437.3], z + 0.6, 3.4, M.railBlue); if (r) U(r); }
    // unit doors + small gallery windows; south windows come from the facade texture
    for (let k = 0; k < 8; k++) { const x = R.x1 + 12.375 * k + 2; const d = cut(box(sf, x, R.y2 - .1, x + 3, R.y2 + .2, 7, M.timber, z + 0.6)); U(d); const w = cut(box(sf, x + 5.5, R.y2 - .1, x + 9, R.y2 + .2, 3, M.glass, z + 4)); U(w); }
  }
  cut(box(sf, R.x1 - .3, R.y2, R.x2 + .3, 437.8, 0.8, M.slab, FL * FH - 0.8));
  box(sf, C.x2 - .1, 418, C.x2 + .2, 426, 7.5, M.timber, 0.3).userData.cut = true;                            // entrance door (east)
  box(sf, C.x2, 416.5, C.x2 + 3, 427.5, 0.4, M.steelDark, 8.5);                                              // canopy
  for (let f = 0; f < FL; f++) { const z = f * FH, g2 = new THREE.Group(); if (f) g2.userData.upper = true; if (f === 2) g2.userData.upper2 = true; sf.add(g2);
    stairFlight(g2, [103.2, 414.5, z + 0.3], [103.2, 427, z + FH / 2], 3.6, M.steelDark); stairFlight(g2, [107.4, 427, z + FH / 2], [107.4, 414.5, z + FH], 3.6, M.steelDark); }
  // ---- interiors (cut-away: top floor → middle floor → ground floor) ----
  const BW = (R.x2 - R.x1) / 8, bx = (k) => R.x1 + BW * k, z0 = 0.6, z1 = FH + 0.8, zt = (FL - 1) * FH + 0.8, T = pumpTex();
  const g0 = new THREE.Group(); sf.add(g0);
  const g1 = new THREE.Group(); g1.userData.upper = true; sf.add(g1);
  const top = new THREE.Group(); top.userData.upper = true; top.userData.upper2 = true; sf.add(top);
  const cl = (text, x, y, z, flag) => { const l = label(sf, text, x, y, z, 'cut', 1); l.userData.cutOnly = true; l.userData[flag] = true; return l; };
  // shared bathroom block in one bay: WCs along the south wall, showers in the middle, basins (+ wuzu bench on the ground floor) by the door
  const bathBlock = (grp, x0, z, nWC, wuzu) => {
    const w = BW / nWC;
    partition(grp, [x0 + 0.2, 419], [x0 + BW - 0.2, 419], z, 7.5);
    for (let i = 1; i < nWC; i++) partition(grp, [x0 + i * w, R.y1 + .8], [x0 + i * w, 419], z, 7.5);
    for (let i = 0; i < nWC; i++) { const cx = x0 + (i + 0.5) * w; box(grp, cx - .7, R.y1 + 1.3, cx + .7, R.y1 + 3.3, 1.3, M.whitePaint, z); box(grp, cx - .6, R.y1 + 0.9, cx + .6, R.y1 + 1.3, 2.4, M.whitePaint, z); }
    partition(grp, [x0 + BW / 2, 419], [x0 + BW / 2, 424.6], z, 7.5);
    [x0 + BW / 4, x0 + 3 * BW / 4].forEach(cx => { box(grp, cx - 1.6, 419.6, cx + 1.6, 423.8, 0.15, M.tile, z, false); cyl(grp, cx, 420, 0.12, 6.6, M.steel, z, 6); box(grp, cx - .5, 419.8, cx + .5, 420.5, 0.2, M.steel, z + 6.6); });
    counter(grp, x0 + BW - 1.8, 425.6, x0 + BW - 0.4, 431, z, 2.8, M.slab);
    [427, 429.6].forEach(y => box(grp, x0 + BW - 1.6, y - .5, x0 + BW - 0.6, y + .5, 0.25, M.whitePaint, z + 2.8));
    if (wuzu) { box(grp, x0 + 0.6, 425.8, x0 + 6.8, 427, 1.1, M.stoneDark, z); box(grp, x0 + 0.6, 427.4, x0 + 6.8, 427.8, 0.3, M.steel, z + 2.8); for (let x = x0 + 1.2; x < x0 + 6.6; x += 1.3) cyl(grp, x, 427.6, 0.08, 0.6, M.steel, z + 2.5, 6); }
  };
  // ground floor: mosque room (bays 0–1), shared bathrooms + wuzu (bay 2), kitchen + eating area (bay 3), 4 bachelor rooms (bays 4–7)
  [2, 3, 4, 5, 6, 7].forEach(k => partition(g0, [bx(k), R.y1 + .8], [bx(k), R.y2 - .2], z0));
  box(g0, R.x1 + 0.8, 419.4, R.x1 + 1.5, 424.6, 8.2, T.dome, z0);                                              // mihrab on the qibla (west) wall
  box(g0, R.x1 + 1.5, 425.6, R.x1 + 4.4, 428.4, 3, M.wood, z0); box(g0, R.x1 + 1.5, 425.6, R.x1 + 2.6, 428.4, 1.4, M.wood, z0 + 3);   // minbar
  for (let i = 0; i < 6; i++) box(g0, R.x1 + 3.4 + i * 3.5, R.y1 + 1.4, R.x1 + 6.2 + i * 3.5, R.y2 - 1.6, 0.08, SFM().rug, z0, false);   // prayer-rug rows, facing west
  box(g0, bx(2) - 2.4, R.y2 - 1.8, bx(2) - 0.5, R.y2 - 0.5, 4.5, M.wood, z0);                                  // Quran shelf
  person(g0, R.x1 + 9, 420, z0, M.kurta3);
  bathBlock(g0, bx(2), z0, 3, true);
  const k3 = bx(3);                                                                                               // kitchen + eating area
  counter(g0, k3 + 0.6, R.y1 + 1, k3 + BW - 0.6, R.y1 + 3.3, z0, 3, M.slab);
  box(g0, k3 + 1.4, R.y1 + 1.3, k3 + 5, R.y1 + 3, 0.4, M.darkMetal, z0 + 3); [k3 + 2.3, k3 + 4.1].forEach(x => cyl(g0, x, R.y1 + 2.15, 0.75, 1.2, M.stainless, z0 + 3.4, 14));   // stove + degchis
  box(g0, k3 + 1.1, R.y1 + 0.9, k3 + 5.3, R.y1 + 3.2, 1.2, M.stainless, z0 + 6.8);                               // exhaust hood
  box(g0, k3 + 6.8, R.y1 + 1.3, k3 + 9.2, R.y1 + 3, 0.5, M.steel, z0 + 2.6);                                      // sink
  [R.y1 + 5, R.y1 + 6.6].forEach(y => cyl(g0, k3 + BW - 1.4, y, 0.6, 3.2, M.trimRed, z0, 10));                  // gas cylinders
  box(g0, k3 + 0.8, R.y1 + 4.6, k3 + 3.2, R.y1 + 7, 6, M.whitePaint, z0);                                         // fridge
  box(g0, k3 + 2.5, 423.5, k3 + 9.8, 426.3, 0.2, M.wood, z0 + 2.4); box(g0, k3 + 2.8, 423.8, k3 + 9.5, 426, 2.4, M.darkMetal, z0);   // eating table
  [422.6, 427.2].forEach(y => box(g0, k3 + 2.5, y - .5, k3 + 9.8, y + .5, 1.5, M.wood, z0));                    // benches
  for (let k = 4; k < 8; k++) {                                                                                   // bachelor rooms: 4 beds + lockers
    const x0 = bx(k);
    [[R.y1 + 1, R.y1 + 4], [R.y1 + 7.5, R.y1 + 10.5]].forEach(([y1, y2]) => { bed(g0, x0 + 0.8, y1, x0 + 5.9, y2, z0); bed(g0, x0 + 6.5, y1, x0 + 11.6, y2, z0); });
    box(g0, x0 + 7, R.y2 - 2.6, x0 + 11.6, R.y2 - 1, 5.5, M.steelBlue, z0);
  }
  cl('Mosque room · ≈40–50', bx(1), 422, z0 + 4, 'groundOnly'); cl('Bathrooms + wuzu', bx(2) + BW / 2, 422, z0 + 4, 'groundOnly');
  cl('Kitchen + eating', bx(3) + BW / 2, 422, z0 + 4, 'groundOnly'); cl('Bachelor rooms · 16 beds', bx(6), 422, z0 + 4, 'groundOnly');
  // 1st floor: 7 staff rooms (bays 0–6) + shared bathrooms next to the stair (bay 7)
  for (let k = 1; k < 8; k++) partition(g1, [bx(k), R.y1 + .8], [bx(k), R.y2 - .2], z1);
  for (let k = 0; k < 7; k++) {
    const x0 = bx(k);
    bed(g1, x0 + 0.8, R.y1 + 1, x0 + 5.9, R.y1 + 4, z1); bed(g1, x0 + 6.5, R.y1 + 1, x0 + 11.6, R.y1 + 4, z1);
    box(g1, x0 + 1, R.y1 + 9, x0 + 4.4, R.y1 + 11.4, 2.5, M.wood, z1); box(g1, x0 + 7, R.y2 - 2.6, x0 + 11.6, R.y2 - 1, 5.5, M.steelBlue, z1);
  }
  bathBlock(g1, bx(7), z1, 2, false);
  cl('Staff rooms · 7 × 2 beds', bx(3.5), 422, z1 + 4, 'firstOnly'); cl('Bathrooms', bx(7) + BW / 2, 422, z1 + 4, 'firstOnly');
  // 2nd floor: 4 family flats — two rooms, kitchen, own bath
  for (let k = 0; k < 4; k++) {
    const x0 = R.x1 + 24.75 * k, xm = x0 + 12.375; if (k) partition(top, [x0, R.y1 + .8], [x0, R.y2 - .2], zt);
    partition(top, [xm, R.y1 + .8], [xm, R.y2 - 6], zt); partition(top, [x0 + 0.3, R.y2 - 7], [x0 + 6, R.y2 - 7], zt); partition(top, [x0 + 6, R.y2 - 7], [x0 + 6, R.y2 - .3], zt);
    bed(top, x0 + 1.2, R.y1 + 1.2, x0 + 6.4, R.y1 + 7.6, zt); bed(top, xm + 1.2, R.y1 + 1.2, xm + 6.4, R.y1 + 4.4, zt); bed(top, xm + 6.8, R.y1 + 1.2, xm + 11.6, R.y1 + 4.4, zt);
    counter(top, xm + 1, R.y2 - 2.4, xm + 9, R.y2 - 0.6, zt, 3, M.slab);                                         // kitchen counter
    box(top, x0 + 7, R.y1 + 11, x0 + 11, R.y1 + 13, 2.4, M.wood, zt);                                            // table
    box(top, x0 + 0.9, R.y2 - 6.4, x0 + 2.3, R.y2 - 4.6, 1.3, M.whitePaint, zt); box(top, x0 + 3, R.y2 - 6.5, x0 + 5.6, R.y2 - 4, 0.15, M.tile, zt, false);   // bath: WC + shower tray
  }
  cl('Family flats · 4 (own bath + kitchen)', 50, 422, zt + 4, 'upper2');
  // mosque sign over its doors on the gallery
  const ms = pumpSign(sf, T.masjid, 12, 1.6, bx(1), R.y2 + 0.45, 8.3, Math.PI); ms.userData.cut = true;
  // roof: tanks, solar, people outside
  const roofG = new THREE.Group(); roofG.userData.cut = true; sf.add(roofG);                                  // v21: hidden in cut-away so the floors show
  [10, 35, 60, 85].forEach(x => waterTank(roofG, x, 416, FL * FH));
  solarArray(roofG, 50, 424, FL * FH + 2, 88, 10, 0.2, 0);
  person(sf, 112.5, 422, 0.3, M.kurta); person(sf, 40, 435, 0.6, M.kurta2);
  tag(sf, F.plot, {
    name: 'Staff flats (proposed)', status: 'new', size: 'Plot 111 × 30 ft · building ≈108.5 × 25.5 ft, G + 2',
    area: 'Plot 3,330 sq ft ≈ 14.8 marla · ≈8,300 sq ft built',
    notes: 'v12, in the strip between the drying loop’s wall and the petrol-pump option; v21 layout. Ground floor: a mosque room (2 bays, ≈25 × 20 ft, ≈40–50 people; mihrab on the west/qibla wall, minbar, prayer-rug rows, sign over the doors), a shared bathroom block next to it (3 WCs, 2 showers, basins and a wuzu bench with taps), a kitchen with an eating area (stove + hood, sink, fridge, gas cylinders, table for ≈10) and 4 bachelor rooms (4 beds each = 16; bunks would make 24). 1st floor: 7 staff rooms (2 beds each = 14, for supervisors, drivers and operators) sharing one bathroom block by the stair (2 WCs, 2 showers, basins). 2nd floor: 4 family flats (≈25 × 20 ft: two rooms, kitchen and their own bath). Open gallery along the north side; one stair at the east end opening onto the mill front, so residents never pass through the pump. Roof tanks and solar. Points to check: (1) the south side faces the drying loop and the yard, so expect harvest dust and tractor noise — keep the south windows small, high and screened; (2) v15 moved the pump’s underground tanks to the north-west corner by the road (≈65 ft away) and put the pump’s buildings between the forecourt and the flats; petrol-pump licensing (Explosives Department NOC) sets minimum distances to homes, so confirm the clearance; (3) foundations can be sized for a 3rd floor (4 more family flats). Cut-away: once for the 2nd floor (family flats), twice for the 1st floor (staff rooms + bathrooms), three times for the ground floor (mosque, bathrooms, kitchen, bachelor rooms).',
    finance: {
      rows: [
        ['Units', 'Ground: mosque room, shared bathrooms + wuzu, kitchen + eating area, 4 bachelor rooms (16 beds) · 1st: 7 staff rooms (14 beds) + shared bathrooms · 2nd: 4 family flats'],
        ['Built area', '≈8,300 sq ft (3 floors × ≈2,760 incl. gallery + stair)'],
        ['Build cost', 'Rs 3.5–4.5 cr (≈ Rs 4,000–5,000/sq ft, basic finish, plus tanks, solar, sewer)'],
        ['— per family flat (2nd floor)', '≈ Rs 30–38 lakh'],
        ['— per bed (rooms on ground + 1st)', '≈ Rs 6–8 lakh, mosque room, kitchen and bathrooms included'],
        ['With a 3rd floor later', '+4 family flats ≈ Rs 1.2–1.5 cr'],
      ],
      note: 'Planning estimate at Nov 2026 rates; land already owned. The shell and cost are unchanged from v12: shared bathrooms are cheaper than the 8 attached baths they replace, and the mosque and kitchen fit-out takes up the difference. Staff housing pays back in retention and in house-rent allowance saved rather than rent, so no ROI is shown.',
    },
    round: 21,
  });
  label(sf, 'Staff flats · G+2', 50, 424, 38, '', 1);
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

  // ---------- A. petrol pump (west end, ≈2.5 kanal, ≈115 ft of frontage) — v15: upgraded ----------
  // Traffic flows east → west (entry by the shop row, exit at the west corner). Buildings sit on the south side as a buffer
  // to the staff flats; underground tanks moved to the north-west corner by the road, ≈65 ft from the flats.
  const pp = new THREE.Group(); pp.name = 'pump'; o.add(pp);
  const PX = 111, PY = 440;
  slab(pp, [[0, PY], [PX, PY], [PX, ytop(PX)], [0, 528]], 0.3, M.concrete);
  slab(pp, [at(0, 0), at(115, 0), at(115, 18), at(0, 18)], 0.25, M.road, -0.05);          // forecourt apron to the road
  segBox(pp, [0, PY], [PX, PY], 1.1, 8, M.brick); segBox(pp, [PX, PY], [PX, ytop(PX)], 1.1, 8, M.brick);   // walls to the staff flats + mill
  const T = pumpTex();
  // --- canopy: 4 car islands (8 multi-product dispensers) + 1 high-flow diesel island for trucks and the mills' tractors ---
  const C = { x1: 20, y1: 473, x2: 108, y2: 505 };
  [24, 50, 76, 104].forEach(x => [475.5, 502.5].forEach(y => box(pp, x - .7, y - .7, x + .7, y + .7, 17.3, M.whitePaint, 0.3)));
  boxR(pp, C, 2.6, M.canopyWhite, 17.3); box(pp, C.x1 + 2, C.y1 + 2, C.x2 - 2, C.y2 - 2, 0.12, T.led, 17.2);
  [[C.x1 - .2, C.y1 - .2, C.x2 + .2, C.y1 + .4], [C.x1 - .2, C.y2 - .4, C.x2 + .2, C.y2 + .2], [C.x1 - .2, C.y1, C.x1 + .4, C.y2], [C.x2 - .4, C.y1, C.x2 + .2, C.y2]].forEach(([a, b, c, d]) => box(pp, a, b, c, d, 2.4, M.canopyBand, 17.6));
  pumpSign(pp, T.fascia, 70, 2, 64, C.y2 + 0.25, 18.8, Math.PI); pumpSign(pp, T.fascia, 70, 2, 64, C.y1 - 0.25, 18.8, 0);
  const island = (x1, x2, y, hiflow) => {
    box(pp, x1, y - 1.7, x2, y + 1.7, 0.6, M.slab, 0.3); box(pp, x1 - .3, y - 1.7, x1 + 1, y + 1.7, 0.7, M.yellow, 0.3); box(pp, x2 - 1, y - 1.7, x2 + .3, y + 1.7, 0.7, M.yellow, 0.3);   // kerb + bollard ends
    [x1 + 4, x2 - 4].forEach(x => { box(pp, x - 1.3, y - .8, x + 1.3, y + .8, hiflow ? 6.5 : 5.8, M.canopyWhite, 0.9); box(pp, x - 1.35, y - .85, x + 1.35, y + .85, 1, hiflow ? M.yellow : M.canopyBand, hiflow ? 6.4 : 5.7); box(pp, x - .8, y - .9, x + .8, y - .85, 0.9, T.screen, 3.8); box(pp, x - .8, y + .85, x + .8, y + .9, 0.9, T.screen, 3.8); });
  };
  [[28, 44, 481], [52, 68, 481], [28, 44, 497], [52, 68, 497]].forEach(([a, b, y]) => island(a, b, y));
  island(80, 100, 489, true);
  car(pp, 36, 486, Math.PI / 2, 0xffffff); car(pp, 60, 492, Math.PI / 2, 0x2b2f36); car(pp, 36, 502, Math.PI / 2, 0xb0b5ba);
  truck(pp, 90, 483, Math.PI / 2, true); tractor(pp, 90, 495, Math.PI / 2, false);
  person(pp, 42, 486.5, 0.3, M.kurta2); person(pp, 88, 486.5, 0.3, M.kurta3);
  // --- back row (south): mart + café + ATM, prayer room + washrooms, tyre/puncture + oil-change bays, generator, fire point ---
  block(pp, { x1: 2, y1: 442, x2: 44, y2: 462 }, 1, 13, M.office, { parapet: 2, roof: M.slab });
  box(pp, 4, 461.8, 38, 462.3, 10, M.glass, 0.5); box(pp, 1.5, 462, 44.5, 467, 0.5, M.canopyBand, 12.2);          // glass front + canopy band
  pumpSign(pp, T.mart, 26, 2.8, 22, 462.4, 14.4, Math.PI); box(pp, 40, 462, 43, 463.4, 7, M.darkMetal, 0.3);       // sign, ATM
  [[8, 465], [16, 465]].forEach(([x, y]) => { cyl(pp, x, y, 1.3, 0.12, M.wood, 2.6, 12); cyl(pp, x, y, 0.1, 2.6, M.steel, 0.3, 6); });   // two café tables
  acUnit(pp, 10, 446, 13); acUnit(pp, 18, 446, 13); waterTank(pp, 36, 447, 13, 0xe9e9e4); solarArray(pp, 24, 452, 14.6, 22, 12, 0.2, 0);
  block(pp, { x1: 46, y1: 442, x2: 66, y2: 459 }, 1, 11, M.plaster, { parapet: 1.5 });                                 // prayer room (west) + washrooms
  const dm = new THREE.Mesh(new THREE.SphereGeometry(3.4, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), T.dome); dm.position.copy(P(51.5, 450.5, 11.6)); dm.castShadow = true; pp.add(dm);
  box(pp, 46, 459, 57, 461.5, 0.3, M.tile, 0.3, false); box(pp, 47, 460.6, 56, 461.3, 2.2, M.stoneDark, 0.3);     // wuzu counter
  box(pp, 60, 458.8, 62.5, 459.2, 7, M.timber, 0.3);
  block(pp, { x1: 68, y1: 442, x2: 92, y2: 462 }, 1, 14, M.ops, { parapet: 1.5 });                                     // tyre + oil bays
  shutter(pp, 74, 462, 'N', 9, 11, M.yellow); box(pp, 81.5, 461.9, 90.5, 462.3, 11, M.darkMetal, 0.3);           // one bay shut, one open
  car(pp, 86, 453.5, 0, 0x8a1c1c); box(pp, 83, 446, 89, 461, 0.35, M.yellow, 0.3);                                // car on the lift
  pumpSign(pp, T.tyre, 22, 2.2, 80, 462.4, 12.4, Math.PI);
  [[95, 466], [98, 466]].forEach(([x, y], i) => box(pp, x - .5, y - .5, x + .5, y + .5, 4, i ? M.steelBlue : M.trimRed, 0.3));   // air + water
  box(pp, 94, 442, 105, 450, 6, M.steelDark, 0.3); [96, 99, 102].forEach(x => cyl(pp, x, 446, 0.18, 2, M.steel, 6.3, 6));   // generator
  box(pp, 106, 443, 109, 446, 4, M.trimRed, 0.3); [107, 108.4].forEach(x => cyl(pp, x, 448, 0.5, 1, M.trimRed, 0.3, 10));   // fire point: extinguishers + sand buckets
  // --- underground tanks (north-west, by the road): 4 chamber covers, spill pad, tanker fill point, vent pipes on the west wall ---
  box(pp, 3, 509, 25, 521, 0.08, M.slab, 0.3, false);
  [[7, 513], [12.5, 513], [18, 513], [23, 513]].forEach(([x, y]) => cyl(pp, x, y, 1.6, 0.15, M.steelDark, 0.36, 16));
  box(pp, 6, 517, 24, 519.5, 2.6, M.steelDark, 0.3);                                                                // fill-point cabinet
  [509, 512, 515, 518].forEach(y => { cyl(pp, 1.6, y, 0.2, 14, M.steel, 0, 6); cyl(pp, 1.6, y, 0.35, 0.6, M.steelDark, 14, 8); });
  for (let x = 3; x < 25; x += 2) box(pp, x, 508.6, x + 1, 509, 0.05, M.yellow, 0.36, false);                      // hatched kerb line
  // --- price pylon (exit corner), lighting + CCTV, frontage hedges, arrows ---
  const [px, py] = at(6, 7); box(pp, px - .6, py - .6, px + .6, py + .6, 4, M.stoneDark, 0);
  const pl = new THREE.Mesh(new THREE.BoxGeometry(6.5, 20, 1.1), [M.canopyBand, M.canopyBand, M.canopyBand, M.canopyBand, T.pylon, T.pylon]); pl.position.copy(P(px, py, 14)); pl.rotation.y = Math.atan2(N[0], -N[1]) + Math.PI; pl.castShadow = true; pp.add(pl);
  [[30, 519], [92, 536]].forEach(([x, y]) => { cyl(pp, x, y, 0.3, 24, M.steel, 0, 8); box(pp, x - 2, y - .5, x + 2, y + .5, 0.8, M.steelDark, 24); });
  box(pp, 106, 538, 107, 539, 16, M.steel, 0); box(pp, 105.5, 537.3, 107.5, 538, 0.8, M.darkMetal, 15.2);          // CCTV pole
  for (let t = 34; t < 86; t += 8) { const [x, y] = at(t, -3); box(pp, x - 3, y - 1, x + 3, y + 1, 1.6, M.hedge, 0.3); }
  pumpArrow(pp, ...at(100, 6), Math.PI + 0.27); pumpArrow(pp, ...at(14, 6), 0.27);                      // in at the east, out at the west pumpArrow(pp, 88, 470, Math.PI / 2); pumpArrow(pp, 40, 470, Math.PI / 2);
  tag(pp, { x1: 0, y1: PY, x2: PX, y2: 556 }, {
    name: 'Option: petrol pump', status: 'review', size: '≈111 ft wide · ≈115 ft of frontage', area: '≈11,400 sq ft ≈ 2.5 kanal',
    notes: 'Hybrid option B: a compact pump at the west end with its own entry (east) and exit (west corner) and walls to the mill and the staff flats. v15 upgrade: canopy over 4 car islands (8 multi-product dispensers) plus a separate high-flow diesel island for trucks and the mills’ own tractors; mart + café + ATM with a solar roof; a small prayer room with wuzu counter and washrooms; tyre/puncture + oil-change bays; air + water point; generator; fire point (extinguishers, sand buckets); LED canopy, lit price pylon, CCTV. The underground tanks moved to the north-west corner by the road (tanker fill point, vent pipes on the west wall), ≈65 ft from the staff flats; the pump’s buildings now stand between the forecourt and the flats. Branding left neutral (OMC not chosen).',
    finance: {
      rows: [
        ['Build cost', 'Rs 3.9–5.4 cr (≈ 2.9–4 cr if the OMC funds tanks, dispensers + branding)'],
        ['— forecourt, canopy, tanks, 8 MPDs + high-flow diesel', 'Rs 2.4–3.3 cr'],
        ['— mart/café, prayer + washrooms, tyre/oil bays (≈1,700 sq ft)', 'Rs 0.9–1.1 cr'],
        ['— licences/NOCs, generator, working capital', 'Rs 0.6–1.0 cr'],
        ['Fuel margin', 'Rs 9.98/L dealer margin (since Aug 2026)'],
        ['Net per year (4,000 L/day incl. the mills’ own diesel)', '≈ Rs 0.8 cr (fuel ≈ 0.6 + mart/tyre/oil ≈ 0.2)'],
        ['Range', '2,500 L/day ≈ 0.35 cr · 6,000 L/day ≈ 1.5 cr'],
        ['ROI on build cost', '≈ 17 %/yr (7–38 %)'],
        ['Payback', '≈ 6 years (2.5–15)'],
      ],
      note: 'The mills’ own trucks and tractors are guaranteed diesel volume, and the high-flow nozzle saves their time. Decide only after a 7-day traffic count and 2–3 OMC offers; below ≈2,500 L/day it barely covers staff. Confirm the Explosives Department NOC distances (tanks to the staff flats, the boiler and the husk store). Land already owned.',
    },
    round: 15,
  });
  label(pp, 'Option: petrol pump', 64, 489, 24, 'review', 1);
  label(pp, 'Mart · café · ATM', 22, 452, 18, '', 2); label(pp, 'Prayer · washrooms', 56, 450, 16, '', 2); label(pp, 'Tyre + oil', 80, 452, 18, '', 2); label(pp, 'Hi-flow diesel', 90, 489, 9, '', 2); label(pp, 'Tanks', 14, 515, 4, '', 2);

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
  for (let x = 120; x < 165; x += 9) box(mf, x - .2, 418, x + .2, 505, 0.05, M.whitePaint, 0.3, false);   // trolley lanes
  [[124, 445], [124, 485], [133, 460], [142, 447], [142, 495], [151, 470]].forEach(([x, y]) => tractor(mf, x, y, 0, true, 0));
  holdingRoof(mf);                                                                                       // v19: solar roof + store over the holding lanes
  frontStore(mf);                                                                                        // v20: store on the old weighbridge bay
  slab(mf, [[PX, 522], [168, 522], [168, ytop(168) - 23.5], [PX, ytop(PX) - 23.5]], 0.3, M.asphalt);
  [[118, 529.5], [127, 529.5], [136, 529.5], [145, 529.5], [154, 529.5]].forEach(([x, y], i) => car(mf, x, y, 0, [0xffffff, 0x1f2a44, 0xb0b5ba, 0x7a1f1f, 0xd8d8d8][i]));
  const off = { x1: 168, y1: 523, x2: 193.5, y2: 548 };
  block(mf, off, 1, 11, M.office, { parapet: 3 });
  box(mf, 193.5, 530, 196, 541, 0.5, M.steelDark, 10);
  waterTank(mf, 172, 527, 11); acUnit(mf, 180, 545, 11); acUnit(mf, 186, 545, 11);
  trees(mf, [[116, 518, 0.45, 0], [140, 518, 0.45, 0], [162, 518, 0.45, 0]], 77);
  tag(mf, { x1: PX, y1: 410, x2: 195, y2: 560 }, { name: 'Option: mill front', status: 'review', notes: 'Trolley holding area so harvest trolleys queue inside instead of on the road, then leave by the north end and drive down the main road to the weighbridge, which v20 moved to its far end (v19: 4 lanes under an open-sided solar roof, with a store room and stock bay in the east lane — click the roof for its card); visitor parking; a single-storey sales counter + visitor reception beside the gate (the head office itself is in the east block, so this stays small). The old mill is demolished in this option.', round: 6 });
  label(mf, 'Option: covered trolley holding · ≈100 kWp', 134, 470, 30, 'review', 1);
  label(mf, 'Sales counter + reception', 180.75, 535.5, 16, 'review', 2);
  label(mf, 'Visitor parking', 136, 532, 8, 'review', 2);
  mergeByMaterial(pp); mergeByMaterial(sh); mergeByMaterial(mf);
}

// ---------- v19: open-sided steel roof over the trolley holding area ----------
// Portal frames every 23.5 ft spanning 52 ft clear (no columns between the lanes); one 5° slope falling south (18 ft low eave,
// ≈26.6 ft at the north) so the whole roof faces the sun: 14 × 11 = 154 modules of 650 W ≈ 100 kWp, flush on the sheets with a
// cleaning walkway. The east lane becomes a lockable store room + fenced stock bay for extra holding.
export const HOLD_ROOF = { x1: 111.6, y1: 411, x2: 165.4, y2: 509, low: 18, slope: 5, cols: [112.5, 164.5], frames: [412.5, 436, 459.5, 483, 506.5], across: 14, rows: 11, wp: 650 };
function holdingRoof(mf) {
  const hr = new THREE.Group(); hr.name = 'holdingRoof'; mf.add(hr);
  const R = HOLD_ROOF, a = R.slope * Math.PI / 180, H = (y) => R.low + (y - R.y1) * Math.tan(a), T = pumpTex();
  const cut = (o) => { o.userData.cut = true; return o; };
  // frames: columns on plinths, rafters, haunches, LED high-bays (stay visible in cut-away)
  R.frames.forEach(y => {
    const top = H(y) - 0.9, base = top - 1.8;
    R.cols.forEach(x => { box(hr, x - .5, y - .4, x + .5, y + .4, base, M.steelDark, 0); box(hr, x - 1, y - 1, x + 1, y + 1, 0.8, M.slab, 0); });
    box(hr, R.cols[0] - .5, y - .35, R.cols[1] + .5, y + .35, 1.8, M.steelDark, base);
    strut(hr, [R.cols[0] + .4, y, base - 3.5], [R.cols[0] + 5, y, base + .2], 0.5, M.steelDark); strut(hr, [R.cols[1] - .4, y, base - 3.5], [R.cols[1] - 5, y, base + .2], 0.5, M.steelDark);
    [125, 138.5, 152].forEach(x => box(hr, x - .9, y - .5, x + .9, y + .5, 0.3, T.led, base - 0.3));
  });
  R.cols.forEach(x => strut(hr, [x, R.frames[0], H(R.frames[0]) - 2.7], [x, R.frames[4], H(R.frames[4]) - 2.7], 0.8, M.steelDark));   // eave beams
  R.cols.forEach(x => [[436, 459.5], [483, 506.5]].forEach(([y1, y2]) => { strut(hr, [x, y1, 1], [x, y2, H(y2) - 3], 0.25, M.steel); strut(hr, [x, y2, 1], [x, y1, H(y1) - 3], 0.25, M.steel); }));   // X-bracing
  // roof: sheets, purlins, gutter + fascia and the panels, in one group tilted 5° (low edge south)
  const L = (R.y2 - R.y1) / Math.cos(a), W = R.x2 - R.x1, cx = (R.x1 + R.x2) / 2, cy = (R.y1 + R.y2) / 2;
  const rf = new THREE.Group(); rf.position.copy(P(cx, cy, H(cy))); rf.rotation.x = a; hr.add(rf);
  const add = (geo, mat, px, py, pz) => { const m = new THREE.Mesh(geo, mat); m.position.set(px, py, pz); m.castShadow = true; m.receiveShadow = true; cut(m); rf.add(m); return m; };
  add(worldBox(W, 0.25, L), M.roof, 0, 0, 0);
  for (let x = -W / 2 + 2; x <= W / 2 - 1.9; x += 4.85) add(worldBox(0.35, 0.7, L - 0.6), M.steelDark, x, -0.48, 0);
  add(worldBox(W + 0.4, 0.9, 0.9), M.steelDark, 0, -0.2, L / 2 + 0.35); add(worldBox(W + 0.4, 1.4, 0.3), M.steelDark, 0, 0.1, -L / 2 - 0.15);
  const PW = 3.72, PL = 7.815, GAP = 0.066, WALK = 2.5, rowW = R.across * PW + (R.across - 1) * GAP;
  const span = R.rows * PL + (R.rows - 1) * GAP + WALK, z0 = L / 2 - (L - span) / 2;
  const pg = new THREE.BoxGeometry(PW - 0.04, 0.12, PL - 0.04), uv = pg.attributes.uv;
  for (let k = 0; k < uv.count; k++) uv.setXY(k, uv.getX(k) * 6, uv.getY(k) * 3.3);
  for (let r = 0; r < R.rows; r++) {
    const zc = z0 - (r + 0.5) * PL - r * GAP - (r >= 6 ? WALK : 0);
    for (let c = 0; c < R.across; c++) add(pg, M.solar, -rowW / 2 + PW / 2 + c * (PW + GAP), 0.32, zc);
    add(new THREE.BoxGeometry(rowW, 0.12, 0.2), M.steel, 0, 0.2, zc + PL * 0.3); add(new THREE.BoxGeometry(rowW, 0.12, 0.2), M.steel, 0, 0.2, zc - PL * 0.3);   // mounting rails
  }
  // downpipes at the low (south) eave into the loop drain
  R.cols.forEach(x => cyl(hr, x + (x < 140 ? 1 : -1), 411.3, 0.3, R.low, M.steelDark, 0, 8));
  // extra holding in the east lane: lockable store room (south end) + fenced stock bay for bagged paddy / rice
  block(hr, { x1: 156.6, y1: 411.6, x2: 164.4, y2: 436 }, 1, 11, M.plaster, { parapet: 0.6, roof: M.slab });
  shutter(hr, 160.5, 436, 'N', 6, 8, false);
  [[158, 415], [158, 421]].forEach(([x, y]) => box(hr, x, y, x + 5, y + 3.5, 3, M.whitePaint, 11.6));   // 2 × 50 kW inverters on the store roof (shaded)
  panel(hr, [156.3, 437], [156.3, 464], 0.3, 7, M.railBlue); panel(hr, [156.3, 472], [156.3, 500], 0.3, 7, M.railBlue);
  [437, 464, 472, 500].forEach(y => box(hr, 156.05, y - .2, 156.55, y + .2, 7.4, M.steelDark, 0.3));
  const stack = (y1, y2, h, tarp) => { box(hr, 157.2, y1, 163.8, y2, 0.5, M.wood, 0.3); if (tarp) box(hr, 157.1, y1 - .1, 163.9, y2 + .1, h + 0.6, M.tarpGreen, 0.6); else box(hr, 157.4, y1 + .2, 163.6, y2 - .2, h, M.jute, 0.8); };
  stack(440, 452, 9, false); stack(455, 466, 10, true); stack(474, 486, 8, false); stack(489, 499, 10, true);
  // covered walkway along the west side, staff-flats door ↔ mill front
  [113.2, 118.8].forEach(x => box(hr, x - .15, 412, x + .15, 509, 0.05, M.yellow, 0.32, false));
  for (let y = 416; y < 507; y += 6) box(hr, 113.4, y, 118.6, y + 0.5, 0.05, M.whitePaint, 0.32, false);
  person(hr, 116, 452, 0.3, M.kurta3);
  const n = R.across * R.rows, kwp = (n * R.wp / 1000).toFixed(1);
  tag(hr, { x1: R.x1, y1: R.y1, x2: R.x2, y2: R.y2 }, {
    name: 'Option: covered trolley holding + solar roof', status: 'review', size: '≈54 × 98 ft roof, open sides, 18 ft (south) to ≈26.6 ft (north)',
    area: `≈5,270 sq ft covered ≈ 23 marla · ${n} × ${R.wp} W ≈ ${kwp} kWp`,
    notes: 'v19, in the original (hybrid) front zone. An open-sided steel roof over the trolley holding lanes, so queued trolleys, their paddy and the drivers stay dry in harvest rain and shaded in the October sun (rain-soaked paddy also weighs and tests wetter at the weighbridge). Portal frames every 23.5 ft span 52 ft clear, so there are no columns between the lanes. The roof is one 5° slope falling south: 18 ft at the low eave, ≈26.6 ft at the north, so loaded trolleys (≈12–13 ft) pass easily and the gutter drains into the loop drain. Because the whole roof faces south it carries solar flush on the sheets: 154 × 650 W modules (Longi Hi-MO X10 class) in 11 rows with a cleaning walkway, ≈100 kWp; the two inverters sit in the shade on the store room. Extra holding: the east lane becomes a lockable store room (≈8 × 24 ft: tarps, empty jute bags, spare trolley tyres, moisture meter, tools) and a fenced stock bay (≈8 × 62 ft) for bagged paddy or rice overflow, ≈50 t. Off-season, when no trolleys queue, the whole covered floor can hold ≈400–500 t of bagged paddy under tarps, or park the mills’ tractors and trolleys. Trade-off: 4 trolley lanes instead of 5 (≈8 tractor-trolleys queue at once). LED high-bays for night unloading; a covered walkway runs along the west side from the staff-flats door to the mill front. The staff flats (≈35 ft) shade the west edge of the roof late on winter afternoons — a small loss, included below.',
    finance: {
      rows: [
        ['Capacity (as modelled)', `≈ ${kwp} kWp · ${n} × ${R.wp} W · 2 × 50 kW inverters`],
        ['Energy per year', '≈ 125–135 MWh (≈ 1,250–1,350 kWh per kWp: 5° tilt, dust, a little shade from the staff flats)'],
        ['Steel roof (frames, purlins, sheets, gutters, footings, LED lights)', 'Rs 0.8–1.2 cr (≈ Rs 1,500–2,300/sq ft)'],
        ['— store room + stock-bay fence', 'Rs 5–8 lakh'],
        ['Solar (flush-mounted, turnkey)', 'Rs 0.6–0.8 cr (≈ Rs 60–80/W; panels Rs 38–48/W)'],
        ['Total', 'Rs 1.45–2.1 cr'],
        ['Net per year (power used in the mill)', '≈ Rs 34–43 lakh (≈ Rs 28–33 saved per unit, minus washing)'],
        ['Payback', 'Solar alone ≈ 1.5–2.5 yrs · with the roof ≈ 3.5–6 yrs'],
        ['Compared with the paddy-store flat roof', 'That option (Rs 1.7–2.4 cr, ≈129 kWp) pays for a roof the store already has; this one also buys ≈5,270 sq ft of new covered space'],
      ],
      note: 'Planning estimates at Nov 2026 prices. The roof rate assumes a light PEB frame designed for the panel load (fabricated + erected steel ≈ Rs 350–420/kg; rebar is ≈ Rs 255–290/kg). Same power-saving basis as the paddy-store solar card: B2 off-peak Rs 22.83 + taxes; under net billing, surplus sent to the grid earns only ≈ Rs 8–11/unit, so the power should be used in the mills. If both solar options are built (≈230 kWp), check that the mills’ daytime load can take it. Only in the original front zone; the three variations remove the trolley holding area.',
    },
    round: 19,
  });
  label(hr, 'Store room', 160.5, 424, 13, '', 2); label(hr, 'Stock bay · bagged paddy', 160.5, 470, 12, '', 2); label(hr, 'Covered walkway', 116, 480, 2, '', 2);
}

// ---------- v20: store on the old weighbridge bay (x 165–195), original front zone only ----------
// A plain clear-span PEB shed (white cladding, red trim like finished goods) so it can change use later.
function frontStore(mf) {
  const st = new THREE.Group(); st.name = 'frontStore'; mf.add(st);
  const r = SITE.frontStore;
  slab(st, [[165, 410], [195, 410], [195, 515], [165, 515]], 0.3, M.concrete);                           // old bay + loop corner, paved
  gableShed(st, r, { eave: 20, rise: 3, wall: M.cladWhite, roof: M.roofWhite, trim: M.trimRed, cut: true, frames: 24 });
  shutter(st, 180.5, r.y2, 'N', 12, 14, true, true);                                                       // onto the exit lane (north)
  shutter(st, 180.5, r.y1, 'S', 12, 14, true, true);                                                       // onto the paved corner by the drying loop (south)
  // inside today: bagged stock on pallets, drums, tarps, spare trolley tyres
  const stack = (x1, y1, x2, y2, h) => { box(st, x1, y1, x2, y2, 0.5, M.pallet, 0.3); box(st, x1 + .2, y1 + .2, x2 - .2, y2 - .2, h, M.bags, 0.8); };
  [[420, 431], [435, 446], [452, 463], [467, 478], [484, 495]].forEach(([y1, y2], i) => stack(182, y1, 191.5, y2, [9, 10.5, 7.5, 9, 10.5][i]));
  [[171, 420], [173.5, 420], [171, 422.5], [173.5, 422.5]].forEach(([x, y]) => cyl(st, x, y, 1, 3, M.steelBlue, 0.3, 12));
  [423, 426].forEach(y => cyl(st, 177, y, 1.4, 2.8, M.tyre, 0.3, 14));
  box(st, 170, 494, 176, 502, 1.2, M.tarp, 0.3);
  pumpArrow(st, 186, 515, -Math.PI / 2); pumpArrow(st, 170, 515, -Math.PI / 2);                          // trolleys leave the holding area east to the main road
  tag(st, r, {
    name: 'Option: store (old weighbridge spot)', status: 'review', size: '25 × 96 ft, 20 ft eaves, clear span', area: '2,400 sq ft ≈ 10.7 marla',
    notes: 'v20: the weighbridge moved to the end of the main road, so its bay is free. In the original layout a plain PEB store stands here, matching finished goods (white cladding, red trim): roller shutters at both ends — north onto the exit lane the trolleys use to reach the main road, south onto the paved corner by the drying loop (the west side backs onto the v19 stock bay, so it stays blank). v21: lengthened to run the full length of the trolley holding area (y 412–508). Today it holds bagged stock, drums, tarps and spare trolley tyres (≈280 t of bags if filled). The trolleys’ exit lane north of it is now ≈14 ft wide (y 508–522), enough for one tractor-trolley at a time. It is deliberately a simple clear-span shell on a strong floor so it can change use later: a workshop + spare-parts store, a garage for the mills’ tractors and trolleys, extra paddy or rice storage, a sales / dealer godown by the gate, or shops facing the road if the front plan changes. The east wall faces the main road and can take a shutter later. Not in the three variations (each uses this strip).',
    finance: {
      rows: [
        ['Build cost', 'Rs 0.55–0.7 cr (≈ Rs 2,200–3,000/sq ft: PEB frame + cladding, brick plinth, floor slab, 2 roller shutters, lights)'],
        ['Holds', '≈ 280 t of bagged paddy or rice, or ≈ 8 tractor-trolleys under cover'],
        ['Paving the old bay', 'Rs 3–5 lakh (most of it is already concrete)'],
      ],
      note: 'Planning estimate at Nov 2026 prices. Storage pays back in avoided rent and spoilage rather than income, so no ROI is shown.',
    },
    round: 21,
  });
  label(st, 'Option: store (old weighbridge spot)', 180.5, 460, 26, 'review', 1);
  mergeByMaterial(st);
}

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
    fascia: std({ map: band('FUEL STATION  ·  24/7  ·  HI-SPEED DIESEL  ·  MART  ·  TYRE', '#0f7a4a', '#ffffff', 52, 2048, 96) }),
    mart: std({ map: band('MART  ·  CAFÉ  ·  ATM', '#f2c230', '#0f3d27', 64), emissive: 0x332200 }),
    tyre: std({ map: band('TYRE  ·  PUNCTURE  ·  OIL CHANGE', '#1d2329', '#f2c230', 56) }),
    masjid: std({ map: band('MASJID', '#1f6b45', '#ffffff', 64), emissive: 0x0a2a18 }),
    pylon: std({ emissive: 0x222222, map: tex(256, 512, (x, w, h) => {
      x.fillStyle = '#0f7a4a'; x.fillRect(0, 0, w, h); x.fillStyle = '#f2c230'; x.fillRect(0, 0, w, 90);
      x.fillStyle = '#0f3d27'; x.font = 'bold 54px sans-serif'; x.textAlign = 'center'; x.fillText('FUEL', w / 2, 64);
      [['PETROL', 'Rs —'], ['HI-OCTANE', 'Rs —'], ['DIESEL', 'Rs —'], ['HI-FLOW', 'Rs —']].forEach(([a, b], i) => { const y = 140 + i * 90; x.fillStyle = '#082a1a'; x.fillRect(16, y - 40, w - 32, 72); x.fillStyle = '#ffffff'; x.font = 'bold 26px sans-serif'; x.textAlign = 'left'; x.fillText(a, 28, y + 6); x.fillStyle = '#ff4433'; x.textAlign = 'right'; x.fillText(b, w - 28, y + 6); });
      x.fillStyle = '#ffffff'; x.font = 'bold 22px sans-serif'; x.textAlign = 'center'; x.fillText('MART · TYRE · OIL · PRAYER', w / 2, 500);
    }) }),
  };
  return _pt;
}
function pumpSign(parent, mat, w, h, x, y, z, rotY = Math.PI) { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); m.position.copy(P(x, y, z)); m.rotation.y = rotY; m.userData.keep = true; parent.add(m); return m; }
const _arrowGeo = (() => { const s = new THREE.Shape([[-1.2, -4], [1.2, -4], [1.2, 0], [3, 0], [0, 4.5], [-3, 0], [-1.2, 0]].map(([a, b]) => new THREE.Vector2(a, b))); const g = new THREE.ShapeGeometry(s); g.rotateX(-Math.PI / 2); return g; })();
function pumpArrow(parent, x, y, dir) { const a = new THREE.Mesh(_arrowGeo, M.whitePaint); a.position.copy(P(x, y, 0.36)); a.rotation.y = dir; parent.add(a); }
