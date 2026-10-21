import {FieldScene} from './scene.js';
import {installHybrid} from './src/advanced/hybrid-ui.js';
const M = window.WindModel, $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- environments (harsh cases included) ---------- */
const scenarios = {
air: [
 {id:'breeze', name:'Rooftop breeze', glyph:'☀', weather:'clear', environment:'roof', p:{wind:4.5, profile:'steady', people:8, room:150, rain:0, ambient:32}},
 {id:'canyon', name:'Urban canyon', glyph:'≋', weather:'clear', environment:'canyon', p:{wind:2.8, profile:'lull', people:12, room:150, rain:0, ambient:34}},
 {id:'heat', name:'Heatwave', glyph:'♨', weather:'heat', environment:'roof', p:{wind:2.3, profile:'gusts', people:18, room:150, rain:0, ambient:46}},
 {id:'rain', name:'Monsoon', glyph:'☂', weather:'rain', environment:'roof', p:{wind:7, profile:'gusts', people:10, room:150, rain:.8, ambient:30}},
 {id:'storm', name:'Cyclone', glyph:'ϟ', weather:'storm', environment:'roof', p:{wind:19, profile:'storm', people:8, room:150, rain:1, ambient:28}}
],
water: [
 {id:'breeze', name:'Park breeze', glyph:'☀', weather:'clear', environment:'park', p:{wind:4.5, profile:'steady', pond:100, temp:25, oxygenDemand:.25, rain:0, ambient:30}},
 {id:'lull', name:'Sheltered lull', glyph:'≋', weather:'clear', environment:'canyon', p:{wind:2.8, profile:'lull', pond:100, temp:28, oxygenDemand:.35, rain:0, ambient:33}},
 {id:'night', name:'Hot night', glyph:'☾', weather:'night', environment:'park', p:{wind:2.2, profile:'gusts', pond:100, temp:30, oxygenDemand:.55, rain:0, ambient:31}},
 {id:'rain', name:'Monsoon', glyph:'☂', weather:'rain', environment:'park', p:{wind:7, profile:'gusts', pond:150, temp:26, oxygenDemand:.4, rain:.8, ambient:29}},
 {id:'storm', name:'Storm surge', glyph:'ϟ', weather:'storm', environment:'park', p:{wind:19, profile:'storm', pond:180, temp:27, oxygenDemand:.35, rain:1, ambient:27}}
]};
const definitions = {wind:['Wind speed',0,60,.1,'m/s'], diameter:['Rotor diameter',.3,2,.1,'m'], units:['Installed units',1,10,1,''], ratio:['Gear reduction',1,5,.5,': 1'],
 ambient:['Air temperature',10,55,1,'°C'], rain:['Rain intensity',0,1,.1,''], room:['Room volume',30,500,10,'m³'], people:['Occupants',0,30,1,''], backgroundACH:['Background ventilation',.2,2,.1,'ACH'], pressure:['Duct pressure',5,80,1,'Pa'],
 pond:['Pond volume',20,500,10,'m³'], temp:['Water temperature',10,30,.5,'°C'], oxygenDemand:['Oxygen demand',0,1,.05,'mg/L/h']};
const steppers = {units:['ZeroWatt units on the roof', 1, 10], boats:['Boats on the pond', 1, 6], upb:['ZeroWatt units per boat', 1, 2]};
const mounts = [['boat', 'Pontoon boats · moving'], ['anchored', 'Pontoon boats · moored']];
const profiles = [['steady', 'Steady wind'], ['gusts', 'Gusts'], ['lull', 'Repeating lull'], ['storm', 'Storm gusts']];
const hwKeys = ['windSensor', 'qualitySensor', 'envSensor', 'mcu', 'enclosure'];
const hwLists = mode => ({windSensor:M.hardware.windSensor, qualitySensor:mode === 'air' ? M.hardware.qualityAir : M.hardware.qualityWater, envSensor:mode === 'air' ? M.hardware.envAir : M.hardware.envWater, mcu:M.hardware.mcu, enclosure:M.hardware.enclosure});
const hwLabels = mode => ({windSensor:'Wind sensor', qualitySensor:mode === 'air' ? 'CO₂ sensor' : 'Dissolved-oxygen probe', envSensor:mode === 'air' ? 'Rain sensor' : 'Water-temperature probe', mcu:'Microcontroller', enclosure:'Electronics enclosure'});
const robust = mode => ({windSensor:'ultra', qualitySensor:mode === 'air' ? 'ndir_duct' : 'do_opt', envSensor:mode === 'air' ? 'rain_opt' : 'ds18', mcu:'stm32', enclosure:'ip67'});

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const states = {}; let active = 'air', lastFrame = 0, uiElapsed = 0;
const fmt = (n, d = 1) => Number(n).toLocaleString('en-US', {minimumFractionDigits:d, maximumFractionDigits:d});
const decimals = step => step < 1 ? (step < .1 ? 2 : 1) : 0;

