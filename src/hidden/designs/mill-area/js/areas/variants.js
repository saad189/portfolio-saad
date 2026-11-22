// v10 — three alternative designs for the front zone, shown side by side EAST of the compound along the same
// Sargodha–Gujrat Road. The original front zone (front.js) is untouched.
// v12: the weighbridge is assumed moved elsewhere, so each variation now uses the whole front zone x 0–195
// (≈28,200 sq ft ≈ 6.3 kanal, ≈202 ft frontage); only the mill's main road (x 195–220) is kept. Moved further east,
// clear of the compound's L.
import * as THREE from 'three';
import { ytop } from '../site.js';
import { M, P, box, boxR, slab, segBox, cyl, block, label, tag, car, truck, person, trees, waterTank, acUnit, solarArray, strut, panel, railRect, shutter, mergeByMaterial, rng } from '../lib.js';

const U = [220 / 228.166, 60.5 / 228.166], N = [-U[1], U[0]];
const SHIFT = [520, 790, 1060];                                         // ft along the road from the real front zone (v12: clear of the compound)
const at = (t, off = 0) => [U[0] * t + N[0] * off, 528 + U[1] * t + N[1] * off];
const SITE = [[0, 410], [195, 410], [195, ytop(195)], [0, 528]];
const FACE_ROAD = Math.atan2(N[0], -N[1]);                              // rotation.y for a plane facing the road
export const VARIANT_CENTERS = SHIFT.map(s => [98 + U[0] * s, 480 + U[1] * s]);
export const COMPARE = [];

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
    marketSign: std({ map: textSign([['MANGOWAL TRADE CENTRE', 64, 0.45], ['Shops  ·  Offices  ·  Showrooms', 38, 0.82]], '#1f3b57', '#ffffff') }),
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
function frame(scene, i, title) {
  const g = new THREE.Group(); g.name = 'variant' + (i + 1); scene.add(g);
  const s = SHIFT[i]; g.position.set(U[0] * s, 0, -(U[1] * s));
  slab(g, [[0, 404], [226, 404], [226, ytop(226) + 1], [0, 527]], 0.12, M.soil, -0.08);
  slab(g, SITE, 0.3, M.concrete);
  slab(g, [at(0, 0), at(202, 0), at(202, 18), at(0, 18)], 0.25, M.road, -0.05);          // apron to the road
  // only the mill's main road is kept (v12: the weighbridge moves elsewhere, its strip x 160–195 joins the variation)
  slab(g, [[195.5, 410], [219.5, 410], [219.5, 588.3], [195.5, ytop(195.5)]], 0.28, M.road);
  [[195, ytop(195)], [220, 588.5]].forEach(([x, y]) => box(g, x - 1.8, y - 1.8, x + 1.8, y + 1.8, 19, M.brick));
  // boundary walls: south, west, and the wall between the variation and the mill road
  segBox(g, [0, 410], [220, 410], 1.1, 9, M.brick); segBox(g, [0, 410], [0, 528], 1.1, 9, M.brick); segBox(g, [195, 410], [195, ytop(195) - 3], 1.1, 9, M.brick);
  segBox(g, [220, 410], [220, 588.5], 1.1, 9, M.brick);
  label(g, title, 98, 480, 52, 'variant', 1);
  label(g, 'Mill main road (kept)', 207.5, 470, 6, 'road', 2);
  return g;
}
function card(g, info) { tag(g, null, info); COMPARE.push(info); }

export function build(scene) {
  mats();
  v1(scene); v2(scene); v3(scene);
}

