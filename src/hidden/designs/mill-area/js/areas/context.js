// Context: farmland, Sargodha–Gujrat Road, boundary wall + gate, compound ground, internal roads, weighbridge.
import * as THREE from 'three';
import { SITE, ytop } from '../site.js';
import { M, P, box, boxR, slab, slabR, segBox, label, tag, trees, truck, car, rectPts, roundRectPts, rng, cyl, hopper } from '../lib.js';
import { YARD_R } from './storage.js';

export function build(scene) {
  const g = new THREE.Group(); g.name = 'context'; scene.add(g);

  // farmland all around
  const fg = new THREE.PlaneGeometry(6000, 6000); fg.rotateX(-Math.PI / 2);
  const uv = fg.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 6000, uv.getY(i) * 6000);
  const farm = new THREE.Mesh(fg, M.fields); farm.position.set(220, -0.3, -290); farm.receiveShadow = true; g.add(farm);

  // Sargodha–Gujrat Road, parallel to the slanted frontage
  const u = [220 / 228.166, 60.5 / 228.166], n = [-u[1], u[0]];
  const at = (t, off) => [0 + u[0] * t + n[0] * off, 528 + u[1] * t + n[1] * off];
  slab(g, [at(-900, 10), at(1600, 10), at(1600, 54), at(-900, 54)], 0.1, M.soil, -0.25);        // verge / shoulders
  slab(g, [at(-900, 18), at(1600, 18), at(1600, 46), at(-900, 46)], 0.2, M.asphalt, -0.2);        // 28 ft carriageway
  const dash = new THREE.InstancedMesh(new THREE.BoxGeometry(10, 0.1, 0.6), M.whitePaint, 84);
  const mm = new THREE.Matrix4(), q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.atan2(u[1], u[0]));
  for (let i = 0; i < 84; i++) { const [x, y] = at(-900 + i * 30, 32); mm.compose(P(x, y, 0.06), q, new THREE.Vector3(1, 1, 1)); dash.setMatrixAt(i, mm); }
  dash.receiveShadow = true; g.add(dash);
  label(g, 'Sargodha – Gujrat Road', ...at(-60, 32), 1, 'road', 1);
  // gate apron joining road to gate
  const gA = [195, ytop(195)], gB = [220, 588.5];
  slab(g, [gA, gB, [gB[0] + n[0] * 20 + 10, gB[1] + n[1] * 20], [gA[0] + n[0] * 20 - 10, gA[1] + n[1] * 20]], 0.2, M.road, -0.15);

  // compound ground
  slab(g, SITE.boundary, 0.1, M.soil, -0.1);

  // boundary wall (9 ft brick, plastered coping); gate gap on the frontage at x 195–220
  const wallG = new THREE.Group(); wallG.name = 'wall'; g.add(wallG);
  const B = SITE.boundary, segs = [];
  for (let i = 0; i < B.length; i++) segs.push([B[i], B[(i + 1) % B.length]]);
  // frontage wall (today) — replaced by the pump forecourt and shop row in the front-zone option
  const fw = new THREE.Group(); fw.name = 'frontageWall'; fw.userData.optionOff = true; wallG.add(fw);
  segs.forEach(([a, b]) => {
    if (a[0] === 220 && a[1] === 588.5) { segBox(fw, [0, 528], gA, 1.1, 9, M.brick); return; }
    segBox(wallG, a, b, 1.1, 9, M.brick);
  });
  segs.forEach(([a, b]) => { if (!(a[0] === 220 && a[1] === 588.5)) segBox(wallG, a, b, 1.5, 0.6, M.plaster, 9); });
  segBox(fw, [0, 528], gA, 1.5, 0.6, M.plaster, 9);
  // pilasters every ~20 ft
  segs.forEach(([a, b]) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.floor(L / 20), front = a[0] === 220 && a[1] === 588.5;
    for (let i = 1; i < k; i++) { const t = i / k, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t; if (front && x > 190) continue; box(front ? fw : wallG, x - 0.9, y - 0.9, x + 0.9, y + 0.9, 9.8, M.brick); }
  });
  // ---- main gate: 19 ft pillars, arch beam with the name board, open steel leaves, lamps ----
  const gateG = new THREE.Group(); gateG.name = 'gate'; g.add(gateG);
  [gA, gB].forEach(([x, y]) => { box(gateG, x - 1.8, y - 1.8, x + 1.8, y + 1.8, 19, M.brick); box(gateG, x - 2.2, y - 2.2, x + 2.2, y + 2.2, 1, M.plaster, 19); cyl(gateG, x, y, 0.7, 1.6, M.whitePaint, 20, 10); });
  segBox(gateG, gA, gB, 1.4, 3.6, M.plaster, 15.4);
  const fa = Math.atan2(gB[1] - gA[1], gB[0] - gA[0]);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(23.5, 3), M.gateSign);
  sign.position.copy(P((gA[0] + gB[0]) / 2 + n[0] * 0.75, (gA[1] + gB[1]) / 2 + n[1] * 0.75, 17.2)); sign.rotation.y = Math.atan2(n[0], -n[1]); gateG.add(sign);
  const leaf = (x, y, ang) => { const l = new THREE.Mesh(new THREE.BoxGeometry(12, 8, 0.4), M.steelGreen); l.geometry.translate(6, 4, 0); l.position.copy(P(x, y, 0.5)); l.rotation.y = ang; l.castShadow = true; gateG.add(l); };
  leaf(gA[0] + 1.8, gA[1], fa - 1.35); leaf(gB[0] - 1.8, gB[1], fa + Math.PI + 1.35);
  // boom barrier + guard room just inside, CCTV/light pole, painted speed breaker
  box(gateG, 195.6, 568.5, 197, 570, 4, M.yellow);
  for (let i = 0; i < 7; i++) box(gateG, 197 + i * 3, 569, 200 + i * 3, 569.5, 0.4, i % 2 ? M.whitePaint : M.trimRed, 3.6);
  box(gateG, 183, 560, 193.5, 570.5, 9, M.house); box(gateG, 182.6, 559.6, 193.9, 570.9, 0.6, M.slab, 9);
  box(gateG, 193.5, 563, 193.8, 567.5, 4, M.glass, 3.5);
  cyl(gateG, 198, 576, 0.3, 22, M.steel, 0, 8); box(gateG, 197, 575.5, 200, 576.5, 0.8, M.steelDark, 22);
  for (let i = 0; i < 6; i++) box(gateG, 195.5 + i * 4, 556, 197.5 + i * 4, 558, 0.15, i % 2 ? M.whitePaint : M.steelDark, 0.25);
  tag(gateG, null, { name: 'Main gate', status: 'existing', size: '25 ft clear (30 ft max)', notes: 'On the road frontage at x 195–220, two-way. Round 6 detail (guessed): 19 ft pillars with an arch beam and name board, open steel leaves, boom barrier and guard room just inside, CCTV/light pole, painted speed breaker.', round: 6 });
  label(gateG, 'Main gate', 207.5, 588, 25, 'major', 1);

  // ---- internal roads ----
  const roads = new THREE.Group(); roads.name = 'roads'; g.add(roads);
  slab(roads, [[195.5, 0], [219.5, 0], [219.5, 588.2], [195.5, ytop(195.5)]], 0.25, M.road);
  slab(roads, [[195, 0], [195.5, 0], [195.5, ytop(195.5)], [195, ytop(195)]], 0.3, M.grass);
  slab(roads, [[219.5, 0], [220, 0], [220, 280.5], [219.5, 280.5]], 0.3, M.grass);
  const cl = new THREE.InstancedMesh(new THREE.BoxGeometry(0.5, 0.1, 8), M.whitePaint, 40);
  for (let i = 0; i < 40; i++) { mm.compose(P(207.5, 8 + i * 14.5, 0.3), new THREE.Quaternion(), new THREE.Vector3(1, 1, 1)); cl.setMatrixAt(i, mm); }
  roads.add(cl);
  slabR(roads, SITE.roads.branch, 0.25, M.road);
  // drying loop ring (16 ft) around the yard
  const o = SITE.roads.loopOuter, iy = SITE.dryingYard;
  slab(roads, rectPts(o), 0.22, M.road, 0, [roundRectPts(iy, YARD_R).reverse()]);                   // v15: yard corners rounded (R 24 ft) so trucks turn easily
  // one-way arrows painted on the loop
  const arrowShape = new THREE.Shape([[-1.2, -4], [1.2, -4], [1.2, 0], [3, 0], [0, 4.5], [-3, 0], [-1.2, 0]].map(([a, b]) => new THREE.Vector2(a, b)));
  const ag = new THREE.ShapeGeometry(arrowShape); ag.rotateX(-Math.PI / 2);
  const arrows = [[150, 402, 'W'], [90, 402, 'W'], [51, 340, 'S'], [51, 250, 'S'], [100, 177, 'E'], [160, 177, 'E']];
  arrows.forEach(([x, y, d]) => { const a = new THREE.Mesh(ag, M.whitePaint); a.position.copy(P(x, y, 0.27)); a.rotation.y = { N: 0, W: Math.PI / 2, S: Math.PI, E: -Math.PI / 2 }[d]; roads.add(a); });
  tag(roads, null, { name: 'Internal roads', status: 'infra', size: 'Main 24 ft · branch 24 ft · drying loop 16 ft', notes: 'Main road x 195–220 from the gate to the south wall, two-way. Branch road to the flour mill at y 110–134. Drying loop runs one-way: in at the top right, west along the top, south down the shed side, east along the bottom.', round: 3 });
  label(roads, 'Main road · 24 ft', 207.5, 360, 1, 'road', 2);
  label(roads, 'Branch road', 245, 122, 1, 'road', 2);
  label(roads, 'Drying loop · one-way 16 ft', 115, 402, 1, 'road', 2);

  // weighbridge bay + platform + cabin
  const wb = new THREE.Group(); wb.name = 'weighbridge'; g.add(wb);
  slabR(wb, SITE.roads.weighBay, 0.25, M.concrete);
  const pf = SITE.roads.weighbridge;
  boxR(wb, pf, 0.9, M.steel, 0, false);
  box(wb, pf.x1 - 0.6, pf.y1, pf.x1, pf.y2, 1.0, M.yellow); box(wb, pf.x2, pf.y1, pf.x2 + 0.6, pf.y2, 1.0, M.yellow);
  for (let y = pf.y1; y <= pf.y2; y += 10) box(wb, pf.x1 + 0.2, y - 0.15, pf.x2 - 0.2, y + 0.15, 0.95, M.steelDark, 0, false);
  const cab = { x1: 165.5, y1: 468, x2: 172.5, y2: 482 };
  const c = new THREE.Mesh(new THREE.BoxGeometry(7, 10, 14), [M.cabin, M.cabin, M.slab, M.slab, M.cabin, M.cabin]);
  c.position.copy(P(169, 475, 5)); c.castShadow = true; wb.add(c);
  box(wb, cab.x1 - 1, cab.y1 - 1, cab.x2 + 1, cab.y2 + 1, 0.5, M.trimRed, 10);
  tag(wb, SITE.roads.weighBay, { name: 'Weighbridge bay', status: 'existing', notes: 'Platform 11 × 60 ft at x 175–186 × y 445–505, operator cabin on the west side. Every truck is weighed in and out.', round: 6 });
  label(wb, 'Weighbridge', 180.5, 475, 4, '', 2);
  truck(wb, 180.5, 482, 0, true);

  // ---- trees: boundary rows + outside shelter belts (shisham / eucalyptus) ----
  const r = rng(21), list = [];
  for (let t = -400; t < 1500; t += 26) { const [x, y] = at(t, 66 + r() * 6); list.push([x, y, 1.0, r() < 0.5 ? 1 : 0]); }
  for (let y = -60; y < 520; y += 30) list.push([-40 - r() * 8, y, 1.1, 1]);
  for (let x = -40; x < 480; x += 32) list.push([x, -40 - r() * 8, 1, r() < 0.6 ? 1 : 0]);
  for (let y = -40; y < 300; y += 30) list.push([480 + r() * 8, y, 1, 0]);
  for (let x = 240; x < 480; x += 34) list.push([x, 320 + r() * 8, 1, 1]);
  for (let y = 300; y < 610; y += 34) list.push([260 + r() * 8, y, 1, r() < .5 ? 1 : 0]);
  // scattered farm trees
  for (let i = 0; i < 90; i++) { const x = -900 + r() * 2200, y = -900 + r() * 2200; if (x > -60 && x < 500 && y > -60 && y < 680) continue; if (x > 470 && x < 1300 && y > 500 && y < 950) continue; list.push([x, y, 0.9 + r() * 0.5, r() < 0.4 ? 1 : 0]); }
  trees(g, list);

  // neighbouring building behind the saila plant (seen in Saad's photos; assumed to be outside the west wall)
  const nb = new THREE.Group(); nb.name = 'neighbour'; g.add(nb);
  const grey = M.brick.clone(); grey.color = new THREE.Color(0xb9b6b2);
  box(nb, -64, 62, -2, 138, 26, grey); box(nb, -64.5, 61.5, -1.5, 138.5, 1, M.plaster, 26);
  for (let i = 0; i < 6; i++) { cyl(nb, -12, 96 + i * 6, 2, 5, M.whitePaint, 27, 16); hopper(nb, -12, 96 + i * 6, 24.5, 2.8, 2.8, 0.6, 0.6, 2.5, M.whitePaint); }
  segBox(nb, [-12, 92], [-12, 134], 1.2, 1.2, M.steelBlue, 33);
  box(nb, -30, 140, -4, 160, 16, M.brick);
  tag(nb, null, { name: 'Neighbouring building (assumed)', status: 'review', size: '≈62 × 76 ft, ≈26 ft high (estimated)', notes: 'The grey brick building with a row of white cyclones seen behind the saila plant in the photos. Assumed to be a neighbour outside the west wall; size and position are estimates.', round: 3 });

  // road traffic for scale
  truck(g, ...at(430, 25), Math.atan2(u[1], u[0]) - Math.PI / 2, true);
  car(g, ...at(80, 39), Math.atan2(u[1], u[0]) + Math.PI / 2, 0xffffff);
  car(g, ...at(330, 39), Math.atan2(u[1], u[0]) + Math.PI / 2, 0x2b2f36);
  return g;
}