function slider(mode, key, p) {
  const [label, min, max, step, unit] = definitions[key], d = decimals(step);
  return '<label class="control" for="' + mode + '-' + key + '"><span class="control-label"><span>' + label + '</span><output data-output="' + key + '">' + fmt(p[key], d) + ' <small>' + unit + '</small></output></span>' +
   '<input type="range" id="' + mode + '-' + key + '" data-param="' + key + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + p[key] + '"><span class="range-limits"><span>' + min + '</span><span>' + max + ' ' + unit + '</span></span></label>';
}
function stepper(key, p) {
  const [label] = steppers[key];
  return '<div class="stepper"><span class="stepper-label">' + label + '</span><div class="stepper-ctl"><button type="button" data-dec="' + key + '" aria-label="Fewer ' + label.toLowerCase() + '">−</button><output data-step-out="' + key + '">' + p[key] + '</output><button type="button" data-inc="' + key + '" aria-label="More ' + label.toLowerCase() + '">+</button></div></div>';
}
function dropdown(mode, key) {
  const list = hwLists(mode)[key];
  return '<label class="dd"><span>' + hwLabels(mode)[key] + '</span><select data-hw="' + key + '">' + list.map(i => '<option value="' + i.id + '">' + i.name + '</option>').join('') + '</select></label>';
}

