/* =====================================================================
   JARVIS control layer for ZeroWatt Wind
   Voice commands  (Web Speech API)
   Hand gestures   (MediaPipe HandLandmarker)
   Face gestures   (MediaPipe FaceLandmarker)
   The mouse and keyboard keep working exactly as before.
   This file is plain JavaScript (not bundled) - edit it and just refresh.
   ===================================================================== */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v)), mean = a => a.reduce((s, x) => s + x, 0)/a.length;

/* ---------------------------------------------------------------------
   TUNING - every gesture threshold lives here
   --------------------------------------------------------------------- */
const B = {                              // base values at 100% sensitivity (the slider in the panel scales them)
  // hand
  pinchOn: .38, pinchOff: .62,          // separate press/release thresholds prevent chatter
  pinchHold: 100,                       // time based, independent of inference frame rate
  zoomVel: .008, zoomGain: 1.2,         // finger open/close speed that starts a zoom, and how strong the zoom is
  swipeDist: .25, swipeWindow: 450, swipeLock: 1600,   // fraction of the camera width, ms
  scrollGain: 1.2, scrollDead: .008, invertScroll: false,
  adjustGain: 1.2, stepEvery: .09,      // two-finger slide: slider sensitivity / distance per step for dropdowns
  marginX: .12, marginY: .10,           // the inner part of the camera image that maps to the whole screen
  // face
  yawOn: .19, yawOff: .09, yawHold: 350, // head turn needed to flip the window (ratio), and how long (ms) it must be held
  // blowing through the lips raises the wind speed
  blowOn: .65, blowOff: .35, blowHold: 650, blowMax: 2000,
  blowRate: 3.5                         // m/s of wind added per second of full blowing
};
const T = {...B};
let sens = .6; try { sens = clamp(+localStorage.getItem('jv-sens') || .6, .2, 1.5); } catch (e) {}
function applySens() {                  // lower sensitivity = bigger / faster movement needed
  const k = sens;
  T.zoomVel = B.zoomVel/k; T.zoomGain = B.zoomGain*k; T.swipeDist = clamp(B.swipeDist/k, .15, .6);
  T.scrollGain = B.scrollGain*k; T.scrollDead = B.scrollDead/k; T.adjustGain = B.adjustGain*k; T.stepEvery = B.stepEvery/k;
  T.yawOn = clamp(B.yawOn/Math.sqrt(k), .14, .34); T.yawOff = Math.min(T.yawOn*.5, B.yawOff);
}
applySens();
// the real mouse / keyboard always wins: while it is being used, hand gestures pause so they never fight it
let mouseUntil = 0;
['pointermove', 'pointerdown', 'wheel', 'keydown'].forEach(ev => window.addEventListener(ev, e => { if (e.isTrusted) mouseUntil = performance.now() + 1800; }, {passive: true, capture: true}));
const mouseBusy = () => performance.now() < mouseUntil;

/* ---------------------------------------------------------------------
   small helpers around the app (window.ZW is exposed by app.js)
   --------------------------------------------------------------------- */
const ZW = () => window.ZW;
const face = () => ZW().state().root;
const scene = () => ZW().state().scene;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const fmtNum = (v, step) => Number(v).toLocaleString('en-US', {maximumFractionDigits: step < .1 ? 2 : step < 1 ? 1 : 0});

function setRange(el, value) {
  const min = +el.min, max = +el.max, step = +el.step || 1;
  const v = clamp(Math.round((value - min)/step)*step + min, min, max);
  el.value = v; el.dispatchEvent(new Event('input', {bubbles: true}));
  return +el.value;
}
function cycleSelect(sel, dir = 1) {
  const n = sel.options.length; if (!n) return;
  sel.selectedIndex = (sel.selectedIndex + dir + n) % n;
  sel.dispatchEvent(new Event('change', {bubbles: true}));
  return sel.options[sel.selectedIndex].text.trim();
}
function stepButton(key, dir) {
  const b = $('[data-' + (dir > 0 ? 'inc' : 'dec') + '="' + key + '"]', face());
  if (!b || b.disabled) return false; b.click(); return true;
}
function stepCase(dir) {
  const z = ZW(), s = z.state(), list = z.scenarios[s.mode], i = list.findIndex(v => v.id === s.scenario.id);
  const nx = list[(i + dir + list.length) % list.length]; z.selectScenario(s, nx.id); return nx.name;
}
const flipLabel = () => ZW().mode() === 'air' ? 'Building ventilation' : 'Pond aeration';
function flipWindow(dir = 1) {
  const z = ZW(), host = $('#faces'), old = z.state(), ovp = $('.viewport', old.root);
  const native = document.fullscreenElement === ovp, expanded = ovp.classList.contains('expanded');
  const next = z.mode() === 'air' ? 'water' : 'air', label = next === 'air' ? 'Building ventilation' : 'Pond aeration';
  if (native || expanded) {                         // "fit to screen" belongs to ONE window, so hand it over to the other one
    const go = () => { z.switchMode(next); z.toggleFit(z.states[next]); setTimeout(() => lighten(camActive()), 120); };
    if (expanded) { z.toggleFit(old); go(); return label; }
    z.switchMode(next); const ns = z.states[next], nvp = $('.viewport', ns.root);       // real full screen: pass it straight to the other window
    nvp.requestFullscreen().then(() => lighten(camActive()), () => {                    // browser refused without a click: leave full screen and fill the window instead
      Promise.resolve(document.fullscreenElement ? document.exitFullscreen() : 0).catch(() => {}).then(() => { if (!nvp.classList.contains('expanded') && document.fullscreenElement !== nvp) z.toggleFit(ns); lighten(camActive()); });
    });
    return label;
  }
  z.switchMode(next); setTimeout(() => lighten(camActive()), 120);
  host.style.setProperty('--jv-dir', (dir > 0 ? 28 : -28) + 'deg'); host.classList.remove('jv-flip'); void host.offsetWidth; host.classList.add('jv-flip');
  setTimeout(() => host.classList.remove('jv-flip'), 500);
  return label;
}
// while the camera is on, draw the 3D scenes at pixel ratio 1 so the page keeps answering the mouse
function lighten(on) {
  try { const z = ZW(); for (const k in z.states) { const sc = z.states[k].scene; if (!sc || !sc.renderer) continue; const want = on ? 1 : Math.min(devicePixelRatio, 1.6); if (sc.renderer.getPixelRatio() !== want) { sc.renderer.setPixelRatio(want); sc.resize(); } } } catch (e) {}
}

/* =====================================================================
   HUD
   ===================================================================== */
const root = document.createElement('div'); root.id = 'jv-root';
root.innerHTML =
 '<div id="jv-cursors"></div><div id="jv-toast"></div>' +
 '<div id="jv-dock">' +
  '<div id="jv-panel" hidden>' +
   '<div class="jv-head"><span>J.A.R.V.I.S. · CONTROL</span><button id="jv-close" aria-label="Close panel">✕</button></div>' +
   '<div class="jv-modes">' +
    '<button class="jv-mode" data-jv="voice"><i>🎙</i>Voice<span>OFF</span></button>' +
    '<button class="jv-mode" data-jv="hands"><i>✋</i>Hands<span>OFF</span></button>' +
    '<button class="jv-mode" data-jv="face"><i>🙂</i>Face<span>OFF</span></button>' +
   '</div>' +
   '<button class="jv-all" id="jv-all">ACTIVATE ALL</button>' +
   '<div class="jv-cam" id="jv-cam"><video muted playsinline></video><canvas width="320" height="240"></canvas><div class="jv-cam-off">CAMERA OFF</div></div>' +
   '<div class="jv-rows">' +
    '<div class="jv-row"><b>VOICE</b><span id="jv-heard">—</span></div>' +
    '<div class="jv-row"><b>MIC</b><div><div class="jv-meter"><i id="jv-micfill"></i></div><span id="jv-micstate" style="display:block;margin-top:6px">off</span></div></div>' +
    '<div class="jv-row"><b>HAND</b><span id="jv-hand">—</span></div>' +
    '<div class="jv-row"><b>FACE</b><div><div class="jv-yaw"><i id="jv-yawdot"></i></div><span id="jv-face" style="display:block;margin-top:6px">—</span></div></div>' +
    '<div class="jv-row"><b>BLOW</b><div><div class="jv-meter"><i id="jv-blowfill"></i></div><span id="jv-blow" style="display:block;margin-top:6px">—</span></div></div>' +
   '</div>' +
   '<form id="jv-form" autocomplete="off"><input id="jv-input" placeholder="Type a command, e.g. increase the wind speed" aria-label="Type a command"></form>' +
   '<label class="jv-lang">Voice engine <select id="jv-voice-engine"><option value="offline">Offline English</option><option value="browser">Browser speech service</option></select></label>' +
   '<label class="jv-lang">Voice language <select id="jv-lang"><option value="en-US">English (US)</option><option value="en-GB">English (UK)</option><option value="en-IN">English (India)</option></select></label>' +
   '<label class="jv-sens">Gesture sensitivity <b id="jv-sens-val"></b><input type="range" id="jv-sens" min="20" max="150" step="5" aria-label="Gesture sensitivity"></label>' +
   '<label class="jv-check"><input type="checkbox" id="jv-speak"> Spoken replies (headphones recommended)</label>' +
   '<label class="jv-check"><input type="checkbox" id="jv-enable-blow"> Enable lip gesture to raise wind (optional)</label>' +
   '<button class="jv-all" id="jv-center">Recenter face — look straight</button>' +
   '<button class="jv-all" id="jv-stop">STOP ALL CONTROLS</button>' +
   '<details id="jv-help"><summary>WHAT CAN I SAY / DO?</summary>' +
    '<h4>VOICE</h4><ul>' +
     '<li>Leave <b>Voice engine</b> set to <b>Offline English</b>, turn Voice on, and wait for “Offline English ready”. Say one command, then pause. Audio is processed locally.</li>' +
     '<li><code>increase / decrease the wind speed</code> (also: air temperature, rain intensity, rotor diameter, gear reduction, room volume, occupants, duct pressure, pond volume, water temperature, oxygen demand, units, boats)</li>' +
     '<li><code>set the wind speed to 12</code>, <code>increase rain by 0.2</code>, <code>maximum / minimum wind</code></li>' +
     '<li><code>change the wind type</code> or <code>wind pattern gusts</code></li>' +
     '<li><code>next condition</code>, <code>monsoon</code>, <code>cyclone</code>, <code>heatwave</code>, <code>hot night</code>, <code>case 3</code></li>' +
     '<li><code>building ventilation</code>, <code>pond aeration</code>, <code>switch window</code></li>' +
     '<li><code>fit to screen</code>, <code>exit</code>, <code>close up</code>, <code>pause</code>, <code>play</code>, <code>flow off</code>, <code>reset camera</code>, <code>reset</code></li>' +
     '<li><code>zoom in / out</code>, <code>rotate left / right</code>, <code>scroll down / up</code>, <code>brake on / off</code>, <code>change the wind sensor</code>, <code>pick rugged parts</code></li>' +
    '</ul>' +
    '<h4>FACE</h4><ul><li>Look straight for one second to calibrate. Turn and hold your head left or right to switch windows. Return to centre before another turn. Use Recenter if needed.</li><li>Wind stays unchanged by default. Optional lip gesture: enable the checkbox, pucker for a moment, then relax. Each hold raises wind for at most two seconds. This detects lip shape, not real airflow. Keep it off while talking.</li></ul>' +
    '<h4>MOUSE</h4><ul><li>The mouse and keyboard always have priority: hand gestures pause for about 2 seconds whenever you use them.</li></ul>' +
    '<h4>HAND (one or two hands)</h4><ul>' +
     '<li><b>Cursor</b> follows your index fingertip.</li>' +
     '<li>Begin with thumb and index apart. Point the green ring at a control, then <b>pinch</b> thumb + index briefly to click. Separate them before the next click. Hold and move to drag a slider or rotate the 3D view. A pinch on a dropdown selects its next option.</li>' +
     '<li>Over the 3D scene: <b>open hand → close gradually</b> = zoom out; <b>close → open</b> = zoom in. Keep thumb and index apart.</li>' +
     '<li><b>Open palm, quick swipe</b> left / right = switch window.</li>' +
     '<li><b>Open palm, move</b> up / down = scroll.</li>' +
     '<li><b>Index + middle finger</b> over a control: hold still for half a second until the blue highlight appears, then slide left / right to adjust. Lower your fingers to release.</li>' +
    '</ul>' +
   '</details>' +
  '</div>' +
  '<button id="jv-orb" aria-expanded="false" aria-controls="jv-panel"><span class="jv-ring"></span><b>JARVIS</b><small id="jv-orb-state">OFFLINE</small></button>' +
 '</div>';
