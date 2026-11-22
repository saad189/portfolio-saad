// v7/v9/v13 — head office + owners' flats (one building since v13), rice mill operations office.
// Each building is floor by floor: Cut-away level 1 removes walls + roof (top floor visible),
// level 2 also removes the upper floors (ground floor visible). Interiors are proposals.
import * as THREE from 'three';
import { SITE } from '../site.js';
import { M, P, box, boxR, slab, cyl, segBox, strut, panel, railRect, stairFlight, label, tag, person, car, waterTank, acUnit, partition, desk, table, sofa, bed, counter, trees, solarArray, mergeByMaterial } from '../lib.js';

const cutLabel = (parent, text, x, y, h, floor) => {
  const l = label(parent, text, x, y, h, 'cut', 1); l.userData.cutOnly = true;
  if (floor === 0) l.userData.groundOnly = true; else if (floor > 0) l.userData.upper = true;
  return l;
};
const flag = (o, k) => { o.userData[k] = true; return o; };

// shell: slabs (upper ones flagged), perimeter columns, facade walls + roof + parapet (cut)
function shell(g, r, floors, fh, wallMat, o = {}) {
  const H = floors * fh, t = 0.7;
  for (let f = 0; f < floors; f++) { const s = box(g, r.x1 + t, r.y1 + t, r.x2 - t, r.y2 - t, 0.8, o.floor || M.floorSlab, f * fh, false); if (f > 0) s.userData.upper = true; }
  flag(box(g, r.x1, r.y1, r.x2, r.y2, 0.9, M.slab, H - 0.9), 'cut');
  const sp = o.col || 13, along = (a, b) => { const n = Math.max(1, Math.round((b - a) / sp)); return Array.from({ length: n + 1 }, (_, i) => a + (b - a) * i / n); };
  const col = (x, y) => { for (let f = 0; f < floors; f++) { const c = box(g, x - .5, y - .5, x + .5, y + .5, fh, M.plaster, f * fh); if (f > 0) c.userData.upper = true; } };   // per floor, so ground-floor cut-away stays low
  along(r.x1 + .5, r.x2 - .5).forEach(x => [r.y1 + .5, r.y2 - .5].forEach(y => col(x, y)));
  along(r.y1 + .5, r.y2 - .5).forEach(y => [r.x1 + .5, r.x2 - .5].forEach(x => col(x, y)));
  const sides = { S: [r.x1, r.y1, r.x2, r.y1 + t], N: [r.x1, r.y2 - t, r.x2, r.y2], W: [r.x1, r.y1, r.x1 + t, r.y2], E: [r.x2 - t, r.y1, r.x2, r.y2] };
  Object.entries(sides).forEach(([k, [a, b, c, d]]) => { const m = (o.sides && o.sides[k]) || wallMat; if (m) flag(box(g, a, b, c, d, H, m), 'cut'); });
  const par = o.parapet ?? 3.2, pm = o.parapetMat || M.plaster;
  Object.values(sides).forEach(([a, b, c, d]) => flag(box(g, a, b, c, d, par, pm, H), 'cut'));
  return H;
}

