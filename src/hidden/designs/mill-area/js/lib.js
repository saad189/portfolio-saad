// Shared helpers: textures, materials, geometry builders, labels, tagging.
// Units: 1 three.js unit = 1 ft. Plan (x east, y north) -> three (x, up, -y).
import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export const P = (x, y, h = 0) => new THREE.Vector3(x, h, -y);
export const LABELS = [];      // CSS2D labels {obj, tier}
export const PICK = [];        // tagged groups (clickable)
export const FREE = [];        // kept-free overlays
export const T = {};           // textures
export const M = {};           // materials

export function rng(seed = 7) {
  let s = seed >>> 0 || 1;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}

// ---------- textures ----------
function canvasTex(pw, ph, tileW, tileH, draw, seed = 3) {
  const c = document.createElement('canvas');
  c.width = pw; c.height = ph;
  const g = c.getContext('2d');
  draw(g, pw, ph, rng(seed));
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1 / tileW, 1 / tileH);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}
function speckle(g, w, h, r, n, a = 0.08, s = 2) {
  for (let i = 0; i < n; i++) {
    const v = r() < 0.5 ? 0 : 255;
    g.fillStyle = `rgba(${v},${v},${v},${a * (0.4 + r())})`;
    g.fillRect(r() * w, r() * h, 1 + r() * s, 1 + r() * s);
  }
}
function cladding(base, rib, tileW = 3) {
  return canvasTex(96, 64, tileW, 10, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    const n = tileW; // one rib per foot
    for (let i = 0; i < n; i++) {
      const x = (i + 0.5) * w / n;
      g.fillStyle = rib; g.fillRect(x - 3, 0, 6, h);
      g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(x - 5, 0, 2, h);
    }
  });
}
function facade({ wall, glass, frame, trim, tileW, tileH, winW, winH, sill, band, seed = 5 }) {
  const pw = 128, ph = Math.round(128 * tileH / tileW);
  return canvasTex(pw, ph, tileW, tileH, (g, w, h, r) => {
    const sx = w / tileW, sy = h / tileH;
    g.fillStyle = wall; g.fillRect(0, 0, w, h);
    speckle(g, w, h, r, 300, 0.05);
    if (trim) { g.fillStyle = trim; g.fillRect(0, h - 0.9 * sy, w, 0.9 * sy); } // floor-line band (bottom of tile)
    const x0 = (tileW - winW) / 2 * sx, y0 = h - (sill + winH) * sy;
    g.fillStyle = frame; g.fillRect(x0 - 3, y0 - 3, winW * sx + 6, winH * sy + 6);
    const grd = g.createLinearGradient(0, y0, 0, y0 + winH * sy);
    grd.addColorStop(0, glass[0]); grd.addColorStop(1, glass[1]);
    g.fillStyle = grd; g.fillRect(x0, y0, winW * sx, winH * sy);
    g.fillStyle = frame; g.fillRect(x0 + winW * sx / 2 - 1.5, y0, 3, winH * sy);
    if (band) { g.fillStyle = band; g.fillRect(0, y0 - 6, w, 3); }
  }, seed);
}

