// v10 — three alternative designs for the front zone, shown side by side EAST of the compound along the same
// Sargodha–Gujrat Road. The original front zone (front.js) is untouched.
// v12: the weighbridge is assumed moved elsewhere (v20: to the end of the mill's main road), so each variation now uses the whole front zone x 0–195
// (≈28,200 sq ft ≈ 6.3 kanal, ≈202 ft frontage); only the mill's main road (x 195–220) is kept. Moved further east,
// clear of the compound's L.
// v18: each variation is also built a second time ON the real front zone (shift 0, hidden until chosen), so the HUD can
// cycle the front zone in place: original hybrid → 1 → 2 → 3. In place, the duplicate main road, gate pillars and walls are
// skipped, and the wall to the mill road jogs round the gate guard room so it stays on the mill side.
import * as THREE from 'three';
import { ytop } from '../site.js';
import { M, P, box, boxR, slab, segBox, cyl, block, floorsBlock, partition, gableShed, label, tag, car, truck, tractor, person, trees, waterTank, acUnit, solarArray, strut, panel, railRect, shutter, mergeByMaterial, rng } from '../lib.js';
import { keptParts } from './front.js';

const U = [220 / 228.166, 60.5 / 228.166], N = [-U[1], U[0]];
const SHIFT = [520, 790, 1060, 1330, 1600];                             // ft along the road from the real front zone (v12: clear of the compound; v25: + 4 and 5)
const at = (t, off = 0) => [U[0] * t + N[0] * off, 528 + U[1] * t + N[1] * off];
const SITE = [[0, 410], [195, 410], [195, ytop(195)], [0, 528]];
const FACE_ROAD = Math.atan2(N[0], -N[1]);                              // rotation.y for a plane facing the road
export const VARIANT_CENTERS = SHIFT.map(s => [98 + U[0] * s, 480 + U[1] * s]);
export const COMPARE = [];
export const FRONT_NAMES = ['Original (hybrid)', '1 · Petrol pump', '2 · Restaurant + motel', '3 · Market', '4 · Shops + flats', '5 · Godowns + restaurant'];

// ---------- local textures / materials ----------
function tex(w, h, draw, repeat) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); draw(x, w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1 / repeat[0], 1 / repeat[1]); }
  return t;
}
const textSign = (lines, bg, fg, w = 1024, h = 160, font = 'Georgia, serif') => tex(w, h, (x) => {
  x.fillStyle = bg; x.fillRect(0, 0, w, h); x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle';
  lines.forEach(([t, size, y]) => { x.font = `bold ${size}px ${font}`; x.fillText(t, w / 2, h * y); });
});
let V = null;
function mats() {
  if (V) return V;
  const std = (o) => new THREE.MeshStandardMaterial({ roughness: 0.7, ...o });
  V = {
    led: std({ color: 0xffffff, emissive: 0xfff8e8, emissiveIntensity: 0.9 }),
    flame: std({ color: 0xff7a1a, emissive: 0xff5a00, emissiveIntensity: 1.2 }),
    screen: std({ color: 0x0b2a1c, emissive: 0x2bd47a, emissiveIntensity: 0.6 }),
    dome: std({ color: 0x2e8b57, metalness: 0.3, roughness: 0.4 }),
    mosque: std({ color: 0xf5f3ee, roughness: 0.8 }),
    fuelGreen: std({ color: 0x0f7a4a, roughness: 0.45 }), fuelYellow: std({ color: 0xf2c230, roughness: 0.45 }),
    brickRed: std({ map: tex(192, 96, (x, w, h) => { x.fillStyle = '#d6c4a8'; x.fillRect(0, 0, w, h); for (let j = 0; j < 8; j++) for (let i = -1; i < 6; i++) { x.fillStyle = `rgb(${150 + (i * 37 + j * 53) % 40},${70 + (i * 17) % 20},${50})`; x.fillRect(i * 32 + (j % 2 ? 16 : 0) + 1, j * 12 + 1, 30, 10); } }, [4, 2]) }),
    wok: std({ color: 0x1b1b1b, metalness: 0.7, roughness: 0.35 }),
    umbrella: std({ color: 0xc8392b, roughness: 0.6 }), umbrella2: std({ color: 0xf2efe6, roughness: 0.6 }),
    charpai: std({ color: 0xb08d5a, roughness: 0.9 }),
    play: std({ color: 0x2f7dd1, roughness: 0.5 }), play2: std({ color: 0xf2a516, roughness: 0.5 }),
    motelWall: std({ map: tex(96, 88, (x, w, h) => { x.fillStyle = '#efe7d8'; x.fillRect(0, 0, w, h); x.fillStyle = '#7a4a2a'; x.fillRect(8, 22, 22, 66); x.fillStyle = '#2f4a5e'; x.fillRect(44, 30, 40, 30); x.strokeStyle = '#555'; x.lineWidth = 3; x.strokeRect(44, 30, 40, 30); x.fillStyle = '#d8cdb8'; x.fillRect(0, 0, w, 6); }, [12, 11]) }),
    marketUpper: std({ map: tex(96, 80, (x, w, h) => { x.fillStyle = '#d9d4cb'; x.fillRect(0, 0, w, h); x.fillStyle = '#2d4b61'; x.fillRect(6, 14, w - 12, h - 30); x.fillStyle = '#c0b8ab'; x.fillRect(0, h - 10, w, 10); x.fillStyle = '#9aa3a9'; x.fillRect(w / 2 - 1, 14, 2, h - 30); }, [12, 10]) }),
    shopFront: std({ map: tex(96, 96, (x, w, h) => { x.fillStyle = '#3a3f44'; x.fillRect(0, 0, w, h); x.fillStyle = '#3e6075'; x.fillRect(6, 30, w - 12, h - 34); x.fillStyle = '#9aa3a9'; for (let i = 0; i < 9; i++) x.fillRect(6, 4 + i * 3, w - 12, 1.5); }, [12, 12]) }),
    pylonPrice: std({ map: tex(256, 512, (x, w, h) => {
      x.fillStyle = '#0f7a4a'; x.fillRect(0, 0, w, h); x.fillStyle = '#f2c230'; x.fillRect(0, 0, w, 90);
      x.fillStyle = '#0f3d27'; x.font = 'bold 54px sans-serif'; x.textAlign = 'center'; x.fillText('FUEL', w / 2, 64);
      [['PETROL', 'Rs —'], ['HI-OCTANE', 'Rs —'], ['DIESEL', 'Rs —'], ['EV / kWh', 'Rs —']].forEach(([a, b], i) => { const y = 140 + i * 90; x.fillStyle = '#082a1a'; x.fillRect(16, y - 40, w - 32, 72); x.fillStyle = '#ffffff'; x.font = 'bold 26px sans-serif'; x.textAlign = 'left'; x.fillText(a, 28, y + 6); x.fillStyle = '#ff4433'; x.textAlign = 'right'; x.fillText(b, w - 28, y + 6); });
      x.fillStyle = '#ffffff'; x.font = 'bold 24px sans-serif'; x.textAlign = 'center'; x.fillText('MART · MOSQUE · EV · TYRE', w / 2, 500);
    }), emissive: 0x222222 }),
    fascia: std({ map: textSign([['FUEL STATION  ·  24/7  ·  HI-SPEED DIESEL  ·  EV CHARGING', 60, 0.55]], '#0f7a4a', '#ffffff', 2048, 128, 'sans-serif') }),
    martSign: std({ map: textSign([['MART  ·  CAFÉ  ·  ATM', 70, 0.55]], '#f2c230', '#0f3d27', 1024, 128, 'sans-serif'), emissive: 0x332200 }),
    karahiSign: std({ map: textSign([['KARAHI HOUSE', 92, 0.42], ['Karahi  ·  Tikka  ·  BBQ  ·  Family Hall', 40, 0.8]], '#5a1a12', '#ffd76a'), emissive: 0x2a0800 }),
    motelSign: std({ map: textSign([['MOTEL  ·  20 ROOMS', 74, 0.55]], '#1d2329', '#ffffff', 1024, 128, 'sans-serif') }),
    marketSign: std({ map: textSign([['MANGOWAL TRADE CENTRE', 64, 0.45], ['Shops on two floors', 38, 0.82]], '#1f3b57', '#ffffff') }),
    plazaSign: std({ map: textSign([['MANGOWAL PLAZA', 78, 0.45], ['Shops  ·  Family flats', 40, 0.82]], '#6b2d1f', '#fff3dc') }),
    godownSign: std({ map: textSign([['GODOWNS FOR RENT', 70, 0.42], ['Paddy  ·  Rice  ·  Wheat  ·  Fertiliser', 38, 0.8]], '#1d2329', '#ffffff') }),
    shopSigns: std({ map: tex(2048, 64, (x, w, h) => {
      const names = ['MOBILE ZONE', 'PHARMACY', 'BANK', 'TAILORS', 'HARDWARE', '', 'BAKERY', 'AGRI STORE', 'GARMENTS', 'ELECTRONICS', 'SHOES', 'GENERAL STORE'];
      const cols = ['#c0392b', '#16a085', '#1f3b57', '#8e44ad', '#d35400', '#555', '#b7950b', '#27ae60', '#2c3e50', '#2980b9', '#7f3f2a', '#117a65'];
      const sw = w / names.length; names.forEach((n, i) => { x.fillStyle = cols[i]; x.fillRect(i * sw + 2, 2, sw - 4, h - 4); x.fillStyle = '#fff'; x.font = 'bold 26px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(n, i * sw + sw / 2, h / 2); });
    }) }),
  };
  return V;
}
function sign(parent, mat, w, h, x, y, z, rotY = Math.PI) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); m.position.copy(P(x, y, z)); m.rotation.y = rotY; parent.add(m); return m;
}
const arrowGeo = (() => { const s = new THREE.Shape([[-1.2, -4], [1.2, -4], [1.2, 0], [3, 0], [0, 4.5], [-3, 0], [-1.2, 0]].map(([a, b]) => new THREE.Vector2(a, b))); const g = new THREE.ShapeGeometry(s); g.rotateX(-Math.PI / 2); return g; })();
function arrow(parent, x, y, dir) { const a = new THREE.Mesh(arrowGeo, M.whitePaint); a.position.copy(P(x, y, 0.36)); a.rotation.y = dir; parent.add(a); }   // dir: 0 = north, +π/2 = west