function create(mode) {
  const first = scenarios[mode][0];
  const s = states[mode] = {mode, scenario:first, p:{...M.defaults, ...first.p}, t:0, running:!reduced, flows:true, view:'field', doorOpen:false, scene:null, hw:null, current:null};
  const root = s.root = $('#' + mode + '-face');
  const air = mode === 'air';
  root.innerHTML =
  '<section class="window"><div class="scenario-strip"><div class="strip-head"><span>TEST CASE</span><span>' + (air ? 'Choose the weather the building roof is tested in' : 'Choose the weather the pond is tested in') + '</span></div><div class="scenario-list" role="group" aria-label="Environments">' +
   scenarios[mode].map((v, i) => '<button class="scenario-card ' + (i === 0 ? 'selected ' : '') + (i === 4 ? 'danger' : '') + '" data-scenario="' + v.id + '" aria-pressed="' + (i === 0) + '"><span class="scenario-glyph" aria-hidden="true">' + v.glyph + '</span><span><small>CASE 0' + (i + 1) + '</small><strong>' + v.name + '</strong></span></button>').join('') + '</div></div>' +
  '<div class="sim-layout"><aside class="controls">' +
   '<div class="control-title">INSTALLATION</div>' +
   (air ? stepper('units', s.p) : '<label class="dd"><span>Mounting</span><select data-param-select="mount">' + mounts.map(([id, n]) => '<option value="' + id + '">' + n + '</option>').join('') + '</select></label>' + stepper('boats', s.p) + stepper('upb', s.p)) +
   '<div class="install-total" data-total></div>' +
   '<div class="controls-divider"></div><div class="control-title">CONDITIONS <button class="reset" data-reset>↺ Reset</button></div>' +
   slider(mode, 'wind', s.p) +
   '<label class="dd"><span>Wind pattern</span><select data-param-select="profile">' + profiles.map(([id, n]) => '<option value="' + id + '">' + n + '</option>').join('') + '</select></label>' +
   slider(mode, 'ambient', s.p) + slider(mode, 'rain', s.p) +
   '<div class="controls-divider"></div><div class="control-title">THE PROTOTYPE</div>' + ['diameter', 'ratio'].map(k => slider(mode, k, s.p)).join('') +
   '<label class="switch-control" for="' + mode + '-brake">Manual shaft brake<input id="' + mode + '-brake" data-toggle="brake" type="checkbox"></label>' +
   '<div class="controls-divider"></div><div class="control-title">' + (air ? 'THE BUILDING' : 'THE POND') + '</div>' + (air ? ['room', 'people', 'backgroundACH', 'pressure'] : ['pond', 'temp', 'oxygenDemand']).map(k => slider(mode, k, s.p)).join('') +
   '<div class="controls-divider"></div><div class="control-title">SENSORS &amp; MICROCONTROLLER</div>' +
   hwKeys.map(k => dropdown(mode, k)).join('') +
   '<button class="suggest" data-suggest>Pick rugged parts for this case</button>' +
   '<div class="hw-status" data-hwstatus></div>' +
  '</aside>' +
  '<div class="scene-area"><div class="viewport"><div class="loading">ASSEMBLING…</div>' +
   '<div class="vp-left"><select data-scenario-select aria-label="Environment">' + scenarios[mode].map(v => '<option value="' + v.id + '">' + v.glyph + '  ' + v.name + '</option>').join('') + '</select></div>' +
   '<div class="vp-tools"><button data-tool="pause" aria-pressed="' + !s.running + '" aria-label="' + (s.running ? 'Pause' : 'Play') + '">' + (s.running ? 'Pause' : 'Play') + '</button><button data-tool="flows" aria-pressed="true">Flow</button>' + (air ? '<button data-tool="flow-view" aria-pressed="false" title="Inspect intake and exhaust paths inside the building">Air paths</button>' : '') + '<button data-tool="view" aria-pressed="false">Close-up</button><button data-tool="fit" aria-pressed="false" title="Fit the simulation to the whole screen (Esc to exit)">⛶ Fit to screen</button></div>' +
   (air ? '<div class="scene-heading"><span>BUILDING VENTILATION</span><strong>Wind in. Fresh air out.</strong></div>' +
   '<div class="scene-annotations" aria-label="Inspect the ventilation system">' +
   '<button class="scene-callout rotor-callout" data-scene-anchor="rotor" data-inspect="rotor" title="Inspect the spiral rotor and mechanical drive"><i>01</i> Wind capture</button>' +
   '<button class="scene-callout intake-callout" data-scene-anchor="intake" data-inspect="intake" title="Inspect fresh air entering the room"><i>02</i> Fresh-air intake</button>' +
   '<button class="scene-callout exhaust-callout" data-scene-anchor="exhaust" data-inspect="exhaust" title="Inspect warm air leaving through the fan"><i>03</i> Exhaust</button></div>' +
   '<div class="flow-key" aria-label="Airflow visualization legend"><span><i class="intake-dot"></i>Incoming air</span><span><i class="exhaust-dot"></i>Exhaust air</span><span><i class="drive-dot"></i>Mechanical transfer</span><small>Illustrative paths · driven by live model values</small></div>' : '') +
   '<div class="scene-caption"><span>WIND → ROTOR → TRANSMISSION → ' + (air ? 'VENTILATION' : 'AERATION') + '</span><span>Drag to orbit · Scroll to zoom</span></div>' +
   '<div class="vp-navigation">' +
   '<div class="vp-camera">' + (air ? '<button data-tool="door" aria-pressed="false">Open door</button>' : '') + '<button data-tool="zoom-out" aria-label="Zoom out" title="Zoom out">−</button><button data-tool="zoom-in" aria-label="Zoom in" title="Zoom in">+</button><button data-tool="city">City view</button><button data-tool="home" aria-label="Reset camera">Reset view</button></div></div>' +
  '</div></div></div></section>';
  bind(s); recompute(s); return s;
}

