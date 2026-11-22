// East block: drop-off, head office, owners' building, solar shed, farms, lawn, farmer residence, livestock shed, farmer's path,
// reserved strip (QC lab + truck parking), silos strip.
import * as THREE from 'three';
import { SITE } from '../site.js';
import { M, T, P, box, boxR, slabR, slab, rectPts, block, floorsBlock, ghost, label, tag, trees, truck, car, rng, waterTank, acUnit, person, mergeByMaterial, tractor, railRect, elevator, strut, cyl, plants, worldBox, panel, segBox } from '../lib.js';

const T_silo = () => { const t = T.silo.clone(); t.repeat.set(25, 4); t.needsUpdate = true; return t; };
const cylLocal = (p, x, y, r, h, z) => cyl(p, x, y, r, h, M.steelDark, z, 12);
import * as offices from './offices.js';

export function build(scene) {
  const E = SITE.east, g = new THREE.Group(); g.name = 'east'; scene.add(g);

  // ---------- drop-off drive (old parking strip): porte-cochère + 3 parallel spaces (v14: no car park under the solar shed any more) ----------
  const pk = new THREE.Group(); g.add(pk);
  slabR(pk, E.parking, 0.25, M.asphalt);
  slab(pk, [[220, 260], [280, 260], [280, 262], [220, 262]], 0.25, M.asphalt);
  for (let x = 222; x <= 280; x += 19) box(pk, x - .2, 272.5, x + .2, 280.2, 0.05, M.whitePaint, 0.25, false);
  box(pk, 222, 272.3, 279.6, 272.6, 0.05, M.whitePaint, 0.25, false);
  [[232, 0xffffff], [252, 0x1f2a44]].forEach(([x, c]) => car(pk, x, 276.4, -Math.PI / 2, c));
  car(pk, 248, 264.5, -Math.PI / 2, 0x111418);                                            // CEO car under the porch
  tag(pk, E.parking, { name: 'Drop-off + visitor parking', status: 'new', size: '60 × 20.5 ft', notes: 'Too shallow (18.5–20.5 ft) for nose-in parking with an aisle, which needs ≈37 ft. So it becomes the head office drop-off under the porte-cochère, 3 parallel spaces along the wall. v14: the solar shed next door is no longer a car park (it is a shade garden + goat and chicken yard), so this strip only holds the CEO car under the porch + 3 more; other staff and visitor cars need a place elsewhere (e.g. the visitor parking by the gate).', round: 14 });
  label(pk, 'Drop-off', 262, 266, 2, '', 2);

  // ---------- v13: head office + owners' flats as ONE building (offices.js); planter along the main road with a gap at the main entrance ----------
  offices.buildOfficeBlock(g);
  const gp = new THREE.Group(); g.add(gp);
  slab(gp, [[220.5, 196.5], [225, 196.5], [225, 262], [220.5, 262]], 0.3, M.grass);
  slab(gp, [[220.5, 242.5], [225, 242.5], [225, 254.5], [220.5, 254.5]], 0.36, M.stone);
  box(gp, 220, 198, 221.4, 242.5, 1.6, M.hedge, 0.2); box(gp, 220, 254.5, 221.4, 260, 1.6, M.hedge, 0.2);
  [[223, 205], [223, 225], [223, 235]].forEach(([x, y]) => box(gp, x - .8, y - .8, x + .8, y + .8, 2.2, M.hedge, 0.3));
  backyard(g, E.backyard);

  // ---------- solar shed (existing): v14 — no cars. Under the panels: shade garden (west half) + goat & chicken yard (east half) ----------
  solarShed(g, E.solar);

  // ---------- organic farms: raised vegetable beds, polytunnel, compost, tool shed ----------
  organicFarm(g, E.farms2, 41, { name: 'Organic farm (north)', tunnel: true, tunnelX: 299, x0: 308, x1: 400, y0: 199, y1: 223.4, extras: 'east', v13n: true });
  organicFarm(g, E.farms, 57, { name: 'Organic farm (south)', tunnel: false, x0: 283, x1: 378, y0: 168, y1: 194, extras: 'east', v13: true });
  box(g, 292, 224.6, 417.7, 226.2, 0.1, M.water, 0.3, false);                                // irrigation channel (khaal)

  // ---------- v11: farmer residence (the old "?" strip), buffalo + goat shed, farmer's path to the branch road ----------
  farmerResidence(g, E.qstrip);
  livestockShed(g, E.livestock);
  farmerPath(g, E.farmerPath);

  // ---------- lawn (v13: the full length of the office building, 60 × 31 ft): apron at the lawn door, path to a fountain, gazebo, benches, beds ----------
  const lw = new THREE.Group(); g.add(lw);
  const LW = E.lawn;
  slabR(lw, LW, 0.3, M.grass);
  slab(lw, [[221.2, 195.2], [278.8, 195.2], [278.8, 198], [221.2, 198]], 0.4, M.slab);                         // apron along the building
  slab(lw, [[246.5, 176.5], [249.5, 176.5], [249.5, 195.2], [246.5, 195.2]], 0.36, M.slab);                    // path from the lawn door
  cyl(lw, 248, 173, 4.6, 0.36, M.slab, 0, 24); cyl(lw, 248, 173, 2.2, 1.6, M.stoneDark, 0.3, 20); cyl(lw, 248, 173, 1.9, 0.15, M.water, 1.9, 20);   // fountain plaza
  [[LW.x1, 165.5, LW.x2, 166.7], [LW.x1, 166.7, LW.x1 + 1.2, 195.2], [LW.x2 - 1.2, 166.7, LW.x2, 195.2]].forEach(([a, b2, c, d]) => box(lw, a, b2, c, d, 1.6, M.hedge, 0.3));
  [[224, 169.5, 238, 172], [258, 169.5, 272, 172], [224, 190, 240, 192.5], [256, 190, 262, 192.5]].forEach(([a, b2, c, d]) => box(lw, a, b2, c, d, 0.9, M.flowers, 0.3, false));
  [[265.6, 177.6], [272.4, 177.6], [265.6, 184.4], [272.4, 184.4]].forEach(([x, y]) => box(lw, x - .25, y - .25, x + .25, y + .25, 7.5, M.wood, 0.3));   // gazebo
  const gz = new THREE.Mesh(new THREE.ConeGeometry(5.6, 2.8, 4), M.roof); gz.rotation.y = Math.PI / 4; gz.position.copy(P(269, 181, 9.2)); gz.castShadow = true; lw.add(gz);
  box(lw, 267, 179.5, 271, 182.5, 0.2, M.wood, 2.4); box(lw, 268.7, 180.8, 269.3, 181.2, 2.4, M.wood, 0.3);
  [[238.5, 173, 1], [257.5, 173, 1], [230, 181, -1]].forEach(([x, y, s2]) => { box(lw, x - 2.5, y - .6, x + 2.5, y + .6, 0.3, M.wood, 1.5); box(lw, x - 2.5, y + s2 * .4, x + 2.5, y + s2 * .6, 1.3, M.wood, 1.8); });
  trees(lw, [[224, 186, 0.48, 0], [224, 176, 0.42, 0], [276, 170, 0.45, 0], [276, 191, 0.4, 0]], 12);
  person(lw, 244, 183, 0.35, M.kurta3); person(lw, 252, 184, 0.35, M.kurta2); person(lw, 268, 181, 0.35, M.kurta);
  tag(lw, LW, { name: 'Lawn', status: 'existing', notes: 'v13: now runs the full length of the office building (x 220–280), since the head office and the owners’ flats are one building. The lawn entrance (south door) opens onto a paved apron; a path leads to a small fountain plaza, with a gazebo, benches, flower beds and shade trees. The owners’ south balconies look over it.', round: 13 });
  label(lw, 'Lawn', 236, 181, 3, '', 2);

  // reserved strip: QC lab + flour truck parking (v16: two bays removed, QC lab moved east into them, corner at the main road rounded)
  const rs = new THREE.Group(); g.add(rs);
  slabR(rs, E.reserved, 0.2, M.concrete);
  // v16: curved corner where the branch road meets the main road (R 25 ft) on the old QC lab spot, landscaped behind the kerb
  const JC = { cx: 245, cy: 159, R: 25 };
  slab(rs, [[220, 134], [250, 134], [250, 165.5], [220, 165.5]], 0.22, M.grass);
  const arcB = []; for (let i = 0; i <= 12; i++) { const a = -Math.PI / 2 - (Math.PI / 2) * i / 12; arcB.push([JC.cx + JC.R * Math.cos(a), JC.cy + JC.R * Math.sin(a)]); }
  slab(rs, [[220, 134], ...arcB], 0.27, M.road);
  arcB.forEach((p, i) => { if (i) segBox(rs, arcB[i - 1], p, 0.6, 0.7, M.slab, 0); });
  trees(rs, [[232, 162, 0.42, 0], [247.5, 146, 0.36, 0]], 66);
  box(rs, 236, 163.5, 248, 164.7, 1.4, M.hedge, 0.22);
  const lab = new THREE.Group(); rs.add(lab);
  const L = E.qcLab;                                                                     // x 252–275 × y 145–161.5, door on the branch-road side
  floorsBlock(lab, L, 1, 12, M.lab, { parapet: 2.5, colSpacing: 11 });
  box(lab, 260, 141.4, 267, 145, 0.4, M.steelBlue, 9);                                  // entrance canopy (south)
  box(lab, 261.5, 144.8, 265.5, 145.2, 7.5, M.glass, 0.2).userData.cut = true;          // door
  // inside (cut-away): instrument bench (north wall), wet bench + sink (west), sample cabinet/oven (east), analyst desk
  box(lab, 253, 158.5, 274, 161, 3, M.labBench, 0.2);
  [[255, 'moisture'], [259, 'gluten'], [263, 'falling no.'], [267, 'NIR'], [271, 'ash']].forEach(([x]) => box(lab, x, 159, x + 2.2, 160.6, 1.4, M.machine, 3.2));
  box(lab, 252.9, 147, 255.5, 158.5, 3, M.labBench, 0.2); box(lab, 253.1, 151, 255.2, 153, 0.4, M.stainless, 3.2);
  box(lab, 271.5, 146.5, 274, 152.5, 6.5, M.steel, 0.2);
  box(lab, 260, 151, 266, 154, 2.6, M.wood, 0.2); person(lab, 263, 150, 0.2, M.kurta2);
  waterTank(lab, 256, 158, 12, 0xe9e9e4); acUnit(lab, 270, 158.5, 12);
  tag(lab, L, { name: 'Flour QC lab', status: 'new', notes: 'v16: moved east into the space of the two truck bays that were removed, so the corner where the branch road meets the main road could be rounded for turning trucks. Outside the mill building as asked; 23 × 16.5 ft, entrance from the branch-road side with a small apron for sample vans. Cut-away shows a guessed fit-out: instrument bench on the north wall (moisture, gluten, falling number, NIR, ash), wet bench with sink, sample cabinet/oven, analyst desk.', round: 16 });
  label(lab, 'QC lab', 263.5, 153.25, 18, '', 1);
  const tp = new THREE.Group(); rs.add(tp);
  slab(tp, [[276, 134.3], [330, 134.3], [330, 165.3], [276, 165.3]], 0.3, M.asphalt);
  for (let x = 276; x <= 329; x += 13) box(tp, x - .2, 136, x + .2, 164.5, 0.05, M.whitePaint, 0.3, false);   // 4 bays, 13 ft wide, full 31 ft depth
  for (let x = 276; x < 328; x += 13) box(tp, x + 3, 163.4, x + 10, 164.2, 0.5, M.slab, 0.3);                 // wheel stops at the lawn side
  [[282.5, 0, true], [308.5, -Math.PI, true], [321.5, 0, false]].forEach(([x, h, load]) => truck(tp, x, 149.6, h, load));
  tag(tp, { x1: 276, y1: 134.3, x2: 330, y2: 165.3 }, { name: 'Flour truck parking', status: 'new', size: '4 bays · 13 × 31 ft', notes: 'Trucks parked square to the mill (nose towards or away from it), using the full 31 ft depth of the reserved strip. v16: cut from 6 to 4 bays — the two western bays became the QC lab’s new spot. Fits 6-wheelers and standard 10-wheelers up to ≈30 ft; longer trailers will not fit. Backing in uses the 24 ft branch road plus the flour mill’s 11 ft apron to turn.', round: 16 });
  label(tp, 'Truck parking · 4', 303, 149.75, 16, '', 1);

  // ---------- silos strip, with an option: four 24 ft wheat silos (≈1,400–1,500 t) ----------
  const si = new THREE.Group(); g.add(si);
  slabR(si, E.silos, 0.25, M.gravel);
  const so2 = new THREE.Group(); so2.userData.option = true; si.add(so2);
  const siloMat = M.cladGrey.clone(); siloMat.map = T_silo(); siloMat.metalness = 0.55; siloMat.roughness = 0.35;
  const XS = [344.5, 371.5, 398.5], Y = 149.75;                                            // v11: 4th silo removed for the farmer's path
  XS.forEach(x => {
    const f = new THREE.Mesh(new THREE.CylinderGeometry(12.9, 12.9, 1.5, 40), M.slab); f.position.copy(P(x, Y, 0.75)); f.receiveShadow = true; so2.add(f);
    const c = new THREE.Mesh(new THREE.CylinderGeometry(12, 12, 40, 40, 1, true), siloMat); c.position.copy(P(x, Y, 21.5)); c.castShadow = true; c.receiveShadow = true; so2.add(c);
    [10, 20, 30].forEach(z => { const ring = new THREE.Mesh(new THREE.CylinderGeometry(12.15, 12.15, 0.5, 40, 1, true), M.steel); ring.position.copy(P(x, Y, 1.5 + z)); so2.add(ring); });
    const roof = new THREE.Mesh(new THREE.ConeGeometry(12.4, 6, 40), M.stainless); roof.position.copy(P(x, Y, 44.5)); roof.castShadow = true; so2.add(roof);
    cylLocal(so2, x, Y, 1.2, 1.5, 47.5);
  });
  box(so2, 333, 148.5, 411, 151, 3, M.steelGreen, 49);                                     // top conveyor gallery
  railRect(so2, 333, 148.5, 411, 151, 52, M.railGreen, 'SNE');
  elevator(so2, 331.5, 140, 58, { platform: 2.5 });
  strut(so2, [331.5, 140, 59], [335, 149.75, 52], 1.1, M.steel, true);
  box(so2, 396, 136, 404, 139, 0.5, M.steelDark, 0); strut(so2, [400, 137.5, 0.5], [400, 137.5, 49], 1.2, M.steelGreen);   // trestle
  strut(so2, [400, 147.5, 50.5], [400, 86, 56], 2.6, M.steelGreen);                        // bridge over the branch road to the mill's cleaning floor
  tag(si, E.silos, { name: 'Silos strip', status: 'review', size: '110 × 31.5 ft', notes: 'Shown as an option (toggle "Options"). v11: the 4th silo is removed so the farmer’s path can run from the farmer residence to the branch road. Now 3 × 24 ft dia × 40 ft steel silos on ring foundations, ≈ 360–380 t each ≈ 1,080–1,140 t of wheat in total, with a top conveyor, 58 ft elevator, and a conveyor bridge over the branch road to the flour mill’s cleaning floor. The freed east end (≈28 ft) carries the path. Side clearance is tight (≈3.75 ft each side), so it needs a structural check.', round: 11 });
  label(si, 'Option: 3 silos ≈1,100 t', 371.5, 149.75, 56, 'review', 2);
  return g;
}