export function initTextures() {
  T.concrete = canvasTex(256, 256, 12, 12, (g, w, h, r) => {
    g.fillStyle = '#c4beb3'; g.fillRect(0, 0, w, h); speckle(g, w, h, r, 2600, 0.07);
    g.strokeStyle = 'rgba(95,88,80,.55)'; g.lineWidth = 2; g.strokeRect(1, 1, w - 2, h - 2);
  });
  T.road = canvasTex(256, 256, 12, 12, (g, w, h, r) => {
    g.fillStyle = '#a9a59d'; g.fillRect(0, 0, w, h); speckle(g, w, h, r, 3200, 0.09);
    g.strokeStyle = 'rgba(70,66,60,.5)'; g.lineWidth = 2; g.strokeRect(1, 1, w - 2, h - 2);
  }, 11);
  T.asphalt = canvasTex(256, 256, 10, 10, (g, w, h, r) => {
    g.fillStyle = '#4b4d51'; g.fillRect(0, 0, w, h); speckle(g, w, h, r, 4000, 0.12);
  });
  T.soil = canvasTex(256, 256, 24, 24, (g, w, h, r) => {
    g.fillStyle = '#b7a17d'; g.fillRect(0, 0, w, h); speckle(g, w, h, r, 5000, 0.10, 3);
    for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(120,95,60,${0.05 + r() * 0.08})`; g.beginPath(); g.ellipse(r() * w, r() * h, 6 + r() * 30, 4 + r() * 16, r() * 3, 0, 7); g.fill(); }
  });
  T.gravel = canvasTex(256, 256, 8, 8, (g, w, h, r) => {
    g.fillStyle = '#9d968a'; g.fillRect(0, 0, w, h); speckle(g, w, h, r, 6000, 0.18, 3);
  });
  T.grass = canvasTex(256, 256, 12, 12, (g, w, h, r) => {
    g.fillStyle = '#6e9a48'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 5000; i++) { g.fillStyle = r() < .5 ? 'rgba(40,80,20,.18)' : 'rgba(170,210,110,.15)'; g.fillRect(r() * w, r() * h, 1, 3); }
  });
  T.crop = canvasTex(256, 256, 20, 20, (g, w, h, r) => {
    g.fillStyle = '#8b6f4a'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 10; i++) { const y = (i + .5) * h / 10; g.fillStyle = '#5e8f37'; g.fillRect(0, y - 7, w, 14); }
    for (let i = 0; i < 2500; i++) { g.fillStyle = 'rgba(30,60,10,.25)'; g.fillRect(r() * w, r() * h, 1, 2); }
  });
  T.fields = canvasTex(1024, 1024, 1600, 1600, (g, w, h, r) => {
    const cols = ['#7d9a4c', '#8aa858', '#6f8f3e', '#a28b5e', '#937a52', '#9fb065', '#5f8a3a', '#b29a6a'];
    g.fillStyle = '#8f8a5e'; g.fillRect(0, 0, w, h);
    const cell = 64;
    for (let y = 0; y < h; y += cell) for (let x = 0; x < w; x += cell * 2) {
      const ww = cell * (1 + Math.floor(r() * 3));
      g.fillStyle = cols[Math.floor(r() * cols.length)]; g.fillRect(x, y, ww, cell);
      g.strokeStyle = 'rgba(0,0,0,.06)';
      for (let k = 2; k < cell; k += 4) { g.beginPath(); g.moveTo(x, y + k); g.lineTo(x + ww, y + k); g.stroke(); }
      g.strokeStyle = 'rgba(120,100,70,.55)'; g.lineWidth = 2; g.strokeRect(x, y, ww, cell); g.lineWidth = 1;
    }
    speckle(g, w, h, r, 9000, 0.06, 2);
  });
  T.brick = canvasTex(192, 96, 4, 2, (g, w, h, r) => {
    g.fillStyle = '#cbbba1'; g.fillRect(0, 0, w, h);
    const rows = 8, per = 6, bh = h / rows, bw = w / per;
    for (let j = 0; j < rows; j++) for (let i = -1; i < per; i++) {
      const off = j % 2 ? bw / 2 : 0, l = 150 + r() * 40;
      g.fillStyle = `rgb(${l},${l * 0.48},${l * 0.34})`;
      g.fillRect(i * bw + off + 1, j * bh + 1, bw - 2, bh - 2);
    }
  });
  T.roof = canvasTex(64, 96, 6, 3, (g, w, h) => {
    g.fillStyle = '#c9ced2'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 6; i++) { const y = (i + .5) * h / 6; g.fillStyle = '#9ea5ab'; g.fillRect(0, y - 3, w, 6); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(0, y - 6, w, 2); }
  });
  T.roofWhite = canvasTex(64, 96, 6, 3, (g, w, h) => {
    g.fillStyle = '#eceeef'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 6; i++) { const y = (i + .5) * h / 6; g.fillStyle = '#c7ccd0'; g.fillRect(0, y - 3, w, 6); }
  });
  T.cladWhite = cladding('#eef0ef', '#d3d8da');
  T.cladGrey = cladding('#dfe4e7', '#bcc4ca');
  T.cladGreen = cladding('#3f7d5b', '#2e6247');
  T.cladBlue = cladding('#3c6e9e', '#2c5680');
  T.louvre = canvasTex(64, 64, 2, 2, (g, w, h) => {
    g.fillStyle = '#2f6b4f'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 6; i++) { g.fillStyle = '#1c4433'; g.fillRect(0, i * h / 6, w, 4); }
  });
  T.shutter = canvasTex(64, 64, 4, 2, (g, w, h) => {
    g.fillStyle = '#9aa3a9'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 12; i++) { g.fillStyle = '#7d868c'; g.fillRect(0, i * h / 12, w, 2); }
  });
  T.paddy = canvasTex(256, 256, 16, 16, (g, w, h, r) => {
    g.fillStyle = '#d4a53c'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 64; i++) { g.strokeStyle = `rgba(150,105,25,${.15 + r() * .2})`; g.beginPath(); const y = i * 4 + r() * 2; g.moveTo(0, y); g.bezierCurveTo(w / 3, y + r() * 6 - 3, 2 * w / 3, y + r() * 6 - 3, w, y); g.stroke(); }
    speckle(g, w, h, r, 2000, .08);
  });
  T.hatch = canvasTex(64, 64, 8, 8, (g, w, h) => {
    g.clearRect(0, 0, w, h); g.strokeStyle = 'rgba(30,150,90,.9)'; g.lineWidth = 7;
    for (let k = -w; k < 2 * w; k += 21) { g.beginPath(); g.moveTo(k, h); g.lineTo(k + h, 0); g.stroke(); }
  });
  T.office = facade({ wall: '#f1eee8', glass: ['#3e5d73', '#7d9bb0'], frame: '#2c3338', tileW: 10, tileH: 12, winW: 8, winH: 7, sill: 3, trim: '#d8d2c8' });
  T.house = facade({ wall: '#efe6d6', glass: ['#4d6170', '#93a9b8'], frame: '#6b4a32', tileW: 12, tileH: 11, winW: 5, winH: 5, sill: 3, trim: '#cdbfa6' });
  T.flats = facade({ wall: '#e9e2d6', glass: ['#455b6b', '#8aa1b1'], frame: '#5b5e60', tileW: 10, tileH: 10, winW: 4.5, winH: 5, sill: 3, trim: '#c9bfae' });
  T.flour = facade({ wall: '#d9783a', glass: ['#38505e', '#6f8c9c'], frame: '#a8323e', tileW: 12, tileH: 13, winW: 4, winH: 5, sill: 4, trim: '#b8404b' });
  T.annex = facade({ wall: '#e08a4c', glass: ['#38505e', '#6f8c9c'], frame: '#a8323e', tileW: 10, tileH: 11, winW: 5, winH: 5.5, sill: 3, trim: '#b8404b' });
  T.lab = facade({ wall: '#f4f5f6', glass: ['#3c5a70', '#86a3b6'], frame: '#2f6fa8', tileW: 8, tileH: 12, winW: 4, winH: 4, sill: 4, band: '#2f6fa8' });
  T.cabin = facade({ wall: '#e7e3dc', glass: ['#3c5a70', '#86a3b6'], frame: '#444', tileW: 7, tileH: 10, winW: 4, winH: 3.5, sill: 3.5 });
  T.solar = canvasTex(128, 64, 6, 3.3, (g, w, h) => {
    g.fillStyle = '#c8ccd2'; g.fillRect(0, 0, w, h);
    const grd = g.createLinearGradient(0, 0, w, h); grd.addColorStop(0, '#1d2b4a'); grd.addColorStop(1, '#2d4572');
    g.fillStyle = grd; g.fillRect(2, 2, w - 4, h - 4);
    g.strokeStyle = 'rgba(180,200,230,.35)';
    for (let i = 1; i < 12; i++) { g.beginPath(); g.moveTo(i * w / 12, 2); g.lineTo(i * w / 12, h - 2); g.stroke(); }
    for (let j = 1; j < 6; j++) { g.beginPath(); g.moveTo(2, j * h / 6); g.lineTo(w - 2, j * h / 6); g.stroke(); }
  });
  T.truckArt = canvasTex(256, 128, 1, 1, (g, w, h, r) => {
    const c = ['#e63946', '#f4a261', '#2a9d8f', '#e9c46a', '#3a86ff', '#ff006e', '#8338ec', '#06d6a0'];
    for (let i = 0; i < 9; i++) { g.fillStyle = c[i % c.length]; g.fillRect(0, i * h / 9, w, h / 9 + 1); }
    for (let i = 0; i < 40; i++) { g.fillStyle = c[Math.floor(r() * c.length)]; g.beginPath(); g.arc(r() * w, r() * h, 3 + r() * 7, 0, 7); g.fill(); }
    g.fillStyle = 'rgba(255,255,255,.8)'; for (let i = 0; i < 16; i++) g.fillRect(i * 16 + 4, h - 10, 8, 6);
  });
  T.truckArt.repeat.set(1, 1);
  // see-through railing (posts every 4 ft, top + mid rail, toe board), tinted by material colour
  T.railing = canvasTex(128, 112, 4, 3.5, (g, w, h) => {
    g.clearRect(0, 0, w, h); g.fillStyle = '#ffffff';
    g.fillRect(0, 0, 6, h); g.fillRect(0, 0, w, 6); g.fillRect(0, h * 0.48, w, 4); g.fillRect(0, h - 12, w, 12);
  });
  T.railDeco = canvasTex(128, 112, 4, 3.5, (g, w, h) => {
    g.clearRect(0, 0, w, h); g.fillStyle = '#ffffff'; g.strokeStyle = '#ffffff'; g.lineWidth = 5;
    g.fillRect(0, 0, 6, h); g.fillRect(0, 0, w, 7); g.fillRect(0, h - 10, w, 10);
    g.beginPath(); g.moveTo(w / 2, h * 0.22); g.lineTo(w * 0.72, h * 0.5); g.lineTo(w / 2, h * 0.78); g.lineTo(w * 0.28, h * 0.5); g.closePath(); g.stroke();
  });
  T.grating = canvasTex(64, 64, 1, 1, (g, w, h) => {
    g.clearRect(0, 0, w, h); g.fillStyle = '#ffffff';
    for (let i = 0; i < 8; i++) g.fillRect(i * 8, 0, 3, h);
    for (let j = 0; j < 2; j++) g.fillRect(0, j * 32, w, 3);
  });
  T.ladder = canvasTex(48, 32, 1.5, 1, (g, w, h) => {
    g.clearRect(0, 0, w, h); g.fillStyle = '#ffffff'; g.fillRect(0, 0, 5, h); g.fillRect(w - 5, 0, 5, h); g.fillRect(0, h / 2 - 2, w, 4);
  });
  T.panels = canvasTex(128, 160, 4, 5, (g, w, h, r) => {
    g.fillStyle = '#5f9d6c'; g.fillRect(0, 0, w, h); speckle(g, w, h, r, 500, 0.05);
    g.strokeStyle = '#3f6f4a'; g.lineWidth = 4; g.strokeRect(2, 2, w - 4, h - 4);
    g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(6, 6, w - 12, 10);
  });
  T.jute = canvasTex(128, 48, 2.8, 1.0, (g, w, h, r) => {
    g.fillStyle = '#b08d5a'; g.fillRect(0, 0, w, h); speckle(g, w, h, r, 900, 0.10);
    for (let i = 0; i < w; i += 4) { g.fillStyle = 'rgba(90,65,35,.18)'; g.fillRect(i, 0, 1, h); }
    g.fillStyle = 'rgba(60,40,20,.55)'; g.font = 'bold 14px sans-serif'; g.fillText('MRM', w * 0.36, h * 0.62);
    g.strokeStyle = 'rgba(70,50,25,.6)'; g.lineWidth = 3; g.strokeRect(1, 1, w - 2, h - 2);
  }, 17);
  T.cladOrange = cladding('#e08a4c', '#c8733a');
  T.orangeWall = canvasTex(128, 176, 8, 22, (g, w, h, r) => {
    g.fillStyle = '#dc8044'; g.fillRect(0, 0, w, h); speckle(g, w, h, r, 500, 0.05);
    g.fillStyle = '#b8404b'; g.fillRect(0, h - 10, w, 10);                                  // plinth band
    g.fillStyle = '#3a2c26'; g.fillRect(w * 0.25, h * 0.06, w * 0.5, h * 0.07);             // high-level vent
    g.strokeStyle = '#b8404b'; g.lineWidth = 3; g.strokeRect(w * 0.25 - 2, h * 0.06 - 2, w * 0.5 + 4, h * 0.07 + 4);
  }, 31);
  T.stone = canvasTex(128, 128, 4, 4, (g, w, h, r) => {
    g.fillStyle = '#9a8f80'; g.fillRect(0, 0, w, h);
    let y = 0; while (y < h) { const rh = 10 + r() * 14; let x = -r() * 20; while (x < w) { const rw = 18 + r() * 30, l = 140 + r() * 60; g.fillStyle = `rgb(${l},${l * 0.93},${l * 0.84})`; g.fillRect(x + 1, y + 1, rw - 2, rh - 2); x += rw; } y += rh; }
  }, 23);
  T.silo = cladding('#d5dade', '#aab2b8', 3);
  T.sign = (() => {
    const c = document.createElement('canvas'); c.width = 1024; c.height = 128; const x = c.getContext('2d');
    x.fillStyle = '#fbf7ef'; x.fillRect(0, 0, 1024, 128); x.strokeStyle = '#b8404b'; x.lineWidth = 10; x.strokeRect(5, 5, 1014, 118);
    x.fillStyle = '#b8404b'; x.font = 'bold 74px Georgia, serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('AL-SADIQ FLOUR MILLS', 512, 68);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
  })();
  T.gateSign = (() => {
    const c = document.createElement('canvas'); c.width = 1024; c.height = 128; const x = c.getContext('2d');
    x.fillStyle = '#1f5e3a'; x.fillRect(0, 0, 1024, 128); x.strokeStyle = '#e8c35a'; x.lineWidth = 8; x.strokeRect(4, 4, 1016, 120);
    x.fillStyle = '#ffffff'; x.font = 'bold 56px Georgia, serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('MASHALLAH RICE MILL  ·  AL-SADIQ FLOUR MILLS', 512, 68);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
  })();
  T.beige = facade({ wall: '#d9c8ad', glass: ['#30495b', '#7894a8'], frame: '#3a3f44', tileW: 8, tileH: 11, winW: 6.4, winH: 7.5, sill: 1.5 });
  T.timber = canvasTex(64, 64, 2, 2, (g, w, h, r) => { g.fillStyle = '#8a5a36'; g.fillRect(0, 0, w, h); for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(60,35,18,${0.1 + r() * 0.2})`; g.fillRect(r() * w, 0, 1 + r() * 2, h); } }, 41);
  T.hq = facade({ wall: '#dccbb0', glass: ['#2f4a5e', '#6f8da3'], frame: '#3a3f44', tileW: 6, tileH: 12, winW: 3.2, winH: 8.5, sill: 1.2 });
  T.ops = facade({ wall: '#d9d6d0', glass: ['#34505f', '#7f9bad'], frame: '#2c3338', tileW: 8, tileH: 12, winW: 7.4, winH: 4.5, sill: 3.5, band: '#5b6168' });
  T.hqSign = (() => {
    const c = document.createElement('canvas'); c.width = 512; c.height = 256; const x = c.getContext('2d');
    x.fillStyle = 'rgba(0,0,0,0)'; x.clearRect(0, 0, 512, 256); x.fillStyle = '#f7f3ea';
    x.font = 'bold 64px Georgia, serif'; x.textAlign = 'center'; x.fillText('HEAD OFFICE', 256, 96);
    x.font = '30px Georgia, serif'; x.fillText('MashAllah Rice Mill', 256, 160); x.fillText('Al-Sadiq Flour Mills', 256, 204);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
  })();
  T.officeSign = (() => {
    const c = document.createElement('canvas'); c.width = 512; c.height = 96; const x = c.getContext('2d');
    x.clearRect(0, 0, 512, 96); x.fillStyle = '#f4efe4'; x.font = 'bold 38px Georgia, serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('HEAD OFFICE  ·  RECEPTION', 256, 50);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  T.bags = canvasTex(128, 48, 2.6, 0.9, (g, w, h) => {
    g.fillStyle = '#efeee6'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#2e7d4f'; g.fillRect(w * 0.3, h * 0.25, w * 0.4, h * 0.5);
    g.fillStyle = '#c0392b'; g.fillRect(w * 0.36, h * 0.38, w * 0.28, h * 0.12);
    g.strokeStyle = 'rgba(80,80,70,.45)'; g.lineWidth = 3; g.strokeRect(1, 1, w - 2, h - 2);
  });
}