// ---------- common frame for one variation ----------
function frame(scene, i, title, inPlace = false, kept = false) {
  const g = new THREE.Group(); g.name = 'variant' + (i + 1) + (inPlace ? 'InPlace' : ''); scene.add(g);
  const s = inPlace ? 0 : SHIFT[i]; g.position.set(U[0] * s, 0, -(U[1] * s));
  if (inPlace) g.userData.frontVar = i + 1;
  if (!inPlace) slab(g, [[0, 404], [226, 404], [226, ytop(226) + 1], [0, 527]], 0.12, M.soil, -0.08);
  slab(g, SITE, kept ? 0.2 : 0.3, M.concrete);                                             // v25: lower under a copy of the original layout (its own slabs sit on top)
  slab(g, [at(0, 0), at(202, 0), at(202, 18), at(0, 18)], 0.25, M.road, -0.05);          // apron to the road
  if (inPlace) {
    // real site: main road, gate, west + east walls already exist. Wall to the loop, and to the mill road with a jog round the guard room
    segBox(g, [0, 410], [195, 410], 1.1, 9, M.brick);
    segBox(g, [195, 410], [195, 557.5], 1.1, 9, M.brick); segBox(g, [195, 557.5], [182, 557.5], 1.1, 9, M.brick); segBox(g, [182, 557.5], [182, ytop(182) - 3], 1.1, 9, M.brick);
    box(g, 182.5, 558, 194.5, ytop(182) - 2, 0.05, M.road, 0.33, false);                   // guard-room forecourt stays with the mill
    label(g, title, 98, 480, 52, 'variant', 1);
    return g;
  }
  // only the mill's main road is kept (v12: the weighbridge moves elsewhere, its strip x 160–195 joins the variation)
  slab(g, [[195.5, 410], [219.5, 410], [219.5, 588.3], [195.5, ytop(195.5)]], 0.28, M.road);
  [[195, ytop(195)], [220, 588.5]].forEach(([x, y]) => box(g, x - 1.8, y - 1.8, x + 1.8, y + 1.8, 19, M.brick));
  // boundary walls: south, west, and the wall between the variation and the mill road
  segBox(g, [0, 410], [220, 410], 1.1, 9, M.brick); segBox(g, [0, 410], [0, 528], 1.1, 9, M.brick);
  if (!kept) segBox(g, [195, 410], [195, ytop(195) - 3], 1.1, 9, M.brick);                  // the original layout's mill front opens onto the main road
  segBox(g, [220, 410], [220, 588.5], 1.1, 9, M.brick);
  label(g, title, 98, 480, 52, 'variant', 1);
  label(g, 'Mill main road (kept)', 207.5, 470, 6, 'road', 2);
  return g;
}
function card(g, info, inPlace) { tag(g, null, info); if (!inPlace) COMPARE.push(info); }

export function build(scene) {
  mats();
  v1(scene); v2(scene); v3(scene); v4(scene); v5(scene);                                  // side-by-side copies east of the compound
  v1(scene, true); v2(scene, true); v3(scene, true); v4(scene, true); v5(scene, true);    // v18: in-place copies on the real front zone (cycled from the HUD)
}