// Organic vegetable farm: raised beds across the plot with mixed crops, marigold borders, optional polytunnel, compost + tool shed.
function organicFarm(parent, r, seed, o) {
  const g = new THREE.Group(); parent.add(g);
  const rnd = rng(seed);
  slabR(g, r, 0.3, M.straw);
  const balls = [], cones = [], boxes = [];
  const crops = ['tomato', 'leafy', 'cabbage', 'onion', 'chilli', 'trellis', 'carrot', 'cauliflower', 'eggplant', 'spinach', 'okra', 'leafy'];
  const greens = ['#5d9b3a', '#6fae45', '#4f8a32', '#82b84f', '#3f7a2a'];
  let i = 0;
  for (let x = o.x0; x + 4.2 <= o.x1; x += 6.5, i++) {
    const L = o.y1 - o.y0, cx = x + 2.1, crop = crops[(i + seed) % crops.length], Z = 1.2;
    box(g, x, o.y0, x + 4.2, o.y1, 0.9, M.bedSoil, 0.3, false);
    box(g, x - .15, o.y0, x, o.y1, 1.0, M.wood, 0.3, false); box(g, x + 4.2, o.y0, x + 4.35, o.y1, 1.0, M.wood, 0.3, false);
    box(g, cx - .05, o.y0 + .3, cx + .05, o.y1 - .3, 0.06, M.tyre, Z, false);                  // drip line
    const along = (step, fn) => { for (let y = o.y0 + step / 2; y < o.y1; y += step) fn(y); };
    const g1 = () => greens[Math.floor(rnd() * greens.length)];
    if (crop === 'leafy' || crop === 'spinach') along(1.1, y => [-1.3, 0, 1.3].forEach(dx => balls.push([cx + dx, y, Z + 0.2, 0.55, 0.3, 0.55, crop === 'spinach' ? '#3f7a2a' : (rnd() < .5 ? '#8cc152' : '#6fae45')])));
    if (crop === 'cabbage') along(1.8, y => [-0.9, 0.9].forEach(dx => balls.push([cx + dx, y, Z + 0.5, 0.8, 0.6, 0.8, rnd() < .5 ? '#9cc77a' : '#b5d69a'])));
    if (crop === 'cauliflower') along(1.8, y => [-0.9, 0.9].forEach(dx => { balls.push([cx + dx, y, Z + 0.4, 0.85, 0.5, 0.85, '#6fae45']); balls.push([cx + dx, y, Z + 0.8, 0.45, 0.3, 0.45, '#f1ead2']); }));
    if (crop === 'onion') along(0.6, y => [-1.4, -0.5, 0.5, 1.4].forEach(dx => cones.push([cx + dx, y, Z, 0.12, 1.3, 0.12, '#3f7a2a'])));
    if (crop === 'carrot') along(0.7, y => [-1.4, -0.5, 0.5, 1.4].forEach(dx => cones.push([cx + dx, y, Z, 0.3, 0.9, 0.3, '#7cc142'])));
    if (crop === 'okra') along(1.6, y => [-0.8, 0.8].forEach(dx => cones.push([cx + dx, y, Z, 0.5, 3.4, 0.5, '#4f8a32'])));
    if (crop === 'tomato' || crop === 'chilli' || crop === 'eggplant') {
      const fruit = { tomato: '#d8352a', chilli: '#c8261e', eggplant: '#4b2a5e' }[crop], hgt = crop === 'tomato' ? 1.6 : 1.0;
      along(2, y => [-0.9, 0.9].forEach(dx => {
        balls.push([cx + dx, y, Z + hgt * 0.6, 0.75, hgt * 0.7, 0.75, g1()]);
        if (crop === 'tomato') boxes.push([cx + dx + 0.3, y, Z, 0.08, 4, 0.08, '#c9a46a']);
        for (let k = 0; k < 3; k++) balls.push([cx + dx + (rnd() - .5), y + (rnd() - .5), Z + hgt * (0.5 + rnd() * 0.6), 0.16, 0.16, 0.16, fruit]);
      }));
    }
    if (crop === 'trellis') {                                                                     // beans / gourds on a bamboo A-frame
      [-0.9, 0.9].forEach(dx => strut(g, [cx + dx, o.y0 + .5, Z], [cx, o.y0 + .5, Z + 5.5], 0.15, M.wood));
      [-0.9, 0.9].forEach(dx => strut(g, [cx + dx, o.y1 - .5, Z], [cx, o.y1 - .5, Z + 5.5], 0.15, M.wood));
      strut(g, [cx, o.y0 + .5, Z + 5.5], [cx, o.y1 - .5, Z + 5.5], 0.12, M.wood);
      along(0.9, y => { balls.push([cx - 0.45, y, Z + 2.8, 0.35, 2.6, 0.5, g1()]); balls.push([cx + 0.45, y, Z + 2.8, 0.35, 2.6, 0.5, g1()]); if (rnd() < .35) balls.push([cx + (rnd() < .5 ? -.7 : .7), y, Z + 1.5 + rnd() * 3, 0.15, 0.15, 0.15, '#f2c230']); });
    }
  }
  // marigold borders along both long edges (companion planting)
  for (let x = o.x0; x < o.x1; x += 1.2) [o.y0 - 0.9, o.y1 + 0.9].forEach(y => balls.push([x, y, 0.8, 0.35, 0.35, 0.35, rnd() < .5 ? '#f08a1c' : '#f2b31c']));
  plants(g, balls, 'ball'); plants(g, cones, 'cone'); plants(g, boxes, 'box');
  if (o.tunnel) {                                                                               // walk-in polytunnel nursery
    const tg = new THREE.CylinderGeometry(6, 6, 24, 20, 1, true, -Math.PI / 2, Math.PI); tg.rotateX(-Math.PI / 2);
    const TX = o.tunnelX ?? 288;
    const tn = new THREE.Mesh(tg, M.polytunnel); tn.position.copy(P(TX, 211.2, 0.3)); tn.renderOrder = 3; g.add(tn);
    for (let k = 0; k < 4; k++) { const ring = new THREE.Mesh(new THREE.TorusGeometry(6, 0.08, 4, 20, Math.PI), M.steel); ring.position.copy(P(TX, 199.5 + k * 7.8, 0.3)); g.add(ring); }
    [[TX - 4, 201, TX - 2, 221], [TX + 2, 201, TX + 4, 221]].forEach(([a, b, c, d]) => { box(g, a, b, c, d, 2.4, M.wood, 0.3); for (let y = b + 0.6; y < d; y += 1.2) balls.push([a + 1, y, 3, 0.3, 0.25, 0.3, '#7cc142']); });
    plants(g, balls.slice(-34), 'ball');
  }
  // compost bins, tool shed, water tank, fruit trees at the east end; workers
  const ex = o.x1 + 3;
  [0, 4, 8].forEach(k => { box(g, ex, o.y0 + k, ex + 3.5, o.y0 + k + 3.5, 3, M.wood, 0.3); box(g, ex + .3, o.y0 + k + .3, ex + 3.2, o.y0 + k + 3.2, 0.3, M.husk, 3.1); });
  box(g, ex, o.y1 - 9, ex + 8, o.y1 - 2, 7.5, M.timber, 0.3); const rf = box(g, ex - .5, o.y1 - 9.5, ex + 8.5, o.y1 - 1.5, 0.3, M.roof, 7.8); rf.rotation.x = 0.08;
  cyl(g, ex + 12, o.y0 + 6, 2, 5, M.tarpGreen, 0.3, 14);
  trees(g, [[ex + 12, o.y1 - 4, 0.38, 0], [ex + 12, o.y0 + 14, 0.38, 0]], seed + 3);
  person(g, o.x0 + 9, (o.y0 + o.y1) / 2, 0.3, M.kurta3); person(g, o.x0 + 40, o.y0 + 5, 0.3, M.kurta2);
  tag(g, r, { name: o.name, status: 'existing', size: `${(r.x2 - r.x1).toFixed(1)} × ${(r.y2 - r.y1).toFixed(1)} ft`, notes: 'v9: organic kitchen farm. Raised beds with drip lines and straw-mulched paths, mixed crops bed by bed (tomatoes on stakes, lettuce, spinach, cabbage, cauliflower, onions, carrots, chillies, aubergine, okra, beans/gourds on bamboo A-frames), marigold borders for pest control, compost bins, tool shed and a water tank' + (o.tunnel ? ', plus a walk-in polytunnel nursery for seedlings.' : '.') + (o.v13 ? ' v13: starts at x 280 again because the lawn now runs the full length of the office building (118 ft, 15 beds); it stops short of the buffalo + goat shed at the east end, whose manure feeds the compost bins.' : '') + (o.v13n ? ' v13: its west 12 ft became the owners’ backyard, so the beds start further east.' : ''), round: (o.v13 || o.v13n) ? 13 : 9 });
  label(g, o.name, (o.x0 + o.x1) / 2, (o.y0 + o.y1) / 2, 7, '', 2);
}

