// Mill compound 3D — scene, camera, UI. Areas live in js/areas/*.js and get replaced one per round.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { initTextures, initMaterials, M, LABELS, PICK, FREE } from './lib.js';
const CUTS = [], OPTS = [], OPTS_OFF = [], UPPERS = [], FRONT_ORIG = [], FRONT_VAR = [];
import * as context from './areas/context.js';
import * as storage from './areas/storage.js';
import * as rice from './areas/rice.js';
import * as east from './areas/east.js';
import * as flour from './areas/flour.js';
import * as front from './areas/front.js';
import * as flow from './flow.js';
import * as variants from './areas/variants.js';

const wrap = document.getElementById('view');
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(wrap.clientWidth, wrap.clientHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
wrap.appendChild(renderer.domElement);
const css = new CSS2DRenderer();
css.setSize(wrap.clientWidth, wrap.clientHeight);
css.domElement.className = 'css2d';
wrap.appendChild(css.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcfdde8);
scene.fog = new THREE.Fog(0xcfdde8, 1400, 4200);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.22;

const camera = new THREE.PerspectiveCamera(38, wrap.clientWidth / wrap.clientHeight, 2, 9000);
const controls = new OrbitControls(camera, css.domElement);
controls.enableDamping = true; controls.dampingFactor = 0.08;
controls.maxPolarAngle = Math.PI * 0.495; controls.minDistance = 25; controls.maxDistance = 2600;
controls.screenSpacePanning = false;

// lights: Punjab winter afternoon, sun from the south-west
scene.add(new THREE.HemisphereLight(0xdfeaf5, 0x8c7b5c, 0.38));
const sun = new THREE.DirectionalLight(0xfff0d8, 3.4);
sun.position.set(220 - 330, 420, -290 + 380);
sun.target.position.set(220, 0, -290);
sun.castShadow = true;
sun.shadow.mapSize.set(4096, 4096);
Object.assign(sun.shadow.camera, { left: -430, right: 430, top: 430, bottom: -430, near: 50, far: 1600 });
sun.shadow.camera.updateProjectionMatrix();
sun.shadow.bias = -0.0003; sun.shadow.normalBias = 0.5;
scene.add(sun, sun.target);

initTextures(); initMaterials();
const maxA = renderer.capabilities.getMaxAnisotropy();
Object.values(M).forEach(m => { if (m && m.map) m.map.anisotropy = maxA; });
context.build(scene); storage.build(scene); rice.build(scene); east.build(scene); flour.build(scene); front.build(scene);
variants.build(scene);
const flowG = flow.build(scene);
scene.traverse(o => { if (o.userData.cut) CUTS.push(o); if (o.userData.option) OPTS.push(o); if (o.userData.optionOff) OPTS_OFF.push(o); if (o.userData.upper && !o.isCSS2DObject) UPPERS.push(o); if (o.userData.frontOrig) FRONT_ORIG.push(o); if (o.userData.frontVar) FRONT_VAR.push(o); });

// ---------- views ----------
const VIEWS = {
  overview: { pos: [700, 520, 260], tgt: [205, 0, -300] },
  top: { pos: [220, 1050, -293], tgt: [220, 0, -294] },
  gate: { pos: [232, 22, -660], tgt: [150, 10, -380] },
  front: { pos: [40, 120, -720], tgt: [110, 0, -500] },
  staff: { pos: [175, 95, -520], tgt: [52, 14, -424], front: 0 },
  holding: { pos: [236, 92, -575], tgt: [136, 10, -462], cut: 0, front: 0 },
  holdingIn: { pos: [176, 13, -520], tgt: [138, 9, -452], cut: 0, front: 0 },
  pump: { pos: [138, 98, -590], tgt: [50, 6, -468], cut: 0, front: 0 },
  rice: { pos: [300, 170, 120], tgt: [95, 10, -90] },
  saila: { pos: [140, 95, -40], tgt: [24, 32, -126], cut: true },
  hall: { pos: [150, 135, -20], tgt: [66, 0, -100], cut: true },
  drying: { pos: [-170, 210, -230], tgt: [90, 0, -290] },
  east: { pos: [560, 200, 70], tgt: [330, 10, -150] },
  hq: { pos: [168, 74, -322], tgt: [250, 15, -230] },
  hqBack: { pos: [326, 66, -146], tgt: [258, 12, -214] },
  hqIn: { pos: [300, 95, -175], tgt: [250, 8, -230], cut: 1 },
  ops: { pos: [238, 100, -58], tgt: [158, 8, -142] },
  backLane: { pos: [218, 80, 50], tgt: [146, 4, -14], cut: 0 },
  weighbridge: { pos: [292, 92, 38], tgt: [196, 4, -58], cut: 0 },
  frontStore: { pos: [252, 86, -548], tgt: [176, 8, -462], cut: 0, front: 0 },
  junction: { pos: [206, 175, -32], tgt: [208, 0, -142], cut: 0 },
  farm: { pos: [292, 175, -70], tgt: [330, 0, -192] },
  farmer: { pos: [492, 96, -108], tgt: [417, 2, -200] },
  underSolar: { pos: [338, 13, -206], tgt: [352, 6, -262], cut: 0 },
  underSolarTop: { pos: [362, 118, -168], tgt: [350, 0, -254], cut: 1 },
  storeRoof: { pos: [150, 120, -175], tgt: [22, 16, -290] },
  flour: { pos: [250, 120, -250], tgt: [345, 20, -50] },
  flourIn: { pos: [530, 46, -40], tgt: [398, 30, -62], cut: 1 },
};

// front-zone variation views (east of the compound, along the road)
{
  const Nn = [-60.5 / 228.166, 220 / 228.166], Uu = [220 / 228.166, 60.5 / 228.166];
  variants.VARIANT_CENTERS.forEach(([cx, cy], i) => {
    const px = cx + Nn[0] * 235 - Uu[0] * 45, py = cy + Nn[1] * 235 - Uu[1] * 45;
    VIEWS['var' + (i + 1)] = { pos: [px, 135, -py], tgt: [cx, 6, -(cy - 8)] };
  });
  const [ax, ay] = variants.VARIANT_CENTERS[1];
  const mx = ax + Uu[0] * 60, my = ay + Uu[1] * 60;
  VIEWS.variants = { pos: [mx + Nn[0] * 820 + Uu[0] * 60, 560, -(my + Nn[1] * 820 + Uu[1] * 60)], tgt: [mx, 0, -(my - 20)] };
}
let tween = null;
function goTo(name, instant = false) {
  const v = VIEWS[name]; if (!v) return;
  const p1 = new THREE.Vector3(...v.pos), t1 = new THREE.Vector3(...v.tgt);
  document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('on', b.dataset.view === name));
  if (v.front !== undefined && v.front !== state.front) { state.front = v.front; applyFront(); }
  if (v.cut !== undefined) { const lv = v.cut === true ? Math.max(1, state.cut) : v.cut; if (lv !== state.cut) { state.cut = lv; applyCut(); } }
  if (instant) { camera.position.copy(p1); controls.target.copy(t1); controls.update(); return; }
  tween = { p0: camera.position.clone(), t0: controls.target.clone(), p1, t1, k: 0 };
}