document.body.append(root);
const cursorsHost = $('#jv-cursors', root), toastEl = $('#jv-toast', root), panel = $('#jv-panel', root);
const heardEl = $('#jv-heard', root), handEl = $('#jv-hand', root), faceEl = $('#jv-face', root), yawDot = $('#jv-yawdot', root);
const previewVideo = $('video', root), overlay = $('canvas', root), ctx = overlay.getContext('2d');
const micFill = $('#jv-micfill', root), micEl = $('#jv-micstate', root), langEl = $('#jv-lang', root), engineEl = $('#jv-voice-engine', root);
const blowEl = $('#jv-blow', root), blowFill = $('#jv-blowfill', root), sensEl = $('#jv-sens', root), sensVal = $('#jv-sens-val', root);
sensEl.value = Math.round(sens*100); sensVal.textContent = sensEl.value + '%';
sensEl.addEventListener('input', () => { sens = clamp(sensEl.value/100, .2, 1.5); sensVal.textContent = sensEl.value + '%'; applySens(); try { localStorage.setItem('jv-sens', String(sens)); } catch (e) {} });

function toggleHud(open = panel.hidden) { panel.hidden = !open; $('#jv-orb', root).setAttribute('aria-expanded', String(open)); }
$('#jv-orb', root).addEventListener('click', () => toggleHud());
$('#jv-close', root).addEventListener('click', () => toggleHud(false));
// real browser fullscreen only shows the fullscreen element, so the HUD moves inside it while fullscreen is on
document.addEventListener('fullscreenchange', () => { (document.fullscreenElement || document.body).append(root); previewVideo.play?.().catch(() => {}); });

let toastTimer = 0;
function toast(msg, warn = false) { toastEl.textContent = msg; toastEl.classList.toggle('warn', warn); toastEl.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200); }
function setModeUi(name, state, label) {
  const b = $('[data-jv="' + name + '"]', root); b.classList.remove('on', 'busy', 'err'); if (state) b.classList.add(state); $('span', b).textContent = label;
  const live = $$('.jv-mode.on', root).length > 0; root.classList.toggle('live', live); $('#jv-orb-state', root).textContent = live ? 'LISTENING' : 'OFFLINE';
}

/* ---------- spoken replies ---------- */
let speakUntil = 0, lastSaid = '', sayId = 0;
function say(text) {
  if (!$('#jv-speak', root).checked || !('speechSynthesis' in window)) return;
  try {
    lastSaid = text; const id = ++sayId;
    const u = new SpeechSynthesisUtterance(text); u.rate = 1.05; u.pitch = .9;
    const vs = speechSynthesis.getVoices(), v = vs.find(x => /UK English Male|Daniel|Google UK English/i.test(x.name)) || vs.find(x => /^en/i.test(x.lang)); if (v) u.voice = v;
    speakUntil = performance.now() + 900 + text.length*85;           // safety net: never depends on onend firing (Chrome often skips it)
    u.onend = u.onerror = () => { if (id === sayId) speakUntil = performance.now() + 350; };
    const go = () => { try { speechSynthesis.speak(u); } catch (e) {} };
    if (speechSynthesis.speaking || speechSynthesis.pending) { speechSynthesis.cancel(); setTimeout(go, 80); } else go();
  } catch (e) { speakUntil = 0; }
}
// while Jarvis is speaking, drop only the transcripts that are just its own voice coming back through the mic
const normW = t => t.toLowerCase().replace(/[^a-z0-9. ]+/g, ' ').split(' ').filter(Boolean);
function isEcho(text) {
  if (performance.now() > speakUntil || !lastSaid) return false;
  const a = normW(text), b = new Set(normW(lastSaid)); if (a.length < 2) return false;
  return a.filter(w => b.has(w)).length/a.length >= .8;
}

/* =====================================================================
   VOICE COMMANDS
   ===================================================================== */
const ORD = {first: 1, second: 2, third: 3, fourth: 4, fifth: 5, one: 1, two: 2, three: 3, four: 4, five: 5};
const NUM = {zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100};
function numberWords(text) {
  const w = text.split(' '), out = [];
  for (let i = 0; i < w.length; i++) {
    if (!(w[i] in NUM) && !(w[i] === 'point' && w[i + 1] in NUM && NUM[w[i + 1]] < 10)) { out.push(w[i]); continue; }
    let n = 0;
    while (w[i] in NUM) {
      if (w[i] === 'hundred') n = Math.max(1, n)*100;
      else n += NUM[w[i]];
      i++;
      if (w[i] === 'and' && w[i + 1] in NUM) i++;
    }
    if (w[i] === 'point' && w[i + 1] in NUM && NUM[w[i + 1]] < 10) {
      let dec = ''; i++;
      while (w[i] in NUM && NUM[w[i]] < 10) dec += NUM[w[i++]];
      out.push(n + '.' + dec);
    } else out.push(String(n));
    i--;
  }
  return out.join(' ');
}

// aliases (longest first) -> slider key.  mode: which application has the slider
const VARS = [
  ['wind speed', 'wind'], ['speed of the wind', 'wind'], ['wind velocity', 'wind'], ['wind', 'wind'],
  ['air temperature', 'ambient'], ['ambient temperature', 'ambient'], ['outside temperature', 'ambient'], ['air temp', 'ambient'], ['temperature', 'ambient'], ['temp', 'ambient'], ['heat', 'ambient'],
  ['rain intensity', 'rain'], ['rainfall', 'rain'], ['rain', 'rain'], ['intensity', 'rain'],
  ['rotor diameter', 'diameter'], ['rotor size', 'diameter'], ['rotor', 'diameter'], ['diameter', 'diameter'],
  ['gear reduction', 'ratio'], ['gear ratio', 'ratio'], ['reduction', 'ratio'], ['gear', 'ratio'], ['ratio', 'ratio'],
  ['room volume', 'room', 'air'], ['room size', 'room', 'air'], ['room', 'room', 'air'],
  ['occupants', 'people', 'air'], ['occupancy', 'people', 'air'], ['people', 'people', 'air'], ['crowd', 'people', 'air'],
  ['background ventilation', 'backgroundACH', 'air'], ['background air changes', 'backgroundACH', 'air'], ['ventilation rate', 'backgroundACH', 'air'],
  ['duct pressure', 'pressure', 'air'], ['pressure', 'pressure', 'air'],
  ['pond volume', 'pond', 'water'], ['pond size', 'pond', 'water'], ['pond', 'pond', 'water'],
  ['water temperature', 'temp', 'water'], ['water temp', 'temp', 'water'],
  ['oxygen demand', 'oxygenDemand', 'water'], ['oxygen', 'oxygenDemand', 'water'],
  ['volume', 'VOLUME']
].sort((a, b) => b[0].length - a[0].length);
// amount of one "increase" / "decrease"
const STEP = {wind: 2, ambient: 3, rain: .1, diameter: .1, ratio: .5, room: 30, people: 2, backgroundACH: .2, pressure: 5, pond: 30, temp: 1.5, oxygenDemand: .1};
const UNIT_SAY = {wind: 'metres per second', ambient: 'degrees', temp: 'degrees', diameter: 'metres', room: 'cubic metres', pond: 'cubic metres', pressure: 'pascals', backgroundACH: 'air changes per hour'};
const HW = [
  [/wind sensor|anemometer/, 'windSensor'], [/co2|carbon dioxide|air quality sensor/, 'qualitySensor'], [/oxygen probe|oxygen sensor|dissolved oxygen/, 'qualitySensor'],
  [/rain sensor/, 'envSensor'], [/temperature probe|water probe/, 'envSensor'], [/microcontroller|micro controller|mcu|controller/, 'mcu'], [/enclosure|housing|box/, 'enclosure']
];
const INC = /\b(increase|increased|raise|boost|higher|more|up|add|bump|faster|stronger|hotter|warmer|bigger|larger|grow|plus|ramp|heavier|rise|climb|extend)\b/;
const DEC = /\b(decrease|decreased|reduce|lower|lessen|less|drop|down|cut|diminish|slower|cooler|colder|minus|subtract|smaller|shrink|fewer|remove|calm|weaker|lighter|dim|fall|decline)\b/;