export function initMaterials() {
  const std = (o) => new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0, ...o });
  Object.assign(M, {
    concrete: std({ map: T.concrete }),
    road: std({ map: T.road }),
    asphalt: std({ map: T.asphalt, roughness: 0.95 }),
    soil: std({ map: T.soil, roughness: 1 }),
    gravel: std({ map: T.gravel, roughness: 1 }),
    grass: std({ map: T.grass, roughness: 1 }),
    crop: std({ map: T.crop, roughness: 1 }),
    fields: std({ map: T.fields, roughness: 1 }),
    brick: std({ map: T.brick }),
    plaster: std({ color: 0xece6db }),
    roof: std({ map: T.roof, metalness: 0.35, roughness: 0.55 }),
    roofWhite: std({ map: T.roofWhite, metalness: 0.2, roughness: 0.6 }),
    cladWhite: std({ map: T.cladWhite, metalness: 0.15, roughness: 0.6 }),
    cladGrey: std({ map: T.cladGrey, metalness: 0.2, roughness: 0.6 }),
    cladGreen: std({ map: T.cladGreen, metalness: 0.3, roughness: 0.55 }),
    cladBlue: std({ map: T.cladBlue, metalness: 0.3, roughness: 0.55 }),
    trimRed: std({ color: 0xb3262d, metalness: 0.2, roughness: 0.5 }),
    trimGreen: std({ color: 0x2f6b4f, metalness: 0.2, roughness: 0.5 }),
    louvre: std({ map: T.louvre, metalness: 0.2 }),
    shutter: std({ map: T.shutter, metalness: 0.5, roughness: 0.45 }),
    steel: std({ color: 0x7c858c, metalness: 0.6, roughness: 0.4 }),
    steelDark: std({ color: 0x3d4448, metalness: 0.5, roughness: 0.5 }),
    steelGreen: std({ color: 0x3f8a5a, metalness: 0.35, roughness: 0.45 }),
    steelBlue: std({ color: 0x2f6db0, metalness: 0.35, roughness: 0.45 }),
    stainless: std({ color: 0xdfe3e6, metalness: 0.9, roughness: 0.22 }),
    yellow: std({ color: 0xf2c230, roughness: 0.5 }),
    rail: std({ color: 0xe8b62c, metalness: 0.3, roughness: 0.5 }),
    slab: std({ color: 0xb9b6b0 }),
    glass: std({ color: 0x51718a, metalness: 0.6, roughness: 0.1 }),
    office: std({ map: T.office }),
    house: std({ map: T.house }),
    flats: std({ map: T.flats }),
    flour: std({ map: T.flour }),
    annex: std({ map: T.annex }),
    flourTrim: std({ color: 0xb8404b }),
    lab: std({ map: T.lab }),
    cabin: std({ map: T.cabin }),
    paddy: std({ map: T.paddy, roughness: 1 }),
    husk: std({ color: 0xa57b45, roughness: 1 }),
    chimney: std({ color: 0x9a948c }),
    solar: std({ map: T.solar, metalness: 0.5, roughness: 0.25 }),
    whitePaint: std({ color: 0xf4f4f0 }),
    tarp: std({ color: 0x2b6cb3, roughness: 0.7 }),
    trunk: std({ color: 0x6b5138 }),
    leaf: std({ color: 0xffffff }),
    ghost: new THREE.MeshStandardMaterial({ color: 0xbdb6d6, transparent: true, opacity: 0.38, depthWrite: false, roughness: 0.9 }),
    ghostEdge: new THREE.LineBasicMaterial({ color: 0x6d5fa8, transparent: true, opacity: 0.8 }),
    hatch: new THREE.MeshBasicMaterial({ map: T.hatch, transparent: true, opacity: 0.55, depthWrite: false }),
    freeEdge: new THREE.LineBasicMaterial({ color: 0x1e9a5a }),
    truckArt: std({ map: T.truckArt }),
    cab: std({ color: 0xd8362f, roughness: 0.5 }),
    tyre: std({ color: 0x1d1d1f }),
  });
  const see = (map, color) => new THREE.MeshStandardMaterial({ map, color, alphaTest: 0.5, side: THREE.DoubleSide, metalness: 0.3, roughness: 0.5 });
  Object.assign(M, {
    railBlue: see(T.railing, 0x2f73b8), railGreen: see(T.railing, 0x3f8a5a), railYellow: see(T.railing, 0xe8b62c),
    railDeco: see(T.railDeco, 0xe0782c), grating: see(T.grating, 0x2f5f8f), ladder: see(T.ladder, 0x3f8a5a),
    panels: std({ map: T.panels, metalness: 0.3, roughness: 0.5 }),
    cream: std({ color: 0xe8dcc4, metalness: 0.2, roughness: 0.6 }),
    machine: std({ color: 0xe9e6dc, metalness: 0.25, roughness: 0.5 }),
    machineBlue: std({ color: 0x2f6db0, metalness: 0.3, roughness: 0.5 }),
    machineGreen: std({ color: 0x4f9a6a, metalness: 0.3, roughness: 0.5 }),
    motor: std({ color: 0x3b4c5c, metalness: 0.5, roughness: 0.4 }),
    bags: std({ map: T.bags }),
    pallet: std({ color: 0x9a7a52 }),
    boilerShell: std({ color: 0x8c9399, metalness: 0.6, roughness: 0.35 }),
    pedestal: std({ map: T.concrete, color: 0xd8d4cc }),
    kurta: std({ color: 0xf6f7f8 }), skin: std({ color: 0xb98a68 }),
    kurta2: std({ color: 0x8fa7b8 }), kurta3: std({ color: 0xc9b38a }),
    jute: std({ map: T.jute, roughness: 1 }),
    tarpGreen: std({ color: 0x2f7d4a, roughness: 0.7 }),
    vent: std({ color: 0x2a2d30, roughness: 0.9 }),
    tractorRed: std({ color: 0xc8262b, metalness: 0.3, roughness: 0.45 }),
    trolley: std({ color: 0x2c5fa8, metalness: 0.3, roughness: 0.55 }),
    wood: std({ color: 0x8a6a45 }),
    stone: std({ map: T.stone, roughness: 0.9 }),
    hedge: std({ color: 0x3d6b2f, roughness: 1 }),
    flowers: std({ color: 0xd94f7a, roughness: 1 }),
    water: std({ color: 0x5b7f95, metalness: 0.3, roughness: 0.15 }),
    orangeWall: std({ map: T.orangeWall }),
    cladOrange: std({ map: T.cladOrange, metalness: 0.15, roughness: 0.6 }),
    sign: std({ map: T.sign, roughness: 0.6 }),
    gateSign: std({ map: T.gateSign, roughness: 0.6, side: THREE.DoubleSide }),
    canopyWhite: std({ color: 0xf2f3f1, roughness: 0.5 }), canopyBand: std({ color: 0x2b7a4b, roughness: 0.5 }),
    floorSlab: std({ map: T.concrete, color: 0xd9d6d0 }),
    labBench: std({ color: 0xdfe6ea, roughness: 0.4 }),
    hq: std({ map: T.hq }), ops: std({ map: T.ops }), beige: std({ map: T.beige }), timber: std({ map: T.timber, roughness: 0.7 }),
    stoneDark: std({ map: T.stone, color: 0x7d7a76, roughness: 0.85 }), plasterBeige: std({ color: 0xd9c8ad, roughness: 0.9 }),
    bedSoil: std({ color: 0x5b4330, roughness: 1 }), straw: std({ color: 0xc9b27a, roughness: 1 }), polytunnel: new THREE.MeshStandardMaterial({ color: 0xf2f4f2, transparent: true, opacity: 0.55, roughness: 0.4, side: THREE.DoubleSide, depthWrite: false }),
    plant: std({ color: 0xffffff, roughness: 0.9 }),
    hqSign: new THREE.MeshStandardMaterial({ map: T.hqSign, transparent: true, roughness: 0.6 }),
    glassRail: new THREE.MeshStandardMaterial({ color: 0xbcd6e3, transparent: true, opacity: 0.35, metalness: 0.2, roughness: 0.1, depthWrite: false }),
    officeSign: new THREE.MeshStandardMaterial({ map: T.officeSign, transparent: true, roughness: 0.6 }),
    fin: std({ color: 0xb9bec4, metalness: 0.6, roughness: 0.35 }),
    darkMetal: std({ color: 0x2f3337, metalness: 0.5, roughness: 0.45 }),
    cushion: std({ color: 0x5a6f82, roughness: 0.9 }), bedding: std({ color: 0xe8e2d4, roughness: 0.9 }),
    tile: std({ color: 0xcfc8bc, roughness: 0.7 }), partition: std({ color: 0xf1eee8, roughness: 0.85 }),
    brickFace: std({ map: T.brick, color: 0xd28a6a }),
  });
  // status palette (for "colour by status")
  M.status = {
    existing: std({ color: 0x8ea3b5 }),
    new: std({ color: 0xe58a3a }),
    relocated: std({ color: 0xc9a227 }),
    free: std({ color: 0x5bbf86 }),
    review: std({ color: 0xa392d6 }),
    infra: std({ color: 0xc8c4bc }),
  };
}