// ---------- toggles ----------
const state = { labels: true, flow: false, free: true, status: false, cut: 0, options: true, front: 0 };
const _lp = new THREE.Vector3(), _tg = new THREE.Vector3();
let _fc = 0;
function applyLabels() {
  const far = camera.position.distanceTo(controls.target) > 720 || camera.position.y < 70;
  LABELS.forEach(l => {
    const isFree = FREE.includes(l);
    let shown = true; for (let p = l.parent; p; p = p.parent) if (!p.visible) { shown = false; break; }
    const near = !l.userData.cutOnly || l.getWorldPosition(_lp).setY(0).distanceTo(_tg.copy(controls.target).setY(0)) < 190;
    const cutOk = !l.userData.cutOnly || (state.cut > 0 && near && !(l.userData.groundOnly && state.cut !== 2) && !(l.userData.upper && state.cut === 2));
    l.visible = shown && state.labels && !(l.userData.tier === 2 && far) && (!isFree || state.free) && cutOk;
  });
}
function applyCut() {
  CUTS.forEach(o => { o.visible = state.cut === 0; });
  UPPERS.forEach(o => { o.visible = state.cut < 2; });
  const b = document.querySelector('[data-toggle=cut]');
  if (b) { b.classList.toggle('on', state.cut > 0); b.textContent = ['Cut-away', 'Cut-away: top floor', 'Cut-away: ground floor'][state.cut]; }
  applyLabels();
}
function applyOptions() { OPTS.forEach(o => { o.visible = state.options; }); OPTS_OFF.forEach(o => { o.visible = !state.options; }); applyLabels(); }
// v18: what stands on the real front zone — 0 original (hybrid / today via Options), 1–3 the variations in place
function applyFront() {
  FRONT_ORIG.forEach(o => { o.visible = state.front === 0; });
  FRONT_VAR.forEach(o => { o.visible = o.userData.frontVar === state.front; });
  const b = document.getElementById('frontCycle');
  if (b) { b.innerHTML = `Front zone: <b>${variants.FRONT_NAMES[state.front]}</b> ▸`; b.classList.toggle('on', state.front > 0); }
  if (selBox && !visibleUp(selBox.object)) { scene.remove(selBox); selBox = null; info.hidden = true; }
  applyLabels();
}
const visibleUp = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };
document.getElementById('frontCycle').addEventListener('click', () => {
  state.front = (state.front + 1) % variants.FRONT_NAMES.length; applyFront();
  // if the front zone is out of view, fly there so the swap is seen
  const t = controls.target; if (Math.hypot(t.x - 98, -t.z - 480) > 260 || camera.position.distanceTo(t) > 900) goTo('front');
});
function applyFree() { FREE.forEach(o => { if (!o.isCSS2DObject) o.visible = state.free; }); applyLabels(); }
function applyStatus() {
  PICK.forEach(gr => {
    const st = gr.userData.info.status; const sm = M.status[st];
    gr.traverse(o => {
      if (!o.isMesh || o.material === M.ghost || o.material === M.hatch) return;
      if (state.status && sm) { o.userData.orig ??= o.material; o.material = sm; }
      else if (o.userData.orig) o.material = o.userData.orig;
    });
  });
  document.getElementById('statusLegend').hidden = !state.status;
}
document.querySelectorAll('[data-toggle]').forEach(b => {
  b.classList.toggle('on', !!state[b.dataset.toggle]);
  b.addEventListener('click', () => {
    const k = b.dataset.toggle;
    if (k === 'cut') { state.cut = (state.cut + 1) % 3; applyCut(); return; }
    state[k] = !state[k]; b.classList.toggle('on', state[k]);
    if (k === 'labels') applyLabels();
    if (k === 'flow') { flowG.visible = state.flow; document.getElementById('flowLegend').hidden = !state.flow; }
    if (k === 'free') applyFree();
    if (k === 'status') applyStatus();
    if (k === 'cut') applyCut();
    if (k === 'options') applyOptions();
  });
});
document.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => goTo(b.dataset.view)));