// ---------- v11 helpers: rural furniture + animals ----------
// charpai (woven string bed): long axis along y unless rot
function charpai(parent, x, y, rot = false, z = 0) {
  const [hx, hy] = rot ? [3, 1.5] : [1.5, 3];
  box(parent, x - hx, y - hy, x + hx, y + hy, 0.3, M.wood, z + 1.2);
  box(parent, x - hx + .2, y - hy + .2, x + hx - .2, y + hy - .2, 0.12, M.jute, z + 1.42);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => box(parent, x + a * (hx - .15) - .15, y + b * (hy - .15) - .15, x + a * (hx - .15) + .15, y + b * (hy - .15) + .15, 1.4, M.wood, z));
}
// animals face north at heading 0 (like tractor()); kind 'buffalo' | 'calf' | 'goat'
function animal(parent, x, y, heading, kind, color, lying = false) {
  const g = new THREE.Group(), mat = new THREE.MeshStandardMaterial({ color, roughness: 0.85 });
  const add = (w, h, d, m, px, py, pz) => { const o = new THREE.Mesh(worldBox(w, h, d), m); o.position.set(px, py, pz); o.castShadow = true; g.add(o); return o; };
  const S = { buffalo: [2.6, 2.4, 6.8, 2.3], calf: [1.6, 1.5, 4, 1.6], goat: [1.1, 1.2, 2.8, 1.5] }[kind];
  const [bw, bh, bl, leg] = S, lift = lying ? 0.1 : leg;
  add(bw, bh, bl, mat, 0, lift + bh / 2, 0);                                                     // body
  const hd = kind === 'goat' ? [0.6, 0.8, 1.1] : [bw * 0.45, bh * 0.55, bl * 0.28];
  const head = add(hd[0], hd[1], hd[2], mat, 0, lift + bh * (kind === 'goat' ? 1.05 : 0.7), -bl / 2 - hd[2] * 0.35);
  head.rotation.x = kind === 'goat' ? -0.35 : 0.45;                                              // buffalo heads hang low
  if (!lying) [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => add(bw * 0.22, leg, bw * 0.22, mat, a * bw * 0.32, leg / 2, b * bl * 0.38));
  if (kind === 'buffalo') [-1, 1].forEach(a => { const h = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.13, 6, 10, Math.PI * 1.3), M.stoneDark); h.position.set(a * 0.55, lift + bh * 0.95, -bl / 2 - 0.4); h.rotation.set(0, Math.PI / 2, a * 0.6); g.add(h); });
  if (kind === 'goat') { [-1, 1].forEach(a => add(0.12, 0.5, 0.12, M.stoneDark, a * 0.15, lift + bh * 1.6, -bl / 2 - 0.1)); add(0.15, 0.6, 0.15, mat, 0, lift + bh * 0.9, bl / 2 + 0.1).rotation.x = 0.8; }
  else add(0.15, bh * 0.9, 0.15, mat, 0, lift + bh * 0.45, bl / 2 + 0.05);                       // tail
  g.position.copy(P(x, y, 0.3)); g.rotation.y = heading; parent.add(g); return g;
}
function motorbike(parent, x, y, heading = 0) {
  const g = new THREE.Group(), w = new THREE.CylinderGeometry(0.95, 0.95, 0.35, 14); w.rotateZ(Math.PI / 2);
  [-1.9, 1.9].forEach(z => { const t = new THREE.Mesh(w, M.tyre); t.position.set(0, 0.95, z); g.add(t); });
  const add = (wd, h, d, m, px, py, pz) => { const o = new THREE.Mesh(worldBox(wd, h, d), m); o.position.set(px, py, pz); o.castShadow = true; g.add(o); return o; };
  add(0.7, 0.8, 2.4, M.trimRed, 0, 1.9, 0.1); add(0.6, 0.25, 1.6, M.tyre, 0, 2.45, 0.6); add(2.2, 0.12, 0.12, M.steel, 0, 3.1, -1.6); add(0.15, 1.6, 0.15, M.steel, 0, 2.3, -1.7);
  g.position.copy(P(x, y, 0.3)); g.rotation.y = heading; parent.add(g); return g;
}