// ---------- geometry ----------
// Box whose UVs are in feet on every face (so tiled textures keep real scale).
export function worldBox(w, h, d) {
  const g = new THREE.BoxGeometry(w, h, d);
  const uv = g.attributes.uv, dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let i = 0; i < 4; i++) {
    const k = f * 4 + i; uv.setXY(k, uv.getX(k) * dims[f][0], uv.getY(k) * dims[f][1]);
  }
  return g;
}
const mesh = (g, m, cast = true) => { const o = new THREE.Mesh(g, m); o.castShadow = cast; o.receiveShadow = true; return o; };

// axis-aligned box from a plan rectangle
export function box(parent, x1, y1, x2, y2, h, mat, z0 = 0, cast = true) {
  const o = mesh(worldBox(x2 - x1, h, y2 - y1), mat, cast);
  o.position.set((x1 + x2) / 2, z0 + h / 2, -(y1 + y2) / 2);
  parent.add(o); return o;
}
export const boxR = (parent, r, h, mat, z0 = 0, cast = true) => box(parent, r.x1, r.y1, r.x2, r.y2, h, mat, z0, cast);

// polygon slab (plan points), extruded up by h from z0
export function slab(parent, pts, h, mat, z0 = 0, holes = [], cast = false) {
  const s = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
  holes.forEach(hp => s.holes.push(new THREE.Path(hp.map(([x, y]) => new THREE.Vector2(x, y)))));
  const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false });
  g.rotateX(-Math.PI / 2);
  const o = mesh(g, mat, cast); o.position.y = z0; parent.add(o); return o;
}
// rounded rectangle outline (plan coords, counter-clockwise), R = corner radius, n = segments per corner
export function roundRectPts(r, R, n = 8) {
  const pts = [], c = [[r.x2 - R, r.y1 + R, -Math.PI / 2], [r.x2 - R, r.y2 - R, 0], [r.x1 + R, r.y2 - R, Math.PI / 2], [r.x1 + R, r.y1 + R, Math.PI]];
  c.forEach(([cx, cy, a0]) => { for (let i = 0; i <= n; i++) { const a = a0 + (Math.PI / 2) * i / n; pts.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]); } });
  return pts;
}
export const rectPts = (r) => [[r.x1, r.y1], [r.x2, r.y1], [r.x2, r.y2], [r.x1, r.y2]];
export const slabR = (parent, r, h, mat, z0 = 0) => slab(parent, rectPts(r), h, mat, z0);

// a box placed along a plan segment (walls, kerbs, fences)
export function segBox(parent, a, b, thick, h, mat, z0 = 0) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
  const o = mesh(worldBox(L, h, thick), mat);
  o.position.set((a[0] + b[0]) / 2, z0 + h / 2, -(a[1] + b[1]) / 2);
  o.rotation.y = Math.atan2(dy, dx);
  parent.add(o); return o;
}

// cylinder (vertical) at plan point
export function cyl(parent, x, y, r, h, mat, z0 = 0, seg = 24, rTop = r) {
  const o = mesh(new THREE.CylinderGeometry(rTop, r, h, seg), mat);
  o.position.set(x, z0 + h / 2, -y); parent.add(o); return o;
}