// legends
const fl = document.getElementById('flowLegend');
flow.FLOW_LEGEND.forEach(([n, c]) => { const d = document.createElement('div'); d.innerHTML = `<i style="background:#${c.toString(16).padStart(6, '0')}"></i>${n}`; fl.appendChild(d); });

// ---------- picking ----------
const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
let down = null, selBox = null;
const info = document.getElementById('info');
const STATUS_TXT = { existing: 'Existing', new: 'New build', relocated: 'New shed · existing machinery', free: 'Kept free', review: 'Under review', infra: 'Infrastructure' };
css.domElement.addEventListener('pointerdown', e => { down = [e.clientX, e.clientY]; });
css.domElement.addEventListener('pointerup', e => {
  if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) return;
  const r = renderer.domElement.getBoundingClientRect();
  ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ptr, camera);
  const hits = ray.intersectObjects(PICK, true);
  let hit = null;
  const shown = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };   // raycaster also hits hidden meshes (options, cut-away)
  for (const h of hits) { if (!shown(h.object)) continue; let o = h.object; while (o && !o.userData.info) o = o.parent; if (o) { hit = o; break; } }
  if (selBox) { scene.remove(selBox); selBox = null; }
  if (!hit) { info.hidden = true; return; }
  info.classList.remove('xwide');
  selBox = new THREE.BoxHelper(hit, 0xffc400); scene.add(selBox);
  const d = hit.userData.info;
  info.innerHTML = `<button class="x" aria-label="Close">×</button>
    <div class="st st-${d.status}">${STATUS_TXT[d.status] || d.status}</div>
    <h3>${d.name}</h3>
    ${d.size ? `<div class="kv"><span>Size</span>${d.size}</div>` : ''}
    ${d.area ? `<div class="kv"><span>Area</span>${d.area}</div>` : ''}
    <p>${d.notes || ''}</p>
    ${d.finance ? `<table class="fin">${d.finance.rows.map(([k, v]) => `<tr class="${k.startsWith('—') ? 'sub' : ''}${/ROI|Net per year|Payback|Profit/.test(k) ? ' hi' : ''}"><td>${k}</td><td>${v}</td></tr>`).join('')}</table><p class="fnote">${d.finance.note}</p>${d.compare ? '<button class="cmp">Compare all three</button>' : ''}` : ''}
    ${d.round ? `<div class="rd">Detailed in round ${d.round}</div>` : ''}`;
  info.classList.toggle('wide', !!d.finance);
  info.hidden = false;
  const cb = info.querySelector('.cmp'); if (cb) cb.onclick = showCompare;
  info.querySelector('.x').onclick = () => { info.hidden = true; if (selBox) { scene.remove(selBox); selBox = null; } };
});