// ======================= VARIATION 1: full petrol pump =======================
function v1(scene, inPlace = false) {
  const g = frame(scene, 0, 'Variation 1 · Full petrol pump', inPlace), v = V;
  // --- back row (south): mosque, washrooms, mart + café, lube/tyre, car wash ---
  // mosque with green dome, minaret, wuzu area
  box(g, 2, 412, 32, 440, 14, v.mosque); box(g, 1.6, 411.6, 32.4, 440.4, 1.2, v.dome, 14);
  const dm = new THREE.Mesh(new THREE.SphereGeometry(7, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), v.dome); dm.position.copy(P(17, 426, 15)); dm.castShadow = true; g.add(dm);
  cyl(g, 30, 438, 1.8, 42, v.mosque, 0, 16); cyl(g, 30, 438, 2.3, 1.2, v.dome, 30, 16);
  const md = new THREE.Mesh(new THREE.ConeGeometry(2, 5, 16), v.dome); md.position.copy(P(30, 438, 44.5)); g.add(md);
  for (let x = 6; x < 30; x += 6) box(g, x, 439.9, x + 3, 440.2, 7, M.glass, 3);
  box(g, 2, 440, 32, 446, 0.4, M.tile, 0.3, false); box(g, 3, 444, 31, 445, 2.4, M.stoneDark, 0.3);       // wuzu (ablution) counter
  // washrooms
  block(g, { x1: 34, y1: 412, x2: 48, y2: 432 }, 1, 11, M.beige, { parapet: 1.5 });
  // mart + café with ATM, outdoor seating
  block(g, { x1: 50, y1: 412, x2: 102, y2: 440 }, 1, 14, M.beige, { parapet: 2, roof: M.slab });
  box(g, 52, 439.8, 100, 440.3, 11, M.glass, 0.5); box(g, 49.5, 440, 102.5, 446, 0.5, v.fuelGreen, 13.4);
  sign(g, v.martSign, 30, 3.2, 76, 440.4, 15.6); box(g, 100.4, 440, 102, 441.5, 7, M.darkMetal, 0.3);       // ATM
  [[58, 443], [68, 443], [86, 443], [94, 443]].forEach(([x, y]) => { cyl(g, x, y, 1.6, 0.15, M.wood, 2.6, 12); cyl(g, x, y, 0.1, 7, M.steel, 0, 6); const u = new THREE.Mesh(new THREE.ConeGeometry(3.4, 1.4, 8), v.umbrella2); u.position.copy(P(x, y, 7.6)); g.add(u); });
  waterTank(g, 56, 416, 14); acUnit(g, 70, 416, 14); acUnit(g, 80, 416, 14); solarArray(g, 86, 425, 15.2, 28, 18, 0.2, 0);
  // lube + tyre bays (2 shutters, one open with a lift)
  block(g, { x1: 104, y1: 412, x2: 128, y2: 438 }, 1, 15, M.ops, { parapet: 1.5 });
  shutter(g, 110, 438, 'N', 9, 11, v.fuelYellow); box(g, 117, 437.9, 126, 438.3, 11, M.darkMetal, 0);
  car(g, 121.5, 446, 0, 0x8a1c1c); box(g, 118, 441, 125, 451, 0.4, M.yellow, 0.3);
  // car wash: open gantry with brushes
  box(g, 130, 412, 158, 436, 0.3, M.tile, 0.3, false);
  [[131, 413], [157, 413], [131, 435], [157, 435]].forEach(([x, y]) => box(g, x - .5, y - .5, x + .5, y + .5, 14, M.steel));
  box(g, 130, 412, 158, 436, 0.5, M.roof, 14); [137, 151].forEach(x => cyl(g, x, 424, 1.6, 8, M.steelBlue, 1, 14));
  car(g, 144, 424, 0, 0xffffff);
  // generator + vent pipes
  box(g, 140, 438, 150, 444, 5, M.steelDark, 0.3); [152, 154, 156].forEach(x => cyl(g, x, 442, 0.2, 14, M.steel, 0, 6));
  // --- EV hub with solar carport (west, by the mosque) ---
  [[3, 449], [31, 449], [3, 469], [31, 469]].forEach(([x, y]) => box(g, x - .3, y - .3, x + .3, y + .3, 11, M.steel));
  solarArray(g, 17, 459, 11.6, 31, 22, 0.08, 0);
  [6, 16, 26].forEach((x, k) => { box(g, x - 0.9, 466.5, x + 0.9, 467.5, 6.5, M.whitePaint, 0.3); box(g, x - 0.7, 466.4, x + 0.7, 466.5, 2, v.screen, 4); box(g, x - 4.6, 449, x - 4.4, 468, 0.05, M.whitePaint, 0.32, false); if (k < 2) car(g, x + 0.5, 457, Math.PI, [0x2f6db0, 0xe6e6e6][k]); });
  // --- car canopy: 4 islands, 8 multi-product dispensers ---
  const C = { x1: 36, y1: 474, x2: 116, y2: 508 };
  [[38, 476], [76, 476], [114, 476], [38, 506], [76, 506], [114, 506]].forEach(([x, y]) => box(g, x - .8, y - .8, x + .8, y + .8, 18, M.whitePaint));
  boxR(g, C, 3, M.canopyWhite, 18); box(g, C.x1 + 2, C.y1 + 2, C.x2 - 2, C.y2 - 2, 0.15, v.led, 17.9);
  sign(g, v.fascia, 80, 3, 76, 508.05, 19.5); sign(g, v.fascia, 80, 3, 76, 473.95, 19.5, 0);
  [[46, 70, 482], [82, 106, 482], [46, 70, 500], [82, 106, 500]].forEach(([a, b, y]) => {
    box(g, a, y - 1.8, b, y + 1.8, 0.6, M.slab, 0.3); box(g, a - 0.2, y - 1.8, a + 1.2, y + 1.8, 0.7, v.fuelYellow, 0.3);
    [a + 6, b - 6].forEach(x => { box(g, x - 1.4, y - 0.8, x + 1.4, y + 0.8, 6, M.canopyWhite, 0.9); box(g, x - 1.45, y - 0.85, x + 1.45, y + 0.85, 1.2, v.fuelGreen, 5.8); box(g, x - 0.9, y - 0.9, x + 0.9, y - 0.85, 1, v.screen, 4); });
  });
  car(g, 58, 486.5, Math.PI / 2, 0xffffff); car(g, 94, 495.5, Math.PI / 2, 0x2b2f36); car(g, 58, 504.5, Math.PI / 2, 0xb0b5ba);
  person(g, 64, 484.5, 0.3, M.kurta2);
  // --- truck diesel canopy: 24 ft clear, 2 high-flow islands ---
  const TC = { x1: 122, y1: 456, x2: 156, y2: 520 };
  [[123, 457], [155, 457], [123, 488], [155, 488], [123, 519], [155, 519]].forEach(([x, y]) => box(g, x - .9, y - .9, x + .9, y + .9, 24, M.whitePaint));
  boxR(g, TC, 3.2, M.canopyWhite, 24); box(g, TC.x1 + 2, TC.y1 + 2, TC.x2 - 2, TC.y2 - 2, 0.15, v.led, 23.9); box(g, TC.x1 - .2, TC.y2 - .2, TC.x2 + .2, TC.y2 + .2, 3.4, v.fuelGreen, 23.9);
  [133, 145].forEach(x => { box(g, x - 1.8, 470, x + 1.8, 505, 0.6, M.slab, 0.3); box(g, x - 1.5, 486, x + 1.5, 489, 7, M.canopyWhite, 0.9); box(g, x - 1.55, 485.95, x + 1.55, 489.05, 1.4, v.fuelGreen, 6.5); });
  truck(g, 139, 492, Math.PI, true);
  // --- v12 truck stop in the old weighbridge strip (x 160–195): 4 parking bays, truckers' dhaba with charpais + washrooms ---
  box(g, 160, 410.6, 195, 560, 0.05, M.asphalt, 0.3, false);
  [163, 178, 193].forEach(x => box(g, x - .2, 436, x + .2, 506, 0.05, M.whitePaint, 0.36, false));
  box(g, 163, 470.8, 193, 471.2, 0.05, M.whitePaint, 0.36, false);
  truck(g, 170.5, 453, 0, true); truck(g, 185.5, 455, 0, false); truck(g, 185.5, 489, Math.PI, true);
  block(g, { x1: 161, y1: 411.5, x2: 194, y2: 424 }, 1, 11, M.beige, { parapet: 1.5 });
  box(g, 160.5, 424, 194.5, 432, 0.4, M.roof, 9.5); [161.5, 177.5, 193.5].forEach(x => box(g, x - .3, 431.4, x + .3, 432, 9.5, M.steel, 0.3));
  [[166, 428], [174, 428], [182, 428], [190, 428]].forEach(([x, y]) => box(g, x - 3, y - 1.4, x + 3, y + 1.4, 1.5, v.charpai, 0.3));
  box(g, 161, 412, 170, 423.5, 0.3, M.tile, 11.2); waterTank(g, 188, 416, 11);
  person(g, 170, 430, 0.3, M.kurta); person(g, 186, 427, 0.3, M.kurta3);
  // underground tanks (manholes), price pylon, air/water point, frontage hedges + lights, arrows
  [[64, 455], [72, 455], [80, 455], [88, 455]].forEach(([x, y]) => cyl(g, x, y, 1.6, 0.12, M.steelDark, 0.3, 16));
  const [px, py] = [inPlace ? 174 : 180, 566]; box(g, px - .7, py - .7, px + .7, py + .7, 6, M.stoneDark); const pl = new THREE.Mesh(new THREE.BoxGeometry(7, 22, 1.2), [v.fuelGreen, v.fuelGreen, v.fuelGreen, v.fuelGreen, v.pylonPrice, v.pylonPrice]); pl.position.copy(P(px, py, 17)); pl.rotation.y = FACE_ROAD + Math.PI; pl.castShadow = true; g.add(pl);
  box(g, 26, 516, 30, 520, 4.5, v.fuelYellow, 0.3);
  for (let t = 40; t < 128; t += 8) { const [x, y] = at(t, -3); box(g, x - 3, y - 1, x + 3, y + 1, 1.6, M.hedge, 0.3); }
  [[20, 530], [140, 560], [172, 520]].forEach(([x, y]) => { cyl(g, x, y, 0.3, 24, M.steel, 0, 8); box(g, x - 2, y - .5, x + 2, y + .5, 0.8, M.steelDark, 24); });
  arrow(g, ...at(150, 6), -Math.PI / 2 - 0.27); arrow(g, ...at(16, 6), Math.PI / 2 - 0.27); arrow(g, ...at(inPlace ? 178 : 190, 6), -Math.PI / 2 - 0.27); arrow(g, 177, 520, Math.PI);
  arrow(g, 90, 468, Math.PI / 2); arrow(g, 40, 468, Math.PI / 2);
  label(g, 'Mosque + wuzu', 17, 426, 26, '', 2); label(g, 'Mart · café · ATM', 76, 426, 20, '', 2); label(g, 'Lube + tyre', 116, 425, 20, '', 2); label(g, 'Car wash', 144, 424, 18, '', 2);
  label(g, 'EV charging (solar)', 17, 459, 16, '', 2); label(g, '8 dispensers', 76, 491, 25, '', 2); label(g, 'Diesel · trucks', 139, 488, 31, '', 2);
  label(g, 'Entry', ...at(150, 9), 2, 'road', 2); label(g, 'Exit', ...at(16, 9), 2, 'road', 2); label(g, 'Truck entry', ...at(inPlace ? 178 : 190, 9), 2, 'road', 2);
  label(g, 'Truck stop · 4 bays', 178, 471, 14, '', 2); label(g, 'Truckers’ dhaba', 177.5, 418, 16, '', 2);
  mergeByMaterial(g);
  card(g, {
    name: 'Variation 1 · Full petrol pump', short: 'Petrol pump', status: 'review',
    size: 'Site 195 × 118–172 ft (≈202 ft road frontage)', area: '28,200 sq ft ≈ 6.3 kanal · ≈4,100 sq ft buildings + ≈5,300 sq ft canopies/shades',
    notes: 'A full modern highway station on the whole front zone except the mill’s own main road (v12: the weighbridge strip becomes a truck stop — v20 moved the weighbridge itself to the end of the mill’s main road: 4 truck parking bays, a truckers’ dhaba with charpais under a shade, washrooms, its own truck entry at the east end). Car forecourt (4 islands, 8 multi-product dispensers) under a lit canopy, separate 24 ft truck-diesel canopy with 2 high-flow dispensers, mosque with wuzu area, mart + café + ATM, lube + tyre bays, car wash, EV charging (2–3 DC chargers under a solar carport), air/water point, underground tanks, price pylon. Separate entry (east) and exit (west); a brick wall separates it from the mill. Branding left neutral (OMC not chosen).',
    finance: {
      rows: [
        ['Build cost', 'Rs 9.3–13 cr (≈ 7.5–10.5 cr if the OMC funds tanks, dispensers + branding)'],
        ['— forecourt, canopies, tanks + dispensers', 'Rs 4.5–6.4 cr'],
        ['— buildings (mosque, mart, bays, wash, dhaba)', 'Rs 2.2–2.6 cr'],
        ['— truck stop paving, shade, lights', 'Rs 0.3–0.5 cr'],
        ['— EV hub, licences, working capital', 'Rs 2.3–3.5 cr'],
        ['Fuel margin', 'Rs 9.98/L dealer margin (since Aug 2026)'],
        ['Net per year (6,000 L/day)', '≈ Rs 1.7 cr  (fuel ≈ 0.9 + mart/bays/wash ≈ 0.65 + truck stop/dhaba ≈ 0.15)'],
        ['Range', '4,000 L/day ≈ 0.95 cr · 9,000 L/day ≈ 2.8 cr'],
        ['ROI on build cost', '≈ 15 %/yr (7–25 %)'],
        ['Payback', '≈ 6.5 years (4–14)'],
      ],
      note: 'Land already owned (≈ Rs 4.8 cr at FBR value for the whole front zone, not included). The truck stop makes overnight trucks fill up here; the dhaba can be leased out. Decide only after a 7-day traffic count and 2–3 OMC offers; below ≈4,000 L/day it barely pays. The mill’s own diesel counts as guaranteed volume. EV charging is for the future — it loses money at today’s low EV numbers.',
    },
    compare: { capex: 'Rs 9.3–13 cr', built: '≈4,100 sq ft + canopies', net: '≈ Rs 1.7 cr/yr (0.95–2.8)', roi: '≈ 15 % (7–25)', payback: '≈ 6.5 yrs', effort: 'Medium — dealer + staff of ≈25', risk: 'Fuel volume (traffic) and dealer-margin politics' },
    round: 12,
  }, inPlace);
}

