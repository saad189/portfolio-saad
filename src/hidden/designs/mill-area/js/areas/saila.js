// Saila (parboiling) plant — rebuilt from Saad's site photos (21 Nov 2026).
// Plot x 0–43.2 × y 84.5–169 against the west boundary wall. Photos were taken from the east,
// so south = left in the photos: elevators + pre-cleaner → steel tower with soak tanks → blower → column dryer → tempering bins.
import * as THREE from 'three';
import { SITE } from '../site.js';
import { M, P, box, boxR, slabR, cyl, strut, panel, railRect, platform, stairFlight, hopper, coneTank, elevator, person, label, tag } from '../lib.js';

const GREEN = () => M.steelGreen, BLUE = () => M.steelBlue;

export function build(parent) {
  const g = new THREE.Group(); g.name = 'saila'; parent.add(g);
  const PAD = 2;                                   // raised concrete pad, ~2 ft above yard

  // ---------- pad ----------
  slabR(g, { x1: 0.6, y1: 85, x2: 43, y2: 168 }, PAD, M.concrete);
  box(g, 42.6, 85, 43, 168, PAD + 0.15, M.slab, 0, false);                              // pad edge kerb

  // ---------- steel process tower ----------
  const XS = [12, 23, 34], YS = [100, 112, 124], BASE = PAD + 2.5;
  const LV = [BASE, 15, 30, 40, 52];                                                     // tier levels (ft)
  XS.forEach(x => YS.forEach(y => {
    box(g, x - 1.4, y - 1.4, x + 1.4, y + 1.4, 2.5, M.pedestal, PAD);                   // concrete pedestals
    box(g, x - 0.65, y - 0.65, x + 0.65, y + 0.65, 52 - BASE, GREEN(), BASE);            // green H columns
  }));
  // horizontal beams at each level
  LV.slice(1).forEach(z => {
    YS.forEach(y => strut(g, [12, y, z], [34, y, z], 0.7, BLUE()));
    XS.forEach(x => strut(g, [x, 100, z], [x, 124, z], 0.7, BLUE()));
  });
  // X-bracing on the four outer faces, every bay and tier
  for (let t = 0; t < LV.length - 1; t++) {
    const z0 = LV[t] + (t === 0 ? 1 : 0), z1 = LV[t + 1];
    [100, 124].forEach(y => { for (let i = 0; i < 2; i++) { strut(g, [XS[i], y, z0], [XS[i + 1], y, z1], 0.4, BLUE()); strut(g, [XS[i + 1], y, z0], [XS[i], y, z1], 0.4, BLUE()); } });
    [12, 34].forEach(x => { for (let i = 0; i < 2; i++) { strut(g, [x, YS[i], z0], [x, YS[i + 1], z1], 0.4, BLUE()); strut(g, [x, YS[i + 1], z0], [x, YS[i], z1], 0.4, BLUE()); } });
  }
  // platforms
  platform(g, 23, 98, 37, 126, 15, BLUE(), 'SEN');                                      // lower walkway (east half)
  platform(g, 10, 98, 37, 126, 30, BLUE(), 'SENW');                                      // main deck carrying the soak tanks
  platform(g, 11, 99, 35, 125, 40, BLUE(), 'SENW');                                      // upper vessels deck
  // four stainless soak tanks (conical bottoms hang below the main deck)
  [[17.5, 106], [28.5, 106], [17.5, 118], [28.5, 118]].forEach(([x, y]) => coneTank(g, x, y, 14, 4.3, 8, 9));
  // two upper stainless vessels
  [[17.5, 112], [28.5, 112]].forEach(([x, y]) => coneTank(g, x, y, 33.5, 2.6, 5, 4));
  // blue-clad top bin with twin pyramid hoppers + decorative orange railing
  hopper(g, 23, 106, 44, 23, 12, 2, 2, 8, BLUE()); hopper(g, 23, 118, 44, 23, 12, 2, 2, 8, BLUE());
  boxR(g, { x1: 11, y1: 99, x2: 35, y2: 125 }, 7, M.cladBlue, 52);
  box(g, 10.8, 98.8, 35.2, 125.2, 0.5, M.steelDark, 59);
  railRect(g, 10.8, 98.8, 35.2, 125.2, 59.5, M.railDeco, 'SENW', 3.6);
  // chutes from hoppers down to the vessels
  [[17.5, 112], [28.5, 112]].forEach(([x, y]) => strut(g, [x, y, 44], [x, y, 40.5], 0.9, M.stainless, true));

  // zigzag stair up the east face, with landings
  const SX = 39;
  stairFlight(g, [SX, 99.5, PAD], [SX, 112.5, 15]);  platform(g, 37, 112.5, 40.6, 117, 15, BLUE(), 'SEN');
  stairFlight(g, [SX, 117, 15], [SX, 102, 30]);      platform(g, 37, 98, 40.6, 102, 30, BLUE(), 'SEN');
  stairFlight(g, [SX, 102, 30], [SX, 112.5, 40]);    platform(g, 35, 112.5, 40.6, 117, 40, BLUE(), 'SEN');
  stairFlight(g, [SX, 117, 40], [SX, 102, 52]);      platform(g, 35, 98.5, 40.6, 102, 52, BLUE(), 'SEN');
  panel(g, [35.3, 99.2], [35.3, 100.8], 52, 7.5, M.ladder);                                // ladder to the top deck

  // ---------- bucket elevators ----------
  const e2 = elevator(g, 14, 94.5, 70);                                                   // tall: feeds the top bin
  strut(g, [14, 95.5, e2 - 1.5], [19, 104, 59.5], 1.1, M.steel, true);
  const e1 = elevator(g, 38.5, 91.5, 46);                                                 // short: feeds the pre-cleaner
  strut(g, [37.5, 91.5, e1 - 1.5], [31, 92, 15], 1.1, M.steel, true);

  // ---------- pre-cleaner on a blue frame ----------
  const pc = { x1: 23, y1: 87.5, x2: 33, y2: 96.5 };
  [[23.4, 87.9], [32.6, 87.9], [23.4, 96.1], [32.6, 96.1]].forEach(([x, y]) => box(g, x - .3, y - .3, x + .3, y + .3, 8.5, BLUE(), PAD));
  strut(g, [23.4, 87.9, PAD + 0.5], [32.6, 87.9, PAD + 8], 0.3, BLUE()); strut(g, [23.4, 96.1, PAD + 0.5], [32.6, 96.1, PAD + 8], 0.3, BLUE());
  boxR(g, pc, 1, BLUE(), PAD + 8.5);
  for (let i = 0; i < 4; i++) { const tr = box(g, pc.x1 + 0.5, pc.y1 + 0.6, pc.x2 - 0.5, pc.y2 - 0.6, 0.45, M.whitePaint, PAD + 9.6 + i * 0.9); tr.rotation.z = 0.08; }
  box(g, 27, 89, 33, 95, 3.2, M.steel, PAD + 13.2);                                      // feed box
  strut(g, [24, 94.5, PAD + 9], [15.5, 94.5, PAD + 1.5], 0.9, M.steel, true);              // chute to the tall elevator boot

  // ---------- hot-air blower + duct into the dryer ----------
  box(g, 30, 125.5, 39, 133.5, 2.2, M.pedestal, PAD);
  const vol = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.4, 2.8, 28), BLUE()); vol.rotation.z = Math.PI / 2; vol.position.copy(P(33, 129.5, PAD + 5.8)); vol.castShadow = true; g.add(vol);
  box(g, 31.6, 129.5, 34.4, 135.5, 3.4, BLUE(), PAD + 6.5);                               // volute outlet
  box(g, 35, 127.6, 38.6, 131.4, 3.2, M.steelGreen, PAD + 2.2);                           // motor stool
  const mot = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 3, 16), M.motor); mot.rotation.z = Math.PI / 2; mot.position.copy(P(36.8, 129.5, PAD + 6.7)); g.add(mot);
  const duct = new THREE.QuadraticBezierCurve3(P(33, 135.5, PAD + 8.2), P(33, 139, PAD + 14), P(29.6, 138.5, 18.5));
  const dm = new THREE.Mesh(new THREE.TubeGeometry(duct, 20, 1.7, 14), BLUE()); dm.castShadow = true; g.add(dm);

  // ---------- column dryer ----------
  const D = { x1: 15, y1: 134, x2: 29, y2: 146 };
  [[15.6, 134.6], [28.4, 134.6], [15.6, 145.4], [28.4, 145.4]].forEach(([x, y]) => { box(g, x - 1.2, y - 1.2, x + 1.2, y + 1.2, 2, M.pedestal, PAD); box(g, x - .5, y - .5, x + .5, y + .5, 14 - PAD - 2, BLUE(), PAD + 2); });
  strut(g, [15.6, 134.6, PAD + 2], [28.4, 134.6, 13], 0.35, BLUE()); strut(g, [28.4, 134.6, PAD + 2], [15.6, 134.6, 13], 0.35, BLUE());
  strut(g, [15.6, 145.4, PAD + 2], [28.4, 145.4, 13], 0.35, BLUE()); strut(g, [28.4, 145.4, PAD + 2], [15.6, 145.4, 13], 0.35, BLUE());
  hopper(g, 22, 140, 7.5, 14, 12, 2, 2, 6.5);                                             // cream discharge hopper
  boxR(g, { x1: 14, y1: 133, x2: 30, y2: 147 }, 8, M.panels, 14);                         // flared hot-air plenum
  box(g, 30, 136, 30.3, 137.8, 1.8, M.steelDark, 17); box(g, 30, 138.6, 30.3, 140.4, 1.8, M.steelDark, 17);   // inspection hatches
  hopper(g, 22, 140, 22, 13, 11, 16, 14, 2, M.panels);
  boxR(g, { x1: 15.5, y1: 134.5, x2: 28.5, y2: 145.5 }, 36, M.panels, 24);                // main column
  box(g, 15.2, 134.2, 28.8, 145.8, 0.6, M.steelDark, 60);
  railRect(g, 15.2, 134.2, 28.8, 145.8, 60.6, M.railGreen);
  cyl(g, 22, 140, 2.6, 3.2, BLUE(), 60.6); const cap = new THREE.Mesh(new THREE.SphereGeometry(2.6, 18, 6, 0, Math.PI * 2, 0, Math.PI / 2), BLUE()); cap.scale.y = 0.4; cap.position.copy(P(22, 140, 63.8)); g.add(cap);
  cyl(g, 25.5, 143.5, 0.12, 6, M.steelDark, 60.6, 6);                                    // light mast
  // steep gangway: tower upper deck -> dryer top
  stairFlight(g, [27, 125.3, 40], [24, 134, 60.6], 2.4);

  // ---------- tempering bins on legs (two blocks) ----------
  const bins = (x1, x2, top) => {
    const xs = [x1 + 0.6, (x1 + x2) / 2, x2 - 0.6], ys = [148.6, 157, 165.4];
    xs.forEach(x => ys.forEach(y => { box(g, x - 1.1, y - 1.1, x + 1.1, y + 1.1, 1.8, M.pedestal, PAD); box(g, x - .45, y - .45, x + .45, y + .45, 13 - PAD - 1.8, BLUE(), PAD + 1.8); }));
    [148.6, 165.4].forEach(y => { strut(g, [xs[0], y, PAD + 2], [xs[1], y, 12.5], 0.3, BLUE()); strut(g, [xs[2], y, PAD + 2], [xs[1], y, 12.5], 0.3, BLUE()); });
    [152.5, 161.5].forEach(y => hopper(g, (x1 + x2) / 2, y, 7, x2 - x1 - 0.4, 8.6, 1.4, 1.4, 6));
    boxR(g, { x1, y1: 148, x2, y2: 166 }, top - 13, M.cladGreen, 13);
    box(g, x1 - 0.2, 147.8, x2 + 0.2, 166.2, 0.5, M.steelDark, top);
    railRect(g, x1 - 0.2, 147.8, x2 + 0.2, 166.2, top + 0.5, M.railGreen);
  };
  bins(4, 22.5, 36);                                                                       // taller block (west)
  bins(23, 41, 26);                                                                        // lower block (east, front in the photos)
  strut(g, [24.5, 146, 58], [15, 156, 36.5], 1.2, M.steel, true);                          // dryer -> tall bins (inclined conveyor)
  strut(g, [22.6, 157, 35], [27, 157, 26.5], 1.0, M.steel, true);                          // tall -> low bins
  box(g, 38, 155.8, 47, 158.2, 2.4, M.steelGreen, 26.5);                                   // gallery to the milling hall
  strut(g, [42, 157, PAD], [42, 157, 26.5], 0.5, M.steelGreen);

  // ---------- intake: proposed conveyor from the paddy store's south door ----------
  const ic = new THREE.Group(); ic.name = 'intake'; g.add(ic);
  box(ic, 34, 170, 40, 176, 3.5, M.steelGreen, 0);                                        // intake hopper at the store door
  hopper(ic, 37, 173, 3.5, 6, 6, 2, 2, 0.01, M.steelDark);
  strut(ic, [40, 173, 2.5], [41.8, 160, 12], 1.8, M.steelGreen);                          // inclined section
  box(ic, 40.9, 93, 42.7, 160.5, 1.8, M.steelGreen, 11.1);                                 // level run along the plot edge
  for (let y = 98; y < 160; y += 14) { box(ic, 40.9, y - .3, 41.3, y + .3, 11.1 - PAD, M.steelDark, PAD); box(ic, 42.3, y - .3, 42.7, y + .3, 11.1 - PAD, M.steelDark, PAD); }
  strut(ic, [41.8, 93.5, 11.5], [39.6, 91.5, 4], 1.2, M.steelGreen);                       // drop into the short elevator boot
  tag(ic, null, { name: 'Intake conveyor (proposed)', status: 'new', size: '≈95 ft belt, enclosed', notes: 'In the photos the plant takes paddy in at its south end (short elevator + pre-cleaner). Once the milling hall closes the east side, tractors can no longer reach that end. Proposed fix: an intake hopper just inside the paddy store’s south end and an enclosed belt along the plot edge into the short elevator.', round: 2 });

  // people for scale (≈5.9 ft)
  person(g, 36.5, 97.5, PAD); person(g, 40, 128, PAD);

  tag(g, SITE.rice.saila, { name: 'Saila plant', status: 'existing', notes: 'Rebuilt from the site photos: 70 ft feed elevator, 46 ft intake elevator, pre-cleaner on a blue frame, a green-and-blue braced steel tower (decks at 15, 30 and 40 ft, blue-clad top bin to 59 ft with the orange railing), four stainless soak tanks plus two upper vessels, zigzag stair, blue hot-air blower with duct, ~60 ft green column dryer, and two blocks of green tempering bins on legs. Number of soak tanks behind the front pair (assumed 2) to confirm.', round: 2 });
  label(g, 'Saila plant', 23, 112, 66, 'major', 1);
  label(g, 'Soak tanks', 33, 112, 22, '', 2);
  label(g, 'Column dryer', 22, 140, 50, '', 2);
  label(g, 'Tempering bins', 22, 157, 40, '', 2);
  label(g, 'Hot-air blower', 34, 129.5, 12, '', 2);
  label(g, 'Pre-cleaner', 28, 92, 18, '', 2);
  label(g, 'Intake conveyor (proposed)', 41.8, 104, 13, '', 2);
  return g;
}