// ---------- farmer residence (existing): walled courtyard house typical of rural Punjab ----------
function farmerResidence(parent, Q) {
  const g = new THREE.Group(); parent.add(g);
  slabR(g, Q, 0.25, M.soil);
  slab(g, [[418.6, 240], [439.2, 240], [439.2, 252], [418.6, 252]], 0.3, M.brickFace);          // brick-paved front of the verandah
  // 7 ft compound walls (east side is the site boundary wall); gate on the south onto the farmer's path
  [[Q.x1, Q.y1, Q.x1 + .9, 244], [Q.x1, 248, Q.x1 + .9, Q.y2], [Q.x1, Q.y2 - .9, Q.x2, Q.y2], [Q.x1, Q.y1, 430.5, Q.y1 + .9], [438.5, Q.y1, Q.x2, Q.y1 + .9]].forEach(([a, b, c, d]) => { box(g, a, b, c, d, 7, M.brick); box(g, a - .1, b - .1, c + .1, d + .1, 0.3, M.plaster, 7); });
  [[430.2, 431.2], [437.8, 438.8]].forEach(([a, c]) => box(g, a, Q.y1 - .2, c, Q.y1 + 1.1, 8, M.plaster));   // gate pillars
  box(g, Q.x1 + 1, 244.1, Q.x1 + 1.3, 247.9, 5.5, M.wood, 0.3);                                            // v14: gate into the goat + chicken yard under the solar shed
  box(g, 431.2, 197.6, 431.5, 201.6, 6.2, M.steelGreen, 0.3); box(g, 437.5, 197.6, 437.8, 201.6, 6.2, M.steelGreen, 0.3);   // gate leaves, open inwards
  // two rooms + verandah (single storey, flat roof, parapet); cut-away shows inside
  const R = { x1: 419, y1: 260, x2: 439.2, y2: 279.4 };
  const rm = new THREE.Group(); g.add(rm);
  floorsBlock(rm, R, 1, 10.5, M.plasterBeige, { parapet: 2, parapetMat: M.plasterBeige, colSpacing: 10 });
  [[423, 426], [432, 435]].forEach(([a, c]) => { box(rm, a, 259.8, c, 260.3, 7, M.timber, 0.3).userData.cut = true; });   // doors
  [[426.8, 428.6], [436.2, 438]].forEach(([a, c]) => { box(rm, a, 259.8, c, 260.3, 3.2, M.glass, 3.5).userData.cut = true; });  // windows
  box(rm, 428.9, 260.8, 429.4, 278.6, 9.4, M.plasterBeige, 0.3);                                  // dividing wall
  charpai(rm, 422.5, 270.5, false, 0.3); charpai(rm, 432.5, 270.5, false, 0.3); charpai(rm, 425.5, 275.5, true, 0.3);
  box(rm, 434.5, 276.4, 438.4, 278.5, 6.5, M.steelBlue, 0.3);                                    // steel almari
  box(rm, 419.8, 276.8, 423, 278.6, 1.8, M.trimRed, 0.3);                                       // dowry trunk (peti)
  const tk = new THREE.Group(); tk.userData.cut = true; rm.add(tk); waterTank(tk, 435.5, 270, 10.5);
  // verandah (barandah): slab on four columns, charpai + a stool
  box(g, 419, 252, 439.2, 260, 0.8, M.slab, 0.3);
  box(g, 418.8, 251.8, 439.4, 260, 0.6, M.slab, 9.6);
  [419.5, 426, 432.5, 438.7].forEach(x => box(g, x - .45, 252.2, x + .45, 253.1, 9.3, M.plasterBeige, 0.3));
  charpai(g, 429, 256, true, 1.1); box(g, 423, 255.5, 424.4, 256.9, 1.4, M.wood, 1.1);
  // kitchen (chulha, chimney), toilet/bath, tandoor, hand pump
  block(g, { x1: 419, y1: 226, x2: 428, y2: 236 }, 1, 9, M.plasterBeige, { parapet: 1, parapetMat: M.plasterBeige });
  box(g, 428, 229.5, 428.3, 233.5, 6.8, M.timber, 0.2); cyl(g, 421, 228, 0.6, 4, M.stoneDark, 9, 8);
  block(g, { x1: 419, y1: 217, x2: 425, y2: 223 }, 1, 8.5, M.plasterBeige, { parapet: 1, parapetMat: M.plasterBeige });
  box(g, 425, 218.8, 425.3, 221.4, 6.5, M.timber, 0.2);
  cyl(g, 430.5, 230.5, 1.3, 2.6, M.brickFace, 0.25, 14, 1.0);                                   // tandoor
  box(g, 429, 236.8, 432, 239.8, 0.4, M.concrete, 0.25); cyl(g, 430.5, 238.3, 0.22, 3.6, M.steelGreen, 0.65, 8);   // hand pump (nalka)
  strut(g, [430.5, 238.3, 4.1], [432.2, 238.3, 3.6], 0.15, M.steelGreen); cyl(g, 431.2, 237.6, 0.5, 0.9, M.steelBlue, 0.65, 10);
  // kitchen garden, clothes line, neem tree with a charpai under it, motorbike, hens
  box(g, 419.5, 199, 428.5, 210, 0.5, M.bedSoil, 0.25, false);
  const veg = []; const r = rng(77);
  for (let x = 420.3; x < 428; x += 1.5) for (let y = 199.8; y < 209.6; y += 1.2) veg.push([x, y, 0.8, 0.5, 0.35 + r() * 0.3, 0.5, ['#5d9b3a', '#6fae45', '#3f7a2a'][Math.floor(r() * 3)]]);
  [[434, 203], [436, 205], [433, 211], [427.5, 215]].forEach(([x, y]) => veg.push([x, y, 0.55, 0.4, 0.32, 0.55, r() < .5 ? '#f3efe6' : '#9a5a2c']));   // hens
  plants(g, veg, 'ball');
  [[420.5, 213.5], [429.5, 213.5]].forEach(([x, y]) => box(g, x - .15, y - .15, x + .15, y + .15, 6, M.steel, 0.25));
  box(g, 420.5, 213.45, 429.5, 213.55, 0.05, M.steel, 6);
  [[422, M.kurta], [424.2, M.kurta2], [426.4, M.trimRed], [428, M.kurta3]].forEach(([x, m]) => box(g, x - .7, 213.3, x + .7, 213.7, 2.2, m, 3.8));
  trees(g, [[436, 227, 0.75, 0], [422.5, 247, 0.4, 0]], 88);
  charpai(g, 435, 236, false, 0.25);
  motorbike(g, 434.5, 207, 0.2);
  person(g, 435, 240.5, 0.3, M.kurta); person(g, 427, 231.5, 0.3, M.kurta2);
  tag(g, Q, { name: 'Farmer residence', status: 'existing', notes: 'v11: this strip is the farmer’s actual residence (the tubewell and water-tank guess is dropped). Shown as a typical walled rural house, guessed in the absence of photos: two rooms with a flat roof and a water tank, a verandah (barandah) in front, a paved patch, the kitchen with its chulha and chimney, a tandoor, toilet/bath, hand pump, kitchen garden, hens, clothes line, and a neem tree with a charpai under it. The gate in the south wall opens onto the farmer’s path, which runs past the new buffalo + goat shed and through the freed 4th-silo spot to the branch road. Use Cut-away to look inside the rooms.', round: 11 });
  label(g, 'Farmer residence', 429, 268, 15, '', 1);
  return g;
}