// ======================= VARIATION 2: karahi restaurant + motel =======================
function v2(scene, inPlace = false) {
  const g = frame(scene, 1, 'Variation 2 · Karahi restaurant + motel', inPlace), v = V;
  // --- restaurant, 2 storeys: open karahi line behind the glass front, dining hall; family hall + roof terrace upstairs ---
  const R = { x1: 30, y1: 452, x2: 120, y2: 488 };
  box(g, R.x1, R.y1, R.x2, R.y2, 13, v.brickRed); box(g, R.x1 - .3, R.y1 - .3, R.x2 + .3, R.y2 + .3, 0.8, M.timber, 13);
  box(g, R.x1, R.y1, 96, R.y2, 11, M.beige, 13.8); box(g, R.x1, R.y1, 96, R.y2, 0.8, M.slab, 24.8);                 // first floor (family hall)
  box(g, 96, R.y1, R.x2, R.y2, 0.6, M.slab, 13.8); railRect(g, 96, R.y1, R.x2, R.y2, 14.4, M.railBlue, 'SEN');        // roof terrace
  [[100, 458], [110, 458], [100, 480], [110, 480]].forEach(([x, y]) => { cyl(g, x, y, 1.4, 0.12, M.wood, 16.8, 10); const u = new THREE.Mesh(new THREE.ConeGeometry(3, 1.2, 8), v.umbrella); u.position.copy(P(x, y, 21)); g.add(u); cyl(g, x, y, 0.08, 6.5, M.steel, 14.4, 6); });
  box(g, 34, 487.9, 92, 488.4, 9, M.glass, 13.9);                                                                      // family-hall glazing
  box(g, 32, 487.8, 118, 488.3, 10, M.glass, 1);                                                                       // ground glass front
  // open cooking line visible from the road: 8 karahi stations with flames, steel hood
  for (let k = 0; k < 8; k++) { const x = 38 + k * 9.5; box(g, x - 3.5, 484, x + 3.5, 487, 3, M.stainless, 0.3); const w = new THREE.Mesh(new THREE.SphereGeometry(1.6, 16, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), v.wok); w.position.copy(P(x, 485.5, 4.4)); g.add(w); const f = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.3, 8), v.flame); f.position.copy(P(x, 485.5, 3.6)); g.add(f); }
  box(g, 34, 483.5, 114, 487.5, 1.6, M.stainless, 9.5);
  for (let x = 40; x < 116; x += 10) [462, 470].forEach(y => { box(g, x - 2.5, y - 1.5, x + 2.5, y + 1.5, 0.2, M.wood, 2.6); });      // tables (dining hall)
  box(g, 42, 488, 84, 488.5, 7.4, M.timber, 25.2); sign(g, v.karahiSign, 40, 6.4, 63, 489, 28.9);
  [[24, 452], [24, 470]].forEach(([x, y]) => { box(g, x, y, x + 6, y + 10, 5, M.brick, 0.3); cyl(g, x + 3, y + 5, 2, 1.2, M.stoneDark, 5, 12); });     // tandoors by the side door
  // front terrace: tables with umbrellas + charpai corner
  box(g, 30, 488, 120, 500, 0.4, M.tile, 0.3, false);
  for (let x = 38; x < 118; x += 13) { cyl(g, x, 494, 1.7, 0.15, M.wood, 2.6, 12); cyl(g, x, 494, 0.1, 7.5, M.steel, 0, 6); const u = new THREE.Mesh(new THREE.ConeGeometry(3.8, 1.5, 8), x % 2 ? v.umbrella : v.umbrella2); u.position.copy(P(x, 494, 8)); g.add(u); }
  [[6, 494], [14, 494]].forEach(([x, y]) => box(g, x - 3, y - 1.8, x + 3, y + 1.8, 1.6, v.charpai, 0.3));
  // --- motel: 2 storeys, 10 rooms per floor, open gallery on the north, reception lobby at the west end ---
  const MR = { x1: 2, y1: 412, x2: 122, y2: 438 };
  box(g, MR.x1, MR.y1, MR.x2, MR.y2, 22, v.motelWall); box(g, MR.x1 - .3, MR.y1 - .3, MR.x2 + .3, MR.y2 + .3, 1, M.plaster, 22);
  box(g, MR.x1, 438, MR.x2, 443, 0.6, M.slab, 10.6); panel(g, [MR.x1, 443], [MR.x2, 443], 11.2, 3.4, M.railBlue);    // first-floor gallery
  for (let x = 2; x <= 122; x += 24) box(g, x - .4, 442.4, x + .4, 443, 10.6, M.plaster);
  box(g, 2, 438, 14, 448, 11, M.glass, 0.3); sign(g, v.motelSign, 26, 3.2, 40, 443.2, 17.5);
  strut(g, [124, 440, 0.3], [124, 425, 11], 3.2, M.steelDark);                                                         // external stair (east end)
  solarArray(g, 62, 425, 23.5, 110, 20, 0.15, 0); waterTank(g, 6, 416, 23); waterTank(g, 12, 416, 23, 0xe9e9e4);
  // --- service lane, kids' play area, prayer room, parking (cars front, coaches east) ---
  box(g, 2, 446, 26, 468, 0.3, M.grass, 0.3, false); box(g, 6, 452, 10, 456, 8, v.play); strut(g, [10, 454, 7], [18, 454, 0.3], 1.4, v.play2);
  [[20, 461], [24, 461]].forEach(([x, y]) => box(g, x - .2, y - .2, x + .2, y + .2, 8, v.play)); box(g, 19.8, 460.8, 24.2, 461.2, 0.3, v.play, 8);
  block(g, { x1: 2, y1: 470, x2: 24, y2: 486 }, 1, 11, M.plaster, { parapet: 1.5 }); const dd = new THREE.Mesh(new THREE.SphereGeometry(3.2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), v.dome); dd.position.copy(P(13, 478, 12.5)); g.add(dd);
  for (let x = 24; x < 160; x += 9.5) box(g, x - .2, 502, x + .2, 520, 0.05, M.whitePaint, 0.32, false);
  [[29, 0xffffff], [38, 0x1f2a44], [57, 0xb0b5ba], [66, 0x7a1f1f], [85, 0xffffff], [104, 0x2b2f36], [123, 0xd8d8d8], [142, 0x8a1c1c], [152, 0xffffff]].forEach(([x, c]) => car(g, x, 511, 0, c));
  // side car park (x 126–158) where the coaches stood in v10
  for (let y = 446; y <= 500; y += 9) box(g, 128, y - .2, 145, y + .2, 0.05, M.whitePaint, 0.32, false);
  [[450.5, 0x1f2a44], [459.5, 0xffffff], [477.5, 0xb0b5ba], [486.5, 0x2b2f36], [495.5, 0x7a1f1f]].forEach(([y, c]) => car(g, 136.5, y, -Math.PI / 2, c));
  // v12: old weighbridge strip (x 160–195) = coach / truck parking (3 bays) + drivers' rest room and washrooms
  box(g, 160, 410.6, 195, 560, 0.05, M.asphalt, 0.3, false);
  [161, 172.3, 183.6, 194.5].forEach(x => box(g, x - .2, 436, x + .2, 482, 0.05, M.whitePaint, 0.36, false));
  truck(g, 166.7, 459, 0, false); truck(g, 189, 461, Math.PI, true);
  block(g, { x1: 161, y1: 411.5, x2: 194, y2: 428 }, 1, 11, M.beige, { parapet: 1.5 }); box(g, 175, 427.9, 180, 428.3, 7, M.timber, 0.3);
  person(g, 70, 496, 0.3, M.kurta3); person(g, 72, 497, 0.3, M.kurta2); person(g, 50, 492, 0.3);
  trees(g, [[140, 520, 0.5, 0], [8, 505, 0.5, 0], [150, 540, 0.45, 0]], 91);
  label(g, 'Karahi line behind glass', 76, 486, 10, '', 2); label(g, 'Dining hall · family hall above', 63, 470, 30, '', 2); label(g, 'Roof terrace', 108, 470, 22, '', 2);
  label(g, 'Motel · 20 rooms', 62, 425, 30, '', 2); label(g, 'Kids’ play', 14, 457, 10, '', 2); label(g, 'Prayer room', 13, 478, 18, '', 2); label(g, 'Coach / truck parking · 3', 177.5, 460, 14, '', 2); label(g, 'Drivers’ rest + washrooms', 177.5, 420, 16, '', 2); label(g, 'Parking ≈ 23 cars', 86, 511, 6, '', 2);
  mergeByMaterial(g);
  card(g, {
    name: 'Variation 2 · Karahi restaurant + motel', short: 'Restaurant + motel', status: 'review',
    size: 'Site 195 × 118–172 ft (≈202 ft road frontage)', area: '28,200 sq ft ≈ 6.3 kanal · ≈14,100 sq ft built',
    notes: 'A destination karahi house for travellers in the style of famous Lahori karahi restaurants (open cooking line in full view from the road, big flames, family hall, roof terrace), plus a 20-room motel. Restaurant 90 × 36 ft on 2 floors (≈200 seats inside + terrace), 8 karahi stations, tandoors, front terrace with umbrellas and a charpai corner; motel 120 × 26 ft on 2 floors with an open gallery and reception; prayer room, kids’ play area. v12: the old weighbridge strip takes 3 coach/truck bays and a drivers’ rest room with washrooms, and the coaches’ old spot becomes a side car park, so parking rises from ≈14 to ≈23 cars (weekend peaks were the weak point). Signage left generic (no real brand used).',
    finance: {
      rows: [
        ['Build cost', 'Rs 11.4–14.4 cr'],
        ['— buildings (≈14,100 sq ft @ Rs 5,500–6,500)', 'Rs 7.8–9.2 cr'],
        ['— kitchen, dining + motel furniture', 'Rs 1.8–2.7 cr'],
        ['— parking (now ≈23 cars + 3 coaches), play area, power, approvals, working capital', 'Rs 1.8–2.5 cr'],
        ['Restaurant (base)', '200 diners/day × Rs 1,500 ≈ Rs 11 cr sales → ≈ 1.5 cr net (13–14 %)'],
        ['Motel (base)', '20 rooms × 45 % × Rs 6,000 ≈ Rs 2 cr revenue → ≈ 0.7 cr'],
        ['Net per year', '≈ Rs 2.2 cr (weak ≈ 1.1 · strong ≈ 3.5)'],
        ['ROI on build cost', '≈ 17 %/yr (8–28 %)'],
        ['Payback', '≈ 6 years (3.5–12)'],
      ],
      note: 'Highest upside, but it lives or dies on the operator and the food. Lower-risk route: build it and lease the restaurant to an established karahi brand (steady rent instead of profit). Room-rate check: 3-star hotels on Sargodha Road list at ≈ $41–53/night, so Rs 6,000 for a highway motel room is conservative. Base sales are unchanged from v10: the extra parking protects weekend peaks rather than adding a new income line. Land (≈ Rs 4.8 cr FBR for the whole front zone) not included.',
    },
    compare: { capex: 'Rs 11.4–14.4 cr', built: '≈14,100 sq ft', net: '≈ Rs 2.2 cr/yr (1.1–3.5)', roi: '≈ 17 % (8–28)', payback: '≈ 6 yrs', effort: 'High — run a restaurant + motel (or lease it)', risk: 'Operator quality and footfall' },
    round: 12,
  }, inPlace);
}