// Pre-engineered gable shed. r = plan rect; ridge runs along the long side unless o.axis given.
export function gableShed(parent, r, o = {}) {
  const g = new THREE.Group();
  const W0 = r.x2 - r.x1, D0 = r.y2 - r.y1;
  const axis = o.axis || (D0 >= W0 ? 'y' : 'x');
  const W = axis === 'y' ? W0 : D0, L = axis === 'y' ? D0 : W0;   // across, along
  const eave = o.eave ?? 24, rise = o.rise ?? W * 0.1, plinth = o.plinth ?? 7, oh = o.overhang ?? 2;
  const wallMat = o.wall || M.cladWhite, roofMat = o.roof || M.roofWhite, trim = o.trim || M.trimRed;
  // plinth + cladding
  // hollow brick plinth (four walls) so the floor and machinery inside stay visible in cut-away
  const pm = o.plinthMat || M.brick, t = 0.9, keep = [];
  [[0, (L + 0.6) / 2 - t / 2, W + 0.6, t], [0, -(L + 0.6) / 2 + t / 2, W + 0.6, t], [(W + 0.6) / 2 - t / 2, 0, t, L + 0.6], [-(W + 0.6) / 2 + t / 2, 0, t, L + 0.6]].forEach(([px, pz, sx, sz]) => {
    const pw = mesh(worldBox(sx, plinth, sz), pm); pw.position.set(px, plinth / 2, pz); g.add(pw); keep.push(pw);
  });
  const w = mesh(worldBox(W, eave - plinth, L), wallMat); w.position.y = plinth + (eave - plinth) / 2; g.add(w);
  // gable triangles
  const tri = new THREE.Shape([new THREE.Vector2(-W / 2, 0), new THREE.Vector2(W / 2, 0), new THREE.Vector2(0, rise)]);
  const tg = new THREE.ShapeGeometry(tri);
  // roof parts (gable triangles, sheets, gutters, fascia, ridge, rafters) live in their own sub-group so an option can swap the roof
  const rg = new THREE.Group(); g.add(rg); g.userData.roof = rg;
  [1, -1].forEach(s => { const t = mesh(tg, wallMat); t.position.set(0, eave, s * L / 2); if (s < 0) t.rotation.y = Math.PI; rg.add(t); });
  // louvre bands on long walls
  if (o.louvre !== false) [1, -1].forEach(s => {
    const lv = mesh(worldBox(0.3, 2.5, L * 0.92), M.louvre); lv.position.set(s * (W / 2 + 0.15), eave - 3, 0); g.add(lv);
  });
  // roof panels
  const a = Math.atan2(rise, W / 2), run = W / 2 + oh, sw = run / Math.cos(a) + 0.3;
  [1, -1].forEach(s => {
    const rp = mesh(worldBox(sw, 0.35, L + 2 * oh), roofMat);
    rp.position.set(s * run / 2, eave + rise - run * Math.tan(a) / 2 + 0.35, 0);
    rp.rotation.z = -s * a; rg.add(rp);
    // eave gutter
    const gt = mesh(worldBox(0.6, 0.8, L + 2 * oh), trim); gt.position.set(s * run, eave + rise - run * Math.tan(a) + 0.1, 0); rg.add(gt);
    // gable fascia (both ends)
    [1, -1].forEach(e => { const f = mesh(worldBox(sw, 0.9, 0.35), trim); f.position.set(s * run / 2, eave + rise - run * Math.tan(a) / 2 + 0.2, e * (L / 2 + oh)); f.rotation.z = -s * a; rg.add(f); });
  });
  const rc = mesh(worldBox(1.4, 0.6, L + 2 * oh), trim); rc.position.y = eave + rise + 0.6; rg.add(rc);
  // corner trims
  [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([sx, sz]) => { const c = mesh(worldBox(0.5, eave - plinth, 0.5), trim); c.position.set(sx * W / 2, plinth + (eave - plinth) / 2, sz * L / 2); g.add(c); });
  if (o.cut) { g.children.forEach(c => { if (!keep.includes(c) && c !== rg) c.userData.cut = true; }); rg.children.forEach(c => { c.userData.cut = true; }); }
  // portal frames (stay visible in cut-away)
  if (o.frames) {
    const n = Math.max(2, Math.round(L / o.frames));
    for (let i = 0; i <= n; i++) {
      const zl = -L / 2 + 0.6 + (L - 1.2) * i / n;
      [1, -1].forEach(s => {
        const cx = s * (W / 2 - 0.7);
        const col = mesh(worldBox(0.9, eave, 1.3), M.steelDark); col.position.set(cx, eave / 2, zl); g.add(col);
        strut(rg, [cx, -zl, eave - 0.6], [0, -zl, eave + rise - 0.9], 1.1, M.steelDark);
      });
    }
    strut(rg, [0, L / 2, eave + rise - 0.9], [0, -L / 2, eave + rise - 0.9], 0.5, M.steelDark);
    [1, -1].forEach(s => strut(g, [s * (W / 2 - 0.7), L / 2, eave - 0.5], [s * (W / 2 - 0.7), -L / 2, eave - 0.5], 0.5, M.steelDark));
  }
  g.position.set((r.x1 + r.x2) / 2, 0, -(r.y1 + r.y2) / 2);
  if (axis === 'x') g.rotation.y = Math.PI / 2;
  parent.add(g);
  g.userData.dims = { eave, rise, plinth };
  return g;
}

// roller shutter + canopy on a wall. face: 'E','W','N','S'; (x,y) is the point on the wall line.
export function shutter(parent, x, y, face, w = 14, h = 16, canopy = true, cut = false) {
  const g = new THREE.Group();
  const s = mesh(worldBox(w, h, 0.4), M.shutter); s.position.set(0, h / 2, 0.25); g.add(s);
  const fr = mesh(worldBox(w + 1.2, 1.2, 0.8), M.steelDark); fr.position.set(0, h + 0.6, 0.4); g.add(fr);
  if (canopy) { const c = mesh(worldBox(w + 4, 0.35, 5), canopy.isMaterial ? canopy : M.trimRed); c.position.set(0, h + 2.4, 2.6); c.rotation.x = 0.12; g.add(c); }
  g.position.copy(P(x, y, 0));
  g.rotation.y = { S: 0, E: Math.PI / 2, N: Math.PI, W: -Math.PI / 2 }[face];
  if (cut) g.children.forEach(c => { c.userData.cut = true; });
  parent.add(g); return g;
}

// flat-roof block: floors × floorH, facade material on walls, slab roof, parapet
export function block(parent, r, floors, floorH, wallMat, o = {}) {
  const g = new THREE.Group();
  const H = floors * floorH, roof = o.roof || M.slab;
  const b = mesh(worldBox(r.x2 - r.x1, H, r.y2 - r.y1), [wallMat, wallMat, roof, roof, wallMat, wallMat]);
  b.position.set((r.x1 + r.x2) / 2, H / 2, -(r.y1 + r.y2) / 2); g.add(b);
  const par = o.parapet ?? 3, pm = o.parapetMat || M.plaster, t = 0.7;
  if (par > 0) {
    box(g, r.x1, r.y1, r.x2, r.y1 + t, par, pm, H); box(g, r.x1, r.y2 - t, r.x2, r.y2, par, pm, H);
    box(g, r.x1, r.y1, r.x1 + t, r.y2, par, pm, H); box(g, r.x2 - t, r.y1, r.x2, r.y2, par, pm, H);
  }
  if (o.bands) for (let f = 1; f < floors; f++) {
    const e = 0.5; box(g, r.x1 - e, r.y1 - e, r.x2 + e, r.y2 + e, 0.8, o.bands, f * floorH - 0.4);
  }
  parent.add(g); g.userData.H = H; return g;
}

// multi-storey RC block built floor by floor so cut-away shows each floor:
// slabs + perimeter columns stay, facade walls / bands / parapet / roof are cut.
export function floorsBlock(parent, r, floors, fh, wallMat, o = {}) {
  const g = new THREE.Group(); parent.add(g);
  const H = floors * fh, t = 0.8, cut = (m) => { m.userData.cut = true; return m; };
  for (let f = 0; f < floors; f++) { const s = box(g, r.x1 + t, r.y1 + t, r.x2 - t, r.y2 - t, 0.8, M.floorSlab, f * fh, false); if (f > 0) s.userData.upper = true; }
  cut(box(g, r.x1, r.y1, r.x2, r.y2, 0.9, o.roof || M.slab, H - 0.9));
  const sp = o.colSpacing || 16;
  const colsAlong = (a, b) => { const n = Math.max(1, Math.round((b - a) / sp)); return Array.from({ length: n + 1 }, (_, i) => a + (b - a) * i / n); };
  const col = (x, y) => { for (let f = 0; f < floors; f++) { const c = box(g, x - .6, y - .6, x + .6, y + .6, fh, M.plaster, f * fh); if (f > 0) c.userData.upper = true; } };
  colsAlong(r.x1 + 0.6, r.x2 - 0.6).forEach(x => [r.y1 + 0.6, r.y2 - 0.6].forEach(y => col(x, y)));
  colsAlong(r.y1 + 0.6, r.y2 - 0.6).forEach(y => [r.x1 + 0.6, r.x2 - 0.6].forEach(x => col(x, y)));
  const sides = { S: [r.x1, r.y1, r.x2, r.y1 + t], N: [r.x1, r.y2 - t, r.x2, r.y2], W: [r.x1, r.y1, r.x1 + t, r.y2], E: [r.x2 - t, r.y1, r.x2, r.y2] };
  Object.entries(sides).forEach(([k, [a, b, c, d]]) => { if (o.skip && o.skip.includes(k)) return; cut(box(g, a, b, c, d, H, (o.sides && o.sides[k]) || wallMat)); });
  const par = o.parapet ?? 3, pm = o.parapetMat || M.plaster;
  if (par > 0) Object.entries(sides).forEach(([k, [a, b, c, d]]) => { if (o.skip && o.skip.includes(k)) return; cut(box(g, a, b, c, d, par, pm, H)); });
  if (o.bands) for (let f = 1; f < floors; f++) cut(box(g, r.x1 - .5, r.y1 - .5, r.x2 + .5, r.y2 + .5, 0.8, o.bands, f * fh - 0.4));
  g.userData.H = H; return g;
}

