import * as T from './vendor/three.module.js';
import {GLTFLoader} from './vendor/addons/loaders/GLTFLoader.js';
import {RoomEnvironment} from './vendor/addons/environments/RoomEnvironment.js';
import {CARS} from './src/cars/car-catalog.js';
import {prepareCarMaterials} from './src/cars/car-materials.js';

/* Standalone car showcase: its own small renderer, created on first open and
   paused while the dialog is closed, so the main simulation is not affected. */
const $ = (s, r = document) => r.querySelector(s);
const loader = new GLTFLoader();
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = v => String(v).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));

let dialog, stage, canvas, statusBox, infoBox, creditBox, renderer, scene, camera, shadow, holder = null;
let index = 0, token = 0, raf = 0, lastTime = 0, autoRotate = !reduced, ready = false;
const view = {yaw: .6, pitch: .2, dist: 6, min: 3, max: 14, height: 1},
  goal = {yaw: .6, pitch: .2, dist: 6};
const pointers = new Map();
let pinch = 0;

function markup() {
  dialog = document.createElement('dialog');
  dialog.id = 'cars-dialog';
  dialog.setAttribute('aria-label', 'Car showcase');
  dialog.innerHTML =
    '<div class="dialog-heading"><div><p class="eyebrow">CAR SHOWCASE</p><h2>Choose a car.</h2></div><button class="dialog-close quiet" aria-label="Close car showcase">✕</button></div>' +
    '<div class="cars-layout"><div><div class="cars-stage"><canvas tabindex="0" aria-label="3D car view. Drag to rotate, scroll or pinch to zoom, arrow keys to orbit."></canvas>' +
    '<div class="cars-info"></div><div class="cars-status" role="status">LOADING…</div>' +
    '<div class="cars-tools"><button type="button" data-cars-spin aria-pressed="' + autoRotate + '">Auto-rotate</button><button type="button" data-cars-reset>Reset view</button></div>' +
    '<div class="cars-step"><button type="button" data-cars-prev aria-label="Previous car">‹</button><button type="button" data-cars-next aria-label="Next car">›</button></div></div>' +
    '<p class="cars-credit"></p></div>' +
    '<div class="cars-list" role="group" aria-label="Cars">' +
    CARS.map((c, i) => '<button type="button" data-car="' + i + '" aria-pressed="false"><small>CAR 0' + (i + 1) + '</small><strong>' + esc(c.name) + '</strong></button>').join('') +
    '</div></div>';
  document.body.appendChild(dialog);
  stage = $('.cars-stage', dialog); canvas = $('canvas', dialog); statusBox = $('.cars-status', dialog);
  infoBox = $('.cars-info', dialog); creditBox = $('.cars-credit', dialog);
}

function setup() {
  renderer = new T.WebGLRenderer({canvas, antialias: true, alpha: true, powerPreference: 'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  scene = new T.Scene();
  const pmrem = new T.PMREMGenerator(renderer), room = new RoomEnvironment();
  scene.environment = pmrem.fromScene(room, .04).texture; room.dispose?.(); pmrem.dispose();
  scene.environmentIntensity = 1;
  const key = new T.DirectionalLight('#fff1dc', 1.6); key.position.set(-5, 7, 6); scene.add(key);
  scene.add(new T.HemisphereLight('#dbe9ff', '#26301f', .35));
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'), grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(0,0,0,.62)'); grad.addColorStop(.55, 'rgba(0,0,0,.28)'); grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad; g.fillRect(0, 0, 128, 128);
  shadow = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({map: new T.CanvasTexture(c), transparent: true, depthWrite: false}));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = .003; shadow.visible = false; scene.add(shadow);
  camera = new T.PerspectiveCamera(32, 1, .1, 120);
  new ResizeObserver(resize).observe(stage);
  bindInput();
  ready = true;
}

function resize() {
  if (!renderer) return;
  const w = Math.max(1, stage.clientWidth), h = Math.max(1, stage.clientHeight);
  renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
}

function bindInput() {
  canvas.addEventListener('pointerdown', e => {
    canvas.setPointerCapture(e.pointerId); pointers.set(e.pointerId, {x: e.clientX, y: e.clientY});
    if (pointers.size === 2) pinch = pinchDistance();
  });
  canvas.addEventListener('pointermove', e => {
    const p = pointers.get(e.pointerId); if (!p) return;
    const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY;
    if (pointers.size === 1) { goal.yaw -= dx * .006; goal.pitch = T.MathUtils.clamp(goal.pitch + dy * .004, .02, 1.2); }
    else if (pointers.size === 2) { const d = pinchDistance(); if (pinch) zoom(pinch / d); pinch = d; }
  });
  const end = e => { pointers.delete(e.pointerId); pinch = 0; };
  canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);
  canvas.addEventListener('wheel', e => { e.preventDefault(); zoom(Math.exp(e.deltaY * .001)); }, {passive: false});
  canvas.addEventListener('keydown', e => {
    const k = {ArrowLeft: () => goal.yaw -= .12, ArrowRight: () => goal.yaw += .12, ArrowUp: () => goal.pitch = Math.min(1.2, goal.pitch + .06),
      ArrowDown: () => goal.pitch = Math.max(.02, goal.pitch - .06), '+': () => zoom(.9), '=': () => zoom(.9), '-': () => zoom(1.1)}[e.key];
    if (k) { e.preventDefault(); k(); }
  });
}
const pinchDistance = () => { const [a, b] = [...pointers.values()]; return Math.hypot(a.x - b.x, a.y - b.y) || 1; };
const zoom = f => { goal.dist = T.MathUtils.clamp(goal.dist * f, view.min, view.max); };