// ======================= VARIATION 3: built market (shops for sale or rent) =======================
function v3(scene, inPlace = false) {
  const g = frame(scene, 2, 'Variation 3 · Market of shops', inPlace), v = V;
  // two G+1 rows (v26: shops on both floors, no offices or flats): Row A faces the road, Row B faces an inner courtyard
  const row = (y1, y2, faceY, label_, backY) => {
    const H1 = 12, H2 = 11, top = H1 + H2;
    const segs = [[10, 70], [78, 174]];                                               // 8 ft passage at x 70–78 (v12: rows run to x 174)
    segs.forEach(([a, b]) => {
      box(g, a, y1, b, y2, H1, M.plaster); box(g, a, y1, b, y2, H2, M.plaster, H1); box(g, a - .3, y1 - .3, b + .3, y2 + .3, 3, M.plaster, top);
      box(g, a, faceY - 0.3, b, faceY + 0.3, H1 - 1.5, v.shopFront, 0.3);              // ground-floor shop fronts
      box(g, a, faceY - 0.3, b, faceY + 0.3, H2 - 3, v.shopFront, H1 + 0.6);           // first-floor shop fronts (v26)
      if (backY) box(g, a, backY - 0.3, b, backY + 0.3, H2 - 3, v.shopFront, H1 + 0.6); // Row A: first-floor shops also open onto the courtyard gallery
      box(g, a - .2, faceY - 2.5, b + .2, faceY + 2.5, 0.5, M.darkMetal, H1 - 0.6);     // canopy / sign shelf
      for (let x = a; x <= b + 0.1; x += 12) box(g, x - .25, faceY - 0.5, x + .25, faceY + 0.5, top, M.stoneDark);
    });
    sign(g, v.shopSigns, 164, 2.0, 92, faceY + 0.55, top - 1.6);                     // first-floor shop signs
    const ss = sign(g, v.shopSigns, 164, 2.2, 92, faceY + 0.55, H1 + 0.8); return ss;
  };
  row(466, 496, 496, 'A', 466); row(414, 444, 444, 'B');
  // galleries for the upper floors on the courtyard side of both rows, stair cores at the ends
  [[444, 448, 448], [462, 466, 462]].forEach(([y1, y2, ry]) => [12].forEach(z => { box(g, 10, y1, 174, y2, 0.6, M.slab, z); panel(g, [10, ry], [174, ry], z + 0.6, 3.4, M.railBlue); }));
  [[2, 414, 10, 444], [174, 414, 182, 444], [2, 466, 10, 496], [174, 466, 182, 496]].forEach(([a, b, c, d]) => box(g, a, b, c, d, 26, M.stoneDark));
  // courtyard: paving, trees, benches, fountain
  box(g, 10, 448, 174, 462, 0.4, M.tile, 0.3, false);
  trees(g, [[30, 455, 0.45, 0], [56, 455, 0.45, 0], [116, 455, 0.45, 0], [142, 455, 0.45, 0], [166, 455, 0.45, 0]], 77);
  cyl(g, 92, 455, 3.5, 1.4, M.stoneDark, 0.3, 20); cyl(g, 92, 455, 3, 0.2, M.water, 1.6, 20);
  box(g, 182.5, 410.6, 194.4, 500, 0.05, M.asphalt, 0.3, false);                                    // service lane to the back (v12)
  // roofs: tanks + solar
  [20, 50, 110, 140, 166].forEach(x => { waterTank(g, x, 470, 23); waterTank(g, x, 418, 23, 0xe9e9e4); });
  solarArray(g, 90, 481, 24, 144, 22, 0.15, 0); solarArray(g, 90, 429, 24, 144, 22, 0.15, 0);
  // name board on top of Row A, front parking + service road, guard/ATM kiosk, people
  sign(g, v.marketSign, 46, 6, 92, 497, 29); box(g, 68, 495.5, 116, 496.5, 8, M.darkMetal, 26);
  for (let x = 14; x < 178; x += 9) box(g, x - .2, 500, x + .2, 517, 0.05, M.whitePaint, 0.32, false);
  [[18.5, 0xffffff], [27.5, 0x1f2a44], [45.5, 0xb0b5ba], [63.5, 0x7a1f1f], [90.5, 0xffffff], [108.5, 0x2b2f36], [126.5, 0xd8d8d8], [135.5, 0x2f6db0], [153.5, 0xffffff], [171.5, 0x7a1f1f]].forEach(([x, c]) => car(g, x, 508.5, 0, c));
  box(g, 187, 519, 194, 526, 9, M.beige); box(g, 186.9, 521, 187.2, 525, 6, M.darkMetal, 0.5);
  [[30, 498], [33, 499], [96, 498], [120, 450], [60, 457]].forEach(([x, y], i) => person(g, x, y, 0.3, [M.kurta, M.kurta2, M.kurta3][i % 3]));
  label(g, 'Row A · 13 road-front shops + 13 shops above', 92, 481, 30, '', 2); label(g, 'Row B · 13 courtyard shops + 13 shops above', 92, 429, 30, '', 2);
  label(g, 'Courtyard', 92, 455, 6, '', 2); label(g, 'Parking ≈ 36 cars', 92, 508.5, 6, '', 2);
  mergeByMaterial(g);
  card(g, {
    name: 'Variation 3 · Market of shops (sale or rent)', short: 'Market', status: 'review',
    size: 'Site 195 × 118–172 ft (≈202 ft road frontage)', area: '28,200 sq ft ≈ 6.3 kanal · two G+1 rows ≈21,000 sq ft built',
    notes: 'v26: shops on both floors and nothing else, Saad’s call: no flats and no offices in the trade centre. Row A: 13 shops face the road (12 × 30 ft). Row B: 13 shops face a landscaped courtyard. Upstairs: each row has a first floor of 13 more shops, reached by open galleries on the courtyard side and four stair cores, so 52 shops in all. Row A’s upper shops show their fronts and signs to the road too. Around it: front parking for ≈36 cars, a service lane along the east side, a central passage to the courtyard, a guard + ATM kiosk, roof tanks and solar. Phasing: it can be built Row A first (v12: rows extended east over the old weighbridge strip).',
    finance: {
      rows: [
        ['Build cost', 'Rs 9.6–12.3 cr'],
        ['— construction (≈21,000 sq ft @ Rs 4,000–5,000)', 'Rs 8.4–10.5 cr'],
        ['— parking, courtyard, utilities, stairs, approvals', 'Rs 1.2–1.8 cr'],
        ['Units', '26 ground-floor shops + 26 first-floor shops = 52'],
        ['Sell all', '≈ Rs 24–39 cr (road shops 0.9–1.4 cr, courtyard 0.45–0.7, first floor 0.25–0.45 each)'],
        ['Profit if sold', '≈ Rs 12–29 cr over 3–5 years (≈ 7–24 cr after land at FBR)'],
        ['Rent all', '≈ Rs 8–13.5 lakh/month full → ≈ 0.75–1.3 cr/yr net (80 % let)'],
        ['Hybrid', 'Sell the 26 first-floor shops (≈ 6.5–11.7 cr, most of the build cost back) and rent the 26 ground shops (≈ 0.55–0.95 cr/yr)'],
        ['ROI', 'Sell ≈ 20–35 %/yr · Rent ≈ 6–13 %/yr · Payback: sell 3–5 yrs, rent 8–16 yrs'],
      ],
      note: 'First-floor shops rent for much less than ground-floor ones in a small town (assumed Rs 8,000–15,000 a month against Rs 30,000–50,000 on the road); a mobile, electronics or tailoring cluster is what usually fills them. Comparable: a 21-marla main-road plaza in Mangowal with 27 shops is listed at Rs 31.9 cr. Phase it and pre-sell Row A before starting Row B. Land (≈ Rs 4.8 cr FBR for the whole front zone) not included in the build cost.',
    },
    compare: { capex: 'Rs 9.6–12.3 cr', built: '≈21,000 sq ft (52 shops on 2 floors)', net: 'Sell: ≈ 12–29 cr profit · Rent: ≈ 0.75–1.3 cr/yr', roi: 'Sell ≈ 20–35 %/yr · Rent ≈ 6–13 %', payback: 'Sell 3–5 yrs · Rent 8–16 yrs', effort: 'Low (rent) to medium (sales)', risk: 'Small-town demand for first-floor shops' },
    round: 26,
  }, inPlace);
}