// ---------- buffalo + goat shed: open-fronted, back wall north, mono-pitch GI roof, dry lots in front ----------
function livestockShed(parent, Lr) {
  const g = new THREE.Group(); parent.add(g);
  slabR(g, Lr, 0.3, M.soil);
  box(g, 398.9, 181.5, 429.4, 195.6, 0.5, M.concrete, 0.3);                                       // brick/concrete floor under the roof, sloped to a drain
  box(g, 398.9, 181.3, 429.4, 181.8, 0.15, M.steelDark, 0.8, false);                              // urine drain
  // walls: 4 ft brick on the farm (west) and silo (south) sides, fence + gate on the path side, 9 ft back wall
  box(g, 398, 165.5, 398.9, 196.5, 4, M.brick); box(g, 398, 165.5, 430, 166.4, 4, M.brick);
  box(g, 398, 195.6, 430, 196.5, 9.5, M.brick);
  [[429.4, 166.4, 429.8, 169.5], [429.4, 177.5, 429.8, 195.6]].forEach(([a, b, c, d]) => { box(g, a, b, c, d, 4, M.steelGreen, 0.3); });
  for (let y = 167; y < 196; y += 4) box(g, 429.2, y, 430, y + .5, 4.6, M.steel, 0);
  box(g, 429.5, 169.5, 429.7, 177.5, 4, M.steelGreen, 0.3).rotation.z = 0;                        // gate (fodder trolley in, dung out)
  // roof: posts on the south line, mono-pitch down to the back wall
  [399.5, 407, 414.5, 422, 428.8].forEach(x => box(g, x - .35, 181.6, x + .35, 182.3, 11.3, M.steelDark, 0.3));
  box(g, 398.5, 181.5, 429.8, 182.3, 0.6, M.steelDark, 11.2);
  const rf = new THREE.Mesh(worldBox(32.6, 0.3, 17), M.roof); rf.position.copy(P(414.1, 189.2, 11)); rf.rotation.x = -0.085; rf.castShadow = true; rf.receiveShadow = true; g.add(rf);
  // buffalo side (west): manger along the back wall, water trough, toori heap, dung heap with dung cakes drying on the wall
  box(g, 400, 192.6, 418, 195.6, 2.4, M.concrete, 0.3); box(g, 400.4, 193, 417.6, 195.2, 0.3, M.crop, 2.5);
  box(g, 401, 168, 408, 170.6, 2, M.concrete, 0.3); box(g, 401.4, 168.4, 407.6, 170.2, 0.1, M.water, 2.2);
  const toori = new THREE.Mesh(new THREE.ConeGeometry(3.6, 5, 16), M.straw); toori.position.copy(P(413, 171, 2.8)); toori.castShadow = true; g.add(toori);
  const dung = new THREE.Mesh(new THREE.SphereGeometry(2.6, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), M.soil); dung.scale.y = 0.45; dung.position.copy(P(402.5, 176.5, 0.3)); g.add(dung);
  for (let y = 170; y < 180; y += 1.3) for (let z = 1.2; z < 3.6; z += 1.1) box(g, 398.9, y, 399.1, y + 0.8, 0.8, M.stoneDark, z, false);
  box(g, 418.5, 166.4, 419.1, 195.6, 4.5, M.brick);                                              // divider between buffaloes and goats
  [[402.5, 0x17181a], [407.5, 0x1f1d1c], [412.5, 0x141516]].forEach(([x, c]) => animal(g, x, 188.4, 0, 'buffalo', c));
  animal(g, 415.6, 186, 0.2, 'calf', 0x2a2522);
  animal(g, 409, 176, 1.9, 'buffalo', 0x191a1c, true);
  // goat side (east): raised slatted platform + ramp, hay rack, small paddock
  box(g, 419.8, 186, 428.8, 195.4, 2.4, M.wood, 0.3); for (let x = 420.2; x < 428.6; x += 0.9) box(g, x, 185.8, x + 0.45, 195.4, 0.1, M.timber, 2.7, false);
  const rp = new THREE.Mesh(worldBox(2.4, 0.25, 5), M.wood); rp.position.copy(P(424, 183.6, 1.6)); rp.rotation.x = 0.47; g.add(rp);
  box(g, 420.5, 195, 428.2, 195.5, 2.4, M.steelGreen, 4.8);
  [[421.8, 190, 0.3, 0xf2efe8], [425, 192, -0.4, 0x6b3f22], [427.4, 189, 0.1, 0x1c1b1a]].forEach(([x, y, h, c]) => { const a = animal(g, x, y, h, 'goat', c); a.position.y += 2.6; });
  [[422, 175, 2.2, 0xe9e3d6], [426, 172, -1.1, 0x8a5a32], [424.5, 179, 0.6, 0xf4f1ea], [421, 170, 3.0, 0x2a2724]].forEach(([x, y, h, c]) => animal(g, x, y, h, 'goat', c));
  box(g, 420, 167.5, 424, 169, 1.2, M.concrete, 0.3);                                              // goats' water trough
  person(g, 416, 178, 0.3, M.kurta3);
  tag(g, Lr, { name: 'Buffalo + goat shed', status: 'new', notes: 'v11, on the east end of the south farm, next to the farmer residence and behind (north of) the silos. Open-fronted shed facing south for winter sun: 9 ft brick back wall, mono-pitch GI roof on steel posts, concrete floor with a urine drain. Buffalo side (≈20 × 14 ft covered + dry lot): concrete manger along the back wall, water trough, toori (wheat straw) heap, dung heap with dung cakes drying on the wall. Room for ≈4–5 buffaloes plus a calf at ≈45 sq ft covered each. Goat side (≈10 × 14 ft): raised slatted platform with a ramp and hay rack, small paddock and trough, room for ≈8–10 goats. Gate onto the farmer’s path for fodder trolleys and dung removal; the dung goes to the farm’s compost bins next door. Kept downwind-ish at the far east end, away from the offices and the owners’ apartments.', round: 11 });
  label(g, 'Buffalo + goat shed', 414, 184, 15, '', 1);
  return g;
}