// ghost (under review) massing with edges
export function ghost(parent, r, h, z0 = 0) {
  const o = box(parent, r.x1, r.y1, r.x2, r.y2, h, M.ghost, z0, false);
  o.renderOrder = 2;
  const e = new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry), M.ghostEdge); o.add(e);
  return o;
}

// hatched "kept free" overlay
export function freeZone(parent, r, text) {
  const pts = Array.isArray(r) ? r : rectPts(r);
  const o = slab(parent, pts, 0.05, M.hatch, 0.6);
  o.renderOrder = 3;
  const line = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts.map(([x, y]) => P(x, y, 0.75))), M.freeEdge);
  parent.add(line);
  FREE.push(o, line);
  if (text) {
    const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length, cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
    const l = label(parent, text, cx, cy, 2, 'free', 2); FREE.push(l);
  }
  return o;
}

// ---------- labels & tagging ----------
export function label(parent, html, x, y, h = 0, cls = '', tier = 1) {
  const el = document.createElement('div');
  el.className = 'lbl ' + cls; el.innerHTML = html;
  const o = new CSS2DObject(el); o.position.copy(P(x, y, h));
  o.userData.tier = tier; parent.add(o); LABELS.push(o); return o;
}

// info: {name, status, size, area, notes, round}
export function tag(group, r, info) {
  if (r) {
    const w = +(r.x2 - r.x1).toFixed(1), d = +(r.y2 - r.y1).toFixed(1);
    info.size ??= `${w} × ${d} ft`;
    info.area ??= Math.round(w * d).toLocaleString() + ' sq ft';
  }
  group.userData.info = info; PICK.push(group); return group;
}

// ---------- props ----------
export function truck(parent, x, y, heading = 0, load = false) {
  const g = new THREE.Group();
  const add = (w, h, d, m, px, py, pz) => { const o = mesh(m === M.truckArt ? new THREE.BoxGeometry(w, h, d) : worldBox(w, h, d), m); o.position.set(px, py, pz); g.add(o); return o; };
  add(7.5, 1.2, 30, M.steelDark, 0, 2.6, 0);                // chassis
  add(7.8, 6.5, 7, M.cab, 0, 6.4, -11.5);                   // cab
  add(7.9, 1.6, 7.2, M.truckArt, 0, 10.2, -11.5);           // decorated crown
  add(8, 5.5, 21, M.truckArt, 0, 6.0, 3.5);                 // body
  if (load) add(7.6, 2.2, 20, M.tarp, 0, 9.8, 3.5);
  const wg = new THREE.CylinderGeometry(1.6, 1.6, 1.2, 14); wg.rotateZ(Math.PI / 2);
  [-11, 4, 9].forEach(z => [-3.6, 3.6].forEach(xx => { const t = mesh(wg, M.tyre); t.position.set(xx, 1.6, z); g.add(t); }));
  g.position.copy(P(x, y, 0)); g.rotation.y = heading; parent.add(g); return g;
}
export function car(parent, x, y, heading = 0, color = 0xdedede) {
  const g = new THREE.Group(), m = new THREE.MeshStandardMaterial({ color, metalness: 0.5, roughness: 0.35 });
  const b = mesh(worldBox(6, 2.4, 14.5), m); b.position.y = 2; g.add(b);
  const c = mesh(worldBox(5.4, 1.8, 7.5), M.glass); c.position.set(0, 4, 0.5); g.add(c);
  g.position.copy(P(x, y, 0)); g.rotation.y = heading; parent.add(g); return g;
}