// ======================= v13: HEAD OFFICE + OWNERS' FLATS — one building over both plots =======================
// Ground floor = head office for both mills; 1st + 2nd floor = one owners' apartment each. Entrances on all four sides:
// main (west, from the main road), drop-off (north, parking), lawn (south), residents (east, backyard towards the farm).
// Style after Saad's reference: dark stone + glass ground floor, beige upper floors, glass-railed balconies, timber louvres.
export function buildOfficeBlock(parent) {
  const g = new THREE.Group(); g.name = 'officeBlock'; parent.add(g);
  const r = SITE.east.office, GF = 12, RF = 11, H = GF + 2 * RF, t = 0.7;
  const X1 = r.x1, X2 = r.x2, Y1 = r.y1, Y2 = r.y2;                                   // 225, 277, 198, 260
  const z0 = 0.8, z1 = GF + 0.8, z2 = GF + RF + 0.8;
  const cut = (m) => flag(m, 'cut'), up = (m) => flag(m, 'upper');
  // ---- structure: slabs, perimeter columns per storey, roof with overhang + fascia ----
  box(g, X1 + t, Y1 + t, X2 - t, Y2 - t, 0.8, M.floorSlab, 0, false);
  up(box(g, X1 + t, Y1 + t, X2 - t, Y2 - t, 0.8, M.floorSlab, GF, false)); up(box(g, X1 + t, Y1 + t, X2 - t, Y2 - t, 0.8, M.floorSlab, GF + RF, false));
  cut(box(g, X1 - 1.5, Y1 - 1.5, X2 + 1.5, Y2 + 1.5, 1.2, M.slab, H - 0.2));                                  // roof slab with overhang
  [[X1 - 1.7, Y1 - 1.7, X2 + 1.7, Y1 - 1.1], [X1 - 1.7, Y2 + 1.1, X2 + 1.7, Y2 + 1.7], [X1 - 1.7, Y1 - 1.7, X1 - 1.1, Y2 + 1.7], [X2 + 1.1, Y1 - 1.7, X2 + 1.7, Y2 + 1.7]]
    .forEach(([a, b2, c, d]) => cut(box(g, a, b2, c, d, 2.4, M.darkMetal, H - 0.6)));                              // dark fascia band + parapet
  const xs = [X1 + .5, 238, 251, 264, X2 - .5], ys = [Y1 + .5, 213.5, 229, 244.5, Y2 - .5];
  xs.forEach((x, i) => ys.forEach((y, j) => { if (i && i < 4 && j && j < 4) return; box(g, x - .5, y - .5, x + .5, y + .5, GF, M.plaster, 0); up(box(g, x - .5, y - .5, x + .5, y + .5, 2 * RF, M.plaster, GF)); }));
  // ---- ground floor facades (stone + glass) with the four entrances ----
  cut(box(g, X1, Y1, X1 + t, 244.5, GF, M.stoneDark)); cut(box(g, X1, 252.5, X1 + t, Y2, GF, M.stoneDark));                  // west, door gap 244.5–252.5
  cut(box(g, X1 + .1, 244.5, X1 + .5, 252.5, GF - 2, M.glass)); cut(box(g, X1, 244.5, X1 + t, 252.5, 2, M.stoneDark, GF - 2));
  cut(box(g, X1, Y2 - t, 233, Y2, GF, M.stoneDark)); cut(box(g, 233, Y2 - .5, 263, Y2 - .1, GF - 1, M.glass)); cut(box(g, 263, Y2 - t, X2, Y2, GF, M.stoneDark));   // north
  for (let x = 237.5; x < 263; x += 4.5) cut(box(g, x - .12, Y2 - .6, x + .12, Y2, GF - 1, M.darkMetal));
  cut(box(g, X1, Y1, 228, Y1 + t, GF, M.stoneDark)); cut(box(g, 228, Y1 + .1, 275, Y1 + .5, GF - 1, M.glass)); cut(box(g, 275, Y1, X2, Y1 + t, GF, M.stoneDark));   // south (lawn)
  for (let x = 232; x < 275; x += 4.7) cut(box(g, x - .12, Y1, x + .12, Y1 + .6, GF - 1, M.darkMetal));
  cut(box(g, 228, Y1, 275, Y1 + t, 1, M.stoneDark, GF - 1));
  cut(box(g, X2 - t, Y1, X2, Y2, GF, M.stoneDark));                                                                           // east
  // main entrance (west): stone portal, canopy, podium + steps, sign; planter gap in front
  cut(box(g, X1 - .6, 243.6, X1, 244.5, GF + 2, M.stone)); cut(box(g, X1 - .6, 252.5, X1, 253.4, GF + 2, M.stone));
  box(g, 220.8, 243, X1, 254, 0.6, M.darkMetal, 10.6); box(g, 222, 243.5, X1, 253.5, 0.5, M.stone, 0); box(g, 221, 244.5, 222, 252.5, 0.25, M.stone, 0);
  const hs = new THREE.Mesh(new THREE.PlaneGeometry(9, 4.5), M.hqSign); hs.position.copy(P(220.75, 248.5, 13.6)); hs.rotation.y = -Math.PI / 2; hs.userData.keep = true; g.add(hs);
  box(g, 220.9, 244, 221.1, 253, 0.6, M.darkMetal, 11.2);
  // drop-off entrance (north): porte-cochère with sign on its fascia
  box(g, 236, Y2, 260, 268.5, 0.9, M.darkMetal, 11.2); box(g, 236, 268.1, 260, 268.6, 1.8, M.darkMetal, 10.6);
  [[237, 267.8], [259, 267.8]].forEach(([x, y]) => cyl(g, x, y, 0.45, 11.2, M.fin, 0, 10));
  const os = new THREE.Mesh(new THREE.PlaneGeometry(9, 1.6), M.officeSign); os.position.copy(P(248, 268.65, 11.5)); os.rotation.y = Math.PI; os.userData.keep = true; g.add(os);
  // lawn entrance (south): double doors from the lawn foyer, steps onto the apron
  cut(box(g, 245.5, Y1 - .1, 250.5, Y1 + .3, 8.5, M.timber, 0.3)); box(g, 244.5, 196.8, 251.5, Y1, 0.45, M.stone, 0);
  // residents' entrance (east): stone core tower, door + canopy onto the backyard landing
  cut(box(g, X2 - .1, 222, X2 + .6, 236, H + 4, M.stoneDark));
  box(g, X2 + .6, 225.5, 280, 232.5, 0.5, M.darkMetal, 8.5); box(g, X2 + .55, 227, X2 + .8, 231, 7.5, M.wood, 0.2);
  // ---- upper floors: beige walls, balconies (south full width over the lawn, north over the drop-off), timber louvres ----
  [[X1, Y1, X1 + t, Y2], [X2 - t, Y1, X2, Y2], [X1, Y1, X2, Y1 + t], [X1, Y2 - t, X2, Y2]].forEach(([a, b, c, d]) => cut(box(g, a, b, c, d, 2 * RF, M.beige, GF)));
  [GF, GF + RF].forEach((zf) => {
    const bz = new THREE.Group(); bz.userData.upper = true; g.add(bz);
    box(bz, X1 - 1.5, 193, X2 + 1.5, Y1, 0.7, M.plasterBeige, zf - 0.3); box(bz, X1 - 1.7, 192.8, X2 + 1.7, 193.4, 1.1, M.darkMetal, zf - 0.6);
    box(bz, X1 - 1.4, 193.1, X2 + 1.4, 193.4, 3.4, M.glassRail, zf + 0.4);
    box(bz, 262, Y2, 276, 264.5, 0.6, M.plasterBeige, zf - 0.3); box(bz, 262, 264.2, 276, 264.5, 3.4, M.glassRail, zf + 0.3);
    [[X1, Y1], [X2 - 2, Y1]].forEach(([x, y]) => box(bz, x + 0.5, y - 4.5, x + 1.5, y - 3.5, 1.4, M.hedge, zf + 0.4));
    for (let y = 200; y < 216; y += 1.6) cut(box(bz, X1 - 1.2, y - .25, X1, y + .25, RF - 1, M.timber, zf + 0.5));            // west (afternoon sun)
    for (let y = 241; y < 258; y += 1.6) cut(box(bz, X1 - 1.2, y - .25, X1, y + .25, RF - 1, M.timber, zf + 0.5));
    for (let y = 240; y < 258; y += 1.6) cut(box(bz, X2, y - .25, X2 + 1.2, y + .25, RF - 1, M.timber, zf + 0.5));            // east bedrooms
  });
  // roof: core mumty, tanks, AC, a small solar array
  cut(box(g, 267, 222, X2, 236, 8, M.plasterBeige, H));
  [[230, 202], [236, 202], [242, 202]].forEach(([x, y], i) => { const tg = new THREE.Group(); tg.userData.cut = true; g.add(tg); waterTank(tg, x, y, H + 1, i % 2 ? 0xe9e9e4 : 0x1e1f22); });
  [[232, 230], [238, 230], [244, 230]].forEach(([x, y]) => { const ag = new THREE.Group(); ag.userData.cut = true; g.add(ag); acUnit(ag, x, y, H + 1); });
  cut(solarArray(g, 250, 250, H + 3, 34, 14, 0.2, 0));
  // ---- residents' core: enclosed stair + lift, own door on the east, never through the office ----
  const core = { x1: 267, y1: 222, x2: X2 - t, y2: 236 };
  [[0, z0], [1, z1], [2, z2]].forEach(([f, z]) => {
    const q = new THREE.Group(); if (f > 0) q.userData.upper = true; g.add(q);
    partition(q, [core.x1, core.y1], [core.x1, core.y2], z, 9); partition(q, [core.x1, core.y1], [core.x2, core.y1], z, 9); partition(q, [core.x1, core.y2], [core.x2, core.y2], z, 9);
    box(q, 273, 230, 276, 235.6, 9, M.darkMetal, z);
    const fh = f === 0 ? GF : RF; if (f < 2) { stairFlight(q, [269, 222.6, z], [269, 229.5, z + fh / 2], 3); stairFlight(q, [271.5, 229.5, z + fh / 2], [271.5, 222.6, z + fh], 2.2); }
  });
  // ---- ground floor: head office ----
  const g0 = new THREE.Group(); g.add(g0);
  [[[X1 + t, 240], [233, 240]], [[238, 240], [265, 240]], [[243, 246], [243, Y2 - t]], [[265, 240], [265, 249]], [[265, 253], [265, Y2 - t]],                 // north band walls
   [[230, 236], [267, 236]], [[243, 222], [243, 236]], [[251, 222], [251, 236]], [[259, 222], [259, 236]], [[X1 + t, 222], [241, 222]], [[245, 222], [267, 222]],  // middle band
   [[X1 + t, 218], [241, 218]], [[251, 218], [262, 218]], [[266, 218], [X2 - t, 218]], [[245, Y1 + t], [245, 214]], [[251, Y1 + t], [251, 218]], [[267, Y1 + t], [267, 218]]]   // south band
    .forEach(([a, b]) => partition(g0, a, b, z0));
  counter(g0, 230, 251, 239, 253.5, z0, 3.4, M.wood); person(g0, 234.5, 254.6, z0, M.kurta2);                    // reception desk (serves west + north doors)
  sofa(g0, 226.4, 241, 228.8, 249, z0); sofa(g0, 226.4, 254, 233, 258.6, z0);
  counter(g0, 243.3, 247, 245.3, 257, z0, 3.6, M.wood);                                                         // cashier counter onto the lobby
  [[249, 252, 'S'], [255.5, 252, 'S'], [261.5, 252, 'S'], [249, 244, 'N'], [255.5, 244, 'N'], [261.5, 244, 'N']].forEach(([x, y, f]) => desk(g0, x, y, z0, f));
  table(g0, 267.5, 244, 275.4, 255, z0);                                                                         // dealer meeting
  [[230, 229, 'E'], [238, 229, 'W'], [230, 225, 'E']].forEach(([x, y, f]) => desk(g0, x, y, z0, f));             // admin + HR
  [[244, 223], [246.5, 223], [249, 223]].forEach(([x, y]) => box(g0, x, y, x + 1.8, y + 3, 7, M.darkMetal, z0));   // server + file racks
  box(g0, 251.5, 222.5, 258.6, 235.6, 0.05, M.tile, z0); counter(g0, 259.5, 233.6, 266.6, 235.5, z0, 3);           // washrooms, pantry
  box(g0, 259.6, 222.6, 266.4, 229, 0.06, M.flowers, z0);                                                        // prayer corner (rug)
  desk(g0, 236, 209, z0, 'S'); sofa(g0, 226.4, 200, 228.8, 211, z0); box(g0, 229.5, 202, 232.5, 205, 1.4, M.wood, z0);   // CEO office
  table(g0, 253, 203, 265, 213, z0); box(g0, 266.5, 204, 266.9, 212, 4.5, M.darkMetal, z0 + 2.5);                // board room (10) + screen
  desk(g0, 272, 209, z0, 'S');                                                                                    // director
  person(g0, 236, 206.4, z0, M.kurta); person(g0, 248, 205, z0, M.kurta3); person(g0, 255.5, 249.5, z0);
  [['Reception · main + drop-off doors', 234, 248, 0], ['Accounts + sales · cashier', 254, 248, 0], ['Dealer meeting', 270.5, 250, 0], ['Admin + HR', 234, 229, 0], ['Records / server', 247, 230, 0],
   ['Washrooms', 255, 229, 0], ['Pantry · prayer', 263, 229, 0], ['Residents’ stair + lift', 271.5, 229, 0], ['CEO office → lawn', 235, 205, 0], ['Lawn foyer', 248, 208, 0], ['Board room (10)', 259, 208, 0], ['Director', 272, 205, 0]]
    .forEach(([tx, x, y]) => cutLabel(g, tx, x, y, z0 + 7, 0));
  // ---- 1st + 2nd floors: one owners' apartment each (≈2,950 sq ft net) ----
  [z1, z2].forEach((z, i) => {
    const a = new THREE.Group(); a.userData.upper = true; g.add(a);
    [[[X1 + t, 218], [241, 218]], [[263, 218], [X2 - t, 218]], [[245, Y1 + t], [245, 218]], [[263, Y1 + t], [263, 218]], [[X1 + t, 210], [233, 210]], [[233, 210], [233, 218]],   // master, lounge, drawing
     [[237, 222], [237, 231]], [[X1 + t, 236], [237, 236]], [[257, 222], [257, 229]], [[257, 233], [257, 236]],                                                             // kitchen, entry lobby
     [[X1 + t, 240], [236, 240]], [[239, 240], [252, 240]], [[255, 240], [264, 240]], [[267, 240], [X2 - t, 240]], [[241, 240], [241, Y2 - t]], [[257, 240], [257, Y2 - t]], [[269, 240], [269, Y2 - t]],
     [[231, 240], [231, 246]], [[X1 + t, 246], [231, 246]], [[251, 254], [257, 254]]]
      .forEach(([p, q2]) => partition(a, p, q2, z, 9));
    bed(a, 234, 200.5, 241, 207.5, z); box(a, 226, 210.6, 232.6, 217.5, 0.05, M.tile, z); box(a, 242.5, 210, 244.6, 217.5, 6.5, M.wood, z);   // master suite
    sofa(a, 247, 200, 261, 202.5, z); sofa(a, 247, 203, 249.5, 214, z); box(a, 252, 206, 258, 210, 1.3, M.wood, z);                          // family lounge
    sofa(a, 264, 200, 275.5, 202.5, z); sofa(a, 273.5, 203, 276, 214, z); box(a, 266, 206, 271, 210, 1.3, M.wood, z);                        // drawing room
    counter(a, 226, 222.6, 228, 235.5, z, 3, M.tile); counter(a, 228, 233.6, 236.5, 235.5, z, 3, M.tile);                                      // kitchen
    table(a, 240.5, 225, 251.5, 233, z);                                                                                                      // dining (10)
    bed(a, 232.5, 251, 239.5, 258, z); box(a, 226, 240.5, 230.6, 245.6, 0.05, M.tile, z);                                                     // bed 2 + bath
    bed(a, 245, 251, 252, 258, z); box(a, 251.4, 254.4, 256.6, 258.8, 0.05, M.tile, z);                                                        // bed 3 + bath
    bed(a, 259.5, 251, 266.5, 258, z); box(a, 270, 253, 276, 256.5, 1.6, M.wood, z); box(a, 270, 241, 276, 244, 3, M.whitePaint, z);         // bed 4, servant room + laundry
    person(a, 254, 212, z, i ? M.kurta3 : M.kurta2); person(a, 246, 229, z);
    if (i === 1) [['Master suite', 236, 212], ['Family lounge → balcony', 254, 216], ['Drawing room', 270, 216], ['Kitchen', 231, 229], ['Dining', 246, 229.5], ['Entry lobby', 262, 230],
      ['Bed 2', 236, 249], ['Bed 3', 249, 249], ['Bed 4', 263, 249], ['Servant · laundry', 272.5, 249]].forEach(([tx, x, y]) => cutLabel(g, tx, x, y, z + 7, 1));
  });
  tag(g, r, {
    name: 'Head office + owners’ flats (one building)', status: 'new', size: '52 × 62 ft · G + 2, on both old plots (60 × 65.5 ft)',
    area: '≈9,670 sq ft gross: office ≈3,220 + two apartments ≈3,220 each',
    notes: 'v13: the head office and the owners’ building merged into one building across both plots, as intended. Ground floor = head office for both mills; 1st and 2nd floors = one owners’ apartment each. Four entrances: MAIN on the west from the main road (stone portal, canopy, sign, podium + steps, set 5 ft back behind the planter); DROP-OFF on the north under the porte-cochère from the parking; LAWN on the south through a glass foyer onto the full-length lawn; RESIDENTS on the east from the backyard (towards the farm) straight into their own stair + lift, so the family never passes through the office. Ground: reception serving both office doors, accounts + sales with a cashier counter, dealer meeting, admin + HR, records/server, washrooms, pantry + prayer, CEO office opening to the lawn, board room (10), one director office. Each apartment ≈2,950 sq ft net: master suite, family lounge onto the south balcony, drawing room, kitchen, dining (10), 3 more bedrooms (2 with baths), servant room + laundry, entry lobby off the lift. Use Cut-away (twice for the ground floor).',
    finance: {
      rows: [
        ['Built area', '≈9,670 sq ft (3 × ≈3,220)'],
        ['Build cost', 'Rs 5.8–7.7 cr (≈ Rs 6,000–8,000/sq ft, good office + residential finish)'],
        ['vs the two buildings (v9)', 'office space −1,600 sq ft (was ≈4,830 across two buildings) · apartments +3,200 sq ft'],
      ],
      note: 'Planning estimate at Nov 2026 rates. If the office turns out too tight on one floor, the simplest fix is to split the 2nd floor into two smaller apartments and give the 1st floor’s south half to the CEO suite + board room.',
    },
    round: 13,
  });
  label(g, 'Head office + owners’ flats', 251, 229, 42, 'major', 1);
  return mergeByMaterial(g);
}