// ---------- farmer's path: residence gate → past the shed → through the freed 4th-silo spot → branch road ----------
function farmerPath(parent, Pr) {
  const g = new THREE.Group(); parent.add(g);
  slabR(g, Pr, 0.38, M.brickFace);
  [[Pr.x1 - .4, Pr.y1, Pr.x1, Pr.y2], [Pr.x2, Pr.y1, Pr.x2 + .4, Pr.y2]].forEach(([a, b, c, d]) => box(g, a, b, c, d, 0.6, M.slab, 0.1, false));   // kerbs
  [[434.5, 150], [434.5, 182]].forEach(([x, y]) => { cyl(g, Pr.x1 - .2, y, 0.2, 12, M.steel, 0, 8); box(g, Pr.x1 - .3, y - .3, Pr.x1 + 1.6, y + .3, 0.4, M.steelDark, 12); });   // lamp posts
  person(g, 434.5, 160, 0.38, M.kurta);
  tag(g, Pr, { name: 'Farmer’s path', status: 'new', notes: 'v11: 8 ft brick-paved path from the farmer residence’s gate south past the buffalo + goat shed, across the silo strip where the 4th silo used to be, to the branch road and the main compound. Wide enough for a motorbike or a small fodder trolley, with a kerb on each side and two lamp posts.', round: 11 });
  label(g, 'Farmer’s path', 434.5, 150, 3, '', 2);
  return g;
}