// ---------- steelwork & plant helpers ----------
const _up = new THREE.Vector3(0, 1, 0);
// member between two points given as [x, y, h] (plan coords + height)
export function strut(parent, a, b, t, mat, round = false) {
  const A = P(...a), B = P(...b), L = A.distanceTo(B);
  const o = mesh(round ? new THREE.CylinderGeometry(t / 2, t / 2, L, 10) : worldBox(t, L, t), mat);
  o.position.copy(A).add(B).multiplyScalar(0.5);
  o.quaternion.setFromUnitVectors(_up, B.clone().sub(A).normalize());
  parent.add(o); return o;
}
// vertical see-through panel (railing, ladder) along a plan segment
export function panel(parent, a, b, z, h, mat) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const g = new THREE.PlaneGeometry(L, h), uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * L, uv.getY(i) * h);
  const o = new THREE.Mesh(g, mat); o.castShadow = true;
  o.position.set((a[0] + b[0]) / 2, z + h / 2, -(a[1] + b[1]) / 2);
  o.rotation.y = Math.atan2(b[1] - a[1], b[0] - a[0]);
  parent.add(o); return o;
}
// railing on chosen edges of a rect: edges string from 'SENW'
export function railRect(parent, x1, y1, x2, y2, z, mat = M.railBlue, edges = 'SENW', h = 3.5) {
  if (edges.includes('S')) panel(parent, [x1, y1], [x2, y1], z, h, mat);
  if (edges.includes('N')) panel(parent, [x1, y2], [x2, y2], z, h, mat);
  if (edges.includes('W')) panel(parent, [x1, y1], [x1, y2], z, h, mat);
  if (edges.includes('E')) panel(parent, [x2, y1], [x2, y2], z, h, mat);
}
// horizontal grating platform with edge beams
export function platform(parent, x1, y1, x2, y2, z, beam = M.steelBlue, rail = 'SENW') {
  const g = new THREE.PlaneGeometry(x2 - x1, y2 - y1), uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * (x2 - x1), uv.getY(i) * (y2 - y1));
  const o = new THREE.Mesh(g, M.grating); o.rotation.x = -Math.PI / 2; o.position.set((x1 + x2) / 2, z, -(y1 + y2) / 2); o.castShadow = true; o.receiveShadow = true; parent.add(o);
  box(parent, x1, y1, x2, y1 + 0.5, 0.8, beam, z - 0.8); box(parent, x1, y2 - 0.5, x2, y2, 0.8, beam, z - 0.8);
  box(parent, x1, y1, x1 + 0.5, y2, 0.8, beam, z - 0.8); box(parent, x2 - 0.5, y1, x2, y2, 0.8, beam, z - 0.8);
  if (rail) railRect(parent, x1, y1, x2, y2, z, M.railBlue, rail);
  return o;
}
// stair flight from a to b ([x, y, h] centre of bottom and top), width w
export function stairFlight(parent, a, b, w = 3, mat = M.steelBlue) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L * w / 2, ny = dx / L * w / 2;
  [1, -1].forEach(s => {
    strut(parent, [a[0] + s * nx, a[1] + s * ny, a[2]], [b[0] + s * nx, b[1] + s * ny, b[2]], 0.45, mat);
    strut(parent, [a[0] + s * nx, a[1] + s * ny, a[2] + 3.2], [b[0] + s * nx, b[1] + s * ny, b[2] + 3.2], 0.15, mat);
    strut(parent, [a[0] + s * nx, a[1] + s * ny, a[2]], [a[0] + s * nx, a[1] + s * ny, a[2] + 3.2], 0.15, mat);
  });
  const n = Math.max(2, Math.round((b[2] - a[2]) / 0.7)), ang = Math.atan2(dy, dx);
  for (let i = 1; i < n; i++) {
    const t = i / n, tr = mesh(worldBox(0.9, 0.12, w), M.steelDark, false);
    tr.position.copy(P(a[0] + dx * t, a[1] + dy * t, a[2] + (b[2] - a[2]) * t)); tr.rotation.y = ang; parent.add(tr);
  }
}
// rectangular frustum (hopper): top wT×dT at z0+h, bottom wB×dB at z0
export function hopper(parent, x, y, z0, wT, dT, wB, dB, h, mat = M.cream) {
  const v = (sx, sy, top) => [x + sx * (top ? wT : wB) / 2, z0 + (top ? h : 0), -(y + sy * (top ? dT : dB) / 2)];
  const c = [[-1, -1], [1, -1], [1, 1], [-1, 1]], pos = [], uvs = [];
  for (let i = 0; i < 4; i++) {
    const [ax, ay] = c[i], [bx, by] = c[(i + 1) % 4];
    const q = [v(ax, ay, false), v(bx, by, false), v(bx, by, true), v(ax, ay, true)];
    [0, 1, 2, 0, 2, 3].forEach(k => pos.push(...q[k]));
    [[0, 0], [1, 0], [1, 1], [0, 0], [1, 1], [0, 1]].forEach(u => uvs.push(...u));
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.computeVertexNormals();
  const o = new THREE.Mesh(g, mat); o.material.side = THREE.DoubleSide; o.castShadow = true; o.receiveShadow = true; parent.add(o); return o;
}
// vertical cylindrical vessel with conical bottom (stainless soak tank etc.)
export function coneTank(parent, x, y, zCone, r, hCyl, hCone, mat = M.stainless, dome = true) {
  cyl(parent, x, y, r, hCyl, mat, zCone + hCone, 28);
  const c = mesh(new THREE.CylinderGeometry(r, 0.7, hCone, 28), mat); c.position.copy(P(x, y, zCone + hCone / 2)); parent.add(c);
  cyl(parent, x, y, 0.5, 1.5, M.steelDark, zCone - 1.5, 10);
  if (dome) { const d = mesh(new THREE.SphereGeometry(r, 28, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat); d.scale.y = 0.22; d.position.copy(P(x, y, zCone + hCone + hCyl)); parent.add(d); }
  cyl(parent, x, y, r + 0.12, 0.4, M.steelDark, zCone + hCone, 28);
}
// bucket elevator: casing from z0 to h, head box with grating platform + railing, flanges every 8 ft, side ladder
export function elevator(parent, x, y, h, o = {}) {
  const w = o.w ?? 2.2, d = o.d ?? 3.4, mat = o.mat || M.steelGreen;
  box(parent, x - 2, y - 2.5, x + 2, y + 2.5, 2.5, M.pedestal);
  box(parent, x - w / 2, y - d / 2, x + w / 2, y + d / 2, h - 2.5, mat, 2.5);
  for (let z = 10; z < h - 4; z += 8) box(parent, x - w / 2 - .2, y - d / 2 - .2, x + w / 2 + .2, y + d / 2 + .2, 0.35, mat, z);
  box(parent, x - 1.8, y - 2.4, x + 1.8, y + 2.4, 3.6, M.steelBlue, h);
  const pw = o.platform ?? 3.6;
  platform(parent, x - pw, y - pw, x + pw, y + pw, h - 0.2, M.steelBlue, 'SENW');
  panel(parent, [x + w / 2 + 0.6, y - 0.75], [x + w / 2 + 0.6, y + 0.75], 3, h - 3, M.ladder);
  return h + 3.6;
}
// simple person for scale (≈5.9 ft)
export function person(parent, x, y, z = 0, cloth = M.kurta, rake = false) {
  const b = mesh(new THREE.CapsuleGeometry(0.75, 3.4, 4, 10), cloth); b.position.copy(P(x, y, z + 0.75 + 1.7 + 0.4)); parent.add(b);
  const hd = mesh(new THREE.SphereGeometry(0.42, 12, 8), M.skin); hd.position.copy(P(x, y, z + 5.45)); parent.add(hd);
  if (rake) { strut(parent, [x + 0.6, y, z + 3.8], [x + 4.5, y + 1.5, z + 0.2], 0.12, M.wood); strut(parent, [x + 4.5, y + 0.2, z + 0.2], [x + 4.5, y + 2.8, z + 0.2], 0.25, M.wood); }
}
// tractor (Massey-240 style) with optional tipping trolley; heading as for truck()
export function tractor(parent, x, y, heading = 0, trolley = true, tip = 0) {
  const g = new THREE.Group();
  const add = (w, h, d, m, px, py, pz) => { const o = mesh(worldBox(w, h, d), m); o.position.set(px, py, pz); g.add(o); return o; };
  add(2.6, 2.2, 5.5, M.tractorRed, 0, 3.6, -3.5);                     // bonnet
  add(3.2, 1.2, 3, M.steelDark, 0, 3.2, -0.3);                        // gearbox / seat base
  add(1.6, 1.4, 1.2, M.tyre, 0, 4.6, 0.6);                            // seat
  add(5.4, 0.3, 2.6, M.tractorRed, 0, 5.2, 0.4);                      // mudguards
  cylAt(g, 0.18, 2.2, M.steelDark, -0.9, 6, -5.5);                    // exhaust
  const rw = new THREE.CylinderGeometry(2.4, 2.4, 1.4, 18); rw.rotateZ(Math.PI / 2);
  const fw = new THREE.CylinderGeometry(1.25, 1.25, 0.8, 14); fw.rotateZ(Math.PI / 2);
  [-2.5, 2.5].forEach(sx => { const r = mesh(rw, M.tyre); r.position.set(sx, 2.4, 0.4); g.add(r); const f = mesh(fw, M.tyre); f.position.set(sx * 0.7, 1.25, -5.6); g.add(f); });
  if (trolley) {
    const t = new THREE.Group(); t.position.set(0, 2.4, 9.5); g.add(t);
    const bed = new THREE.Group(); bed.position.set(0, 0, 5); bed.rotation.x = tip; t.add(bed);
    const b2 = (w, h, d, m, px, py, pz) => { const o = mesh(worldBox(w, h, d), m); o.position.set(px, py, pz); bed.add(o); };
    b2(7, 0.4, 12, M.trolley, 0, 0.6, -5); b2(0.3, 2.6, 12, M.trolley, 3.4, 2.1, -5); b2(0.3, 2.6, 12, M.trolley, -3.4, 2.1, -5); b2(7, 2.6, 0.3, M.trolley, 0, 2.1, -10.9);
    b2(6.4, 2.0, 11, M.paddy, 0, 1.8, -5);
    const tw = new THREE.CylinderGeometry(1.4, 1.4, 1, 14); tw.rotateZ(Math.PI / 2);
    [-3, 3].forEach(sx => { const w = mesh(tw, M.tyre); w.position.set(sx, -1, 0); t.add(w); });
    const hitch = mesh(worldBox(0.4, 0.4, 4), M.steelDark); hitch.position.set(0, -0.6, -2); t.add(hitch);
  }
  g.position.copy(P(x, y, 0)); g.rotation.y = heading; parent.add(g); return g;
}
function cylAt(g, r, h, m, x, y, z) { const o = mesh(new THREE.CylinderGeometry(r, r, h, 8), m); o.position.set(x, y, z); g.add(o); }
// merge static meshes by material (fewer draw calls); keeps cut-away flag separate
export function mergeByMaterial(group) {
  // tagged sub-groups (own click target) are merged on their own first
  const subs = []; group.traverse(o => { if (o !== group && o.isGroup && o.userData.info) subs.push(o); });
  const inSub = (o) => { for (let p = o.parent; p && p !== group; p = p.parent) if (p.userData.info) return true; return false; };
  subs.filter(sg => !inSub(sg)).forEach(sg => mergeByMaterial(sg));
  group.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(group.matrixWorld).invert(), buckets = new Map(), done = [];
  group.traverse(o => {
    if (!o.isMesh || o.isInstancedMesh || Array.isArray(o.material) || o.userData.keep || o.children.length || inSub(o)) return;
    let g = o.geometry.clone(); if (g.index) g = g.toNonIndexed();
    Object.keys(g.attributes).forEach(k => { if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k); });
    if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
    if (!g.attributes.normal) g.computeVertexNormals();
    g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld));
    let cut = !!o.userData.cut, upper = !!o.userData.upper;
    for (let p = o.parent; p && p !== group.parent; p = p.parent) { cut = cut || !!p.userData.cut; upper = upper || !!p.userData.upper; }
    const key = o.material.uuid + (o.castShadow ? 'c' : 'n') + (cut ? 'x' : '') + (upper ? 'u' : '');
    if (!buckets.has(key)) buckets.set(key, { mat: o.material, cast: o.castShadow, cut, upper, geos: [] });
    buckets.get(key).geos.push(g); done.push(o);
  });
  done.forEach(o => o.parent.remove(o));
  for (const b of buckets.values()) {
    const m = new THREE.Mesh(mergeGeometries(b.geos), b.mat); m.castShadow = b.cast; m.receiveShadow = true; m.userData.cut = b.cut; m.userData.upper = b.upper; group.add(m);
  }
  const empties = []; group.traverse(o => { if (o !== group && o.isGroup && o.children.length === 0) empties.push(o); });
  empties.forEach(o => o.parent.remove(o));
  return group;
}

