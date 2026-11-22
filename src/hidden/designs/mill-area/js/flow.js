// Material flow overlay: truck routes on the ground, process hops as arcs above roofs, animated chevrons.
import * as THREE from 'three';
import { P } from './lib.js';

const COL = { paddy: 0xf0a020, rice: 0x2fbf71, husk: 0x9b6a35, steam: 0x8fd3ff, wheat: 0xd8c46a, flour: 0xe35d7a };
export const FLOW_LEGEND = [['Paddy', COL.paddy], ['Rice', COL.rice], ['Husk', COL.husk], ['Steam', COL.steam], ['Wheat', COL.wheat], ['Flour', COL.flour]];

const runners = [];

function polyCurve(pts, h) {
  const cp = new THREE.CurvePath();
  for (let i = 0; i < pts.length - 1; i++) cp.add(new THREE.LineCurve3(P(...pts[i], h), P(...pts[i + 1], h)));
  return cp;
}
function line3(pts) {
  const cp = new THREE.CurvePath();
  for (let i = 0; i < pts.length - 1; i++) cp.add(new THREE.LineCurve3(P(...pts[i]), P(...pts[i + 1])));
  return cp;
}
function arc(a, b, ha, hb, peak) {
  const mid = P((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, peak);
  return new THREE.QuadraticBezierCurve3(P(...a, ha), mid, P(...b, hb));
}
function add(group, curve, color, r = 0.9, n = 6, speed = 0.06) {
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.55, depthWrite: false });
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(24, Math.round(curve.getLength() / 3)), r, 8, false), mat);
  tube.renderOrder = 4; group.add(tube);
  const cg = new THREE.ConeGeometry(r * 2.6, r * 6, 12); 
  const cm = new THREE.MeshBasicMaterial({ color });
  const L = curve.getLength();
  for (let i = 0; i < n; i++) {
    const c = new THREE.Mesh(cg, cm); c.renderOrder = 5; group.add(c);
    runners.push({ c, curve, t: i / n, v: speed * 100 / L });
  }
}

export function build(scene) {
  const g = new THREE.Group(); g.name = 'flow'; scene.add(g);
  // v20: the weighbridge is at the south end of the main road. Every truck crosses it southbound, then loops back one-way:
  // west along the back lane behind finished goods, north up the west lane, east along the east–west lane, north on the main road.
  const WEIGH_LOOP = [[213, 100], [209.5, 92], [209.5, 26], [200, 12], [180, 8], [123, 8], [102, 18], [101, 106], [112, 119], [190, 119]];
  // inbound paddy truck: gate -> south on the main road -> weighbridge -> loop back -> north on the main road -> drying loop -> paddy store door
  add(g, polyCurve([[207.5, 610], [213, 580], ...WEIGH_LOOP, [201, 130], [201, 390], [190, 402], [51, 402], [51, 300], [44, 300]], 2.2), COL.paddy, 1.1, 22, 0.09);
  // outbound rice truck: apron -> east–west lane -> south onto the weighbridge -> loop back -> north on the main road -> gate
  add(g, polyCurve([[186, 40], [186, 96], [198, 106], ...WEIGH_LOOP.slice(1), [201, 130], [201, 560], [203, 590], [205, 612]], 2.2), COL.rice, 1.1, 20, 0.09);
  // process path: store -> intake conveyor -> elevators/pre-cleaner -> tower -> dryer -> tempering bins -> milling hall -> finished goods
  add(g, polyCurve([[37, 172], [41.8, 160], [41.8, 94], [39.5, 92]], 14), COL.paddy, 0.8, 5);
  add(g, arc([38.5, 91.5], [22, 106], 50, 61, 76), COL.paddy, 0.8, 3);    // intake -> top bin
  add(g, arc([24, 118], [22, 138], 44, 62, 68), COL.paddy, 0.8, 3);       // tower -> dryer
  add(g, arc([22, 145], [14, 157], 61, 38, 64), COL.paddy, 0.8, 3);       // dryer -> tempering bins
  add(g, polyCurve([[39, 157], [47, 157]], 30), COL.paddy, 0.8, 2);        // bins -> hall
  add(g, arc([48, 152], [84, 56], 30, 20, 40), COL.rice, 0.8, 5);         // through the milling line
  add(g, arc([90, 60], [126, 40], 16, 14, 30), COL.rice, 0.8, 3);         // hall -> finished goods
  add(g, arc([165, 40], [186, 40], 14, 10, 22), COL.rice, 0.8, 3);        // FG -> truck
  add(g, arc([68, 44], [56, 30], 27, 20, 32), COL.husk, 0.7, 3);          // hall -> husk store
  add(g, arc([46, 24], [20, 40], 10, 12, 20), COL.husk, 0.7, 3);          // husk -> boiler
  add(g, polyCurve([[20, 46], [20, 100]], 15.5), COL.steam, 0.7, 5);      // steam main -> saila
  // flour mill (one building): bagged wheat unloaded on the north apron -> intake pit -> elevator -> cleaning floor;
  // flour by pneumatic line to the packing hall -> dispatch from the west strip -> weighbridge (end of the main road) -> loop back -> gate
  add(g, polyCurve([[207.5, 610], [213, 580], ...WEIGH_LOOP.slice(0, -1), [226, 124], [300, 124], [318, 105], [330, 104.5]], 2.2), COL.wheat, 1.1, 18, 0.09);
  add(g, arc([340, 99], [356, 92], 6, 4, 10), COL.wheat, 0.8, 2);
  add(g, arc([356, 92], [366, 80], 4, 62, 84), COL.wheat, 0.8, 3);
  add(g, line3([[372, 52, 60], [372, 52, 8], [362, 40, 31], [296, 40, 31], [290, 36, 8]]), COL.flour, 0.8, 6);
  add(g, polyCurve([[239, 32], [229.5, 40], [229.5, 102], [218, 101], ...WEIGH_LOOP.slice(1), [201, 130], [201, 560], [203, 590], [205, 612]], 2.2), COL.flour, 1.1, 20, 0.09);
  g.visible = false;
  return g;
}

const up = new THREE.Vector3(0, 1, 0);
export function tick(dt) {
  for (const r of runners) {
    r.t = (r.t + r.v * dt) % 1;
    r.curve.getPointAt(r.t, r.c.position);
    r.c.quaternion.setFromUnitVectors(up, r.curve.getTangentAt(r.t).normalize());
  }
}