// ======================= VARIATION 1: full petrol pump =======================
function v1(scene) {
  const g = frame(scene, 0, 'Variation 1 · Full petrol pump'), v = V;
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
  const [px, py] = [180, 566]; box(g, px - .7, py - .7, px + .7, py + .7, 6, M.stoneDark); const pl = new THREE.Mesh(new THREE.BoxGeometry(7, 22, 1.2), [v.fuelGreen, v.fuelGreen, v.fuelGreen, v.fuelGreen, v.pylonPrice, v.pylonPrice]); pl.position.copy(P(px, py, 17)); pl.rotation.y = FACE_ROAD + Math.PI; pl.castShadow = true; g.add(pl);
  box(g, 26, 516, 30, 520, 4.5, v.fuelYellow, 0.3);
  for (let t = 40; t < 128; t += 8) { const [x, y] = at(t, -3); box(g, x - 3, y - 1, x + 3, y + 1, 1.6, M.hedge, 0.3); }
  [[20, 530], [140, 560], [172, 520]].forEach(([x, y]) => { cyl(g, x, y, 0.3, 24, M.steel, 0, 8); box(g, x - 2, y - .5, x + 2, y + .5, 0.8, M.steelDark, 24); });
  arrow(g, ...at(150, 6), -Math.PI / 2 - 0.27); arrow(g, ...at(16, 6), Math.PI / 2 - 0.27); arrow(g, ...at(190, 6), -Math.PI / 2 - 0.27); arrow(g, 177, 520, Math.PI);
  arrow(g, 90, 468, Math.PI / 2); arrow(g, 40, 468, Math.PI / 2);
  label(g, 'Mosque + wuzu', 17, 426, 26, '', 2); label(g, 'Mart · café · ATM', 76, 426, 20, '', 2); label(g, 'Lube + tyre', 116, 425, 20, '', 2); label(g, 'Car wash', 144, 424, 18, '', 2);
  label(g, 'EV charging (solar)', 17, 459, 16, '', 2); label(g, '8 dispensers', 76, 491, 25, '', 2); label(g, 'Diesel · trucks', 139, 488, 31, '', 2);
  label(g, 'Entry', ...at(150, 9), 2, 'road', 2); label(g, 'Exit', ...at(16, 9), 2, 'road', 2); label(g, 'Truck entry', ...at(190, 9), 2, 'road', 2);
  label(g, 'Truck stop · 4 bays', 178, 471, 14, '', 2); label(g, 'Truckers’ dhaba', 177.5, 418, 16, '', 2);
  mergeByMaterial(g);
  card(g, {
    name: 'Variation 1 · Full petrol pump', short: 'Petrol pump', status: 'review',
    size: 'Site 195 × 118–172 ft (≈202 ft road frontage)', area: '28,200 sq ft ≈ 6.3 kanal · ≈4,100 sq ft buildings + ≈5,300 sq ft canopies/shades',
    notes: 'A full modern highway station on the whole front zone except the mill’s own main road (v12: the weighbridge is moved elsewhere and its strip becomes a truck stop: 4 truck parking bays, a truckers’ dhaba with charpais under a shade, washrooms, its own truck entry at the east end). Car forecourt (4 islands, 8 multi-product dispensers) under a lit canopy, separate 24 ft truck-diesel canopy with 2 high-flow dispensers, mosque with wuzu area, mart + café + ATM, lube + tyre bays, car wash, EV charging (2–3 DC chargers under a solar carport), air/water point, underground tanks, price pylon. Separate entry (east) and exit (west); a brick wall separates it from the mill. Branding left neutral (OMC not chosen).',
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
  });
}

// ======================= VARIATION 2: karahi restaurant + motel =======================
function v2(scene) {
  const g = frame(scene, 1, 'Variation 2 · Karahi restaurant + motel'), v = V;
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
  });
}