// ======================= VARIATIONS 4 + 5 (v25): the original layout with the pump replaced =======================
// Both keep everything the original (hybrid) front zone has apart from the petrol pump: the shop row, the mill front
// (visitor parking, sales counter, stores A + B), the staff flats and the trolley strip. Only the pump plot
// (x 0–111 × y 440–frontage, ≈11,400 sq ft ≈ 2.5 kanal, ≈115 ft of frontage) changes. In place they swap out just the
// pump; side by side they are built with a copy of the rest of the original layout.
const PLOT = [[0, 440], [111, 440], [111, ytop(111)], [0, 528]];
const ANG = Math.atan2(U[1], U[0]);
const FLAG = (m, k) => { if (k) m.userData[k] = true; return m; };
// a group whose local plan coords are (t, off): t = ft along the frontage from the west corner, off + = towards the road
function alongRoad(g) { const r = new THREE.Group(); r.position.copy(P(0, 528, 0)); r.rotation.y = ANG; g.add(r); return r; }
function keptVariant(scene, i, title, inPlace, fill) {
  mats();
  let g;
  if (inPlace) { g = new THREE.Group(); g.name = 'variant' + (i + 1) + 'InPlace'; g.userData.fronts = [i + 1]; scene.add(g); }
  else { g = frame(scene, i, title, false, true); keptParts(g, true); }
  const p = new THREE.Group(); p.name = 'plot' + (i + 1); g.add(p);
  slab(p, PLOT, 0.3, M.concrete);
  segBox(p, [0, 440], [111, 440], 1.1, 8, M.brick);                                    // wall to the trolley strip
  segBox(p, [111, 440], [111, ytop(111) - 1], 1.1, 8, M.brick);                        // wall to store B + the mill front
  slab(p, [at(0, 0), at(115, 0), at(115, 18), at(0, 18)], 0.25, M.road, -0.05);       // apron to the road
  const info = fill(p, alongRoad(p));
  tag(p, null, info); if (!inPlace) COMPARE.push(info);
  if (inPlace) label(g, title, 55, 490, 46, 'variant', 1);
  mergeByMaterial(p);
  return g;
}
const KEPT_ROWS = [
  ['— kept from the original layout: shop row, mill front, stores A + B, staff flats, trolley strip + solar roof', 'Rs 6.4–8.5 cr (0.55–0.75 + 0.55–0.8 + 0.55–0.7 + 0.37–0.5 + 3.5–4.5 + 0.85–1.2)'],
];

