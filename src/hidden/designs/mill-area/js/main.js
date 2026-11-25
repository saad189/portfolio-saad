// Mill compound 3D — scene, camera, UI. Areas live in js/areas/*.js and get replaced one per round.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { initTextures, initMaterials, M, LABELS, PICK, FREE } from './lib.js';
const CUTS = [], OPTS = [], OPTS_OFF = [], UPPERS = [], UPPERS2 = [], FRONT_ORIG = [], FRONT_VAR = [];
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
scene.traverse(o => { if (o.userData.cut) CUTS.push(o); if (o.userData.option) OPTS.push(o); if (o.userData.optionOff) OPTS_OFF.push(o); if (o.userData.upper && !o.isCSS2DObject) UPPERS.push(o); if (o.userData.upper2 && !o.isCSS2DObject) UPPERS2.push(o); if (o.userData.frontOrig) FRONT_ORIG.push(o); if (o.userData.frontVar) FRONT_VAR.push(o); });

// ---------- views ----------
const VIEWS = {
  overview: { pos: [700, 520, 260], tgt: [205, 0, -300] },
  top: { pos: [220, 1050, -293], tgt: [220, 0, -294] },
  gate: { pos: [232, 22, -660], tgt: [150, 10, -380] },
  front: { pos: [40, 120, -720], tgt: [110, 0, -500] },
  staff: { pos: [262, 105, -590], tgt: [146, 14, -466], front: 0 },
  staffIn: { pos: [205, 96, -470], tgt: [146, 0, -465], cut: 3, front: 0 },
  holding: { pos: [150, 85, -505], tgt: [55, 6, -425], cut: 0, front: 0 },
  holdingIn: { pos: [109, 12, -425.5], tgt: [30, 7, -425], cut: 0, front: 0 },
  pump: { pos: [150, 150, -640], tgt: [50, 0, -470], cut: 0, front: 0 },
  rice: { pos: [300, 170, 120], tgt: [95, 10, -90] },
  saila: { pos: [140, 95, -40], tgt: [24, 32, -126], cut: true },
  hall: { pos: [150, 140, 72], tgt: [112, 0, -62], cut: true },
  riceYard: { pos: [168, 128, -196], tgt: [68, 6, -112], cut: 0 },
  drying: { pos: [-170, 210, -230], tgt: [90, 0, -290] },
  east: { pos: [560, 200, 70], tgt: [330, 10, -150] },
  hq: { pos: [168, 74, -322], tgt: [250, 15, -230] },
  hqBack: { pos: [326, 66, -146], tgt: [258, 12, -214] },
  hqIn: { pos: [300, 95, -175], tgt: [250, 8, -230], cut: 1 },
  ops: { pos: [238, 100, -58], tgt: [158, 8, -142] },
  backLane: { pos: [218, 80, 50], tgt: [146, 4, -14], cut: 0 },
  weighbridge: { pos: [292, 92, 38], tgt: [196, 4, -58], cut: 0 },
  frontStore: { pos: [168, 165, -610], tgt: [150, 0, -455], cut: 0, front: 0 },
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
    const u = l.userData, cutOk = !u.cutOnly || (state.cut > 0 && near && !(u.groundOnly && state.cut !== 3) && !(u.upper && state.cut === 3) && !(u.upper2 && state.cut >= 2) && !(u.firstOnly && state.cut !== 2));
    l.visible = shown && state.labels && !(l.userData.tier === 2 && far) && (!isFree || state.free) && cutOk;
  });
}
function applyCut() {
  CUTS.forEach(o => { o.visible = state.cut === 0; });
  UPPERS.forEach(o => { o.visible = state.cut < 3; });
  UPPERS2.forEach(o => { o.visible = state.cut < 2; });          // v21: the middle step hides the 2nd floor of G+2 buildings (staff flats)
  const b = document.querySelector('[data-toggle=cut]');
  if (b) { b.classList.toggle('on', state.cut > 0); b.textContent = ['Cut-away', 'Cut-away: top floor', 'Cut-away: middle floor', 'Cut-away: ground floor'][state.cut]; }
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
    if (k === 'cut') { state.cut = (state.cut + 1) % 4; applyCut(); return; }
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
  info.innerHTML = cardHTML(d);
  info.classList.toggle('wide', !!d.finance);
  info.hidden = false;
  const cb = info.querySelector('.cmp'); if (cb) cb.onclick = showCompare;
  info.querySelector('.x').onclick = () => { info.hidden = true; if (selBox) { scene.remove(selBox); selBox = null; } };
});

