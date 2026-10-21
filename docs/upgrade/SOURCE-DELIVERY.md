# Full final ZeroWatt source delivery

Workspace files are authoritative. These are complete source files, not diffs.

FILE: `app.js`

````````javascript
import {FieldScene} from './scene.js';
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
   '<div class="readouts"><div class="readout" data-status-box><span class="readout-label">SYSTEM STATUS</span><strong data-status>—</strong></div>' +
   '<div class="readout"><span class="readout-label">LIVE WIND</span><strong data-metric="wind">—</strong><small>m/s</small></div>' +
   '<div class="readout"><span class="readout-label">SHAFT POWER</span><strong data-metric="shaft">—</strong><small>W</small></div>' +
   '<div class="readout"><span class="readout-label">' + (air ? 'AIRFLOW' : 'DISSOLVED OXYGEN') + '</span><strong data-metric="' + (air ? 'airflow' : 'do') + '">—</strong><small>' + (air ? 'm³/h' : 'mg/L') + '</small></div></div>' +
   '<div class="scene-caption"><span>WIND → ROTOR → TRANSMISSION → ' + (air ? 'VENTILATION' : 'AERATION') + '</span><span>Drag to orbit · Scroll to zoom</span></div>' +
   '<div class="vp-navigation">' +
   '<div class="vp-camera">' + (air ? '<button data-tool="door" aria-pressed="false">Open door</button>' : '') + '<button data-tool="zoom-out" aria-label="Zoom out" title="Zoom out">−</button><button data-tool="zoom-in" aria-label="Zoom in" title="Zoom in">+</button><button data-tool="home" aria-label="Reset camera">Reset view</button></div></div>' +
  '</div></div></div></section>';
  bind(s); recompute(s); return s;
}

function bind(s) {
  const root = s.root;
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

/* ---------- plain-language status line in the scene ---------- */
function statusText(s, v) {
  const hw = s.hw, p = s.p;
  if (p.brake) return ['BRAKE ON', 'alert'];
  if (v.wind >= p.stormCutout) return ['RUNNING · HIGH WIND', 'alert'];
  if (hw.damper) return ['RAIN DAMPER ON', 'alert'];
  if (hw.alerts && (s.mode === 'air' ? v.co2 > p.co2Target : v.do < p.doTarget)) return [s.mode === 'air' ? 'FRESH AIR NEEDED' : 'OXYGEN LOW', 'alert'];
  if (v.shaft <= 0) return ['WAITING FOR WIND', ''];
  return ['RUNNING', ''];
}
function refresh(s) {
  const v = s.current = M.steady(s.p, M.liveWind(s.p, s.t), s.hw);
  const [txt, cls] = statusText(s, v), box = $('[data-status-box]', s.root);
  $('[data-status]', s.root).textContent = txt;
  box.dataset.active=v.shaft>0?'true':'false';
  $$('[data-metric]',s.root).forEach(el => el.textContent=fmt(v[el.dataset.metric],el.dataset.metric==='airflow'?0:1));
  box.classList.toggle('alert', cls === 'alert'); box.classList.toggle('bad', cls === 'bad');
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
$$('[data-mode]').forEach(b => { b.addEventListener('click', () => switchMode(b.dataset.mode)); b.addEventListener('keydown', e => { if (['ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); const mode = active === 'air' ? 'water' : 'air'; switchMode(mode); $('#' + mode + '-tab').focus(); } }); });
const dlg = $('#reference-dialog'); $('#reference-open').addEventListener('click', () => dlg.showModal());
$('.dialog-close', dlg).addEventListener('click', () => dlg.close());
dlg.addEventListener('click', e => { if (e.target === dlg) { const r = dlg.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dlg.close(); } });
dlg.addEventListener('close', () => $$('video', dlg).forEach(v => v.pause()));
switchMode('air');

function frame(now) {
  const dt = Math.min(.1, (now - lastFrame)/1000 || 0); lastFrame = now; const s = states[active], running = s.running && !document.hidden && !dlg.open;
  if (running) s.t += dt;
  uiElapsed += dt; if (uiElapsed > .1) { refresh(s); uiElapsed = 0; }
  s.current = M.steady(s.p, M.liveWind(s.p, s.t), s.hw);
  if (!document.hidden) s.scene?.render(dt, s.current, running);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ---------- control API used by jarvis.js (voice, hand and face control) ---------- */
window.ZW = {
  mode: () => active, state: () => states[active], states, scenarios, definitions, steppers, profiles,
  switchMode, selectScenario, toggleFit, recompute,
  dialogOpen: () => dlg.open, closeDialog: () => dlg.close()
};
````````

FILE: `index.html`

````````html
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#101915">
<title>ZeroWatt Wind — Field Simulation</title>
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="jarvis.css">
<link rel="stylesheet" href="upgrade.css">
</head>
<body>
<header class="topbar">
  <a class="brand" href="#" aria-label="ZeroWatt Wind home"><img src="assets/zerowatt-logo.jpg" alt="ZeroWatt Wind logo" width="76" height="92"><span>ZeroWatt<span> Wind</span><small>Harvest the wind. Deliver the motion.</small></span></a>
  <div class="top-links"><button class="quiet" id="reference-open">Prototype ↗</button></div>
</header>
<main>
  <div class="lab-heading"><div><p>ZERO ELECTRICITY. REAL POSSIBILITY.</p><h1>Let the wind do the work.</h1></div><span>Interactive engineering lab <i aria-hidden="true"></i></span></div>
  <section class="console">
    <div class="application-menu" role="tablist" aria-label="Select application">
      <button id="air-tab" class="application active" role="tab" aria-controls="air-face" aria-selected="true" data-mode="air"><span class="app-icon">↗</span><span class="app-text"><small>APPLICATION 01</small><strong>Building ventilation</strong><em>Wind-driven fans clear stale air from a room</em></span></button>
      <button id="water-tab" class="application" role="tab" aria-controls="water-face" aria-selected="false" tabindex="-1" data-mode="water"><span class="app-icon">≈</span><span class="app-text"><small>APPLICATION 02</small><strong>Pond aeration</strong><em>Wind-driven paddle wheel adds oxygen to water</em></span></button>
    </div>
    <div id="faces">
      <article id="air-face" class="app-face" role="tabpanel" aria-labelledby="air-tab"></article>
      <article id="water-face" class="app-face" role="tabpanel" aria-labelledby="water-tab" hidden></article>
    </div>
  </section>
</main>
<dialog id="reference-dialog">
  <div class="dialog-heading"><div><p class="eyebrow">THE STARTING POINT</p><h2>From your workbench.</h2></div><button class="dialog-close quiet" aria-label="Close prototype">✕</button></div>
  <div class="reference-grid"><img src="assets/prototype-white.jpg" alt="White spiral turbine, right-angle bevel gears and fan on black and white supports"><img src="assets/prototype-black.jpg" alt="Black spiral rotor driving the prototype shafts and fan"></div>
  <div class="reference-videos"><div><h3>Working prototype</h3><video src="assets/prototype-motion.mp4" poster="assets/prototype-black.jpg" controls playsinline preload="none"></video></div><div><h3>Project film</h3><video src="assets/project-film.mp4" poster="assets/prototype-white.jpg" controls playsinline preload="none"></video></div></div>
</dialog>
<noscript>This simulation requires JavaScript.</noscript>
<script src="model.js"></script>
<script src="app.bundle.js"></script>
<script src="offline-voice.js"></script>
<script src="breath-input.js"></script>
<script src="jarvis.js"></script>
</body>
</html>
````````

FILE: `package.json`

````````json
{
  "name": "zerowatt-wind",
  "private": true,
  "version": "8.0.0",
  "scripts": {
    "start": "node serve.js",
    "build": "esbuild app.js --bundle --minify --format=iife --outfile=app.bundle.js",
    "get-models": "node get-models.js",
    "test": "node --test tests/*.test.cjs",
    "get-voice-model": "node get-voice-model.js",
    "preview": "node serve.js",
    "assets:build": "node tools/run-blender.cjs scripts/blender/build_assets.py",
    "verify:graphics": "node tools/verify-graphics.cjs",
    "assets:review": "node tools/run-blender.cjs scripts/blender/render_review.py"
  },
  "devDependencies": {
    "esbuild": "^0.25.0",
    "jsdom": "^26.1.0"
  }
}
````````

FILE: `scene.js`

````````javascript
import * as T from './vendor/three.module.js';
import { upgradeRotor } from './premium-assets.js';
import {upgradePart, addAsset, retireShell, assetStatus} from './src/graphics/assets.js';
import {installReflections, createWaterMaterial, updateWater, applySurfaceDetail,applyVentilationMaterials} from './src/graphics/surfaces.js';
import {dressArchitecture, dressLandscape} from './src/graphics/site.js';
import {VentilationVFX, updateVentilationLabels} from './src/graphics/ventilation-vfx.js';
import {advanceCamera,viewDistance} from './src/graphics/camera.js';

/* ZeroWatt Wind - 3D field scene.
   Geometry is reconstructed from the supplied photographs (not imported CAD).
   Environments: the original building cutaway (room, occupants, windows) and the original pond
   (basin, timber walkway, fish, reeds). The prototype is the photo-based assembly:
   spiral rotor -> shaft on double-plate stands -> bevel pair (90 deg) -> fan (air) or paddle wheel (water). */

const MAX_UNITS = 12, MAX_PEOPLE = 30, MAX_FISH = 8, PITCH_X = 4.9, PITCH_Z = 5.6;
const spinCap = (w, dt) => Math.min(w <= 8 ? w : 8 + (w - 8)*.35, 30, dt > 0 ? .6/dt : 30);   // rad/s -> rad/s, never more than ~0.6 rad per frame
/* Visual rotor speed (rad/s) as a function of wind speed (m/s). One smooth, always-rising curve:
   - turns clearly even in a light breeze (about 4.7 rad/s = 0.75 rev/s at 1 m/s, 7 rad/s at 2.8 m/s),
   - keeps climbing at every step up to the 60 m/s slider limit, where it reaches its fastest (SPIN_MAX),
   - fades to a standstill only as the wind itself falls to zero.
   The rotor idles below the electrical cut-in speed (no power is delivered there - that is still the model's job). */
export const SPIN_MAX = 24, SPIN_WIND_MAX = 60, SPIN_EXP = .4;
export const spinTarget = w => { const v = clamp(w, 0, SPIN_WIND_MAX); return SPIN_MAX*Math.pow(v/SPIN_WIND_MAX, SPIN_EXP)*smooth(0, .4, v); };
// pond: units ride on pontoon boats. Deck level sits just above the waterline, the drive steps down through a second bevel pair so the paddle wheel hangs deep in the water.
const WSHAFT_Y = 2.0, WHEEL_Y = .35, WHEEL_R = 1.6, BOAT_S = .5, BOAT_PITCH = 6.6, MAX_BOATS = 6, MAX_UPB = 2, DECK_DROP = .14, WHEEL_Z = 3.4;
const BOAT_FOOT = 3.6, BOAT_R = 2.0;   // hull length (world units) and collision-circle radius
const POND_BACK = 1.2, POND_Y = .16, WATER_Y = .95, SHAFT_Y = 1.55;
const FLOOR_TOP = .3, WALL_H = 3.2, ROOF_TOP = 3.7;
const BEVEL_R = .5, BEVEL_N = 20, AX = 1.02;   // equal miter gears: pitch radius, teeth, x of the point where both shaft axes cross

const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
// grid of prototype units: air = up to two rows on the roof, water = one row on the deck behind the basin
const grid = (n, air) => { const cols = air ? (n <= 5 ? n : Math.ceil(n / 2)) : n; return {cols, rows: Math.ceil(n / cols)}; };

export class FieldScene {
  constructor(host, mode) {
    this.host = host; this.mode = mode;
    this.angle = .8; this.elevation = .42; this.distance = 13; this.target = new T.Vector3(0, 2, 0);
    this.view = 'field'; this.time = 0; this.count = 1; this.extent = 12;
    this.reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.rotors = []; this.rotorGroups = []; this.gears = []; this.fans = []; this.vfans = []; this.units = [];
    this.trees = []; this.fish = []; this.rings = []; this.rainRings = []; this.people = []; this.panes = [];
    this.debris = []; this.puddles = []; this.hazes = []; this.water = null; this.canyon = null;
    this.flows = true; this.haze = 0; this.rainAmt = 0; this.storm = false; this.night = false; this.flashT = 0; this.lightT = 3; this.layoutKey = '';
    this.roomW = 6; this.roomD = 6; this.pondL = 9; this.pondW = 5; this.sensors = null;
    this.boats = 1; this.upb = 1; this.mount = 'boat'; this.boatGroups = []; this.boatPose = []; this.boatTheta = []; this.boatSim = []; this.lanes = []; this.laneOf = []; this.pondZc = 6; this.benchBoat = null;

    this.compactGraphics = matchMedia('(max-width: 760px)').matches || (navigator.hardwareConcurrency || 8) < 5;
    this.renderer = new T.WebGLRenderer({antialias:true, alpha:false, powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, this.compactGraphics ? 1.25 : 1.7));
    this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = T.PCFSoftShadowMap;
    this.renderer.outputColorSpace = T.SRGBColorSpace; this.renderer.toneMapping = T.ACESFilmicToneMapping; this.renderer.toneMappingExposure = mode==='air'?1.0:1.15;
    this.renderer.domElement.setAttribute('aria-label', mode === 'air' ? 'Interactive 3D rooftop ventilation with the wind prototype driving fans into a room' : 'Interactive 3D pond aerator with the wind prototype driving a paddle wheel');
    this.renderer.domElement.setAttribute('role', 'img'); this.renderer.domElement.tabIndex = 0;
    host.prepend(this.renderer.domElement);

    this.scene = new T.Scene(); this.scene.background = new T.Color('#839e88'); this.scene.fog = new T.FogExp2('#839e88', .02);
    this.camera = new T.PerspectiveCamera(38, 1, .1, 240);
    this.hemi = new T.HemisphereLight('#e8f3da', '#263b2c', 2.4); this.scene.add(this.hemi);
    if(mode==='air'){this.hemi.color.set('#deebf1');this.hemi.groundColor.set('#454d43');}
    this.sun = new T.DirectionalLight('#fff1cb', 3.2); this.sun.position.set(-8, 14, 9); this.sun.castShadow = true;
    this.sun.shadow.mapSize.setScalar(this.compactGraphics ? 1024 : 2048); this.sun.shadow.bias = -.0003; this.sun.shadow.normalBias = .025; this.scene.add(this.sun);
    const fill = this.fill = new T.DirectionalLight('#c7dce6', .65); fill.position.set(7, 6, -7); this.scene.add(fill);
    this.roomLight = new T.PointLight('#ffd89a', 0, 16, 1.5); this.roomLight.position.set(0, 2.7, 0); this.scene.add(this.roomLight);
    this.flashLight = new T.PointLight('#e8f2ff', 0, 140, 1.2); this.scene.add(this.flashLight);

    this.mats = {
      white: this.mat('#f4f2ea', .55, .02), black: this.mat('#151819', .6, .05), steel: this.mat('#aeb6b0', .35, .75),
      concrete: this.mat('#8d9b87'), cream: this.mat('#ddd8bd'), wood: this.mat('#b99f78'), gold: this.mat('#c9ae75', .5, .4),
      cream2: this.mat('#c9b48a'), dark: this.mat('#1e3029'), trunk: this.mat('#655d42'), leaf: this.mat('#4d6945'), leaf2: this.mat('#5d7c4f'),
      skin: this.mat('#cfb894'), shirtA: this.mat('#6e8e80'), shirtB: this.mat('#89966a'), path: this.mat('#d5cdb0'),
      water: createWaterMaterial(), fish: this.mat('#b79b61', .6, 0), fishTail: this.mat('#9d8b5a', .6, 0),
      reed: this.mat('#5e7b3e'), cattail: this.mat('#6b4f2c'), plank: this.mat('#7e8062'), basin: this.mat('#3f5a52'),
      cloud: this.mat('#b4c3b3', .9, 0), leafPiece: this.mat('#6f8f4a', .8, 0), twig: this.mat('#4a3d2c', .8, 0),
      glass: new T.MeshStandardMaterial({color:'#9ac8b8', transparent:true, opacity:.28, roughness:.12, side:T.DoubleSide}),
      win: new T.MeshStandardMaterial({color:'#b8e0d0', transparent:true, opacity:.34, roughness:.1, side:T.DoubleSide, emissive:'#000000'}),
      shellGlass: new T.MeshStandardMaterial({color:'#b8d6c9', transparent:true, opacity:.13, roughness:.2, side:T.DoubleSide, depthWrite:false}),
      led: new T.MeshStandardMaterial({color:'#6fe08a', emissive:'#2fbf5a', emissiveIntensity:1.2}),
      cross: new T.MeshStandardMaterial({color:'#2fae63', emissive:'#12562f', emissiveIntensity:.6, roughness:.5}), pontoon: this.mat('#f1efe6', .45, .02),
      brake: new T.MeshStandardMaterial({color:'#e0503f', emissive:'#6a1a10', roughness:.4}),
      storm: new T.MeshStandardMaterial({color:'#f0b84a', emissive:'#6a4a10', roughness:.4}),
      duct: new T.MeshStandardMaterial({color:'#f4f2ea', roughness:.4, transparent:true, opacity:.28, side:T.DoubleSide, depthWrite:false}),
      puddle: new T.MeshStandardMaterial({color:'#2e4c52', roughness:.04, metalness:.5, transparent:true, opacity:.9}),
      ripple: new T.MeshBasicMaterial({color:'#9fd6cb', transparent:true, opacity:.6, depthWrite:false, side:T.DoubleSide}),
      haze: new T.MeshBasicMaterial({color:'#fff3d2', transparent:true, opacity:0, depthWrite:false, side:T.DoubleSide, fog:false})
    };
    this.hazeMat = this.mats.haze;
    this.surfaceNormal = applySurfaceDetail(this.mats);
    if(mode==='air')applyVentilationMaterials(this.mats);
    this.reflectionTarget = installReflections(this.scene, this.renderer);

    this.env = new T.Group(); this.scene.add(this.env);          // surroundings, weather, sky
    this.shell = new T.Group(); this.scene.add(this.shell);      // building or pond (layout dependent)
    this.unitRoot = new T.Group(); this.scene.add(this.unitRoot); // the prototype units
    this.fx = new T.Group(); this.scene.add(this.fx);            // air, splash and heat particles
    this.table = new T.Group(); this.table.visible = false; this.scene.add(this.table);

    this.buildStatic(); this.buildTable(); this.buildUnits(); this.buildFx();
    if(mode==='air')this.ventilationVFX=new VentilationVFX(this);
    this.bind(); this.resize();
    this.resizeObserver = new ResizeObserver(() => this.resize()); this.resizeObserver.observe(host);
    this.cameraPosition();
    this.renderer.domElement.addEventListener('webglcontextlost', e => { e.preventDefault(); host.dataset.graphics = 'lost'; });
    this.renderer.domElement.addEventListener('webglcontextrestored', () => { delete host.dataset.graphics; this.resize(); });
  }

  /* ---------------- helpers ---------------- */
  mat(color, roughness = .7, metalness = .08) { return new T.MeshStandardMaterial({color, roughness, metalness, side:T.DoubleSide}); }
  mesh(g, m, parent, x = 0, y = 0, z = 0) { const o = new T.Mesh(g, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; parent.add(o); return o; }
  box(w, h, d, m, parent, x = 0, y = 0, z = 0) { return this.mesh(new T.BoxGeometry(w, h, d), m, parent, x, y, z); }
  cyl(r, l, m, parent, x = 0, y = 0, z = 0, axis = 'y', r2 = r) { const o = this.mesh(new T.CylinderGeometry(r, r2, l, 28), m, parent, x, y, z); if (axis === 'x') o.rotation.z = Math.PI/2; if (axis === 'z') o.rotation.x = Math.PI/2; return o; }
  strut(parent, from, to, radius, material) {
    const a = new T.Vector3(...from), b = new T.Vector3(...to), delta = b.clone().sub(a);
    const o = this.cyl(radius, delta.length(), material, parent);
    o.position.copy(a.add(b).multiplyScalar(.5));
    o.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), delta.normalize());
    return o;
  }
  sphere(r, m, parent, x = 0, y = 0, z = 0) { return this.mesh(new T.SphereGeometry(r, 16, 12), m, parent, x, y, z); }
  pointGeo(n) { const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(new Float32Array(n*3), 3)); return g; }
  // flat toothed disc in the XY plane, extruded along z (used for bevel and spur gears)
  toothGeo(ro, teeth, depth) {
    const s = new T.Shape(), n = teeth*2;
    for (let i = 0; i < n; i++) { const a = i/n*Math.PI*2, r = i % 2 ? ro*.84 : ro, x = Math.cos(a)*r, y = Math.sin(a)*r; if (i) s.lineTo(x, y); else s.moveTo(x, y); }
    s.closePath();
    const g = new T.ExtrudeGeometry(s, {depth, bevelEnabled:false, curveSegments:1}); g.translate(0, 0, -depth/2); return g;
  }

  /* ---------------- static surroundings ---------------- */
  buildStatic() {
    const E = this.env;
    const terrain = new T.PlaneGeometry(260, 260, 80, 80);
    const groundPositions = terrain.attributes.position;
    for(let i=0;i<groundPositions.count;i++) {
      const x=groundPositions.getX(i), z=groundPositions.getY(i);
      groundPositions.setZ(i, .055*Math.sin(x*.31)*Math.cos(z*.24));
    }
    terrain.computeVertexNormals();
    const ground=this.mesh(terrain, this.mat('#74816b',.98,0), E,0,-.34,0);
    ground.rotation.x=-Math.PI/2; ground.castShadow=false;
    // Distant context sits behind the subject. Repeated windows use one draw.
    const buildings=['#8e9b96','#96a19a','#a7ada0'].map(c=>this.mat(c,.94,0)), windowPositions=[];
    for (let i = 0; i < 7; i++) {
      const x = (i-3)*5.4, z = -23 - Math.abs(i-3)*.8, h = 2.4 + (i*7%5)*.7, b = new T.Group(); E.add(b);
      this.box(3.1, h, 2.8, buildings[i%3], b, x, h/2 - .3, z);
      this.box(3.25, .15, 2.95, this.mats.concrete, b, x, h - .2, z);
      for (let f = 0; f < Math.floor(h/.9); f++) for (let n = 0; n < 3; n++) windowPositions.push([x - .9 + n*.9,.5 + f*.9,z + 1.42]);
    }
    const windows=new T.InstancedMesh(new T.BoxGeometry(.44,.4,.025),this.mat('#637774',.8,0),windowPositions.length), transform=new T.Object3D();
    windowPositions.forEach((pos,i)=>{transform.position.set(...pos);transform.updateMatrix();windows.setMatrixAt(i,transform.matrix);});
    windows.name='Instanced background windows';E.add(windows);
    // clouds (drift with the wind)
    this.clouds = new T.Group(); E.add(this.clouds);
    for (let i = 0; i < 9; i++) { const c = new T.Group(); c.position.set(-14 + i*3.6, 12 + (i%3)*.6, -24 + (i%2)*2); this.clouds.add(c); const s = new T.Mesh(new T.SphereGeometry(1, 16, 12), this.mats.cloud); s.scale.set(2.2, .5, 1.1); c.add(s); }
    // night sky
    const sp = new Float32Array(500*3);
    for (let i = 0; i < 500; i++) { const th = Math.random()*Math.PI*2, ph = Math.random()*Math.PI*.42, r = 150; sp[i*3] = Math.cos(th)*Math.cos(ph)*r; sp[i*3+1] = Math.sin(ph)*r; sp[i*3+2] = Math.sin(th)*Math.cos(ph)*r; }
    const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(sp, 3));
    this.stars = new T.Points(sg, new T.PointsMaterial({color:'#f2f6ea', size:1.6, sizeAttenuation:false, transparent:true, opacity:.85, depthWrite:false, fog:false}));
    this.stars.visible = false; E.add(this.stars);
    this.moon = new T.Mesh(new T.SphereGeometry(4, 20, 14), new T.MeshBasicMaterial({color:'#e9f0d8', fog:false})); this.moon.position.set(-70, 80, -130); this.moon.visible = false; E.add(this.moon);
    // heat haze bands near the ground
    for (let i = 0; i < 6; i++) { const h = new T.Mesh(new T.PlaneGeometry(70, 1.1), this.hazeMat); h.position.set(0, .5 + i*.6, i % 2 ? 7 : -7); E.add(h); this.hazes.push(h); }
    // wind-blown debris for storms
    const leafG = new T.PlaneGeometry(.2, .12);
    for (let i = 0; i < 36; i++) { const d = new T.Mesh(leafG, i % 3 ? this.mats.leafPiece : this.mats.twig); d.userData = {x0: Math.random()*36, y0: .6 + Math.random()*4.5, z0: (Math.random() - .5)*16, ph: Math.random()*6.28}; d.visible = false; E.add(d); this.debris.push(d); }
    // rain puddles (appear as it rains)
    const pg = new T.CircleGeometry(1, 28); pg.rotateX(-Math.PI/2);
    const spots = [[-10, 2, 1.1], [-8.5, -5, .8], [9, -6, 1.3], [10.5, 4.5, .9], [7, 9.5, 1.2], [-13, 6, 1.0], [-3, 11.5, .9], [2.5, -10.5, 1.1], [-12, -11, 1.2], [14, -1, .8]];
    for (const [x, z, s] of spots) { const m = new T.Mesh(pg, this.mats.puddle); m.position.set(x, .03, z); m.userData = {base: s, th: .05 + Math.random()*.4}; m.visible = false; E.add(m); this.puddles.push(m); }
    // windsock: points downwind; it fills with wind and droops in lulls
    const ws = new T.Group(); ws.position.set(-10.5, 0, -7.5); E.add(ws);
    this.cyl(.05, 4.2, this.mats.white, ws, 0, 2.1, 0);
    this.sockPivot = new T.Group(); this.sockPivot.position.set(0, 4.2, 0); ws.add(this.sockPivot);
    const L = 2.6, R = s => .34 - .24*s;
    for (const [a, b, col] of [[0, .85, '#e8762e'], [.85, 1.75, '#f4f1e6'], [1.75, 2.6, '#e8762e']]) {
      const m = new T.Mesh(new T.CylinderGeometry(R(a/L), R(b/L), b - a, 18, 1, true), this.mat(col, .8, 0));
      m.rotation.z = Math.PI/2; m.position.x = (a + b)/2; m.castShadow = true; this.sockPivot.add(m);
    }
    this.mesh(new T.TorusGeometry(.34, .025, 6, 18), this.mats.dark, this.sockPivot, 0, 0, 0).rotation.y = Math.PI/2;
  }
  buildTable() {
    this.box(14, .3, 8, this.mats.cream2, this.table, 0, -.15, 1.4);
    this.mats.slab = new T.MeshStandardMaterial({color:'#8d9b87', roughness:.7, transparent:true, opacity:.42, depthWrite:false, side:T.DoubleSide});
    this.benchSlab = this.box(9, .25, 4.2, this.mats.slab, this.table, -.5, .775, .2);   // the roof, see-through, so the fan under it shows
    for (let i = 0; i < 14; i++) this.box(.02, .005, 8, this.mat('#b19d73'), this.table, -6.5 + i, .01, 1.4);
    if (this.mode === 'water') {   // pond close-up: one boat floating in a tank so the deep paddle wheel can be seen under the surface
      this.benchWater = new T.Mesh(new T.BoxGeometry(14, 1.5, 9), this.mats.water.clone()); this.benchWater.position.set(0, -.75, 0); this.benchWater.renderOrder = 2; this.scene.add(this.benchWater); this.benchWater.visible = false;
      this.benchBoat = new T.Group(); this.benchBoat.position.set(-AX, DECK_DROP, -1.2); this.scene.add(this.benchBoat); this.buildHull(this.benchBoat, 1); this.benchBoat.visible = false;
    }
  }

  /* ---------------- the real prototype (photo-based) ---------------- */
  spiral(parent, x, y, z, dark) {
    const g = new T.Group(); g.position.set(x, y, z); parent.add(g); const spin = new T.Group(); g.add(spin);
    this.rotors.push(spin); this.rotorGroups.push(g);
    for (let b = 0; b < 3; b++) {
      const positions = [], indices = [], nu = 28, nv = 10;
      for (let u = 0; u <= nu; u++) for (let v = 0; v <= nv; v++) { const a = u/nu, t = v/nv, r = .1 + t*(.38 + a*.7), th = b*Math.PI*2/3 + a*2.7 + t*.3; positions.push((a - .5)*1.5, r*Math.cos(th), r*Math.sin(th)); }
      for (let u = 0; u < nu; u++) for (let v = 0; v < nv; v++) { const a = u*(nv + 1) + v; indices.push(a, a + 1, a + nv + 1, a + 1, a + nv + 2, a + nv + 1); }
      const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(positions, 3)); geo.setIndex(indices); geo.computeVertexNormals();
      this.mesh(geo, dark ? this.mats.black : this.mats.white, spin);
    }
    this.cyl(.12, 1.9, this.mats.white, spin, 0, 0, 0, 'x'); this.cyl(.26, .2, this.mats.white, spin, .85, 0, 0, 'x');
    if (!dark) upgradeRotor(spin);
    return g;
  }
  stand(parent, x, z, h, rotY, plateMat, baseMat) {
    const s = new T.Group(); s.position.set(x, 0, z); s.rotation.y = rotY; parent.add(s);
    const frame=new T.Group();s.add(frame);
    this.box(.8, .12, .95, baseMat, frame, 0, .06, 0);
    for (const dz of [-.17, .17]) this.box(.1, h, .09, plateMat, frame, 0, h/2 + .1, dz);
    this.box(.1, .22, .52, plateMat, frame, 0, h + .02, 0);
    upgradePart(frame, 'bearing-frame', {scale:[1,h+.1,1]});
    // Only the frame changes height; the sealed cartridge remains circular.
    addAsset(s, 'bearing', [0,h+.1,0]);
    return s;
  }
  collar(parent, x, y, z, axis, dark) { this.cyl(.26, .13, dark ? this.mats.black : this.mats.white, parent, x, y, z, axis); this.cyl(.17, .17, dark ? this.mats.white : this.mats.black, parent, x, y, z, axis); }
  // one tooth ring for every bevel gear: teeth lie along the 45 degree cone, straddling the pitch surface
  buildTeeth() {
    const R = BEVEL_R, N = BEVEL_N, pos = [], nor = [], idx = [], tmp = new T.BoxGeometry(.2, .08, .075);
    const pa = tmp.attributes.position, na = tmp.attributes.normal, ia = tmp.index, v = new T.Vector3(), one = new T.Vector3(1, 1, 1);
    const xc = .07, rc = R - xc, mt = new T.Matrix4().compose(new T.Vector3(xc, rc, 0), new T.Quaternion().setFromEuler(new T.Euler(0, 0, -Math.PI/4)), one);
    for (let k = 0; k < N; k++) {
      const m = new T.Matrix4().makeRotationX(k/N*Math.PI*2).multiply(mt), nm = new T.Matrix3().getNormalMatrix(m), base = pos.length/3;
      for (let i = 0; i < pa.count; i++) { v.fromBufferAttribute(pa, i).applyMatrix4(m); pos.push(v.x, v.y, v.z); v.fromBufferAttribute(na, i).applyMatrix3(nm).normalize(); nor.push(v.x, v.y, v.z); }
      for (let i = 0; i < ia.count; i++) idx.push(base + ia.getX(i));
    }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new T.Float32BufferAttribute(nor, 3)); g.setIndex(idx); return g;
  }
  // Miter bevel gear. Local +x points at the apex (where both shaft axes cross), the big end sits BEVEL_R from the apex,
  // so two of these meet exactly tooth-to-gap. 'phase' offsets the teeth half a pitch on the second gear.
  bevelGear(parent, pos, rot, sign, phase) {
    const R = BEVEL_R, delta = .04*Math.SQRT2, len = .65*R;
    const orient = new T.Group(); orient.position.copy(pos); orient.rotation.set(rot[0], rot[1], rot[2]); parent.add(orient);
    const spin = new T.Group(); orient.add(spin); this.gears.push({g:spin, sign});
    const cone = this.mesh(new T.CylinderGeometry(R - delta - len, R - delta, len, 40), this.mats.white, spin, len/2, 0, 0); cone.rotation.z = -Math.PI/2;
    this.cyl(.13, .3, this.mats.white, spin, -.15, 0, 0, 'x');
    const teeth = this.mesh(this.teethGeo, this.mats.white, spin); teeth.rotation.x = phase;
    upgradePart(spin, 'bevel', {rotation:[phase,0,0]});
    return orient;
  }
  buildUnits() {
    this.teethGeo = this.buildTeeth(); this.toothUnit = this.toothGeo(1, 20, .08);   // spur profile, scaled per unit
    this.teethGeo.userData.sharedStatic = true; this.toothUnit.userData.sharedStatic = true;
    const R = BEVEL_R, W = this.mats.white, K = this.mats.black;
    for (let i = 0; i < MAX_UNITS; i++) {
      const g = new T.Group(); this.unitRoot.add(g); const Y = this.mode === 'air' ? SHAFT_Y : WSHAFT_Y, u = {g}; this.units.push(u);
      this.spiral(g, -2, Y, 0, false);                                              // spiral rotor overhangs the first stand
      this.cyl(.075, 1.55, W, g, -.225, Y, 0, 'x');                                 // main shaft (rotor -> bevel gear A), ends at the gear hub
      this.stand(g, -.95, 0, Y - .1, 0, W, W);
      this.stand(g, .1, 0, Y - .1, 0, K, K);
      this.collar(g, -.77, Y, 0, 'x', true); this.collar(g, .28, Y, 0, 'x', true);
      u.brake = this.mesh(new T.TorusGeometry(.2, .035, 8, 28), this.mats.brake, g, -.77, Y, 0); u.brake.rotation.y = Math.PI/2; u.brake.visible = false;
      // bevel gear A on the main shaft; its axis and the output axis cross at (AX, Y, 0), both gears sit BEVEL_R away
      this.bevelGear(g, new T.Vector3(AX - R, Y, 0), [0, 0, 0], 1, 0);

      // ---- ventilation: bevel gear B turns the drive straight DOWN. The vertical shaft passes through the roof to an exhaust fan under the ceiling (Whirlybird style)
      const A = u.airOut = new T.Group(); g.add(A);
      this.bevelGear(A, new T.Vector3(AX, Y - R, 0), [0, 0, Math.PI/2], -1, Math.PI/BEVEL_N);
      this.cyl(.075, 1.42, W, A, AX, .29, 0);                                        // vertical shaft: gear B down to the fan hub
      this.mesh(new T.CylinderGeometry(.45, .45, .28, 32, 1, true), W, A, AX, .14, 0); // roof curb the shaft passes through
      const hole = this.mesh(new T.CircleGeometry(.44, 32), this.mats.dark, A, AX, .012, 0); hole.rotation.x = -Math.PI/2;
      this.box(.9, .05, .08, W, A, AX, .3, 0); this.box(.08, .05, .9, W, A, AX, .3, 0); this.collar(A, AX, .34, 0, 'y', true);   // bearing spider on the curb
      u.goldAir = new T.Group(); u.goldAir.position.set(AX, .62, 0); A.add(u.goldAir); this.vfans.push(u.goldAir);                // reduction gear on the shaft
      const gm = this.mesh(this.toothUnit, this.mats.gold, u.goldAir); gm.rotation.x = Math.PI/2;
      // exhaust fan hangs under the ceiling inside a round duct; the grille bars show the duct pressure setting
      const fs = new T.Group(); fs.position.set(AX, -.4, 0); A.add(fs); this.vfans.push(fs); this.cyl(.12, .16, W, fs, 0, 0, 0);
      for (let k = 0; k < 6; k++) { const bl = new T.Group(); bl.rotation.y = k*Math.PI/3; fs.add(bl); const b = this.box(.62, .016, .2, W, bl, .45, 0, 0); b.rotation.x = .4; }
      upgradePart(fs, 'fan');
      const housing=new T.Group();housing.position.set(AX,-.35,0);A.add(housing);
      this.mesh(new T.CylinderGeometry(.88, .88, .3, 40, 1, true), this.mats.duct, housing);
      for (const y of [-.15, .15]) { const rim = this.mesh(new T.TorusGeometry(.88, .03, 8, 40), W, housing, 0, y, 0); rim.rotation.x = Math.PI/2; }
      if(this.mode==='air')upgradePart(housing,'fan-shroud');
      this.box(1.76, .03, .05, W, A, AX, -.24, 0); this.box(.05, .03, 1.76, W, A, AX, -.24, 0); this.collar(A, AX, -.24, 0, 'y', true);
      u.bars = []; for (let k = 0; k < 10; k++) { const zz = (k - 4.5)*.17, len = 2*Math.sqrt(Math.max(.01, .88*.88 - zz*zz)), bar = this.box(len, .03, .04, this.mats.dark, A, AX, -.5, zz); bar.visible = false; u.bars.push(bar); }

      // ---- pond: the drive steps DOWN (bevel B -> short vertical shaft -> bevel C), then turns along the boat (bevel D) to a large paddle wheel that hangs deep in the water.
      const Wt = u.waterOut = new T.Group(); g.add(Wt);
      const Yl = WHEEL_Y;
      this.bevelGear(Wt, new T.Vector3(AX, Y - R, 0), [0, 0, Math.PI/2], -1, Math.PI/BEVEL_N);       // B: turns the drive down
      this.cyl(.075, .5, W, Wt, AX, (Y - R - .3 + Yl + R + .3)/2, 0);                                   // short vertical shaft B -> C
      this.collar(Wt, AX, (Y + Yl)/2 + .02, 0, 'y', true);
      this.bevelGear(Wt, new T.Vector3(AX, Yl + R, 0), [0, 0, -Math.PI/2], 1, 0);                      // C: apex points down
      this.bevelGear(Wt, new T.Vector3(AX, Yl, R), [0, Math.PI/2, 0], -1, Math.PI/BEVEL_N);            // D: turns the drive along the boat
      this.cyl(.075, 4.5, W, Wt, AX, Yl, 2.95, 'z');                                                    // output shaft from gear D to the bow
      // the wheel is held at BOTH ends: a pillow-block stand behind it on the stern deck and one in front on the bow beam
      this.stand(Wt, AX, 1.75, Yl - .1, Math.PI/2, K, K); this.collar(Wt, AX, Yl, 1.55, 'z', true);
      this.stand(Wt, AX, 5.0, Yl - .1, Math.PI/2, W, W); this.collar(Wt, AX, Yl, 4.8, 'z', false);
      u.goldWater = new T.Group(); u.goldWater.position.set(AX, Yl, 2.2); Wt.add(u.goldWater); this.fans.push(u.goldWater); this.mesh(this.toothUnit, this.mats.gold, u.goldWater);
      const pd = new T.Group(); pd.position.set(AX, Yl, WHEEL_Z); Wt.add(pd); this.fans.push(pd);
      const RR = WHEEL_R - .22;                                                                          // rim radius
      this.cyl(.24, 1.5, K, pd, 0, 0, 0, 'z');                                                         // hub on the shaft
      for (const z of [-.62, .62]) this.mesh(new T.TorusGeometry(RR, .055, 8, 56), K, pd, 0, 0, z);   // two rims
      for (let k = 0; k < 8; k++) {
        const arm = new T.Group(); arm.rotation.z = k*Math.PI/4; pd.add(arm);
        for (const z of [-.62, .62]) this.box(.09, RR - .2, .07, K, arm, 0, (RR + .2)/2, z);          // spokes hub -> rim
        this.box(.08, .62, 1.4, this.mats.cream, arm, 0, RR, 0);                                       // radial paddle vane, dips deep into the water
      }
      upgradePart(pd, 'paddle');
      Wt.visible = false;
      if (i === 0) this.buildSensors(g, Y);                                        // sensors are shown on the first unit
    }
  }
  // sensors and microcontroller: only drawn when chosen in the panel
  buildSensors(P, Y) {
    const S = this.sensors = {};
    const mast = new T.Group(); mast.position.set(-3.3, 0, -1.0); P.add(mast); S.mast = mast;
    // Bolted feet and knee braces give each sensor a visible load path to the roof/deck.
    this.box(.5, .1, .5, this.mats.black, mast, 0, .05, 0);
    this.cyl(.065, 3.2, this.mats.steel, mast, 0, 1.6, 0);
    for (const x of [-.18, .18]) for (const z of [-.18, .18]) {
      this.cyl(.035, .045, this.mats.steel, mast, x, .12, z);
      this.strut(mast, [x, .1, z], [0, .65, 0], .025, this.mats.steel);
    }
    const cup = new T.Group(); cup.position.y = 3.3; mast.add(cup); S.cup = cup; this.cyl(.025, .3, this.mats.steel, cup, 0, -.1, 0);
    const spin = new T.Group(); cup.add(spin); S.cupSpin = spin;
    for (let i = 0; i < 3; i++) { const a = i*Math.PI*2/3; const arm = this.box(.5, .02, .02, this.mats.steel, spin, Math.cos(a)*.22, 0, Math.sin(a)*.22); arm.rotation.y = -a; this.sphere(.09, this.mats.black, spin, Math.cos(a)*.45, 0, Math.sin(a)*.45); }
    S.cupBody = this.cyl(.07, .2, this.mats.black, cup, 0, -.18, 0); S.cupInd = this.cyl(.1, .1, this.mats.black, cup, 0, -.2, 0);
    const us = new T.Group(); us.position.y = 3.3; mast.add(us); S.ultra = us;
    this.cyl(.15, .3, this.mats.white, us, 0, 0, 0);
    this.cyl(.18, .07, this.mats.black, us, 0, -.13, 0);                         // mast/body clamp
    this.cyl(.07, .14, this.mats.steel, us, 0, .2, 0);                          // body -> lower plate
    this.cyl(.34, .08, this.mats.black, us, 0, .27, 0);
    for (const [dx, dz] of [[.18, .18], [-.18, .18], [.18, -.18], [-.18, -.18]]) {
      this.cyl(.035, .56, this.mats.steel, us, dx, .58, dz);                   // overlaps both plates
      for (const y of [.32, .84]) this.cyl(.06, .065, this.mats.white, us, dx, y, dz); // sockets at both ends
    }
    this.cyl(.34, .08, this.mats.black, us, 0, .89, 0);                        // connected upper plate
    this.cyl(.25, .035, this.mats.white, us, 0, .94, 0);                       // weather cap
    const hall = new T.Group(); hall.position.set(-.4, Y + .22, 0); P.add(hall); S.hall = hall; this.box(.14, .12, .1, this.mats.black, hall); this.box(.04, .04, .04, this.mats.led, hall, 0, -.08, 0);
    const co2 = new T.Group(); co2.position.set(AX + .98, -.35, 0); P.add(co2); S.co2 = co2; this.box(.34, .22, .22, this.mats.black, co2); this.box(.14, .08, .02, this.mats.led, co2, 0, 0, .12);
    const doP = new T.Group(); doP.position.set(AX + 1.2, 0, 5.0); P.add(doP); S.doProbe = doP; this.box(.3, .2, .2, this.mats.black, doP, 0, .35, 0); this.cyl(.035, 1.7, this.mats.black, doP, 0, -.55, 0); this.cyl(.06, .3, this.mats.steel, doP, 0, -1.35, 0);
    const rain = new T.Group(); rain.position.set(-2.6, 0, -1.0); P.add(rain); S.rain = rain;
    this.box(.42, .1, .42, this.mats.black, rain, 0, .05, 0);
    for (const x of [-.14, .14]) for (const z of [-.14, .14]) this.cyl(.03, .045, this.mats.steel, rain, x, .12, z);
    this.cyl(.06, 3.0, this.mats.steel, rain, 0, 1.5, 0);
    this.strut(rain, [-.17, .1, 0], [0, .55, 0], .025, this.mats.steel);
    this.strut(rain, [.17, .1, 0], [0, .55, 0], .025, this.mats.steel);
    this.cyl(.11, .16, this.mats.white, rain, 0, 2.96, 0);                    // post clamp under the tilt joint
    this.sphere(.095, this.mats.steel, rain, 0, 3.03, 0);
    const rainHead = new T.Group(); rainHead.position.y = 3.06; rainHead.rotation.z = .35; rain.add(rainHead);
    this.box(.26, .16, .2, this.mats.steel, rainHead, 0, .02, 0);             // bracket touches joint and plate
    this.box(.46, .06, .36, this.mats.black, rainHead, 0, .11, 0);
    const temp = new T.Group(); temp.position.set(AX - 1.2, 0, 5.0); P.add(temp); S.temp = temp; this.box(.25, .16, .16, this.mats.black, temp, 0, .3, 0); this.cyl(.03, 1.4, this.mats.steel, temp, 0, -.4, 0); this.sphere(.07, this.mats.black, temp, 0, -1.1, 0);
    const mc = new T.Group(); mc.position.set(-2.7, this.mode === 'air' ? 1.0 : .75, this.mode === 'air' ? 1.4 : .9); P.add(mc); S.mcu = mc; this.cyl(.05, 1.0, this.mats.steel, mc, 0, -.55, 0);
    const controller=new T.Group();mc.add(controller);this.box(.7,.5,.35,this.mats.black,controller);
    if(this.mode==='air')upgradePart(controller,'controller');
    S.mcuLed = this.mesh(new T.SphereGeometry(.035, 12, 8), this.mats.led.clone(), mc, .22, .15, .195);
    const enc = new T.Group(); enc.position.copy(mc.position); P.add(enc); S.enclosure = enc; this.box(.9, .7, .5, this.mats.glass, enc);
    for (const k of ['cup', 'ultra', 'hall', 'co2', 'doProbe', 'rain', 'temp', 'mcu', 'enclosure']) S[k].visible = false;
    S.mast.visible = false;
  }
  setHardware(hw, p) {
    const S = this.sensors; if (!S) return;
    const w = p.windSensor;
    S.cup.visible = w === 'cup_hobby' || w === 'cup_ind'; S.ultra.visible = w === 'ultra'; S.mast.visible = S.cup.visible || S.ultra.visible; S.hall.visible = w === 'hall';
    S.co2.visible = this.mode === 'air' && p.qualitySensor !== 'none'; S.doProbe.visible = this.mode === 'water' && p.qualitySensor !== 'none';
    S.rain.visible = this.mode === 'air' && p.envSensor !== 'none'; S.temp.visible = this.mode === 'water' && p.envSensor !== 'none';
    S.mcu.visible = p.mcu !== 'none'; S.enclosure.visible = p.mcu !== 'none' && p.enclosure !== 'none';
    const st = hw.items.mcu.res ? hw.items.mcu.res.status : 'ok';
    const c = st === 'fail' ? '#ff5a4d' : st === 'warn' ? '#ffc04d' : '#6fe08a';
    S.mcuLed.material.color.set(c); S.mcuLed.material.emissive.set(c);
  }

  /* ---------------- layout-dependent shells ---------------- */
  // Prototype positions. Air: up to two rows on the roof. Water: one row on the deck behind the basin.
  unitPos(i) {
    const n = this.count;
    if (this.mode === 'air') {
      const g = grid(n, true), c = i % g.cols, r = Math.floor(i / g.cols);
      return {x: (c - (g.cols - 1)/2)*PITCH_X + .33, y: ROOF_TOP, z: (r - (g.rows - 1)/2)*PITCH_Z - 1.8};
    }
    return this.unitFrame(i);
  }
  // pond: the unit rides on a boat. boatPose[b] is the hull centre; the unit origin sits behind it on the deck.
  unitFrame(i) {
    const b = Math.floor(i/this.upb), j = i % this.upb, bs = this.boatPose[b] || {x:0, z:0, ry:0, heave:0}, s = BOAT_S;
    const xo = (j - (this.upb - 1)/2)*BOAT_PITCH, c = Math.cos(bs.ry), sn = Math.sin(bs.ry);
    const ox = bs.x - s*(AX*c + 2.2*sn), oz = bs.z - s*(-AX*sn + 2.2*c);
    return {x: ox + s*xo*c, z: oz - s*xo*sn, y: WATER_Y + DECK_DROP*s + bs.heave, ry: bs.ry, s, ox, oz, hy: WATER_Y + DECK_DROP*s + bs.heave};
  }
  wheelPos(i) { const f = this.unitFrame(i), c = Math.cos(f.ry), sn = Math.sin(f.ry); return {x: f.x + f.s*(AX*c + WHEEL_Z*sn), z: f.z + f.s*(-AX*sn + WHEEL_Z*c)}; }
  layout(p) {
    const n = clamp(Math.round(p.units), 1, MAX_UNITS); this.count = n; let key;
    if (this.mode === 'air') {
      const FA = Math.max(4, p.room / WALL_H), g = grid(n, true);     // room volume sets the floor area
      this.roomW = Math.max((g.cols - 1)*PITCH_X + 6, Math.sqrt(FA*1.6));
      this.roomD = Math.max((g.rows - 1)*PITCH_Z + 6, FA / this.roomW);
      this.extent = Math.max(this.roomW, this.roomD);
      key = ['air', n, this.roomW.toFixed(2), this.roomD.toFixed(2)].join('|');
    } else {
      const boats = clamp(Math.round(p.boats), 1, MAX_BOATS), upb = clamp(Math.round(p.upb), 1, MAX_UPB), mount = p.mount === 'anchored' ? 'anchored' : 'boat';
      this.boats = boats; this.upb = upb; this.mount = mount; this.count = boats*upb;
      // Pond volume sets the drawn surface area (about 1 m deep): 20 m³ is a small pond, 500 m³ a large one.
      // Boats need room to move without touching, so a crowded pond is only enlarged as far as the boats require.
      const bw = upb*BOAT_PITCH*BOAT_S, Avol = 150 + (clamp(p.pond, 20, 500) - 20)*(1100/480);
      let A = Avol, Lmin = 14, Wmin = 11;
      if (mount === 'anchored') { Lmin = Math.max(Lmin, boats*(bw + 2) + 8); Wmin = 12; }
      else { const perBoat = (bw + 1.5)*(BOAT_FOOT + 1.5)*3; A = Math.max(A, boats*perBoat); Wmin = Math.max(Wmin, bw + 6); }
      this.pondL = clamp(Math.max(Math.sqrt(A*1.6), Lmin), 14, 70);
      this.pondW = clamp(Math.max(A/this.pondL, Wmin), 11, 34);
      this.extent = Math.max(this.pondL, this.pondW*1.3);
      key = ['water', boats, upb, mount, this.pondL.toFixed(2), this.pondW.toFixed(2)].join('|');
    }
    if (key !== this.layoutKey) { this.layoutKey = key; this.buildShell(); }
    const R = Math.max(12, this.extent*.7), sc = this.sun.shadow.camera;
    sc.left = -R; sc.right = R; sc.top = R; sc.bottom = -R; sc.far = Math.max(60, R*4); sc.updateProjectionMatrix();
    this.sun.position.set(-R*.6, R*1.1, R*.75);
  }
  buildShell() {
    retireShell(this.shell, Object.values(this.mats)); this.trees = []; this.fish = []; this.rings = []; this.rainRings = []; this.people = []; this.panes = []; this.water = null;
    if (this.mode === 'air') this.buildRoomShell(); else this.buildPondShell();
    this.buildTrees();
    if (this.mode === 'air') dressArchitecture(this);
    dressLandscape(this);
  }
  // Enclosed teaching model: transparent walls and roof keep the whole interior visible.
  buildRoomShell() {
    const S = this.shell, m = this.mats, W = this.roomW, D = this.roomD, n = this.count;
    const glassBox = (w,h,d,x,y,z) => { const o = this.box(w,h,d,m.shellGlass,S,x,y,z); o.castShadow = false; return o; };
    this.box(W + .6, FLOOR_TOP, D + .6, m.concrete, S, 0, FLOOR_TOP/2, 0);
    glassBox(W, WALL_H, .16, 0, FLOOR_TOP + WALL_H/2, -D/2).name = 'back-wall';
    // Complete roof with real exhaust openings around the prototype curbs.
    const roofShape = new T.Shape();
    roofShape.moveTo(-W/2-.2,-D/2-.2); roofShape.lineTo(W/2+.2,-D/2-.2); roofShape.lineTo(W/2+.2,D/2+.2); roofShape.lineTo(-W/2-.2,D/2+.2); roofShape.closePath();
    for (let i=0;i<n;i++) { const q=this.unitPos(i), hole=new T.Path(); hole.absarc(q.x+AX,-q.z,.45,0,Math.PI*2,true); roofShape.holes.push(hole); }
    const roof = this.mesh(new T.ExtrudeGeometry(roofShape,{depth:.2,bevelEnabled:false,curveSegments:32}),m.shellGlass,S,0,3.5,0);
    roof.rotation.x=-Math.PI/2; roof.castShadow=false; roof.name='full-roof';
    for (const side of [-1,1]) {
      this.box(W+.3,.12,.12,m.white,S,0,3.56,side*D/2);
      this.box(.12,.12,D+.3,m.white,S,side*W/2,3.56,0);
      for (const end of [-1,1]) this.box(.12,WALL_H,.12,m.white,S,side*W/2,FLOOR_TOP+WALL_H/2,end*D/2);
    }
    // Front wall is built around a doorway, so the hinged door opens to the outside.
    const doorW=1.05, doorH=2.25, hingeX=W/2-1.9, rightX=hingeX+doorW, front=D/2;
    glassBox(hingeX+W/2,WALL_H,.16,(-W/2+hingeX)/2,FLOOR_TOP+WALL_H/2,front).name='front-wall-left';
    glassBox(W/2-rightX,WALL_H,.16,(rightX+W/2)/2,FLOOR_TOP+WALL_H/2,front).name='front-wall-right';
    glassBox(doorW,WALL_H-doorH,.16,hingeX+doorW/2,FLOOR_TOP+doorH+(WALL_H-doorH)/2,front);
    for (const x of [hingeX,rightX]) this.box(.08,doorH,.22,m.white,S,x,FLOOR_TOP+doorH/2,front);
    this.box(doorW+.08,.08,.22,m.white,S,hingeX+doorW/2,FLOOR_TOP+doorH,front);
    this.doorPivot=new T.Group(); this.doorPivot.name='entrance-door'; this.doorPivot.position.set(hingeX,FLOOR_TOP,front); S.add(this.doorPivot);
    const door=this.box(doorW-.08,doorH-.06,.06,m.win,this.doorPivot,doorW/2,doorH/2,0); door.castShadow=false;
    for (const x of [.04,doorW-.04]) this.box(.06,doorH,.08,m.wood,this.doorPivot,x,doorH/2,0);
    for (const y of [.04,doorH-.04]) this.box(doorW,.08,.08,m.wood,this.doorPivot,doorW/2,y,0);
    this.sphere(.055,m.gold,this.doorPivot,doorW-.16,1.05,.1);
    this.setDoorOpen(!!this.doorOpen);
    // desk and monitor
    const dx = -W/2 + 1.35;
    const desk = new T.Group(); desk.position.x=dx; S.add(desk);
    this.box(1.5, .08, .8, m.wood, desk, 0, .95, 0);
    for (const [lx, lz] of [[-.65, -.32], [.65, -.32], [-.65, .32], [.65, .32]]) this.box(.07, .61, .07, m.dark, desk, lx, .62, lz);
    this.box(.5, .32, .035, m.dark, desk, -.1, 1.25, -.12);
    upgradePart(desk,'workspace');
    // Build the walls around real openings, rather than hiding glass behind a solid wall.
    const nW = Math.max(1, Math.floor(D/2.6)), sill = 1.05, windowH = 1.5, top = sill + windowH;
    for (const side of [-1, 1]) for (let k = 0; k < nW; k++) {
      const cell = D/nW, w = cell*.7, zc = -D/2 + (k + .5)*cell;
      const x = side*W/2, pier = (cell - w)/2;
      glassBox(.16, sill - FLOOR_TOP, cell, x, (sill + FLOOR_TOP)/2, zc);
      glassBox(.16, FLOOR_TOP + WALL_H - top, cell, x, (top + FLOOR_TOP + WALL_H)/2, zc);
      for (const end of [-1, 1]) {
        glassBox(.16, windowH, pier, x, sill + windowH/2, zc + end*(w/2 + pier/2));
        this.box(.24, windowH + .12, .08, m.white, S, x, sill + windowH/2, zc + end*w/2);
        this.box(.24, .08, w, m.white, S, x, end < 0 ? sill : top, zc);
      }
      const piv = new T.Group(); piv.name = 'ventilation-window'; piv.position.set(x, sill + windowH/2, zc - w/2); S.add(piv);
      this.box(.05, windowH - .12, w - .12, m.win, piv, 0, 0, w/2);
      for (const end of [-1, 1]) {
        this.box(.08, windowH, .06, m.dark, piv, 0, 0, end < 0 ? .03 : w - .03);
        this.box(.08, .06, w, m.dark, piv, 0, end*(windowH/2 - .03), w/2);
      }
      this.box(.08, windowH, .04, m.white, piv, 0, 0, w/2);
      this.panes.push({piv, sign: -side, x, zc, width:w, y:sill + windowH/2});
    }
    // Seated occupants and clinic details, with no long benches across the room.
    const cols = Math.max(2, Math.floor((W - 1.4)/.85)), rows = Math.ceil(MAX_PEOPLE/cols), zS = -D/2 + 1.0, zE = D/2 - 1.6, step = rows > 1 ? (zE - zS)/(rows - 1) : 0;
    const xs = c => -W/2 + .9 + c*(W - 1.8)/Math.max(1, cols - 1), F = FLOOR_TOP;
    for (let k = 0; k < MAX_PEOPLE; k++) {
      const c = k % cols, r = Math.floor(k/cols), g = new T.Group(); g.position.set(xs(c), F, zS + r*step); S.add(g); this.people.push(g);
      const chair=new T.Group();g.add(chair);
      this.box(.4, .05, .4, m.dark, chair, 0, .46, 0); this.box(.4, .4, .05, m.dark, chair, 0, .72, -.2);
      upgradePart(chair,'chair');
      this.cyl(.15, .52, k % 2 ? m.shirtB : m.shirtA, g, 0, .76, 0); this.sphere(.13, m.skin, g, 0, 1.13, 0);               // seated torso and head
      for (const dx of [-.08, .08]) { this.cyl(.05, .42, m.dark, g, dx, .53, .2, 'z'); this.cyl(.045, .44, m.dark, g, dx, .27, .41); }   // thighs and shins
    }
    const bz = -D/2 + .1;
    this.box(1.15, 1.15, .03, m.white, S, -W/2 + 2.4, F + 2.1, bz); this.box(.78, .2, .04, m.cross, S, -W/2 + 2.4, F + 2.1, bz + .02); this.box(.2, .78, .04, m.cross, S, -W/2 + 2.4, F + 2.1, bz + .02);   // health cross
    for (const px of [W/2 - .55, -W/2 + .5]) { this.cyl(.17, .32, m.trunk, S, px, F + .16, -D/2 + .6); for (let j = 0; j < 3; j++) this.sphere(.2 - j*.03, m.leaf2, S, px + (j - 1)*.08, F + .5 + j*.18, -D/2 + .6); }  // plants
    for (let j = 0; j < 5; j++) this.box(.04, .07, .95, m.white, S, -W/2 + .12, F + .45 + j*.15, -D/2 + 1.6);              // fresh-air louvre low on the side wall
    // canyon blocks (environment option) and the path
    this.canyon = new T.Group(); S.add(this.canyon);
    for (const k of [-1, 1]) this.canyonBlock(this.canyon, k*(W/2 + 6), 0);
    this.box(W + 8, .12, 1.3, m.path, S, 0, .06, D/2 + 2.6);
  }
  // the original pond: basin with rim, timber walkway and deck, fish, reeds, ripples
  // pontoon boat hull in unit-local coordinates (bow +z, deck top at y = 0, waterline at y = -DECK_DROP)
  buildHull(parent, upb) {
    const m = this.mats;
    for (let j = 0; j < upb; j++) {
      const xo = (j - (upb - 1)/2)*BOAT_PITCH;
      for (const sx of [-2.15, 2.15]) {                                                    // two white PLA floats per unit
        const px = xo + AX + sx;
        this.cyl(.4, 6.4, m.pontoon, parent, px, -.46, 2.2, 'z');
        this.sphere(.4, m.pontoon, parent, px, -.46, -1.0); this.sphere(.4, m.pontoon, parent, px, -.46, 5.4);
      }
      this.box(4.9, .1, 1.0, m.wood, parent, xo + AX, -.05, 5.0);                          // bow beam carries the front wheel support
      for (const z of [-.6, 1.6]) this.box(4.9, .08, .14, m.black, parent, xo + AX, -.18, z + .2);
    }
    this.box(upb*BOAT_PITCH, .1, 3.4, m.wood, parent, 0, -.05, .7);                          // stern deck: rotor stands, gears, electronics, rear wheel support
    for (let k = 0; k < 8; k++) this.box(upb*BOAT_PITCH, .012, .03, m.plank, parent, 0, .002, -.9 + k*.43);
    this.box(upb*BOAT_PITCH, .14, .06, m.pontoon, parent, 0, .08, -1.0);                      // stern rail
  }
  // the pond: deep basin, timber shore deck, fish, reeds; units ride on pontoon boats (moving, or moored)
  buildPondShell() {
    const S = this.shell, m = this.mats, L = this.pondL, W = this.pondW, zc = POND_BACK + W/2; this.pondZc = zc;
    this.box(L + 2, POND_Y, 5.2, m.wood, S, 0, POND_Y/2, POND_BACK - 2.6);                    // timber deck behind the basin
    for (let i = 0; i < 13; i++) this.box(L + 2, .01, .03, m.plank, S, 0, POND_Y + .005, POND_BACK - 5.0 + i*.4);
    this.box(L, .2, W, m.basin, S, 0, -.4, zc);                                                // basin floor (deep, so the wheel hangs well under water)
    this.box(L + .5, 1.38, .24, m.concrete, S, 0, .39, POND_BACK + W + .12);                  // rims
    this.box(.24, 1.38, W + .24, m.concrete, S, -L/2 - .12, .39, zc);
    this.box(.24, 1.38, W + .24, m.concrete, S, L/2 + .12, .39, zc);
    this.box(L + .5, 1.38, .24, m.concrete, S, 0, .39, POND_BACK - .12);
    this.water = new T.Mesh(new T.PlaneGeometry(L, W, Math.max(16, Math.round(L*2)), Math.max(10, Math.round(W*2))), m.water);
    this.water.rotation.x = -Math.PI/2; this.water.position.set(0, WATER_Y, zc); this.water.receiveShadow = true; this.water.renderOrder = 2; S.add(this.water);
    m.water.userData.waterUniforms.zwSize.value.set(L,W);
    // paddle ripples (three per unit) and rain rings
    for (let i = 0; i < MAX_UNITS*3; i++) { const r = new T.Mesh(new T.TorusGeometry(.25 + (i%3)*.35, .012, 6, 50), m.ripple); r.rotation.x = -Math.PI/2; r.visible = false; S.add(r); this.rings.push(r); }
    for (let i = 0; i < 16; i++) { const r = new T.Mesh(new T.RingGeometry(.12, .16, 20), m.ripple); r.rotation.x = -Math.PI/2; r.position.set((Math.random() - .5)*L*.9, WATER_Y + .015, POND_BACK + .3 + Math.random()*(W - .6)); r.userData.seed = Math.random(); r.visible = false; S.add(r); this.rainRings.push(r); }
    // fish: count follows oxygen demand, they gather at the surface when oxygen is short
    for (let i = 0; i < MAX_FISH; i++) {
      const g = new T.Group(); const body = new T.Mesh(new T.SphereGeometry(.14, 12, 8), m.fish); body.scale.set(2, .55, .7); g.add(body);
      const tail = new T.Mesh(new T.ConeGeometry(.16, .23, 3), m.fishTail); tail.rotation.z = Math.PI/2; tail.position.x = -.3; g.add(tail);
      g.userData.home = {x: -L/2 + 1.2 + (i%4)*(L - 2.4)/3, z: POND_BACK + 1 + (Math.floor(i/4) + .5)*(W - 2)/2};
      g.position.set(g.userData.home.x, .55, g.userData.home.z); S.add(g); this.fish.push(g);
    }
    // reeds along both banks
    for (let i = 0; i < 8; i++) {
      const side = i % 2 ? 1 : -1, x = side*(L/2 + 1.0 + (i >> 2)*.4), z = POND_BACK + .8 + ((i >> 1) % 4)*(W - 1.6)/3, h = 1.0 + (i % 3)*.3;
      this.cyl(.02, h, m.reed, S, x, -.3 + h/2, z); this.cyl(.06, .25, m.cattail, S, x, -.3 + h - .12, z);
    }
    // boats: one hull group per boat; moving boats circulate around the pond and steer around each other, moored boats sit in a row at the deck
    const prevSim = this.boatSim, pL = this._simL, pW = this._simW;
    this.boatGroups = []; this.boatPose = []; this.boatTheta = []; this.boatSim = []; this.lanes = []; this.laneOf = [];
    const bw = this.upb*BOAT_PITCH*BOAT_S, nl = this.boats > 3 ? 2 : 1;
    this.lanes = nl === 2 ? [.88, .5] : [.8];
    for (let b = 0; b < this.boats; b++) {
      const bg = new T.Group(); S.add(bg); this.buildHull(bg, this.upb); this.boatGroups.push(bg);
      const lane = b % nl, k = Math.floor(b/nl), cnt = Math.ceil((this.boats - lane)/nl);
      this.laneOf.push(lane); this.boatTheta.push(k/cnt*Math.PI*2 + lane*.9); this.boatPose.push({x:0, z:zc, ry:0, heave:0});
      const ax = Math.max(1, L/2 - this.boatMargin()), bz = Math.max(1, W/2 - this.boatMargin()), th = this.boatTheta[b], ro = this.lanes[lane];
      let st = {x: ro*ax*Math.cos(th), z: zc + ro*bz*Math.sin(th), h: Math.atan2(-ax*Math.sin(th), bz*Math.cos(th))};
      if (prevSim && prevSim.length === this.boats && pL && pW) { const o = prevSim[b]; st = {x: o.x*L/pL, z: zc + (o.z - (POND_BACK + pW/2))*W/pW, h: o.h}; }   // keep boats where they were when the pond is resized
      this.boatSim.push(st);
      if (this.mount === 'anchored') {                                                   // mooring posts on the rim in front of each boat
        const x = (b - (this.boats - 1)/2)*(bw + 2);
        for (const dx of [-bw*.3, bw*.3]) this.cyl(.1, 1.1, m.trunk, S, x + dx, 1.35, POND_BACK - .05);
      }
    }
    this._simL = L; this._simW = W;
    if (this.mount === 'boat') for (let i = 0; i < 40; i++) this.separateBoats();       // start with no overlaps
    this.poseBoats(0);
    this.canyon = new T.Group(); S.add(this.canyon);
    for (const k of [-1, 1]) this.canyonBlock(this.canyon, k*(L/2 + 6.5), zc);
    this.box(L + 8, .12, 1.3, m.path, S, 0, .06, POND_BACK + W + 2.6);
    this.parkBench(S, L/2 - 1.2, POND_BACK + W + 1.9);
  }
  // ---- boat traffic: every boat is a set of circles along its width; they are pushed apart so boats can never pass through each other ----
  boatMargin() { return Math.max(this.upb*BOAT_PITCH*BOAT_S/2, BOAT_R) + .6; }
  boatCircles(q) {
    const w = this.upb*BOAT_PITCH*BOAT_S, off = Math.max(0, w/2 - BOAT_R), n = off > .05 ? 2 : 1, c = Math.cos(q.h), sn = Math.sin(q.h), out = [];
    for (let i = 0; i < n; i++) { const o = n === 1 ? 0 : (i ? off : -off); out.push({x: q.x + o*c, z: q.z - o*sn}); }
    return out;
  }
  separateBoats() {
    const L = this.pondL, W = this.pondW, z0 = POND_BACK, S = this.boatSim, n = S.length, R = BOAT_R, gap = .25;
    for (let pass = 0; pass < 3; pass++) {
      for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) {
        const ca = this.boatCircles(S[a]), cb = this.boatCircles(S[b]);
        for (const u of ca) for (const v of cb) {
          let dx = v.x - u.x, dz = v.z - u.z, d = Math.hypot(dx, dz); const need = 2*R + gap;
          if (d >= need) continue;
          if (d < 1e-4) { dx = Math.cos(a*2.4 + b); dz = Math.sin(a*2.4 + b); d = 1; }
          const push = (need - d)/2, nx = dx/d, nz = dz/d;
          S[a].x -= nx*push; S[a].z -= nz*push; S[b].x += nx*push; S[b].z += nz*push;
        }
      }
      for (const q of S) {                                  // keep every circle inside the basin
        const cs = this.boatCircles(q);
        for (const c of cs) {
          const dxp = c.x - (L/2 - R - .15), dxn = (-L/2 + R + .15) - c.x;
          if (dxp > 0) q.x -= dxp; else if (dxn > 0) q.x += dxn;
          const dzp = c.z - (z0 + W - R - .15), dzn = (z0 + R + .15) - c.z;
          if (dzp > 0) q.z -= dzp; else if (dzn > 0) q.z += dzn;
        }
      }
    }
  }
  stepBoats(dt, speed) {
    const L = this.pondL, W = this.pondW, zc = this.pondZc, S = this.boatSim, m = this.boatMargin(), ax = Math.max(1, L/2 - m), bz = Math.max(1, W/2 - m);
    const R = BOAT_R, look = 2*R + 3.2;
    if (speed <= 0) { this.separateBoats(); return; }
    for (let b = 0; b < S.length; b++) {
      const q = S[b], dx = q.x, dz = q.z - zc, ro = this.lanes[this.laneOf[b]] ?? .8;
      // circulate counter-clockwise around the pond, drifting back to this boat's own lane
      let tx = -(ax/bz)*dz, tz = (bz/ax)*dx; const tl = Math.hypot(tx, tz) || 1; tx /= tl; tz /= tl;
      const rho = Math.hypot(dx/ax, dz/bz), nx0 = -dx/(ax*ax), nz0 = -dz/(bz*bz), nl = Math.hypot(nx0, nz0) || 1;
      const pull = clamp((rho - ro)*2.2, -1.2, 1.2);
      let vx = tx + pull*nx0/nl, vz = tz + pull*nz0/nl;
      // steer away from boats that are close
      for (let o = 0; o < S.length; o++) {
        if (o === b) continue;
        for (const u of this.boatCircles(q)) for (const v of this.boatCircles(S[o])) {
          const ex = u.x - v.x, ez = u.z - v.z, d = Math.hypot(ex, ez);
          if (d < look && d > 1e-4) { const w = (1 - d/look)*2.4; vx += ex/d*w; vz += ez/d*w; }
        }
      }
      const want = Math.atan2(vx, vz); let diff = want - q.h; diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      const rate = 1.4*dt; q.h += clamp(diff, -rate, rate);
      q.x += Math.sin(q.h)*speed*dt; q.z += Math.cos(q.h)*speed*dt;
    }
    this.separateBoats();
  }
  // hull centre pose for every boat (moving: oval lanes, heading along the lane; moored: fixed row, bow to the pond)
  poseBoats(t) {
    const s = BOAT_S, bw = this.upb*BOAT_PITCH*s;
    for (let b = 0; b < this.boats; b++) {
      const P = this.boatPose[b], amp = (.012 + .05*this.rainAmt + (this.storm ? .06 : 0))*1; P.heave = Math.sin(t*1.4 + b*1.9)*amp;
      if (this.mount === 'anchored') { P.x = (b - (this.boats - 1)/2)*(bw + 2); P.z = POND_BACK + 3.3; P.ry = 0; }
      else { const q = this.boatSim[b]; if (q) { P.x = q.x; P.z = q.z; P.ry = q.h; } }
      const g = this.boatGroups[b]; if (!g) continue;
      const f = this.unitFrame(b*this.upb);
      g.position.set(f.ox, f.hy, f.oz); g.rotation.set(0, P.ry, 0); g.scale.setScalar(s);
    }
  }
  canyonBlock(parent, x, z) {
    this.box(2.4, 9, 6, this.mat('#65776b'), parent, x, 4.5, z);
    for (let y = 0; y < 8; y++) for (let k = 0; k < 4; k++) this.box(.03, .42, .6, this.mat('#456158'), parent, x - Math.sign(x)*1.22, .6 + y, z - 2.1 + k*1.3);
  }
  parkBench(parent, x, z) {
    this.box(1.6, .12, .5, this.mat('#95845c'), parent, x, .7, z); this.box(1.6, .45, .1, this.mat('#95845c'), parent, x, 1.0, z + .25);
    for (const dx of [-.65, .65]) this.box(.08, .5, .4, this.mats.dark, parent, x + dx, .4, z);
  }
  buildTrees() {
    const S = this.shell; let spots;
    if (this.mode === 'air') { const W = this.roomW; spots = [[-(W/2 + 2.8), 2.2], [-(W/2 + 3.6), -2.5], [-(W/2 + 2.4), -.6], [W/2 + 2.8, 2.6], [W/2 + 3.6, -1.8], [W/2 + 2.4, .2]]; }
    else { const L = this.pondL, W = this.pondW; spots = [[-(L/2 + 2.4), POND_BACK + 1], [-(L/2 + 3.6), POND_BACK + W*.6], [L/2 + 2.4, POND_BACK + W*.3], [L/2 + 3.6, POND_BACK + W*.9], [-(L/2 + 2.2), POND_BACK + W + 2.8], [L/2 + 2.2, POND_BACK + W + 3.2], [-4, -6.2], [5, -6.6]]; }
    for (const [x, z] of spots) {
      const tree = new T.Group(); tree.position.set(x, -.3, z); S.add(tree);
      this.cyl(.12, 1.7, this.mats.trunk, tree, 0, .85, 0);
      for (let j = 0; j < 3; j++) { const leaf = this.sphere(.72 - j*.12, j % 2 ? this.mats.leaf2 : this.mats.leaf, tree, j === 1 ? .3 : 0, 1.8 + j*.48, 0); leaf.scale.y = 1.25; }
      this.trees.push(tree);
      upgradePart(tree, 'tree', {scale:[1+(this.trees.length%3)*.14,1+(this.trees.length%2)*.2,1]});
    }
  }

  /* ---------------- particles ---------------- */
  buildFx() {
    const F = this.fx;
    this.flowN = 140; this.flowSeed = Array.from({length: this.flowN}, () => [Math.random(), Math.random(), Math.random()]);
    this.flowGeo = this.pointGeo(this.flowN); this.flow = new T.Points(this.flowGeo, new T.PointsMaterial({color:'#e9f5d6', size:.05, transparent:true, opacity:.7, depthWrite:false})); F.add(this.flow);
    this.stackN = 24; this.stackSeed = Array.from({length: MAX_UNITS*this.stackN}, () => [Math.random(), Math.random(), Math.random()]);
    this.stackGeo = this.pointGeo(MAX_UNITS*this.stackN); this.stackPts = new T.Points(this.stackGeo, new T.PointsMaterial({color:'#d9f2c4', size:.06, transparent:true, opacity:.8, depthWrite:false})); F.add(this.stackPts);
    this.ventN = 24; this.ventSeed = Array.from({length: this.ventN}, () => [Math.random(), Math.random(), Math.random()]);
    this.ventGeo = this.pointGeo(this.ventN); this.vent = new T.Points(this.ventGeo, new T.PointsMaterial({color:'#bfe9ff', size:.07, transparent:true, opacity:.7, depthWrite:false})); F.add(this.vent);
    this.splashN = 12; this.splashGeo = this.pointGeo(MAX_UNITS*this.splashN); this.splash = new T.Points(this.splashGeo, new T.PointsMaterial({color:'#b9e0d6', size:.05, transparent:true, opacity:.85, depthWrite:false})); F.add(this.splash);
    this.heatN = 70; this.heatSeed = Array.from({length: this.heatN}, () => [Math.random(), Math.random(), Math.random()]);
    this.heatGeo = this.pointGeo(this.heatN); this.heatPts = new T.Points(this.heatGeo, new T.PointsMaterial({color:'#ffe2a8', size:.09, transparent:true, opacity:.5, depthWrite:false})); F.add(this.heatPts);
    this.boltGeo = this.pointGeo(9); this.bolt = new T.Line(this.boltGeo, new T.LineBasicMaterial({color:'#f4fbff', fog:false})); this.bolt.visible = false; F.add(this.bolt);
    // rain streaks
    const n = 700, positions = new Float32Array(n*6);
    for (let i = 0; i < n; i++) { const x = (Math.random() - .5)*34, y = Math.random()*14, z = (Math.random() - .5)*26; positions.set([x, y, z, x - .12, y + .42, z], i*6); }
    this.rainGeo = new T.BufferGeometry(); this.rainGeo.setAttribute('position', new T.BufferAttribute(positions, 3));
    this.rain = new T.LineSegments(this.rainGeo, new T.LineBasicMaterial({color:'#b8d1c7', transparent:true, opacity:.5})); this.rain.visible = false; this.env.add(this.rain);
  }

  /* ---------------- environment, layout and view ---------------- */
  setEnvironment(s, p) {
    const previousLayout=this.layoutKey,previousDiameter=this._framingDiameter;
    this.settings = p; this.scenario = s;
    this.storm = s.weather === 'storm'; this.night = s.weather === 'night';
    this.rainAmt = clamp(p.rain, 0, 1);
    this.haze = Math.max(smooth(28, 46, p.ambient), s.weather === 'heat' ? .6 : 0);
    this.layout(p);
    const air = this.mode === 'air';
    this.rotorGroups.forEach(g => g.scale.setScalar(p.diameter));
    this.units.forEach(u => { const r = .2 + .06*p.ratio; u.goldAir.scale.set(r, 1, r); u.goldWater.scale.set(r, r, 1); });
    this.people.forEach((g, k) => g.visible = air && k < p.people);
    const ach = clamp((p.backgroundACH - .2)/1.8, 0, 1);
    this.panes.forEach(pn => pn.piv.rotation.y = pn.sign*ach*1.1);
    const bars = Math.round(clamp(p.pressure/8, 1, 10));
    this.units.forEach(u => u.bars.forEach((bar, k) => bar.visible = air && k < bars));
    if (this.canyon) this.canyon.visible = s.environment === 'canyon';
    if (this.water) {
      const c = this.mats.water.color, t = clamp((p.temp - 10)/20, 0, 1);
      c.set('#3d6c72').lerp(new T.Color('#527b68'), t).multiplyScalar(1 - .15*p.oxygenDemand);
      if (this.night) c.multiplyScalar(.55);
      if (this.storm) c.lerp(new T.Color('#3f6d64'), .4);
    }
    this.placeUnits(); this.applyView();
    if(this.mode==='air'&&this._cameraPose&&!this.cameraUser&&(previousLayout!==this.layoutKey||previousDiameter!==p.diameter))this.setView(this.view);
    this._framingDiameter=p.diameter;
  }
  applyView() {
    const bench = this.view === 'bench';
    this.env.visible = !bench; this.shell.visible = !bench; this.fx.visible = !bench; this.table.visible = bench; this.benchSlab.visible = this.mode === 'air';
    this.placeUnits();
  }
  placeUnits() {
    if (!this.settings) return;
    const bench = this.view === 'bench', air = this.mode === 'air';
    this.units.forEach((u, i) => {
      u.g.visible = bench ? i === 0 : i < this.count;
      u.g.rotation.set(0, 0, 0);
      if (bench) { if (air) { u.g.position.set(-.2, .9, .2); u.g.scale.setScalar(1.25); } else { u.g.position.set(-AX, DECK_DROP, -1.2); u.g.scale.setScalar(1); } }
      else if (air) { const q = this.unitPos(i); u.g.position.set(q.x, q.y, q.z); u.g.scale.setScalar(1); }
      else { const f = this.unitFrame(i); u.g.position.set(f.x, f.y, f.z); u.g.rotation.y = f.ry; u.g.scale.setScalar(f.s); }
      u.airOut.visible = air; u.waterOut.visible = !air;
    });
    if (this.benchBoat) this.benchBoat.visible = bench;
    if (this.benchWater) this.benchWater.visible = bench;
    this.table.position.y = air ? 0 : -1.5;
  }
  setView(view) {
    this.view = view; this.applyView();
    if (view === 'bench') { if (this.mode === 'air') { this.target.set(-.5, 2.05, .5); this.distance = 9.6; this.angle = .75; this.elevation = .3; } else { this.target.set(0, .8, 1.4); this.distance = 11; this.angle = .95; this.elevation = .3; } this.scene.background.set('#d0dcd6'); this.scene.fog.color.set('#d0dcd6'); }
    else {
      if (this.mode === 'air') this.target.set(0, 2.3, -.3); else this.target.set(0, .9, this.pondZc);
      this.distance = clamp(12 + this.extent*.5, 12, 36); this.angle = .8; this.elevation = this.mode==='air'?.46:.42;
      if(view==='flow' && this.mode==='air'){this.target.set(0,2.1,-.4);this.angle=.67;this.elevation=.24;this.distance=Math.max(14,this.extent*1.6);}
    }
    if(this.mode==='air')this.distance=viewDistance(this,this.distance);
    if(this.mode==='air'&&view==='bench')this.distance=Math.min(this.maxDistance,this.distance*(1+.6*Math.max(0,(this.settings?.diameter||1)-1)));
    this.cameraUser=false;
    if(this.host.dataset)this.host.dataset.sceneView=view;
    this.cameraPosition();
  }
  inspectPart(name) {
    if(name==='rotor'){this.setView('bench');return;}
    this.setView('flow');
    if(name==='intake'){
      const pn=this.panes.find(p=>p.x>0)||this.panes[0];
      if(pn)this.target.set(pn.x*.55,1.9,pn.zc);
    } else {const q=this.unitPos(0);this.target.set(q.x+1.02,3.6,q.z);}
    this.distance=viewDistance(this,Math.max(11,this.extent));this.cameraPosition();
  }
  setFlows(on) { this.flows = on; }
  setDoorOpen(on) { this.doorOpen=!!on; if (this.doorPivot) this.doorPivot.rotation.y=on ? -Math.PI*.58 : 0; }
  zoomBy(f) { this.cameraUser=true;this.distance = T.MathUtils.clamp(this.distance*f, 4, this.maxDistance||40); this.cameraPosition(); }
  orbitBy(dAngle, dElev = 0) { this.cameraUser=true;this.angle += dAngle; this.elevation = T.MathUtils.clamp(this.elevation + dElev, .05, 1.35); this.cameraPosition(); }
  cameraPosition(snap=false) { advanceCamera(this,0,snap||!this._cameraPose); }
  resize() { const w = this.host.clientWidth, h = this.host.clientHeight; if (w && h) { const old=this.camera.aspect;this.renderer.setSize(w, h, false); this.camera.aspect = w/h; this.camera.updateProjectionMatrix();if(this.mode==='air'&&this.settings&&!this.cameraUser&&Math.abs(old-w/h)>.1)this.setView(this.view); } }
  bind() {
    const c = this.renderer.domElement; this.pointers = new Map(); let old = null, dist = 0;
    c.addEventListener('pointerdown', e => { this.cameraUser=true;this.pointers.set(e.pointerId, [e.clientX, e.clientY]); c.setPointerCapture(e.pointerId); old = [e.clientX, e.clientY]; dist = 0; });
    c.addEventListener('pointermove', e => { if (!this.pointers.has(e.pointerId)) return; this.pointers.set(e.pointerId, [e.clientX, e.clientY]);
      if (this.pointers.size === 2) { const a = [...this.pointers.values()]; const d = Math.hypot(a[0][0] - a[1][0], a[0][1] - a[1][1]); if (dist&&d>0) this.distance = T.MathUtils.clamp(this.distance*dist/d, 4, this.maxDistance||40); dist = d; }
      else if (old) { this.angle -= (e.clientX - old[0])*.007; this.elevation = T.MathUtils.clamp(this.elevation + (e.clientY - old[1])*.005, .05, 1.35); }
      old = [e.clientX, e.clientY]; this.cameraPosition(); });
    for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture']) c.addEventListener(ev, e => { this.pointers.delete(e.pointerId); old = null; dist = 0; });
    c.addEventListener('wheel', e => { e.preventDefault(); this.zoomBy(Math.exp(e.deltaY*.001)); }, {passive:false});
    c.addEventListener('keydown', e => { if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '-', 'Home'].includes(e.key)) { e.preventDefault();
      this.cameraUser=true;
      if (e.key === 'ArrowLeft') this.angle -= .12; if (e.key === 'ArrowRight') this.angle += .12; if (e.key === 'ArrowUp') this.elevation = Math.min(1.35, this.elevation + .08); if (e.key === 'ArrowDown') this.elevation = Math.max(.05, this.elevation - .08);
      if (e.key === '+') this.distance = Math.max(4, this.distance - 1); if (e.key === '-') this.distance = Math.min(this.maxDistance||40, this.distance + 1); if (e.key === 'Home') this.setView(this.view); this.cameraPosition(); } });
  }

  /* ---------------- weather events ---------------- */
  strike() {
    const x = (Math.random() - .5)*34, z = (Math.random() - .5)*24, a = new Float32Array(9*3);
    let cx = x, cz = z;
    for (let k = 0; k < 9; k++) { a[k*3] = cx; a[k*3+1] = 24 - k*3; a[k*3+2] = cz; cx += (Math.random() - .5)*2.6; cz += (Math.random() - .5)*2.6; }
    this.boltGeo.setAttribute('position', new T.BufferAttribute(a, 3)); this.boltGeo.attributes.position.needsUpdate = true;
    this.flashLight.position.set(x, 14, z); this.flashT = .25;
  }
  applySky(fl) {
    if (this.view === 'bench') {
      this.sun.intensity=3; this.hemi.intensity=1.8; this.fill.intensity=.65;
      this.sun.color.set('#fff1dd');this.scene.environmentIntensity=.45;
      this.roomLight.intensity=0;
      return;
    }
    const r = this.rainAmt, h = this.haze, c = this._sky || (this._sky = new T.Color()), tmp = this._tmp || (this._tmp = new T.Color());
    c.set(this.night ? '#162934' : '#b6cbd0');
    c.lerp(tmp.set(this.storm ? '#485e64' : '#8b9fa2'), r*.8);
    if (this.storm) c.lerp(tmp.set('#2f4543'), .45);
    c.lerp(tmp.set('#d6c6a3'), h*.32);
    if (fl > 0) c.lerp(tmp.set('#e4efff'), fl*.6);
    this.scene.background.copy(c); this.scene.fog.color.copy(c);
    this.scene.fog.density = (this.storm ? .025 : this.night ? .017 : .011) + h*.006 + r*.006;
    this.sun.intensity = this.night ? .55 : Math.max(1.2, 3.0 - 1.3*r - .3*h) * (this.storm ? .65 : 1);
    this.sun.color.set(this.night ? '#94b9da' : '#fff1dd').lerp(tmp.set('#ffe0b3'), h*.35);
    this.hemi.intensity = this.night ? .8 : this.storm ? 1.3 : 1.8;
    this.fill.intensity = this.night ? .35 : .65;
    this.scene.environmentIntensity = this.night ? .16 : this.storm ? .3 : .45;
    this.mats.cloud.color.set(this.night ? '#2b3c44' : this.storm ? '#4a5d5a' : r > .3 ? '#7f9188' : '#b4c3b3');
    this.clouds.visible = !this.night; this.stars.visible = this.night; this.moon.visible = this.night;
    this.roomLight.intensity = this.mode === 'air' ? (this.night?9:this.storm?3.5:2.2) : 0;
    if (this.siteLamps) this.siteLamps.forEach(l => l.intensity=this.night ? 3 : 0);
  }

  /* ---------------- per-frame animation ---------------- */
  render(dt, sample, running) {
    if (!this.settings || !sample) return;
    const p = this.settings, air = this.mode === 'air', bench = this.view === 'bench';
    const anim = running ? dt : 0; this.time += anim; const t = this.time;
    advanceCamera(this,dt);
    const wind = sample.wind, rain = this.rainAmt, haze = this.haze;

    // rotating machinery: the rotor follows the wind with a little inertia, so it speeds up and slows down smoothly
    // (also when the wind is raised by blowing, the slider or a gust) instead of jumping between values.
    const braked = !!(sample.stopped || p.brake);
    const want = braked ? 0 : spinTarget(wind);
    if (this.spinW === undefined) this.spinW = 0;
    if (dt > 0) this.spinW += (want - this.spinW)*(1 - Math.exp(-dt/(braked ? .25 : .45)));
    const w = Math.min(this.spinW, dt > 0 ? .5/dt : SPIN_MAX);              // never more than ~0.5 rad per frame, so slow frames cannot make it look backwards
    const rot = w*anim;
    const gearRot = Math.min(w, dt > 0 ? .15/dt : SPIN_MAX)*anim;            // gear teeth are 0.31 rad apart: past ~0.15 rad per frame they would appear to stall or reverse
    this.rotors.forEach(o => o.rotation.x += rot);
    this.gears.forEach(o => o.g.rotation.x += gearRot*o.sign);
    this.fans.forEach(o => o.rotation.z += rot/p.ratio);
    this.vfans.forEach(o => o.rotation.y -= rot/p.ratio);
    if (this.sensors && this.sensors.cupSpin) this.sensors.cupSpin.rotation.y += spinCap(wind*.8, dt)*anim;
    // brake collars: red for the manual brake, amber for storm lock
    const stopped = !!sample.stopped;
    this.units.forEach((u, i) => { const show = i < this.count && !bench && (p.brake || stopped); u.brake.visible = show; if (show) u.brake.material = p.brake ? this.mats.brake : this.mats.storm; });

    // wind-driven trees: lean downwind and sway, more in gusts and storms
    const lean = Math.min(this.storm ? .6 : .5, wind*.022);
    this.trees.forEach((o, i) => { o.rotation.z = -(lean + (.02 + Math.min(.12, wind*.008))*Math.sin(t*2.2 + i*1.7)); o.rotation.x = .03*Math.sin(t*1.7 + i)*(.3 + wind*.05); });

    // windsock: full when the wind is up, drooping in lulls
    const infl = clamp((wind - 1)/5, 0, 1);
    this.sockPivot.rotation.z = -(1 - infl)*1.35 + Math.sin(t*(5 + wind))*.05*(.3 + infl);

    // clouds drift with the wind
    this.clouds.children.forEach(c => { c.position.x += anim*(.2 + wind*.12); if (c.position.x > 32) c.position.x -= 64; });

    // rain streaks and puddles (rain intensity setting)
    const rainN = Math.round(rain*700);
    this.rain.visible = rainN > 0 && !bench; this.rainGeo.setDrawRange(0, rainN*2); this.rain.material.opacity = .25 + .35*rain;
    if (rainN > 0 && running) {
      const a = this.rainGeo.attributes.position.array;
      for (let i = 0; i < rainN*6; i += 6) {
        a[i] += dt*(wind*.25 + 1.5); a[i+1] -= dt*11; a[i+3] = a[i] - .12; a[i+4] = a[i+1] + .42;
        if (a[i+1] < -.3) { const x = (Math.random() - .5)*34; a[i] = x; a[i+1] = 13; a[i+3] = x - .12; a[i+4] = 13.42; }
      }
      this.rainGeo.attributes.position.needsUpdate = true;
    }
    this.puddles.forEach(pd => { const s = smooth(pd.userData.th, pd.userData.th + .25, rain); pd.visible = s > .01 && !bench; pd.scale.setScalar(Math.max(.001, s*pd.userData.base)); });

    // storm debris, more with wind speed
    const debN = (this.storm ? 20 : 0) + Math.round(clamp((wind - 8)/10, 0, 1)*16);
    this.debris.forEach((d, i) => {
      d.visible = i < debN && !bench; if (!d.visible) return; const u = d.userData;
      d.position.x = ((u.x0 + t*(wind*.9 + 4)) % 36) - 18; d.position.y = u.y0 + Math.sin(t*3 + u.ph)*.35; d.position.z = u.z0 + Math.sin(t*.7 + u.ph)*.5;
      d.rotation.x = t*4 + u.ph; d.rotation.y = t*2.5 + u.ph;
    });

    // lightning in storms
    if (this.storm && running) { this.lightT -= dt; if (this.lightT <= 0) { this.strike(); this.lightT = 2.5 + Math.random()*4; } }
    this.flashT = Math.max(0, this.flashT - dt);
    const fl = this.flashT > 0 ? Math.min(1, this.flashT/.25) : 0;
    this.flashLight.intensity = fl*90; this.bolt.visible = fl > .05 && !bench;
    this.applySky(fl);

    // heat haze (ambient temperature): shimmering bands and rising particles
    this.hazeMat.opacity = haze*.07;
    this.hazes.forEach((h, i) => { h.visible = haze > .02 && !bench; h.position.x = Math.sin(t*.4 + i)*2.5; h.scale.y = 1 + .25*Math.sin(t*1.3 + i*2); });
    const heatN = Math.round(haze*70); this.heatPts.visible = heatN > 0 && !bench; this.heatGeo.setDrawRange(0, heatN);
    if (heatN > 0) { const a = this.heatGeo.attributes.position.array; for (let i = 0; i < heatN; i++) { const s = this.heatSeed[i], k = (s[0] + t*.08) % 1; a[i*3] = (s[1] - .5)*26 + Math.sin(t*.9 + i)*.5; a[i*3+1] = .3 + k*6; a[i*3+2] = (s[2] - .5)*18; } this.heatGeo.attributes.position.needsUpdate = true; }

    // wind streaks across the scene
    const flowOn = this.flows && wind > 0 && !bench && !this.ventilationVFX; this.flow.visible = flowOn;
    if (flowOn) {
      const a = this.flowGeo.attributes.position.array, base = air ? 1.2 : .9;
      for (let i = 0; i < this.flowN; i++) { const s = this.flowSeed[i], u = (s[0] + t*Math.min(wind, 25)*.03) % 1; a[i*3] = -18 + u*36; a[i*3+1] = base + s[1]*(air ? 3.6 : 2.2); a[i*3+2] = (s[2] - .5)*(air ? 14 : 10); }
      this.flowGeo.attributes.position.needsUpdate = true;
    }

    // pond boats: drift around the oval lanes (faster in more wind); moored boats just bob
    if (!air && !bench && this.boatGroups.length) {
      if (this.mount === 'boat') this.stepBoats(dt, running ? (.5 + wind*.09) : 0);
      this.poseBoats(t); this.placeUnits();
    }
    // exhaust: room air is drawn up through each fan, out through the roof opening and away above the roof
    if(!this.ventilationVFX){
    const sa = this.stackGeo.attributes.position.array, fF = clamp(sample.airflow/700, .2, 1), yb = FLOOR_TOP + 1.5, yt = ROOF_TOP + 1.5, kf = (ROOF_TOP - .4 - yb)/(yt - yb);
    for (let i = 0; i < MAX_UNITS*this.stackN; i++) {
      const ui = Math.floor(i/this.stackN), s = this.stackSeed[i];
      if (!air || ui >= this.count) { sa[i*3+1] = -100; continue; }
      const q = this.unitPos(ui), k = (s[0] + t*.5*fF) % 1, rr = k < kf ? 1 - .55*(k/kf) : .3 + .25*(1 - (k - kf)/(1 - kf)), ang = s[1]*Math.PI*2, rad = Math.sqrt(s[2])*rr;
      sa[i*3] = q.x + AX + Math.cos(ang)*rad; sa[i*3+1] = yb + k*(yt - yb); sa[i*3+2] = q.z + Math.sin(ang)*rad;
    }
    this.stackGeo.attributes.position.needsUpdate = true;
    this.stackPts.visible = air && sample.airflow > 0 && this.flows && !bench && !this.ventilationVFX;
    const ach = clamp((p.backgroundACH - .2)/1.8, 0, 1), ventN = air ? Math.max(4, Math.round(p.backgroundACH/2*this.ventN)) : 0;
    this.vent.visible = ventN > 0 && this.flows && !bench && !this.ventilationVFX; this.ventGeo.setDrawRange(0, ventN);
    if (ventN > 0) {
      const va = this.ventGeo.attributes.position.array;
      for (let i = 0; i < this.ventN; i++) {
        const s = this.ventSeed[i], pn = this.panes[i % this.panes.length], side = Math.sign(pn.x), k = (s[0] + t*(.4 + ach)*.6) % 1;
        va[i*3] = pn.x + side*(1.2 - k*2.4); va[i*3+1] = pn.y + (s[1] - .5)*1.1; va[i*3+2] = pn.zc + (s[2] - .5)*pn.width*.7;
      }
      this.ventGeo.attributes.position.needsUpdate = true;
    }
    }

    // pond: paddle splash and aeration bubbles, ripples, rain rings, fish
    const pond = !air && !bench;
    this.splash.visible = pond && sample.shaft > 0;
    const spa = this.splashGeo.attributes.position.array;
    for (let i = 0; i < MAX_UNITS*this.splashN; i++) {
      const ui = Math.floor(i/this.splashN), j = i % this.splashN;
      if (!pond || ui >= this.count) { spa[i*3+1] = -100; continue; }
      const q = this.wheelPos(ui), ph = (t*1.5 + j/this.splashN) % 1;
      spa[i*3] = q.x + Math.sin(j*7.3)*.5*BOAT_S*2; spa[i*3+1] = WATER_Y + .02 + Math.sin(ph*Math.PI)*Math.min(.6, sample.rpm*.01); spa[i*3+2] = q.z + Math.cos(j*2.1)*.45;
    }
    this.splashGeo.attributes.position.needsUpdate = true;
    this.rings.forEach((r, i) => {
      const ui = Math.floor(i/3), k = i % 3, on = pond && ui < this.count && sample.shaft > 0;
      r.visible = on; if (!on) return;
      const q = this.wheelPos(ui), s = (1 + ((t*.3 + k*.33) % 1)*1.6)*BOAT_S*1.3;
      r.position.set(q.x, WATER_Y + .02, q.z); r.scale.set(s, s, 1);
    });
    const rr = Math.round(rain*this.rainRings.length);
    this.rainRings.forEach((r, i) => { r.visible = pond && i < rr; if (!r.visible) return; const s = .15 + ((t*.9 + r.userData.seed) % 1)*1.1; r.scale.set(s, s, 1); });
    const fishN = Math.round(1 + p.oxygenDemand*7), gasp = sample.coverage < 100;
    this.fish.forEach((o, i) => {
      o.visible = pond && i < fishN; if (!o.visible) return;
      const ph = i*1.7, h = o.userData.home;
      o.position.x = clamp(h.x + Math.sin(t*.25 + ph)*1.1, -this.pondL/2 + .6, this.pondL/2 - .6);
      o.position.z = clamp(h.z + Math.cos(t*.3 + ph)*.8, POND_BACK + .5, POND_BACK + this.pondW - .5);
      const yT = gasp ? WATER_Y - .12 : .68; o.position.y += (yT - o.position.y)*Math.min(1, dt*2);
      o.rotation.y = Math.sin(t*.25 + ph) > 0 ? Math.PI : 0;
    });
    // Vertex displacement and analytic normals run on the GPU in the same render loop.
    updateWater(this.mats.water,t,rain,wind,this.storm);
    if(this.ventilationVFX){this.ventilationVFX.update(anim,sample);this.camera.updateMatrixWorld();updateVentilationLabels(this);}
    this.host.dataset.assets = assetStatus.failed.size ? 'fallback' : assetStatus.loaded.size ? 'ready' : 'loading';

    if (this.host.dataset.graphics !== 'lost') this.renderer.render(this.scene, this.camera);
  }
}
````````

FILE: `premium-assets.js`

````````javascript
// Existing entry point retained; the runtime now loads the actual Blender GLB.
import {upgradePart} from './src/graphics/assets.js';
export function upgradeRotor(group) { return upgradePart(group, 'rotor'); }
````````

FILE: `upgrade.css`

````````css
/* Visual layer: original controls, state, limits and event hooks remain intact. */
:root{--bg:#0d191b;--panel:#142528;--line:#2a4143;--ink:#edf1e8;--muted:#9eafaa;--lime:#badaaa;--gold:#e2bf87;--teal:#87c6bf;--mono:"Cascadia Code","SFMono-Regular",Consolas,monospace}
body{background:radial-gradient(ellipse at 70% 0,#203b3d55,transparent 55%),#0d191b;color:var(--ink);font-family:"Segoe UI Variable Text","Segoe UI",system-ui,sans-serif}
.topbar{padding:18px 3vw 10px;border-bottom:0;max-width:1800px;margin:auto}
.brand{letter-spacing:-.6px;font-weight:650}.brand img{width:40px;height:48px;object-fit:contain;border-radius:5px}.brand small{color:#9eafaa;font-weight:400;letter-spacing:.15px}
main{padding-top:6px}.lab-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;padding:10px 0 23px}
.lab-heading p{font:9px var(--mono);letter-spacing:2px;color:#a9c6b4;margin:0 0 8px}.lab-heading h1{font-size:clamp(23px,2.8vw,38px);line-height:1.15;font-weight:450;letter-spacing:-1.3px;margin:0}
.lab-heading>span{font:10px var(--mono);color:#a4b6af;white-space:nowrap;padding-bottom:4px}.lab-heading i{display:inline-block;width:6px;height:6px;border-radius:50%;background:#badaaa;margin-left:8px}
.console{border-color:#365052;border-radius:16px;box-shadow:0 24px 65px #0004}
.console .application-menu{background:#102023}.console .application{padding:17px 23px;gap:13px}.console .application.active{background:#203738}.console .application:hover{background:#243b3c}
.console .app-icon{background:#1b3031;border-color:#3b5553;color:#badaaa;border-radius:50%;font-size:23px}.console .application.active .app-icon{background:#badaaa;color:#21352f}
.console .application small{font-size:8px;letter-spacing:1.5px;color:#9aafaa}.console .application strong{font-size:16px;letter-spacing:-.2px}.console .application em{color:#a3b6af}
.scenario-strip{background:#132528;padding:12px 20px 15px}.strip-head{color:#acbfb6;letter-spacing:1.4px}.strip-head span:last-child{color:#9aaea7}
.scenario-card{border-color:#354c4a;border-radius:8px;background:#1a3032;min-height:57px;padding:10px 12px}.scenario-card:hover{background:#2a4140}.scenario-card.selected{background:#30483f;border-color:#a4c595;box-shadow:none}
.scenario-card small{color:#a2b5aa;font-size:8px}.scenario-card strong{font-weight:500}.scenario-glyph{border:0;background:#263d3b;color:#bfd0b5}.scenario-card.selected .scenario-glyph{background:#badaaa}
.sim-layout{grid-template-columns:292px minmax(0,1fr);border-color:#365052}.controls{padding:22px 20px;background:#142628;border-color:#365052;height:clamp(530px,calc(100vh - 290px),850px);scrollbar-color:#46625a #142628}
.control-title{color:#a8c5b3;font-size:9px;letter-spacing:1.5px;margin-bottom:17px}.controls-divider{background:#304542;margin:22px 0}.control{margin-bottom:20px}.control-label,.switch-control,.stepper{color:#d0dbd2;font-size:12px;line-height:1.5}
.control output{color:#eff4e7;font-size:12px}.control output small,.range-limits{color:#a0b2a5}.range-limits{font-size:9px;margin-top:4px}.control input[type=range]{height:22px;background:transparent;accent-color:#badaaa}
.dd>span{color:#c1d1c7;font-size:12px}.dd select,.mini-select{background:#1d3335;border-color:#46615b;border-radius:7px;min-height:40px}.dd select option{background:#1d3335}
.stepper-ctl{background:#1d3335;border-color:#46615b}.stepper-ctl button{background:#29433f;min-height:38px;width:36px;color:#d4e9c3}.stepper-ctl button:disabled{opacity:.45}.install-total{color:#b2c7b5;line-height:1.7}
.switch-control input{accent-color:#badaaa;width:17px;height:17px}.suggest{background:#294139;border-color:#597259;min-height:40px}.hw-status{background:#102022;border-color:#35504a}.hw-head{color:#a9bdaf}.hw-row{border-color:#30433e}.hw-note{color:#a6b7ab}
.viewport{height:clamp(530px,calc(100vh - 290px),850px);background:#b6cbd0;isolation:isolate}.vp-left{top:16px;left:16px}.vp-tools{top:16px;right:16px;gap:5px}
.vp-tools button,.vp-left select,.vp-camera button{background:#163033e8;border:1px solid #8eaaa25c;color:#edf1e8;border-radius:7px;padding:9px 11px;font-size:11px;min-height:36px;box-shadow:0 2px 8px #152d2520;backdrop-filter:blur(8px)}
.vp-left select{min-width:154px}.vp-tools button[aria-pressed=true]{background:#bed7aa;color:#20372d}.vp-camera{gap:5px}.vp-navigation{bottom:122px;right:16px}
.readouts{left:16px;right:16px;bottom:40px;gap:1px;flex-wrap:nowrap;border-radius:9px;overflow:hidden;box-shadow:0 5px 15px #192c2930;background:#6b83776b}.readout{flex:1;min-width:0;background:#122b2eea;border:0;border-radius:0;padding:12px 16px;backdrop-filter:blur(10px)}
.readout-label{font-size:8px;color:#b1c6b9;letter-spacing:1.25px;margin-bottom:6px}.readout strong{font-size:22px;font-weight:450;letter-spacing:-.6px;font-variant-numeric:tabular-nums}.readout:first-child{flex:1.15}.readout:first-child strong{font-size:12px;letter-spacing:.4px}.readout small{color:#bfd1c2;font-size:10px}
.scene-caption{position:absolute;bottom:14px;left:17px;right:17px;display:flex;justify-content:space-between;gap:12px;font:8px var(--mono);letter-spacing:.8px;color:#294940;pointer-events:none;text-shadow:0 1px 4px #fff9}
button,input,select{font-family:inherit}button{transition:background .15s,border-color .15s}button:focus-visible,input:focus-visible,select:focus-visible,a:focus-visible,canvas:focus-visible{outline:3px solid #dfbd80;outline-offset:3px}button:hover{filter:brightness(1.07)}
.quiet{border:1px solid #45605a;border-radius:7px;padding:9px 13px;color:#dce8da}.reset{padding:4px;color:#c2d5bb}.top-links .quiet{min-height:38px}
@media(min-width:961px) and (max-width:1180px){.sim-layout{grid-template-columns:260px minmax(0,1fr)}.vp-tools{top:62px}.readout{padding:11px}.readout strong{font-size:19px}.scene-caption span:last-child{display:none}}
@media(max-width:960px){.sim-layout{grid-template-columns:1fr}.scene-area{order:-1}.controls{height:auto;max-height:560px;border-right:0;border-top:1px solid #365052;display:grid;grid-template-columns:1fr 1fr;column-gap:28px}.controls-divider,.control-title,.hw-status,.install-total{grid-column:1/-1}.viewport{height:clamp(500px,66vh,750px)}.scenario-list{grid-template-columns:repeat(5,minmax(118px,1fr));overflow:auto;padding-bottom:3px}.scenario-card{padding:8px;gap:7px}.scenario-card strong{font-size:11px}.lab-heading>span{display:none}.console .application em{font-size:10px}.control-title{margin-top:6px}.scene-caption span:last-child{display:none}}
@media(max-width:600px){.topbar{padding:12px 14px 6px}.brand{font-size:18px}.brand img{width:31px;height:37px}.brand small{font-size:9px;max-width:200px}.top-links .quiet{padding:7px;font-size:10px}main{padding:6px 10px 18px}.lab-heading{padding:12px 4px 19px}.lab-heading p{font-size:8px;letter-spacing:1.4px}.lab-heading h1{font-size:27px}.console{border-radius:11px}.console .application{padding:13px 11px;gap:8px}.console .application strong{font-size:12px}.console .application small{font-size:7px}.console .app-icon{width:30px;height:30px;font-size:18px}.scenario-strip{padding:11px}.scenario-card{min-height:50px}.strip-head{font-size:8px}.viewport{height:560px}.vp-left{left:10px;top:10px}.vp-left select{min-width:145px}.vp-tools{top:56px;left:10px;right:auto;max-width:calc(100% - 20px);flex-wrap:wrap;justify-content:flex-start}.vp-tools button{font-size:10px;padding:7px 10px}.vp-navigation{bottom:159px;right:10px}.vp-camera button{font-size:10px;padding:7px}.readouts{left:10px;right:10px;bottom:34px;display:grid;grid-template-columns:1fr 1fr;gap:1px}.readout{padding:9px 12px}.readout-label{font-size:7px;margin-bottom:4px}.readout strong{font-size:20px}.readout:first-child strong{font-size:11px}.scene-caption{left:11px;right:11px;font-size:7px;letter-spacing:.3px}.controls{display:block;max-height:620px;padding:22px 18px}.control{margin-bottom:20px}.control-title{margin-top:0}.readout small{font-size:9px}.console .application+.application{border-left:1px solid #365052}}
@media(prefers-reduced-motion:reduce){button{transition:none}}

/* Building ventilation: inspection views and restrained technical annotations. */
#air-face .viewport{background:#b9cbd0}
.scene-heading{position:absolute;top:71px;left:18px;z-index:2;pointer-events:none;text-shadow:0 1px 7px #fff8;color:#28433d}
.scene-heading>span{display:block;font:8px var(--mono);letter-spacing:1.7px;margin-bottom:5px;opacity:.8}
.scene-heading strong{font-size:18px;font-weight:550;letter-spacing:-.5px}
.scene-annotations{position:absolute;inset:0;z-index:2;pointer-events:none}
.scene-callout{position:absolute;pointer-events:auto;transform:translate(-50%,-100%);display:flex;align-items:center;gap:6px;padding:6px 9px 6px 5px;border-radius:18px;border:1px solid #607a7059;background:#f0f2e9e8;color:#263c37;font-size:9px;white-space:nowrap;box-shadow:0 3px 10px #12251b1a;backdrop-filter:blur(6px)}
.scene-callout[hidden]{display:none}.scene-callout i{display:grid;place-items:center;width:19px;height:19px;border-radius:50%;font:8px var(--mono);font-style:normal;background:#344f48;color:#f0f2e9}
.scene-callout::after{content:"";position:absolute;left:50%;top:calc(100% + 1px);width:1px;height:13px;background:#425e5280}
.scene-callout:hover,.scene-callout:focus-visible{background:#fffdf4;box-shadow:0 4px 15px #16382b35;filter:none}
.intake-callout i{background:#3e7f83}.exhaust-callout i{background:#9b6c43}
.flow-key{position:absolute;z-index:2;left:17px;bottom:134px;display:none;gap:7px;padding:11px 13px;background:#152d30e8;border:1px solid #92b2a54d;border-radius:9px;color:#e1e9de;max-width:250px;box-shadow:0 4px 16px #192d2820;pointer-events:none;backdrop-filter:blur(7px)}
.viewport[data-scene-view=flow] .flow-key{display:grid}.viewport[data-flows=off] .flow-key{display:none}
.flow-key>span{font-size:10px;display:flex;align-items:center;gap:8px}.flow-key i{display:inline-block;width:14px;height:2px;border-radius:2px;background:#70cbd2}.flow-key .exhaust-dot{background:#e7ad76}.flow-key .drive-dot{background:#d7c58d}.flow-key small{font:8px/1.6 var(--mono);color:#b3c5b9;margin-top:2px;max-width:185px}
#air-face .readouts{background:#a7bca250;border:1px solid #d5e5d333;box-shadow:0 7px 25px #18302940}
#air-face .readout{background:#102b30ed;padding-top:14px;padding-bottom:14px}
#air-face .readout-label{font-size:8px;color:#b4cbbf;letter-spacing:1.25px}#air-face .readout strong{font-weight:500}
.readout[data-active=true] [data-status]::before{content:"";display:inline-block;width:5px;height:5px;border-radius:50%;background:#badaaa;margin:0 7px 2px 0}
.readout.alert[data-active=true] [data-status]::before{background:#e2bf87}
.viewport[data-scene-view=bench] .scene-heading{opacity:.65}
@media(min-width:961px) and (max-width:1280px){#air-face .vp-tools{top:61px}#air-face .scene-heading{top:111px;font-size:16px}}
@media(max-width:960px){.scene-heading{top:67px;left:16px}.scene-heading strong{font-size:16px}.flow-key{bottom:142px}.scene-callout{font-size:8px;padding:4px 8px 4px 4px}}
@media(max-width:600px){.scene-heading{display:none}.scene-callout{display:none}.viewport[data-scene-view=flow] .scene-callout:not([hidden]){display:flex;font-size:8px;min-height:44px;padding:6px 9px}.flow-key{top:111px;left:10px;bottom:auto;max-width:calc(100% - 20px);padding:7px 10px;grid-template-columns:auto auto;gap:5px 13px}.flow-key small{grid-column:1/-1;max-width:none;font-size:7px;margin:0}.flow-key>span{font-size:8px}.flow-key>span:nth-child(3){grid-column:1/-1}#air-face .readout{padding:10px 12px}.viewport[data-scene-view=flow] .scene-callout i{width:16px;height:16px}.scene-callout::after{height:8px}}
````````

FILE: `src/graphics/assets.js`

````````javascript
import * as T from '../../vendor/three.module.js';
import { GLTFLoader } from '../../vendor/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const library = new Map();
export const assetStatus = {loaded: new Set(), failed: new Map()};

export function loadAsset(name) {
  if (!library.has(name)) {
    // Relative to the document, including /zero_watt_wind/ on GitHub Pages.
    library.set(name, loader.loadAsync(`assets/zw-upgrade/${name}.glb`).then(gltf => {
      gltf.scene.traverse(o => {
        if (!o.isMesh) return;
        o.castShadow = o.receiveShadow = true;
        o.geometry.userData.sharedAsset = true;
        for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
          m.userData.sharedAsset = true;
          m.envMapIntensity = .8;
        }
      });
      assetStatus.loaded.add(name);
      return gltf.scene;
    }).catch(error => {
      assetStatus.failed.set(name, error.message);
      console.warn(`ZeroWatt: original geometry retained for ${name}:`, error.message);
      return null;
    }));
  }
  return library.get(name);
}

export function disposeGeometry(root) {
  const geometries = new Set();
  root.traverse(o => {
    if (o.geometry && !o.geometry.userData.sharedAsset && !o.geometry.userData.sharedStatic) geometries.add(o.geometry);
  });
  geometries.forEach(g => g.dispose());
}

/** Contents change; the original pivot stays owned by FieldScene.render. */
export function upgradePart(group, name, {scale, rotation, replace = true} = {}) {
  group.userData.assetRequested = name;
  group.userData.assetReady = loadAsset(name).then(template => {
    if (!template || group.userData.retired) return false;
    if (replace) { disposeGeometry(group); group.clear(); }
    const model = template.clone(true);
    if (scale) model.scale.set(...scale);
    if (rotation) model.rotation.set(...rotation);
    model.name = `Blender ${name}`;
    group.add(model);
    group.userData.asset = name;
    return true;
  });
  return group;
}

export function addAsset(parent, name, position, scale = [1, 1, 1], rotation) {
  const group = new T.Group();
  group.position.set(...position); parent.add(group);
  return upgradePart(group, name, {scale, rotation});
}

/** Late loads must not resurrect an old layout. Cached GLBs stay shared. */
export function retireShell(root, sharedMaterials = []) {
  const keep = new Set(sharedMaterials), dispose = new Set();
  root.traverse(o => {
    o.userData.retired = true;
    if (o.isInstancedMesh) o.dispose();
    if (o.material) for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
      if (!keep.has(m) && !m.userData.sharedAsset) dispose.add(m);
    }
  });
  disposeGeometry(root); dispose.forEach(m => {m.userData.ownedTextures?.forEach(t=>t.dispose());m.dispose();}); root.clear();
  root.userData.retired=false;
}
````````

FILE: `src/graphics/site.js`

````````javascript
import * as T from '../../vendor/three.module.js';
import {addAsset} from './assets.js';

export function dressArchitecture(s) {
  const {shell:S,mats:m,roomW:W,roomD:D}=s;
  const stone=s.mat('#bebdaf',.93,0), timber=s.mat('#a18a65',.75,0);
  const plaster=s.mat('#bbbcb1',.92,0);plaster.normalMap=s.surfaceNormal||null;
  S.getObjectByName('back-wall').material=plaster;
  // Solid knee walls ground the sectioned building; window apertures stay open.
  for(const o of S.children) {
    if(o.isMesh && o.geometry.type==='BoxGeometry' && Math.abs(Math.abs(o.position.x)-W/2)<.01 &&
      o.position.y<1.05 && o.material===m.shellGlass) o.material=plaster;
  }
  // Real tile edges catch the light; one instanced draw covers the entire floor.
  const cols=Math.ceil(W/.8),rows=Math.ceil(D/.8),cw=W/cols,cd=D/rows;
  const floor=s.mat('#a4aea7',.83,0);floor.normalMap=s.surfaceNormal||null;
  const tiles=new T.InstancedMesh(new T.BoxGeometry(1,1,1),floor,cols*rows),tile=new T.Object3D();
  tiles.name='Architectural floor tiles';tiles.receiveShadow=true;
  for(let i=0;i<cols*rows;i++){
    tile.position.set(-W/2+(i%cols+.5)*cw,.309,-D/2+(Math.floor(i/cols)+.5)*cd);
    tile.scale.set(cw-.018,.018,cd-.018);tile.updateMatrix();tiles.setMatrixAt(i,tile.matrix);
    tiles.setColorAt(i,new T.Color().setScalar(.87+(i*7%9)*.013));
  }
  S.add(tiles);
  // Rear service modules leave the front, moving windows and roof exhausts clear.
  for(const x of [-W/2+.75,W/2-.75]) {
    addAsset(S,'service-wall',[x,0,-D/2+.14]);
  }
  s.box(W+.7,.10,D+.7,stone,S,0,.02,0);
  for(const side of [-1,1]) {
    s.box(W,.11,.18,timber,S,0,.38,side*D/2);
    // Roof perimeter and parapet are low enough to expose every rotor and gear.
    s.box(W+.35,.14,.15,m.black,S,0,3.7,side*D/2);
    s.box(.15,.14,D+.35,m.black,S,side*W/2,3.7,0);
    s.box(.22,.18,D+.35,m.concrete,S,side*W/2,.27,0);
  }
  // Wall sconces are emissive surfaces, with the existing room light doing illumination.
  for(const x of [-W/2+1.6,W/2-1.6]) {
    const lamp=new T.MeshStandardMaterial({color:'#f3e5c7',emissive:'#e7c68e',emissiveIntensity:.35,roughness:.45});
    s.box(.45,.045,.10,lamp,S,x,3.0,-D/2+.14);
  }
  // A contact shadow beneath the foundation adds depth without another render pass.
  const shadowData=new Uint8Array(64*64*4);
  for(let y=0;y<64;y++)for(let x=0;x<64;x++){
    const edge=Math.max(Math.abs(x/31.5-1),Math.abs(y/31.5-1));
    const alpha=(1-T.MathUtils.smoothstep(edge,.55,1))*.20;
    shadowData.set([25,37,33,Math.round(alpha*255)],(y*64+x)*4);
  }
  const shadow=new T.DataTexture(shadowData,64,64);shadow.needsUpdate=true;
  const shadowMat=new T.MeshBasicMaterial({map:shadow,transparent:true,depthWrite:false});shadowMat.userData.ownedTextures=[shadow];
  const contact=new T.Mesh(new T.PlaneGeometry(W+2,D+2),shadowMat);contact.rotation.x=-Math.PI/2;contact.position.y=-.27;S.add(contact);
}

function seeded(seed) { return () => { seed=(seed*1664525+1013904223)>>>0;return seed/4294967296; }; }

export function dressLandscape(s) {
  const S=s.shell, air=s.mode==='air';
  const width=air?s.roomW:s.pondL+1.5, depth=air?s.roomD:s.pondW+1.5;
  const zc=air?0:s.pondZc, rnd=seeded(427);
  const soil=s.mat('#605f45',.99,0);
  // Narrow planting beds meet the architecture/engineered pond edge.
  for(const side of [-1,1]) {
    s.box(1.25,.12,depth+1,soil,S,side*(width/2+1.0),-.19,zc);
  }
  const blade=new T.BufferGeometry();
  blade.setAttribute('position',new T.Float32BufferAttribute([-.04,0,0,.04,0,0,.025,.32,.025,
    0,0,-.04,0,0,.04,.025,.25,.02],3));
  blade.computeVertexNormals();
  const material=s.mat('#6e7c4f',1,0), n=s.compactGraphics?120:320;
  const grass=new T.InstancedMesh(blade,material,n), dummy=new T.Object3D();
  grass.castShadow=false;grass.receiveShadow=true;grass.name='Instanced perimeter grasses';
  for(let i=0;i<n;i++) {
    const side=i%2?1:-1;
    dummy.position.set(side*(width/2+.55+rnd()*1.1),-.13,zc+(rnd()-.5)*(depth+2));
    dummy.rotation.y=rnd()*Math.PI;dummy.scale.setScalar(.5+rnd()*.9);dummy.updateMatrix();
    grass.setMatrixAt(i,dummy.matrix);
    grass.setColorAt(i,new T.Color().setHSL(.20+rnd()*.035,.2,.25+rnd()*.12));
  }
  grass.instanceMatrix.needsUpdate=true;S.add(grass);
  if(!air) {
    for(let i=0;i<12;i++) {
      const side=i%2?1:-1, z=1.6+Math.floor(i/2)*(s.pondW-1)/6;
      addAsset(S,'shore',[side*(s.pondL/2+.45),.65,z],[.75,.8+(i%3)*.15,.8]);
    }
    // Four small practical path lights retain readable machinery at night.
    s.siteLamps=[];
    for(const side of [-1,1]) for(const end of [-1,1]) {
      const x=side*(width/2+1.7),z=zc+end*depth*.38;
      s.cyl(.045,.75,s.mats.dark,S,x,.2,z);
      s.cyl(.10,.08,s.mats.led,S,x,.62,z);
      const light=new T.PointLight('#f9dfaf',0,7,2);light.position.set(x,.75,z);S.add(light);s.siteLamps.push(light);
    }
  }
}
````````

FILE: `src/graphics/surfaces.js`

````````javascript
import * as T from '../../vendor/three.module.js';
import {RoomEnvironment} from '../../vendor/addons/environments/RoomEnvironment.js';

export function installReflections(scene, renderer) {
  const room = new RoomEnvironment();
  const pmrem = new T.PMREMGenerator(renderer);
  const target = pmrem.fromScene(room, .08);
  scene.environment = target.texture; scene.environmentIntensity = .45;
  room.dispose(); pmrem.dispose();
  return target;
}

// Seamless deterministic normals: no external texture or image request.
function normalTexture(size, strength) {
  const pixels = new Uint8Array(size*size*4);
  for (let y=0;y<size;y++) for (let x=0;x<size;x++) {
    const u=x/size*Math.PI*2, v=y/size*Math.PI*2;
    const dx=strength*(Math.cos(u*4+Math.sin(v*2))+.4*Math.cos(u*11-v*7));
    const dy=strength*(Math.sin(v*5+Math.cos(u*3))+.4*Math.sin(v*9+u*6));
    const n=new T.Vector3(-dx,-dy,1).normalize(), i=(y*size+x)*4;
    pixels.set([(n.x*.5+.5)*255,(n.y*.5+.5)*255,(n.z*.5+.5)*255,255],i);
  }
  const texture = new T.DataTexture(pixels,size,size,T.RGBAFormat);
  texture.wrapS=texture.wrapT=T.RepeatWrapping;
  texture.magFilter=T.LinearFilter; texture.minFilter=T.LinearMipmapLinearFilter;
  texture.generateMipmaps=true; texture.needsUpdate=true;
  return texture;
}

export function createWaterMaterial() {
  const normal = normalTexture(128,.28); normal.repeat.set(14,10);
  const m = new T.MeshStandardMaterial({color:'#456f68', roughness:.21, metalness:.12,
    transparent:true, opacity:.88, depthWrite:false, side:T.DoubleSide,
    normalMap:normal, normalScale:new T.Vector2(.3,.3), envMapIntensity:1.15});
  const uniforms = {zwTime:{value:0}, zwAmplitude:{value:.02}, zwSize:{value:new T.Vector2(20,12)}};
  m.userData.waterUniforms=uniforms;
  m.onBeforeCompile = shader => {
    Object.assign(shader.uniforms,uniforms);
    shader.vertexShader = 'uniform float zwTime; uniform float zwAmplitude; varying vec2 zwUV;\n'+shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <beginnormal_vertex>',`#include <beginnormal_vertex>
      float wx = position.x * 1.7 + zwTime * 1.3;
      float wy = position.y * 2.1 + zwTime * .8;
      objectNormal = normalize(vec3(-1.7*cos(wx)*cos(wy)*zwAmplitude,
        2.1*sin(wx)*sin(wy)*zwAmplitude, 1.0));`);
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
      transformed.z += sin(wx)*cos(wy)*zwAmplitude;
      zwUV = uv;`);
    shader.fragmentShader = 'varying vec2 zwUV; uniform vec2 zwSize;\n'+shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      vec2 bank = min(zwUV, 1.0-zwUV)*zwSize;
      float depthTint = smoothstep(0.0, 1.4, min(bank.x, bank.y));
      diffuseColor.rgb *= mix(vec3(1.35,1.19,.89),vec3(.76,.94,1.0),depthTint);`);
  };
  m.customProgramCacheKey=()=> 'zw-water-1';
  return m;
}

export function updateWater(material, time, rain, wind, storm) {
  const u=material.userData.waterUniforms;
  u.zwTime.value=time;
  u.zwAmplitude.value=.014+.035*rain+Math.min(wind,20)*.0014+(storm ? .035 : 0);
  material.normalMap.offset.set(time*.008,time*.004);
  material.normalScale.setScalar(.23+rain*.16);
}

export function applySurfaceDetail(mats) {
  const grain=normalTexture(64,.045); grain.repeat.set(4,4);
  for(const name of ['steel','white','black','wood','concrete','path','pontoon']) {
    mats[name].normalMap=grain; mats[name].normalScale=new T.Vector2(.11,.11);
  }
  mats.white.color.set('#dce2dc'); mats.white.roughness=.4; mats.white.metalness=.22;
  mats.black.color.set('#243b37'); mats.black.roughness=.46; mats.black.metalness=.45;
  mats.steel.roughness=.34; mats.steel.metalness=.78;
  mats.concrete.color.set('#aaafa0'); mats.concrete.roughness=.9;
  mats.wood.color.set('#96744f'); mats.wood.roughness=.69;
  mats.shellGlass.opacity=.075; mats.shellGlass.color.set('#c3d4cf');
  return grain;
}

export function applyVentilationMaterials(mats) {
  mats.shellGlass.opacity=.045;mats.shellGlass.color.set('#c4d5d9');
  mats.win.color.set('#a6bdc7');mats.win.opacity=.22;mats.win.roughness=.16;
  mats.win.metalness=.08;mats.win.envMapIntensity=.8;
  mats.dark.color.set('#263a3b');mats.concrete.color.set('#939c94');
  mats.shirtA.color.set('#527580');mats.shirtB.color.set('#7b846c');
}
````````

FILE: `src/graphics/ventilation-vfx.js`

````````javascript
import * as T from '../../vendor/three.module.js';
import {mergeGeometries} from '../../vendor/addons/utils/BufferGeometryUtils.js';

const clamp=T.MathUtils.clamp;
const palettes={wind:'#bbd7dc',intake:'#70cbd2',exhaust:'#e7ad76',drive:'#d7c58d'};

function material(kind) {
  const uniforms={time:{value:0},speed:{value:1},strength:{value:0}};
  const m=new T.MeshBasicMaterial({color:palettes[kind],transparent:true,opacity:1,
    depthWrite:false,toneMapped:true,side:T.DoubleSide});
  m.userData.trails=uniforms;
  m.onBeforeCompile=shader=>{
    shader.uniforms.zwTrailTime=uniforms.time;
    shader.uniforms.zwTrailSpeed=uniforms.speed;
    shader.uniforms.zwTrailStrength=uniforms.strength;
    shader.vertexShader='varying vec2 zwTrailUV;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
      zwTrailUV=uv;`);
    shader.fragmentShader='varying vec2 zwTrailUV; uniform float zwTrailTime; uniform float zwTrailSpeed; uniform float zwTrailStrength;\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      float phase=fract(zwTrailUV.x*3.0-zwTrailTime);
      float tail=smoothstep(.15,.70,phase)*(1.0-smoothstep(.78,.86,phase));
      float ends=smoothstep(0.0,.04,zwTrailUV.x)*(1.0-smoothstep(.93,1.0,zwTrailUV.x));
      diffuseColor.a*=zwTrailStrength*(.035+.76*tail)*ends;`);
  };
  m.customProgramCacheKey=()=> 'zw-directional-trail';
  return m;
}

/** Fixed, pooled path geometry; only four material uniforms change each frame.
 * Paths illustrate model flow, not a CFD solution. No independent RAF loop.
 */
export class VentilationVFX {
  constructor(scene) {
    this.owner=scene;this.root=new T.Group();this.root.name='Model-driven ventilation paths';
    scene.scene.add(this.root);this.key='';this.layers={};
    this.materials=Object.fromEntries(Object.keys(palettes).map(k=>[k,material(k)]));
    this.points=[new T.Vector3(),new T.Vector3(),new T.Vector3()];
  }
  rebuild() {
    const s=this.owner,bench=s.view==='bench',key=`${s.layoutKey}|${s.view}`;
    if(key===this.key)return;this.key=key;
    for(const layer of Object.values(this.layers))layer.geometry.dispose();
    this.root.clear();this.layers={};
    const paths={wind:[],intake:[],exhaust:[],drive:[]};
    const add=(kind,points,radius=.014)=>{
      const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)),false,'centripetal');
      paths[kind].push(new T.TubeGeometry(curve,s.compactGraphics?24:40,radius,4,false));
    };
    if(bench) {
      const u=s.units[0].g;u.updateMatrixWorld(true);
      const world=p=>u.localToWorld(new T.Vector3(...p)).toArray();
      for(let k=0;k<4;k++)add('wind',[[-5,1.15+k*.3,-.6],[-3.7,1.3+k*.3,-.35],[-2.3,1.4+k*.3,-.1],[-.8,1.5+k*.3,0]].map(world),.012);
      add('drive',[[-1.05,1.55,.12],[.50,1.55,.12],[1.02,1.3,.12],[1.02,-.4,.12]].map(world),.017);
    } else {
      const W=s.roomW,D=s.roomD;
      const streakCount=s.compactGraphics?6:10;
      for(let k=0;k<streakCount;k++){
        const z=-D/2-.6+(k%5)*(D+1.2)/4,y=4.4+Math.floor(k/5)*1.15;
        add('wind',[[-W/2-4,y,z],[-W*.25,y+.10,z+.16],[W*.22,y+.04,z],[W/2+4,y+.16,z-.18]],.010);
      }
      for(const pane of s.panes) {
        const side=Math.sign(pane.x);
        for(const offset of [-.24,.24])add('intake',[
          [pane.x+side*1.4,pane.y+.06,pane.zc+offset],
          [pane.x,pane.y,pane.zc+offset],
          [pane.x-side*1.1,pane.y-.25,pane.zc+offset*.5],
          [pane.x-side*Math.min(W*.38,3),1.35,pane.zc+.5]
        ],.016);
      }
      for(let i=0;i<s.count;i++){
        const q=s.unitPos(i),x=q.x+1.02,z=q.z;
        for(const side of [-1,1])add('exhaust',[
          [x+side*1.35,1.25,z+.8],[x+side*.55,2.4,z+.35],
          [x,3.3,z],[x,4.25,z],[x+.75,5.15,z+.12],[x+2.0,5.35,z+.2]
        ],.019);
        add('drive',[[q.x-1.02,q.y+1.55,z+.12],[q.x+.52,q.y+1.55,z+.12],
          [x,q.y+1.3,z+.12],[x,q.y-.4,z+.12]],.017);
      }
    }
    for(const [kind,geometries] of Object.entries(paths)){
      if(!geometries.length)continue;
      const merged=mergeGeometries(geometries);geometries.forEach(g=>g.dispose());
      const mesh=new T.Mesh(merged,this.materials[kind]);mesh.name=`${kind} directional trails`;
      mesh.frustumCulled=false;mesh.renderOrder=3;this.root.add(mesh);this.layers[kind]=mesh;
    }
  }
  update(dt,sample) {
    const s=this.owner;
    this.root.visible=s.flows;
    if(s.sensors?.mcuLed && s.settings.mcu!=='none'){
      s.sensors.mcuLed.material.emissiveIntensity=sample.shaft>0?1.1+.12*Math.sin(s.time*2):.6;
    }
    if(!s.flows)return;
    this.rebuild();
    const perUnit=Math.max(0,sample.airflow)/Math.max(1,s.count);
    const natural=Math.max(0,s.settings.backgroundACH*s.settings.room);
    const wind=clamp(sample.wind/12,0,1),air=clamp(perUnit/500,0,1);
    const values={wind:[sample.wind>0 ? .22+wind*.48 : 0,.10+Math.min(30,sample.wind)*.026],
      intake:[natural+sample.airflow>0 ? .22+air*.5 : 0,.13+clamp((natural+perUnit)/600,0,1)*.55],
      exhaust:[sample.airflow>0 ? .30+air*.5 : 0,.18+air*.75],
      drive:[sample.shaft>0 ? .48 : 0,.18+Math.min(sample.outputRPM,160)/160*.7]};
    for(const [kind,layer] of Object.entries(this.layers)){
      const u=this.materials[kind].userData.trails,[strength,speed]=values[kind];
      u.speed.value+=(speed-u.speed.value)*(1-Math.exp(-dt*6));
      u.time.value+=dt*u.speed.value;u.strength.value=strength;
      layer.visible=strength>0;
    }
  }
  dispose() {
    Object.values(this.layers).forEach(o=>o.geometry.dispose());
    Object.values(this.materials).forEach(m=>m.dispose());this.root.removeFromParent();
  }
}

/** DOM anchors use the same camera as the canvas; labels never intercept orbit. */
export function updateVentilationLabels(s) {
  if(!s.host.querySelectorAll)return;
  s._callouts??=[...s.host.querySelectorAll('[data-scene-anchor]')];
  const q=s.unitPos(0),pane=s.panes.find(p=>p.x>0)||s.panes[0];
  const anchors={rotor:[q.x-2,q.y+2.3,q.z],exhaust:[q.x+2.4,4.5,q.z+.3],
    intake:pane?[pane.x,pane.y+.7,pane.zc]:[0,1,0]};
  const projected=s._labelPoint??=new T.Vector3();
  for(const el of s._callouts){
    const point=anchors[el.dataset.sceneAnchor];projected.set(...point).project(s.camera);
    const on=s.view!=='bench'&&Math.abs(projected.x)<.88&&Math.abs(projected.y)<.76&&projected.z<1;
    el.hidden=!on;
    if(on){el.style.left=`${(projected.x*.5+.5)*100}%`;el.style.top=`${(-projected.y*.5+.5)*100}%`;}
  }
}
````````

FILE: `src/graphics/camera.js`

````````javascript
import * as T from '../../vendor/three.module.js';

export function advanceCamera(s,dt,snap=false) {
  if(!s._cameraPose)s._cameraPose={angle:s.angle,elevation:s.elevation,distance:s.distance,target:s.target.clone()};
  const pose=s._cameraPose,a=snap||s.reducedMotion?1:1-Math.exp(-Math.max(0,dt)*9);
  let delta=s.angle-pose.angle;delta=Math.atan2(Math.sin(delta),Math.cos(delta));
  pose.angle+=delta*a;pose.elevation+=(s.elevation-pose.elevation)*a;
  pose.distance+=(s.distance-pose.distance)*a;pose.target.lerp(s.target,a);
  const radius=Math.cos(pose.elevation)*pose.distance;
  s.camera.position.set(pose.target.x+Math.sin(pose.angle)*radius,
    pose.target.y+Math.sin(pose.elevation)*pose.distance,pose.target.z+Math.cos(pose.angle)*radius);
  s.camera.lookAt(pose.target);
}

export function viewDistance(s,distance) {
  const portrait=Math.max(1,1.25/Math.max(.4,s.camera.aspect));
  s.maxDistance=Math.max(40,s.extent*3);
  return T.MathUtils.clamp(distance*portrait,4,s.maxDistance);
}
````````

FILE: `scripts/blender/build_assets.py`

````````python
"""ZeroWatt custom asset library. Blender 5.x, no third-party assets.

blender --background --python scripts/blender/build_assets.py
Authoring helpers accept Three.js Y-up coordinates; V converts to Blender Z-up.
Each GLB has an origin at its mechanical pivot. Static meshes are joined by
material before export, so fasteners do not each cost a browser draw call.
"""
import bpy
import math
import json
import random
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'assets' / 'zw-upgrade'
OUT.mkdir(parents=True, exist_ok=True)
random.seed(27)
bpy.context.preferences.filepaths.save_version = 0
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

def V(p):
    return Vector((p[0], -p[2], p[1]))

def mat(name, color, metal=0, rough=.5):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1)
    m.use_nodes = True
    p = m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value = (*color, 1)
    p.inputs['Metallic'].default_value = metal
    p.inputs['Roughness'].default_value = rough
    return m

pearl = mat('Warm porcelain powder coat', (.78, .81, .77), .25, .34)
steel = mat('Satin stainless steel', (.34, .41, .43), .82, .3)
graphite = mat('Graphite epoxy steel', (.035, .065, .063), .5, .43)
brass = mat('Phosphor bronze transmission', (.42, .28, .12), .75, .37)
rubber = mat('EPDM bearing seal', (.016, .024, .023), .02, .78)
wood = mat('Oiled ash', (.36, .22, .105), 0, .62)
plaster = mat('Mineral plaster', (.71, .69, .61), 0, .88)
cloth = mat('Moss upholstery', (.13, .21, .18), 0, .92)
bark = mat('Grey brown bark', (.16, .13, .09), 0, .94)
leaf = mat('Willow foliage', (.16, .25, .115), 0, .85)
leaflight = mat('Sunlit foliage', (.23, .32, .14), 0, .85)
stone = mat('Shore limestone', (.34, .36, .29), 0, .92)

collection = None
manifest = {}
def begin(name):
    global collection
    collection = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(collection)

def finish(o, material, bevel=0, smooth=False):
    for c in list(o.users_collection):
        c.objects.unlink(o)
    collection.objects.link(o)
    o.data.materials.append(material)
    for p in o.data.polygons:
        p.use_smooth = smooth
    bpy.context.view_layer.objects.active = o
    if bevel:
        mod = o.modifiers.new('Fabricated edge fillet', 'BEVEL')
        mod.width = bevel
        mod.segments = 2
    return o

def box(name, size, pos, material, bevel=.015):
    bpy.ops.mesh.primitive_cube_add(size=1, location=V(pos))
    o = bpy.context.object
    o.name = name
    o.scale = (size[0], size[2], size[1])
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(o, material, bevel)

def cylinder(name, r, length, pos, material, axis='x', verts=32, bevel=.006, r2=None):
    bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=r, radius2=r if r2 is None else r2,
                                    depth=length, location=V(pos))
    o = bpy.context.object
    o.name = name
    direction = V({'x':(1,0,0), 'y':(0,1,0), 'z':(0,0,1)}[axis])
    o.rotation_mode = 'QUATERNION'
    o.rotation_quaternion = Vector((0,0,1)).rotation_difference(direction)
    return finish(o, material, bevel, True)

def rod(name, a, b, r, material, verts=10):
    d = V(b) - V(a)
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=d.length, location=(V(a)+V(b))/2)
    o = bpy.context.object
    o.name = name
    o.rotation_mode = 'QUATERNION'
    o.rotation_quaternion = Vector((0,0,1)).rotation_difference(d.normalized())
    return finish(o, material, 0, True)

def ring(name, radius, tube, pos, material, axis='x', segments=48):
    bpy.ops.mesh.primitive_torus_add(major_segments=segments, minor_segments=6,
                                    major_radius=radius, minor_radius=tube, location=V(pos))
    o = bpy.context.object
    o.name = name
    o.rotation_mode = 'QUATERNION'
    o.rotation_quaternion = Vector((0,0,1)).rotation_difference(V({'x':(1,0,0),'y':(0,1,0),'z':(0,0,1)}[axis]))
    return finish(o, material, 0, True)

def mesh(name, verts, faces, material, thickness=0, bevel=0):
    data = bpy.data.meshes.new(name)
    data.from_pydata([V(p) for p in verts], [], faces)
    data.update()
    o = bpy.data.objects.new(name, data)
    collection.objects.link(o)
    data.materials.append(material)
    for p in data.polygons:
        p.use_smooth = True
    if thickness:
        m = o.modifiers.new('Formed sheet thickness', 'SOLIDIFY')
        m.thickness = thickness
    if bevel:
        m = o.modifiers.new('Hemmed edges', 'BEVEL')
        m.width = bevel
        m.segments = 2
    return o

def bolts(axis, center, radius, count, material=steel, size=.023):
    for i in range(count):
        a = i*math.tau/count
        x,y,z = center
        if axis == 'x': y += radius*math.cos(a); z += radius*math.sin(a)
        elif axis == 'y': x += radius*math.cos(a); z += radius*math.sin(a)
        else: x += radius*math.cos(a); y += radius*math.sin(a)
        cylinder('Captive hex bolt',size,.025,(x,y,z),material,axis,6,.002)

def export(name, axis=None):
    # Apply all modifiers and merge by material in local authoring coordinates.
    objects = list(collection.objects)
    for o in objects:
        bpy.context.view_layer.objects.active = o
        for mod in list(o.modifiers):
            bpy.ops.object.modifier_apply(modifier=mod.name)
    groups = {}
    for o in objects:
        groups.setdefault(o.data.materials[0].name, []).append(o)
    combined = []
    for material, parts in groups.items():
        bpy.ops.object.select_all(action='DESELECT')
        for o in parts: o.select_set(True)
        bpy.context.view_layer.objects.active = parts[0]
        bpy.ops.object.join()
        o = bpy.context.object
        o.name = name + '_' + material.replace(' ', '_')
        bpy.context.scene.cursor.location = (0,0,0)
        bpy.ops.object.origin_set(type='ORIGIN_CURSOR')
        bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
        combined.append(o)
    bpy.ops.object.select_all(action='DESELECT')
    for o in combined: o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=str(OUT/(name+'.glb')), export_format='GLB',
                             use_selection=True, export_yup=True, export_animations=False,
                             export_cameras=False, export_lights=False)
    triangles = sum(len(o.data.polygons) for o in combined)  # calculate exact triangles below
    triangles = 0
    for o in combined:
        o.data.calc_loop_triangles()
        triangles += len(o.data.loop_triangles)
    manifest[name] = {'axis':axis, 'origin':[0,0,0], 'meshes':len(combined),
                      'triangles':triangles, 'bytes':(OUT/(name+'.glb')).stat().st_size}

begin('01 Spiral rotor')
for b in range(3):
    verts, faces = [], []
    nu,nv = 44,12
    for u in range(nu+1):
        a = u/nu
        for v in range(nv+1):
            s = v/nv
            r = .1+s*(.38+a*.7)
            theta = b*math.tau/3+a*2.7+s*.3
            verts.append(((a-.5)*1.5, r*math.cos(theta), r*math.sin(theta)))
    for u in range(nu):
        for v in range(nv):
            i=u*(nv+1)+v
            faces.append((i,i+1,i+nv+2,i+nv+1))
    mesh('Hydroformed spiral blade',verts,faces,pearl,.018,.004)
    for a in [.06,.93]:
        th=b*math.tau/3+a*2.7+.3
        rr=.1+.38+a*.7
        rod('Blade root reinforcement',((a-.5)*1.5,.12*math.cos(th),.12*math.sin(th)),
            ((a-.5)*1.5,rr*.88*math.cos(th),rr*.88*math.sin(th)),.022,steel)
cylinder('Rotor shaft',.105,1.94,(0,0,0),steel)
for x in [-.8,.85]:
    cylinder('Clamping flange',.23,.12,(x,0,0),steel)
    cylinder('Painted hub cap',.17,.15,(x,0,0),pearl)
    bolts('x',(x+(.075 if x>0 else -.075),0,0),.192,6,graphite)
export('rotor','x')

begin('02 Miter bevel gear')
# Cone apex is at x=.5, big pitch radius .5 at x=0: original 1:1 miter geometry.
cylinder('Conical gear blank',.445,.31,(.155,0,0),steel,'x',48,.005,.135)
cylinder('Keyed hub',.14,.32,(-.13,0,0),graphite)
ring('Machined back shoulder',.34,.022,(-.014,0,0),steel)
for k in range(20):
    a=k*math.tau/20
    # Tapered teeth follow the cone generatrix instead of a flat decorative disc.
    verts=[]
    for x,r,width in [(-.025,.495,.045),(.285,.21,.023)]:
        for dr,da in [(-.045,-width),(.035,-width),(.035,width),(-.045,width)]:
            verts.append((x,(r+dr)*math.cos(a+da),(r+dr)*math.sin(a+da)))
    faces=[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]
    mesh('Tapered miter tooth',verts,faces,steel,0,.004)
bolts('x',(-.025,0,0),.25,6,graphite,.018)
export('bevel','x')

begin('03 Axial ventilation impeller')
cylinder('Machined spinner',.18,.20,(0,0,0),pearl,'y',40,.012,.12)
cylinder('Shaft bore collar',.07,.32,(0,0,0),steel,'y')
for b in range(6):
    verts,faces=[],[]
    for j in range(15):
        t=j/14; r=.14+.66*t
        sweep=b*math.tau/6+.35*t*t
        for k in range(7):
            v=k/6-.5; chord=.19+.1*math.sin(t*math.pi)
            angle=sweep+v*chord/r
            verts.append((r*math.cos(angle),v*(.16-.07*t)+.025*(1-4*v*v),r*math.sin(angle)))
    for j in range(14):
        for k in range(6):
            i=j*7+k;faces.append((i,i+1,i+8,i+7))
    mesh('Twisted cambered airfoil',verts,faces,pearl,.012,.003)
bolts('y',(0,.12,0),.115,6,steel,.018)
export('fan','y')

begin('04 Pond paddle wheel')
cylinder('Through axle hub',.23,1.52,(0,0,0),steel,'z')
for z in [-.62,.62]:
    ring('Rolled steel wheel rim',1.38,.05,(0,0,z),graphite,'z',64)
    ring('Inner reinforcing ring',.40,.025,(0,0,z),steel,'z')
    cylinder('Hub flange',.34,.07,(0,0,z),graphite,'z')
    bolts('z',(0,0,z+(.04 if z>0 else -.04)),.275,8,steel)
for k in range(8):
    a=k*math.tau/8
    for z in [-.62,.62]:
        rod('Radial box brace',(.2*math.cos(a),.2*math.sin(a),z),
            (1.4*math.cos(a),1.4*math.sin(a),z),.037,graphite,8)
    verts,faces=[],[]
    for i in range(9):
        t=i/8
        r=1.07+.59*t
        th=a+.11*math.sin(t*math.pi)
        for z in [-.69,.69]:verts.append((r*math.cos(th),r*math.sin(th),z))
    for i in range(8):faces.append((i*2,i*2+1,i*2+3,i*2+2))
    mesh('Formed concave paddle',verts,faces,pearl,.026,.009)
    for z in [-.65,.65]:
        rod('Paddle edge stiffener',(1.1*math.cos(a),1.1*math.sin(a),z),
            (1.64*math.cos(a),1.64*math.sin(a),z),.025,steel)
export('paddle','z')

begin('05 Pillow block support')
# Normalized height: scene scales y to the original shaft height, axis X.
box('Foot plate',(.8,.10,.95),(0,.05,0),graphite,.025)
for z in [-.19,.19]:
    box('Tapered support web',(.12,.73,.10),(0,.455,z),pearl,.014)
    rod('Diagonal knee brace',(-.29,.11,z),(0,.78,z),.035,steel)
box('Bearing saddle',(.32,.16,.62),(0,.87,0),graphite,.045)
for x in [-.28,.28]:
    for z in [-.32,.32]:cylinder('Foundation anchor',.04,.045,(x,.12,z),steel,'y',6,.003)
export('bearing-frame')
begin('05b Unscaled bearing cartridge')
cylinder('Sealed bearing housing',.235,.23,(0,0,0),pearl)
ring('Annular bearing seal',.12,.04,(.13,0,0),rubber)
export('bearing')

begin('06 Architectural workspace')
box('Ash desk top',(1.5,.08,.8),(0,.95,0),wood,.025)
for x in [-.64,.64]:
    for z in [-.29,.29]:box('Desk steel leg',(.055,.61,.055),(x,.62,z),graphite,.008)
box('Monitor foot',(.26,.018,.18),(0,1.005,-.14),steel,.009)
box('Monitor neck',(.05,.14,.04),(0,1.08,-.18),graphite)
box('Display housing',(.54,.33,.035),(0,1.25,-.18),graphite,.018)
box('Display glass',(.49,.275,.008),(0,1.25,-.156),cloth,.004)
box('Keyboard',(.4,.018,.14),(0,1.008,.13),graphite,.008)
for j in range(3):box('Reference manuals',(.18,.035,.26),(.52,1.015+j*.036,-.1),plaster,.004)
export('workspace')

begin('07 Architectural service wall')
box('Plaster service panel',(1,2.8,.16),(0,1.7,0),plaster,.018)
box('Recessed skirting',(1,.10,.19),(0,.36,.01),graphite,.008)
for x in [-.46,.46]:box('Ash reveal',(.035,2.85,.20),(x,1.7,.015),wood,.006)
for j in range(5):box('Cabinet fronts',(.81,.35,.34),(0,.55+j*.36,.24),wood,.012)
for j in range(5):box('Brushed pull',(.20,.015,.025),(0,.62+j*.36,.425),steel,.003)
export('service-wall')

begin('08 Landscape tree')
rod('Tapered trunk',(0,0,0),(.08,2.15,0),.10,bark,12)
for i in range(9):
    a=i*2.4;h=1.4+(i%4)*.36
    end=(math.cos(a)*(.65+i%3*.13),h+.65,math.sin(a)*(.55+i%2*.2))
    rod('Branch',(.04,h-.4,0),end,.035,bark,8)
    for j in range(5):
        pos=(end[0]+random.uniform(-.38,.38),end[1]+random.uniform(-.2,.32),end[2]+random.uniform(-.35,.35))
        # Individual opaque leaves create a broken, natural silhouette without
        # alpha textures or spherical foliage clumps.
        verts, faces = [], []
        for k in range(24):
            a=random.random()*math.tau;r=random.random()*.40
            cx=pos[0]+math.cos(a)*r;cy=pos[1]+random.uniform(-.23,.23);cz=pos[2]+math.sin(a)*r
            length=.13+random.random()*.12;width=length*.29
            dx=math.cos(a)*length;dz=math.sin(a)*length
            bx=-math.sin(a)*width;bz=math.cos(a)*width
            base=len(verts)
            verts.extend([(cx-dx,cy-.02,cz-dz),(cx+bx,cy,cz+bz),(cx,cy+.035,cz),
                          (cx-bx,cy,cz-bz),(cx+dx,cy+.06,cz+dz)])
            faces.extend([(base,base+1,base+2),(base,base+2,base+3),
                          (base+2,base+1,base+4),(base+3,base+2,base+4)])
        mesh('Willow leaf sprays',verts,faces,leaflight if (i+j)%3==0 else leaf,.001)
export('tree')

begin('09 Shoreline planting')
for i in range(20):
    a=random.random()*math.tau;r=random.random()*.42;h=.45+random.random()*.65
    x,z=math.cos(a)*r,math.sin(a)*r
    rod('Reed stem',(x,0,z),(x+.04,h,z+.07),.009,leaf,6)
    verts=[(x,0,z),(x+.06,h*.55,z+.02),(x+.18,h*.9,z+.15),(x+.04,h*.45,z+.02)]
    mesh('Tapered reed leaf',verts,[(0,1,2,3)],leaflight,.003)
    if i%4==0:cylinder('Cattail',.025,.15,(x+.04,h,z+.07),bark,'y',8,0)
for i in range(5):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1,radius=.2,location=V((random.uniform(-.7,.7),.03,random.uniform(-.4,.4))))
    o=bpy.context.object;o.name='Weathered bank stone';o.scale=(1.3,1,.5);finish(o,stone,.015)
export('shore')

begin('10 Upholstered clinic chair')
box('Rounded upholstered seat',(.43,.075,.44),(0,.47,0),cloth,.03)
verts,faces=[],[]
for j in range(9):
    x=(j/8-.5)*.43;bow=.055*(1-(x/.23)**2)
    verts.extend([(x,.54,-.22-bow*.3),(x,.93,-.20-bow)])
for j in range(8):faces.append((j*2,j*2+1,j*2+3,j*2+2))
mesh('Contoured upholstered back',verts,faces,cloth,.035,.012)
for x in [-.17,.17]:
    for z in [-.17,.17]:
        rod('Tubular chair leg',(x,.44,z),(x*1.18,.03,z*1.18),.018,steel,10)
        cylinder('Non-slip foot',.025,.022,(x*1.18,.018,z*1.18),rubber,'y',12,.003)
    rod('Backrest support',(x,.35,-.16),(x,.83,-.24),.017,steel,10)
rod('Under-seat cross brace',(-.17,.28,-.17),(.17,.28,-.17),.013,steel,8)
export('chair')

begin('11 Ventilation controller enclosure')
box('Gasketed die-cast controller',(.70,.50,.35),(0,0,0),pearl,.035)
box('Recessed graphite face',(.60,.40,.014),(0,0,.178),graphite,.016)
box('Instrument display surround',(.43,.24,.016),(-.06,.025,.192),steel,.014)
box('Smoked instrument glass',(.38,.19,.008),(-.06,.025,.205),graphite,.01)
for x in [-.30,.30]:
    for y in [-.20,.20]:cylinder('Captive enclosure screw',.018,.012,(x,y,.19),steel,'z',6,.002)
for x in [-.18,.18]:
    cylinder('IP cable gland',.045,.07,(x,-.285,0),graphite,'y',12,.004)
    cylinder('Cable strain relief',.024,.07,(x,-.34,0),rubber,'y',12,.003)
for x in [.15,.23]:cylinder('Recessed control button',.027,.015,(x,-.10,.20),graphite,'z',16,.003)
export('controller')

begin('12 Exhaust fan shroud and guard')
verts,faces=[],[]
for y,r in [(-.15,.89),(.15,.89),(-.15,.855),(.15,.855)]:
    for i in range(48):
        a=i*math.tau/48;verts.append((r*math.cos(a),y,r*math.sin(a)))
for i in range(48):
    j=(i+1)%48
    faces.extend([(i,j,j+48,i+48),(i+96,i+144,j+144,j+96),
                  (i,i+96,j+96,j),(i+48,j+48,j+144,i+144)])
mesh('Rolled ventilator casing',verts,faces,pearl,0,.005)
for y in [-.15,.15]:ring('Rolled mounting lip',.89,.025,(0,y,0),steel,'y',48)
for r in [.17,.34,.51,.68,.83]:ring('Concentric finger guard',r,.008,(0,-.17,0),steel,'y',40)
for i in range(4):
    a=i*math.tau/4
    rod('Guard radial stay',(.08*math.cos(a),-.17,.08*math.sin(a)),(.87*math.cos(a),-.17,.87*math.sin(a)),.009,steel,8)
export('fan-shroud')

# Archive the full editable library. Separated collections remain easy to inspect.
bpy.ops.object.select_all(action='DESELECT')
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'zerowatt-library.blend'))
(OUT/'manifest.json').write_text(json.dumps({'generator':'Blender '+bpy.app.version_string,
    'coordinates':'glTF Y-up; authored Three.js coordinates converted once by V',
    'assets':manifest},indent=2),encoding='utf-8')
print('ZEROWATT_ASSETS_READY',json.dumps(manifest))
````````

FILE: `scripts/blender/render_review.py`

````````python
"""Render the actual offline FieldScene mesh snapshots for geometry review.
Run node tools/verify-graphics.cjs first. These are Blender renders, NOT browser
screenshots: PMREM, GLSL water, particles, UI and browser color mapping differ.
"""
import bpy
import json
import math
from pathlib import Path
from mathutils import Vector

ROOT=Path(__file__).resolve().parents[2]
def V(v):return (v[0],-v[2],v[1])
for name in ['air-machinery','water-machinery','air','water']:
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    data=json.loads((ROOT/'.upgrade-baseline'/'verification'/(name+'.json')).read_text())
    for batch in data['batches']:
        positions=batch['positions'];indices=batch['indices'];normals=batch['normals']
        vertices=[V(positions[i:i+3]) for i in range(0,len(positions),3)]
        faces=[indices[i:i+3] for i in range(0,len(indices),3)]
        mesh=bpy.data.meshes.new(batch['name']);mesh.from_pydata(vertices,[],faces);mesh.update()
        obj=bpy.data.objects.new(batch['name'],mesh);bpy.context.collection.objects.link(obj)
        material=bpy.data.materials.new(batch['name']);material.use_nodes=True
        p=material.node_tree.nodes.get('Principled BSDF')
        p.inputs['Base Color'].default_value=(*batch['color'],1)
        p.inputs['Metallic'].default_value=batch['metalness']
        p.inputs['Roughness'].default_value=batch['roughness']
        p.inputs['Alpha'].default_value=batch['alpha']
        if batch['alpha']<1:material.surface_render_method='DITHERED'
        if 'texture' in batch:
            uv=mesh.uv_layers.new(name='Runtime UV')
            for loop in mesh.loops:uv.data[loop.index].uv=batch['uvs'][loop.vertex_index*2:loop.vertex_index*2+2]
            tex=batch['texture'];image=bpy.data.images.new('Runtime contact texture',width=tex['width'],height=tex['height'])
            image.colorspace_settings.name='Non-Color';image.pixels=[v/255 for v in tex['data']]
            node=material.node_tree.nodes.new('ShaderNodeTexImage');node.image=image
            material.node_tree.links.new(node.outputs['Color'],p.inputs['Base Color'])
            material.node_tree.links.new(node.outputs['Alpha'],p.inputs['Alpha'])
            material.surface_render_method='DITHERED'
        mesh.materials.append(material)
        for poly in mesh.polygons:poly.use_smooth=True
        mesh.normals_split_custom_set_from_vertices([V(normals[i:i+3]) for i in range(0,len(normals),3)])
    scene=bpy.context.scene
    world=bpy.data.worlds.new('Soft daylight');world.use_nodes=True
    world.node_tree.nodes['Background'].inputs['Color'].default_value=(.48,.59,.62,1)
    world.node_tree.nodes['Background'].inputs['Strength'].default_value=.65
    scene.world=world
    bpy.ops.object.light_add(type='SUN',location=(-8,-9,14))
    sun=bpy.context.object;sun.data.energy=2.1;sun.data.angle=.15
    sun.rotation_euler=(math.radians(25),math.radians(-28),math.radians(-35))
    bpy.ops.object.light_add(type='AREA',location=(2,-5,9))
    bpy.context.object.data.energy=700;bpy.context.object.data.shape='DISK';bpy.context.object.data.size=8
    bpy.ops.object.camera_add(location=V(data['camera']['position']))
    camera=bpy.context.object;camera.rotation_euler=(Vector(V(data['camera']['target']))-camera.location).to_track_quat('-Z','Y').to_euler()
    camera.data.sensor_fit='VERTICAL';camera.data.sensor_height=24;camera.data.lens=12/math.tan(math.radians(19));camera.data.clip_end=300
    scene.camera=camera
    scene.render.engine='CYCLES';scene.cycles.samples=16;scene.cycles.use_denoising=True
    scene.render.resolution_x=1200;scene.render.resolution_y=800;scene.render.resolution_percentage=100
    scene.view_settings.view_transform='AgX';scene.view_settings.exposure=-.25
    scene.render.image_settings.file_format='PNG';scene.render.filepath=str(ROOT/'docs'/'upgrade'/(name+'-blender-review.png'))
    bpy.ops.render.render(write_still=True)
    print('REVIEW_RENDER_READY',name)
````````

FILE: `scripts/blender/validate_library.py`

````````python
"""Reopen the saved source and verify exported library collections."""
import bpy
import json
from pathlib import Path
root=Path(__file__).resolve().parents[2]
folder=root/'assets'/'zw-upgrade'
bpy.ops.wm.open_mainfile(filepath=str(folder/'zerowatt-library.blend'))
manifest=json.loads((folder/'manifest.json').read_text())
assert len(manifest['assets'])==13
assert len([c for c in bpy.data.collections if c.name[:2].isdigit()])==13
assert all((folder/(name+'.glb')).is_file() for name in manifest['assets'])
report={'blender':bpy.app.version_string,'reopened':True,'collections':13,
        'meshes':len([o for o in bpy.data.objects if o.type=='MESH']),
        'sourceBytes':(folder/'zerowatt-library.blend').stat().st_size}
(root/'docs'/'upgrade'/'blend-validation.json').write_text(json.dumps(report,indent=2))
print('BLEND_LIBRARY_VERIFIED',json.dumps(report))
````````

FILE: `tools/run-blender.cjs`

````````javascript
const fs=require('node:fs'),{spawnSync}=require('node:child_process');
const installed='C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe';
const executable=process.env.BLENDER_PATH||(fs.existsSync(installed)?installed:'blender');
const script=process.argv[2];
if(!script)throw new Error('Pass a Blender Python script path.');
const result=spawnSync(executable,['--background','--python',script],{stdio:'inherit',windowsHide:true});
if(result.error)throw result.error;
process.exitCode=result.status??1;
````````

FILE: `tools/verify-graphics.cjs`

````````javascript
/* Offline scene integration check. No browser or WebGL context is created.
   Captures actual FieldScene meshes for Blender geometry review; water shaders
   and browser layout still need an authorized browser session to inspect. */
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),assert=require('node:assert/strict');
const {buildSync}=require('esbuild');
const root=path.join(__dirname,'..');
const build=buildSync({stdin:{contents:`export {FieldScene} from './scene.js';export * as T from './vendor/three.module.js';
  export {GLTFLoader} from './vendor/addons/loaders/GLTFLoader.js';export {createWaterMaterial,applySurfaceDetail,applyVentilationMaterials} from './src/graphics/surfaces.js';
  export {VentilationVFX} from './src/graphics/ventilation-vfx.js';export {advanceCamera} from './src/graphics/camera.js';
  export {assetStatus} from './src/graphics/assets.js';`,resolveDir:root},bundle:true,platform:'node',format:'cjs',write:false});
const compiled=new Module(path.join(root,'verify-runtime.cjs'),module);compiled._compile(build.outputFiles[0].text,compiled.id);
const {T,FieldScene,GLTFLoader,createWaterMaterial,assetStatus,applySurfaceDetail,applyVentilationMaterials,VentilationVFX}=compiled.exports,M=require('../model.js');
GLTFLoader.prototype.loadAsync=async function(url){const b=fs.readFileSync(path.join(root,url));return this.parseAsync(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'');};
const output=path.join(root,'docs/upgrade'),snapshots=path.join(root,'.upgrade-baseline/verification');
fs.mkdirSync(snapshots,{recursive:true});
const source=fs.readFileSync(path.join(root,'scene.js'),'utf8');
const start=source.indexOf('this.mats = ')+12,end=source.indexOf(';',source.indexOf('\n    };',start));
const materialSource=source.slice(start,end);

function makeScene(mode){
  const s=Object.create(FieldScene.prototype);
  Object.assign(s,{mode,host:{dataset:{}},angle:.8,elevation:.42,distance:16,target:new T.Vector3(0,2,0),
    view:'field',time:0,count:1,extent:12,rotors:[],rotorGroups:[],gears:[],fans:[],vfans:[],units:[],trees:[],fish:[],rings:[],rainRings:[],people:[],panes:[],debris:[],puddles:[],hazes:[],water:null,canyon:null,
    flows:true,haze:0,rainAmt:0,storm:false,night:false,flashT:0,lightT:3,layoutKey:'',roomW:6,roomD:6,pondL:9,pondW:5,sensors:null,
    boats:1,upb:1,mount:'boat',boatGroups:[],boatPose:[],boatTheta:[],boatSim:[],lanes:[],laneOf:[],pondZc:6,benchBoat:null,compactGraphics:false,reducedMotion:true});
  s.scene=new T.Scene();s.scene.background=new T.Color('#b6cbd0');s.scene.fog=new T.FogExp2('#b6cbd0',.011);
  s.camera=new T.PerspectiveCamera(38,1.5,.1,240);
  s.sun=new T.DirectionalLight('#fff1dd',3);s.hemi=new T.HemisphereLight('#e8f3da','#263b2c',1.8);s.fill=new T.DirectionalLight('#c7dce6',.65);
  s.roomLight=new T.PointLight();s.flashLight=new T.PointLight();
  s.scene.add(s.sun,s.hemi,s.fill,s.roomLight,s.flashLight);
  s.mats=new Function('T','createWaterMaterial','return '+materialSource).call(s,T,createWaterMaterial);
  s.hazeMat=s.mats.haze;
  s.surfaceNormal=applySurfaceDetail(s.mats);if(mode==='air')applyVentilationMaterials(s.mats);
  for(const name of ['env','shell','unitRoot','fx','table']){s[name]=new T.Group();s.scene.add(s[name]);}
  s.table.visible=false;s.renderer={render(){}};
  s.buildStatic();s.buildTable();s.buildUnits();s.buildFx();
  if(mode==='air')s.ventilationVFX=new VentilationVFX(s);
  return s;
}
async function ready(s){
  const pending=[];s.scene.traverse(o=>{if(o.userData.assetReady)pending.push(o.userData.assetReady);});
  await Promise.all(pending);
  assert.equal(assetStatus.failed.size,0);
}
function meshSnapshot(s,file){
  s.scene.updateMatrixWorld(true);const batches=new Map();
  const q=new T.Vector3(),normal=new T.Vector3(),normalMatrix=new T.Matrix3(),world=new T.Matrix4(),instance=new T.Matrix4();
  let meshes=0,triangles=0;
  s.scene.traverseVisible(o=>{
    if(!o.isMesh)return;meshes++;
    const material=Array.isArray(o.material)?o.material[0]:o.material;
    if(material.opacity<.08)return;
    const key=material.uuid;
    if(!batches.has(key)){
      const batch={name:material.name||key,color:material.color.toArray(),roughness:material.roughness??.8,metalness:material.metalness??0,alpha:material.userData.trails ? .55 : material.opacity,positions:[],normals:[],indices:[]};
      if(material.map?.isDataTexture){const image=material.map.image;batch.texture={width:image.width,height:image.height,data:Array.from(image.data)};batch.uvs=[];}
      batches.set(key,batch);
    }
    const batch=batches.get(key),g=o.geometry,p=g.attributes.position,index=g.index;
    const n=o.isInstancedMesh?o.count:1;
    for(let j=0;j<n;j++){
      if(o.isInstancedMesh){o.getMatrixAt(j,instance);world.multiplyMatrices(o.matrixWorld,instance);}else world.copy(o.matrixWorld);
      normalMatrix.getNormalMatrix(world);
      const base=batch.positions.length/3;
      for(let i=0;i<p.count;i++){
        q.fromBufferAttribute(p,i).applyMatrix4(world);batch.positions.push(...q.toArray().map(v=>+v.toFixed(5)));
        normal.fromBufferAttribute(g.attributes.normal,i).applyMatrix3(normalMatrix).normalize();batch.normals.push(...normal.toArray().map(v=>+v.toFixed(5)));
        if(batch.texture)batch.uvs.push(g.attributes.uv.getX(i),g.attributes.uv.getY(i));
      }
      const count=index?index.count:p.count;triangles+=count/3;
      for(let i=0;i<count;i+=3){
        const corners=[0,1,2].map(k=>index?index.getX(i+k):i+k),trails=material.userData.trails;
        if(trails){
          const u=corners.reduce((a,k)=>a+g.attributes.uv.getX(k),0)/3;
          const phase=((u*3-trails.time.value)%1+1)%1;
          if(phase<.35||phase>.82||u<.04||u>.94)continue;
        }
        batch.indices.push(...corners.map(k=>base+k));
      }
    }
  });
  fs.writeFileSync(file,JSON.stringify({mode:s.mode,camera:{position:s.camera.position.toArray(),target:s.target.toArray()},batches:[...batches.values()]}));
  return {visibleMeshObjects:meshes,visibleTriangles:triangles,materialBatches:batches.size};
}
async function verify(){
  const report={kind:'Offline scene/asset integration; no WebGL or browser',cases:[],snapshots:{}};
  for(const mode of ['air','water']){
    const s=makeScene(mode);
    const scenarios=mode==='air'?['clear','heat','rain','storm']:['clear','night','rain','storm'];
    for(const count of [1,mode==='air'?10:12])for(const weather of scenarios){
      const p={...M.defaults,_mode:mode,_weather:weather,units:count,boats:count===1?1:6,upb:count===1?1:2,ratio:count===1?2:5,wind:weather==='storm'?19:4.5,rain:['rain','storm'].includes(weather)?1:0};
      const scenario={weather,environment:weather==='heat'?'canyon':'park'};
      s.setEnvironment(scenario,p);s.setHardware(M.evaluateHardware(p),p);s.setView('field');await ready(s);
      const sample=M.steady(p,p.wind,M.evaluateHardware(p));
      const angle=s.rotors[0].rotation.x,fan=s.fans[0].rotation.z,vfan=s.vfans[0].rotation.y;s.render(.016,sample,true);
      assert.ok(s.rotors[0].rotation.x>angle);assert.equal(s.units.filter(u=>u.g.visible).length,count);
      const rotorDelta=s.rotors[0].rotation.x-angle;
      assert.ok(Math.abs((s.fans[0].rotation.z-fan)-rotorDelta/p.ratio)<1e-10);
      assert.ok(Math.abs((s.vfans[0].rotation.y-vfan)+rotorDelta/p.ratio)<1e-10);
      const paused=s.rotors[0].rotation.x;s.render(.016,sample,false);assert.equal(s.rotors[0].rotation.x,paused);
      assert.equal(s.rain.visible,!!p.rain);assert.equal(s.stars.visible,weather==='night');
      s.setView('bench');s.render(.016,sample,true);assert.equal(s.units.filter(u=>u.g.visible).length,1);
      s.camera.updateMatrixWorld(true);s.scene.updateMatrixWorld(true);
      const rotorBounds=new T.Box3().setFromObject(s.rotorGroups[0]);
      for(const x of [rotorBounds.min.x,rotorBounds.max.x])for(const y of [rotorBounds.min.y,rotorBounds.max.y])for(const z of [rotorBounds.min.z,rotorBounds.max.z]){
        const point=new T.Vector3(x,y,z).project(s.camera);assert.ok(Math.abs(point.x)<1&&Math.abs(point.y)<1,'close-up must contain the whole rotor');
      }
      s.setView('field');
      for(const mount of mode==='water'?['boat','anchored']:['roof']){
        if(mode==='water'){p.mount=mount;s.setEnvironment(scenario,p);await ready(s);s.render(.016,sample,true);}
      }
      report.cases.push({mode,count,weather,pause:true,closeup:true,mounting:true,loaded:true});
    }
    const p={...M.defaults,_mode:mode,wind:4.5,units:1,boats:1,upb:1};
    s.setEnvironment({weather:'clear',environment:'park'},p);s.setView('field');await ready(s);s.render(.016,M.steady(p,4.5,M.evaluateHardware(p)),false);
    report.snapshots[mode]=meshSnapshot(s,path.join(snapshots,mode+'.json'));
    s.setView('bench');s.render(.016,M.steady(p,4.5,M.evaluateHardware(p)),false);
    report.snapshots[mode+'-machinery']=meshSnapshot(s,path.join(snapshots,mode+'-machinery.json'));
  }
  report.assetsLoaded=[...assetStatus.loaded];
  fs.writeFileSync(path.join(output,'scene-verification.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
}
module.exports={makeScene,ready,meshSnapshot,...compiled.exports};
if(require.main===module)verify().catch(error=>{console.error(error);process.exitCode=1;});
````````

FILE: `tools/deliver-sources.cjs`

````````javascript
/* Full source delivery, excluding generated bundles and binary assets. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.join(__dirname,'..'),out=path.join(root,'docs/upgrade');
const modified=['app.js','index.html','package.json','scene.js'];
const integrated=['premium-assets.js'];
const added=['upgrade.css','src/graphics/assets.js','src/graphics/site.js','src/graphics/surfaces.js','src/graphics/ventilation-vfx.js','src/graphics/camera.js',
  'scripts/blender/build_assets.py','scripts/blender/render_review.py','scripts/blender/validate_library.py',
  'tools/run-blender.cjs','tools/verify-graphics.cjs','tools/deliver-sources.cjs','tests/graphics.test.cjs','tests/ui.test.cjs','tests/ventilation.test.cjs',
  'vendor/addons/loaders/GLTFLoader.js','vendor/addons/utils/BufferGeometryUtils.js','vendor/addons/environments/RoomEnvironment.js'];
const inventory=[];
function record(file,kind){
  const b=fs.readFileSync(path.join(root,file));
  inventory.push({path:file,kind,bytes:b.length,sha256:crypto.createHash('sha256').update(b).digest('hex')});
}
let document='# Full final ZeroWatt source delivery\n\nWorkspace files are authoritative. These are complete source files, not diffs.\n\n';
for(const file of [...modified,...integrated,...added]){
  const content=fs.readFileSync(path.join(root,file),'utf8'),extension=path.extname(file);
  const language={'.js':'javascript','.cjs':'javascript','.py':'python','.css':'css','.html':'html','.json':'json'}[extension]||'text';
  // Longer fences keep upstream documentation examples inside the source block.
  document+=`FILE: \`${file}\`\n\n\`\`\`\`\`\`\`\`${language}\n${content}${content.endsWith('\n')?'':'\n'}\`\`\`\`\`\`\`\`\n\n`;
  record(file,modified.includes(file)?'modified source':integrated.includes(file)?'modified pre-existing untracked source':'new source');
}
for(const file of fs.readdirSync(path.join(root,'assets/zw-upgrade'))){
  if(!/\.(glb|blend|json)$/.test(file))continue;
  record('assets/zw-upgrade/'+file,file.endsWith('.glb')?'Blender runtime asset':file.endsWith('.blend')?'Blender editable source':'generated manifest');
}
record('app.bundle.js','generated production bundle');
for(const file of fs.readdirSync(out)){
  if(file==='FILES.json'||file==='SOURCE-DELIVERY.md')continue;
  record('docs/upgrade/'+file,file.endsWith('.png')?'Blender geometry review render':'documentation or verification output');
}
fs.writeFileSync(path.join(out,'SOURCE-DELIVERY.md'),document);
fs.writeFileSync(path.join(out,'FILES.json'),JSON.stringify(inventory,null,2));
console.log(`Delivered ${modified.length+integrated.length+added.length} complete source files; ${inventory.length} inventory entries.`);
````````

FILE: `tests/graphics.test.cjs`

````````javascript
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),Module=require('node:module');
const {buildSync}=require('esbuild');
const root=path.join(__dirname,'..'),M=require('../model.js');
const result=buildSync({stdin:{contents:`export {GLTFLoader} from './vendor/addons/loaders/GLTFLoader.js';
  export {FieldScene} from './scene.js';export * as T from './vendor/three.module.js';
  export * from './src/graphics/surfaces.js';export * from './src/graphics/assets.js';`,resolveDir:root},bundle:true,platform:'node',format:'cjs',write:false});
const compiled=new Module(path.join(root,'graphics-test.cjs'),module);compiled._compile(result.outputFiles[0].text,compiled.id);
const {GLTFLoader,T,FieldScene,createWaterMaterial,updateWater,upgradePart,retireShell}=compiled.exports;

test('engineering source hash and all 84 representative outputs match the pre-upgrade baseline',()=>{
  const baseline=JSON.parse(fs.readFileSync(path.join(root,'docs/upgrade/calculation-baseline.json')));
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'model.js'))).digest('hex'),baseline.sha256);
  assert.equal(baseline.cases.length,84);
  for(const {p,result} of baseline.cases)assert.deepEqual(M.steady(p,p.wind,M.evaluateHardware(p)),result);
});

const parsed=new Map();
test('every exported GLB loads through the actual r180 loader with finite geometry and expected axes',async()=>{
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'assets/zw-upgrade/manifest.json')));
  const details=[];
  for(const [name,entry] of Object.entries(manifest.assets)){
    const bytes=fs.readFileSync(path.join(root,`assets/zw-upgrade/${name}.glb`));
    assert.equal(bytes.readUInt32LE(0),0x46546c67);assert.equal(bytes.readUInt32LE(4),2);
    const gltf=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
    parsed.set(name,gltf.scene);
    let triangles=0,meshes=0;
    gltf.scene.traverse(o=>{if(!o.isMesh)return;meshes++;
      assert.ok(o.material.isMeshStandardMaterial);assert.ok(o.geometry.attributes.normal);
      for(const n of o.geometry.attributes.position.array)assert.ok(Number.isFinite(n));
      triangles+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3;
    });
    assert.equal(triangles,entry.triangles);assert.equal(meshes,entry.meshes);
    const box=new T.Box3().setFromObject(gltf.scene),size=box.getSize(new T.Vector3());
    if(name==='rotor'){assert.ok(size.x>1.8&&size.x<2.1);assert.ok(size.y>1.8&&size.y<2.5);}
    if(name==='fan'){assert.ok(size.y<.4&&size.x>1.4&&size.z>1.4);}
    if(name==='paddle'){assert.ok(size.z>1.4&&size.z<1.6&&size.y>3.1);}
    if(name==='bearing-frame'){assert.ok(box.min.y>=-.001&&box.max.y>.9);}
    if(name==='bearing'){assert.ok(Math.abs(size.y-size.z)<.002);assert.ok(box.min.y<0&&box.max.y>0);}
    details.push({name,meshes,triangles,bytes:bytes.length,bounds:{min:box.min.toArray(),max:box.max.toArray()}});
  }
  fs.writeFileSync(path.join(root,'docs/upgrade/asset-validation.json'),JSON.stringify(details,null,2));
});

test('water uses stable GPU deformation and responds to weather without changing simulation state',()=>{
  const m=createWaterMaterial(),p={...M.defaults};
  const shader={uniforms:{},vertexShader:T.ShaderLib.standard.vertexShader,fragmentShader:T.ShaderLib.standard.fragmentShader};
  m.onBeforeCompile(shader);
  assert.ok(shader.vertexShader.includes('transformed.z += sin(wx)'));
  assert.ok(shader.fragmentShader.includes('depthTint'));
  updateWater(m,10,0,4,false);const calm=m.userData.waterUniforms.zwAmplitude.value;
  updateWater(m,11,1,19,true);assert.ok(m.userData.waterUniforms.zwAmplitude.value>calm);
  assert.deepEqual(p,{...M.defaults});assert.equal(m.normalMap.image.width,128);
});

test('asset replacement preserves the animated parent transform and shared resources survive layout disposal',async()=>{
  const originalLoad=GLTFLoader.prototype.loadAsync;
  GLTFLoader.prototype.loadAsync=async()=>({scene:parsed.get('rotor')});
  try{
    const group=new T.Group();group.position.set(-2,1.55,0);group.rotation.x=.37;
    const old=new T.BoxGeometry();let disposed=0;old.addEventListener('dispose',()=>disposed++);
    group.add(new T.Mesh(old,new T.MeshBasicMaterial()));
    upgradePart(group,'test-rotor');assert.equal(await group.userData.assetReady,true);
    assert.equal(group.rotation.x,.37);assert.deepEqual(group.position.toArray(),[-2,1.55,0]);assert.equal(disposed,1);
    let sharedDisposed=0;group.traverse(o=>o.geometry?.addEventListener('dispose',()=>sharedDisposed++));
    const shell=new T.Group();shell.add(group);retireShell(shell);
    assert.equal(sharedDisposed,0);assert.equal(shell.children.length,0);
    const retired=new T.Group();upgradePart(retired,'test-rotor');retired.userData.retired=true;
    assert.equal(await retired.userData.assetReady,false);assert.equal(retired.children.length,0);
  }finally{GLTFLoader.prototype.loadAsync=originalLoad;}
});
````````

FILE: `tests/ui.test.cjs`

````````javascript
const {test}=require('node:test'),assert=require('node:assert/strict');
const {JSDOM}=require('jsdom'),fs=require('node:fs'),path=require('node:path'),{buildSync}=require('esbuild');
const root=path.join(__dirname,'..'),M=require('../model.js');
const stub=`class FieldScene {
      constructor(){this.calls=[];}setEnvironment(s,p){this.settings=p;this.scenario=s;}
      setHardware(){}setView(v){this.view=v;}setFlows(v){this.flows=v;}resize(){}render(){}
      setDoorOpen(v){this.doorOpen=v;}zoomBy(v){this.zoom=v;}orbitBy(){}inspectPart(v){this.part=v;}
    }`;
const contents=fs.readFileSync(path.join(root,'app.js'),'utf8').replace("import {FieldScene} from './scene.js';",stub);
const code=buildSync({stdin:{contents,resolveDir:root},bundle:true,format:'iife',write:false}).outputFiles[0].text;
function fixture(reduced=false){
  const dom=new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'),{url:'http://localhost/zero_watt_wind/',runScripts:'outside-only'});
  const w=dom.window;w.WindModel=M;w.matchMedia=()=>({matches:reduced});w.requestAnimationFrame=()=>0;w.eval(code);
  return {w,d:w.document,api:w.ZW,close:()=>dom.window.close()};
}
test('all original inputs and weather cases remain usable; readouts reflect real model outputs',()=>{
  const f=fixture();
  for(const mode of ['air','water']){
    f.d.getElementById(mode+'-tab').click();const s=f.api.state();assert.equal(s.mode,mode);
    for(const scenario of f.api.scenarios[mode]){
      s.root.querySelector(`[data-scenario="${scenario.id}"]`).click();assert.equal(s.scenario.id,scenario.id);
      assert.equal(s.root.querySelector('[data-scenario-select]').value,scenario.id);
      for(const el of s.root.querySelectorAll('[data-metric]')){
        const k=el.dataset.metric,digits=k==='airflow'?0:1;
        assert.equal(el.textContent,s.current[k].toLocaleString('en-US',{minimumFractionDigits:digits,maximumFractionDigits:digits}));
      }
    }
    for(const el of s.root.querySelectorAll('[data-param]')){
      const k=el.dataset.param,definition=f.api.definitions[k];
      assert.equal(+el.min,definition[1]);assert.equal(+el.max,definition[2]);assert.equal(+el.step,definition[3]);
      el.value=definition[1];el.dispatchEvent(new f.w.Event('input'));assert.equal(s.p[k],definition[1]);
      el.value=definition[2];el.dispatchEvent(new f.w.Event('input'));assert.equal(s.p[k],definition[2]);
    }
    for(const el of s.root.querySelectorAll('[data-hw]')){
      el.value=el.options[el.options.length-1].value;el.dispatchEvent(new f.w.Event('change'));assert.equal(s.p[el.dataset.hw],el.value);
    }
    s.root.querySelector('[data-suggest]').click();assert.notEqual(s.p.mcu,'none');
    for(const el of s.root.querySelectorAll('[data-param-select]')){
      el.value=el.options[el.options.length-1].value;el.dispatchEvent(new f.w.Event('change'));assert.equal(s.p[el.dataset.paramSelect],el.value);
    }
    s.root.querySelector('[data-reset]').click();
    const pause=s.root.querySelector('[data-tool="pause"]');pause.click();assert.equal(s.running,false);assert.equal(pause.getAttribute('aria-label'),'Play');pause.click();assert.equal(s.running,true);
    const flows=s.root.querySelector('[data-tool="flows"]');flows.click();assert.equal(s.flows,false);
    s.root.querySelector('[data-tool="view"]').click();assert.equal(s.view,'bench');
    s.root.querySelector('[data-tool="view"]').click();assert.equal(s.view,'field');
    s.root.querySelector('[data-tool="zoom-in"]').click();assert.ok(s.scene.zoom<1);
    s.root.querySelector('[data-tool="zoom-out"]').click();assert.ok(s.scene.zoom>1);
    s.root.querySelector('[data-tool="home"]').click();assert.equal(s.scene.view,'field');
    if(mode==='air'){s.root.querySelector('[data-tool="door"]').click();assert.equal(s.scene.doorOpen,true);}
    if(mode==='air'){
      const flow=s.root.querySelector('[data-tool="flow-view"]');flow.click();assert.equal(s.view,'flow');assert.equal(flow.getAttribute('aria-pressed'),'true');
      s.root.querySelector('[data-inspect="rotor"]').click();assert.equal(s.view,'bench');assert.equal(s.scene.part,'rotor');
      s.root.querySelector('[data-inspect="intake"]').click();assert.equal(s.view,'flow');assert.equal(s.scene.part,'intake');
      s.root.querySelector('[data-tool="home"]').click();assert.equal(s.view,'field');assert.equal(flow.getAttribute('aria-pressed'),'false');
    }
  }
  f.close();
});
test('maximum installations, manual brake, keyboard tabs and reduced-motion initial pause are preserved',()=>{
  const f=fixture(true);assert.equal(f.api.state().running,false);
  const pause=f.api.state().root.querySelector('[data-tool="pause"]');assert.equal(pause.textContent,'Play');assert.equal(pause.getAttribute('aria-pressed'),'true');
  const air=f.api.state();for(let i=0;i<20;i++)air.root.querySelector('[data-inc="units"]').click();assert.equal(air.p.units,10);
  const brake=air.root.querySelector('[data-toggle="brake"]');brake.checked=true;brake.dispatchEvent(new f.w.Event('change'));assert.equal(air.current.shaft,0);
  f.d.getElementById('air-tab').dispatchEvent(new f.w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));assert.equal(f.api.mode(),'water');
  const water=f.api.state();for(let i=0;i<10;i++){water.root.querySelector('[data-inc="boats"]').click();water.root.querySelector('[data-inc="upb"]').click();}
  assert.equal(water.p.units,12);assert.equal(water.p.boats,6);assert.equal(water.p.upb,2);
  assert.equal(f.d.getElementById('air-face').hidden,true);assert.equal(water.root.hidden,false);f.close();
});
````````

FILE: `tests/ventilation.test.cjs`

````````javascript
const {test}=require('node:test'),assert=require('node:assert/strict');
const {makeScene,ready,T,advanceCamera}=require('../tools/verify-graphics.cjs');
const M=require('../model.js');

async function fixture(){
  const s=makeScene('air'),p={...M.defaults,_mode:'air',wind:4.5,mcu:'stm32',enclosure:'ip67'};
  s.setEnvironment({weather:'clear',environment:'roof'},p);s.setHardware(M.evaluateHardware(p),p);s.setView('field');await ready(s);
  const sample=()=>M.steady(p,p.wind,M.evaluateHardware(p));s.render(.016,sample(),true);
  return {s,p,sample};
}
test('ventilation paths use model flow, stop powered trails at zero output, and preserve background exchange',async()=>{
  const {s,p,sample}=await fixture(),v=s.ventilationVFX;
  assert.deepEqual(Object.keys(v.layers).sort(),['drive','exhaust','intake','wind']);
  assert.ok(v.layers.exhaust.visible);assert.ok(v.layers.drive.visible);
  const geometry=v.layers.intake.geometry,positions=geometry.attributes.position.array.slice();
  const clock=v.materials.exhaust.userData.trails.time.value;
  s.render(.1,sample(),false);assert.equal(v.materials.exhaust.userData.trails.time.value,clock);
  p.wind=0;s.setEnvironment({weather:'clear',environment:'roof'},p);s.render(.1,sample(),true);
  assert.equal(v.layers.wind.visible,false);assert.equal(v.layers.drive.visible,false);assert.equal(v.layers.exhaust.visible,false);
  assert.equal(v.layers.intake.visible,true,'original background ACH still exchanges air');
  assert.equal(v.layers.intake.geometry,geometry);assert.deepEqual(geometry.attributes.position.array,positions,'path vertices are not rewritten per frame');
  p.wind=7;p.brake=true;s.render(.1,sample(),true);assert.equal(v.layers.drive.visible,false);
  s.setFlows(false);s.render(.1,sample(),true);assert.equal(v.root.visible,false);
  s.setFlows(true);s.render(.1,sample(),true);assert.equal(v.root.visible,true);
  assert.ok(s.sensors.mcuLed.parent,'upgrading the controller must retain the live indicator');
  assert.ok(s.sensors.mcu.getObjectByName('Blender controller'));
});
test('all intake paths cross actual window apertures and exhaust paths follow each installed fan',async()=>{
  const {s,p,sample}=await fixture();
  p.units=10;s.setEnvironment({weather:'clear',environment:'roof'},p);s.render(.016,sample(),true);await ready(s);
  const v=s.ventilationVFX;
  const intake=v.layers.intake.geometry.attributes.position;
  for(const pane of s.panes){
    let crosses=false;
    for(let i=0;i<intake.count;i++)if(Math.abs(intake.getX(i)-pane.x)<.14&&Math.abs(intake.getY(i)-pane.y)<.30&&Math.abs(intake.getZ(i)-pane.zc)<pane.width*.4){crosses=true;break;}
    assert.ok(crosses,'intake geometry crosses the existing window opening');
  }
  const exhaust=new T.Box3().setFromObject(v.layers.exhaust);
  for(let i=0;i<s.count;i++){
    const q=s.unitPos(i);assert.ok(exhaust.containsPoint(new T.Vector3(q.x+1.02,3.4,q.z)));
  }
  assert.ok(v.layers.intake.geometry.attributes.position.count<100000);
  const key=v.key;s.setView('flow');s.render(.016,sample(),false);assert.notEqual(v.key,key);
  s.setView('bench');s.render(.016,sample(),false);assert.deepEqual(Object.keys(v.layers).sort(),['drive','wind']);
});
test('camera movement eases while paused, settles to the target, and frames portrait inspection views',async()=>{
  const {s,sample}=await fixture();s.reducedMotion=false;
  const before=s.camera.position.clone();s.zoomBy(.75);assert.deepEqual(s.camera.position.toArray(),before.toArray());
  s.render(.016,sample(),false);assert.ok(s.camera.position.distanceTo(before)>0);
  assert.ok(Math.abs(s._cameraPose.distance-s.distance)>.1);
  for(let i=0;i<150;i++)s.render(.016,sample(),false);
  assert.ok(Math.abs(s._cameraPose.distance-s.distance)<1e-7);
  s.camera.aspect=.65;s.camera.updateProjectionMatrix();s.setView('bench');advanceCamera(s,0,true);
  s.scene.updateMatrixWorld(true);s.camera.updateMatrixWorld(true);
  const b=new T.Box3().setFromObject(s.rotorGroups[0]);
  for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z]){
    const q=new T.Vector3(x,y,z).project(s.camera);assert.ok(Math.abs(q.x)<1&&Math.abs(q.y)<1);
  }
  s.reducedMotion=true;s.zoomBy(1.1);assert.equal(s._cameraPose.distance,s.distance);
});
````````

FILE: `vendor/addons/loaders/GLTFLoader.js`

````````javascript
import {
	AnimationClip,
	Bone,
	Box3,
	BufferAttribute,
	BufferGeometry,
	ClampToEdgeWrapping,
	Color,
	ColorManagement,
	DirectionalLight,
	DoubleSide,
	FileLoader,
	FrontSide,
	Group,
	ImageBitmapLoader,
	InstancedMesh,
	InterleavedBuffer,
	InterleavedBufferAttribute,
	Interpolant,
	InterpolateDiscrete,
	InterpolateLinear,
	Line,
	LineBasicMaterial,
	LineLoop,
	LineSegments,
	LinearFilter,
	LinearMipmapLinearFilter,
	LinearMipmapNearestFilter,
	LinearSRGBColorSpace,
	Loader,
	LoaderUtils,
	Material,
	MathUtils,
	Matrix4,
	Mesh,
	MeshBasicMaterial,
	MeshPhysicalMaterial,
	MeshStandardMaterial,
	MirroredRepeatWrapping,
	NearestFilter,
	NearestMipmapLinearFilter,
	NearestMipmapNearestFilter,
	NumberKeyframeTrack,
	Object3D,
	OrthographicCamera,
	PerspectiveCamera,
	PointLight,
	Points,
	PointsMaterial,
	PropertyBinding,
	Quaternion,
	QuaternionKeyframeTrack,
	RepeatWrapping,
	Skeleton,
	SkinnedMesh,
	Sphere,
	SpotLight,
	Texture,
	TextureLoader,
	TriangleFanDrawMode,
	TriangleStripDrawMode,
	Vector2,
	Vector3,
	VectorKeyframeTrack,
	SRGBColorSpace,
	InstancedBufferAttribute
} from '../../three.module.js';
import { toTrianglesDrawMode } from '../utils/BufferGeometryUtils.js';

/**
 * A loader for the glTF 2.0 format.
 *
 * [glTF]{@link https://www.khronos.org/gltf/} (GL Transmission Format) is an [open format specification]{@link https://github.com/KhronosGroup/glTF/tree/main/specification/2.0}
 * for efficient delivery and loading of 3D content. Assets may be provided either in JSON (.gltf) or binary (.glb)
 * format. External files store textures (.jpg, .png) and additional binary data (.bin). A glTF asset may deliver
 * one or more scenes, including meshes, materials, textures, skins, skeletons, morph targets, animations, lights,
 * and/or cameras.
 *
 * `GLTFLoader` uses {@link ImageBitmapLoader} whenever possible. Be advised that image bitmaps are not
 * automatically GC-collected when they are no longer referenced, and they require special handling during
 * the disposal process.
 *
 * `GLTFLoader` supports the following glTF 2.0 extensions:
 * - KHR_draco_mesh_compression
 * - KHR_materials_clearcoat
 * - KHR_materials_dispersion
 * - KHR_materials_ior
 * - KHR_materials_specular
 * - KHR_materials_transmission
 * - KHR_materials_iridescence
 * - KHR_materials_unlit
 * - KHR_materials_volume
 * - KHR_mesh_quantization
 * - KHR_lights_punctual
 * - KHR_texture_basisu
 * - KHR_texture_transform
 * - EXT_texture_webp
 * - EXT_meshopt_compression
 * - EXT_mesh_gpu_instancing
 *
 * The following glTF 2.0 extension is supported by an external user plugin:
 * - [KHR_materials_variants]{@link https://github.com/takahirox/three-gltf-extensions}
 * - [MSFT_texture_dds]{@link https://github.com/takahirox/three-gltf-extensions}
 *
 * ```js
 * const loader = new GLTFLoader();
 *
 * // Optional: Provide a DRACOLoader instance to decode compressed mesh data
 * const dracoLoader = new DRACOLoader();
 * dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );
 * loader.setDRACOLoader( dracoLoader );
 *
 * const gltf = await loader.loadAsync( 'models/gltf/duck/duck.gltf' );
 * scene.add( gltf.scene );
 * ```
 *
 * @augments Loader
 * @three_import import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
 */
class GLTFLoader extends Loader {

	/**
	 * Constructs a new glTF loader.
	 *
	 * @param {LoadingManager} [manager] - The loading manager.
	 */
	constructor( manager ) {

		super( manager );

		this.dracoLoader = null;
		this.ktx2Loader = null;
		this.meshoptDecoder = null;

		this.pluginCallbacks = [];

		this.register( function ( parser ) {

			return new GLTFMaterialsClearcoatExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsDispersionExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFTextureBasisUExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFTextureWebPExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFTextureAVIFExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsSheenExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsTransmissionExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsVolumeExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsIorExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsEmissiveStrengthExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsSpecularExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsIridescenceExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsAnisotropyExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsBumpExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFLightsExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMeshoptCompression( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMeshGpuInstancing( parser );

		} );

	}

	/**
	 * Starts loading from the given URL and passes the loaded glTF asset
	 * to the `onLoad()` callback.
	 *
	 * @param {string} url - The path/URL of the file to be loaded. This can also be a data URI.
	 * @param {function(GLTFLoader~LoadObject)} onLoad - Executed when the loading process has been finished.
	 * @param {onProgressCallback} onProgress - Executed while the loading is in progress.
	 * @param {onErrorCallback} onError - Executed when errors occur.
	 */
	load( url, onLoad, onProgress, onError ) {

		const scope = this;

		let resourcePath;

		if ( this.resourcePath !== '' ) {

			resourcePath = this.resourcePath;

		} else if ( this.path !== '' ) {

			// If a base path is set, resources will be relative paths from that plus the relative path of the gltf file
			// Example  path = 'https://my-cnd-server.com/', url = 'assets/models/model.gltf'
			// resourcePath = 'https://my-cnd-server.com/assets/models/'
			// referenced resource 'model.bin' will be loaded from 'https://my-cnd-server.com/assets/models/model.bin'
			// referenced resource '../textures/texture.png' will be loaded from 'https://my-cnd-server.com/assets/textures/texture.png'
			const relativeUrl = LoaderUtils.extractUrlBase( url );
			resourcePath = LoaderUtils.resolveURL( relativeUrl, this.path );

		} else {

			resourcePath = LoaderUtils.extractUrlBase( url );

		}

		// Tells the LoadingManager to track an extra item, which resolves after
		// the model is fully loaded. This means the count of items loaded will
		// be incorrect, but ensures manager.onLoad() does not fire early.
		this.manager.itemStart( url );

		const _onError = function ( e ) {

			if ( onError ) {

				onError( e );

			} else {

				console.error( e );

			}

			scope.manager.itemError( url );
			scope.manager.itemEnd( url );

		};

		const loader = new FileLoader( this.manager );

		loader.setPath( this.path );
		loader.setResponseType( 'arraybuffer' );
		loader.setRequestHeader( this.requestHeader );
		loader.setWithCredentials( this.withCredentials );

		loader.load( url, function ( data ) {

			try {

				scope.parse( data, resourcePath, function ( gltf ) {

					onLoad( gltf );

					scope.manager.itemEnd( url );

				}, _onError );

			} catch ( e ) {

				_onError( e );

			}

		}, onProgress, _onError );

	}

	/**
	 * Sets the given Draco loader to this loader. Required for decoding assets
	 * compressed with the `KHR_draco_mesh_compression` extension.
	 *
	 * @param {DRACOLoader} dracoLoader - The Draco loader to set.
	 * @return {GLTFLoader} A reference to this loader.
	 */
	setDRACOLoader( dracoLoader ) {

		this.dracoLoader = dracoLoader;
		return this;

	}

	/**
	 * Sets the given KTX2 loader to this loader. Required for loading KTX2
	 * compressed textures.
	 *
	 * @param {KTX2Loader} ktx2Loader - The KTX2 loader to set.
	 * @return {GLTFLoader} A reference to this loader.
	 */
	setKTX2Loader( ktx2Loader ) {

		this.ktx2Loader = ktx2Loader;
		return this;

	}

	/**
	 * Sets the given meshopt decoder. Required for decoding assets
	 * compressed with the `EXT_meshopt_compression` extension.
	 *
	 * @param {Object} meshoptDecoder - The meshopt decoder to set.
	 * @return {GLTFLoader} A reference to this loader.
	 */
	setMeshoptDecoder( meshoptDecoder ) {

		this.meshoptDecoder = meshoptDecoder;
		return this;

	}

	/**
	 * Registers a plugin callback. This API is internally used to implement the various
	 * glTF extensions but can also used by third-party code to add additional logic
	 * to the loader.
	 *
	 * @param {function(parser:GLTFParser)} callback - The callback function to register.
	 * @return {GLTFLoader} A reference to this loader.
	 */
	register( callback ) {

		if ( this.pluginCallbacks.indexOf( callback ) === - 1 ) {

			this.pluginCallbacks.push( callback );

		}

		return this;

	}

	/**
	 * Unregisters a plugin callback.
	 *
	 * @param {Function} callback - The callback function to unregister.
	 * @return {GLTFLoader} A reference to this loader.
	 */
	unregister( callback ) {

		if ( this.pluginCallbacks.indexOf( callback ) !== - 1 ) {

			this.pluginCallbacks.splice( this.pluginCallbacks.indexOf( callback ), 1 );

		}

		return this;

	}

	/**
	 * Parses the given FBX data and returns the resulting group.
	 *
	 * @param {string|ArrayBuffer} data - The raw glTF data.
	 * @param {string} path - The URL base path.
	 * @param {function(GLTFLoader~LoadObject)} onLoad - Executed when the loading process has been finished.
	 * @param {onErrorCallback} onError - Executed when errors occur.
	 */
	parse( data, path, onLoad, onError ) {

		let json;
		const extensions = {};
		const plugins = {};
		const textDecoder = new TextDecoder();

		if ( typeof data === 'string' ) {

			json = JSON.parse( data );

		} else if ( data instanceof ArrayBuffer ) {

			const magic = textDecoder.decode( new Uint8Array( data, 0, 4 ) );

			if ( magic === BINARY_EXTENSION_HEADER_MAGIC ) {

				try {

					extensions[ EXTENSIONS.KHR_BINARY_GLTF ] = new GLTFBinaryExtension( data );

				} catch ( error ) {

					if ( onError ) onError( error );
					return;

				}

				json = JSON.parse( extensions[ EXTENSIONS.KHR_BINARY_GLTF ].content );

			} else {

				json = JSON.parse( textDecoder.decode( data ) );

			}

		} else {

			json = data;

		}

		if ( json.asset === undefined || json.asset.version[ 0 ] < 2 ) {

			if ( onError ) onError( new Error( 'THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported.' ) );
			return;

		}

		const parser = new GLTFParser( json, {

			path: path || this.resourcePath || '',
			crossOrigin: this.crossOrigin,
			requestHeader: this.requestHeader,
			manager: this.manager,
			ktx2Loader: this.ktx2Loader,
			meshoptDecoder: this.meshoptDecoder

		} );

		parser.fileLoader.setRequestHeader( this.requestHeader );

		for ( let i = 0; i < this.pluginCallbacks.length; i ++ ) {

			const plugin = this.pluginCallbacks[ i ]( parser );

			if ( ! plugin.name ) console.error( 'THREE.GLTFLoader: Invalid plugin found: missing name' );

			plugins[ plugin.name ] = plugin;

			// Workaround to avoid determining as unknown extension
			// in addUnknownExtensionsToUserData().
			// Remove this workaround if we move all the existing
			// extension handlers to plugin system
			extensions[ plugin.name ] = true;

		}

		if ( json.extensionsUsed ) {

			for ( let i = 0; i < json.extensionsUsed.length; ++ i ) {

				const extensionName = json.extensionsUsed[ i ];
				const extensionsRequired = json.extensionsRequired || [];

				switch ( extensionName ) {

					case EXTENSIONS.KHR_MATERIALS_UNLIT:
						extensions[ extensionName ] = new GLTFMaterialsUnlitExtension();
						break;

					case EXTENSIONS.KHR_DRACO_MESH_COMPRESSION:
						extensions[ extensionName ] = new GLTFDracoMeshCompressionExtension( json, this.dracoLoader );
						break;

					case EXTENSIONS.KHR_TEXTURE_TRANSFORM:
						extensions[ extensionName ] = new GLTFTextureTransformExtension();
						break;

					case EXTENSIONS.KHR_MESH_QUANTIZATION:
						extensions[ extensionName ] = new GLTFMeshQuantizationExtension();
						break;

					default:

						if ( extensionsRequired.indexOf( extensionName ) >= 0 && plugins[ extensionName ] === undefined ) {

							console.warn( 'THREE.GLTFLoader: Unknown extension "' + extensionName + '".' );

						}

				}

			}

		}

		parser.setExtensions( extensions );
		parser.setPlugins( plugins );
		parser.parse( onLoad, onError );

	}

	/**
	 * Async version of {@link GLTFLoader#parse}.
	 *
	 * @async
	 * @param {string|ArrayBuffer} data - The raw glTF data.
	 * @param {string} path - The URL base path.
	 * @return {Promise<GLTFLoader~LoadObject>} A Promise that resolves with the loaded glTF when the parsing has been finished.
	 */
	parseAsync( data, path ) {

		const scope = this;

		return new Promise( function ( resolve, reject ) {

			scope.parse( data, path, resolve, reject );

		} );

	}

}

/* GLTFREGISTRY */

function GLTFRegistry() {

	let objects = {};

	return	{

		get: function ( key ) {

			return objects[ key ];

		},

		add: function ( key, object ) {

			objects[ key ] = object;

		},

		remove: function ( key ) {

			delete objects[ key ];

		},

		removeAll: function () {

			objects = {};

		}

	};

}

/*********************************/
/********** EXTENSIONS ***********/
/*********************************/

const EXTENSIONS = {
	KHR_BINARY_GLTF: 'KHR_binary_glTF',
	KHR_DRACO_MESH_COMPRESSION: 'KHR_draco_mesh_compression',
	KHR_LIGHTS_PUNCTUAL: 'KHR_lights_punctual',
	KHR_MATERIALS_CLEARCOAT: 'KHR_materials_clearcoat',
	KHR_MATERIALS_DISPERSION: 'KHR_materials_dispersion',
	KHR_MATERIALS_IOR: 'KHR_materials_ior',
	KHR_MATERIALS_SHEEN: 'KHR_materials_sheen',
	KHR_MATERIALS_SPECULAR: 'KHR_materials_specular',
	KHR_MATERIALS_TRANSMISSION: 'KHR_materials_transmission',
	KHR_MATERIALS_IRIDESCENCE: 'KHR_materials_iridescence',
	KHR_MATERIALS_ANISOTROPY: 'KHR_materials_anisotropy',
	KHR_MATERIALS_UNLIT: 'KHR_materials_unlit',
	KHR_MATERIALS_VOLUME: 'KHR_materials_volume',
	KHR_TEXTURE_BASISU: 'KHR_texture_basisu',
	KHR_TEXTURE_TRANSFORM: 'KHR_texture_transform',
	KHR_MESH_QUANTIZATION: 'KHR_mesh_quantization',
	KHR_MATERIALS_EMISSIVE_STRENGTH: 'KHR_materials_emissive_strength',
	EXT_MATERIALS_BUMP: 'EXT_materials_bump',
	EXT_TEXTURE_WEBP: 'EXT_texture_webp',
	EXT_TEXTURE_AVIF: 'EXT_texture_avif',
	EXT_MESHOPT_COMPRESSION: 'EXT_meshopt_compression',
	EXT_MESH_GPU_INSTANCING: 'EXT_mesh_gpu_instancing'
};

/**
 * Punctual Lights Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_lights_punctual
 *
 * @private
 */
class GLTFLightsExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_LIGHTS_PUNCTUAL;

		// Object3D instance caches
		this.cache = { refs: {}, uses: {} };

	}

	_markDefs() {

		const parser = this.parser;
		const nodeDefs = this.parser.json.nodes || [];

		for ( let nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex ++ ) {

			const nodeDef = nodeDefs[ nodeIndex ];

			if ( nodeDef.extensions
					&& nodeDef.extensions[ this.name ]
					&& nodeDef.extensions[ this.name ].light !== undefined ) {

				parser._addNodeRef( this.cache, nodeDef.extensions[ this.name ].light );

			}

		}

	}

	_loadLight( lightIndex ) {

		const parser = this.parser;
		const cacheKey = 'light:' + lightIndex;
		let dependency = parser.cache.get( cacheKey );

		if ( dependency ) return dependency;

		const json = parser.json;
		const extensions = ( json.extensions && json.extensions[ this.name ] ) || {};
		const lightDefs = extensions.lights || [];
		const lightDef = lightDefs[ lightIndex ];
		let lightNode;

		const color = new Color( 0xffffff );

		if ( lightDef.color !== undefined ) color.setRGB( lightDef.color[ 0 ], lightDef.color[ 1 ], lightDef.color[ 2 ], LinearSRGBColorSpace );

		const range = lightDef.range !== undefined ? lightDef.range : 0;

		switch ( lightDef.type ) {

			case 'directional':
				lightNode = new DirectionalLight( color );
				lightNode.target.position.set( 0, 0, - 1 );
				lightNode.add( lightNode.target );
				break;

			case 'point':
				lightNode = new PointLight( color );
				lightNode.distance = range;
				break;

			case 'spot':
				lightNode = new SpotLight( color );
				lightNode.distance = range;
				// Handle spotlight properties.
				lightDef.spot = lightDef.spot || {};
				lightDef.spot.innerConeAngle = lightDef.spot.innerConeAngle !== undefined ? lightDef.spot.innerConeAngle : 0;
				lightDef.spot.outerConeAngle = lightDef.spot.outerConeAngle !== undefined ? lightDef.spot.outerConeAngle : Math.PI / 4.0;
				lightNode.angle = lightDef.spot.outerConeAngle;
				lightNode.penumbra = 1.0 - lightDef.spot.innerConeAngle / lightDef.spot.outerConeAngle;
				lightNode.target.position.set( 0, 0, - 1 );
				lightNode.add( lightNode.target );
				break;

			default:
				throw new Error( 'THREE.GLTFLoader: Unexpected light type: ' + lightDef.type );

		}

		// Some lights (e.g. spot) default to a position other than the origin. Reset the position
		// here, because node-level parsing will only override position if explicitly specified.
		lightNode.position.set( 0, 0, 0 );

		assignExtrasToUserData( lightNode, lightDef );

		if ( lightDef.intensity !== undefined ) lightNode.intensity = lightDef.intensity;

		lightNode.name = parser.createUniqueName( lightDef.name || ( 'light_' + lightIndex ) );

		dependency = Promise.resolve( lightNode );

		parser.cache.add( cacheKey, dependency );

		return dependency;

	}

	getDependency( type, index ) {

		if ( type !== 'light' ) return;

		return this._loadLight( index );

	}

	createNodeAttachment( nodeIndex ) {

		const self = this;
		const parser = this.parser;
		const json = parser.json;
		const nodeDef = json.nodes[ nodeIndex ];
		const lightDef = ( nodeDef.extensions && nodeDef.extensions[ this.name ] ) || {};
		const lightIndex = lightDef.light;

		if ( lightIndex === undefined ) return null;

		return this._loadLight( lightIndex ).then( function ( light ) {

			return parser._getNodeRef( self.cache, lightIndex, light );

		} );

	}

}

/**
 * Unlit Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_unlit
 *
 * @private
 */
class GLTFMaterialsUnlitExtension {

	constructor() {

		this.name = EXTENSIONS.KHR_MATERIALS_UNLIT;

	}

	getMaterialType() {

		return MeshBasicMaterial;

	}

	extendParams( materialParams, materialDef, parser ) {

		const pending = [];

		materialParams.color = new Color( 1.0, 1.0, 1.0 );
		materialParams.opacity = 1.0;

		const metallicRoughness = materialDef.pbrMetallicRoughness;

		if ( metallicRoughness ) {

			if ( Array.isArray( metallicRoughness.baseColorFactor ) ) {

				const array = metallicRoughness.baseColorFactor;

				materialParams.color.setRGB( array[ 0 ], array[ 1 ], array[ 2 ], LinearSRGBColorSpace );
				materialParams.opacity = array[ 3 ];

			}

			if ( metallicRoughness.baseColorTexture !== undefined ) {

				pending.push( parser.assignTexture( materialParams, 'map', metallicRoughness.baseColorTexture, SRGBColorSpace ) );

			}

		}

		return Promise.all( pending );

	}

}

/**
 * Materials Emissive Strength Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/blob/5768b3ce0ef32bc39cdf1bef10b948586635ead3/extensions/2.0/Khronos/KHR_materials_emissive_strength/README.md
 *
 * @private
 */
class GLTFMaterialsEmissiveStrengthExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_EMISSIVE_STRENGTH;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const emissiveStrength = materialDef.extensions[ this.name ].emissiveStrength;

		if ( emissiveStrength !== undefined ) {

			materialParams.emissiveIntensity = emissiveStrength;

		}

		return Promise.resolve();

	}

}

/**
 * Clearcoat Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_clearcoat
 *
 * @private
 */
class GLTFMaterialsClearcoatExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_CLEARCOAT;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[ this.name ];

		if ( extension.clearcoatFactor !== undefined ) {

			materialParams.clearcoat = extension.clearcoatFactor;

		}

		if ( extension.clearcoatTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'clearcoatMap', extension.clearcoatTexture ) );

		}

		if ( extension.clearcoatRoughnessFactor !== undefined ) {

			materialParams.clearcoatRoughness = extension.clearcoatRoughnessFactor;

		}

		if ( extension.clearcoatRoughnessTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'clearcoatRoughnessMap', extension.clearcoatRoughnessTexture ) );

		}

		if ( extension.clearcoatNormalTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'clearcoatNormalMap', extension.clearcoatNormalTexture ) );

			if ( extension.clearcoatNormalTexture.scale !== undefined ) {

				const scale = extension.clearcoatNormalTexture.scale;

				materialParams.clearcoatNormalScale = new Vector2( scale, scale );

			}

		}

		return Promise.all( pending );

	}

}

/**
 * Materials dispersion Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_dispersion
 *
 * @private
 */
class GLTFMaterialsDispersionExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_DISPERSION;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const extension = materialDef.extensions[ this.name ];

		materialParams.dispersion = extension.dispersion !== undefined ? extension.dispersion : 0;

		return Promise.resolve();

	}

}

/**
 * Iridescence Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_iridescence
 *
 * @private
 */
class GLTFMaterialsIridescenceExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_IRIDESCENCE;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[ this.name ];

		if ( extension.iridescenceFactor !== undefined ) {

			materialParams.iridescence = extension.iridescenceFactor;

		}

		if ( extension.iridescenceTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'iridescenceMap', extension.iridescenceTexture ) );

		}

		if ( extension.iridescenceIor !== undefined ) {

			materialParams.iridescenceIOR = extension.iridescenceIor;

		}

		if ( materialParams.iridescenceThicknessRange === undefined ) {

			materialParams.iridescenceThicknessRange = [ 100, 400 ];

		}

		if ( extension.iridescenceThicknessMinimum !== undefined ) {

			materialParams.iridescenceThicknessRange[ 0 ] = extension.iridescenceThicknessMinimum;

		}

		if ( extension.iridescenceThicknessMaximum !== undefined ) {

			materialParams.iridescenceThicknessRange[ 1 ] = extension.iridescenceThicknessMaximum;

		}

		if ( extension.iridescenceThicknessTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'iridescenceThicknessMap', extension.iridescenceThicknessTexture ) );

		}

		return Promise.all( pending );

	}

}

/**
 * Sheen Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_sheen
 *
 * @private
 */
class GLTFMaterialsSheenExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_SHEEN;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const pending = [];

		materialParams.sheenColor = new Color( 0, 0, 0 );
		materialParams.sheenRoughness = 0;
		materialParams.sheen = 1;

		const extension = materialDef.extensions[ this.name ];

		if ( extension.sheenColorFactor !== undefined ) {

			const colorFactor = extension.sheenColorFactor;
			materialParams.sheenColor.setRGB( colorFactor[ 0 ], colorFactor[ 1 ], colorFactor[ 2 ], LinearSRGBColorSpace );

		}

		if ( extension.sheenRoughnessFactor !== undefined ) {

			materialParams.sheenRoughness = extension.sheenRoughnessFactor;

		}

		if ( extension.sheenColorTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'sheenColorMap', extension.sheenColorTexture, SRGBColorSpace ) );

		}

		if ( extension.sheenRoughnessTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'sheenRoughnessMap', extension.sheenRoughnessTexture ) );

		}

		return Promise.all( pending );

	}

}

/**
 * Transmission Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_transmission
 * Draft: https://github.com/KhronosGroup/glTF/pull/1698
 *
 * @private
 */
class GLTFMaterialsTransmissionExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_TRANSMISSION;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[ this.name ];

		if ( extension.transmissionFactor !== undefined ) {

			materialParams.transmission = extension.transmissionFactor;

		}

		if ( extension.transmissionTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'transmissionMap', extension.transmissionTexture ) );

		}

		return Promise.all( pending );

	}

}

/**
 * Materials Volume Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_volume
 *
 * @private
 */
class GLTFMaterialsVolumeExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_VOLUME;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[ this.name ];

		materialParams.thickness = extension.thicknessFactor !== undefined ? extension.thicknessFactor : 0;

		if ( extension.thicknessTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'thicknessMap', extension.thicknessTexture ) );

		}

		materialParams.attenuationDistance = extension.attenuationDistance || Infinity;

		const colorArray = extension.attenuationColor || [ 1, 1, 1 ];
		materialParams.attenuationColor = new Color().setRGB( colorArray[ 0 ], colorArray[ 1 ], colorArray[ 2 ], LinearSRGBColorSpace );

		return Promise.all( pending );

	}

}

/**
 * Materials ior Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_ior
 *
 * @private
 */
class GLTFMaterialsIorExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_IOR;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const extension = materialDef.extensions[ this.name ];

		materialParams.ior = extension.ior !== undefined ? extension.ior : 1.5;

		return Promise.resolve();

	}

}

/**
 * Materials specular Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_specular
 *
 * @private
 */
class GLTFMaterialsSpecularExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_SPECULAR;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[ this.name ];

		materialParams.specularIntensity = extension.specularFactor !== undefined ? extension.specularFactor : 1.0;

		if ( extension.specularTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'specularIntensityMap', extension.specularTexture ) );

		}

		const colorArray = extension.specularColorFactor || [ 1, 1, 1 ];
		materialParams.specularColor = new Color().setRGB( colorArray[ 0 ], colorArray[ 1 ], colorArray[ 2 ], LinearSRGBColorSpace );

		if ( extension.specularColorTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'specularColorMap', extension.specularColorTexture, SRGBColorSpace ) );

		}

		return Promise.all( pending );

	}

}


/**
 * Materials bump Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/EXT_materials_bump
 *
 * @private
 */
class GLTFMaterialsBumpExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.EXT_MATERIALS_BUMP;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[ this.name ];

		materialParams.bumpScale = extension.bumpFactor !== undefined ? extension.bumpFactor : 1.0;

		if ( extension.bumpTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'bumpMap', extension.bumpTexture ) );

		}

		return Promise.all( pending );

	}

}

/**
 * Materials anisotropy Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_anisotropy
 *
 * @private
 */
class GLTFMaterialsAnisotropyExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_ANISOTROPY;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[ this.name ];

		if ( extension.anisotropyStrength !== undefined ) {

			materialParams.anisotropy = extension.anisotropyStrength;

		}

		if ( extension.anisotropyRotation !== undefined ) {

			materialParams.anisotropyRotation = extension.anisotropyRotation;

		}

		if ( extension.anisotropyTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'anisotropyMap', extension.anisotropyTexture ) );

		}

		return Promise.all( pending );

	}

}

/**
 * BasisU Texture Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_texture_basisu
 *
 * @private
 */
class GLTFTextureBasisUExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_TEXTURE_BASISU;

	}

	loadTexture( textureIndex ) {

		const parser = this.parser;
		const json = parser.json;

		const textureDef = json.textures[ textureIndex ];

		if ( ! textureDef.extensions || ! textureDef.extensions[ this.name ] ) {

			return null;

		}

		const extension = textureDef.extensions[ this.name ];
		const loader = parser.options.ktx2Loader;

		if ( ! loader ) {

			if ( json.extensionsRequired && json.extensionsRequired.indexOf( this.name ) >= 0 ) {

				throw new Error( 'THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures' );

			} else {

				// Assumes that the extension is optional and that a fallback texture is present
				return null;

			}

		}

		return parser.loadTextureImage( textureIndex, extension.source, loader );

	}

}

/**
 * WebP Texture Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_texture_webp
 *
 * @private
 */
class GLTFTextureWebPExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.EXT_TEXTURE_WEBP;

	}

	loadTexture( textureIndex ) {

		const name = this.name;
		const parser = this.parser;
		const json = parser.json;

		const textureDef = json.textures[ textureIndex ];

		if ( ! textureDef.extensions || ! textureDef.extensions[ name ] ) {

			return null;

		}

		const extension = textureDef.extensions[ name ];
		const source = json.images[ extension.source ];

		let loader = parser.textureLoader;
		if ( source.uri ) {

			const handler = parser.options.manager.getHandler( source.uri );
			if ( handler !== null ) loader = handler;

		}

		return parser.loadTextureImage( textureIndex, extension.source, loader );

	}

}

/**
 * AVIF Texture Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_texture_avif
 *
 * @private
 */
class GLTFTextureAVIFExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.EXT_TEXTURE_AVIF;

	}

	loadTexture( textureIndex ) {

		const name = this.name;
		const parser = this.parser;
		const json = parser.json;

		const textureDef = json.textures[ textureIndex ];

		if ( ! textureDef.extensions || ! textureDef.extensions[ name ] ) {

			return null;

		}

		const extension = textureDef.extensions[ name ];
		const source = json.images[ extension.source ];

		let loader = parser.textureLoader;
		if ( source.uri ) {

			const handler = parser.options.manager.getHandler( source.uri );
			if ( handler !== null ) loader = handler;

		}

		return parser.loadTextureImage( textureIndex, extension.source, loader );

	}

}

/**
 * meshopt BufferView Compression Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_meshopt_compression
 *
 * @private
 */
class GLTFMeshoptCompression {

	constructor( parser ) {

		this.name = EXTENSIONS.EXT_MESHOPT_COMPRESSION;
		this.parser = parser;

	}

	loadBufferView( index ) {

		const json = this.parser.json;
		const bufferView = json.bufferViews[ index ];

		if ( bufferView.extensions && bufferView.extensions[ this.name ] ) {

			const extensionDef = bufferView.extensions[ this.name ];

			const buffer = this.parser.getDependency( 'buffer', extensionDef.buffer );
			const decoder = this.parser.options.meshoptDecoder;

			if ( ! decoder || ! decoder.supported ) {

				if ( json.extensionsRequired && json.extensionsRequired.indexOf( this.name ) >= 0 ) {

					throw new Error( 'THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files' );

				} else {

					// Assumes that the extension is optional and that fallback buffer data is present
					return null;

				}

			}

			return buffer.then( function ( res ) {

				const byteOffset = extensionDef.byteOffset || 0;
				const byteLength = extensionDef.byteLength || 0;

				const count = extensionDef.count;
				const stride = extensionDef.byteStride;

				const source = new Uint8Array( res, byteOffset, byteLength );

				if ( decoder.decodeGltfBufferAsync ) {

					return decoder.decodeGltfBufferAsync( count, stride, source, extensionDef.mode, extensionDef.filter ).then( function ( res ) {

						return res.buffer;

					} );

				} else {

					// Support for MeshoptDecoder 0.18 or earlier, without decodeGltfBufferAsync
					return decoder.ready.then( function () {

						const result = new ArrayBuffer( count * stride );
						decoder.decodeGltfBuffer( new Uint8Array( result ), count, stride, source, extensionDef.mode, extensionDef.filter );
						return result;

					} );

				}

			} );

		} else {

			return null;

		}

	}

}

/**
 * GPU Instancing Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_mesh_gpu_instancing
 *
 * @private
 */
class GLTFMeshGpuInstancing {

	constructor( parser ) {

		this.name = EXTENSIONS.EXT_MESH_GPU_INSTANCING;
		this.parser = parser;

	}

	createNodeMesh( nodeIndex ) {

		const json = this.parser.json;
		const nodeDef = json.nodes[ nodeIndex ];

		if ( ! nodeDef.extensions || ! nodeDef.extensions[ this.name ] ||
			nodeDef.mesh === undefined ) {

			return null;

		}

		const meshDef = json.meshes[ nodeDef.mesh ];

		// No Points or Lines + Instancing support yet

		for ( const primitive of meshDef.primitives ) {

			if ( primitive.mode !== WEBGL_CONSTANTS.TRIANGLES &&
				 primitive.mode !== WEBGL_CONSTANTS.TRIANGLE_STRIP &&
				 primitive.mode !== WEBGL_CONSTANTS.TRIANGLE_FAN &&
				 primitive.mode !== undefined ) {

				return null;

			}

		}

		const extensionDef = nodeDef.extensions[ this.name ];
		const attributesDef = extensionDef.attributes;

		// @TODO: Can we support InstancedMesh + SkinnedMesh?

		const pending = [];
		const attributes = {};

		for ( const key in attributesDef ) {

			pending.push( this.parser.getDependency( 'accessor', attributesDef[ key ] ).then( accessor => {

				attributes[ key ] = accessor;
				return attributes[ key ];

			} ) );

		}

		if ( pending.length < 1 ) {

			return null;

		}

		pending.push( this.parser.createNodeMesh( nodeIndex ) );

		return Promise.all( pending ).then( results => {

			const nodeObject = results.pop();
			const meshes = nodeObject.isGroup ? nodeObject.children : [ nodeObject ];
			const count = results[ 0 ].count; // All attribute counts should be same
			const instancedMeshes = [];

			for ( const mesh of meshes ) {

				// Temporal variables
				const m = new Matrix4();
				const p = new Vector3();
				const q = new Quaternion();
				const s = new Vector3( 1, 1, 1 );

				const instancedMesh = new InstancedMesh( mesh.geometry, mesh.material, count );

				for ( let i = 0; i < count; i ++ ) {

					if ( attributes.TRANSLATION ) {

						p.fromBufferAttribute( attributes.TRANSLATION, i );

					}

					if ( attributes.ROTATION ) {

						q.fromBufferAttribute( attributes.ROTATION, i );

					}

					if ( attributes.SCALE ) {

						s.fromBufferAttribute( attributes.SCALE, i );

					}

					instancedMesh.setMatrixAt( i, m.compose( p, q, s ) );

				}

				// Add instance attributes to the geometry, excluding TRS.
				for ( const attributeName in attributes ) {

					if ( attributeName === '_COLOR_0' ) {

						const attr = attributes[ attributeName ];
						instancedMesh.instanceColor = new InstancedBufferAttribute( attr.array, attr.itemSize, attr.normalized );

					} else if ( attributeName !== 'TRANSLATION' &&
						 attributeName !== 'ROTATION' &&
						 attributeName !== 'SCALE' ) {

						mesh.geometry.setAttribute( attributeName, attributes[ attributeName ] );

					}

				}

				// Just in case
				Object3D.prototype.copy.call( instancedMesh, mesh );

				this.parser.assignFinalMaterial( instancedMesh );

				instancedMeshes.push( instancedMesh );

			}

			if ( nodeObject.isGroup ) {

				nodeObject.clear();

				nodeObject.add( ... instancedMeshes );

				return nodeObject;

			}

			return instancedMeshes[ 0 ];

		} );

	}

}

/* BINARY EXTENSION */
const BINARY_EXTENSION_HEADER_MAGIC = 'glTF';
const BINARY_EXTENSION_HEADER_LENGTH = 12;
const BINARY_EXTENSION_CHUNK_TYPES = { JSON: 0x4E4F534A, BIN: 0x004E4942 };

class GLTFBinaryExtension {

	constructor( data ) {

		this.name = EXTENSIONS.KHR_BINARY_GLTF;
		this.content = null;
		this.body = null;

		const headerView = new DataView( data, 0, BINARY_EXTENSION_HEADER_LENGTH );
		const textDecoder = new TextDecoder();

		this.header = {
			magic: textDecoder.decode( new Uint8Array( data.slice( 0, 4 ) ) ),
			version: headerView.getUint32( 4, true ),
			length: headerView.getUint32( 8, true )
		};

		if ( this.header.magic !== BINARY_EXTENSION_HEADER_MAGIC ) {

			throw new Error( 'THREE.GLTFLoader: Unsupported glTF-Binary header.' );

		} else if ( this.header.version < 2.0 ) {

			throw new Error( 'THREE.GLTFLoader: Legacy binary file detected.' );

		}

		const chunkContentsLength = this.header.length - BINARY_EXTENSION_HEADER_LENGTH;
		const chunkView = new DataView( data, BINARY_EXTENSION_HEADER_LENGTH );
		let chunkIndex = 0;

		while ( chunkIndex < chunkContentsLength ) {

			const chunkLength = chunkView.getUint32( chunkIndex, true );
			chunkIndex += 4;

			const chunkType = chunkView.getUint32( chunkIndex, true );
			chunkIndex += 4;

			if ( chunkType === BINARY_EXTENSION_CHUNK_TYPES.JSON ) {

				const contentArray = new Uint8Array( data, BINARY_EXTENSION_HEADER_LENGTH + chunkIndex, chunkLength );
				this.content = textDecoder.decode( contentArray );

			} else if ( chunkType === BINARY_EXTENSION_CHUNK_TYPES.BIN ) {

				const byteOffset = BINARY_EXTENSION_HEADER_LENGTH + chunkIndex;
				this.body = data.slice( byteOffset, byteOffset + chunkLength );

			}

			// Clients must ignore chunks with unknown types.

			chunkIndex += chunkLength;

		}

		if ( this.content === null ) {

			throw new Error( 'THREE.GLTFLoader: JSON content not found.' );

		}

	}

}

/**
 * DRACO Mesh Compression Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_draco_mesh_compression
 *
 * @private
 */
class GLTFDracoMeshCompressionExtension {

	constructor( json, dracoLoader ) {

		if ( ! dracoLoader ) {

			throw new Error( 'THREE.GLTFLoader: No DRACOLoader instance provided.' );

		}

		this.name = EXTENSIONS.KHR_DRACO_MESH_COMPRESSION;
		this.json = json;
		this.dracoLoader = dracoLoader;
		this.dracoLoader.preload();

	}

	decodePrimitive( primitive, parser ) {

		const json = this.json;
		const dracoLoader = this.dracoLoader;
		const bufferViewIndex = primitive.extensions[ this.name ].bufferView;
		const gltfAttributeMap = primitive.extensions[ this.name ].attributes;
		const threeAttributeMap = {};
		const attributeNormalizedMap = {};
		const attributeTypeMap = {};

		for ( const attributeName in gltfAttributeMap ) {

			const threeAttributeName = ATTRIBUTES[ attributeName ] || attributeName.toLowerCase();

			threeAttributeMap[ threeAttributeName ] = gltfAttributeMap[ attributeName ];

		}

		for ( const attributeName in primitive.attributes ) {

			const threeAttributeName = ATTRIBUTES[ attributeName ] || attributeName.toLowerCase();

			if ( gltfAttributeMap[ attributeName ] !== undefined ) {

				const accessorDef = json.accessors[ primitive.attributes[ attributeName ] ];
				const componentType = WEBGL_COMPONENT_TYPES[ accessorDef.componentType ];

				attributeTypeMap[ threeAttributeName ] = componentType.name;
				attributeNormalizedMap[ threeAttributeName ] = accessorDef.normalized === true;

			}

		}

		return parser.getDependency( 'bufferView', bufferViewIndex ).then( function ( bufferView ) {

			return new Promise( function ( resolve, reject ) {

				dracoLoader.decodeDracoFile( bufferView, function ( geometry ) {

					for ( const attributeName in geometry.attributes ) {

						const attribute = geometry.attributes[ attributeName ];
						const normalized = attributeNormalizedMap[ attributeName ];

						if ( normalized !== undefined ) attribute.normalized = normalized;

					}

					resolve( geometry );

				}, threeAttributeMap, attributeTypeMap, LinearSRGBColorSpace, reject );

			} );

		} );

	}

}

/**
 * Texture Transform Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_texture_transform
 *
 * @private
 */
class GLTFTextureTransformExtension {

	constructor() {

		this.name = EXTENSIONS.KHR_TEXTURE_TRANSFORM;

	}

	extendTexture( texture, transform ) {

		if ( ( transform.texCoord === undefined || transform.texCoord === texture.channel )
			&& transform.offset === undefined
			&& transform.rotation === undefined
			&& transform.scale === undefined ) {

			// See https://github.com/mrdoob/three.js/issues/21819.
			return texture;

		}

		texture = texture.clone();

		if ( transform.texCoord !== undefined ) {

			texture.channel = transform.texCoord;

		}

		if ( transform.offset !== undefined ) {

			texture.offset.fromArray( transform.offset );

		}

		if ( transform.rotation !== undefined ) {

			texture.rotation = transform.rotation;

		}

		if ( transform.scale !== undefined ) {

			texture.repeat.fromArray( transform.scale );

		}

		texture.needsUpdate = true;

		return texture;

	}

}

/**
 * Mesh Quantization Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_mesh_quantization
 *
 * @private
 */
class GLTFMeshQuantizationExtension {

	constructor() {

		this.name = EXTENSIONS.KHR_MESH_QUANTIZATION;

	}

}

/*********************************/
/********** INTERPOLATION ********/
/*********************************/

// Spline Interpolation
// Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#appendix-c-spline-interpolation
class GLTFCubicSplineInterpolant extends Interpolant {

	constructor( parameterPositions, sampleValues, sampleSize, resultBuffer ) {

		super( parameterPositions, sampleValues, sampleSize, resultBuffer );

	}

	copySampleValue_( index ) {

		// Copies a sample value to the result buffer. See description of glTF
		// CUBICSPLINE values layout in interpolate_() function below.

		const result = this.resultBuffer,
			values = this.sampleValues,
			valueSize = this.valueSize,
			offset = index * valueSize * 3 + valueSize;

		for ( let i = 0; i !== valueSize; i ++ ) {

			result[ i ] = values[ offset + i ];

		}

		return result;

	}

	interpolate_( i1, t0, t, t1 ) {

		const result = this.resultBuffer;
		const values = this.sampleValues;
		const stride = this.valueSize;

		const stride2 = stride * 2;
		const stride3 = stride * 3;

		const td = t1 - t0;

		const p = ( t - t0 ) / td;
		const pp = p * p;
		const ppp = pp * p;

		const offset1 = i1 * stride3;
		const offset0 = offset1 - stride3;

		const s2 = - 2 * ppp + 3 * pp;
		const s3 = ppp - pp;
		const s0 = 1 - s2;
		const s1 = s3 - pp + p;

		// Layout of keyframe output values for CUBICSPLINE animations:
		//   [ inTangent_1, splineVertex_1, outTangent_1, inTangent_2, splineVertex_2, ... ]
		for ( let i = 0; i !== stride; i ++ ) {

			const p0 = values[ offset0 + i + stride ]; // splineVertex_k
			const m0 = values[ offset0 + i + stride2 ] * td; // outTangent_k * (t_k+1 - t_k)
			const p1 = values[ offset1 + i + stride ]; // splineVertex_k+1
			const m1 = values[ offset1 + i ] * td; // inTangent_k+1 * (t_k+1 - t_k)

			result[ i ] = s0 * p0 + s1 * m0 + s2 * p1 + s3 * m1;

		}

		return result;

	}

}

const _quaternion = new Quaternion();

class GLTFCubicSplineQuaternionInterpolant extends GLTFCubicSplineInterpolant {

	interpolate_( i1, t0, t, t1 ) {

		const result = super.interpolate_( i1, t0, t, t1 );

		_quaternion.fromArray( result ).normalize().toArray( result );

		return result;

	}

}


/*********************************/
/********** INTERNALS ************/
/*********************************/

/* CONSTANTS */

const WEBGL_CONSTANTS = {
	FLOAT: 5126,
	//FLOAT_MAT2: 35674,
	FLOAT_MAT3: 35675,
	FLOAT_MAT4: 35676,
	FLOAT_VEC2: 35664,
	FLOAT_VEC3: 35665,
	FLOAT_VEC4: 35666,
	LINEAR: 9729,
	REPEAT: 10497,
	SAMPLER_2D: 35678,
	POINTS: 0,
	LINES: 1,
	LINE_LOOP: 2,
	LINE_STRIP: 3,
	TRIANGLES: 4,
	TRIANGLE_STRIP: 5,
	TRIANGLE_FAN: 6,
	UNSIGNED_BYTE: 5121,
	UNSIGNED_SHORT: 5123
};

const WEBGL_COMPONENT_TYPES = {
	5120: Int8Array,
	5121: Uint8Array,
	5122: Int16Array,
	5123: Uint16Array,
	5125: Uint32Array,
	5126: Float32Array
};

const WEBGL_FILTERS = {
	9728: NearestFilter,
	9729: LinearFilter,
	9984: NearestMipmapNearestFilter,
	9985: LinearMipmapNearestFilter,
	9986: NearestMipmapLinearFilter,
	9987: LinearMipmapLinearFilter
};

const WEBGL_WRAPPINGS = {
	33071: ClampToEdgeWrapping,
	33648: MirroredRepeatWrapping,
	10497: RepeatWrapping
};

const WEBGL_TYPE_SIZES = {
	'SCALAR': 1,
	'VEC2': 2,
	'VEC3': 3,
	'VEC4': 4,
	'MAT2': 4,
	'MAT3': 9,
	'MAT4': 16
};

const ATTRIBUTES = {
	POSITION: 'position',
	NORMAL: 'normal',
	TANGENT: 'tangent',
	TEXCOORD_0: 'uv',
	TEXCOORD_1: 'uv1',
	TEXCOORD_2: 'uv2',
	TEXCOORD_3: 'uv3',
	COLOR_0: 'color',
	WEIGHTS_0: 'skinWeight',
	JOINTS_0: 'skinIndex',
};

const PATH_PROPERTIES = {
	scale: 'scale',
	translation: 'position',
	rotation: 'quaternion',
	weights: 'morphTargetInfluences'
};

const INTERPOLATION = {
	CUBICSPLINE: undefined, // We use a custom interpolant (GLTFCubicSplineInterpolation) for CUBICSPLINE tracks. Each
		                        // keyframe track will be initialized with a default interpolation type, then modified.
	LINEAR: InterpolateLinear,
	STEP: InterpolateDiscrete
};

const ALPHA_MODES = {
	OPAQUE: 'OPAQUE',
	MASK: 'MASK',
	BLEND: 'BLEND'
};

/**
 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#default-material
 *
 * @private
 * @param {Object<string, Material>} cache
 * @return {Material}
 */
function createDefaultMaterial( cache ) {

	if ( cache[ 'DefaultMaterial' ] === undefined ) {

		cache[ 'DefaultMaterial' ] = new MeshStandardMaterial( {
			color: 0xFFFFFF,
			emissive: 0x000000,
			metalness: 1,
			roughness: 1,
			transparent: false,
			depthTest: true,
			side: FrontSide
		} );

	}

	return cache[ 'DefaultMaterial' ];

}

function addUnknownExtensionsToUserData( knownExtensions, object, objectDef ) {

	// Add unknown glTF extensions to an object's userData.

	for ( const name in objectDef.extensions ) {

		if ( knownExtensions[ name ] === undefined ) {

			object.userData.gltfExtensions = object.userData.gltfExtensions || {};
			object.userData.gltfExtensions[ name ] = objectDef.extensions[ name ];

		}

	}

}

/**
 *
 * @private
 * @param {Object3D|Material|BufferGeometry|Object|AnimationClip} object
 * @param {GLTF.definition} gltfDef
 */
function assignExtrasToUserData( object, gltfDef ) {

	if ( gltfDef.extras !== undefined ) {

		if ( typeof gltfDef.extras === 'object' ) {

			Object.assign( object.userData, gltfDef.extras );

		} else {

			console.warn( 'THREE.GLTFLoader: Ignoring primitive type .extras, ' + gltfDef.extras );

		}

	}

}

/**
 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#morph-targets
 *
 * @private
 * @param {BufferGeometry} geometry
 * @param {Array<GLTF.Target>} targets
 * @param {GLTFParser} parser
 * @return {Promise<BufferGeometry>}
 */
function addMorphTargets( geometry, targets, parser ) {

	let hasMorphPosition = false;
	let hasMorphNormal = false;
	let hasMorphColor = false;

	for ( let i = 0, il = targets.length; i < il; i ++ ) {

		const target = targets[ i ];

		if ( target.POSITION !== undefined ) hasMorphPosition = true;
		if ( target.NORMAL !== undefined ) hasMorphNormal = true;
		if ( target.COLOR_0 !== undefined ) hasMorphColor = true;

		if ( hasMorphPosition && hasMorphNormal && hasMorphColor ) break;

	}

	if ( ! hasMorphPosition && ! hasMorphNormal && ! hasMorphColor ) return Promise.resolve( geometry );

	const pendingPositionAccessors = [];
	const pendingNormalAccessors = [];
	const pendingColorAccessors = [];

	for ( let i = 0, il = targets.length; i < il; i ++ ) {

		const target = targets[ i ];

		if ( hasMorphPosition ) {

			const pendingAccessor = target.POSITION !== undefined
				? parser.getDependency( 'accessor', target.POSITION )
				: geometry.attributes.position;

			pendingPositionAccessors.push( pendingAccessor );

		}

		if ( hasMorphNormal ) {

			const pendingAccessor = target.NORMAL !== undefined
				? parser.getDependency( 'accessor', target.NORMAL )
				: geometry.attributes.normal;

			pendingNormalAccessors.push( pendingAccessor );

		}

		if ( hasMorphColor ) {

			const pendingAccessor = target.COLOR_0 !== undefined
				? parser.getDependency( 'accessor', target.COLOR_0 )
				: geometry.attributes.color;

			pendingColorAccessors.push( pendingAccessor );

		}

	}

	return Promise.all( [
		Promise.all( pendingPositionAccessors ),
		Promise.all( pendingNormalAccessors ),
		Promise.all( pendingColorAccessors )
	] ).then( function ( accessors ) {

		const morphPositions = accessors[ 0 ];
		const morphNormals = accessors[ 1 ];
		const morphColors = accessors[ 2 ];

		if ( hasMorphPosition ) geometry.morphAttributes.position = morphPositions;
		if ( hasMorphNormal ) geometry.morphAttributes.normal = morphNormals;
		if ( hasMorphColor ) geometry.morphAttributes.color = morphColors;
		geometry.morphTargetsRelative = true;

		return geometry;

	} );

}

/**
 *
 * @private
 * @param {Mesh} mesh
 * @param {GLTF.Mesh} meshDef
 */
function updateMorphTargets( mesh, meshDef ) {

	mesh.updateMorphTargets();

	if ( meshDef.weights !== undefined ) {

		for ( let i = 0, il = meshDef.weights.length; i < il; i ++ ) {

			mesh.morphTargetInfluences[ i ] = meshDef.weights[ i ];

		}

	}

	// .extras has user-defined data, so check that .extras.targetNames is an array.
	if ( meshDef.extras && Array.isArray( meshDef.extras.targetNames ) ) {

		const targetNames = meshDef.extras.targetNames;

		if ( mesh.morphTargetInfluences.length === targetNames.length ) {

			mesh.morphTargetDictionary = {};

			for ( let i = 0, il = targetNames.length; i < il; i ++ ) {

				mesh.morphTargetDictionary[ targetNames[ i ] ] = i;

			}

		} else {

			console.warn( 'THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.' );

		}

	}

}

function createPrimitiveKey( primitiveDef ) {

	let geometryKey;

	const dracoExtension = primitiveDef.extensions && primitiveDef.extensions[ EXTENSIONS.KHR_DRACO_MESH_COMPRESSION ];

	if ( dracoExtension ) {

		geometryKey = 'draco:' + dracoExtension.bufferView
				+ ':' + dracoExtension.indices
				+ ':' + createAttributesKey( dracoExtension.attributes );

	} else {

		geometryKey = primitiveDef.indices + ':' + createAttributesKey( primitiveDef.attributes ) + ':' + primitiveDef.mode;

	}

	if ( primitiveDef.targets !== undefined ) {

		for ( let i = 0, il = primitiveDef.targets.length; i < il; i ++ ) {

			geometryKey += ':' + createAttributesKey( primitiveDef.targets[ i ] );

		}

	}

	return geometryKey;

}

function createAttributesKey( attributes ) {

	let attributesKey = '';

	const keys = Object.keys( attributes ).sort();

	for ( let i = 0, il = keys.length; i < il; i ++ ) {

		attributesKey += keys[ i ] + ':' + attributes[ keys[ i ] ] + ';';

	}

	return attributesKey;

}

function getNormalizedComponentScale( constructor ) {

	// Reference:
	// https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_mesh_quantization#encoding-quantized-data

	switch ( constructor ) {

		case Int8Array:
			return 1 / 127;

		case Uint8Array:
			return 1 / 255;

		case Int16Array:
			return 1 / 32767;

		case Uint16Array:
			return 1 / 65535;

		default:
			throw new Error( 'THREE.GLTFLoader: Unsupported normalized accessor component type.' );

	}

}

function getImageURIMimeType( uri ) {

	if ( uri.search( /\.jpe?g($|\?)/i ) > 0 || uri.search( /^data\:image\/jpeg/ ) === 0 ) return 'image/jpeg';
	if ( uri.search( /\.webp($|\?)/i ) > 0 || uri.search( /^data\:image\/webp/ ) === 0 ) return 'image/webp';
	if ( uri.search( /\.ktx2($|\?)/i ) > 0 || uri.search( /^data\:image\/ktx2/ ) === 0 ) return 'image/ktx2';

	return 'image/png';

}

const _identityMatrix = new Matrix4();

/* GLTF PARSER */

class GLTFParser {

	constructor( json = {}, options = {} ) {

		this.json = json;
		this.extensions = {};
		this.plugins = {};
		this.options = options;

		// loader object cache
		this.cache = new GLTFRegistry();

		// associations between Three.js objects and glTF elements
		this.associations = new Map();

		// BufferGeometry caching
		this.primitiveCache = {};

		// Node cache
		this.nodeCache = {};

		// Object3D instance caches
		this.meshCache = { refs: {}, uses: {} };
		this.cameraCache = { refs: {}, uses: {} };
		this.lightCache = { refs: {}, uses: {} };

		this.sourceCache = {};
		this.textureCache = {};

		// Track node names, to ensure no duplicates
		this.nodeNamesUsed = {};

		// Use an ImageBitmapLoader if imageBitmaps are supported. Moves much of the
		// expensive work of uploading a texture to the GPU off the main thread.

		let isSafari = false;
		let safariVersion = - 1;
		let isFirefox = false;
		let firefoxVersion = - 1;

		if ( typeof navigator !== 'undefined' ) {

			const userAgent = navigator.userAgent;

			isSafari = /^((?!chrome|android).)*safari/i.test( userAgent ) === true;
			const safariMatch = userAgent.match( /Version\/(\d+)/ );
			safariVersion = isSafari && safariMatch ? parseInt( safariMatch[ 1 ], 10 ) : - 1;

			isFirefox = userAgent.indexOf( 'Firefox' ) > - 1;
			firefoxVersion = isFirefox ? userAgent.match( /Firefox\/([0-9]+)\./ )[ 1 ] : - 1;

		}

		if ( typeof createImageBitmap === 'undefined' || ( isSafari && safariVersion < 17 ) || ( isFirefox && firefoxVersion < 98 ) ) {

			this.textureLoader = new TextureLoader( this.options.manager );

		} else {

			this.textureLoader = new ImageBitmapLoader( this.options.manager );

		}

		this.textureLoader.setCrossOrigin( this.options.crossOrigin );
		this.textureLoader.setRequestHeader( this.options.requestHeader );

		this.fileLoader = new FileLoader( this.options.manager );
		this.fileLoader.setResponseType( 'arraybuffer' );

		if ( this.options.crossOrigin === 'use-credentials' ) {

			this.fileLoader.setWithCredentials( true );

		}

	}

	setExtensions( extensions ) {

		this.extensions = extensions;

	}

	setPlugins( plugins ) {

		this.plugins = plugins;

	}

	parse( onLoad, onError ) {

		const parser = this;
		const json = this.json;
		const extensions = this.extensions;

		// Clear the loader cache
		this.cache.removeAll();
		this.nodeCache = {};

		// Mark the special nodes/meshes in json for efficient parse
		this._invokeAll( function ( ext ) {

			return ext._markDefs && ext._markDefs();

		} );

		Promise.all( this._invokeAll( function ( ext ) {

			return ext.beforeRoot && ext.beforeRoot();

		} ) ).then( function () {

			return Promise.all( [

				parser.getDependencies( 'scene' ),
				parser.getDependencies( 'animation' ),
				parser.getDependencies( 'camera' ),

			] );

		} ).then( function ( dependencies ) {

			const result = {
				scene: dependencies[ 0 ][ json.scene || 0 ],
				scenes: dependencies[ 0 ],
				animations: dependencies[ 1 ],
				cameras: dependencies[ 2 ],
				asset: json.asset,
				parser: parser,
				userData: {}
			};

			addUnknownExtensionsToUserData( extensions, result, json );

			assignExtrasToUserData( result, json );

			return Promise.all( parser._invokeAll( function ( ext ) {

				return ext.afterRoot && ext.afterRoot( result );

			} ) ).then( function () {

				for ( const scene of result.scenes ) {

					scene.updateMatrixWorld();

				}

				onLoad( result );

			} );

		} ).catch( onError );

	}

	/**
	 * Marks the special nodes/meshes in json for efficient parse.
	 *
	 * @private
	 */
	_markDefs() {

		const nodeDefs = this.json.nodes || [];
		const skinDefs = this.json.skins || [];
		const meshDefs = this.json.meshes || [];

		// Nothing in the node definition indicates whether it is a Bone or an
		// Object3D. Use the skins' joint references to mark bones.
		for ( let skinIndex = 0, skinLength = skinDefs.length; skinIndex < skinLength; skinIndex ++ ) {

			const joints = skinDefs[ skinIndex ].joints;

			for ( let i = 0, il = joints.length; i < il; i ++ ) {

				nodeDefs[ joints[ i ] ].isBone = true;

			}

		}

		// Iterate over all nodes, marking references to shared resources,
		// as well as skeleton joints.
		for ( let nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex ++ ) {

			const nodeDef = nodeDefs[ nodeIndex ];

			if ( nodeDef.mesh !== undefined ) {

				this._addNodeRef( this.meshCache, nodeDef.mesh );

				// Nothing in the mesh definition indicates whether it is
				// a SkinnedMesh or Mesh. Use the node's mesh reference
				// to mark SkinnedMesh if node has skin.
				if ( nodeDef.skin !== undefined ) {

					meshDefs[ nodeDef.mesh ].isSkinnedMesh = true;

				}

			}

			if ( nodeDef.camera !== undefined ) {

				this._addNodeRef( this.cameraCache, nodeDef.camera );

			}

		}

	}

	/**
	 * Counts references to shared node / Object3D resources. These resources
	 * can be reused, or "instantiated", at multiple nodes in the scene
	 * hierarchy. Mesh, Camera, and Light instances are instantiated and must
	 * be marked. Non-scenegraph resources (like Materials, Geometries, and
	 * Textures) can be reused directly and are not marked here.
	 *
	 * Example: CesiumMilkTruck sample model reuses "Wheel" meshes.
	 *
	 * @private
	 * @param {Object} cache
	 * @param {Object3D} index
	 */
	_addNodeRef( cache, index ) {

		if ( index === undefined ) return;

		if ( cache.refs[ index ] === undefined ) {

			cache.refs[ index ] = cache.uses[ index ] = 0;

		}

		cache.refs[ index ] ++;

	}

	/**
	 * Returns a reference to a shared resource, cloning it if necessary.
	 *
	 * @private
	 * @param {Object} cache
	 * @param {number} index
	 * @param {Object} object
	 * @return {Object}
	 */
	_getNodeRef( cache, index, object ) {

		if ( cache.refs[ index ] <= 1 ) return object;

		const ref = object.clone();

		// Propagates mappings to the cloned object, prevents mappings on the
		// original object from being lost.
		const updateMappings = ( original, clone ) => {

			const mappings = this.associations.get( original );
			if ( mappings != null ) {

				this.associations.set( clone, mappings );

			}

			for ( const [ i, child ] of original.children.entries() ) {

				updateMappings( child, clone.children[ i ] );

			}

		};

		updateMappings( object, ref );

		ref.name += '_instance_' + ( cache.uses[ index ] ++ );

		return ref;

	}

	_invokeOne( func ) {

		const extensions = Object.values( this.plugins );
		extensions.push( this );

		for ( let i = 0; i < extensions.length; i ++ ) {

			const result = func( extensions[ i ] );

			if ( result ) return result;

		}

		return null;

	}

	_invokeAll( func ) {

		const extensions = Object.values( this.plugins );
		extensions.unshift( this );

		const pending = [];

		for ( let i = 0; i < extensions.length; i ++ ) {

			const result = func( extensions[ i ] );

			if ( result ) pending.push( result );

		}

		return pending;

	}

	/**
	 * Requests the specified dependency asynchronously, with caching.
	 *
	 * @private
	 * @param {string} type
	 * @param {number} index
	 * @return {Promise<Object3D|Material|Texture|AnimationClip|ArrayBuffer|Object>}
	 */
	getDependency( type, index ) {

		const cacheKey = type + ':' + index;
		let dependency = this.cache.get( cacheKey );

		if ( ! dependency ) {

			switch ( type ) {

				case 'scene':
					dependency = this.loadScene( index );
					break;

				case 'node':
					dependency = this._invokeOne( function ( ext ) {

						return ext.loadNode && ext.loadNode( index );

					} );
					break;

				case 'mesh':
					dependency = this._invokeOne( function ( ext ) {

						return ext.loadMesh && ext.loadMesh( index );

					} );
					break;

				case 'accessor':
					dependency = this.loadAccessor( index );
					break;

				case 'bufferView':
					dependency = this._invokeOne( function ( ext ) {

						return ext.loadBufferView && ext.loadBufferView( index );

					} );
					break;

				case 'buffer':
					dependency = this.loadBuffer( index );
					break;

				case 'material':
					dependency = this._invokeOne( function ( ext ) {

						return ext.loadMaterial && ext.loadMaterial( index );

					} );
					break;

				case 'texture':
					dependency = this._invokeOne( function ( ext ) {

						return ext.loadTexture && ext.loadTexture( index );

					} );
					break;

				case 'skin':
					dependency = this.loadSkin( index );
					break;

				case 'animation':
					dependency = this._invokeOne( function ( ext ) {

						return ext.loadAnimation && ext.loadAnimation( index );

					} );
					break;

				case 'camera':
					dependency = this.loadCamera( index );
					break;

				default:
					dependency = this._invokeOne( function ( ext ) {

						return ext != this && ext.getDependency && ext.getDependency( type, index );

					} );

					if ( ! dependency ) {

						throw new Error( 'Unknown type: ' + type );

					}

					break;

			}

			this.cache.add( cacheKey, dependency );

		}

		return dependency;

	}

	/**
	 * Requests all dependencies of the specified type asynchronously, with caching.
	 *
	 * @private
	 * @param {string} type
	 * @return {Promise<Array<Object>>}
	 */
	getDependencies( type ) {

		let dependencies = this.cache.get( type );

		if ( ! dependencies ) {

			const parser = this;
			const defs = this.json[ type + ( type === 'mesh' ? 'es' : 's' ) ] || [];

			dependencies = Promise.all( defs.map( function ( def, index ) {

				return parser.getDependency( type, index );

			} ) );

			this.cache.add( type, dependencies );

		}

		return dependencies;

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
	 *
	 * @private
	 * @param {number} bufferIndex
	 * @return {Promise<ArrayBuffer>}
	 */
	loadBuffer( bufferIndex ) {

		const bufferDef = this.json.buffers[ bufferIndex ];
		const loader = this.fileLoader;

		if ( bufferDef.type && bufferDef.type !== 'arraybuffer' ) {

			throw new Error( 'THREE.GLTFLoader: ' + bufferDef.type + ' buffer type is not supported.' );

		}

		// If present, GLB container is required to be the first buffer.
		if ( bufferDef.uri === undefined && bufferIndex === 0 ) {

			return Promise.resolve( this.extensions[ EXTENSIONS.KHR_BINARY_GLTF ].body );

		}

		const options = this.options;

		return new Promise( function ( resolve, reject ) {

			loader.load( LoaderUtils.resolveURL( bufferDef.uri, options.path ), resolve, undefined, function () {

				reject( new Error( 'THREE.GLTFLoader: Failed to load buffer "' + bufferDef.uri + '".' ) );

			} );

		} );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
	 *
	 * @private
	 * @param {number} bufferViewIndex
	 * @return {Promise<ArrayBuffer>}
	 */
	loadBufferView( bufferViewIndex ) {

		const bufferViewDef = this.json.bufferViews[ bufferViewIndex ];

		return this.getDependency( 'buffer', bufferViewDef.buffer ).then( function ( buffer ) {

			const byteLength = bufferViewDef.byteLength || 0;
			const byteOffset = bufferViewDef.byteOffset || 0;
			return buffer.slice( byteOffset, byteOffset + byteLength );

		} );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
	 *
	 * @private
	 * @param {number} accessorIndex
	 * @return {Promise<BufferAttribute|InterleavedBufferAttribute>}
	 */
	loadAccessor( accessorIndex ) {

		const parser = this;
		const json = this.json;

		const accessorDef = this.json.accessors[ accessorIndex ];

		if ( accessorDef.bufferView === undefined && accessorDef.sparse === undefined ) {

			const itemSize = WEBGL_TYPE_SIZES[ accessorDef.type ];
			const TypedArray = WEBGL_COMPONENT_TYPES[ accessorDef.componentType ];
			const normalized = accessorDef.normalized === true;

			const array = new TypedArray( accessorDef.count * itemSize );
			return Promise.resolve( new BufferAttribute( array, itemSize, normalized ) );

		}

		const pendingBufferViews = [];

		if ( accessorDef.bufferView !== undefined ) {

			pendingBufferViews.push( this.getDependency( 'bufferView', accessorDef.bufferView ) );

		} else {

			pendingBufferViews.push( null );

		}

		if ( accessorDef.sparse !== undefined ) {

			pendingBufferViews.push( this.getDependency( 'bufferView', accessorDef.sparse.indices.bufferView ) );
			pendingBufferViews.push( this.getDependency( 'bufferView', accessorDef.sparse.values.bufferView ) );

		}

		return Promise.all( pendingBufferViews ).then( function ( bufferViews ) {

			const bufferView = bufferViews[ 0 ];

			const itemSize = WEBGL_TYPE_SIZES[ accessorDef.type ];
			const TypedArray = WEBGL_COMPONENT_TYPES[ accessorDef.componentType ];

			// For VEC3: itemSize is 3, elementBytes is 4, itemBytes is 12.
			const elementBytes = TypedArray.BYTES_PER_ELEMENT;
			const itemBytes = elementBytes * itemSize;
			const byteOffset = accessorDef.byteOffset || 0;
			const byteStride = accessorDef.bufferView !== undefined ? json.bufferViews[ accessorDef.bufferView ].byteStride : undefined;
			const normalized = accessorDef.normalized === true;
			let array, bufferAttribute;

			// The buffer is not interleaved if the stride is the item size in bytes.
			if ( byteStride && byteStride !== itemBytes ) {

				// Each "slice" of the buffer, as defined by 'count' elements of 'byteStride' bytes, gets its own InterleavedBuffer
				// This makes sure that IBA.count reflects accessor.count properly
				const ibSlice = Math.floor( byteOffset / byteStride );
				const ibCacheKey = 'InterleavedBuffer:' + accessorDef.bufferView + ':' + accessorDef.componentType + ':' + ibSlice + ':' + accessorDef.count;
				let ib = parser.cache.get( ibCacheKey );

				if ( ! ib ) {

					array = new TypedArray( bufferView, ibSlice * byteStride, accessorDef.count * byteStride / elementBytes );

					// Integer parameters to IB/IBA are in array elements, not bytes.
					ib = new InterleavedBuffer( array, byteStride / elementBytes );

					parser.cache.add( ibCacheKey, ib );

				}

				bufferAttribute = new InterleavedBufferAttribute( ib, itemSize, ( byteOffset % byteStride ) / elementBytes, normalized );

			} else {

				if ( bufferView === null ) {

					array = new TypedArray( accessorDef.count * itemSize );

				} else {

					array = new TypedArray( bufferView, byteOffset, accessorDef.count * itemSize );

				}

				bufferAttribute = new BufferAttribute( array, itemSize, normalized );

			}

			// https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#sparse-accessors
			if ( accessorDef.sparse !== undefined ) {

				const itemSizeIndices = WEBGL_TYPE_SIZES.SCALAR;
				const TypedArrayIndices = WEBGL_COMPONENT_TYPES[ accessorDef.sparse.indices.componentType ];

				const byteOffsetIndices = accessorDef.sparse.indices.byteOffset || 0;
				const byteOffsetValues = accessorDef.sparse.values.byteOffset || 0;

				const sparseIndices = new TypedArrayIndices( bufferViews[ 1 ], byteOffsetIndices, accessorDef.sparse.count * itemSizeIndices );
				const sparseValues = new TypedArray( bufferViews[ 2 ], byteOffsetValues, accessorDef.sparse.count * itemSize );

				if ( bufferView !== null ) {

					// Avoid modifying the original ArrayBuffer, if the bufferView wasn't initialized with zeroes.
					bufferAttribute = new BufferAttribute( bufferAttribute.array.slice(), bufferAttribute.itemSize, bufferAttribute.normalized );

				}

				// Ignore normalized since we copy from sparse
				bufferAttribute.normalized = false;

				for ( let i = 0, il = sparseIndices.length; i < il; i ++ ) {

					const index = sparseIndices[ i ];

					bufferAttribute.setX( index, sparseValues[ i * itemSize ] );
					if ( itemSize >= 2 ) bufferAttribute.setY( index, sparseValues[ i * itemSize + 1 ] );
					if ( itemSize >= 3 ) bufferAttribute.setZ( index, sparseValues[ i * itemSize + 2 ] );
					if ( itemSize >= 4 ) bufferAttribute.setW( index, sparseValues[ i * itemSize + 3 ] );
					if ( itemSize >= 5 ) throw new Error( 'THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.' );

				}

				bufferAttribute.normalized = normalized;

			}

			return bufferAttribute;

		} );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
	 *
	 * @private
	 * @param {number} textureIndex
	 * @return {Promise<?Texture>}
	 */
	loadTexture( textureIndex ) {

		const json = this.json;
		const options = this.options;
		const textureDef = json.textures[ textureIndex ];
		const sourceIndex = textureDef.source;
		const sourceDef = json.images[ sourceIndex ];

		let loader = this.textureLoader;

		if ( sourceDef.uri ) {

			const handler = options.manager.getHandler( sourceDef.uri );
			if ( handler !== null ) loader = handler;

		}

		return this.loadTextureImage( textureIndex, sourceIndex, loader );

	}

	loadTextureImage( textureIndex, sourceIndex, loader ) {

		const parser = this;
		const json = this.json;

		const textureDef = json.textures[ textureIndex ];
		const sourceDef = json.images[ sourceIndex ];

		const cacheKey = ( sourceDef.uri || sourceDef.bufferView ) + ':' + textureDef.sampler;

		if ( this.textureCache[ cacheKey ] ) {

			// See https://github.com/mrdoob/three.js/issues/21559.
			return this.textureCache[ cacheKey ];

		}

		const promise = this.loadImageSource( sourceIndex, loader ).then( function ( texture ) {

			texture.flipY = false;

			texture.name = textureDef.name || sourceDef.name || '';

			if ( texture.name === '' && typeof sourceDef.uri === 'string' && sourceDef.uri.startsWith( 'data:image/' ) === false ) {

				texture.name = sourceDef.uri;

			}

			const samplers = json.samplers || {};
			const sampler = samplers[ textureDef.sampler ] || {};

			texture.magFilter = WEBGL_FILTERS[ sampler.magFilter ] || LinearFilter;
			texture.minFilter = WEBGL_FILTERS[ sampler.minFilter ] || LinearMipmapLinearFilter;
			texture.wrapS = WEBGL_WRAPPINGS[ sampler.wrapS ] || RepeatWrapping;
			texture.wrapT = WEBGL_WRAPPINGS[ sampler.wrapT ] || RepeatWrapping;
			texture.generateMipmaps = ! texture.isCompressedTexture && texture.minFilter !== NearestFilter && texture.minFilter !== LinearFilter;

			parser.associations.set( texture, { textures: textureIndex } );

			return texture;

		} ).catch( function () {

			return null;

		} );

		this.textureCache[ cacheKey ] = promise;

		return promise;

	}

	loadImageSource( sourceIndex, loader ) {

		const parser = this;
		const json = this.json;
		const options = this.options;

		if ( this.sourceCache[ sourceIndex ] !== undefined ) {

			return this.sourceCache[ sourceIndex ].then( ( texture ) => texture.clone() );

		}

		const sourceDef = json.images[ sourceIndex ];

		const URL = self.URL || self.webkitURL;

		let sourceURI = sourceDef.uri || '';
		let isObjectURL = false;

		if ( sourceDef.bufferView !== undefined ) {

			// Load binary image data from bufferView, if provided.

			sourceURI = parser.getDependency( 'bufferView', sourceDef.bufferView ).then( function ( bufferView ) {

				isObjectURL = true;
				const blob = new Blob( [ bufferView ], { type: sourceDef.mimeType } );
				sourceURI = URL.createObjectURL( blob );
				return sourceURI;

			} );

		} else if ( sourceDef.uri === undefined ) {

			throw new Error( 'THREE.GLTFLoader: Image ' + sourceIndex + ' is missing URI and bufferView' );

		}

		const promise = Promise.resolve( sourceURI ).then( function ( sourceURI ) {

			return new Promise( function ( resolve, reject ) {

				let onLoad = resolve;

				if ( loader.isImageBitmapLoader === true ) {

					onLoad = function ( imageBitmap ) {

						const texture = new Texture( imageBitmap );
						texture.needsUpdate = true;

						resolve( texture );

					};

				}

				loader.load( LoaderUtils.resolveURL( sourceURI, options.path ), onLoad, undefined, reject );

			} );

		} ).then( function ( texture ) {

			// Clean up resources and configure Texture.

			if ( isObjectURL === true ) {

				URL.revokeObjectURL( sourceURI );

			}

			assignExtrasToUserData( texture, sourceDef );

			texture.userData.mimeType = sourceDef.mimeType || getImageURIMimeType( sourceDef.uri );

			return texture;

		} ).catch( function ( error ) {

			console.error( 'THREE.GLTFLoader: Couldn\'t load texture', sourceURI );
			throw error;

		} );

		this.sourceCache[ sourceIndex ] = promise;
		return promise;

	}

	/**
	 * Asynchronously assigns a texture to the given material parameters.
	 *
	 * @private
	 * @param {Object} materialParams
	 * @param {string} mapName
	 * @param {Object} mapDef
	 * @param {string} [colorSpace]
	 * @return {Promise<Texture>}
	 */
	assignTexture( materialParams, mapName, mapDef, colorSpace ) {

		const parser = this;

		return this.getDependency( 'texture', mapDef.index ).then( function ( texture ) {

			if ( ! texture ) return null;

			if ( mapDef.texCoord !== undefined && mapDef.texCoord > 0 ) {

				texture = texture.clone();
				texture.channel = mapDef.texCoord;

			}

			if ( parser.extensions[ EXTENSIONS.KHR_TEXTURE_TRANSFORM ] ) {

				const transform = mapDef.extensions !== undefined ? mapDef.extensions[ EXTENSIONS.KHR_TEXTURE_TRANSFORM ] : undefined;

				if ( transform ) {

					const gltfReference = parser.associations.get( texture );
					texture = parser.extensions[ EXTENSIONS.KHR_TEXTURE_TRANSFORM ].extendTexture( texture, transform );
					parser.associations.set( texture, gltfReference );

				}

			}

			if ( colorSpace !== undefined ) {

				texture.colorSpace = colorSpace;

			}

			materialParams[ mapName ] = texture;

			return texture;

		} );

	}

	/**
	 * Assigns final material to a Mesh, Line, or Points instance. The instance
	 * already has a material (generated from the glTF material options alone)
	 * but reuse of the same glTF material may require multiple threejs materials
	 * to accommodate different primitive types, defines, etc. New materials will
	 * be created if necessary, and reused from a cache.
	 *
	 * @private
	 * @param {Object3D} mesh Mesh, Line, or Points instance.
	 */
	assignFinalMaterial( mesh ) {

		const geometry = mesh.geometry;
		let material = mesh.material;

		const useDerivativeTangents = geometry.attributes.tangent === undefined;
		const useVertexColors = geometry.attributes.color !== undefined;
		const useFlatShading = geometry.attributes.normal === undefined;

		if ( mesh.isPoints ) {

			const cacheKey = 'PointsMaterial:' + material.uuid;

			let pointsMaterial = this.cache.get( cacheKey );

			if ( ! pointsMaterial ) {

				pointsMaterial = new PointsMaterial();
				Material.prototype.copy.call( pointsMaterial, material );
				pointsMaterial.color.copy( material.color );
				pointsMaterial.map = material.map;
				pointsMaterial.sizeAttenuation = false; // glTF spec says points should be 1px

				this.cache.add( cacheKey, pointsMaterial );

			}

			material = pointsMaterial;

		} else if ( mesh.isLine ) {

			const cacheKey = 'LineBasicMaterial:' + material.uuid;

			let lineMaterial = this.cache.get( cacheKey );

			if ( ! lineMaterial ) {

				lineMaterial = new LineBasicMaterial();
				Material.prototype.copy.call( lineMaterial, material );
				lineMaterial.color.copy( material.color );
				lineMaterial.map = material.map;

				this.cache.add( cacheKey, lineMaterial );

			}

			material = lineMaterial;

		}

		// Clone the material if it will be modified
		if ( useDerivativeTangents || useVertexColors || useFlatShading ) {

			let cacheKey = 'ClonedMaterial:' + material.uuid + ':';

			if ( useDerivativeTangents ) cacheKey += 'derivative-tangents:';
			if ( useVertexColors ) cacheKey += 'vertex-colors:';
			if ( useFlatShading ) cacheKey += 'flat-shading:';

			let cachedMaterial = this.cache.get( cacheKey );

			if ( ! cachedMaterial ) {

				cachedMaterial = material.clone();

				if ( useVertexColors ) cachedMaterial.vertexColors = true;
				if ( useFlatShading ) cachedMaterial.flatShading = true;

				if ( useDerivativeTangents ) {

					// https://github.com/mrdoob/three.js/issues/11438#issuecomment-507003995
					if ( cachedMaterial.normalScale ) cachedMaterial.normalScale.y *= - 1;
					if ( cachedMaterial.clearcoatNormalScale ) cachedMaterial.clearcoatNormalScale.y *= - 1;

				}

				this.cache.add( cacheKey, cachedMaterial );

				this.associations.set( cachedMaterial, this.associations.get( material ) );

			}

			material = cachedMaterial;

		}

		mesh.material = material;

	}

	getMaterialType( /* materialIndex */ ) {

		return MeshStandardMaterial;

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
	 *
	 * @private
	 * @param {number} materialIndex
	 * @return {Promise<Material>}
	 */
	loadMaterial( materialIndex ) {

		const parser = this;
		const json = this.json;
		const extensions = this.extensions;
		const materialDef = json.materials[ materialIndex ];

		let materialType;
		const materialParams = {};
		const materialExtensions = materialDef.extensions || {};

		const pending = [];

		if ( materialExtensions[ EXTENSIONS.KHR_MATERIALS_UNLIT ] ) {

			const kmuExtension = extensions[ EXTENSIONS.KHR_MATERIALS_UNLIT ];
			materialType = kmuExtension.getMaterialType();
			pending.push( kmuExtension.extendParams( materialParams, materialDef, parser ) );

		} else {

			// Specification:
			// https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#metallic-roughness-material

			const metallicRoughness = materialDef.pbrMetallicRoughness || {};

			materialParams.color = new Color( 1.0, 1.0, 1.0 );
			materialParams.opacity = 1.0;

			if ( Array.isArray( metallicRoughness.baseColorFactor ) ) {

				const array = metallicRoughness.baseColorFactor;

				materialParams.color.setRGB( array[ 0 ], array[ 1 ], array[ 2 ], LinearSRGBColorSpace );
				materialParams.opacity = array[ 3 ];

			}

			if ( metallicRoughness.baseColorTexture !== undefined ) {

				pending.push( parser.assignTexture( materialParams, 'map', metallicRoughness.baseColorTexture, SRGBColorSpace ) );

			}

			materialParams.metalness = metallicRoughness.metallicFactor !== undefined ? metallicRoughness.metallicFactor : 1.0;
			materialParams.roughness = metallicRoughness.roughnessFactor !== undefined ? metallicRoughness.roughnessFactor : 1.0;

			if ( metallicRoughness.metallicRoughnessTexture !== undefined ) {

				pending.push( parser.assignTexture( materialParams, 'metalnessMap', metallicRoughness.metallicRoughnessTexture ) );
				pending.push( parser.assignTexture( materialParams, 'roughnessMap', metallicRoughness.metallicRoughnessTexture ) );

			}

			materialType = this._invokeOne( function ( ext ) {

				return ext.getMaterialType && ext.getMaterialType( materialIndex );

			} );

			pending.push( Promise.all( this._invokeAll( function ( ext ) {

				return ext.extendMaterialParams && ext.extendMaterialParams( materialIndex, materialParams );

			} ) ) );

		}

		if ( materialDef.doubleSided === true ) {

			materialParams.side = DoubleSide;

		}

		const alphaMode = materialDef.alphaMode || ALPHA_MODES.OPAQUE;

		if ( alphaMode === ALPHA_MODES.BLEND ) {

			materialParams.transparent = true;

			// See: https://github.com/mrdoob/three.js/issues/17706
			materialParams.depthWrite = false;

		} else {

			materialParams.transparent = false;

			if ( alphaMode === ALPHA_MODES.MASK ) {

				materialParams.alphaTest = materialDef.alphaCutoff !== undefined ? materialDef.alphaCutoff : 0.5;

			}

		}

		if ( materialDef.normalTexture !== undefined && materialType !== MeshBasicMaterial ) {

			pending.push( parser.assignTexture( materialParams, 'normalMap', materialDef.normalTexture ) );

			materialParams.normalScale = new Vector2( 1, 1 );

			if ( materialDef.normalTexture.scale !== undefined ) {

				const scale = materialDef.normalTexture.scale;

				materialParams.normalScale.set( scale, scale );

			}

		}

		if ( materialDef.occlusionTexture !== undefined && materialType !== MeshBasicMaterial ) {

			pending.push( parser.assignTexture( materialParams, 'aoMap', materialDef.occlusionTexture ) );

			if ( materialDef.occlusionTexture.strength !== undefined ) {

				materialParams.aoMapIntensity = materialDef.occlusionTexture.strength;

			}

		}

		if ( materialDef.emissiveFactor !== undefined && materialType !== MeshBasicMaterial ) {

			const emissiveFactor = materialDef.emissiveFactor;
			materialParams.emissive = new Color().setRGB( emissiveFactor[ 0 ], emissiveFactor[ 1 ], emissiveFactor[ 2 ], LinearSRGBColorSpace );

		}

		if ( materialDef.emissiveTexture !== undefined && materialType !== MeshBasicMaterial ) {

			pending.push( parser.assignTexture( materialParams, 'emissiveMap', materialDef.emissiveTexture, SRGBColorSpace ) );

		}

		return Promise.all( pending ).then( function () {

			const material = new materialType( materialParams );

			if ( materialDef.name ) material.name = materialDef.name;

			assignExtrasToUserData( material, materialDef );

			parser.associations.set( material, { materials: materialIndex } );

			if ( materialDef.extensions ) addUnknownExtensionsToUserData( extensions, material, materialDef );

			return material;

		} );

	}

	/**
	 * When Object3D instances are targeted by animation, they need unique names.
	 *
	 * @private
	 * @param {string} originalName
	 * @return {string}
	 */
	createUniqueName( originalName ) {

		const sanitizedName = PropertyBinding.sanitizeNodeName( originalName || '' );

		if ( sanitizedName in this.nodeNamesUsed ) {

			return sanitizedName + '_' + ( ++ this.nodeNamesUsed[ sanitizedName ] );

		} else {

			this.nodeNamesUsed[ sanitizedName ] = 0;

			return sanitizedName;

		}

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#geometry
	 *
	 * Creates BufferGeometries from primitives.
	 *
	 * @private
	 * @param {Array<GLTF.Primitive>} primitives
	 * @return {Promise<Array<BufferGeometry>>}
	 */
	loadGeometries( primitives ) {

		const parser = this;
		const extensions = this.extensions;
		const cache = this.primitiveCache;

		function createDracoPrimitive( primitive ) {

			return extensions[ EXTENSIONS.KHR_DRACO_MESH_COMPRESSION ]
				.decodePrimitive( primitive, parser )
				.then( function ( geometry ) {

					return addPrimitiveAttributes( geometry, primitive, parser );

				} );

		}

		const pending = [];

		for ( let i = 0, il = primitives.length; i < il; i ++ ) {

			const primitive = primitives[ i ];
			const cacheKey = createPrimitiveKey( primitive );

			// See if we've already created this geometry
			const cached = cache[ cacheKey ];

			if ( cached ) {

				// Use the cached geometry if it exists
				pending.push( cached.promise );

			} else {

				let geometryPromise;

				if ( primitive.extensions && primitive.extensions[ EXTENSIONS.KHR_DRACO_MESH_COMPRESSION ] ) {

					// Use DRACO geometry if available
					geometryPromise = createDracoPrimitive( primitive );

				} else {

					// Otherwise create a new geometry
					geometryPromise = addPrimitiveAttributes( new BufferGeometry(), primitive, parser );

				}

				// Cache this geometry
				cache[ cacheKey ] = { primitive: primitive, promise: geometryPromise };

				pending.push( geometryPromise );

			}

		}

		return Promise.all( pending );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes
	 *
	 * @private
	 * @param {number} meshIndex
	 * @return {Promise<Group|Mesh|SkinnedMesh|Line|Points>}
	 */
	loadMesh( meshIndex ) {

		const parser = this;
		const json = this.json;
		const extensions = this.extensions;

		const meshDef = json.meshes[ meshIndex ];
		const primitives = meshDef.primitives;

		const pending = [];

		for ( let i = 0, il = primitives.length; i < il; i ++ ) {

			const material = primitives[ i ].material === undefined
				? createDefaultMaterial( this.cache )
				: this.getDependency( 'material', primitives[ i ].material );

			pending.push( material );

		}

		pending.push( parser.loadGeometries( primitives ) );

		return Promise.all( pending ).then( function ( results ) {

			const materials = results.slice( 0, results.length - 1 );
			const geometries = results[ results.length - 1 ];

			const meshes = [];

			for ( let i = 0, il = geometries.length; i < il; i ++ ) {

				const geometry = geometries[ i ];
				const primitive = primitives[ i ];

				// 1. create Mesh

				let mesh;

				const material = materials[ i ];

				if ( primitive.mode === WEBGL_CONSTANTS.TRIANGLES ||
						primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP ||
						primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN ||
						primitive.mode === undefined ) {

					// .isSkinnedMesh isn't in glTF spec. See ._markDefs()
					mesh = meshDef.isSkinnedMesh === true
						? new SkinnedMesh( geometry, material )
						: new Mesh( geometry, material );

					if ( mesh.isSkinnedMesh === true ) {

						// normalize skin weights to fix malformed assets (see #15319)
						mesh.normalizeSkinWeights();

					}

					if ( primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP ) {

						mesh.geometry = toTrianglesDrawMode( mesh.geometry, TriangleStripDrawMode );

					} else if ( primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN ) {

						mesh.geometry = toTrianglesDrawMode( mesh.geometry, TriangleFanDrawMode );

					}

				} else if ( primitive.mode === WEBGL_CONSTANTS.LINES ) {

					mesh = new LineSegments( geometry, material );

				} else if ( primitive.mode === WEBGL_CONSTANTS.LINE_STRIP ) {

					mesh = new Line( geometry, material );

				} else if ( primitive.mode === WEBGL_CONSTANTS.LINE_LOOP ) {

					mesh = new LineLoop( geometry, material );

				} else if ( primitive.mode === WEBGL_CONSTANTS.POINTS ) {

					mesh = new Points( geometry, material );

				} else {

					throw new Error( 'THREE.GLTFLoader: Primitive mode unsupported: ' + primitive.mode );

				}

				if ( Object.keys( mesh.geometry.morphAttributes ).length > 0 ) {

					updateMorphTargets( mesh, meshDef );

				}

				mesh.name = parser.createUniqueName( meshDef.name || ( 'mesh_' + meshIndex ) );

				assignExtrasToUserData( mesh, meshDef );

				if ( primitive.extensions ) addUnknownExtensionsToUserData( extensions, mesh, primitive );

				parser.assignFinalMaterial( mesh );

				meshes.push( mesh );

			}

			for ( let i = 0, il = meshes.length; i < il; i ++ ) {

				parser.associations.set( meshes[ i ], {
					meshes: meshIndex,
					primitives: i
				} );

			}

			if ( meshes.length === 1 ) {

				if ( meshDef.extensions ) addUnknownExtensionsToUserData( extensions, meshes[ 0 ], meshDef );

				return meshes[ 0 ];

			}

			const group = new Group();

			if ( meshDef.extensions ) addUnknownExtensionsToUserData( extensions, group, meshDef );

			parser.associations.set( group, { meshes: meshIndex } );

			for ( let i = 0, il = meshes.length; i < il; i ++ ) {

				group.add( meshes[ i ] );

			}

			return group;

		} );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#cameras
	 *
	 * @private
	 * @param {number} cameraIndex
	 * @return {Promise<Camera>|undefined}
	 */
	loadCamera( cameraIndex ) {

		let camera;
		const cameraDef = this.json.cameras[ cameraIndex ];
		const params = cameraDef[ cameraDef.type ];

		if ( ! params ) {

			console.warn( 'THREE.GLTFLoader: Missing camera parameters.' );
			return;

		}

		if ( cameraDef.type === 'perspective' ) {

			camera = new PerspectiveCamera( MathUtils.radToDeg( params.yfov ), params.aspectRatio || 1, params.znear || 1, params.zfar || 2e6 );

		} else if ( cameraDef.type === 'orthographic' ) {

			camera = new OrthographicCamera( - params.xmag, params.xmag, params.ymag, - params.ymag, params.znear, params.zfar );

		}

		if ( cameraDef.name ) camera.name = this.createUniqueName( cameraDef.name );

		assignExtrasToUserData( camera, cameraDef );

		return Promise.resolve( camera );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins
	 *
	 * @private
	 * @param {number} skinIndex
	 * @return {Promise<Skeleton>}
	 */
	loadSkin( skinIndex ) {

		const skinDef = this.json.skins[ skinIndex ];

		const pending = [];

		for ( let i = 0, il = skinDef.joints.length; i < il; i ++ ) {

			pending.push( this._loadNodeShallow( skinDef.joints[ i ] ) );

		}

		if ( skinDef.inverseBindMatrices !== undefined ) {

			pending.push( this.getDependency( 'accessor', skinDef.inverseBindMatrices ) );

		} else {

			pending.push( null );

		}

		return Promise.all( pending ).then( function ( results ) {

			const inverseBindMatrices = results.pop();
			const jointNodes = results;

			// Note that bones (joint nodes) may or may not be in the
			// scene graph at this time.

			const bones = [];
			const boneInverses = [];

			for ( let i = 0, il = jointNodes.length; i < il; i ++ ) {

				const jointNode = jointNodes[ i ];

				if ( jointNode ) {

					bones.push( jointNode );

					const mat = new Matrix4();

					if ( inverseBindMatrices !== null ) {

						mat.fromArray( inverseBindMatrices.array, i * 16 );

					}

					boneInverses.push( mat );

				} else {

					console.warn( 'THREE.GLTFLoader: Joint "%s" could not be found.', skinDef.joints[ i ] );

				}

			}

			return new Skeleton( bones, boneInverses );

		} );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#animations
	 *
	 * @private
	 * @param {number} animationIndex
	 * @return {Promise<AnimationClip>}
	 */
	loadAnimation( animationIndex ) {

		const json = this.json;
		const parser = this;

		const animationDef = json.animations[ animationIndex ];
		const animationName = animationDef.name ? animationDef.name : 'animation_' + animationIndex;

		const pendingNodes = [];
		const pendingInputAccessors = [];
		const pendingOutputAccessors = [];
		const pendingSamplers = [];
		const pendingTargets = [];

		for ( let i = 0, il = animationDef.channels.length; i < il; i ++ ) {

			const channel = animationDef.channels[ i ];
			const sampler = animationDef.samplers[ channel.sampler ];
			const target = channel.target;
			const name = target.node;
			const input = animationDef.parameters !== undefined ? animationDef.parameters[ sampler.input ] : sampler.input;
			const output = animationDef.parameters !== undefined ? animationDef.parameters[ sampler.output ] : sampler.output;

			if ( target.node === undefined ) continue;

			pendingNodes.push( this.getDependency( 'node', name ) );
			pendingInputAccessors.push( this.getDependency( 'accessor', input ) );
			pendingOutputAccessors.push( this.getDependency( 'accessor', output ) );
			pendingSamplers.push( sampler );
			pendingTargets.push( target );

		}

		return Promise.all( [

			Promise.all( pendingNodes ),
			Promise.all( pendingInputAccessors ),
			Promise.all( pendingOutputAccessors ),
			Promise.all( pendingSamplers ),
			Promise.all( pendingTargets )

		] ).then( function ( dependencies ) {

			const nodes = dependencies[ 0 ];
			const inputAccessors = dependencies[ 1 ];
			const outputAccessors = dependencies[ 2 ];
			const samplers = dependencies[ 3 ];
			const targets = dependencies[ 4 ];

			const tracks = [];

			for ( let i = 0, il = nodes.length; i < il; i ++ ) {

				const node = nodes[ i ];
				const inputAccessor = inputAccessors[ i ];
				const outputAccessor = outputAccessors[ i ];
				const sampler = samplers[ i ];
				const target = targets[ i ];

				if ( node === undefined ) continue;

				if ( node.updateMatrix ) {

					node.updateMatrix();

				}

				const createdTracks = parser._createAnimationTracks( node, inputAccessor, outputAccessor, sampler, target );

				if ( createdTracks ) {

					for ( let k = 0; k < createdTracks.length; k ++ ) {

						tracks.push( createdTracks[ k ] );

					}

				}

			}

			const animation = new AnimationClip( animationName, undefined, tracks );

			assignExtrasToUserData( animation, animationDef );

			return animation;

		} );

	}

	createNodeMesh( nodeIndex ) {

		const json = this.json;
		const parser = this;
		const nodeDef = json.nodes[ nodeIndex ];

		if ( nodeDef.mesh === undefined ) return null;

		return parser.getDependency( 'mesh', nodeDef.mesh ).then( function ( mesh ) {

			const node = parser._getNodeRef( parser.meshCache, nodeDef.mesh, mesh );

			// if weights are provided on the node, override weights on the mesh.
			if ( nodeDef.weights !== undefined ) {

				node.traverse( function ( o ) {

					if ( ! o.isMesh ) return;

					for ( let i = 0, il = nodeDef.weights.length; i < il; i ++ ) {

						o.morphTargetInfluences[ i ] = nodeDef.weights[ i ];

					}

				} );

			}

			return node;

		} );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#nodes-and-hierarchy
	 *
	 * @private
	 * @param {number} nodeIndex
	 * @return {Promise<Object3D>}
	 */
	loadNode( nodeIndex ) {

		const json = this.json;
		const parser = this;

		const nodeDef = json.nodes[ nodeIndex ];

		const nodePending = parser._loadNodeShallow( nodeIndex );

		const childPending = [];
		const childrenDef = nodeDef.children || [];

		for ( let i = 0, il = childrenDef.length; i < il; i ++ ) {

			childPending.push( parser.getDependency( 'node', childrenDef[ i ] ) );

		}

		const skeletonPending = nodeDef.skin === undefined
			? Promise.resolve( null )
			: parser.getDependency( 'skin', nodeDef.skin );

		return Promise.all( [
			nodePending,
			Promise.all( childPending ),
			skeletonPending
		] ).then( function ( results ) {

			const node = results[ 0 ];
			const children = results[ 1 ];
			const skeleton = results[ 2 ];

			if ( skeleton !== null ) {

				// This full traverse should be fine because
				// child glTF nodes have not been added to this node yet.
				node.traverse( function ( mesh ) {

					if ( ! mesh.isSkinnedMesh ) return;

					mesh.bind( skeleton, _identityMatrix );

				} );

			}

			for ( let i = 0, il = children.length; i < il; i ++ ) {

				node.add( children[ i ] );

			}

			return node;

		} );

	}

	// ._loadNodeShallow() parses a single node.
	// skin and child nodes are created and added in .loadNode() (no '_' prefix).
	_loadNodeShallow( nodeIndex ) {

		const json = this.json;
		const extensions = this.extensions;
		const parser = this;

		// This method is called from .loadNode() and .loadSkin().
		// Cache a node to avoid duplication.

		if ( this.nodeCache[ nodeIndex ] !== undefined ) {

			return this.nodeCache[ nodeIndex ];

		}

		const nodeDef = json.nodes[ nodeIndex ];

		// reserve node's name before its dependencies, so the root has the intended name.
		const nodeName = nodeDef.name ? parser.createUniqueName( nodeDef.name ) : '';

		const pending = [];

		const meshPromise = parser._invokeOne( function ( ext ) {

			return ext.createNodeMesh && ext.createNodeMesh( nodeIndex );

		} );

		if ( meshPromise ) {

			pending.push( meshPromise );

		}

		if ( nodeDef.camera !== undefined ) {

			pending.push( parser.getDependency( 'camera', nodeDef.camera ).then( function ( camera ) {

				return parser._getNodeRef( parser.cameraCache, nodeDef.camera, camera );

			} ) );

		}

		parser._invokeAll( function ( ext ) {

			return ext.createNodeAttachment && ext.createNodeAttachment( nodeIndex );

		} ).forEach( function ( promise ) {

			pending.push( promise );

		} );

		this.nodeCache[ nodeIndex ] = Promise.all( pending ).then( function ( objects ) {

			let node;

			// .isBone isn't in glTF spec. See ._markDefs
			if ( nodeDef.isBone === true ) {

				node = new Bone();

			} else if ( objects.length > 1 ) {

				node = new Group();

			} else if ( objects.length === 1 ) {

				node = objects[ 0 ];

			} else {

				node = new Object3D();

			}

			if ( node !== objects[ 0 ] ) {

				for ( let i = 0, il = objects.length; i < il; i ++ ) {

					node.add( objects[ i ] );

				}

			}

			if ( nodeDef.name ) {

				node.userData.name = nodeDef.name;
				node.name = nodeName;

			}

			assignExtrasToUserData( node, nodeDef );

			if ( nodeDef.extensions ) addUnknownExtensionsToUserData( extensions, node, nodeDef );

			if ( nodeDef.matrix !== undefined ) {

				const matrix = new Matrix4();
				matrix.fromArray( nodeDef.matrix );
				node.applyMatrix4( matrix );

			} else {

				if ( nodeDef.translation !== undefined ) {

					node.position.fromArray( nodeDef.translation );

				}

				if ( nodeDef.rotation !== undefined ) {

					node.quaternion.fromArray( nodeDef.rotation );

				}

				if ( nodeDef.scale !== undefined ) {

					node.scale.fromArray( nodeDef.scale );

				}

			}

			if ( ! parser.associations.has( node ) ) {

				parser.associations.set( node, {} );

			} else if ( nodeDef.mesh !== undefined && parser.meshCache.refs[ nodeDef.mesh ] > 1 ) {

				const mapping = parser.associations.get( node );
				parser.associations.set( node, { ...mapping } );

			}

			parser.associations.get( node ).nodes = nodeIndex;

			return node;

		} );

		return this.nodeCache[ nodeIndex ];

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#scenes
	 *
	 * @private
	 * @param {number} sceneIndex
	 * @return {Promise<Group>}
	 */
	loadScene( sceneIndex ) {

		const extensions = this.extensions;
		const sceneDef = this.json.scenes[ sceneIndex ];
		const parser = this;

		// Loader returns Group, not Scene.
		// See: https://github.com/mrdoob/three.js/issues/18342#issuecomment-578981172
		const scene = new Group();
		if ( sceneDef.name ) scene.name = parser.createUniqueName( sceneDef.name );

		assignExtrasToUserData( scene, sceneDef );

		if ( sceneDef.extensions ) addUnknownExtensionsToUserData( extensions, scene, sceneDef );

		const nodeIds = sceneDef.nodes || [];

		const pending = [];

		for ( let i = 0, il = nodeIds.length; i < il; i ++ ) {

			pending.push( parser.getDependency( 'node', nodeIds[ i ] ) );

		}

		return Promise.all( pending ).then( function ( nodes ) {

			for ( let i = 0, il = nodes.length; i < il; i ++ ) {

				scene.add( nodes[ i ] );

			}

			// Removes dangling associations, associations that reference a node that
			// didn't make it into the scene.
			const reduceAssociations = ( node ) => {

				const reducedAssociations = new Map();

				for ( const [ key, value ] of parser.associations ) {

					if ( key instanceof Material || key instanceof Texture ) {

						reducedAssociations.set( key, value );

					}

				}

				node.traverse( ( node ) => {

					const mappings = parser.associations.get( node );

					if ( mappings != null ) {

						reducedAssociations.set( node, mappings );

					}

				} );

				return reducedAssociations;

			};

			parser.associations = reduceAssociations( scene );

			return scene;

		} );

	}

	_createAnimationTracks( node, inputAccessor, outputAccessor, sampler, target ) {

		const tracks = [];

		const targetName = node.name ? node.name : node.uuid;
		const targetNames = [];

		if ( PATH_PROPERTIES[ target.path ] === PATH_PROPERTIES.weights ) {

			node.traverse( function ( object ) {

				if ( object.morphTargetInfluences ) {

					targetNames.push( object.name ? object.name : object.uuid );

				}

			} );

		} else {

			targetNames.push( targetName );

		}

		let TypedKeyframeTrack;

		switch ( PATH_PROPERTIES[ target.path ] ) {

			case PATH_PROPERTIES.weights:

				TypedKeyframeTrack = NumberKeyframeTrack;
				break;

			case PATH_PROPERTIES.rotation:

				TypedKeyframeTrack = QuaternionKeyframeTrack;
				break;

			case PATH_PROPERTIES.translation:
			case PATH_PROPERTIES.scale:

				TypedKeyframeTrack = VectorKeyframeTrack;
				break;

			default:

				switch ( outputAccessor.itemSize ) {

					case 1:
						TypedKeyframeTrack = NumberKeyframeTrack;
						break;
					case 2:
					case 3:
					default:
						TypedKeyframeTrack = VectorKeyframeTrack;
						break;

				}

				break;

		}

		const interpolation = sampler.interpolation !== undefined ? INTERPOLATION[ sampler.interpolation ] : InterpolateLinear;


		const outputArray = this._getArrayFromAccessor( outputAccessor );

		for ( let j = 0, jl = targetNames.length; j < jl; j ++ ) {

			const track = new TypedKeyframeTrack(
				targetNames[ j ] + '.' + PATH_PROPERTIES[ target.path ],
				inputAccessor.array,
				outputArray,
				interpolation
			);

			// Override interpolation with custom factory method.
			if ( sampler.interpolation === 'CUBICSPLINE' ) {

				this._createCubicSplineTrackInterpolant( track );

			}

			tracks.push( track );

		}

		return tracks;

	}

	_getArrayFromAccessor( accessor ) {

		let outputArray = accessor.array;

		if ( accessor.normalized ) {

			const scale = getNormalizedComponentScale( outputArray.constructor );
			const scaled = new Float32Array( outputArray.length );

			for ( let j = 0, jl = outputArray.length; j < jl; j ++ ) {

				scaled[ j ] = outputArray[ j ] * scale;

			}

			outputArray = scaled;

		}

		return outputArray;

	}

	_createCubicSplineTrackInterpolant( track ) {

		track.createInterpolant = function InterpolantFactoryMethodGLTFCubicSpline( result ) {

			// A CUBICSPLINE keyframe in glTF has three output values for each input value,
			// representing inTangent, splineVertex, and outTangent. As a result, track.getValueSize()
			// must be divided by three to get the interpolant's sampleSize argument.

			const interpolantType = ( this instanceof QuaternionKeyframeTrack ) ? GLTFCubicSplineQuaternionInterpolant : GLTFCubicSplineInterpolant;

			return new interpolantType( this.times, this.values, this.getValueSize() / 3, result );

		};

		// Mark as CUBICSPLINE. `track.getInterpolation()` doesn't support custom interpolants.
		track.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = true;

	}

}

/**
 *
 * @private
 * @param {BufferGeometry} geometry
 * @param {GLTF.Primitive} primitiveDef
 * @param {GLTFParser} parser
 */
function computeBounds( geometry, primitiveDef, parser ) {

	const attributes = primitiveDef.attributes;

	const box = new Box3();

	if ( attributes.POSITION !== undefined ) {

		const accessor = parser.json.accessors[ attributes.POSITION ];

		const min = accessor.min;
		const max = accessor.max;

		// glTF requires 'min' and 'max', but VRM (which extends glTF) currently ignores that requirement.

		if ( min !== undefined && max !== undefined ) {

			box.set(
				new Vector3( min[ 0 ], min[ 1 ], min[ 2 ] ),
				new Vector3( max[ 0 ], max[ 1 ], max[ 2 ] )
			);

			if ( accessor.normalized ) {

				const boxScale = getNormalizedComponentScale( WEBGL_COMPONENT_TYPES[ accessor.componentType ] );
				box.min.multiplyScalar( boxScale );
				box.max.multiplyScalar( boxScale );

			}

		} else {

			console.warn( 'THREE.GLTFLoader: Missing min/max properties for accessor POSITION.' );

			return;

		}

	} else {

		return;

	}

	const targets = primitiveDef.targets;

	if ( targets !== undefined ) {

		const maxDisplacement = new Vector3();
		const vector = new Vector3();

		for ( let i = 0, il = targets.length; i < il; i ++ ) {

			const target = targets[ i ];

			if ( target.POSITION !== undefined ) {

				const accessor = parser.json.accessors[ target.POSITION ];
				const min = accessor.min;
				const max = accessor.max;

				// glTF requires 'min' and 'max', but VRM (which extends glTF) currently ignores that requirement.

				if ( min !== undefined && max !== undefined ) {

					// we need to get max of absolute components because target weight is [-1,1]
					vector.setX( Math.max( Math.abs( min[ 0 ] ), Math.abs( max[ 0 ] ) ) );
					vector.setY( Math.max( Math.abs( min[ 1 ] ), Math.abs( max[ 1 ] ) ) );
					vector.setZ( Math.max( Math.abs( min[ 2 ] ), Math.abs( max[ 2 ] ) ) );


					if ( accessor.normalized ) {

						const boxScale = getNormalizedComponentScale( WEBGL_COMPONENT_TYPES[ accessor.componentType ] );
						vector.multiplyScalar( boxScale );

					}

					// Note: this assumes that the sum of all weights is at most 1. This isn't quite correct - it's more conservative
					// to assume that each target can have a max weight of 1. However, for some use cases - notably, when morph targets
					// are used to implement key-frame animations and as such only two are active at a time - this results in very large
					// boxes. So for now we make a box that's sometimes a touch too small but is hopefully mostly of reasonable size.
					maxDisplacement.max( vector );

				} else {

					console.warn( 'THREE.GLTFLoader: Missing min/max properties for accessor POSITION.' );

				}

			}

		}

		// As per comment above this box isn't conservative, but has a reasonable size for a very large number of morph targets.
		box.expandByVector( maxDisplacement );

	}

	geometry.boundingBox = box;

	const sphere = new Sphere();

	box.getCenter( sphere.center );
	sphere.radius = box.min.distanceTo( box.max ) / 2;

	geometry.boundingSphere = sphere;

}

/**
 *
 * @private
 * @param {BufferGeometry} geometry
 * @param {GLTF.Primitive} primitiveDef
 * @param {GLTFParser} parser
 * @return {Promise<BufferGeometry>}
 */
function addPrimitiveAttributes( geometry, primitiveDef, parser ) {

	const attributes = primitiveDef.attributes;

	const pending = [];

	function assignAttributeAccessor( accessorIndex, attributeName ) {

		return parser.getDependency( 'accessor', accessorIndex )
			.then( function ( accessor ) {

				geometry.setAttribute( attributeName, accessor );

			} );

	}

	for ( const gltfAttributeName in attributes ) {

		const threeAttributeName = ATTRIBUTES[ gltfAttributeName ] || gltfAttributeName.toLowerCase();

		// Skip attributes already provided by e.g. Draco extension.
		if ( threeAttributeName in geometry.attributes ) continue;

		pending.push( assignAttributeAccessor( attributes[ gltfAttributeName ], threeAttributeName ) );

	}

	if ( primitiveDef.indices !== undefined && ! geometry.index ) {

		const accessor = parser.getDependency( 'accessor', primitiveDef.indices ).then( function ( accessor ) {

			geometry.setIndex( accessor );

		} );

		pending.push( accessor );

	}

	if ( ColorManagement.workingColorSpace !== LinearSRGBColorSpace && 'COLOR_0' in attributes ) {

		console.warn( `THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${ColorManagement.workingColorSpace}" not supported.` );

	}

	assignExtrasToUserData( geometry, primitiveDef );

	computeBounds( geometry, primitiveDef, parser );

	return Promise.all( pending ).then( function () {

		return primitiveDef.targets !== undefined
			? addMorphTargets( geometry, primitiveDef.targets, parser )
			: geometry;

	} );

}

/**
 * Loader result of `GLTFLoader`.
 *
 * @typedef {Object} GLTFLoader~LoadObject
 * @property {Array<AnimationClip>} animations - An array of animation clips.
 * @property {Object} asset - Meta data about the loaded asset.
 * @property {Array<Camera>} cameras - An array of cameras.
 * @property {GLTFParser} parser - A reference to the internal parser.
 * @property {Group} scene - The default scene.
 * @property {Array<Group>} scenes - glTF assets might define multiple scenes.
 * @property {Object} userData - Additional data.
 **/

export { GLTFLoader };
````````

FILE: `vendor/addons/utils/BufferGeometryUtils.js`

````````javascript
import {
	BufferAttribute,
	BufferGeometry,
	Float32BufferAttribute,
	InstancedBufferAttribute,
	InterleavedBuffer,
	InterleavedBufferAttribute,
	TriangleFanDrawMode,
	TriangleStripDrawMode,
	TrianglesDrawMode,
	Vector3,
} from '../../three.module.js';

/**
 * @module BufferGeometryUtils
 * @three_import import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
 */

/**
 * Computes vertex tangents using the MikkTSpace algorithm. MikkTSpace generates the same tangents consistently,
 * and is used in most modelling tools and normal map bakers. Use MikkTSpace for materials with normal maps,
 * because inconsistent tangents may lead to subtle visual issues in the normal map, particularly around mirrored
 * UV seams.
 *
 * In comparison to this method, {@link BufferGeometry#computeTangents} (a custom algorithm) generates tangents that
 * probably will not match the tangents in other software. The custom algorithm is sufficient for general use with a
 * custom material, and may be faster than MikkTSpace.
 *
 * Returns the original BufferGeometry. Indexed geometries will be de-indexed. Requires position, normal, and uv attributes.
 *
 * @param {BufferGeometry} geometry - The geometry to compute tangents for.
 * @param {Object} MikkTSpace - Instance of `examples/jsm/libs/mikktspace.module.js`, or `mikktspace` npm package.
 * Await `MikkTSpace.ready` before use.
 * @param {boolean} [negateSign=true] - Whether to negate the sign component (.w) of each tangent.
 * Required for normal map conventions in some formats, including glTF.
 * @return {BufferGeometry} The updated geometry.
 */
function computeMikkTSpaceTangents( geometry, MikkTSpace, negateSign = true ) {

	if ( ! MikkTSpace || ! MikkTSpace.isReady ) {

		throw new Error( 'BufferGeometryUtils: Initialized MikkTSpace library required.' );

	}

	if ( ! geometry.hasAttribute( 'position' ) || ! geometry.hasAttribute( 'normal' ) || ! geometry.hasAttribute( 'uv' ) ) {

		throw new Error( 'BufferGeometryUtils: Tangents require "position", "normal", and "uv" attributes.' );

	}

	function getAttributeArray( attribute ) {

		if ( attribute.normalized || attribute.isInterleavedBufferAttribute ) {

			const dstArray = new Float32Array( attribute.count * attribute.itemSize );

			for ( let i = 0, j = 0; i < attribute.count; i ++ ) {

				dstArray[ j ++ ] = attribute.getX( i );
				dstArray[ j ++ ] = attribute.getY( i );

				if ( attribute.itemSize > 2 ) {

					dstArray[ j ++ ] = attribute.getZ( i );

				}

			}

			return dstArray;

		}

		if ( attribute.array instanceof Float32Array ) {

			return attribute.array;

		}

		return new Float32Array( attribute.array );

	}

	// MikkTSpace algorithm requires non-indexed input.

	const _geometry = geometry.index ? geometry.toNonIndexed() : geometry;

	// Compute vertex tangents.

	const tangents = MikkTSpace.generateTangents(

		getAttributeArray( _geometry.attributes.position ),
		getAttributeArray( _geometry.attributes.normal ),
		getAttributeArray( _geometry.attributes.uv )

	);

	// Texture coordinate convention of glTF differs from the apparent
	// default of the MikkTSpace library; .w component must be flipped.

	if ( negateSign ) {

		for ( let i = 3; i < tangents.length; i += 4 ) {

			tangents[ i ] *= - 1;

		}

	}

	//

	_geometry.setAttribute( 'tangent', new BufferAttribute( tangents, 4 ) );

	if ( geometry !== _geometry ) {

		geometry.copy( _geometry );

	}

	return geometry;

}

/**
 * Merges a set of geometries into a single instance. All geometries must have compatible attributes.
 *
 * @param {Array<BufferGeometry>} geometries - The geometries to merge.
 * @param {boolean} [useGroups=false] - Whether to use groups or not.
 * @return {?BufferGeometry} The merged geometry. Returns `null` if the merge does not succeed.
 */
function mergeGeometries( geometries, useGroups = false ) {

	const isIndexed = geometries[ 0 ].index !== null;

	const attributesUsed = new Set( Object.keys( geometries[ 0 ].attributes ) );
	const morphAttributesUsed = new Set( Object.keys( geometries[ 0 ].morphAttributes ) );

	const attributes = {};
	const morphAttributes = {};

	const morphTargetsRelative = geometries[ 0 ].morphTargetsRelative;

	const mergedGeometry = new BufferGeometry();

	let offset = 0;

	for ( let i = 0; i < geometries.length; ++ i ) {

		const geometry = geometries[ i ];
		let attributesCount = 0;

		// ensure that all geometries are indexed, or none

		if ( isIndexed !== ( geometry.index !== null ) ) {

			console.error( 'THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ' + i + '. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.' );
			return null;

		}

		// gather attributes, exit early if they're different

		for ( const name in geometry.attributes ) {

			if ( ! attributesUsed.has( name ) ) {

				console.error( 'THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ' + i + '. All geometries must have compatible attributes; make sure "' + name + '" attribute exists among all geometries, or in none of them.' );
				return null;

			}

			if ( attributes[ name ] === undefined ) attributes[ name ] = [];

			attributes[ name ].push( geometry.attributes[ name ] );

			attributesCount ++;

		}

		// ensure geometries have the same number of attributes

		if ( attributesCount !== attributesUsed.size ) {

			console.error( 'THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ' + i + '. Make sure all geometries have the same number of attributes.' );
			return null;

		}

		// gather morph attributes, exit early if they're different

		if ( morphTargetsRelative !== geometry.morphTargetsRelative ) {

			console.error( 'THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ' + i + '. .morphTargetsRelative must be consistent throughout all geometries.' );
			return null;

		}

		for ( const name in geometry.morphAttributes ) {

			if ( ! morphAttributesUsed.has( name ) ) {

				console.error( 'THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ' + i + '.  .morphAttributes must be consistent throughout all geometries.' );
				return null;

			}

			if ( morphAttributes[ name ] === undefined ) morphAttributes[ name ] = [];

			morphAttributes[ name ].push( geometry.morphAttributes[ name ] );

		}

		if ( useGroups ) {

			let count;

			if ( isIndexed ) {

				count = geometry.index.count;

			} else if ( geometry.attributes.position !== undefined ) {

				count = geometry.attributes.position.count;

			} else {

				console.error( 'THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ' + i + '. The geometry must have either an index or a position attribute' );
				return null;

			}

			mergedGeometry.addGroup( offset, count, i );

			offset += count;

		}

	}

	// merge indices

	if ( isIndexed ) {

		let indexOffset = 0;
		const mergedIndex = [];

		for ( let i = 0; i < geometries.length; ++ i ) {

			const index = geometries[ i ].index;

			for ( let j = 0; j < index.count; ++ j ) {

				mergedIndex.push( index.getX( j ) + indexOffset );

			}

			indexOffset += geometries[ i ].attributes.position.count;

		}

		mergedGeometry.setIndex( mergedIndex );

	}

	// merge attributes

	for ( const name in attributes ) {

		const mergedAttribute = mergeAttributes( attributes[ name ] );

		if ( ! mergedAttribute ) {

			console.error( 'THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the ' + name + ' attribute.' );
			return null;

		}

		mergedGeometry.setAttribute( name, mergedAttribute );

	}

	// merge morph attributes

	for ( const name in morphAttributes ) {

		const numMorphTargets = morphAttributes[ name ][ 0 ].length;

		if ( numMorphTargets === 0 ) break;

		mergedGeometry.morphAttributes = mergedGeometry.morphAttributes || {};
		mergedGeometry.morphAttributes[ name ] = [];

		for ( let i = 0; i < numMorphTargets; ++ i ) {

			const morphAttributesToMerge = [];

			for ( let j = 0; j < morphAttributes[ name ].length; ++ j ) {

				morphAttributesToMerge.push( morphAttributes[ name ][ j ][ i ] );

			}

			const mergedMorphAttribute = mergeAttributes( morphAttributesToMerge );

			if ( ! mergedMorphAttribute ) {

				console.error( 'THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the ' + name + ' morphAttribute.' );
				return null;

			}

			mergedGeometry.morphAttributes[ name ].push( mergedMorphAttribute );

		}

	}

	return mergedGeometry;

}

/**
 * Merges a set of attributes into a single instance. All attributes must have compatible properties and types.
 * Instances of {@link InterleavedBufferAttribute} are not supported.
 *
 * @param {Array<BufferAttribute>} attributes - The attributes to merge.
 * @return {?BufferAttribute} The merged attribute. Returns `null` if the merge does not succeed.
 */
function mergeAttributes( attributes ) {

	let TypedArray;
	let itemSize;
	let normalized;
	let gpuType = - 1;
	let arrayLength = 0;

	for ( let i = 0; i < attributes.length; ++ i ) {

		const attribute = attributes[ i ];

		if ( TypedArray === undefined ) TypedArray = attribute.array.constructor;
		if ( TypedArray !== attribute.array.constructor ) {

			console.error( 'THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.' );
			return null;

		}

		if ( itemSize === undefined ) itemSize = attribute.itemSize;
		if ( itemSize !== attribute.itemSize ) {

			console.error( 'THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.' );
			return null;

		}

		if ( normalized === undefined ) normalized = attribute.normalized;
		if ( normalized !== attribute.normalized ) {

			console.error( 'THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.' );
			return null;

		}

		if ( gpuType === - 1 ) gpuType = attribute.gpuType;
		if ( gpuType !== attribute.gpuType ) {

			console.error( 'THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.' );
			return null;

		}

		arrayLength += attribute.count * itemSize;

	}

	const array = new TypedArray( arrayLength );
	const result = new BufferAttribute( array, itemSize, normalized );
	let offset = 0;

	for ( let i = 0; i < attributes.length; ++ i ) {

		const attribute = attributes[ i ];
		if ( attribute.isInterleavedBufferAttribute ) {

			const tupleOffset = offset / itemSize;
			for ( let j = 0, l = attribute.count; j < l; j ++ ) {

				for ( let c = 0; c < itemSize; c ++ ) {

					const value = attribute.getComponent( j, c );
					result.setComponent( j + tupleOffset, c, value );

				}

			}

		} else {

			array.set( attribute.array, offset );

		}

		offset += attribute.count * itemSize;

	}

	if ( gpuType !== undefined ) {

		result.gpuType = gpuType;

	}

	return result;

}

/**
 * Performs a deep clone of the given buffer attribute.
 *
 * @param {BufferAttribute} attribute - The attribute to clone.
 * @return {BufferAttribute} The cloned attribute.
 */
function deepCloneAttribute( attribute ) {

	if ( attribute.isInstancedInterleavedBufferAttribute || attribute.isInterleavedBufferAttribute ) {

		return deinterleaveAttribute( attribute );

	}

	if ( attribute.isInstancedBufferAttribute ) {

		return new InstancedBufferAttribute().copy( attribute );

	}

	return new BufferAttribute().copy( attribute );

}

/**
 * Interleaves a set of attributes and returns a new array of corresponding attributes that share a
 * single {@link InterleavedBuffer} instance. All attributes must have compatible types.
 *
 * @param {Array<BufferAttribute>} attributes - The attributes to interleave.
 * @return {?Array<InterleavedBufferAttribute>} An array of interleaved attributes. If interleave does not succeed, the method returns `null`.
 */
function interleaveAttributes( attributes ) {

	// Interleaves the provided attributes into an InterleavedBuffer and returns
	// a set of InterleavedBufferAttributes for each attribute
	let TypedArray;
	let arrayLength = 0;
	let stride = 0;

	// calculate the length and type of the interleavedBuffer
	for ( let i = 0, l = attributes.length; i < l; ++ i ) {

		const attribute = attributes[ i ];

		if ( TypedArray === undefined ) TypedArray = attribute.array.constructor;
		if ( TypedArray !== attribute.array.constructor ) {

			console.error( 'AttributeBuffers of different types cannot be interleaved' );
			return null;

		}

		arrayLength += attribute.array.length;
		stride += attribute.itemSize;

	}

	// Create the set of buffer attributes
	const interleavedBuffer = new InterleavedBuffer( new TypedArray( arrayLength ), stride );
	let offset = 0;
	const res = [];
	const getters = [ 'getX', 'getY', 'getZ', 'getW' ];
	const setters = [ 'setX', 'setY', 'setZ', 'setW' ];

	for ( let j = 0, l = attributes.length; j < l; j ++ ) {

		const attribute = attributes[ j ];
		const itemSize = attribute.itemSize;
		const count = attribute.count;
		const iba = new InterleavedBufferAttribute( interleavedBuffer, itemSize, offset, attribute.normalized );
		res.push( iba );

		offset += itemSize;

		// Move the data for each attribute into the new interleavedBuffer
		// at the appropriate offset
		for ( let c = 0; c < count; c ++ ) {

			for ( let k = 0; k < itemSize; k ++ ) {

				iba[ setters[ k ] ]( c, attribute[ getters[ k ] ]( c ) );

			}

		}

	}

	return res;

}

/**
 * Returns a new, non-interleaved version of the given attribute.
 *
 * @param {InterleavedBufferAttribute} attribute - The interleaved attribute.
 * @return {BufferAttribute} The non-interleaved attribute.
 */
function deinterleaveAttribute( attribute ) {

	const cons = attribute.data.array.constructor;
	const count = attribute.count;
	const itemSize = attribute.itemSize;
	const normalized = attribute.normalized;

	const array = new cons( count * itemSize );
	let newAttribute;
	if ( attribute.isInstancedInterleavedBufferAttribute ) {

		newAttribute = new InstancedBufferAttribute( array, itemSize, normalized, attribute.meshPerAttribute );

	} else {

		newAttribute = new BufferAttribute( array, itemSize, normalized );

	}

	for ( let i = 0; i < count; i ++ ) {

		newAttribute.setX( i, attribute.getX( i ) );

		if ( itemSize >= 2 ) {

			newAttribute.setY( i, attribute.getY( i ) );

		}

		if ( itemSize >= 3 ) {

			newAttribute.setZ( i, attribute.getZ( i ) );

		}

		if ( itemSize >= 4 ) {

			newAttribute.setW( i, attribute.getW( i ) );

		}

	}

	return newAttribute;

}

/**
 * Deinterleaves all attributes on the given geometry.
 *
 * @param {BufferGeometry} geometry - The geometry to deinterleave.
 */
function deinterleaveGeometry( geometry ) {

	const attributes = geometry.attributes;
	const morphTargets = geometry.morphTargets;
	const attrMap = new Map();

	for ( const key in attributes ) {

		const attr = attributes[ key ];
		if ( attr.isInterleavedBufferAttribute ) {

			if ( ! attrMap.has( attr ) ) {

				attrMap.set( attr, deinterleaveAttribute( attr ) );

			}

			attributes[ key ] = attrMap.get( attr );

		}

	}

	for ( const key in morphTargets ) {

		const attr = morphTargets[ key ];
		if ( attr.isInterleavedBufferAttribute ) {

			if ( ! attrMap.has( attr ) ) {

				attrMap.set( attr, deinterleaveAttribute( attr ) );

			}

			morphTargets[ key ] = attrMap.get( attr );

		}

	}

}

/**
 * Returns the amount of bytes used by all attributes to represent the geometry.
 *
 * @param {BufferGeometry} geometry - The geometry.
 * @return {number} The estimate bytes used.
 */
function estimateBytesUsed( geometry ) {

	// Return the estimated memory used by this geometry in bytes
	// Calculate using itemSize, count, and BYTES_PER_ELEMENT to account
	// for InterleavedBufferAttributes.
	let mem = 0;
	for ( const name in geometry.attributes ) {

		const attr = geometry.getAttribute( name );
		mem += attr.count * attr.itemSize * attr.array.BYTES_PER_ELEMENT;

	}

	const indices = geometry.getIndex();
	mem += indices ? indices.count * indices.itemSize * indices.array.BYTES_PER_ELEMENT : 0;
	return mem;

}

/**
 * Returns a new geometry with vertices for which all similar vertex attributes (within tolerance) are merged.
 *
 * @param {BufferGeometry} geometry - The geometry to merge vertices for.
 * @param {number} [tolerance=1e-4] - The tolerance value.
 * @return {BufferGeometry} - The new geometry with merged vertices.
 */
function mergeVertices( geometry, tolerance = 1e-4 ) {

	tolerance = Math.max( tolerance, Number.EPSILON );

	// Generate an index buffer if the geometry doesn't have one, or optimize it
	// if it's already available.
	const hashToIndex = {};
	const indices = geometry.getIndex();
	const positions = geometry.getAttribute( 'position' );
	const vertexCount = indices ? indices.count : positions.count;

	// next value for triangle indices
	let nextIndex = 0;

	// attributes and new attribute arrays
	const attributeNames = Object.keys( geometry.attributes );
	const tmpAttributes = {};
	const tmpMorphAttributes = {};
	const newIndices = [];
	const getters = [ 'getX', 'getY', 'getZ', 'getW' ];
	const setters = [ 'setX', 'setY', 'setZ', 'setW' ];

	// Initialize the arrays, allocating space conservatively. Extra
	// space will be trimmed in the last step.
	for ( let i = 0, l = attributeNames.length; i < l; i ++ ) {

		const name = attributeNames[ i ];
		const attr = geometry.attributes[ name ];

		tmpAttributes[ name ] = new attr.constructor(
			new attr.array.constructor( attr.count * attr.itemSize ),
			attr.itemSize,
			attr.normalized
		);

		const morphAttributes = geometry.morphAttributes[ name ];
		if ( morphAttributes ) {

			if ( ! tmpMorphAttributes[ name ] ) tmpMorphAttributes[ name ] = [];
			morphAttributes.forEach( ( morphAttr, i ) => {

				const array = new morphAttr.array.constructor( morphAttr.count * morphAttr.itemSize );
				tmpMorphAttributes[ name ][ i ] = new morphAttr.constructor( array, morphAttr.itemSize, morphAttr.normalized );

			} );

		}

	}

	// convert the error tolerance to an amount of decimal places to truncate to
	const halfTolerance = tolerance * 0.5;
	const exponent = Math.log10( 1 / tolerance );
	const hashMultiplier = Math.pow( 10, exponent );
	const hashAdditive = halfTolerance * hashMultiplier;
	for ( let i = 0; i < vertexCount; i ++ ) {

		const index = indices ? indices.getX( i ) : i;

		// Generate a hash for the vertex attributes at the current index 'i'
		let hash = '';
		for ( let j = 0, l = attributeNames.length; j < l; j ++ ) {

			const name = attributeNames[ j ];
			const attribute = geometry.getAttribute( name );
			const itemSize = attribute.itemSize;

			for ( let k = 0; k < itemSize; k ++ ) {

				// double tilde truncates the decimal value
				hash += `${ ~ ~ ( attribute[ getters[ k ] ]( index ) * hashMultiplier + hashAdditive ) },`;

			}

		}

		// Add another reference to the vertex if it's already
		// used by another index
		if ( hash in hashToIndex ) {

			newIndices.push( hashToIndex[ hash ] );

		} else {

			// copy data to the new index in the temporary attributes
			for ( let j = 0, l = attributeNames.length; j < l; j ++ ) {

				const name = attributeNames[ j ];
				const attribute = geometry.getAttribute( name );
				const morphAttributes = geometry.morphAttributes[ name ];
				const itemSize = attribute.itemSize;
				const newArray = tmpAttributes[ name ];
				const newMorphArrays = tmpMorphAttributes[ name ];

				for ( let k = 0; k < itemSize; k ++ ) {

					const getterFunc = getters[ k ];
					const setterFunc = setters[ k ];
					newArray[ setterFunc ]( nextIndex, attribute[ getterFunc ]( index ) );

					if ( morphAttributes ) {

						for ( let m = 0, ml = morphAttributes.length; m < ml; m ++ ) {

							newMorphArrays[ m ][ setterFunc ]( nextIndex, morphAttributes[ m ][ getterFunc ]( index ) );

						}

					}

				}

			}

			hashToIndex[ hash ] = nextIndex;
			newIndices.push( nextIndex );
			nextIndex ++;

		}

	}

	// generate result BufferGeometry
	const result = geometry.clone();
	for ( const name in geometry.attributes ) {

		const tmpAttribute = tmpAttributes[ name ];

		result.setAttribute( name, new tmpAttribute.constructor(
			tmpAttribute.array.slice( 0, nextIndex * tmpAttribute.itemSize ),
			tmpAttribute.itemSize,
			tmpAttribute.normalized,
		) );

		if ( ! ( name in tmpMorphAttributes ) ) continue;

		for ( let j = 0; j < tmpMorphAttributes[ name ].length; j ++ ) {

			const tmpMorphAttribute = tmpMorphAttributes[ name ][ j ];

			result.morphAttributes[ name ][ j ] = new tmpMorphAttribute.constructor(
				tmpMorphAttribute.array.slice( 0, nextIndex * tmpMorphAttribute.itemSize ),
				tmpMorphAttribute.itemSize,
				tmpMorphAttribute.normalized,
			);

		}

	}

	// indices

	result.setIndex( newIndices );

	return result;

}

/**
 * Returns a new indexed geometry based on `TrianglesDrawMode` draw mode.
 * This mode corresponds to the `gl.TRIANGLES` primitive in WebGL.
 *
 * @param {BufferGeometry} geometry - The geometry to convert.
 * @param {number} drawMode - The current draw mode.
 * @return {BufferGeometry} The new geometry using `TrianglesDrawMode`.
 */
function toTrianglesDrawMode( geometry, drawMode ) {

	if ( drawMode === TrianglesDrawMode ) {

		console.warn( 'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles.' );
		return geometry;

	}

	if ( drawMode === TriangleFanDrawMode || drawMode === TriangleStripDrawMode ) {

		let index = geometry.getIndex();

		// generate index if not present

		if ( index === null ) {

			const indices = [];

			const position = geometry.getAttribute( 'position' );

			if ( position !== undefined ) {

				for ( let i = 0; i < position.count; i ++ ) {

					indices.push( i );

				}

				geometry.setIndex( indices );
				index = geometry.getIndex();

			} else {

				console.error( 'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.' );
				return geometry;

			}

		}

		//

		const numberOfTriangles = index.count - 2;
		const newIndices = [];

		if ( drawMode === TriangleFanDrawMode ) {

			// gl.TRIANGLE_FAN

			for ( let i = 1; i <= numberOfTriangles; i ++ ) {

				newIndices.push( index.getX( 0 ) );
				newIndices.push( index.getX( i ) );
				newIndices.push( index.getX( i + 1 ) );

			}

		} else {

			// gl.TRIANGLE_STRIP

			for ( let i = 0; i < numberOfTriangles; i ++ ) {

				if ( i % 2 === 0 ) {

					newIndices.push( index.getX( i ) );
					newIndices.push( index.getX( i + 1 ) );
					newIndices.push( index.getX( i + 2 ) );

				} else {

					newIndices.push( index.getX( i + 2 ) );
					newIndices.push( index.getX( i + 1 ) );
					newIndices.push( index.getX( i ) );

				}

			}

		}

		if ( ( newIndices.length / 3 ) !== numberOfTriangles ) {

			console.error( 'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.' );

		}

		// build final geometry

		const newGeometry = geometry.clone();
		newGeometry.setIndex( newIndices );
		newGeometry.clearGroups();

		return newGeometry;

	} else {

		console.error( 'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:', drawMode );
		return geometry;

	}

}

/**
 * Calculates the morphed attributes of a morphed/skinned BufferGeometry.
 *
 * Helpful for Raytracing or Decals (i.e. a `DecalGeometry` applied to a morphed Object with a `BufferGeometry`
 * will use the original `BufferGeometry`, not the morphed/skinned one, generating an incorrect result.
 * Using this function to create a shadow `Object3`D the `DecalGeometry` can be correctly generated).
 *
 * @param {Mesh|Line|Points} object - The 3D object to compute morph attributes for.
 * @return {Object} An object with original position/normal attributes and morphed ones.
 */
function computeMorphedAttributes( object ) {

	const _vA = new Vector3();
	const _vB = new Vector3();
	const _vC = new Vector3();

	const _tempA = new Vector3();
	const _tempB = new Vector3();
	const _tempC = new Vector3();

	const _morphA = new Vector3();
	const _morphB = new Vector3();
	const _morphC = new Vector3();

	function _calculateMorphedAttributeData(
		object,
		attribute,
		morphAttribute,
		morphTargetsRelative,
		a,
		b,
		c,
		modifiedAttributeArray
	) {

		_vA.fromBufferAttribute( attribute, a );
		_vB.fromBufferAttribute( attribute, b );
		_vC.fromBufferAttribute( attribute, c );

		const morphInfluences = object.morphTargetInfluences;

		if ( morphAttribute && morphInfluences ) {

			_morphA.set( 0, 0, 0 );
			_morphB.set( 0, 0, 0 );
			_morphC.set( 0, 0, 0 );

			for ( let i = 0, il = morphAttribute.length; i < il; i ++ ) {

				const influence = morphInfluences[ i ];
				const morph = morphAttribute[ i ];

				if ( influence === 0 ) continue;

				_tempA.fromBufferAttribute( morph, a );
				_tempB.fromBufferAttribute( morph, b );
				_tempC.fromBufferAttribute( morph, c );

				if ( morphTargetsRelative ) {

					_morphA.addScaledVector( _tempA, influence );
					_morphB.addScaledVector( _tempB, influence );
					_morphC.addScaledVector( _tempC, influence );

				} else {

					_morphA.addScaledVector( _tempA.sub( _vA ), influence );
					_morphB.addScaledVector( _tempB.sub( _vB ), influence );
					_morphC.addScaledVector( _tempC.sub( _vC ), influence );

				}

			}

			_vA.add( _morphA );
			_vB.add( _morphB );
			_vC.add( _morphC );

		}

		if ( object.isSkinnedMesh ) {

			object.applyBoneTransform( a, _vA );
			object.applyBoneTransform( b, _vB );
			object.applyBoneTransform( c, _vC );

		}

		modifiedAttributeArray[ a * 3 + 0 ] = _vA.x;
		modifiedAttributeArray[ a * 3 + 1 ] = _vA.y;
		modifiedAttributeArray[ a * 3 + 2 ] = _vA.z;
		modifiedAttributeArray[ b * 3 + 0 ] = _vB.x;
		modifiedAttributeArray[ b * 3 + 1 ] = _vB.y;
		modifiedAttributeArray[ b * 3 + 2 ] = _vB.z;
		modifiedAttributeArray[ c * 3 + 0 ] = _vC.x;
		modifiedAttributeArray[ c * 3 + 1 ] = _vC.y;
		modifiedAttributeArray[ c * 3 + 2 ] = _vC.z;

	}

	const geometry = object.geometry;
	const material = object.material;

	let a, b, c;
	const index = geometry.index;
	const positionAttribute = geometry.attributes.position;
	const morphPosition = geometry.morphAttributes.position;
	const morphTargetsRelative = geometry.morphTargetsRelative;
	const normalAttribute = geometry.attributes.normal;
	const morphNormal = geometry.morphAttributes.position;

	const groups = geometry.groups;
	const drawRange = geometry.drawRange;
	let i, j, il, jl;
	let group;
	let start, end;

	const modifiedPosition = new Float32Array( positionAttribute.count * positionAttribute.itemSize );
	const modifiedNormal = new Float32Array( normalAttribute.count * normalAttribute.itemSize );

	if ( index !== null ) {

		// indexed buffer geometry

		if ( Array.isArray( material ) ) {

			for ( i = 0, il = groups.length; i < il; i ++ ) {

				group = groups[ i ];

				start = Math.max( group.start, drawRange.start );
				end = Math.min( ( group.start + group.count ), ( drawRange.start + drawRange.count ) );

				for ( j = start, jl = end; j < jl; j += 3 ) {

					a = index.getX( j );
					b = index.getX( j + 1 );
					c = index.getX( j + 2 );

					_calculateMorphedAttributeData(
						object,
						positionAttribute,
						morphPosition,
						morphTargetsRelative,
						a, b, c,
						modifiedPosition
					);

					_calculateMorphedAttributeData(
						object,
						normalAttribute,
						morphNormal,
						morphTargetsRelative,
						a, b, c,
						modifiedNormal
					);

				}

			}

		} else {

			start = Math.max( 0, drawRange.start );
			end = Math.min( index.count, ( drawRange.start + drawRange.count ) );

			for ( i = start, il = end; i < il; i += 3 ) {

				a = index.getX( i );
				b = index.getX( i + 1 );
				c = index.getX( i + 2 );

				_calculateMorphedAttributeData(
					object,
					positionAttribute,
					morphPosition,
					morphTargetsRelative,
					a, b, c,
					modifiedPosition
				);

				_calculateMorphedAttributeData(
					object,
					normalAttribute,
					morphNormal,
					morphTargetsRelative,
					a, b, c,
					modifiedNormal
				);

			}

		}

	} else {

		// non-indexed buffer geometry

		if ( Array.isArray( material ) ) {

			for ( i = 0, il = groups.length; i < il; i ++ ) {

				group = groups[ i ];

				start = Math.max( group.start, drawRange.start );
				end = Math.min( ( group.start + group.count ), ( drawRange.start + drawRange.count ) );

				for ( j = start, jl = end; j < jl; j += 3 ) {

					a = j;
					b = j + 1;
					c = j + 2;

					_calculateMorphedAttributeData(
						object,
						positionAttribute,
						morphPosition,
						morphTargetsRelative,
						a, b, c,
						modifiedPosition
					);

					_calculateMorphedAttributeData(
						object,
						normalAttribute,
						morphNormal,
						morphTargetsRelative,
						a, b, c,
						modifiedNormal
					);

				}

			}

		} else {

			start = Math.max( 0, drawRange.start );
			end = Math.min( positionAttribute.count, ( drawRange.start + drawRange.count ) );

			for ( i = start, il = end; i < il; i += 3 ) {

				a = i;
				b = i + 1;
				c = i + 2;

				_calculateMorphedAttributeData(
					object,
					positionAttribute,
					morphPosition,
					morphTargetsRelative,
					a, b, c,
					modifiedPosition
				);

				_calculateMorphedAttributeData(
					object,
					normalAttribute,
					morphNormal,
					morphTargetsRelative,
					a, b, c,
					modifiedNormal
				);

			}

		}

	}

	const morphedPositionAttribute = new Float32BufferAttribute( modifiedPosition, 3 );
	const morphedNormalAttribute = new Float32BufferAttribute( modifiedNormal, 3 );

	return {

		positionAttribute: positionAttribute,
		normalAttribute: normalAttribute,
		morphedPositionAttribute: morphedPositionAttribute,
		morphedNormalAttribute: morphedNormalAttribute

	};

}

/**
 * Merges the {@link BufferGeometry#groups} for the given geometry.
 *
 * @param {BufferGeometry} geometry - The geometry to modify.
 * @return {BufferGeometry} - The updated geometry
 */
function mergeGroups( geometry ) {

	if ( geometry.groups.length === 0 ) {

		console.warn( 'THREE.BufferGeometryUtils.mergeGroups(): No groups are defined. Nothing to merge.' );
		return geometry;

	}

	let groups = geometry.groups;

	// sort groups by material index

	groups = groups.sort( ( a, b ) => {

		if ( a.materialIndex !== b.materialIndex ) return a.materialIndex - b.materialIndex;

		return a.start - b.start;

	} );

	// create index for non-indexed geometries

	if ( geometry.getIndex() === null ) {

		const positionAttribute = geometry.getAttribute( 'position' );
		const indices = [];

		for ( let i = 0; i < positionAttribute.count; i += 3 ) {

			indices.push( i, i + 1, i + 2 );

		}

		geometry.setIndex( indices );

	}

	// sort index

	const index = geometry.getIndex();

	const newIndices = [];

	for ( let i = 0; i < groups.length; i ++ ) {

		const group = groups[ i ];

		const groupStart = group.start;
		const groupLength = groupStart + group.count;

		for ( let j = groupStart; j < groupLength; j ++ ) {

			newIndices.push( index.getX( j ) );

		}

	}

	geometry.dispose(); // Required to force buffer recreation
	geometry.setIndex( newIndices );

	// update groups indices

	let start = 0;

	for ( let i = 0; i < groups.length; i ++ ) {

		const group = groups[ i ];

		group.start = start;
		start += group.count;

	}

	// merge groups

	let currentGroup = groups[ 0 ];

	geometry.groups = [ currentGroup ];

	for ( let i = 1; i < groups.length; i ++ ) {

		const group = groups[ i ];

		if ( currentGroup.materialIndex === group.materialIndex ) {

			currentGroup.count += group.count;

		} else {

			currentGroup = group;
			geometry.groups.push( currentGroup );

		}

	}

	return geometry;

}

/**
 * Modifies the supplied geometry if it is non-indexed, otherwise creates a new,
 * non-indexed geometry. Returns the geometry with smooth normals everywhere except
 * faces that meet at an angle greater than the crease angle.
 *
 * @param {BufferGeometry} geometry - The geometry to modify.
 * @param {number} [creaseAngle=Math.PI/3] - The crease angle in radians.
 * @return {BufferGeometry} - The updated geometry
 */
function toCreasedNormals( geometry, creaseAngle = Math.PI / 3 /* 60 degrees */ ) {

	const creaseDot = Math.cos( creaseAngle );
	const hashMultiplier = ( 1 + 1e-10 ) * 1e2;

	// reusable vectors
	const verts = [ new Vector3(), new Vector3(), new Vector3() ];
	const tempVec1 = new Vector3();
	const tempVec2 = new Vector3();
	const tempNorm = new Vector3();
	const tempNorm2 = new Vector3();

	// hashes a vector
	function hashVertex( v ) {

		const x = ~ ~ ( v.x * hashMultiplier );
		const y = ~ ~ ( v.y * hashMultiplier );
		const z = ~ ~ ( v.z * hashMultiplier );
		return `${x},${y},${z}`;

	}

	// BufferGeometry.toNonIndexed() warns if the geometry is non-indexed
	// and returns the original geometry
	const resultGeometry = geometry.index ? geometry.toNonIndexed() : geometry;
	const posAttr = resultGeometry.attributes.position;
	const vertexMap = {};

	// find all the normals shared by commonly located vertices
	for ( let i = 0, l = posAttr.count / 3; i < l; i ++ ) {

		const i3 = 3 * i;
		const a = verts[ 0 ].fromBufferAttribute( posAttr, i3 + 0 );
		const b = verts[ 1 ].fromBufferAttribute( posAttr, i3 + 1 );
		const c = verts[ 2 ].fromBufferAttribute( posAttr, i3 + 2 );

		tempVec1.subVectors( c, b );
		tempVec2.subVectors( a, b );

		// add the normal to the map for all vertices
		const normal = new Vector3().crossVectors( tempVec1, tempVec2 ).normalize();
		for ( let n = 0; n < 3; n ++ ) {

			const vert = verts[ n ];
			const hash = hashVertex( vert );
			if ( ! ( hash in vertexMap ) ) {

				vertexMap[ hash ] = [];

			}

			vertexMap[ hash ].push( normal );

		}

	}

	// average normals from all vertices that share a common location if they are within the
	// provided crease threshold
	const normalArray = new Float32Array( posAttr.count * 3 );
	const normAttr = new BufferAttribute( normalArray, 3, false );
	for ( let i = 0, l = posAttr.count / 3; i < l; i ++ ) {

		// get the face normal for this vertex
		const i3 = 3 * i;
		const a = verts[ 0 ].fromBufferAttribute( posAttr, i3 + 0 );
		const b = verts[ 1 ].fromBufferAttribute( posAttr, i3 + 1 );
		const c = verts[ 2 ].fromBufferAttribute( posAttr, i3 + 2 );

		tempVec1.subVectors( c, b );
		tempVec2.subVectors( a, b );

		tempNorm.crossVectors( tempVec1, tempVec2 ).normalize();

		// average all normals that meet the threshold and set the normal value
		for ( let n = 0; n < 3; n ++ ) {

			const vert = verts[ n ];
			const hash = hashVertex( vert );
			const otherNormals = vertexMap[ hash ];
			tempNorm2.set( 0, 0, 0 );

			for ( let k = 0, lk = otherNormals.length; k < lk; k ++ ) {

				const otherNorm = otherNormals[ k ];
				if ( tempNorm.dot( otherNorm ) > creaseDot ) {

					tempNorm2.add( otherNorm );

				}

			}

			tempNorm2.normalize();
			normAttr.setXYZ( i3 + n, tempNorm2.x, tempNorm2.y, tempNorm2.z );

		}

	}

	resultGeometry.setAttribute( 'normal', normAttr );
	return resultGeometry;

}

export {
	computeMikkTSpaceTangents,
	mergeGeometries,
	mergeAttributes,
	deepCloneAttribute,
	deinterleaveAttribute,
	deinterleaveGeometry,
	interleaveAttributes,
	estimateBytesUsed,
	mergeVertices,
	toTrianglesDrawMode,
	computeMorphedAttributes,
	mergeGroups,
	toCreasedNormals
};
````````

FILE: `vendor/addons/environments/RoomEnvironment.js`

````````javascript
import {
 	BackSide,
 	BoxGeometry,
 	InstancedMesh,
 	Mesh,
	MeshLambertMaterial,
 	MeshStandardMaterial,
 	PointLight,
 	Scene,
 	Object3D,
} from '../../three.module.js';

/**
 * This class represents a scene with a basic room setup that can be used as
 * input for {@link PMREMGenerator#fromScene}. The resulting PMREM represents the room's
 * lighting and can be used for Image Based Lighting by assigning it to {@link Scene#environment}
 * or directly as an environment map to PBR materials.
 *
 * The implementation is based on the [EnvironmentScene](https://github.com/google/model-viewer/blob/master/packages/model-viewer/src/three-components/EnvironmentScene.ts)
 * component from the `model-viewer` project.
 *
 * ```js
 * const environment = new RoomEnvironment();
 * const pmremGenerator = new THREE.PMREMGenerator( renderer );
 *
 * const envMap = pmremGenerator.fromScene( environment ).texture;
 * scene.environment = envMap;
 * ```
 *
 * @augments Scene
 * @three_import import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
 */
class RoomEnvironment extends Scene {

	constructor() {

		super();

		const geometry = new BoxGeometry();
		geometry.deleteAttribute( 'uv' );

		const roomMaterial = new MeshStandardMaterial( { side: BackSide } );
		const boxMaterial = new MeshStandardMaterial();

		const mainLight = new PointLight( 0xffffff, 900, 28, 2 );
		mainLight.position.set( 0.418, 16.199, 0.300 );
		this.add( mainLight );

		const room = new Mesh( geometry, roomMaterial );
		room.position.set( - 0.757, 13.219, 0.717 );
		room.scale.set( 31.713, 28.305, 28.591 );
		this.add( room );

		const boxes = new InstancedMesh( geometry, boxMaterial, 6 );
		const transform = new Object3D();

		// box1
		transform.position.set( - 10.906, 2.009, 1.846 );
		transform.rotation.set( 0, - 0.195, 0 );
		transform.scale.set( 2.328, 7.905, 4.651 );
		transform.updateMatrix();
		boxes.setMatrixAt( 0, transform.matrix );

		// box2
		transform.position.set( - 5.607, - 0.754, - 0.758 );
		transform.rotation.set( 0, 0.994, 0 );
		transform.scale.set( 1.970, 1.534, 3.955 );
		transform.updateMatrix();
		boxes.setMatrixAt( 1, transform.matrix );

		// box3
		transform.position.set( 6.167, 0.857, 7.803 );
		transform.rotation.set( 0, 0.561, 0 );
		transform.scale.set( 3.927, 6.285, 3.687 );
		transform.updateMatrix();
		boxes.setMatrixAt( 2, transform.matrix );

		// box4
		transform.position.set( - 2.017, 0.018, 6.124 );
		transform.rotation.set( 0, 0.333, 0 );
		transform.scale.set( 2.002, 4.566, 2.064 );
		transform.updateMatrix();
		boxes.setMatrixAt( 3, transform.matrix );

		// box5
		transform.position.set( 2.291, - 0.756, - 2.621 );
		transform.rotation.set( 0, - 0.286, 0 );
		transform.scale.set( 1.546, 1.552, 1.496 );
		transform.updateMatrix();
		boxes.setMatrixAt( 4, transform.matrix );

		// box6
		transform.position.set( - 2.193, - 0.369, - 5.547 );
		transform.rotation.set( 0, 0.516, 0 );
		transform.scale.set( 3.875, 3.487, 2.986 );
		transform.updateMatrix();
		boxes.setMatrixAt( 5, transform.matrix );

		this.add( boxes );


		// -x right
		const light1 = new Mesh( geometry, createAreaLightMaterial( 50 ) );
		light1.position.set( - 16.116, 14.37, 8.208 );
		light1.scale.set( 0.1, 2.428, 2.739 );
		this.add( light1 );

		// -x left
		const light2 = new Mesh( geometry, createAreaLightMaterial( 50 ) );
		light2.position.set( - 16.109, 18.021, - 8.207 );
		light2.scale.set( 0.1, 2.425, 2.751 );
		this.add( light2 );

		// +x
		const light3 = new Mesh( geometry, createAreaLightMaterial( 17 ) );
		light3.position.set( 14.904, 12.198, - 1.832 );
		light3.scale.set( 0.15, 4.265, 6.331 );
		this.add( light3 );

		// +z
		const light4 = new Mesh( geometry, createAreaLightMaterial( 43 ) );
		light4.position.set( - 0.462, 8.89, 14.520 );
		light4.scale.set( 4.38, 5.441, 0.088 );
		this.add( light4 );

		// -z
		const light5 = new Mesh( geometry, createAreaLightMaterial( 20 ) );
		light5.position.set( 3.235, 11.486, - 12.541 );
		light5.scale.set( 2.5, 2.0, 0.1 );
		this.add( light5 );

		// +y
		const light6 = new Mesh( geometry, createAreaLightMaterial( 100 ) );
		light6.position.set( 0.0, 20.0, 0.0 );
		light6.scale.set( 1.0, 0.1, 1.0 );
		this.add( light6 );

	}

	/**
	 * Frees internal resources. This method should be called
	 * when the environment is no longer required.
	 */
	dispose() {

		const resources = new Set();

		this.traverse( ( object ) => {

			if ( object.isMesh ) {

				resources.add( object.geometry );
				resources.add( object.material );

			}

		} );

		for ( const resource of resources ) {

			resource.dispose();

		}

	}

}

function createAreaLightMaterial( intensity ) {

	// create an emissive-only material. see #31348
	const material = new MeshLambertMaterial( {
		color: 0x000000,
		emissive: 0xffffff,
		emissiveIntensity: intensity
	} );

	return material;

}

export { RoomEnvironment };
````````