function findVar(t) {
  const mode = ZW().mode();
  for (const [alias, key, only] of VARS) {
    if (!new RegExp('\\b' + alias + '\\b').test(t)) continue;
    let k = key; if (k === 'VOLUME') k = mode === 'air' ? 'room' : 'pond';
    if (only && only !== mode) { if (key !== 'VOLUME') return {wrongMode: only, key: k}; }
    return {key: k, alias};
  }
  return null;
}
function findUnits(t) {
  const mode = ZW().mode();
  if (/\b(units per boat|per boat)\b/.test(t)) return mode === 'water' ? 'upb' : null;
  if (/\b(boats?)\b/.test(t)) return mode === 'water' ? 'boats' : null;
  if (/\b(units?|turbines?|prototypes?|zerowatts?)\b/.test(t)) return mode === 'water' ? 'boats' : 'units';
  return null;
}

function parse(raw) {
  let t = raw.toLowerCase().replace(/(\d),(\d)/g, '$1.$2').replace(/(\d)\.(?=\d)/g, '$1DECIMAL')
    .replace(/[.,!?'"]/g, ' ').replace(/DECIMAL/g, '.').replace(/(?<=[a-z])-(?=[a-z])/g, ' ').replace(/\s+/g, ' ').trim();
  t = t.replace(/^(hey |ok |okay |hi )?(jarvis|jarvas|service|travis) ?/, '').replace(/^(please|can you|could you|would you) /, '').replace(/ please$/, '').trim();
  t = t.replace(/\b(wine|wend|winds|wynd)\b/g, 'wind').replace(/\b(increases|increasing)\b/g, 'increase').replace(/\b(decreases|decreasing|reduces|reducing|lowers|lowering)\b/g, 'decrease');
  // Offline English may transcribe the short imperative "set" as "said".
  t = t.replace(/^said (?=(the )?(wind|rain|air|water|room|pond|rotor|gear|occupants|people|units|boats|oxygen|background|duct)\b)/, 'set ')
    .replace(/\b(when|win) speed\b/g, 'wind speed');
  t = numberWords(t); t = t.replace(/\bco 2\b/g, 'co2').replace(/\bheat wave\b/g, 'heatwave').replace(/\bclose[- ]up\b/g, 'closeup').replace(/\bfull screen\b/g, 'fullscreen');
  if (!t) return null;
  const num = (t.match(/-?\d+(\.\d+)?/) || [])[0], has = r => r.test(t);

  /* --- assistant control --- */
  if (has(/^(stop listening|mute|go to sleep|sleep|be quiet)$/)) return () => { setVoice(false); return 'Voice control off'; };
  if (has(/^(help|show help|what can i say|show commands|commands)$/)) return () => { toggleHud(true); $('#jv-help', root).open = true; return 'Here are the commands'; };
  if (has(/^(hide|close) (the )?(panel|hud|jarvis|help)$/)) return () => { toggleHud(false); return 'Panel closed'; };
  if (has(/^(show|open) (the )?(panel|hud|jarvis)$/)) return () => { toggleHud(true); return 'Panel open'; };

  /* --- screen / view tools --- */
  const fitBtn = () => $('[data-tool="fit"]', face()), fitOn = () => fitBtn().getAttribute('aria-pressed') === 'true' || !!document.fullscreenElement || !!$('.viewport.expanded', face());
  if (has(/\b(fit|fits)\b.*\bscreen\b|\bfullscreen\b|\bmaximi[sz]e\b|\bexpand\b|\bfill the screen\b/) && !has(/\b(exit|leave|close|minimi[sz]e|quit|stop)\b/))
    return () => { if (fitOn()) return 'Already fitted to the screen'; fitBtn().click(); return 'Fitting to screen'; };
  if (has(/^(exit|escape|quit|leave|close|minimi[sz]e|go back|back|normal|shrink)( fullscreen| the screen| screen| full screen| view)?$/) || has(/\b(exit|leave|close|stop|quit)\b.*\b(fullscreen|fit)\b/) || has(/\b(exit|leave)\b/))
    return () => {
      if (fitOn()) { fitBtn().click(); return 'Exited full screen'; }
      if (ZW().dialogOpen()) { ZW().closeDialog(); return 'Closed'; }
      return 'Nothing to exit';
    };
  if (has(/\bcloseup\b/) || has(/\b(wide|field|normal|far) view\b/)) return () => {
    const b = $('[data-tool="view"]', face()), on = b.getAttribute('aria-pressed') === 'true';
    const want = has(/\b(wide|field|normal|far) view\b|\b(off|out|exit)\b/) ? false : has(/\bon\b/) ? true : !on;
    if (want !== on) b.click(); return want ? 'Close-up view' : 'Field view';
  };
  if (has(/\b(reset|home|centre|center|default)\b.*\b(camera|view)\b|\b(camera|view)\b.*\breset\b|^home$/)) return () => { $('[data-tool="home"]', face()).click(); return 'Camera reset'; };
  if (has(/^(reset|reset all|reset everything|reset conditions|reset the conditions|start over|defaults)$/)) return () => { $('[data-reset]', face()).click(); return 'Conditions reset'; };
  if (has(/\b(pause|freeze|stop the simulation|stop simulation|hold)\b/) && !has(/listening/)) return () => { const b = $('[data-tool="pause"]', face()); if (b.getAttribute('aria-pressed') !== 'true') b.click(); return 'Paused'; };
  if (has(/\b(play|resume|continue|unpause|start the simulation|start simulation)\b/)) return () => { const b = $('[data-tool="pause"]', face()); if (b.getAttribute('aria-pressed') === 'true') b.click(); return 'Playing'; };
  if (has(/\b(flow|flows|airflow|streamlines?)\b/) && !has(/\b(increase|decrease|set)\b/)) return () => {
    const b = $('[data-tool="flows"]', face()), on = b.getAttribute('aria-pressed') === 'true', want = has(/\b(off|hide|disable|stop)\b/) ? false : has(/\b(on|show|enable|start)\b/) ? true : !on;
    if (want !== on) b.click(); return want ? 'Flow on' : 'Flow off';
  };
  if (has(/\bzoom\b/)) return () => { animate(has(/\bout\b|\bback\b|\bwider\b|\baway\b/) ? 1.035 : .965, 0, has(/\b(lot|max|fully|all the way)\b/) ? 40 : 18); return has(/\bout\b|\bback\b|\bwider\b|\baway\b/) ? 'Zooming out' : 'Zooming in'; };
  if (has(/\b(rotate|orbit|turn|spin|look)\b.*\b(left|right|up|down)\b/)) return () => {
    const d = has(/\bleft\b/) ? [-.04, 0] : has(/\bright\b/) ? [.04, 0] : has(/\bup\b/) ? [0, .02] : [0, -.02]; animate(1, d, 16, true); return 'Rotating'; };
  if (has(/\bscroll\b/)) return () => { const up = has(/\b(up|top|upward)\b/); scrollBy(up ? -1 : 1, has(/\b(top|bottom|end)\b/) ? 8 : .7); return up ? 'Scrolling up' : 'Scrolling down'; };
  if (has(/\bbrake\b/)) return () => { const el = $('[data-toggle="brake"]', face()), want = has(/\b(off|release|disengage|free)\b/) ? false : true; if (el.checked !== want) el.click(); return want ? 'Brake on' : 'Brake off'; };
  if (has(/\b(rugged|robust|suggest|recommend|best)\b.*\b(parts|hardware|sensors?)\b|\bpick rugged\b/)) return () => { $('[data-suggest]', face()).click(); return 'Rugged parts selected'; };
  if (has(/\b(open|show)\b.*\bprototype\b/)) return () => { $('#reference-open').click(); return 'Prototype'; };

  /* --- windows --- */
  if (has(/\b(next|previous|other|another|different|switch|flip|change|toggle)\b.*\b(window|application|app|tab|page|screen)\b/) && !has(/fit|full/))
    return () => 'Window: ' + flipWindow(has(/previous/) ? -1 : 1);
  if (has(/\bbuilding\b|\bventilation\b/) && !has(/background/) && !findVar(t)) return () => { if (ZW().mode() !== 'air') flipWindow(); return 'Building ventilation'; };
  if (has(/\bbuilding ventilation\b/)) return () => { if (ZW().mode() !== 'air') flipWindow(); return 'Building ventilation'; };
  if (has(/\b(pond aeration|aeration)\b/) || (has(/\bpond\b/) && !has(/volume|size/) && !has(/\b(increase|decrease|set)\b/))) return () => { if (ZW().mode() !== 'water') flipWindow(); return 'Pond aeration'; };

  /* --- wind pattern / type --- */
  if (has(/\b(pattern|type|profile|kind)\b/) && has(/\bwind\b|\bpattern\b|\bprofile\b/) && !has(/sensor/)) return () => {
    const sel = $('[data-param-select="profile"]', face());
    const named = [['steady', /steady|constant/], ['gusts', /gust/], ['lull', /lull|repeating/], ['storm', /storm/]].find(([, r]) => r.test(t));
    if (named) { const i = [...sel.options].findIndex(o => o.value === named[0]); sel.selectedIndex = i; sel.dispatchEvent(new Event('change', {bubbles: true})); return 'Wind pattern: ' + sel.options[i].text; }
    return 'Wind pattern: ' + cycleSelect(sel, has(/previous|back/) ? -1 : 1);
  };
  if (has(/\bmount(ing)?\b/) && ZW().mode() === 'water') return () => 'Mounting: ' + cycleSelect($('[data-param-select="mount"]', face()), 1);

  /* --- sensors / microcontroller --- */
  if (has(/\b(change|next|switch|cycle|different|previous)\b/)) {
    const h = HW.find(([r]) => r.test(t));
    if (h) return () => { const sel = $('[data-hw="' + h[1] + '"]', face()); return sel ? 'Selected ' + cycleSelect(sel, has(/previous/) ? -1 : 1) : 'Not available here'; };
  }

  /* --- test cases / conditions --- */
  const caseWord = /\b(condition|conditions|case|scenario|environment|weather)\b/;
  const namedCase = [[/\b(breeze|rooftop|park)\b/, 1], [/\b(canyon|sheltered|lull)\b/, 2], [/\bheatwave\b/, 3], [/\bhot night\b|\bnight\b/, 3], [/\bmonsoon\b/, 4], [/\b(cyclone|storm|surge|hurricane|typhoon)\b/, 5]].find(([r]) => r.test(t));
  const caseNo = has(caseWord) ? (ORD[(t.match(/\b(first|second|third|fourth|fifth)\b/) || [])[0]] || (t.match(/\b([1-5])\b/) || [])[1] && +t.match(/\b([1-5])\b/)[1]) : null;
  const wantsCase = namedCase && !(has(/\b(wind|rain|temperature|rotor|gear)\b/) && has(INC) || has(DEC) && namedCase[1] !== 5);
  if (caseNo || (namedCase && !findVar(t)) || (namedCase && /\b(monsoon|cyclone|heatwave|hot night|canyon)\b/.test(t))) return () => {
    const z = ZW(), s = z.state(), list = z.scenarios[s.mode], i = (caseNo || namedCase[1]) - 1; z.selectScenario(s, list[i].id); return 'Case ' + (i + 1) + ': ' + list[i].name; };
  if (has(caseWord) && has(/\b(change|next|previous|back|switch|different|another|cycle|new)\b/)) return () => 'Condition: ' + stepCase(has(/previous|back|last/) ? -1 : 1);
  if (has(/^(next|previous)( one)?$/)) return () => 'Condition: ' + stepCase(has(/previous/) ? -1 : 1);

  /* --- number of units / boats --- */
  const uk = findUnits(t);
  if (uk && (has(INC) || has(DEC) || has(/\b(set|make|change)\b/))) return () => {
    const inc = has(INC) && !has(DEC), s = ZW().state(); let n = 1;
    if (num && has(/\b(set|make|change|to)\b/) && !has(/\bby\b/)) { const target = Math.round(+num), cur = Math.round(s.p[uk]), dir = target > cur ? 1 : -1; n = Math.abs(target - cur); for (let i = 0; i < n; i++) stepButton(uk, dir); return (uk === 'boats' ? 'Boats: ' : uk === 'upb' ? 'Units per boat: ' : 'Units: ') + Math.round(ZW().state().p[uk]); }
    if (num && has(/\bby\b/)) n = Math.round(+num);
    let moved = 0; for (let i = 0; i < n; i++) if (stepButton(uk, inc ? 1 : -1)) moved++;
    const val = Math.round(ZW().state().p[uk]); return moved ? (uk === 'boats' ? 'Boats: ' : uk === 'upb' ? 'Units per boat: ' : 'Units: ') + val : 'Already at the ' + (inc ? 'maximum' : 'minimum');
  };

  /* --- sliders: increase / decrease / set / max / min --- */
  const v = findVar(t);
  if (v) {
    if (v.wrongMode) return () => (v.wrongMode === 'air' ? 'That control is in Building ventilation' : 'That control is in Pond aeration');
    const [label, min, max, step, unit] = ZW().definitions[v.key];
    return () => {
      const el = $('[data-param="' + v.key + '"]', face()); if (!el) return 'That control is not available here';
      const cur = +el.value, st = STEP[v.key] || (max - min)/10; let target;
      if (has(/\b(max|maximum|maximise|maximize|highest|full|top)\b/) && !num) target = max;
      else if (has(/\b(min|minimum|minimise|minimize|lowest|zero|none|off)\b/) && !num) target = min;
      else if (num && has(/\bby\b/)) target = cur + (has(DEC) && !has(INC) ? -1 : 1)*+num;
      else if (num && (has(/\b(set|make|change)\b/) || ((has(INC) || has(DEC)) && has(/\b(to|at)\b/)))) target = +num;
      else if (num && (has(INC) || has(DEC))) target = cur + (has(DEC) ? -1 : 1)*+num;
      else if (has(DEC) && !has(INC)) target = cur - st;
      else if (has(INC)) target = cur + st;
      else return 'Say increase, decrease, or set ' + label.toLowerCase() + ' to a number';
      const got = setRange(el, target);
      return (label + ' ' + fmtNum(got, step) + ' ' + (UNIT_SAY[v.key] || unit.replace(': 1', 'to 1'))).trim();
    };
  }
  return null;
}

/* ---- little animations used by voice "zoom" and "rotate" ---- */
let anim = 0;
function animate(zoomF, orbit, frames, isOrbit) {
  clearInterval(anim); let n = 0;
  anim = setInterval(() => { const sc = scene(); if (sc) { if (isOrbit) sc.orbitBy(orbit[0], orbit[1]); else sc.zoomBy(zoomF); } if (++n >= frames) clearInterval(anim); }, 16);
}
function scrollableAt(x, y) {
  let el = document.elementFromPoint(x, y);
  while (el && el !== document.body) { const cs = getComputedStyle(el); if (/(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 2) return el; el = el.parentElement; }
  return null;
}
function scrollBy(dir, amount = .7, x, y) {
  if ($('.viewport.expanded') || document.fullscreenElement) return;
  const panelEl = $('.controls', face());
  let target = x != null ? scrollableAt(x, y) : null;
  if (!target && panelEl && panelEl.scrollHeight > panelEl.clientHeight + 2) target = panelEl;
  const dy = dir*amount*(target ? target.clientHeight : innerHeight);
  if (target) target.scrollBy({top: dy, behavior: 'smooth'}); else window.scrollBy({top: dy, behavior: 'smooth'});
}

/* ---- run a spoken / typed command ---- */
function runCommand(text) {
  heardEl.textContent = '“' + text + '”';
  let fn = null; try { fn = parse(text); } catch (e) { console.error('JARVIS parse error', e); }
  if (!fn) { heardEl.textContent = '“' + text + '” — not understood'; toast('Not understood: ' + text, true); return false; }
  let msg; try { msg = fn(); } catch (e) { console.error('JARVIS command error', e); toast('Could not do that', true); return false; }
  if (msg) { toast(msg); say(msg); }
  return true;
}

/* ---- speech recognition ---- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = null, voiceOn = false, voiceBusy = false, recErrs = 0, voiceSession = 0, recRetry = 0, localVoice = null, voiceAbort = null;
const safeParse = a => { try { return !!parse(a); } catch (e) { return false; } };
let micStream = null, micCtx = null, micTimer = 0;
const micSay = t => { micEl.textContent = t; };
function micMeterStop() { clearInterval(micTimer); if (micStream) micStream.getTracks().forEach(t => t.stop()); micStream = null; try { micCtx && micCtx.close(); } catch (e) {} micCtx = null; micFill.style.width = '0%'; }
function micMeterStart(stream) {          // live level bar: proves the browser really receives your microphone
  micMeterStop(); micStream = stream;
  try {
    micCtx = new (window.AudioContext || window.webkitAudioContext)(); if (micCtx.resume) micCtx.resume();
    const an = micCtx.createAnalyser(); an.fftSize = 512; micCtx.createMediaStreamSource(stream).connect(an); const buf = new Uint8Array(an.fftSize);
    micTimer = setInterval(() => { an.getByteTimeDomainData(buf); let m = 0; for (const x of buf) m = Math.max(m, Math.abs(x - 128)); micFill.style.width = Math.min(100, m/128*300) + '%'; }, 90);
  } catch (e) {}
}
async function micState() {            // ask for the microphone first so a refusal is visible instead of silent
  if (!navigator.mediaDevices?.getUserMedia) return {state: 'timeout'};
  let expired = false, timer;
  try {
    const request = navigator.mediaDevices.getUserMedia({audio: {channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true}})
      .then(st => { if (expired) { st.getTracks().forEach(t => t.stop()); return null; } return st; });
    const st = await Promise.race([request, new Promise(r => { timer = setTimeout(() => { expired = true; r(null); }, 12000); })]);
    return st ? {state: 'ok', stream: st} : {state: 'timeout'};
  } catch (e) { return {state: e && e.name === 'NotFoundError' ? 'none' : 'blocked'}; }
  finally { clearTimeout(timer); }
}
let voiceLang = 'en-US';
try { const saved = localStorage.getItem('jv-lang'), nav = navigator.language || ''; voiceLang = saved || ([...langEl.options].some(o => o.value === nav) ? nav : 'en-US'); } catch (e) {}
langEl.value = [...langEl.options].some(o => o.value === voiceLang) ? voiceLang : 'en-US'; voiceLang = langEl.value;
langEl.addEventListener('change', () => { voiceLang = langEl.value; try { localStorage.setItem('jv-lang', voiceLang); } catch (e) {} if (voiceOn) { try { rec && rec.abort(); } catch (e) {} } });
langEl.disabled = true;
engineEl.addEventListener('change', () => {
  setVoice(false); langEl.disabled = engineEl.value === 'offline';
  heardEl.textContent = engineEl.value === 'offline' ? 'Offline English selected. Turn Voice on; the first model load takes a moment.' : 'Browser speech service selected. It may need internet access. Turn Voice on.';
});
function voiceFailure(label, message) {
  setVoice(false); setModeUi('voice', 'err', label); heardEl.textContent = message; micSay(label.toLowerCase());
}
async function setVoice(on) {
  if (!on) { voiceSession++; voiceOn = voiceBusy = false; clearTimeout(recRetry); voiceAbort?.abort(); voiceAbort = null; localVoice?.stop(); localVoice = null; const old = rec; rec = null; try { old && old.abort(); } catch (e) {} micMeterStop(); micSay('off'); setModeUi('voice', '', 'OFF'); return; }
  if (voiceOn || voiceBusy) return;
  if (!window.isSecureContext || location.protocol === 'file:') { toast('Open http://localhost:5500 or an HTTPS link', true); heardEl.textContent = 'Run START-SERVER.bat, then open http://localhost:5500. Shared links need HTTPS.'; return; }
  const offline = engineEl.value === 'offline';
  if (!offline && !SR) { setModeUi('voice', 'err', 'N/A'); toast('Select Offline English for this browser', true); heardEl.textContent = 'Browser speech service is unavailable. Select Voice engine → Offline English, then turn Voice on.'; return; }
  const session = ++voiceSession; voiceBusy = true; setModeUi('voice', 'busy', 'LOADING');
  const mic = await micState();
  if (session !== voiceSession) { mic.stream?.getTracks().forEach(t => t.stop()); return; }
  if (mic.state === 'none' || mic.state === 'blocked') {
    voiceBusy = false;
    setModeUi('voice', 'err', mic.state === 'none' ? 'NO MIC' : 'BLOCKED'); toast(mic.state === 'none' ? 'No microphone found' : 'Microphone blocked', true);
    heardEl.textContent = mic.state === 'none' ? 'No microphone found.' : 'Microphone blocked — click the lock icon in the address bar and allow Microphone, then switch Voice on again.'; micSay('blocked'); return;
  }
  if (offline && !mic.stream) { voiceFailure('NO MIC', 'Microphone permission is still pending. Allow it, then turn Voice on again.'); return; }
  if (mic.stream) { micMeterStart(mic.stream); micSay('mic OK — speak, the bar should move'); } else micSay('mic permission pending');
  if (offline) {
    voiceAbort = new AbortController();
    try {
      if (!window.LocalVoice) throw new Error('Missing offline-voice.js. Extract the complete updated ZIP.');
      const local = await window.LocalVoice.start({stream:mic.stream, audioContext:micCtx, signal:voiceAbort.signal,
        onStatus: text => { if (session === voiceSession) { heardEl.textContent = text; micSay(text); } },
        onPartial: text => { if (voiceOn && session === voiceSession && text) heardEl.textContent = '… ' + text; },
        onFinal: text => { if (voiceOn && session === voiceSession && text.trim() && !isEcho(text)) runCommand(text); },
        onError: e => { if (session === voiceSession) voiceFailure('ERROR', 'Offline voice: ' + e.message); }
      });
      if (session !== voiceSession) { local.stop(); return; }
      localVoice = local; voiceBusy = false; voiceOn = true; setModeUi('voice', 'on', 'ON');
    } catch (e) { if (session === voiceSession && e.name !== 'AbortError') voiceFailure('ERROR', 'Offline voice: ' + e.message); }
    return;
  }
  voiceBusy = false;
  voiceOn = true; recErrs = 0; setModeUi('voice', 'on', 'ON');
  heardEl.textContent = location.protocol === 'file:' ? 'Opened as a file: Chrome often blocks speech on file:// pages. Use START-SERVER.bat (or Live Server) and open http://localhost:5500' : 'Listening… say “increase the wind speed”';
  startRec();
}
function startRec() {
  if (!voiceOn || rec) return;
  const r = rec = new SR(), done = new Set(), session = voiceSession; let started = performance.now(), lastError = '';
  const current = () => voiceOn && rec === r && session === voiceSession;
  r.lang = voiceLang; r.continuous = true; r.interimResults = true; r.maxAlternatives = 4;
  const fire = (i, alts) => { if (!current() || done.has(i)) return; done.add(i); const clean = alts.filter(t => !isEcho(t)); if (clean.length) runCommand(clean.find(safeParse) || clean[0]); };
  r.onstart = () => { if (!current()) return; started = performance.now(); micSay('listening — say one command, then pause'); };
  r.onaudiostart = () => { if (current()) micSay('engine hears the microphone'); };
  r.onspeechstart = () => { if (current()) micSay('speech detected…'); };
  r.onspeechend = () => { if (current()) micSay('processing…'); };
  r.onnomatch = () => { if (current()) { micSay('could not recognise — try again'); toast('Could not recognise that', true); } };
  r.onresult = e => {
    if (!current()) return;
    recErrs = 0;
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const res = e.results[i], alts = [...res].map(a => a.transcript.trim()).filter(Boolean);
      if (!alts.length || done.has(i)) continue;
      if (res.isFinal) fire(i, alts);
      else heardEl.textContent = '… ' + alts[0]; // previews never change the simulation
    }
  };
  r.onerror = e => {
    if (!current()) return;
    lastError = e.error;
    micSay('engine error: ' + e.error);
    if (e.error === 'not-allowed' || e.error === 'service-not-allowed') { voiceOn = false; setModeUi('voice', 'err', 'BLOCKED'); heardEl.textContent = 'Microphone / speech service blocked. Allow the microphone for this page (lock icon in the address bar). Voice works in Chrome and Edge only.'; }
    else if (e.error === 'audio-capture') { voiceOn = false; setModeUi('voice', 'err', 'NO MIC'); heardEl.textContent = 'No microphone found.'; }
    else if (e.error === 'network') { voiceFailure('SERVICE', 'Browser speech service returned network. The microphone may still work. Select Voice engine → Offline English, then turn Voice on.'); return; }
    else if (e.error === 'language-not-supported') { voiceOn = false; setModeUi('voice', 'err', 'LANGUAGE'); heardEl.textContent = 'Choose another voice language and turn Voice on again.'; }
    if (!voiceOn) micMeterStop();
  };                                             // "no-speech" and "aborted" are normal: the session simply restarts below
  r.onend = () => {
    if (rec !== r || session !== voiceSession) return;
    rec = null; if (!voiceOn) return;
    const quick = performance.now() - started < 1500 && lastError !== 'no-speech'; recErrs = quick ? recErrs + 1 : 0;
    if (recErrs > 6) { voiceFailure('SERVICE', 'Browser speech service ended repeatedly (' + (lastError || 'no error provided') + '). Select Voice engine → Offline English, then turn Voice on.'); return; }
    recRetry = setTimeout(startRec, quick ? Math.min(3000, 400*recErrs) : 200);
  };
  try { r.start(); } catch (e) { rec = null; voiceOn = false; micMeterStop(); setModeUi('voice', 'err', 'FAILED'); heardEl.textContent = 'Speech engine could not start: ' + e.message + '. Try Voice again in Chrome or Edge.'; }
}

/* =====================================================================
   CAMERA + MEDIAPIPE
   ===================================================================== */
const MP_VER = '0.10.14', CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@' + MP_VER, GCS = 'https://storage.googleapis.com/mediapipe-models/';
const SOURCES = [   // local copy first (works offline after running "npm run get-models"), then the internet
  {module: './vendor/mediapipe/vision_bundle.mjs', wasm: 'vendor/mediapipe/wasm', hand: 'vendor/mediapipe/hand_landmarker.task', face: 'vendor/mediapipe/face_landmarker.task'},
  {module: CDN + '/vision_bundle.mjs', wasm: CDN + '/wasm', hand: GCS + 'hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task', face: GCS + 'face_landmarker/face_landmarker/float16/1/face_landmarker.task'}
];
let mpModules = {}, mpOrder = [0, 1];
async function makeLandmarker(kind) {
  let lastErr;
  for (const si of mpOrder) {
    const src = SOURCES[si];
    try {
      const mod = mpModules[si] || (mpModules[si] = await import(src.module));
      const files = await mod.FilesetResolver.forVisionTasks(src.wasm);
      for (const delegate of ['GPU', 'CPU']) {
        try {
          const opts = {baseOptions: {modelAssetPath: src[kind], delegate}, runningMode: 'VIDEO'};
          const lm = kind === 'hand' ? await mod.HandLandmarker.createFromOptions(files, {...opts, numHands: 2, minHandDetectionConfidence: .5, minHandPresenceConfidence: .5, minTrackingConfidence: .5})
                                     : await mod.FaceLandmarker.createFromOptions(files, {...opts, numFaces: 1, outputFaceBlendshapes: true});
          mpOrder = [si, ...mpOrder.filter(i => i !== si)]; return lm;
        } catch (e) { lastErr = e; }
      }
    } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error('MediaPipe could not be loaded');
}

const cam = {stream: null, video: document.createElement('video'), on: false, last: -1, pending: null, raf: 0};
cam.video.muted = true; cam.video.playsInline = true;
async function startCamera() {
  if (cam.on) return true;
  if (cam.pending) return cam.pending;
  if (!navigator.mediaDevices?.getUserMedia) { toast('Camera needs https or localhost', true); return false; }
  cam.pending = openCamera();
  try { return await cam.pending; } finally { cam.pending = null; }
}
async function openCamera() {
  try {
    cam.stream = await navigator.mediaDevices.getUserMedia({video: {width: {ideal: 320}, height: {ideal: 240}, frameRate: {ideal: 30}, facingMode: 'user'}, audio: false});
    cam.video.srcObject = cam.stream; previewVideo.srcObject = cam.stream; await cam.video.play(); previewVideo.play().catch(() => {});
    cam.on = true; cam.last = -1; $('#jv-cam', root).classList.add('on'); cam.raf = requestAnimationFrame(loop); return true;
  } catch (e) { console.error(e); toast('Camera blocked or unavailable', true); return false; }
}
function stopCameraIfIdle() {
  if (handsOn || faceOn || $$('.jv-mode.busy', root).some(b => b.dataset.jv !== 'voice') || !cam.on) { if (!camActive()) lighten(false); return; }
  lighten(false);
  cam.stream?.getTracks().forEach(t => t.stop()); cam.on = false; cancelAnimationFrame(cam.raf); cam.video.srcObject = previewVideo.srcObject = null; $('#jv-cam', root).classList.remove('on'); ctx.clearRect(0, 0, overlay.width, overlay.height);
}

let handsOn = false, faceOn = false, handLm = null, faceLm = null, handsRequest = 0, faceRequest = 0;
async function setHands(on) {
  const request = ++handsRequest;
  if (!on) { handsOn = false; clearHands(); setModeUi('hands', '', 'OFF'); handEl.textContent = '—'; stopCameraIfIdle(); return; }
  setModeUi('hands', 'busy', 'LOADING');
  if (!(await startCamera())) { setModeUi('hands', 'err', 'NO CAM'); return; }
  if (request !== handsRequest) { stopCameraIfIdle(); return; }
  try { handLm = handLm || await makeLandmarker('hand'); } catch (e) { console.error(e); if (request !== handsRequest) return; setModeUi('hands', 'err', 'FAILED'); handEl.textContent = 'Could not load the hand model (needs internet once, or run npm run get-models).'; toast('Hand model failed to load', true); stopCameraIfIdle(); return; }
  if (request !== handsRequest) { stopCameraIfIdle(); return; }
  handsOn = true; lighten(true); setModeUi('hands', 'on', 'ON'); handEl.textContent = 'Show your hand';
}
async function setFace(on) {
  const request = ++faceRequest;
  if (!on) { faceOn = false; resetFace(); setModeUi('face', '', 'OFF'); faceEl.textContent = '—'; yawDot.style.left = '50%'; stopCameraIfIdle(); return; }
  setModeUi('face', 'busy', 'LOADING');
  if (!(await startCamera())) { setModeUi('face', 'err', 'NO CAM'); return; }
  if (request !== faceRequest) { stopCameraIfIdle(); return; }
  try { faceLm = faceLm || await makeLandmarker('face'); } catch (e) { console.error(e); if (request !== faceRequest) return; setModeUi('face', 'err', 'FAILED'); faceEl.textContent = 'Could not load the face model (needs internet once, or run npm run get-models).'; toast('Face model failed to load', true); stopCameraIfIdle(); return; }
  if (request !== faceRequest) { stopCameraIfIdle(); return; }
  faceOn = true; resetFace(); lighten(true); setModeUi('face', 'on', 'ON'); faceEl.textContent = 'Look straight for one second';
}

let lastInfer = 0, cycle = 0, cost = 0;
const camActive = () => handsOn || faceOn;
function loop() {                          // models run on the main thread: use at most ~20% of it, hands and face take turns, and back right off while the mouse is in use
  if (!cam.on) return;
  const v = cam.video, now = performance.now(), gap = mouseBusy() ? 350 : Math.max(50, cost*4);
  if (v.readyState >= 2 && v.currentTime !== cam.last && now - lastInfer >= gap) {
    cam.last = v.currentTime; lastInfer = now; cycle++;
    const both = handsOn && faceOn, doFace = faceOn && faceLm && (!both || cycle % 3 === 0), doHands = handsOn && handLm && (!both || cycle % 3 !== 0), t0 = performance.now();
    try {
      if (doHands) { ctx.clearRect(0, 0, overlay.width, overlay.height); const r = handLm.detectForVideo(v, now); processHands(r.landmarks || [], now); drawHands(r.landmarks || []); }
      if (doFace) { const r = faceLm.detectForVideo(v, now + .5); processFace(r.faceLandmarks || [], now, r.faceBlendshapes && r.faceBlendshapes[0] && r.faceBlendshapes[0].categories); }
    } catch (e) { console.error('JARVIS frame error', e); }
    cost = cost*.7 + (performance.now() - t0)*.3;
  }
  cam.raf = requestAnimationFrame(loop);
}
function drawHands(list) {
  ctx.fillStyle = '#c5dd9a'; ctx.strokeStyle = '#c5dd9a88'; ctx.lineWidth = 2;
  const W = overlay.width, H = overlay.height, links = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17]];
  for (const lm of list) { ctx.beginPath(); for (const [a, b] of links) { ctx.moveTo(lm[a].x*W, lm[a].y*H); ctx.lineTo(lm[b].x*W, lm[b].y*H); } ctx.stroke(); for (const p of lm) { ctx.beginPath(); ctx.arc(p.x*W, p.y*H, 3, 0, 7); ctx.fill(); } }
}

/* =====================================================================
   FACE GESTURE: turn the head right / left -> flip the window
   ===================================================================== */
let faceArmed = false, faceYaw = 0, faceSince = 0, faceLast = 0, faceNeutral = null, faceSamples = [], faceTurn = 0;
let blowing = false, blowAcc = 0, blowSet = -1, blowLevel = 0, blowLast = 0, blowSince = 0, blowStarted = 0, blowReady = false;
function resetBlow() { blowing = false; blowLevel = blowLast = blowSince = blowStarted = 0; blowReady = false; blowFill.style.width = '0%'; blowEl.textContent = 'Lip gesture off — wind stays unchanged'; }
function resetFace() { faceArmed = false; faceYaw = faceSince = faceLast = faceTurn = 0; faceNeutral = null; faceSamples = []; resetBlow(); }
$('#jv-enable-blow', root).addEventListener('change', resetBlow);
$('#jv-center', root).addEventListener('click', () => { resetFace(); faceEl.textContent = faceOn ? 'Look straight for one second' : 'Enable Face first'; });
function yawOf(lm) {                      // 0 = looking straight, about +-0.5 = fully turned
  const nose = lm[1], l = lm[234], r = lm[454], w = r.x - l.x;
  return Math.abs(w) < 1e-4 ? 0 : (nose.x - (l.x + r.x)/2)/w;
}
function blowScore(cats) {                // 0..1 from the face model's mouth blendshapes: puckered / rounded lips or puffed cheeks
  if (!cats) return 0;
  const g = n => (cats.find(c => c.categoryName === n) || {}).score || 0;
  const smile = (g('mouthSmileLeft') + g('mouthSmileRight'))/2;
  return clamp(Math.max(g('cheekPuff')*1.6, g('mouthPucker')*.8 + g('mouthFunnel')*.5) - smile*.5, 0, 1);
}
function processBlow(cats, now) {
  if (!$('#jv-enable-blow', root).checked) { resetBlow(); return; }
  if (mouseBusy() || voiceOn || performance.now() < speakUntil || faceNeutral === null || Math.abs(faceYaw) > T.yawOff) {
    resetBlow(); blowEl.textContent = voiceOn ? 'Turn Voice off to use the lip gesture' : 'Relax and look straight'; return;
  }
  if (blowLast && now - blowLast > 600) resetBlow();
  const dt = blowLast ? Math.min(.25, (now - blowLast)/1000) : .05; blowLast = now;
  blowLevel = blowLevel*.5 + blowScore(cats)*.5; blowFill.style.width = Math.round(blowLevel*100) + '%';
  const el = $('[data-param="wind"]', face());
  if (blowLevel < T.blowOff) { blowing = false; blowSince = 0; blowReady = true; }
  if (!blowing && blowReady && blowLevel > T.blowOn && el) {
    blowSince = blowSince || now;
    if (now - blowSince >= T.blowHold) { blowing = true; blowStarted = now; blowAcc = +el.value; blowSet = blowAcc; blowReady = false; }
  } else if (blowLevel <= T.blowOn) blowSince = 0;
  if (blowing && now - blowStarted >= T.blowMax) blowing = false;
  if (!blowing || !el) { blowEl.textContent = !blowReady ? 'Relax your lips to rearm' : blowSince ? 'Hold lip gesture…' : 'Pucker and hold to raise wind'; return; }
  if (Math.abs(+el.value - blowSet) > .25) blowAcc = +el.value;            // someone moved the slider meanwhile: continue from there
  const power = clamp((blowLevel - T.blowOff)/(1 - T.blowOff), 0, 1);
  blowAcc = clamp(blowAcc + T.blowRate*(.35 + .65*power)*dt, +el.min, +el.max);
  blowSet = setRange(el, blowAcc); blowEl.textContent = 'Blowing → wind ' + blowSet.toFixed(1) + ' m/s';
}
function processFace(faces, now, cats) {
  if (!faces.length) { resetFace(); faceEl.textContent = 'No face — look straight when you return'; return; }
  if (faceLast && now - faceLast > 900) resetFace();
  const dt = faceLast ? now - faceLast : 100; faceLast = now;
  const raw = yawOf(faces[0]);
  if (faceNeutral === null) {
    if (faceSamples.length && Math.abs(raw - faceSamples[0].yaw) > .06) faceSamples = [];
    faceSamples.push({yaw: raw, t: now}); faceEl.textContent = 'Calibrating — look straight and hold still';
    if (now - faceSamples[0].t >= 900) { faceNeutral = mean(faceSamples.map(s => s.yaw)); faceArmed = true; faceSamples = []; faceEl.textContent = 'Centered — ready'; }
    return;
  }
  faceYaw += (raw - faceNeutral - faceYaw)*(1 - Math.exp(-dt/160));
  yawDot.style.left = (50 + clamp(faceYaw/.5, -1, 1)*46) + '%';
  const a = Math.abs(faceYaw);
  if (mouseBusy() || document.hidden) { faceSince = faceTurn = 0; faceArmed = false; resetBlow(); faceEl.textContent = 'Mouse in use — return to centre'; return; }
  if (faceArmed) {
    faceEl.textContent = a > T.yawOn*.6 ? 'Turning ' + (faceYaw > 0 ? 'right' : 'left') + '…' : 'Straight';
    if (a > T.yawOn) {
      if (faceTurn !== Math.sign(faceYaw)) { faceSince = 0; faceTurn = Math.sign(faceYaw); }
      faceSince = faceSince || now;
      if (now - faceSince >= T.yawHold && !mouseBusy()) { faceArmed = false; faceSince = 0; const dir = faceYaw > 0 ? 1 : -1; const m = flipWindow(dir); faceEl.textContent = 'Turned ' + (dir > 0 ? 'right' : 'left') + ' → flipped'; toast('Window: ' + m); say(m); }
    } else faceSince = 0;
  } else if (a < T.yawOff) {
    faceSince = faceSince || now;
    if (now - faceSince >= T.yawHold) { faceArmed = true; faceSince = 0; faceEl.textContent = 'Straight — ready'; }
  } else faceSince = 0;
  processBlow(cats, now);
}

/* =====================================================================
   HAND GESTURES
   ===================================================================== */
const hands = [];
let lastSwipe = 0, lastZoom = 0;
const INTERACTIVE = 'button,select,input,label,a,summary,canvas,[role=tab]';
function newSlot() {
  const el = document.createElement('div'); el.className = 'jv-cursor'; el.innerHTML = '<i></i><b></b>'; cursorsHost.append(el);
  return {el, wrist: {x: 0, y: 0}, sx: null, sy: null, pinch: false, pinchSince: 0, pinchReady: false, pinchAim: null, prevE: null, v: [0, 0, 0, 0], hist: [], prevC: null, drag: null, lock: null, acc: 0, prevP: null, peaceSince: 0, scrollV: 0, hover: null, pose: '—'};
}
function clearHands() { for (const h of hands) { releaseHand(h); h.el.remove(); } hands.length = 0; }
function releaseHand(h) { h.pinch = false; h.pinchSince = 0; h.pinchReady = false; h.pinchAim = null; h.drag = null; h.peaceSince = 0; unlock(h); if (h.hover) { h.hover.classList.remove('jv-hover'); h.hover = null; } }
function unlock(h) { if (h.lock) { h.lock.box.classList.remove('jv-lock'); h.lock = null; } h.acc = 0; h.prevP = null; }

function analyze(lm, AR) {
  const D = (a, b) => Math.hypot((a.x - b.x)*AR, a.y - b.y);
  const palm = D(lm[0], lm[9]) || .1, tips = [8, 12, 16, 20], pips = [6, 10, 14, 18];
  const e = tips.map(t => D(lm[t], lm[0])/palm);                                  // finger extension in palm units (about 1 curled ... 2 stretched)
  const ext = tips.map((t, i) => D(lm[t], lm[0]) > D(lm[pips[i]], lm[0])*1.12);
  return {e, ext, nExt: ext.filter(Boolean).length, pinchD: D(lm[4], lm[8])/palm, palm};
}
function toScreen(px, py) {
  const nx = clamp(((1 - px) - T.marginX)/(1 - 2*T.marginX), 0, 1), ny = clamp((py - T.marginY)/(1 - 2*T.marginY), 0, 1);
  return [nx*(innerWidth - 2) + 1, ny*(innerHeight - 2) + 1];
}
const mid = (a, b) => ({x: (a.x + b.x)/2, y: (a.y + b.y)/2});

function processHands(list, now) {
  if (!ZW()) return;
  const AR = (cam.video.videoWidth/cam.video.videoHeight) || 1.333;
  const used = new Array(hands.length).fill(false);
  for (const lm of list) {
    let best = -1, bd = .3;
    hands.forEach((h, i) => { if (used[i]) return; const d = Math.hypot(h.wrist.x - lm[0].x, h.wrist.y - lm[0].y); if (d < bd) { bd = d; best = i; } });
    if (best < 0) { hands.push(newSlot()); used.push(true); best = hands.length - 1; } else used[best] = true;
    updateHand(hands[best], lm, now, AR);
  }
  for (let i = hands.length - 1; i >= 0; i--) if (!used[i]) { releaseHand(hands[i]); hands[i].el.remove(); hands.splice(i, 1); }
  handEl.textContent = hands.length ? hands.map((h, i) => (hands.length > 1 ? 'H' + (i + 1) + ' ' : '') + h.pose).join(' · ') : 'Show your hand';
}

function controlAt(x, y) {                      // what a two-finger slide would change here
  const el = document.elementFromPoint(x, y); if (!el) return null;
  const sel = el.closest('select'); if (sel) return {type: 'select', el: sel, box: sel.closest('.dd') || sel};
  const dd = el.closest('.dd'); if (dd) return {type: 'select', el: $('select', dd), box: dd};
  const ctl = el.closest('label.control'); if (ctl) return {type: 'range', el: $('input[type=range]', ctl), box: ctl};
  const st = el.closest('.stepper'); if (st) return {type: 'stepper', key: ($('[data-inc]', st) || {}).dataset?.inc, box: st};
  if (el.closest('.scenario-list')) return {type: 'cases', box: el.closest('.scenario-list')};
  if (el.closest('.application-menu')) return {type: 'tabs', box: el.closest('.application-menu')};
  return null;
}
function applyAdjust(h, dx) {                    // dx = hand movement as a fraction of the camera width, mirrored (right = positive)
  const L = h.lock; if (!L) return;
  if (L.type === 'range') { const el = L.el, min = +el.min, max = +el.max; const travel = Math.sign(dx)*Math.max(0, Math.abs(dx) - .025); setRange(el, L.startValue + travel*(max - min)*T.adjustGain); return; }
  h.acc += dx;
  while (Math.abs(h.acc) >= T.stepEvery) {
    const dir = h.acc > 0 ? 1 : -1; h.acc -= dir*T.stepEvery;
    if (L.type === 'select') cycleSelect(L.el, dir);
    else if (L.type === 'stepper') stepButton(L.key, dir);
    else if (L.type === 'cases') stepCase(dir);
    else if (L.type === 'tabs') flipWindow(dir);
  }
}
function clickAt(h, x, y) {
  const ripple = document.createElement('div'); ripple.className = 'jv-ripple'; ripple.style.left = x + 'px'; ripple.style.top = y + 'px'; cursorsHost.append(ripple); setTimeout(() => ripple.remove(), 520);
  const el = document.elementFromPoint(x, y); if (!el) return;
  // Hit-test the visible element first, so an underlying slider cannot steal a HUD click.
  const range = el.closest('input[type=range]') || $('input[type=range]', el.closest('label.control,.jv-sens') || document.createElement('i'));
  if (range) { h.drag = {type: 'range', el: range}; dragRange(range, x); return; }
  if (el.closest('canvas')) { h.drag = {type: 'orbit', x, y}; return; }
  const sel = el.closest('select') || ($('select', el.closest('.dd') || document.createElement('i')));
  if (sel) { cycleSelect(sel, 1); return; }
  const input = el.closest('input');
  if (input) { if (input.type === 'checkbox' || input.type === 'radio') input.click(); else input.focus(); return; }
  const target = el.closest('button,a,summary,[role=tab],label'); if (!target) return;
  const inp = target.matches('label') ? $('input', target) : null; if (inp && inp.type === 'range') return;
  (inp || target).click();
}
function dragRange(el, x) { const b = el.getBoundingClientRect(), f = clamp((x - b.left)/b.width, 0, 1); setRange(el, +el.min + f*(+el.max - +el.min)); }

function updateHand(h, lm, now, AR) {
  const a = analyze(lm, AR); h.wrist = {x: lm[0].x, y: lm[0].y};
  const cx = 1 - lm[9].x, cy = lm[9].y;                        // palm centre, mirrored so right = right
  if (h.prevT && now - h.prevT > 600) { releaseHand(h); h.prevE = null; h.hist.length = 0; h.prevC = null; }
  // A pinch always wins over zoom, even while fingers curl to make the pinch.
  const wantPinch = a.pinchD < (h.pinch || h.pinchSince ? T.pinchOff : T.pinchOn) && (h.pinch || a.e[0] > .75);
  if (a.pinchD > T.pinchOff) h.pinchReady = true;
  const peace = a.ext[0] && a.ext[1] && !a.ext[2] && !a.ext[3] && a.pinchD > .7 && !wantPinch;
  const openPalm = a.nExt >= 3 && a.pinchD > .7 && !peace && !wantPinch;
  const point = a.ext[0] && !a.ext[1] && !a.ext[2] && !a.ext[3] && !wantPinch;
  /* --- finger open/close speed: zoom only over the scene --- */
  const yieldM = mouseBusy(), dtf = h.prevT ? clamp((now - h.prevT)/33, .5, 12) : 1; h.prevT = now;   // dtf: camera frames' worth of time since the last update
  let zooming = false;
  const overScene = h.sx != null && document.elementFromPoint(h.sx, h.sy)?.tagName === 'CANVAS';
  if (h.prevE && !yieldM && !wantPinch && !h.pinch && a.pinchD > .7 && overScene && !h.lock && !peace) {
    const de = a.e.map((e, i) => (e - h.prevE[i])/dtf); h.v = h.v.map((v, i) => v*.7 + de[i]*.3);
    const allUp = h.v.every(v => v > T.zoomVel*.6) && Math.max(...h.v) > T.zoomVel, allDown = h.v.every(v => v < -T.zoomVel*.6) && Math.min(...h.v) < -T.zoomVel;
    if ((allUp || allDown) && scene()) { zooming = true; lastZoom = now; const m = mean(de); scene().zoomBy(Math.exp(-m*T.zoomGain*dtf)); }   // opening = zoom in, closing = zoom out
  } else h.v = [0, 0, 0, 0];
  h.prevE = a.e;
  /* --- cursor --- */
  const anchor = peace ? mid(lm[8], lm[12]) : lm[8];
  let [tx, ty] = toScreen(anchor.x, anchor.y);
  if (wantPinch && h.pinchReady && !h.pinchAim) h.pinchAim = {x: h.sx ?? tx, y: h.sy ?? ty, tipX: tx, tipY: ty};
  if (wantPinch && h.pinchAim) {
    const p = h.pinchAim;
    // Freeze aim while closing fingers. Once held, movement drags from that position.
    tx = p.x + (h.pinch ? tx - p.tipX : 0); ty = p.y + (h.pinch ? ty - p.tipY : 0);
  }
  if (h.sx == null) { h.sx = tx; h.sy = ty; } else { const dd = Math.hypot(tx - h.sx, ty - h.sy); if (dd > 2) { const al = 1 - Math.exp(-dtf*33/(dd > 90 ? 65 : 120)); h.sx += (tx - h.sx)*al; h.sy += (ty - h.sy)*al; } }
  h.sx = clamp(h.sx, 1, innerWidth - 1); h.sy = clamp(h.sy, 1, innerHeight - 1);
  h.el.style.left = h.sx + 'px'; h.el.style.top = h.sy + 'px';
  if (yieldM) {                                                 // the real mouse / keyboard is in use: hands step aside
    releaseHand(h); h.prevE = a.e; h.prevC = {x: cx, y: cy}; h.hist.length = 0; h.scrollV = 0; h.pose = 'MOUSE IN USE'; h.el.className = 'jv-cursor yield'; $('b', h.el).textContent = h.pose; return;
  }
  h.pose = h.pinch || wantPinch ? 'PINCH' : peace ? 'TWO FINGERS' : zooming ? 'ZOOM' : openPalm ? 'OPEN PALM' : point ? 'POINT' : a.nExt === 0 ? 'FIST' : 'HAND';
  h.el.className = 'jv-cursor' + (h.pinch ? ' pinch' : '') + (peace ? ' two' : '') + (openPalm ? ' open' : ''); $('b', h.el).textContent = h.pose;
  /* --- hover highlight (the cursor layer has pointer-events:none, so elementFromPoint sees through it) --- */
  const under = document.elementFromPoint(h.sx, h.sy), hov = !peace && under ? under.closest(INTERACTIVE) : null, mark = hov && hov.tagName !== 'CANVAS' ? hov : null;
  if (mark !== h.hover) { h.hover?.classList.remove('jv-hover'); h.hover = mark; mark?.classList.add('jv-hover'); }

  /* --- pinch: click / drag --- */
  if (wantPinch && h.pinchReady) h.pinchSince = h.pinchSince || now;
  else h.pinchSince = 0;
  if (!h.pinch && h.pinchSince && now - h.pinchSince >= T.pinchHold) {
    h.pinch = true; h.pinchReady = false; unlock(h); clickAt(h, h.sx, h.sy);
    if (h.pinchAim) { const tip = toScreen(lm[8].x, lm[8].y); h.pinchAim.tipX = tip[0]; h.pinchAim.tipY = tip[1]; }
  }
  if (!wantPinch) { h.pinch = false; h.pinchSince = 0; h.pinchAim = null; h.drag = null; }
  if (h.pinch && h.drag) {
    if (h.drag.type === 'range') dragRange(h.drag.el, h.sx);
    else if (h.drag.type === 'orbit' && scene()) { scene().orbitBy(-(h.sx - h.drag.x)*.007, (h.sy - h.drag.y)*.005); h.drag.x = h.sx; h.drag.y = h.sy; }
  }

  /* --- two fingers: slide to change the variable under the cursor --- */
  if (peace && !h.pinch) {
    if (!h.lock) {
      const c = controlAt(h.sx, h.sy);
      if (!c || h.peaceTarget !== c.box) { h.peaceSince = now; h.peaceTarget = c?.box; }
      if (c && now - h.peaceSince >= 450) { h.lock = c; c.startValue = +c.el?.value; c.box.classList.add('jv-lock'); h.acc = 0; h.prevP = h.adjustStart = cx; }
    } else if (h.prevP != null) {
      applyAdjust(h, h.lock.type === 'range' ? cx - h.adjustStart : cx - h.prevP); h.prevP = cx;
    }
  } else { h.peaceSince = 0; h.peaceTarget = null; if (h.lock) unlock(h); }

  /* --- open palm: swipe = switch window, vertical move = scroll --- */
  if (openPalm && !zooming && now - lastZoom > 250) {
    h.hist.push({t: now, x: cx, y: cy}); while (h.hist.length && now - h.hist[0].t > T.swipeWindow) h.hist.shift();
    const o = h.hist[0];
    if (o && now - lastSwipe > T.swipeLock) {
      const dx = cx - o.x, dy = cy - o.y;
      if (Math.abs(dx) > T.swipeDist && Math.abs(dx) > 2.2*Math.abs(dy)) { lastSwipe = now; h.hist.length = 0; const m = flipWindow(dx > 0 ? 1 : -1); toast('Window: ' + m); say(m); }
    }
    if (h.prevC && now - lastSwipe > 400) {
      const fx = cx - h.prevC.x, fy = cy - h.prevC.y;
      h.scrollV = h.scrollV*.6 + fy*.4;
      if (Math.abs(h.scrollV) > T.scrollDead && Math.abs(fy) > 1.4*Math.abs(fx)) {
        const dir = (T.invertScroll ? -1 : 1), px = h.scrollV*innerHeight*T.scrollGain*dir, tgt = scrollableAt(h.sx, h.sy) || (face().querySelector('.controls'));
        if (!$('.viewport.expanded') && !document.fullscreenElement) { if (tgt && tgt.scrollHeight > tgt.clientHeight + 2) tgt.scrollTop += px; else window.scrollBy(0, px); }
      }
    }
  } else { h.hist.length = 0; h.scrollV = 0; }
  h.prevC = {x: cx, y: cy};
}

/* =====================================================================
   WIRING
   ===================================================================== */
$$('.jv-mode', root).forEach(b => b.addEventListener('click', () => {
  const k = b.dataset.jv, on = !b.classList.contains('on') && !b.classList.contains('busy');
  if (k === 'voice') setVoice(on); if (k === 'hands') setHands(on); if (k === 'face') setFace(on);
}));
$('#jv-all', root).addEventListener('click', async () => {
  const b = $('#jv-all', root); b.disabled = true;
  try { await Promise.allSettled([setVoice(true), setHands(true), setFace(true)]); }
  finally { b.disabled = false; }
  const n = $$('.jv-mode.on', root).length; toast(n === 3 ? 'All controls ready — look straight to calibrate' : n + ' of 3 controls active — check status rows', n !== 3);
});
function stopAll() { setVoice(false); setHands(false); setFace(false); clearInterval(anim); if ('speechSynthesis' in window) speechSynthesis.cancel(); speakUntil = 0; toast('All controls stopped'); }
$('#jv-stop', root).addEventListener('click', stopAll);
document.addEventListener('visibilitychange', () => { if (document.hidden) { clearHands(); resetFace(); if (voiceOn || voiceBusy) setVoice(false); } });
window.addEventListener('pagehide', stopAll);
$('#jv-form', root).addEventListener('submit', e => { e.preventDefault(); const i = $('#jv-input', root); if (i.value.trim()) runCommand(i.value.trim()); i.value = ''; });
document.addEventListener('keydown', e => { if (e.key === 'j' && e.altKey) { e.preventDefault(); toggleHud(); } });

// small debug / test hook
window.JARVIS = {command: runCommand, parse, feedHands: (list, now, ar) => { if (ar) { Object.defineProperty(cam.video, 'videoWidth', {value: 640, configurable: true}); Object.defineProperty(cam.video, 'videoHeight', {value: 480, configurable: true}); } processHands(list, now); }, feedFace: processFace, hands, T, toggleHud};
})();