// ---------- v24: info-card renderer — notes become a lead line + bullet points, finance becomes a tidy table ----------
const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ABBR = ['e.g.', 'i.e.', 'etc.', 'approx.', 'vs.', 'No.', 'Rs.', 'incl.', 'excl.', 'St.', 'Dr.', 'Mr.', 'min.', 'max.'];
function sentences(text) {
  let t = ' ' + String(text || '').trim();
  ABBR.forEach((a, i) => { t = t.split(a).join(a.replace(/\./g, `\u0001${i}`)); });
  const out = t.split(/(?<=[.!?])\s+(?=[A-Z(‘“"'0-9≈]|v\d)/).map(x => x.replace(/\u0001\d+/g, '.').trim()).filter(Boolean);
  // re-join a sentence that only closes a bracket or is a stray fragment
  return out.reduce((a, x) => { if (a.length && (x.length < 14 || /^[)\]]/.test(x))) a[a.length - 1] += ' ' + x; else a.push(x); return a; }, []);
}
function fmtLine(raw) {
  let s = esc(raw), head = '';
  const v = s.match(/^v(\d+)(?:\s*[–-]\s*v?(\d+))?\s*[:,]\s*/);
  if (v) { head += `<span class="vb">v${v[1]}${v[2] ? '–' + v[2] : ''}</span>`; s = s.slice(v[0].length); }
  const lb = s.match(/^([A-Z0-9‘][^:.;]{1,42}):\s+/);
  if (lb && lb[1].replace(/\([^)]*\)/g, '').trim().split(/\s+/).length <= 6) { head += `<b>${lb[1]}:</b> `; s = s.slice(lb[0].length); }
  if (/\(1\)/.test(s) && /\(2\)/.test(s)) {
    const parts = s.split(/\s*\((\d)\)\s*/), intro = parts[0].replace(/[:,—–-]\s*$/, ''), items = [];
    for (let i = 2; i < parts.length; i += 2) items.push(parts[i].replace(/[;,]\s*(and|or)?\s*$/, '').replace(/\.\s*$/, ''));
    return `${head}${intro}${intro ? ':' : ''}<ol>${items.map(x => `<li>${x}</li>`).join('')}</ol>`;
  }
  return head + s;
}
function finHTML(f) {
  const HI = /ROI|Net per year|Net return|Payback|Profit|^Total|^Build cost/;
  const rows = f.rows.map(([k, v]) => {
    const sub = /^[—–-]\s/.test(k), key = sub ? k.replace(/^[—–-]\s*/, '').replace(/^\p{Ll}/u, c => c.toUpperCase()) : k;
    return `<tr class="${sub ? 'sub' : ''}${!sub && HI.test(k) ? ' hi' : ''}"><td>${esc(key)}</td><td>${esc(v)}</td></tr>`;
  }).join('');
  return `<div class="sec">Costs + returns</div><table class="fin">${rows}</table>${f.note ? `<div class="fnote">${esc(f.note)}</div>` : ''}`;
}
function cardHTML(d) {
  const all = d.bullets ? d.bullets.slice() : sentences(d.notes);
  let lead = d.lead || '';
  if (!lead && all.length > 1 && !/^v\d+/.test(all[0]) && !/^[A-Z0-9‘][^:.;]{1,42}:\s/.test(all[0]) && all[0].length < 240) lead = all.shift();
  if (!lead && all.length === 1) lead = all.shift();
  const facts = [['Size', d.size], ['Area', d.area]].filter(([, v]) => v);
  return `<button class="x" aria-label="Close">×</button>
    <div class="ihead"><span class="st st-${d.status}">${STATUS_TXT[d.status] || esc(d.status)}</span>${d.round ? `<span class="rdchip">Round ${d.round}</span>` : ''}</div>
    <h3>${esc(d.name)}</h3>
    ${facts.length ? `<div class="facts">${facts.map(([k, v]) => `<div class="fact"><span>${k}</span>${esc(v)}</div>`).join('')}</div>` : ''}
    ${lead ? `<p class="lead">${fmtLine(lead)}</p>` : ''}
    ${all.length ? `<ul class="pts">${all.map(x => `<li>${fmtLine(x)}</li>`).join('')}</ul>` : ''}
    ${d.finance ? finHTML(d.finance) : ''}
    ${d.compare ? '<button class="cmp">Compare all three</button>' : ''}`;
}

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

// ---------- keyboard (v21): W/A/S/D move over the ground, Q/E rotate round the view centre, Shift = faster ----------
const keys = new Set();
const typing = (e) => { const t = e.target; return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable); };
window.addEventListener('keydown', e => {
  if (typing(e) || e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key.toLowerCase();
  if (k === 'shift') { keys.add('shift'); return; }
  if (k.length === 1 && 'wasdqe'.includes(k)) { keys.add(k); tween = null; e.preventDefault(); }
});
window.addEventListener('keyup', e => { keys.delete(e.key.toLowerCase()); if (e.key === 'Shift') keys.delete('shift'); });
window.addEventListener('blur', () => keys.clear());
const _kf = new THREE.Vector3(), _kr = new THREE.Vector3(), _km = new THREE.Vector3(), _ko = new THREE.Vector3();
function keyMove(dt) {
  if (!keys.size || (keys.size === 1 && keys.has('shift'))) return;
  const dist = camera.position.distanceTo(controls.target), fast = keys.has('shift') ? 2.5 : 1;
  camera.getWorldDirection(_kf); _kf.y = 0; if (_kf.lengthSq() < 1e-6) _kf.set(0, 0, -1); _kf.normalize();
  _kr.crossVectors(_kf, camera.up).normalize();
  _km.set(0, 0, 0);
  if (keys.has('w')) _km.add(_kf); if (keys.has('s')) _km.sub(_kf); if (keys.has('d')) _km.add(_kr); if (keys.has('a')) _km.sub(_kr);
  if (_km.lengthSq() > 0) { _km.normalize().multiplyScalar(Math.max(40, dist * 0.8) * fast * dt); camera.position.add(_km); controls.target.add(_km); }
  const rot = (keys.has('e') ? 1 : 0) - (keys.has('q') ? 1 : 0);   // v22: Q/E swapped at Saad's request
  if (rot) { _ko.copy(camera.position).sub(controls.target).applyAxisAngle(camera.up, rot * 1.3 * fast * dt); camera.position.copy(controls.target).add(_ko); }
}

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
  keyMove(dt);
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
window.__view = goTo; window.__card = cardHTML;
window.__scene = scene; window.__cam = (p, t) => { camera.position.set(...p); controls.target.set(...t); controls.update(); }; window.__renderer = renderer;