function waterTankG(g, x, y, z, c) { const t = new THREE.Group(); g.add(t); waterTank(t, x, y, z, c); return t; }

// ======================= RICE MILL OPERATIONS OFFICE (v9: extended west to 71 × 41 ft) =======================
export function buildOps(parent) {
  const g = new THREE.Group(); g.name = 'offices'; parent.add(g);
  const r = SITE.rice.opsOffice, FH = 12, z0 = 0.8, z1 = FH + 0.8;
  const g0 = new THREE.Group(), g1 = new THREE.Group(); g1.userData.upper = true; g.add(g0, g1);
  shell(g, r, 2, FH, M.ops, { col: 14.2, parapetMat: M.darkMetal });
  flag(box(g, r.x1, r.y1, r.x2, r.y2, FH - 0.2, M.brickFace), 'cut').scale.set(1.003, 1, 1.006);
  for (let f = 1; f <= 2; f++) [[r.x1 - .8, r.y1 - .8, r.x2 + .8, r.y1], [r.x1 - .8, r.y2, r.x2 + .8, r.y2 + .8], [r.x1 - .8, r.y1 - .8, r.x1, r.y2 + .8], [r.x2, r.y1 - .8, r.x2 + .8, r.y2 + .8]].forEach(([a, b, c, d]) => flag(box(g, a, b, c, d, 0.35, M.darkMetal, f * FH - 0.2), 'cut'));
  flag(box(g, 164, 156, 174.4, 167.4, 2 * FH + 4, M.glass), 'cut');
  box(g, 174, 133, 177.6, 143, 0.5, M.darkMetal, 10.5); [[177, 133.5], [177, 142.5]].forEach(([x, y]) => cyl(g, x, y, 0.3, 10.5, M.fin, 0, 8));
  
  const kit = new THREE.Group(); kit.userData.cut = true; g.add(kit);
  waterTank(kit, 125, 130, 2 * FH); waterTank(kit, 131, 130, 2 * FH, 0xe9e9e4); [130, 140, 150, 160].forEach(x => acUnit(kit, x, 150, 2 * FH));
  // ground: rice QC lab, store-keeper + spares, despatch + weighbridge clerks, reception/counter, washrooms, pantry, stair
  partition(g0, [146, 126.7], [146, 166.3], z0); partition(g0, [120.7, 146], [146, 146], z0); partition(g0, [161, 126.7], [161, 146], z0);
  partition(g0, [146, 146], [164, 146], z0); partition(g0, [146, 154], [164, 154], z0); partition(g0, [164, 146], [164, 166.3], z0); partition(g0, [155, 154], [155, 166.3], z0);
  counter(g0, 121, 127, 145.5, 129.5, z0); counter(g0, 121, 129.5, 123.5, 145.5, z0); counter(g0, 129, 136, 141, 139, z0, 3);
  [[124, 127.5], [127, 127.5], [130, 127.5], [133, 127.5], [136, 127.5], [139, 127.5]].forEach(([x, y]) => box(g0, x, y, x + 1.8, y + 1.2, 1.2, M.machine, z0 + 3));
  [[122, 148], [122, 153], [122, 158], [122, 163]].forEach(([x, y]) => box(g0, x, y, x + 12, y + 1.8, 7, M.darkMetal, z0)); desk(g0, 140, 156, z0, 'W');
  [[150, 131, 'N'], [156.5, 131, 'N'], [150, 140, 'S'], [156.5, 140, 'S']].forEach(([x, y, f]) => desk(g0, x, y, z0, f));
  counter(g0, 169, 129, 171.5, 144, z0, 3.6, M.wood); sofa(g0, 162, 128, 164.5, 137, z0); person(g0, 172.5, 136, z0, M.kurta2);
  box(g0, 146.5, 154.5, 154.5, 166, 0.05, M.tile, z0); counter(g0, 155.5, 163.5, 163.5, 165.8, z0, 3);
  stairFlight(g0, [166.5, 157, z0], [166.5, 165.5, z0 + 6], 3.4); stairFlight(g0, [171.5, 165.5, z0 + 6], [171.5, 157, z1], 3.4); box(g0, 164.3, 165.5, 174, 166.3, 0.5, M.slab, z0 + 5.5);
  person(g0, 132, 140.5, z0, M.kurta3); person(g0, 158, 136, z0);
  // first: meeting/training, canteen + rest, production + shift, mill manager, prayer, records, washrooms
  partition(g1, [146, 126.7], [146, 166.3], z1); partition(g1, [120.7, 146], [146, 146], z1); partition(g1, [161, 126.7], [161, 146], z1);
  partition(g1, [146, 146], [164, 146], z1); partition(g1, [146, 154], [164, 154], z1); partition(g1, [164, 146], [164, 166.3], z1); partition(g1, [153, 154], [153, 166.3], z1); partition(g1, [158.5, 154], [158.5, 166.3], z1);
  table(g1, 126, 131, 140, 140, z1); box(g1, 120.8, 132, 121.2, 139, 4.5, M.darkMetal, z1 + 2.5);
  [[124, 150, 132, 153], [136, 150, 143, 153], [124, 158, 132, 161], [136, 158, 143, 161]].forEach(([a, b, c, d]) => table(g1, a, b, c, d, z1));
  [[150, 131, 'N'], [156.5, 131, 'N'], [150, 140, 'S'], [156.5, 140, 'S']].forEach(([x, y, f]) => desk(g1, x, y, z1, f));
  desk(g1, 167, 134, z1, 'E'); sofa(g1, 162, 128, 164.5, 135, z1);
  box(g1, 146.5, 154.5, 152.5, 165.8, 0.06, M.flowers, z1); [[153.5, 156], [153.5, 160], [153.5, 164]].forEach(([x, y]) => box(g1, x, y, x + 4.5, y + 1.6, 6.5, M.darkMetal, z1)); box(g1, 159, 154.5, 163.5, 165.8, 0.05, M.tile, z1);
  person(g1, 167, 131.6, z1, M.kurta); person(g1, 128, 151.5, z1, M.kurta2); person(g1, 133, 135.5, z1, M.kurta3);
  [['Rice QC lab', 133, 137, 0], ['Store-keeper + spares', 133, 156, 0], ['Despatch + weighbridge clerks', 153.5, 135.5, 0], ['Reception / counter', 167, 140, 0], ['Washrooms · pantry', 155, 160, 0],
   ['Meeting / training (12)', 133, 135.5, 1], ['Staff canteen + rest', 133, 156, 1], ['Production + shift (4)', 153.5, 135.5, 1], ['Mill manager', 167, 135, 1], ['Prayer', 149.5, 160, 1], ['Records', 156, 160, 1]]
    .forEach(([t, x, y, f]) => cutLabel(g, t, x, y, (f ? z1 : z0) + 7, f));
  tag(g, r, { name: 'Rice mill operations office', status: 'new', size: '54 × 41 ft · 2 storeys', area: '≈4,430 sq ft gross (2 floors)', notes: 'v16: the east 17 ft removed so the corner where the east–west lane meets the main road is open paved space for turning trucks (v17: no lawn there); reception, stair and mill manager moved west, clerks and production desks cut from 6 to 4. v9: extended west by 30 ft (was 41 × 46). Keeps a 26.8 ft two-way lane to the milling hall on the west and a 26 ft lane to finished goods on the south. Ground: bigger rice QC lab (moisture, broken %, whiteness, sample store), store-keeper + spares racks, 6 despatch/weighbridge clerks, reception/counter for drivers, washrooms, pantry. First: meeting/training room for 12, staff canteen + rest, production + shift supervisors (6), mill manager, prayer, records.', round: 9 });
  label(g, 'Rice mill office', 147, 146.5, 32, 'major', 1);
  return mergeByMaterial(g);
}
