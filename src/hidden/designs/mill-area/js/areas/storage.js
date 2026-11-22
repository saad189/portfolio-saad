// Round 3 — paddy store (existing storage shed) + drying yard inside the one-way loop.
// Guessed where no photos: the store is modelled as a brick-walled godown with steel trusses, GI roof,
// turbo ventilators, wall vents and roller shutters on the yard side. Stacks sized to the stated ≈900 t.
import * as THREE from 'three';
import { SITE } from '../site.js';
import { M, P, box, boxR, slabR, slab, segBox, roundRectPts, cyl, gableShed, shutter, label, tag, rng, strut, person, tractor, hopper, mergeByMaterial } from '../lib.js';

const cutLabel = (parent, text, x, y, h) => { const l = label(parent, text, x, y, h, 'cut', 1); l.userData.cutOnly = true; return l; };
const DOORS = [200, 250, 300, 350, 392];
export const YARD_R = 24;                                                    // v15: drying-yard corner radius (ft) so trucks/trolleys turn easily on the loop

export function build(scene) {
  const g = new THREE.Group(); g.name = 'storage'; scene.add(g);
  buildStore(g);
  buildYard(g);
  return g;
}

function buildStore(g) {
  const s = new THREE.Group(); s.name = 'shed'; g.add(s);
  const r = SITE.storage, FL = 1.5;                                          // raised godown floor (damp-proof)
  slabR(s, r, FL, M.slab);
  const sh = gableShed(s, r, { eave: 20, rise: 7, plinth: 4, wall: M.brick, plinthMat: M.brick, roof: M.roof, trim: M.steelDark, louvre: false, overhang: 2.5, cut: true, frames: 20 });
  // today's gable roof (GI sheets, trusses, ridge ventilators) is hidden when the flat-roof + solar option is on
  const rg = sh.userData.roof; rg.userData.optionOff = true;
  const vent = new THREE.Group(); vent.userData.optionOff = true; s.add(vent);
  // wall vents near the eaves (both long walls) and gable vents
  for (let y = 176; y < 405; y += 12) [[-0.15, 0.25], [43.05, 43.45]].forEach(([a, b]) => { const v = box(s, a, y - 2, b, y + 2, 1.6, M.vent, 15.8, false); v.userData.cut = true; });
  // turbo ventilators along the ridge
  for (let y = 182; y < 400; y += 24) {
    const t = cyl(vent, 21.6, y, 0.9, 1.2, M.steel, 27.6, 12); t.userData.cut = true;
    const d = new THREE.Mesh(new THREE.SphereGeometry(1.15, 14, 8), M.stainless); d.scale.y = 0.8; d.position.copy(P(21.6, y, 29.6)); d.castShadow = true; d.userData.cut = true; vent.add(d);
  }
  [rg, vent].forEach(o => { mergeByMaterial(o); o.children.forEach(c => { c.userData.keep = true; }); });
  flatRoofSolar(s, r);
  // roller shutters + concrete ramps onto the loop
  DOORS.forEach(y => {
    shutter(s, 43.2, y, 'E', 14, 14, M.steelDark, true);
    const rp = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 16), M.concrete);
    rp.position.copy(P(46.1, y, 0.55)); rp.rotation.z = -0.2526; rp.receiveShadow = true; s.add(rp);
  });
  // south gable opening for the intake belt
  box(s, 39, 168.7, 43, 169.3, 13, M.vent, FL).userData.cut = true;

  // ---- inside: paddy bag stacks on dunnage, aisles to every door (≈900 t) ----
  const R = rng(5);
  const spans = [[180, 192], [208, 242], [258, 292], [308, 342], [358, 384], [400, 408]];
  const rows = [[2, 19], [25, 41.5]];
  spans.forEach(([y1, y2], i) => rows.forEach(([x1, x2], j) => {
    const hgt = 11 + Math.round(R() * 4);
    box(s, x1, y1, x2, y2, 0.5, M.wood, FL);                                     // dunnage
    box(s, x1 + .2, y1 + .2, x2 - .2, y2 - .2, hgt, M.jute, FL + 0.5);
    if ((i + j) % 3 === 1) box(s, x1 - .2, y1 - .2, x2 + .2, y2 + .2, hgt + 0.9, M.tarpGreen, FL + 0.2);   // fumigation cover
    // stepped top course (half-height) to read as stacked bags
    box(s, x1 + 1.5, y1 + 1.5, x2 - 1.5, y2 - 1.5, 1, M.jute, FL + 0.5 + hgt);
  }));
  // intake hopper area stays clear (south end); mobile belt loader at a door
  const bl = new THREE.Group(); s.add(bl);
  strut(bl, [24, 300, FL + 1], [46, 300, 12], 2.2, M.steelGreen);
  [[26, 299], [26, 301], [40, 299], [40, 301]].forEach(([x, y]) => cyl(bl, x, y, 0.6, 0.6, M.tyre, FL, 10));
  person(s, 22, 296, FL, M.kurta2); person(s, 22, 246, FL, M.kurta3); person(s, 46, 352, 0, M.kurta);
  tag(s, r, { name: 'Paddy store (existing shed)', status: 'existing', size: '43.2 × 241 ft', area: '10,411 sq ft', notes: 'Guessed finish (no photos yet): brick-walled godown on a raised floor, steel trusses every 20 ft, GI roof with turbo ventilators, wall vents under the eaves, five roller shutters with ramps onto the drying loop. Inside: 12 stack blocks of paddy bags on wooden dunnage (two rows either side of a 6 ft aisle, cross-aisles at every door), 11–15 ft high, some under fumigation covers. Stack volume ≈ 54,800 ft³ ≈ 900 t of paddy, matching the stated capacity. Intake hopper for the saila belt at the south end. v11: turn on Options to see the roof flattened and covered in solar panels (click the panels for capacity and cost).', round: 3 });
  label(s, 'Paddy store · ≈900 t', 21.6, 290, 36, 'major', 1);
  cutLabel(s, 'Paddy stacks (bagged)', 10.5, 325, 18); cutLabel(s, 'Belt loader', 36, 300, 16); cutLabel(s, 'Intake hopper → saila', 37, 175, 8);
  mergeByMaterial(s);
}