// ======================= VARIATION 3: built market (shops for sale or rent) =======================
function v3(scene) {
  const g = frame(scene, 2, 'Variation 3 · Market of shops'), v = V;
  // two G+2 rows: Row A faces the road, Row B faces an inner courtyard; 11 shops per row on the ground floor
  const row = (y1, y2, faceY, label_) => {
    const H1 = 12, H2 = 10.5, top = H1 + 2 * H2;
    const segs = [[10, 70], [78, 174]];                                               // 8 ft passage at x 70–78 (v12: rows run to x 174)
    segs.forEach(([a, b]) => {
      box(g, a, y1, b, y2, H1, M.plaster); box(g, a, y1, b, y2, 2 * H2, v.marketUpper, H1); box(g, a - .3, y1 - .3, b + .3, y2 + .3, 3, M.plaster, top);
      box(g, a, faceY - 0.3, b, faceY + 0.3, H1 - 1.5, v.shopFront, 0.3);              // ground-floor shop fronts
      box(g, a - .2, faceY - 2.5, b + .2, faceY + 2.5, 0.5, M.darkMetal, H1 - 0.6);     // canopy / sign shelf
      for (let x = a; x <= b + 0.1; x += 12) box(g, x - .25, faceY - 0.5, x + .25, faceY + 0.5, top, M.stoneDark);
    });
    const ss = sign(g, v.shopSigns, 164, 2.2, 92, faceY + 0.55, H1 + 0.8); return ss;
  };
  row(466, 496, 496, 'A'); row(414, 444, 444, 'B');
  // galleries for the upper floors on the courtyard side of both rows, stair cores at the ends
  [[444, 448, 448], [462, 466, 462]].forEach(([y1, y2, ry]) => [12, 22.5].forEach(z => { box(g, 10, y1, 174, y2, 0.6, M.slab, z); panel(g, [10, ry], [174, ry], z + 0.6, 3.4, M.railBlue); }));
  [[2, 414, 10, 444], [174, 414, 182, 444], [2, 466, 10, 496], [174, 466, 182, 496]].forEach(([a, b, c, d]) => box(g, a, b, c, d, 36, M.stoneDark));
  // courtyard: paving, trees, benches, fountain
  box(g, 10, 448, 174, 462, 0.4, M.tile, 0.3, false);
  trees(g, [[30, 455, 0.45, 0], [56, 455, 0.45, 0], [116, 455, 0.45, 0], [142, 455, 0.45, 0], [166, 455, 0.45, 0]], 77);
  cyl(g, 92, 455, 3.5, 1.4, M.stoneDark, 0.3, 20); cyl(g, 92, 455, 3, 0.2, M.water, 1.6, 20);
  box(g, 182.5, 410.6, 194.4, 500, 0.05, M.asphalt, 0.3, false);                                    // service lane to the back (v12)
  // roofs: tanks + solar
  [20, 50, 110, 140, 166].forEach(x => { waterTank(g, x, 470, 36); waterTank(g, x, 418, 36, 0xe9e9e4); });
  solarArray(g, 90, 481, 37, 144, 22, 0.15, 0); solarArray(g, 90, 429, 37, 144, 22, 0.15, 0);
  // name board on top of Row A, front parking + service road, guard/ATM kiosk, people
  sign(g, v.marketSign, 46, 6, 92, 497, 39); box(g, 68, 495.5, 116, 496.5, 8, M.darkMetal, 36);
  for (let x = 14; x < 178; x += 9) box(g, x - .2, 500, x + .2, 517, 0.05, M.whitePaint, 0.32, false);
  [[18.5, 0xffffff], [27.5, 0x1f2a44], [45.5, 0xb0b5ba], [63.5, 0x7a1f1f], [90.5, 0xffffff], [108.5, 0x2b2f36], [126.5, 0xd8d8d8], [135.5, 0x2f6db0], [153.5, 0xffffff], [171.5, 0x7a1f1f]].forEach(([x, c]) => car(g, x, 508.5, 0, c));
  box(g, 187, 519, 194, 526, 9, M.beige); box(g, 186.9, 521, 187.2, 525, 6, M.darkMetal, 0.5);
  [[30, 498], [33, 499], [96, 498], [120, 450], [60, 457]].forEach(([x, y], i) => person(g, x, y, 0.3, [M.kurta, M.kurta2, M.kurta3][i % 3]));
  label(g, 'Row A · 13 road-front shops + 26 units above', 92, 481, 40, '', 2); label(g, 'Row B · 13 courtyard shops + 26 units above', 92, 429, 40, '', 2);
  label(g, 'Courtyard', 92, 455, 6, '', 2); label(g, 'Parking ≈ 36 cars', 92, 508.5, 6, '', 2);
  mergeByMaterial(g);
  card(g, {
    name: 'Variation 3 · Market of shops (sale or rent)', short: 'Market', status: 'review',
    size: 'Site 195 × 118–172 ft (≈202 ft road frontage)', area: '28,200 sq ft ≈ 6.3 kanal · two G+2 rows ≈31,500 sq ft built',
    notes: 'A built market: Row A (13 shops facing the road, 12 × 30 ft) and Row B (13 shops facing a landscaped courtyard), each with two upper floors of offices / showrooms reached by galleries and four stair cores — 78 units in all (v12: rows extended east over the old weighbridge strip, +12 units). Front parking for ≈36 cars and a service lane along the east side, central passage to the courtyard, guard + ATM kiosk, roof tanks and solar. Can be built in phases (Row A first).',
    finance: {
      rows: [
        ['Build cost', 'Rs 14–18 cr'],
        ['— construction (≈31,500 sq ft @ Rs 4,000–5,000)', 'Rs 12.6–15.8 cr'],
        ['— parking, courtyard, utilities, lift, approvals', 'Rs 1.5–2.2 cr'],
        ['Units', '26 ground shops + 52 upper units = 78'],
        ['Sell all', '≈ Rs 27–42 cr (road shops 0.9–1.4 cr, courtyard 0.45–0.7, upper 0.15–0.35 each)'],
        ['Profit if sold', '≈ Rs 10–26 cr over 3–5 years (≈ 5–21 cr after land at FBR)'],
        ['Rent all', '≈ Rs 8–14 lakh/month full → ≈ 0.7–1.2 cr/yr net (80 % let)'],
        ['Hybrid', 'Sell the 52 upper units (≈ 9.5–15 cr, most of the build cost back) and rent the 26 ground shops (≈ 0.4–0.7 cr/yr)'],
        ['ROI', 'Sell ≈ 15–25 %/yr · Rent ≈ 4–8 %/yr · Payback: sell 3–5 yrs, rent 12–25 yrs'],
      ],
      note: 'Comparable: a 21-marla main-road plaza in Mangowal with 27 shops is listed at Rs 31.9 cr (≈ 1.2 cr per unit with land). Lowest effort if rented, but 78 units is a lot for a small town — phase it and pre-sell Row A before starting Row B. Land (≈ Rs 4.8 cr FBR for the whole front zone) not included in the build cost.',
    },
    compare: { capex: 'Rs 14–18 cr', built: '≈31,500 sq ft (78 units)', net: 'Sell: ≈ 10–26 cr profit · Rent: ≈ 0.7–1.2 cr/yr', roi: 'Sell ≈ 15–25 %/yr · Rent ≈ 4–8 %', payback: 'Sell 3–5 yrs · Rent 12–25 yrs', effort: 'Low (rent) to medium (sales)', risk: 'Small-town demand / sell-out speed' },
    round: 12,
  });
}