// ---------- 4 · shops + flats: a G+2 road-front plaza on the pump plot ----------
function v4(scene, inPlace = false) {
  return keptVariant(scene, 3, 'Variation 4 · Shops + flats', inPlace, (p, r) => {
    const v = V, FH = 11, B = { x1: 8, y1: -56, x2: 96, y2: -20 }, SW = (96 - 16) / 6, FW = (96 - 8) / 3;
    // front parking along the road (perpendicular bays)
    box(r, 2, -20, 108, -0.6, 0.05, M.asphalt, 0.3, false);
    for (let t = 12; t <= 102; t += 9) box(r, t - .2, -18, t + .2, -3.5, 0.05, M.whitePaint, 0.36, false);
    [[16.5, 0xffffff], [25.5, 0x1f2a44], [43.5, 0xb0b5ba], [61.5, 0x7a1f1f], [79.5, 0xd8d8d8], [97.5, 0x2f6db0]].forEach(([t, c]) => car(r, t, -10.5, 0, c));
    // the building: 6 shops + lobby on the ground floor, 3 flats on each upper floor, gallery at the back
    floorsBlock(r, B, 3, FH, M.beige, { parapet: 3, bands: M.slab, colSpacing: 14.7 });
    for (let i = 0; i < 6; i++) {
      const t0 = 16 + i * SW;
      FLAG(box(r, t0 + 0.5, -20.45, t0 + SW - 0.5, -19.95, 8.6, v.shopFront, 0.3), 'cut');
      FLAG(box(r, t0 + 0.2, -20.7, t0 + SW - 0.2, -20.1, 1.9, [M.trimRed, M.canopyBand, M.steelBlue][i % 3], 9.2), 'cut');
      if (i) partition(r, [t0, -55.3], [t0, -20.7], 0.8, 10);
      box(r, t0 + 2, -31, t0 + SW - 2, -29.4, 3.2, M.wood, 0.8); box(r, t0 + 1, -55, t0 + SW - 1, -53.4, 7.5, M.steelBlue, 0.8);
    }
    partition(r, [16, -55.3], [16, -20.7], 0.8, 10);
    FLAG(box(r, 9.5, -20.45, 14.5, -19.95, 8, M.glass, 0.3), 'cut');                                         // lobby door to the flats' stair
    for (let k = 0; k < 6; k++) box(r, 9.2, -54 + k * 3, 15.2, -51 + k * 3, 1.6 * (k + 1), M.plaster, 0.8);  // stair up to the 1st floor
    box(r, 8, -20, 96, -16.6, 0.45, M.canopyBand, 10.4);                                                       // canopy over the shop walk
    [1, 2].forEach(f => {
      const k = f === 1 ? 'upper' : 'upper2', z = f * FH;
      [B.x1 + FW, B.x1 + 2 * FW].forEach(t => FLAG(partition(r, [t, -55.3], [t, -20.7], z + 0.8, 10), k));
      for (let n = 0; n < 3; n++) {
        const t1 = B.x1 + n * FW;
        FLAG(box(r, t1 + 6, -20, t1 + 23, -16.4, 0.5, M.slab, z), k); FLAG(box(r, t1 + 6, -16.7, t1 + 23, -16.3, 3.2, M.glass, z + 0.5), k);   // balcony
        FLAG(box(r, t1 + 3, -52, t1 + 9.5, -46.5, 2, M.cushion, z + 0.8), k); FLAG(box(r, t1 + 15, -30, t1 + 23, -27, 2.4, M.cushion, z + 0.8), k);   // bed + sofa
        FLAG(partition(r, [t1 + 12, -55.3], [t1 + 12, -38], z + 0.8, 10), k);
      }
      FLAG(box(r, B.x1, -61, B.x2, -56, 0.6, M.slab, z), k); FLAG(box(r, B.x1, -61.2, B.x2, -60.8, 3.3, M.railBlue, z + 0.6), k);   // rear gallery
    });
    const rf = new THREE.Group(); rf.userData.cut = true; r.add(rf);
    [22, 52, 82].forEach(t => waterTank(rf, t, -50, 3 * FH)); solarArray(rf, 52, -35, 3 * FH + 1.4, 76, 18, 0.18, 0);
    sign(r, v.plazaSign, 40, 6.2, 52, -19.2, 3 * FH + 4.6); box(r, 31, -20.4, 73, -19.6, 7.5, M.darkMetal, 3 * FH + 0.4);
    // behind: residents' parking along the back wall, a small garden in the west corner, the drive down the west side
    for (let x = 26; x <= 104; x += 9) box(p, x - .2, 442, x + .2, 456, 0.05, M.whitePaint, 0.36, false);
    [[30.5, 0xffffff], [48.5, 0x2b2f36], [57.5, 0xb0b5ba], [84.5, 0x7a1f1f], [93.5, 0xd8d8d8]].forEach(([x, c]) => car(p, x, 449, Math.PI, c));
    box(p, 1.5, 441.5, 21, 470, 0.25, M.grass, 0.3, false); trees(p, [[7, 450, 0.45, 0], [15, 463, 0.4, 0]], 44);
    person(p, 12, 455, 0.3, M.kurta2); person(r, 40, -8, 0.3, M.kurta3); person(r, 70, -18, 0.3);
    label(r, '6 shops · 6 family flats above (G+2)', 52, -38, 37, '', 2); label(r, 'Front parking ≈ 11 cars', 52, -10, 6, '', 2);
    label(p, 'Residents’ parking + garden', 56, 451, 6, '', 2);
    return {
      name: 'Variation 4 · Shops + flats', short: 'Shops + flats', status: 'review',
      size: 'Pump plot ≈111 × 88–118 ft (≈115 ft of frontage) + the rest of the original layout', area: 'Plot ≈11,400 sq ft ≈ 2.5 kanal · plaza 88 × 36 ft, G+2 ≈ 9,500 sq ft',
      notes: 'v25: the original front zone with the petrol pump replaced. Kept: the shop row, the mill front (visitor parking, sales counter, stores A + B), the staff flats and the trolley strip are all exactly as in the original layout. Pump plot: a G+2 plaza set 20 ft back from the road behind a strip of front parking: 6 road-front shops (≈13 × 36 ft) and a lobby with the stair on the ground floor, and 3 family flats (≈29 × 36 ft, 2 beds, front balcony) on each upper floor, reached by an open gallery at the back. Behind: residents’ parking along the trolley-strip wall and a small garden, reached by the drive down the west side. Roof: water tanks and solar. Without the pump there are no tank-distance rules, so homes can stand here. With the old shop row the road front carries 12 shops in all.',
      finance: {
        rows: [
          ['Build cost', 'Rs 10.6–13.8 cr for the whole front zone (plaza Rs 4.2–5.3 cr)'],
          ['— plaza: ≈9,500 sq ft @ Rs 4,000–5,000', 'Rs 3.8–4.75 cr'],
          ['— front + rear parking, garden, utilities, approvals', 'Rs 0.35–0.55 cr'],
          ...KEPT_ROWS,
          ['Rent (plaza)', '6 shops × Rs 25,000–45,000 + 6 flats × Rs 25,000–40,000 a month ≈ Rs 36–61 lakh/yr'],
          ['Net per year', '≈ Rs 0.7 cr (0.55–0.9): plaza ≈ 0.28–0.47 + shop row ≈ 0.1–0.2 + trolley-roof solar ≈ 0.18–0.24'],
          ['ROI on the earning parts (plaza, shop row, trolley strip ≈ Rs 5.6–7.25 cr)', '≈ 11 %/yr (8–16 %)'],
          ['Payback', '≈ 9 years (6–13)'],
          ['Or sell the plaza', '6 shops ≈ 0.7–1.1 cr + 6 flats ≈ 0.3–0.5 cr each ≈ Rs 6–9.6 cr (the build cost back plus ≈ 1–4 cr)'],
        ],
        note: 'Planning estimates at Nov 2026 prices (±40 % until quotations); rents are assumptions to check with 2–3 local dealers. Staff flats and stores earn nothing directly: they serve the mill. Rent counted at 85 % let, less upkeep. Land already owned (≈ Rs 4.8 cr FBR for the whole front zone, not included).',
      },
      compare: { capex: 'Rs 10.6–13.8 cr (plaza 4.2–5.3) incl. the kept layout', built: 'Plaza ≈9,500 sq ft + the original layout (≈8,300 sq ft flats, 2 stores, 6 shops)', net: '≈ Rs 0.7 cr/yr (0.55–0.9) + the mill uses', roi: '≈ 11 % on the earning parts (8–16)', payback: '≈ 9 yrs (6–13)', effort: 'Low — tenants + a caretaker', risk: 'Small-town rents; families living by the mill gate' },
      round: 25,
    };
  });
}