function buildYard(g) {
  const d = new THREE.Group(); d.name = 'drying'; g.add(d);
  const y = SITE.dryingYard, R = rng(8);
  // v15: corners rounded (R 24 ft) so trucks and tractor-trolleys on the one-way loop can turn without cutting the kerb
  const RY = YARD_R, ring = (r, rad) => { const p = roundRectPts(r, rad); return p.map((a, i) => [a, p[(i + 1) % p.length]]); };
  slab(d, roundRectPts(y, RY), 0.35, M.concrete);
  ring({ x1: y.x1 + .3, y1: y.y1 + .3, x2: y.x2 - .3, y2: y.y2 - .3 }, RY - .3).forEach(([a, b]) => segBox(d, a, b, 0.6, 0.9, M.slab, 0));          // kerb
  ring({ x1: y.x1 + 1.2, y1: y.y1 + 1.2, x2: y.x2 - 1.2, y2: y.y2 - 1.2 }, RY - 1.2).forEach(([a, b]) => segBox(d, a, b, 1.2, 0.05, M.steelDark, 0.35));   // grated drain

  const Z = 0.4;
  // 1) thin spread layers being sun-dried (four bays), raked
  [[68, 196, 118, 280], [124, 196, 170, 262], [68, 292, 100, 383], [140, 300, 170, 383]].forEach(([x1, y1, x2, y2]) => boxR(d, { x1, y1, x2, y2 }, 0.22, M.paddy, Z, false));
  // 2) windrows being raked up for collection
  const wg = new THREE.CylinderGeometry(1.6, 1.6, 30, 12, 1, false, 0, Math.PI); wg.rotateX(Math.PI / 2); wg.rotateZ(Math.PI / 2);
  for (let i = 0; i < 5; i++) { const w = new THREE.Mesh(wg, M.paddy); w.scale.y = 0.6; w.position.copy(P(104 + i * 6, 345, Z)); w.castShadow = true; w.receiveShadow = true; d.add(w); }
  // 3) collected heaps, two covered with tarps for the night
  [[150, 278, false], [160, 278, true], [118, 290, true], [130, 270, false]].forEach(([x, yy, tarp]) => {
    const hp = new THREE.Mesh(new THREE.ConeGeometry(6.5, 5, 18), tarp ? M.tarp : M.paddy); hp.position.copy(P(x, yy, Z + 2.5)); hp.castShadow = true; d.add(hp);
  });
  box(d, 62, 282, 72, 286, 1.1, M.tarp, Z); box(d, 160, 195, 168, 199, 1.1, M.tarpGreen, Z);   // folded tarps
  // 4) tractor-trolley tipping fresh paddy from the loop; workers raking
  tractor(d, 150, 372, Math.PI / 2, true, 0.45);
  const fresh = new THREE.Mesh(new THREE.ConeGeometry(5, 3.5, 16), M.paddy); fresh.position.copy(P(136, 371, Z + 1.75)); d.add(fresh);
  [[80, 230], [96, 250], [140, 225], [70, 330], [110, 352], [150, 330]].forEach(([x, yy], i) => person(d, x, yy, Z, [M.kurta, M.kurta2, M.kurta3][i % 3], true));
  // 5) bagging point by the store doors: platform scale, filled bags waiting
  box(d, 61, 246, 66, 252, 0.6, M.steel, Z);
  for (let k = 0; k < 3; k++) box(d, 61 + k * 0.1, 254 + k * 2.6, 70, 256.4 + k * 2.6, 3 - k * 0.6, M.jute, Z);
  person(d, 64, 244, Z, M.kurta2);
  // flood-light poles
  [[y.x1 + 9, y.y1 + 9], [y.x2 - 9, y.y1 + 9], [y.x1 + 9, y.y2 - 9], [y.x2 - 9, y.y2 - 9], [y.x1 + 2.5, (y.y1 + y.y2) / 2], [y.x2 - 2.5, (y.y1 + y.y2) / 2]].forEach(([px, py]) => {
    cyl(d, px, py, 0.35, 28, M.steel, 0, 8); box(d, px - 1.5, py - .5, px + 1.5, py + .5, 1, M.steelDark, 28);
  });
  tag(d, y, { name: 'Drying yard', status: 'existing', size: '120 × 209 ft (corners rounded, R 24 ft)', area: '≈24,590 sq ft', notes: 'Full-size paved floor inside the one-way loop, with a kerb and grated drains at the edges. v15: the four corners are rounded (24 ft radius) so trucks and tractor-trolleys on the 16 ft loop can take the corners without cutting the kerb; the yard gives up ≈490 sq ft. Shown mid-day: paddy spread thin in four bays and raked, windrows being pulled up, heaps collected (two under tarps for the night), a tractor-trolley tipping a fresh load from the loop, and a bagging point with a platform scale by the store doors. At ~2 in depth the floor holds roughly 100–120 t of wet paddy per spreading (guess; depends on depth and turning).', round: 15 });
  label(d, 'Drying yard', (y.x1 + y.x2) / 2, (y.y1 + y.y2) / 2, 8, 'major', 1);
  label(d, 'Bagging point', 66, 252, 7, '', 2);
  mergeByMaterial(d);
}