function bind(s) {
  const root = s.root;
  $('.viewport',root).addEventListener('door-change',e=>{
    if(s.ventilationMode==='advanced')return;
    s.doorOpen=e.detail.open;const b=$('[data-tool="door"]',root);
    if(b){b.setAttribute('aria-pressed',s.doorOpen);b.textContent=s.doorOpen?'Close door':'Open door';}
  });
  $$('[data-scenario]', root).forEach(b => b.addEventListener('click', () => selectScenario(s, b.dataset.scenario)));
  $('[data-scenario-select]', root).addEventListener('change', e => selectScenario(s, e.target.value));
  $$('[data-param]', root).forEach(el => el.addEventListener('input', () => { s.p[el.dataset.param] = Number(el.value); recompute(s); }));
  $$('[data-param-select]', root).forEach(el => el.addEventListener('change', () => { s.p[el.dataset.paramSelect] = el.value; if (el.dataset.paramSelect === 'profile') s.t = 0; recompute(s); }));
  $$('[data-dec],[data-inc]', root).forEach(b => b.addEventListener('click', () => { const k = b.dataset.dec || b.dataset.inc, [, lo, hi] = steppers[k]; s.p[k] = Math.min(hi, Math.max(lo, Math.round(s.p[k]) + (b.dataset.inc ? 1 : -1))); recompute(s); }));
  $$('[data-toggle]', root).forEach(el => el.addEventListener('change', () => { s.p[el.dataset.toggle] = el.checked; recompute(s); }));
  $$('[data-hw]', root).forEach(el => el.addEventListener('change', () => { s.p[el.dataset.hw] = el.value; recompute(s); }));
  $('[data-suggest]', root).addEventListener('click', () => { Object.assign(s.p, robust(s.mode)); recompute(s); });
  $('[data-reset]', root).addEventListener('click', () => selectScenario(s, s.scenario.id));
  $$('[data-tool]', root).forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.tool;
    if (k === 'pause') { s.running = !s.running; b.setAttribute('aria-pressed', !s.running); b.textContent = s.running ? 'Pause' : 'Play'; b.setAttribute('aria-label',s.running ? 'Pause' : 'Play'); }
    if (k === 'flows') { s.flows = !s.flows; s.scene?.setFlows(s.flows); b.setAttribute('aria-pressed', s.flows);$('.viewport',root).dataset.flows=s.flows?'on':'off'; }
    if (k === 'view') setSceneView(s,s.view==='bench'?'field':'bench');
    if (k === 'flow-view') setSceneView(s,s.view==='flow'?'field':'flow');
    if (k === 'door') { s.doorOpen = !s.doorOpen; s.scene?.setDoorOpen(s.doorOpen); b.setAttribute('aria-pressed', s.doorOpen); b.textContent = s.doorOpen ? 'Close door' : 'Open door'; }
    if (k === 'zoom-out') s.scene?.zoomBy(1.2);
    if (k === 'zoom-in') s.scene?.zoomBy(1/1.2);
    if (k === 'home') setSceneView(s,'field');
    if (k === 'city') setSceneView(s,'city');
    if (k === 'fit') toggleFit(s);
  }));
  $$('[data-inspect]',root).forEach(b=>b.addEventListener('click',()=>{
    setSceneView(s,b.dataset.inspect==='rotor'?'bench':'flow');s.scene?.inspectPart(b.dataset.inspect);
  }));
}

function setSceneView(s,view) {
  s.view=view;s.scene?.setView(view);
  $('[data-tool="view"]',s.root).setAttribute('aria-pressed',view==='bench');
  $('[data-tool="flow-view"]',s.root)?.setAttribute('aria-pressed',view==='flow');
  const door=$('[data-tool="door"]',s.root);if(door)door.disabled=view==='bench';
  const host=$('.viewport',s.root);host.dataset.sceneView=view;
}