// ---------- 5 · godowns + karahi restaurant (v26: the restaurant replaces the farm store) ----------
function v5(scene, inPlace = false) {
  return keptVariant(scene, 4, 'Variation 5 · Godowns + karahi restaurant', inPlace, (p, r) => {
    const v = V, GD = { x1: 2, y1: 442, x2: 109, y2: 480 };
    // godown: one PEB shed split into two rentable units, shutters onto the yard
    const gd = new THREE.Group(); p.add(gd);
    gableShed(gd, GD, { eave: 18, rise: 3, wall: M.cladWhite, roof: M.roofWhite, trim: M.trimGreen, cut: true, frames: 24 });
    [15, 42, 69, 96].forEach(x => shutter(gd, x, GD.y2, 'N', 12, 13, true, true));
    box(gd, 55.2, 442.6, 55.8, 479.4, 16, M.cladWhite, 0.3);
    const stack = (x1, y1, x2, y2, h) => { box(gd, x1, y1, x2, y2, 0.5, M.pallet, 0.3); box(gd, x1 + .2, y1 + .2, x2 - .2, y2 - .2, h, M.bags, 0.8); };
    [[4, 22], [26, 52], [58, 82], [86, 107]].forEach(([a, b], i) => { stack(a, 444, b, 458, [9, 10, 8.5, 10][i]); stack(a, 461, b, 471, [7, 8, 9, 6][i]); });
    // truck gate (west part of the frontage) + yard
    truck(p, 36, 487.5, Math.PI / 2, true); tractor(p, 92, 491, Math.PI / 2, true, 0);
    [[4, -1.5], [50, -1.5]].forEach(([t, o]) => { const [x, y] = at(t, o); box(p, x - 1.2, y - 1.2, x + 1.2, y + 1.2, 6, M.brick); });
    box(r, 8.5, -1.9, 9.3, -1.1, 15, M.steelDark, 0); box(r, 33.5, -1.9, 34.3, -1.1, 15, M.steelDark, 0); sign(r, v.godownSign, 26, 4.5, 21.4, -1, 13);
    block(r, { x1: 43, y1: -16, x2: 49, y2: -10 }, 1, 9, M.house, { parapet: 1 });                             // guard cabin
    label(r, 'Truck gate', 27, 4, 2, 'road', 2);
    // karahi restaurant, G+1 (east part of the frontage): karahi line behind the glass, dining hall; family hall upstairs, roof terrace
    const RR = { x1: 56, y1: -46, x2: 101, y2: -18 }, FH = 12.5, cut = (m, k) => { m.userData.cut = true; if (k) m.userData[k] = true; return m; };
    floorsBlock(r, RR, 2, FH, v.brickRed, { parapet: 3, bands: M.timber, colSpacing: 15 });
    cut(box(r, 58, -18.4, 99, -17.9, 9.5, M.glass, 0.6));                                                       // glass front onto the road
    cut(box(r, 58, -18.4, 99, -17.9, 8, M.glass, FH + 1.6), 'upper');                                           // family-hall glazing
    box(r, 56, -18, 101, -14.4, 0.45, M.timber, 10.6);                                                         // timber canopy
    for (let k = 0; k < 5; k++) {                                                                              // open karahi line behind the glass
      const t = 61 + k * 8; box(r, t - 3.2, -22.5, t + 3.2, -19.6, 3, M.stainless, 0.8);
      const w = new THREE.Mesh(new THREE.SphereGeometry(1.4, 14, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), v.wok); w.position.copy(P(t, -21, 4.9)); r.add(w);
      const f = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.4, 8), v.flame); f.position.copy(P(t, -21, 3.9)); r.add(f);
    }
    box(r, 57.5, -23, 99.5, -19.2, 1.4, M.stainless, 9.4);                                                     // steel hood over the line
    for (let t = 60; t < 98; t += 9) [-30, -38].forEach(o => { box(r, t - 2.5, o - 1.4, t + 2.5, o + 1.4, 0.2, M.wood, 2.6); });   // dining tables
    for (let t = 60; t < 98; t += 9) [-27, -38].forEach(o => { const m = box(r, t - 2.5, o - 1.4, t + 2.5, o + 1.4, 0.2, M.wood, FH + 3.4); m.userData.upper = true; });   // family-hall tables
    box(r, 96, -45, 100, -33, 0.3, M.plaster, 0.8); for (let k = 0; k < 7; k++) box(r, 96, -45 + k * 1.6, 100, -43.4 + k * 1.6, 1.7 * (k + 1), M.plaster, 0.8);   // stair to the family hall
    // roof: tanks + kitchen exhaust on the west half, terrace with umbrellas on the east half
    const rf = new THREE.Group(); rf.userData.cut = true; r.add(rf);
    waterTank(rf, 61, -42, 2 * FH); waterTank(rf, 66, -42, 2 * FH, 0xe9e9e4); cyl(rf, 64, -24, 1.1, 6, M.steelDark, 2 * FH, 10);
    [[82, -26], [92, -26], [82, -38], [92, -38]].forEach(([t, o]) => { cyl(rf, t, o, 1.4, 0.12, M.wood, 2 * FH + 2.8, 10); cyl(rf, t, o, 0.08, 6.5, M.steel, 2 * FH, 6); const u = new THREE.Mesh(new THREE.ConeGeometry(3, 1.2, 8), v.umbrella); u.position.copy(P(t, o, 2 * FH + 6.6)); rf.add(u); });
    box(r, 66, -18.6, 92, -17.9, 5.8, M.timber, 2 * FH + 0.4); sign(r, v.karahiSign, 25, 4, 79, -17.7, 2 * FH + 3.5);
    // front parking (5 bays) + tandoor and charpais by the side door on the yard
    box(r, 56, -14.2, 104, -0.6, 0.05, M.asphalt, 0.3, false);
    for (let t = 56; t <= 101; t += 9) box(r, t - .2, -13.5, t + .2, -1.5, 0.05, M.whitePaint, 0.36, false);
    [[60.5, 0xffffff], [69.5, 0x7a1f1f], [87.5, 0x1f2a44], [96.5, 0xb0b5ba]].forEach(([t, c]) => car(r, t, -7.5, 0, c));
    box(r, 50.5, -40, 55.5, -35, 4.5, M.brick, 0.3); cyl(r, 53, -37.5, 1.8, 1.2, M.stoneDark, 4.5, 12);          // tandoor
    [[52.5, -28], [52.5, -23]].forEach(([t, o]) => box(r, t - 1.8, o - 3, t + 1.8, o + 3, 1.6, v.charpai, 0.3));
    person(r, 74, -16, 0.3, M.kurta2); person(r, 77, -16.5, 0.3, M.kurta3); person(p, 30, 484, 0.3, M.kurta3); person(p, 33, 485, 0.3);
    label(p, 'Godowns · 2 units for rent', 55.5, 461, 26, '', 2); label(r, 'Karahi house · family hall above', 78.5, -32, 32, '', 2);
    label(r, 'Karahi line behind glass', 78.5, -20, 10, '', 2); label(p, 'Truck yard', 40, 500, 4, '', 2);
    return {
      name: 'Variation 5 · Godowns + karahi restaurant', short: 'Godowns + restaurant', status: 'review',
      size: 'Pump plot ≈111 × 88–118 ft (≈115 ft of frontage) + the rest of the original layout', area: 'Plot ≈11,400 sq ft ≈ 2.5 kanal · restaurant 45 × 28 ft, G+1 ≈ 2,520 sq ft · godowns 107 × 38 ft ≈ 4,070 sq ft',
      notes: 'v26: Saad’s call: a karahi restaurant instead of the farm store (v25), next to the two rentable godowns. Kept: the shop row, the mill front (visitor parking, sales counter, stores A + B), the staff flats and the trolley strip, exactly as in the original layout. Restaurant (east part of the frontage, G+1, in the karahi-house style of variation 2): an open karahi line of 5 stations behind the glass front, so the road sees the flames, a dining hall behind it, a family hall upstairs and a roof terrace with umbrellas. About 110 covers in all. A tandoor and charpais sit by the side door, with 5 parking bays in front. In the evenings, when the godowns are quiet, the truck yard doubles as overflow parking. Godowns (back wall): one PEB shed in two rentable units of ≈2,030 sq ft, two shutters each onto the yard, ≈400–450 t of bags; the mill can use them itself at harvest. Truck gate: 46 ft on the west part of the frontage, with a guard cabin; trucks load side-on along the godown face.',
      storage: {
        capacity: '≈ 400–450 t of bags (2 godown units)',
        rows: [
          ['Capacity', '≈ 400–450 t of bagged paddy, rice, wheat or fertiliser in two units of ≈ 200–225 t'],
          ['Bags', '≈ 10,000–11,000 × 40 kg paddy bags, or ≈ 8,000–9,000 × 50 kg bags'],
          ['Stacks', 'Up to ≈ 12 ft (15–16 bags) under 18 ft eaves, two rows of blocks per unit with a 6 ft aisle to the shutters'],
          ['Floor use', '≈ 4,070 sq ft · ≈ 0.1–0.11 t per sq ft'],
          ['Days of milling', '≈ 4–7 days of paddy at ≈ 65–95 t a day, if the mill uses them itself'],
        ],
        note: 'Godown demand is seasonal (harvest months), so a yearly lease to an arhti or a fertiliser dealer is safer than monthly lets.',
      },
      finance: {
        rows: [
          ['Build cost', 'Rs 9.3–12.5 cr for the whole front zone (plot Rs 2.9–4.0 cr)'],
          ['— restaurant: ≈2,520 sq ft @ Rs 5,500–7,000 (kitchen civil, family-hall finish)', 'Rs 1.4–1.75 cr'],
          ['— karahi line, tandoor, hood + extraction, cold room, furniture, roof terrace', 'Rs 0.4–0.6 cr'],
          ['— godowns: ≈4,070 sq ft PEB @ Rs 2,200–3,200', 'Rs 0.9–1.3 cr'],
          ['— yard paving, gate, guard cabin, front parking, lights, approvals', 'Rs 0.2–0.35 cr'],
          ...KEPT_ROWS,
          ['Restaurant income', 'Leased to a karahi brand ≈ Rs 2.5–4 lakh/month ≈ 0.3–0.48 cr/yr · or run it: ≈ 80–150 diners a day × Rs 1,300–1,500 ≈ 3.8–8.2 cr/yr of sales, ≈ 0.4–1.2 cr/yr net'],
          ['Godown rent', 'Rs 12–20/sq ft a month ≈ Rs 6–10 lakh/yr'],
          ['Net per year (restaurant leased)', '≈ Rs 0.8 cr (0.63–1.0): restaurant 0.3–0.48 + godowns ≈ 0.05–0.08 + shop row ≈ 0.1–0.2 + trolley-roof solar ≈ 0.18–0.24'],
          ['Net per year (run it yourselves)', '≈ Rs 0.75–1.7 cr, depending on the cook and the crowd'],
          ['ROI on the earning parts (plot, shop row, trolley strip ≈ Rs 4.3–5.95 cr)', '≈ 15 %/yr leased (11–23 %)'],
          ['Payback', '≈ 6.5 years leased (4.5–9.5)'],
        ],
        note: 'Planning estimates at Nov 2026 prices (±40 % until quotations); restaurant figures scale down variation 2’s (200 diners × Rs 1,500 for a bigger hall). A lease to an established karahi name is the low-effort route; running it pays more but needs a cook and staff of ≈ 15–20. Kitchen smoke goes up the roof stack, away from the godowns. Land already owned.',
      },
      compare: { capex: 'Rs 9.3–12.5 cr (plot 2.9–4.0) incl. the kept layout', built: 'Restaurant ≈2,520 sq ft (G+1) + godowns ≈4,070 sq ft + the original layout', net: '≈ Rs 0.8 cr/yr leased (0.63–1.0) · run it: 0.75–1.7', roi: '≈ 15 % on the earning parts (11–23)', payback: '≈ 6.5 yrs (4.5–9.5)', effort: 'Low if leased to a karahi brand; high if run', risk: 'Restaurant operator and footfall; seasonal godown demand' },
      round: 26,
    };
  });
}