// ---- v11 option: flatten the gable roof (new steel beams + insulated deck, parapet) and cover it with south-facing panel rows ----
// Layout: Longi Hi-MO X10-class 650 W modules (2382 × 1134 mm), 9 across × 2 high in portrait per row, 12° tilt,
// 11 rows at 21.5 ft pitch (no row shading at 28° winter sun) = 198 modules ≈ 128.7 kWp.
export const STORE_SOLAR = { rows: 11, across: 9, up: 2, wp: 650, tilt: 12, pitch: 21.49 };
function flatRoofSolar(s, r) {
  const fr = new THREE.Group(); fr.name = 'storeSolar'; fr.userData.option = true; s.add(fr);
  const cut = (o) => { o.userData.cut = true; return o; };
  const DECK = 21;                                                                            // top of deck (walls stop at 20 ft)
  cut(box(fr, r.x1 - 0.3, r.y1 - 0.3, r.x2 + 0.3, r.y2 + 0.3, 1, M.slab, 20));                 // insulated deck / slab
  [[r.x1 - .3, r.y1 - .3, r.x2 + .3, r.y1 + .6], [r.x1 - .3, r.y2 - .6, r.x2 + .3, r.y2 + .3], [r.x1 - .3, r.y1 - .3, r.x1 + .6, r.y2 + .3], [r.x2 - .6, r.y1 - .3, r.x2 + .3, r.y2 + .3]].forEach(([a, b, c, d]) => {
    cut(box(fr, a, b, c, d, 2.5, M.brick, DECK)); cut(box(fr, a - .1, b - .1, c + .1, d + .1, 0.25, M.slab, DECK + 2.5));   // 2.5 ft parapet + coping
  });
  // new steel roof beams on the old frame lines (stay visible in cut-away)
  for (let i = 0; i <= 12; i++) { const y = r.y1 + 0.6 + (r.y2 - r.y1 - 1.2) * i / 12; box(fr, r.x1 + .3, y - .45, r.x2 - .3, y + .45, 1.4, M.steelDark, 18.6); }
  for (let x = 7; x < 43; x += 7.2) box(fr, x - .25, r.y1 + .5, x + .25, r.y2 - .5, 0.6, M.steelDark, 19.4);   // purlins
  // panel rows
  const S = STORE_SOLAR, PW = 3.72, PL = 7.815, GAP = 0.066, tilt = S.tilt * Math.PI / 180;
  const slopeL = S.up * PL + GAP, run = slopeL * Math.cos(tilt), rise = slopeL * Math.sin(tilt), lowEdge = 1.6;
  const rowW = S.across * PW + (S.across - 1) * GAP, cx = (r.x1 + r.x2) / 2;
  const pg = new THREE.BoxGeometry(PW - 0.04, 0.12, PL - 0.04), uv = pg.attributes.uv;
  for (let k = 0; k < uv.count; k++) uv.setXY(k, uv.getX(k) * 6, uv.getY(k) * 3.3);               // one texture tile (module) per panel
  for (let i = 0; i < S.rows; i++) {
    const yF = 172.5 + i * S.pitch, yc = yF + run / 2;
    const row = new THREE.Group(); row.position.copy(P(cx, yc, DECK + lowEdge + rise / 2)); row.rotation.x = tilt; fr.add(row);
    for (let c = 0; c < S.across; c++) for (let u = 0; u < S.up; u++) {
      const m = new THREE.Mesh(pg, M.solar); m.position.set(-rowW / 2 + PW / 2 + c * (PW + GAP), 0.12, (u - (S.up - 1) / 2) * (PL + GAP)); m.castShadow = true; m.receiveShadow = true; cut(m); row.add(m);
    }
    const rail = new THREE.Mesh(new THREE.BoxGeometry(rowW, 0.25, 0.25), M.steelDark); [-1, 1].forEach(e => { const rr = rail.clone(); rr.position.set(0, -0.08, e * slopeL * 0.3); cut(rr); row.add(rr); });
    // legs: short front, tall rear, on a base rail bolted to the beams
    [6, 13.5, 21, 28.5, 36].forEach(x => {
      cut(box(fr, x - .15, yF + .5, x + .15, yF + .8, lowEdge + 0.1, M.steel, DECK));
      cut(box(fr, x - .15, yF + run - .9, x + .15, yF + run - .6, lowEdge + rise - 0.2, M.steel, DECK));
      cut(box(fr, x - .2, yF + .3, x + .2, yF + run - .3, 0.3, M.steelDark, DECK));
    });
  }
  // inverter enclosure at the north end (north of the last row, so it never shades panels), cleaning water line, downpipes
  cut(box(fr, 28, 404.6, 39, 408, 5.5, M.whitePaint, DECK)); cut(box(fr, 27.5, 404.2, 39.5, 408.4, 0.3, M.roofWhite, DECK + 5.8));
  cut(box(fr, 1.2, 172, 1.6, 407, 0.35, M.steel, DECK + 0.3));
  [[r.x2 + .5, r.y1 + 1], [r.x2 + .5, r.y2 - 1], [r.x2 + .5, 290]].forEach(([x, y]) => cyl(fr, x, y, 0.3, DECK, M.steelDark, 0, 8));
  // caged access ladder on the east wall, north end
  [405.2, 407.2].forEach(y => box(fr, 43.35, y - .1, 43.75, y + .1, DECK + 3.5, M.steel, 0));
  for (let z = 1; z < DECK + 3; z += 1) box(fr, 43.4, 405.2, 43.7, 407.2, 0.1, M.steel, z);
  for (let z = 8; z < DECK + 3; z += 3) { box(fr, 45.6, 404.4, 45.8, 408, 0.25, M.steel, z); [404.4, 407.8].forEach(y => box(fr, 43.4, y, 45.8, y + .2, 0.25, M.steel, z)); }
  const kwp = (S.rows * S.across * S.up * S.wp / 1000).toFixed(1);
  tag(fr, r, {
    name: 'Option · paddy store flat roof + solar', status: 'review', size: '43.2 × 241 ft roof',
    area: `10,411 sq ft · ${S.rows * S.across * S.up} modules × ${S.wp} W ≈ ${kwp} kWp`,
    notes: 'The gable roof (GI sheets, trusses, ridge ventilators) is taken off and replaced with new steel beams on the old frame lines, an insulated deck laid to a 2–3° fall, a 2.5 ft parapet, gutters and downpipes. The existing brick walls stay. Panels: N-type 650 W modules (Longi Hi-MO X10 class, 2382 × 1134 mm, 33.5 kg) in 11 south-facing rows, 9 across × 2 high in portrait, 12° tilt. Rows are 21.5 ft apart so none shades the next in December. The 6 ft gaps double as cleaning walkways. Inverters sit in a shaded box at the north end; access is by a caged ladder on the east wall. What else you can buy in Pakistan today: 585–620 W TOPCon (2278 × 1134 mm, the most common), 640–670 W back-contact (Hi-MO X10), and 700–720 W modules (≈2384 × 1303 mm, ≈38 kg), better suited to ground mounts. East–west “butterfly” rows would fit ≈240 modules (≈155–160 kWp) and about 15 % more energy, but are harder to wash.',
    finance: {
      rows: [
        ['Capacity (as modelled)', `≈ ${kwp} kWp · 198 × 650 W · 2 × 60 kW inverters`],
        ['Energy per year', '≈ 175–185 MWh (≈ 1,350–1,450 kWh per kWp; dust + winter smog)'],
        ['Panels', 'Rs 0.49–0.62 cr (Rs 38–48/W, tier-1 N-type, Nov 2026)'],
        ['— inverters, tilted mounting, cabling, protection, labour', 'Rs 0.35–0.50 cr'],
        ['Solar system (turnkey)', 'Rs 0.85–1.15 cr (≈ Rs 66–88/W)'],
        ['Flatten the roof (steel beams + insulated deck)', 'Rs 0.85–1.25 cr (≈ Rs 800–1,200/sq ft)'],
        ['— an RCC slab instead', 'Rs 1.6–2.4 cr, and the old walls need a structural check'],
        ['Total (steel deck)', 'Rs 1.7–2.4 cr'],
        ['Net per year (used in the mill)', '≈ Rs 46–59 lakh (≈ Rs 28–33 saved per unit, minus washing)'],
        ['Payback', 'Solar alone ≈ 1.5–2.5 yrs · with the new roof ≈ 3–5 yrs'],
        ['Cheaper alternative', 'No flattening: ≈ 290 panels flush on the two slopes ≈ 185–190 kWp, ≈ 230 MWh/yr, Rs 1.2–1.6 cr, payback ≈ 2–3 yrs'],
      ],
      note: 'The saving assumes the mills use the power on site in daytime (B2 industrial off-peak energy rate Rs 22.83 + taxes, notified Feb 2026). Fixed kW charges and evening peak hours are not reduced. Since Feb 2026, new solar users are on net billing: surplus sent to the grid earns only ≈ Rs 8–11 per unit, so oversizing for Sundays or shutdowns does not pay. Flattening only makes sense if the GI sheets are near the end of their life anyway, or if you want a walkable, easy-to-wash roof. If the roof is sound, flush panels on the existing slopes give more kWp for less money.',
    },
    round: 11,
  });
  label(fr, `Option: flat roof + solar ≈${Math.round(+kwp)} kWp`, 21.6, 340, 30, 'review', 2);
}