// ---------- interior furniture (axis-aligned, plan coords; z = floor level) ----------
export function partition(parent, a, b, z, h = 9.4, mat = M.partition) { return segBox(parent, a, b, 0.4, h, mat, z); }
export function desk(parent, x, y, z, face = 'N') {           // desk + chair; 'face' = direction the sitter looks
  const v = face === 'N' || face === 'S';
  box(parent, x - (v ? 2.5 : 1.25), y - (v ? 1.25 : 2.5), x + (v ? 2.5 : 1.25), y + (v ? 1.25 : 2.5), 0.15, M.wood, z + 2.45);
  box(parent, x - (v ? 2.3 : 1.1), y - (v ? 1.1 : 2.3), x + (v ? 2.3 : 1.1), y + (v ? 1.1 : 2.3), 2.45, M.darkMetal, z);
  const d = { N: [0, -2.4], S: [0, 2.4], E: [-2.4, 0], W: [2.4, 0] }[face];
  box(parent, x + d[0] - .8, y + d[1] - .8, x + d[0] + .8, y + d[1] + .8, 1.6, M.cushion, z);
  box(parent, x + d[0] * 1.35 - (v ? .8 : .15), y + d[1] * 1.35 - (v ? .15 : .8), x + d[0] * 1.35 + (v ? .8 : .15), y + d[1] * 1.35 + (v ? .15 : .8), 3.2, M.cushion, z);
  box(parent, x - .7, y - .1, x + .7, y + .1, 1.0, M.darkMetal, z + 2.6);                // monitor
}
export function table(parent, x1, y1, x2, y2, z, seats = true) {
  box(parent, x1, y1, x2, y2, 0.2, M.wood, z + 2.4); box(parent, x1 + 1, y1 + 1, x2 - 1, y2 - 1, 2.4, M.darkMetal, z);
  if (!seats) return;
  const along = (x2 - x1) >= (y2 - y1);
  if (along) for (let x = x1 + 1.5; x < x2 - 0.5; x += 2.6) [y1 - 1.1, y2 + 1.1].forEach(y => box(parent, x - .7, y - .7, x + .7, y + .7, 1.6, M.cushion, z));
  else for (let y = y1 + 1.5; y < y2 - 0.5; y += 2.6) [x1 - 1.1, x2 + 1.1].forEach(x => box(parent, x - .7, y - .7, x + .7, y + .7, 1.6, M.cushion, z));
}
export function sofa(parent, x1, y1, x2, y2, z) { box(parent, x1, y1, x2, y2, 1.5, M.cushion, z); }
export function bed(parent, x1, y1, x2, y2, z) { box(parent, x1, y1, x2, y2, 1.4, M.wood, z); box(parent, x1 + .2, y1 + .2, x2 - .2, y2 - .2, 0.6, M.bedding, z + 1.4); }
export function counter(parent, x1, y1, x2, y2, z, h = 3, mat = M.labBench) { box(parent, x1, y1, x2, y2, h, mat, z); }

// solar panel array (one box, UVs in feet); rotX tilts the south edge down, rotZ follows a roof slope
export function solarArray(parent, cx, cy, z, len, depth, rotX = 0, rotZ = 0) {
  const g = new THREE.BoxGeometry(len, 0.25, depth), uv = g.attributes.uv;
  for (let k = 0; k < uv.count; k++) uv.setXY(k, uv.getX(k) * len, uv.getY(k) * depth);
  const o = new THREE.Mesh(g, M.solar); o.position.copy(P(cx, cy, z)); o.rotation.set(rotX, 0, rotZ); o.castShadow = true; o.receiveShadow = true; parent.add(o); return o;
}

// instanced plants: list of [x, y, z, sx, sy, sz, hexColor]; shape: 'ball' | 'cone' | 'box'
export function plants(parent, list, shape = 'ball') {
  if (!list.length) return;
  const geo = shape === 'cone' ? new THREE.ConeGeometry(1, 1, 6) : shape === 'box' ? new THREE.BoxGeometry(1, 1, 1) : new THREE.IcosahedronGeometry(1, 0);
  if (shape === 'cone' || shape === 'box') geo.translate(0, 0.5, 0);
  const im = new THREE.InstancedMesh(geo, M.plant, list.length);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3(), c = new THREE.Color();
  list.forEach(([x, y, z, sx, sy, sz, col], i) => { m.compose(p.set(x, z, -y), q, s.set(sx, sy, sz)); im.setMatrixAt(i, m); im.setColorAt(i, c.set(col)); });
  im.castShadow = true; im.receiveShadow = true; parent.add(im); return im;
}

// rooftop water tank on a small steel stand (typical Punjab roof)
export function waterTank(parent, x, y, roofH, color = 0x1e1f22) {
  const m = new THREE.MeshStandardMaterial({ color, roughness: 0.6 });
  box(parent, x - 2.6, y - 2.6, x + 2.6, y + 2.6, 0.4, M.steelDark, roofH + 2);
  [[-2.3, -2.3], [2.3, -2.3], [-2.3, 2.3], [2.3, 2.3]].forEach(([a, b]) => box(parent, x + a - .15, y + b - .15, x + a + .15, y + b + .15, 2, M.steelDark, roofH));
  const t = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.3, 4.6, 18), m); t.position.copy(P(x, y, roofH + 4.7)); t.castShadow = true; parent.add(t);
  const lid = new THREE.Mesh(new THREE.SphereGeometry(2.3, 18, 6, 0, Math.PI * 2, 0, Math.PI / 2), m); lid.scale.y = 0.35; lid.position.copy(P(x, y, roofH + 7)); parent.add(lid);
}
export function acUnit(parent, x, y, roofH) { box(parent, x - 1.6, y - 0.7, x + 1.6, y + 0.7, 2.2, M.whitePaint, roofH); }

// instanced trees: list of [x, y, scale, kind] kind 0 = round (shisham/neem), 1 = tall (eucalyptus), 2 = palm-ish small
export function trees(parent, list, seed = 9) {
  const r = rng(seed), n = list.length;
  const trunkG = new THREE.CylinderGeometry(0.6, 0.9, 1, 6); trunkG.translate(0, 0.5, 0);
  const roundG = new THREE.IcosahedronGeometry(1, 1), tallG = new THREE.ConeGeometry(1, 1, 7);
  const trunks = new THREE.InstancedMesh(trunkG, M.trunk, n);
  const rounds = new THREE.InstancedMesh(roundG, M.leaf, n), talls = new THREE.InstancedMesh(tallG, M.leaf, n);
  [trunks, rounds, talls].forEach(o => { o.castShadow = true; o.receiveShadow = true; });
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), c = new THREE.Color();
  let ri = 0, ti = 0;
  list.forEach(([x, y, sc = 1, kind = 0], i) => {
    sc *= 0.8 + r() * 0.4;
    const th = kind === 1 ? 26 * sc : 9 * sc;
    m.compose(p.set(x, 0, -y), q.identity(), s.set(sc, th, sc)); trunks.setMatrixAt(i, m);
    c.setHSL(0.24 + r() * 0.06, 0.38 + r() * 0.15, 0.27 + r() * 0.08);
    if (kind === 1) { m.compose(p.set(x, th * 0.55, -y), q, s.set(5 * sc, 30 * sc, 5 * sc)); talls.setMatrixAt(ti, m); talls.setColorAt(ti++, c); }
    else { m.compose(p.set(x, th + 6 * sc, -y), q.setFromEuler(new THREE.Euler(0, r() * 6, 0)), s.set(11 * sc, 8 * sc, 11 * sc)); rounds.setMatrixAt(ri, m); rounds.setColorAt(ri++, c); }
  });
  rounds.count = ri; talls.count = ti;
  parent.add(trunks, rounds, talls);
}