// ---------- compare card for the front-zone variations ----------
function showCompare() {
  const C = variants.COMPARE, rows = [['Build cost', 'capex'], ['Built area', 'built'], ['Net return', 'net'], ['ROI', 'roi'], ['Payback', 'payback'], ['Effort', 'effort'], ['Main risk', 'risk']];
  info.innerHTML = `<button class="x" aria-label="Close">×</button><div class="st st-review">Front zone · 3 variations</div><h3>Compare the variations</h3>
    <div class="kv"><span>Site</span>Each uses the whole front zone, ≈28,200 sq ft ≈ 6.3 kanal (only the mill’s main road kept; the weighbridge is at the end of the main road since v20)</div>
    <table class="fin cmpt"><tr><th></th>${C.map(c => `<th>${c.short}</th>`).join('')}</tr>${rows.map(([l, k]) => `<tr><td>${l}</td>${C.map(c => `<td>${c.compare[k]}</td>`).join('')}</tr>`).join('')}</table>
    <p class="fnote">All figures are planning estimates in PKR (Nov 2026 prices), land already owned (≈ Rs 4.8 cr at FBR value, not included). Click a variation in the 3D view for its breakdown, or use “Front zone ▸” to see each one standing on the real site.</p>`;
  info.classList.add('wide', 'xwide'); info.hidden = false;
  info.querySelector('.x').onclick = () => { info.hidden = true; info.classList.remove('xwide'); };
}
document.getElementById('compareBtn').addEventListener('click', () => { goTo('variants'); showCompare(); });

// ---------- compass ----------
const needle = document.getElementById('needle');

// ---------- loop ----------
function resize() {
  const w = wrap.clientWidth, h = wrap.clientHeight;
  camera.aspect = w / h; camera.updateProjectionMatrix();
  renderer.setSize(w, h); css.setSize(w, h);
}
window.addEventListener('resize', resize);
const clock = new THREE.Clock();
let lastFar = null;
function frame() {
  const dt = Math.min(clock.getDelta(), 0.05);
  if (tween) {
    tween.k = Math.min(1, tween.k + dt / 1.3);
    const e = tween.k < .5 ? 4 * tween.k ** 3 : 1 - (-2 * tween.k + 2) ** 3 / 2;
    camera.position.lerpVectors(tween.p0, tween.p1, e); controls.target.lerpVectors(tween.t0, tween.t1, e);
    if (tween.k >= 1) tween = null;
  }
  controls.update();
  if (state.flow) flow.tick(dt);
  const far = camera.position.distanceTo(controls.target) > 720 || camera.position.y < 70;
  if (far !== lastFar) { lastFar = far; applyLabels(); }
  else if (state.cut > 0 && (++_fc % 15 === 0)) applyLabels();   // keep cut-away room labels to the area in view
  const az = Math.atan2(camera.position.x - controls.target.x, camera.position.z - controls.target.z);
  needle.style.transform = `rotate(${(az * 180 / Math.PI).toFixed(1)}deg)`;
  renderer.render(scene, camera); css.render(scene, camera);
  requestAnimationFrame(frame);
}
goTo('overview', true);
applyOptions();
applyFront();
applyFree();
frame();
window.__ready = true;
window.__view = goTo;
window.__scene = scene; window.__cam = (p, t) => { camera.position.set(...p); controls.target.set(...t); controls.update(); }; window.__renderer = renderer;