// ---------- v13: owners' backyard (east of the building, towards the farm): lawn, sitting area, swing, gate into the farm ----------
function backyard(parent, B) {
  const g = new THREE.Group(); parent.add(g);
  slabR(g, B, 0.3, M.grass);
  slab(g, [[277, 221], [281.5, 221], [281.5, 237], [277, 237]], 0.36, M.stone);                                // landing at the residents' door
  slab(g, [[277, 237], [280, 237], [280, 262], [277, 262]], 0.34, M.slab);                                      // path to the drop-off
  slab(g, [[282, 201], [290, 201], [290, 209], [282, 209]], 0.36, M.stone);                                     // sitting area
  box(g, 284.5, 203.5, 287.5, 206.5, 0.2, M.wood, 2.4); box(g, 285.8, 204.8, 286.2, 205.2, 2.4, M.wood, 0.3);
  [[283.2, 205], [288.8, 205], [286, 202.2], [286, 207.8]].forEach(([x, y]) => box(g, x - .6, y - .6, x + .6, y + .6, 1.5, M.wood, 0.36));
  [[283, 214], [289, 214]].forEach(([x, y]) => box(g, x - .2, y - .2, x + .2, y + .2, 7, M.steelDark, 0.3));   // swing (jhoola)
  box(g, 283, 213.8, 289, 214.2, 0.3, M.steelDark, 7); box(g, 284.5, 213.4, 287.5, 214.6, 0.25, M.wood, 2.2);
  [[285, 214, 2.4, 9.3], [287, 214, 2.4, 9.3]].forEach(([x, y, z1, z2]) => strut(g, [x, y, z1], [x, y, z2 - 2.3], 0.06, M.steel));
  box(g, B.x2 - 1, B.y1, B.x2, 208.5, 1.6, M.hedge, 0.3); box(g, B.x2 - 1, 212.5, B.x2, B.y2, 1.6, M.hedge, 0.3);   // hedge with a gate into the farm
  box(g, B.x2 - .9, 208.5, B.x2 - .7, 212.5, 3, M.wood, 0.3);
  box(g, 280, B.y1, B.x2, B.y1 + 1, 1.6, M.hedge, 0.3); box(g, 281.5, B.y2 - 1, B.x2, B.y2, 1.6, M.hedge, 0.3);
  trees(g, [[287, 220.5, 0.45, 0], [279.5, 200, 0.3, 0]], 64);
  person(g, 285.5, 202, 0.36, M.kurta2);
  tag(g, B, { name: 'Owners’ backyard', status: 'new', notes: 'v13: private garden for the owners’ flats on the east side of the building, towards the farm (taken from the west 12 ft of the north organic farm plus the 3 ft strip inside the plot). The residents’ entrance opens onto a stone landing here; a path runs north to the drop-off. Sitting area, a swing (jhoola), shade tree, hedges, and a gate straight into the organic farm.', round: 13 });
  label(g, 'Backyard', 285, 211, 3, '', 2);
  return g;
}