/* ---------- fit the simulation window to the whole screen ---------- */
function toggleFit(s) {
  const vp = $('.viewport', s.root);
  if (document.fullscreenElement === vp) { document.exitFullscreen(); return; }
  if (vp.classList.contains('expanded')) { setExpanded(s, false); return; }
  if (vp.requestFullscreen) vp.requestFullscreen().catch(() => setExpanded(s, true)); else setExpanded(s, true);
}
function setExpanded(s, on) { const vp = $('.viewport', s.root); vp.classList.toggle('expanded', on); document.body.style.overflow = on ? 'hidden' : ''; afterFit(s); }
function afterFit(s) {
  const vp = $('.viewport', s.root), on = document.fullscreenElement === vp || vp.classList.contains('expanded');
  const b = $('[data-tool="fit"]', s.root); b.setAttribute('aria-pressed', on); b.textContent = on ? '✕ Exit full screen' : '⛶ Fit to screen';
  const advanced=$('[data-hy-action="fit"]',s.root);if(advanced){advanced.setAttribute('aria-pressed',on);advanced.textContent=on?'✕ Exit full screen':'⛶ Full screen';}
  requestAnimationFrame(() => s.scene?.resize()); setTimeout(() => s.scene?.resize(), 150);
}
document.addEventListener('fullscreenchange', () => { for (const k in states) afterFit(states[k]); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') for (const k in states) { const vp = $('.viewport', states[k].root); if (vp.classList.contains('expanded')) setExpanded(states[k], false); } });

function selectScenario(s, id) {
  const keep = {}; [...hwKeys, 'units', 'boats', 'upb', 'mount'].forEach(k => keep[k] = s.p[k]);          // sensors & microcontroller stay selected across cases
  s.scenario = scenarios[s.mode].find(v => v.id === id); s.p = {...M.defaults, ...s.scenario.p, ...keep}; s.t = 0; recompute(s);
}
function recompute(s) {
  s.p._mode = s.mode; s.p._weather = s.scenario.weather;
  if (s.mode === 'water') s.p.units = s.p.boats*s.p.upb;      // total ZeroWatt units = boats x units per boat
  s.hw = M.evaluateHardware(s.p);
  $$('[data-scenario]', s.root).forEach(b => { const on = b.dataset.scenario === s.scenario.id; b.classList.toggle('selected', on); b.setAttribute('aria-pressed', on); });
  $('[data-scenario-select]', s.root).value = s.scenario.id;
  $$('[data-param]', s.root).forEach(el => { const k = el.dataset.param, d = decimals(definitions[k][3]); el.value = s.p[k]; $('[data-output="' + k + '"]', s.root).innerHTML = fmt(s.p[k], d) + ' <small>' + definitions[k][4] + '</small>'; });
  $$('[data-param-select]', s.root).forEach(el => el.value = s.p[el.dataset.paramSelect]);
  $$('[data-step-out]', s.root).forEach(el => el.textContent = Math.round(s.p[el.dataset.stepOut]));
  $$('[data-dec],[data-inc]', s.root).forEach(b => { const k = b.dataset.dec || b.dataset.inc, [, lo, hi] = steppers[k]; b.disabled = b.dataset.inc ? s.p[k] >= hi : s.p[k] <= lo; });
  $('[data-total]', s.root).textContent = 'TOTAL ' + Math.round(s.p.units) + (Math.round(s.p.units) === 1 ? ' UNIT' : ' UNITS');
  $$('[data-toggle]', s.root).forEach(el => el.checked = s.p[el.dataset.toggle]);
  $$('[data-hw]', s.root).forEach(el => el.value = s.p[el.dataset.hw]);
  s.scene?.setEnvironment(s.scenario, s.p); s.scene?.setHardware(s.hw, s.p);
  if(s.ventilationMode==='advanced')s.hybrid?.applyEnvironment();
  renderHW(s); refresh(s);
}

/* ---------- sensors & microcontroller panel (status only, no readings) ---------- */
const STATUS_TXT = {ok:'OK', warn:'DEGRADED', fail:'FAILED'};
function renderHW(s) {
  const names = hwLabels(s.mode), el = $('[data-hwstatus]', s.root), hw = s.hw;
  const rows = [['wind', 'windSensor'], ['quality', 'qualitySensor'], ['env', 'envSensor'], ['mcu', 'mcu']].filter(([k]) => hw.items[k].res).map(([k, pk]) => {
    const r = hw.items[k].res;
    return '<div class="hw-row ' + r.status + '"><div class="hw-row-top"><span>' + names[pk] + '</span><span class="chip">' + STATUS_TXT[r.status] + '</span></div></div>';
  }).join('');
  const cls = hw.protectionText === 'ARMED' ? '' : hw.protectionText.startsWith('NO ') ? 'warn' : 'bad';
  el.innerHTML = '<div class="hw-head"><span>STORM PROTECTION</span><b class="' + cls + '">' + hw.protectionText + '</b></div>' +
    (rows || '<div class="hw-note">Pick sensors and a microcontroller above to test their performance in each weather case.</div>');
}

function refresh(s) {
  s.current = M.steady(s.p, M.liveWind(s.p, s.t), s.hw);
}

function ensureScene(s) {
  if (s.scene || s.graphicsFailed) return;
  const host = $('.viewport', s.root);
  try {
    s.scene = new FieldScene(host, s.mode);
    s.scene.setEnvironment(s.scenario, s.p); s.scene.setHardware(s.hw, s.p); s.scene.setView(s.view); s.scene.setFlows(s.flows);
    $('.loading', host)?.remove(); s.scene.render(0, s.current, false);
  } catch (e) {
    s.graphicsFailed = true; $('.loading', host)?.remove();
    const n = document.createElement('div'); n.className = 'graphics-error';
    n.textContent = '3D rendering needs WebGL 2. Enable hardware acceleration or open this page in a WebGL-capable browser. Parameters and hardware checks still work.';
    host.append(n); console.error('3D scene initialization:', e);
  }
}
function switchMode(mode) {
  active = mode;
  for (const k of ['air', 'water']) { const tab = $('#' + k + '-tab'), on = k === mode; tab.classList.toggle('active', on); tab.setAttribute('aria-selected', on); tab.tabIndex = on ? 0 : -1; states[k].root.hidden = !on; }
  ensureScene(states[mode]); states[mode].scene?.resize();
}

for (const mode of ['air', 'water']) create(mode);
installHybrid(states.air,{recompute,toggleFit,setSceneView});
$$('[data-mode]').forEach(b => { b.addEventListener('click', () => switchMode(b.dataset.mode)); b.addEventListener('keydown', e => { if (['ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); const mode = active === 'air' ? 'water' : 'air'; switchMode(mode); $('#' + mode + '-tab').focus(); } }); });
const dlg = $('#reference-dialog'); $('#reference-open').addEventListener('click', () => dlg.showModal());
$('.dialog-close', dlg).addEventListener('click', () => dlg.close());
dlg.addEventListener('click', e => { if (e.target === dlg) { const r = dlg.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dlg.close(); } });
dlg.addEventListener('close', () => $$('video', dlg).forEach(v => v.pause()));
switchMode('air');

function frame(now) {
  const dt = Math.min(.1, (now - lastFrame)/1000 || 0); lastFrame = now; const s = states[active], running = s.running && !document.hidden && !dlg.open;
  if (running) s.t += dt;
  if(s.ventilationMode==='advanced')s.hybrid.tick(dt,running);
  uiElapsed += dt; if (uiElapsed > .1) { refresh(s);if(s.ventilationMode==='advanced')s.hybrid.render(); uiElapsed = 0; }
  s.current = M.steady(s.p, M.liveWind(s.p, s.t), s.hw);
  if (!document.hidden) s.scene?.render(dt*(s.ventilationMode==='advanced'?s.hybrid.p.speed:1), s.current, running);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ---------- control API used by jarvis.js (voice, hand and face control) ---------- */
window.ZW = {
  mode: () => active, state: () => states[active], states, scenarios, definitions, steppers, profiles,
  switchMode, selectScenario, toggleFit, recompute,
  dialogOpen: () => dlg.open, closeDialog: () => dlg.close()
};