function disposeModel() {
  if (!holder) return;
  scene.remove(holder);
  const textures = new Set();
  holder.traverse(o => {
    if (!o.isMesh) return;
    o.geometry.dispose();
    for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
      for (const v of Object.values(m)) if (v && v.isTexture) textures.add(v);
      m.dispose();
    }
  });
  textures.forEach(t => t.dispose());
  holder = null; shadow.visible = false;
}

function triangles(root) {
  let n = 0;
  root.traverse(o => { if (o.isMesh) n += (o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count) / 3; });
  return Math.round(n);
}

function fit(root, car) {
  const group = new T.Group(); group.add(root); root.rotation.y = T.MathUtils.degToRad(car.yaw);
  group.updateMatrixWorld(true);
  const b0 = new T.Box3().setFromObject(group), size0 = b0.getSize(new T.Vector3());
  const k = car.length / Math.max(size0.x, size0.z, 1e-6);
  group.scale.setScalar(k); group.updateMatrixWorld(true);
  const b = new T.Box3().setFromObject(group), c = b.getCenter(new T.Vector3()), size = b.getSize(new T.Vector3());
  group.position.set(-c.x, -b.min.y, -c.z);
  shadow.scale.set(size.x * 1.5, size.z * 1.35, 1); shadow.visible = true;
  view.height = size.y; view.min = car.length * .75; view.max = car.length * 3.2;
  goal.dist = view.dist = car.length * 1.55; goal.pitch = .2; goal.yaw = .6;
  return group;
}

function showInfo(car, tris) {
  infoBox.innerHTML = '<small>' + esc(car.maker.toUpperCase()) + ' · ' + esc(car.year) + '</small><strong>' + esc(car.name) + '</strong><span>' + esc(car.note) + (tris ? ' · ' + tris.toLocaleString('en-US') + ' triangles' : '') + '</span>';
  const s = car.source;
  creditBox.innerHTML = s ? esc(s.attribution || (s.title + ' by ' + s.author)) + (s.url ? ' <a href="' + esc(s.url) + '" target="_blank" rel="noopener">Source</a>' : '') : 'Model source and licence not recorded yet. See CAR_INTEGRATION_PROGRESS.md.';
}

function select(i) {
  index = (i + CARS.length) % CARS.length;
  const car = CARS[index], mine = ++token;
  dialog.querySelectorAll('[data-car]').forEach((b, n) => b.setAttribute('aria-pressed', String(n === index)));
  disposeModel(); showInfo(car, 0);
  statusBox.className = 'cars-status'; statusBox.hidden = false; statusBox.textContent = 'LOADING ' + car.name.toUpperCase() + '…';
  loader.loadAsync(car.file).then(gltf => {
    if (mine !== token) { gltf.scene.traverse(o => o.geometry?.dispose()); return; }
    prepareCarMaterials(gltf.scene, car);
    const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    gltf.scene.traverse(o => {
      if (!o.isMesh) return;
      for (const m of Array.isArray(o.material) ? o.material : [o.material]) for (const v of Object.values(m)) if (v && v.isTexture) v.anisotropy = aniso;
    });
    holder = fit(gltf.scene, car); scene.add(holder);
    statusBox.hidden = true; showInfo(car, triangles(holder));
  }).catch(error => {
    if (mine !== token) return;
    statusBox.className = 'cars-status error'; statusBox.hidden = false;
    statusBox.innerHTML = 'Model file not available.<br>Expected <code>' + esc(car.file) + '</code><br>Prepare it with the Blender script, then reload.<br><small>' + esc(error.message || error) + '</small>';
  });
}

function frame(now) {
  raf = requestAnimationFrame(frame);
  const dt = Math.min(.1, (now - lastTime) / 1000 || 0); lastTime = now;
  if (autoRotate && !pointers.size) goal.yaw += dt * .35;
  const a = 1 - Math.exp(-dt * 10);
  view.yaw += (goal.yaw - view.yaw) * a; view.pitch += (goal.pitch - view.pitch) * a; view.dist += (goal.dist - view.dist) * a;
  const r = Math.cos(view.pitch) * view.dist, ty = view.height * .4;
  camera.position.set(Math.sin(view.yaw) * r, ty + Math.sin(view.pitch) * view.dist, Math.cos(view.yaw) * r);
  camera.lookAt(0, ty, 0);
  renderer.render(scene, camera);
}

function open(id) {
  if (!dialog) markup(), wire();
  if (!dialog.open) dialog.showModal();
  if (!ready) setup();
  resize();
  const i = id === undefined ? index : Math.max(0, CARS.findIndex(c => c.id === id));
  select(i);
  cancelAnimationFrame(raf); lastTime = performance.now(); raf = requestAnimationFrame(frame);
}

function wire() {
  dialog.addEventListener('close', () => { cancelAnimationFrame(raf); token++; disposeModel(); });
  dialog.addEventListener('click', e => {
    const t = e.target.closest('button'); if (!t) { if (e.target === dialog) dialog.close(); return; }
    if (t.matches('.dialog-close')) dialog.close();
    else if (t.dataset.car !== undefined) select(+t.dataset.car);
    else if ('carsPrev' in t.dataset) select(index - 1);
    else if ('carsNext' in t.dataset) select(index + 1);
    else if ('carsSpin' in t.dataset) { autoRotate = !autoRotate; t.setAttribute('aria-pressed', String(autoRotate)); }
    else if ('carsReset' in t.dataset) { goal.yaw = .6; goal.pitch = .2; goal.dist = CARS[index].length * 1.55; }
  });
}

$('#cars-open')?.addEventListener('click', () => open());
window.ZeroWattCars = {open, select: id => open(id), cars: CARS};