// ---------- v14: existing solar shed — shade garden + goat & chicken yard underneath (no cars) ----------
function solarShed(parent, S) {
  const so = new THREE.Group(); parent.add(so);
  const colY = [227.6, 243.2, 263.8, 279.6], colX = [284, 301, 318, 335, 352, 369, 386, 403, 417];
  colX.forEach(x => colY.forEach(y => box(so, x - .4, y - .4, x + .4, y + .4, 12.5 + (y - S.y1) * 0.12, M.steel)));
  for (let i = 0; i < 4; i++) {                                                                  // panel rows (hidden in Cut-away so you can see underneath)
    const yc = S.y1 + 7 + i * 13.3, len = S.x2 - S.x1 - 2;
    const pnl = new THREE.Mesh(new THREE.BoxGeometry(len, 0.3, 11), M.solar);
    const uv = pnl.geometry.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setXY(k, uv.getX(k) * len, uv.getY(k) * 11);
    pnl.position.copy(P((S.x1 + S.x2) / 2, yc, 15 + i * 1.6)); pnl.rotation.x = 0.33; pnl.castShadow = true; pnl.receiveShadow = true; pnl.userData.cut = true; so.add(pnl);
  }
  box(so, 284, 228.6, 404, 229.2, 0.4, M.steelDark, 11);                                          // cable tray (conduit kept above goat height)
  box(so, 404, 229, 415, 237, 9, M.brick); box(so, 403.6, 228.6, 415.4, 237.4, 0.5, M.slab, 9);    // inverter room
  box(so, 280, 226.5, 283.6, 280.5, 0.32, M.slab, 0);                                             // walkway along the west edge
  // ---- west half: shade garden (x 283.6–350) — raised beds of crops that cope with the panels' shade ----
  const GX = 350;
  slab(so, [[283.6, 226.5], [GX, 226.5], [GX, 280.5], [283.6, 280.5]], 0.28, M.straw);
  const rnd = rng(141), balls = [], cones = [];
  const segs = [[285, 300], [302, 317], [319, 334], [336, 348.6]];
  const beds = [[229.6, 233.1], [235.2, 238.7], [245, 248.5], [250.5, 254], [256, 259.5], [266, 269.5], [271.5, 275]];
  const crops = ['spinach', 'coriander', 'mint', 'lettuce', 'methi', 'saag', 'ginger', 'turmeric'];
  beds.forEach(([y1, y2], bi) => segs.forEach(([x1, x2], si) => {
    box(so, x1, y1, x2, y2, 0.8, M.bedSoil, 0.28, false);
    box(so, x1, (y1 + y2) / 2 - .05, x2, (y1 + y2) / 2 + .05, 0.06, M.tyre, 1.1, false);            // drip line
    const crop = crops[(bi * 3 + si) % crops.length], Z = 1.1;
    const fill = (step, rows, fn) => { for (let x = x1 + step / 2; x < x2; x += step) rows.forEach(dy => fn(x, (y1 + y2) / 2 + dy)); };
    if (crop === 'spinach') fill(0.9, [-1.1, 0, 1.1], (x, y) => balls.push([x, y, Z + .2, .5, .3, .5, '#3f7a2a']));
    if (crop === 'coriander') fill(0.6, [-1.2, -0.4, 0.4, 1.2], (x, y) => balls.push([x, y, Z + .2, .32, .3, .32, '#7cc142']));
    if (crop === 'mint') fill(0.8, [-1, 0, 1], (x, y) => balls.push([x, y, Z + .3, .45, .45, .45, rnd() < .5 ? '#4f9a3a' : '#5fae48']));
    if (crop === 'lettuce') fill(1.2, [-0.8, 0.8], (x, y) => balls.push([x, y, Z + .3, .6, .4, .6, '#9ccc65']));
    if (crop === 'methi') fill(0.5, [-1.2, -0.4, 0.4, 1.2], (x, y) => balls.push([x, y, Z + .15, .25, .25, .25, '#6fae45']));
    if (crop === 'saag') fill(1.1, [-0.8, 0.8], (x, y) => { cones.push([x, y, Z, .45, 1.8, .45, '#4f8a32']); if (rnd() < .3) balls.push([x, y, Z + 1.9, .2, .2, .2, '#f2d230']); });
    if (crop === 'ginger') fill(0.7, [-1, 0, 1], (x, y) => cones.push([x, y, Z, .14, 2.4, .14, '#5d9b3a']));
    if (crop === 'turmeric') fill(1.0, [-0.8, 0.8], (x, y) => cones.push([x, y, Z, .5, 2.8, .5, '#6fae45']));
  }));
  cyl(so, 345, 241, 2.2, 5, M.tarpGreen, 0.3, 14);                                                // water tank for the drip lines
  person(so, 310, 252.3, 0.3, M.kurta3); person(so, 325, 237, 0.3, M.kurta2);
  // fence between garden and yard, gate in the middle
  [[GX, 226.8, GX, 250.5], [GX, 255.5, GX, 280.2]].forEach(([a, b, c, d]) => { panel(so, [a, b], [c, d], 0.3, 4, M.railGreen); for (let y = b; y <= d; y += 6) box(so, a - .15, y - .15, a + .15, y + .15, 4.5, M.wood, 0); });
  box(so, GX - .1, 250.5, GX + .1, 255.5, 4, M.wood, 0.3);
  // ---- east half: goat + chicken yard (x 350–417.7) ----
  slab(so, [[GX, 226.5], [S.x2, 226.5], [S.x2, 280.5], [GX, 280.5]], 0.28, M.grass);
  [[402.5, 227.5, 402.5, 238.5], [402.5, 238.5, 416.5, 238.5]].forEach(([a, b, c, d]) => panel(so, [a, b], [c, d], 0.3, 4, M.railGreen));   // inverter room fenced off
  panel(so, [GX, 226.8], [402.5, 226.8], 0.3, 4, M.railGreen);                                    // keeps animals out of the farm
  // chicken coop on legs with ramp + fenced run
  [[396, 266], [406, 266], [396, 276], [406, 276]].forEach(([x, y]) => box(so, x - .25, y - .25, x + .25, y + .25, 2.2, M.wood, 0.3));
  box(so, 395.5, 265.5, 406.5, 276.5, 5, M.timber, 2.5);
  const cr = new THREE.Mesh(worldBox(12.4, 0.3, 12.4), M.roof); cr.position.copy(P(401, 271, 8.1)); cr.rotation.x = -0.18; cr.castShadow = true; so.add(cr);
  const rp = new THREE.Mesh(worldBox(1.6, 0.15, 5), M.wood); rp.position.copy(P(398, 263.2, 1.4)); rp.rotation.x = 0.5; so.add(rp);
  [[[391, 258], [411, 258]], [[391, 258], [391, 279.5]], [[411, 258], [411, 279.5]]].forEach(([a, b]) => panel(so, a, b, 0.3, 4.5, M.railGreen));
  box(so, 392, 259, 394, 260.5, 0.8, M.steelBlue, 0.3); cyl(so, 408, 260, 0.7, 1.2, M.steelBlue, 0.3, 10);   // feeder + drinker
  // hay rack, water trough
  box(so, 356, 270, 366, 271, 4, M.wood, 0.3); box(so, 356.4, 270.1, 365.6, 270.9, 2.6, M.straw, 1.2);
  box(so, 356, 231, 363, 233.5, 1.8, M.concrete, 0.3); box(so, 356.4, 231.4, 362.6, 233.1, 0.1, M.water, 2);
  // goats + free-range hens
  [[364, 262, 0.4, 0xf2efe8], [372, 249, -1.2, 0x6b3f22], [380, 266, 2.6, 0x1c1b1a], [361, 240, 1.1, 0xe9e3d6], [388, 241, -0.4, 0x8a5a32], [374, 233, 2.2, 0xf4f1ea]].forEach(([x, y, h, c]) => animal(so, x, y, h, 'goat', c));
  const hens = [], hr = rng(142);
  for (let k = 0; k < 26; k++) {
    const x = 354 + hr() * 50, y = 240 + hr() * 38; if (x > 390 && y > 257) continue;
    const c = ['#f3efe6', '#9a5a2c', '#5a3a22', '#f3efe6'][k % 4];
    hens.push([x, y, 0.85, 0.5, 0.45, 0.65, c]); hens.push([x, y - 0.5, 1.35, 0.22, 0.22, 0.22, c]); hens.push([x, y - 0.65, 1.55, 0.08, 0.12, 0.12, '#d0281e']);
  }
  plants(so, balls, 'ball'); plants(so, cones, 'cone'); plants(so, hens, 'ball');
  person(so, 400, 250, 0.3, M.kurta);
  tag(so, S, { name: 'Solar shed · shade garden + goat & chicken yard', status: 'existing', size: '137.7 × 54 ft', area: '7,436 sq ft',
    notes: 'v14: no cars under the solar shed. West half (≈66 × 54 ft): a shade garden of raised beds with drip lines, growing crops that cope with the panels’ shade — spinach (palak), coriander (dhania), mint (podina), lettuce, methi, mustard greens (saag), ginger (adrak) and turmeric (haldi). East half (≈68 × 54 ft): a fenced yard for goats and free-range hens on grass, with a hay rack, water trough and a chicken coop on legs with a fenced run (≈30–40 birds). A gate in the farmer residence’s wall opens straight into the yard so the farmer can look after them, and a gate links the yard and the garden. The shade keeps soil, plants and animals cooler in a 45 °C summer and cuts water loss. Panel-washing water can run onto the beds. The inverter room is fenced off, all cables stay in conduit above goat height (goats chew), and nothing climbable is left by the columns. Cut-away hides the panels so you can see underneath. Note: the ≈24-car parking this was going to give is gone.', round: 14 });
  label(so, 'Solar shed · shade garden', 316, 253.5, 22, '', 1);
  label(so, 'Goats + hens', 383, 253.5, 22, '', 1);
  return so;
}
