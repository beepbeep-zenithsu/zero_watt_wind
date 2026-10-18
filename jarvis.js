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
  pinchOn: .5, pinchOff: .75,           // thumb-to-index distance (palm units): closed below pinchOn, open above pinchOff
  pinchHold: 60,                        // ms a pinch must last (two camera frames also count, so slow cameras still click)
  dwellMs: 1000, dwellMove: 45,         // hover-to-click: hold the ring still over a button this long (ms), wobble allowed (px)
  zoomRate: .9, zoomPoseMs: 220,        // zoom speed (log units per second) while the hand pose is held, and how long a pose must be steady before it counts
  swipeDist: .25, swipeWindow: 450, swipeLock: 1600,   // fraction of the camera width, ms
  scrollGain: 1.2, scrollDead: .008, invertScroll: false,
  adjustGain: 1.2, stepEvery: .09,      // two-finger slide: slider sensitivity / distance per step for dropdowns
  marginX: .12, marginY: .10,           // the inner part of the camera image that maps to the whole screen
  // face
  yawOn: .085, yawOff: .045, yawHold: 110, // head turn needed to flip the window (ratio, about 10 degrees), and how long (ms) it must be held
  yawFlick: 1.1, yawCool: 450,          // a quick flick of this many 'yawOn' units within 400 ms also counts; minimum gap between two flips (ms)
  // head tilt (ear towards shoulder) changes the wind speed: tilt right = faster, tilt left = slower
  tiltOn: 11, tiltOff: 6, tiltFull: 26, // degrees away from your own upright position
  tiltHold: 300, tiltMax: 3000, tiltRate: 3.2,  // ms to hold before it starts, longest single push (ms), m/s of wind per second at a firm tilt
  // blowing through the lips raises the wind speed. The MICROPHONE decides; puckered lips (camera, optional) only make it more sensitive.
  blowOn: .35, blowOff: .2,             // lip-shape score that counts as 'lips puckered' (starting / keeping going)
  blowHold: 240, blowGap: 160,          // ms of steady breath sound before the wind starts rising, and the dropout (ms) that is bridged while blowing
  blowRate: 3,                          // m/s of wind added per second of blowing. Always the same, however hard you blow (the value STAYS when you stop)
  blowCalib: 10                         // microphone readings (about 0.8 s) used to measure the room noise first
};
const T = {...B};
let sens = .6; try { sens = clamp(+localStorage.getItem('jv-sens') || .6, .2, 1.5); } catch (e) {}
function applySens() {                  // lower sensitivity = bigger / faster movement needed
  const k = sens;
  T.swipeDist = clamp(B.swipeDist/k, .15, .6);
  T.scrollGain = B.scrollGain*k; T.scrollDead = B.scrollDead/k; T.adjustGain = B.adjustGain*k; T.stepEvery = B.stepEvery/k;
  T.yawOn = clamp(B.yawOn/Math.sqrt(k), .065, .2); T.yawOff = Math.min(T.yawOn*.55, B.yawOff);
  T.tiltOn = clamp(B.tiltOn/Math.sqrt(k), 8, 20); T.tiltOff = T.tiltOn*.55; T.tiltFull = T.tiltOn + 15;
}
applySens();
// the real mouse / keyboard always wins: while it is being used, hand gestures pause so they never fight it
let mouseUntil = 0;
['pointermove', 'pointerdown', 'wheel', 'keydown'].forEach(ev => window.addEventListener(ev, e => { if (e.isTrusted) mouseUntil = performance.now() + 1000; }, {passive: true, capture: true}));
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
   '<button class="jv-all" id="jv-camview" aria-pressed="true">CAMERA PICTURE: SHOWN — click to hide</button>' +
   '<div class="jv-rows">' +
    '<div class="jv-row"><b>VOICE</b><span id="jv-heard">—</span></div>' +
    '<div class="jv-row"><b>MIC</b><div><div class="jv-meter" id="jv-miclevel" role="meter" aria-label="Microphone input level" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i id="jv-micfill"></i></div><span id="jv-micstate" style="display:block;margin-top:6px">off</span></div></div>' +
    '<div class="jv-row"><b>HAND</b><span id="jv-hand">—</span></div>' +
    '<div class="jv-row"><b>FACE</b><div><div class="jv-yaw"><i id="jv-yawdot"></i></div><span id="jv-face" style="display:block;margin-top:6px">—</span></div></div>' +
    '<div class="jv-row"><b>BLOW</b><div><div class="jv-meter"><i id="jv-blowfill"></i></div><span id="jv-blow" style="display:block;margin-top:6px">—</span></div></div>' +
   '</div>' +
   '<form id="jv-form" autocomplete="off"><input id="jv-input" placeholder="Type a command, e.g. increase the wind speed" aria-label="Type a command"></form>' +
   '<button class="jv-all" id="jv-mic-test">CHECK MICROPHONE · 8 SECONDS</button>' +
   '<label class="jv-lang">Voice engine <select id="jv-voice-engine"><option value="offline">Offline English (recommended)</option><option value="auto">Online with offline fallback</option><option value="browser">Browser speech service</option></select></label>' +
   '<label class="jv-lang">Voice language <select id="jv-lang"><option value="mix">English ⇄ বাংলা (auto-switch)</option><option value="bn-BD">বাংলা (Bangladesh)</option><option value="en-IN">English (India)</option><option value="en-US">English (US)</option><option value="en-GB">English (UK)</option></select></label>' +
   '<label class="jv-sens">Gesture sensitivity <b id="jv-sens-val"></b><input type="range" id="jv-sens" min="20" max="150" step="5" aria-label="Gesture sensitivity"></label>' +
   '<label class="jv-check"><input type="checkbox" id="jv-dwell" checked> Hover to click (hold the ring still on a button for 1 s)</label>' +
   '<label class="jv-check"><input type="checkbox" id="jv-speak"> Spoken replies (headphones recommended)</label>' +
   '<label class="jv-check"><input type="checkbox" id="jv-tilt"> Head tilt changes wind — tilt right = faster, tilt left = slower</label>' +
   '<label class="jv-check"><input type="checkbox" id="jv-enable-blow"> Blow to raise wind (microphone only — no camera needed; speed stays when you stop)</label>' +
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
    '<h4>FACE</h4><ul><li><b>Change scenario:</b> face the screen for a second, then turn your head a little (about 10°). <b>Turn right = next scenario, turn left = back to the previous one.</b> Come back to the centre between turns. It works while the blow option is on, too.</li><li><b>Wind speed:</b> tilt your head (ear towards shoulder) and hold for a moment — <b>right = faster, left = slower</b>. Tilt back upright to stop. Untick the tilt option if you do not want it.</li><li>Talking, smiling and sitting still never change anything. Use <b>Recenter</b> if you change your sitting position. Blow option: tick it and stay quiet for one second while the room noise is measured, then blow toward the microphone (puckered lips work best; with Face on, they also make it more sensitive). The wind speed rises at a fixed, steady rate for as long as you blow — however hard — and <b>stays</b> where you stop (use the slider or Reset to lower it). Talking, humming and silence never change it.</li></ul>' +
    '<h4>MOUSE</h4><ul><li>The mouse and keyboard always have priority: hand gestures pause for about 2 seconds whenever you use them.</li></ul>' +
    '<h4>HAND (one or two hands)</h4><ul>' +
     '<li><b>Cursor</b> follows your index fingertip.</li>' +
     '<li><b>Easiest click:</b> point the green ring at a button and keep it still for 1 second (a ring fills up). <b>Or pinch</b> thumb + index together for a moment, then separate them before the next click. Hold and move to drag a slider or rotate the 3D view. A pinch on a dropdown selects its next option.</li>' +
     '<li><b>Zoom:</b> aim at the scene and <b>hold index + middle fingers up, still, for half a second</b> until the ring says ZOOM READY. Then <b>open your hand (4 fingers up) = zoom in</b>, <b>curl your fingers = zoom out</b>, and one or two fingers = hold still. Zoom runs at a steady speed only while you hold the pose, so it never drifts. Pinch to finish (it also ends after 2.5 seconds). The − / + buttons always work.</li>' +
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
  ['wind speed', 'wind'], ['speed of the wind', 'wind'], ['wind velocity', 'wind'], ['wind strength', 'wind'], ['wind', 'wind'], ['speed', 'wind'], ['strength', 'wind'], ['blow', 'wind'], ['blowing', 'wind'], ['airspeed', 'wind'],
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
const INC = /\b(increase|increased|raise|boost|higher|more|up|add|bump|faster|stronger|hotter|warmer|bigger|larger|grow|plus|ramp|heavier|rise|climb|extend|harder|quicker|accelerate|speed up|amplify|crank|enhance|intensify|strengthen|upgrade|heighten|elevate|lift|hike|swell|greater)\b/;
const DEC = /\b(decrease|decreased|reduce|lower|lessen|less|drop|down|cut|diminish|slower|cooler|colder|minus|subtract|smaller|shrink|fewer|remove|calm|weaker|lighter|dim|fall|decline|slow|weaken|soften|ease|decelerate|trim|low|softer|gentler|milder|reduced)\b/;

/* ---------------------------------------------------------------------
   UNDERSTANDING ACCENTS, SYNONYMS AND BANGLA
   Before a phrase is parsed, every word is mapped to the plain English command word it means:
   Bangla script (বাতাস বাড়াও), romanised Bangla (batas barao), common mis-hearings of an
   accented speaker (wine/win/when -> wind) and spelling-close words (mansoon -> monsoon).
   --------------------------------------------------------------------- */
const nfc = s => s.normalize('NFC').replace(/[\u200c\u200d]/g, '');
const toAsciiDigits = s => s.replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d));
const LEX = Object.create(null);
function L(canon, words) { for (const w of words.split(/\s+/)) if (w) LEX[nfc(w)] = canon; }
// --- the things being controlled
L('wind', 'বাতাস বাতাসের বাতাসে বাতাসটা হাওয়া হাওয়ার হাওয়াটা বায়ু বায়ুর উইন্ড উইণ্ড batas batash bataser batasher batase hawa hawar haoa bayu uind wynd');
L('speed', 'গতি গতির গতিবেগ বেগ বেগে স্পিড স্পীড জোর goti gotir gotibeg gati gatir bego spid spead jor');
L('rain', 'বৃষ্টি বৃষ্টির বৃষ্টিপাত বৃষ্টিতে বর্ষণ রেইন brishti bristi brishtir bristir brishtipat bristipat borshon');
L('temperature', 'তাপমাত্রা তাপমাত্রার টেম্পারেচার তাপ tapmatra tapomatra tapmatrar temparature temperatur');
L('hotter heat', 'গরম গরমে gorom gorome'); L('colder heat', 'ঠান্ডা ঠাণ্ডা thanda thanDa');
L('diameter', 'ব্যাস ব্যাসের byash'); L('gear', 'গিয়ার গিয়ারের giyar'); L('ratio', 'অনুপাত onupat anupat');
L('room', 'ঘর ঘরের কক্ষ রুম ghor ghorer kokkho kokkhe'); L('people', 'মানুষ মানুষের লোক লোকজন জন manush manusher lok lokjon');
L('pond', 'পুকুর পুকুরের পুকুরে দিঘি pukur pukure pukurer pukhur dighi'); L('aeration', 'এয়ারেশন eration');
L('building', 'ভবন ভবনের ভবনে বিল্ডিং দালান বাড়ি bhobon bhaban bhabon bhobone dalan bari bildin');
L('ventilation', 'ভেন্টিলেশন বায়ুচলাচল bayuchalachal bayuchalachol ventilesion');
L('window', 'জানালা জানালার জানালাটা উইন্ডো উইণ্ডো janala janla janalar windo windu'); L('scene', 'দৃশ্য দৃশ্যটা drishyo drisso');
L('flow', 'প্রবাহ প্রবাহের probaho prabaho probah'); L('camera', 'ক্যামেরা ক্যামেরার kyamera'); L('view', 'ভিউ');
L('screen', 'স্ক্রিন পর্দা পর্দায় porda skrin'); L('fullscreen', 'ফুলস্ক্রিন ফুল্স্ক্রিন'); L('simulation', 'সিমুলেশন simulesion');
L('condition', 'অবস্থা অবস্থায় পরিস্থিতি কন্ডিশন কেস obostha obosthay poristhiti kes');
L('monsoon', 'বর্ষা বর্ষাকাল মৌসুমি মৌসুমী মনসুন borsha borshakal mausumi mousumi'); L('cyclone', 'ঘূর্ণিঝড় ঘূর্ণিঝড়ে সাইক্লোন ghurnijhor ghurnijhar saiklon siklon cyklon ciclone');
L('storm', 'ঝড় ঝড়ের jhor jhar jhorer'); L('heatwave', 'তাপপ্রবাহ হিটওয়েভ tapprobaho tapprobah hitwave');
L('brake', 'ব্রেক ব্রেকের breek brek'); L('sensor', 'সেন্সর sensar senshor'); L('help', 'সাহায্য হেল্প sahajyo sahajjo');
// --- what to do
L('increase', 'বাড়াও বাড়ান বাড়ানো বাড়া বাড়ে বাড়িয়ে বাড়ুক বৃদ্ধি বেশি বেশী আরও আরো আরেকটু উঠাও তোলো তুলুন ইনক্রিজ ইনক্রীজ barao baraw barau baran barano bara bariye bariyo beshi besi beshe aro aaro arektu briddhi bridhi inkrij inkris uthao tolo tulo boro');
L('decrease', 'কমাও কমান কমানো কমা কম কমে কমিয়ে কমিয়ো কমুক হ্রাস নামাও নামান নামানো নামিয়ে ডিক্রিজ ডিক্রীজ komao komaw komau koman komano koma kom kome komiye komiyo komuk hras namao naman namano namiye dikrij dikris');
L('down', 'নিচে নীচে নিচু niche nich nichu'); L('up', 'উপরে উপর ওপরে ওপর upore upor oupore opore');
L('faster', 'জোরে জোরসে জোরালো দ্রুত তাড়াতাড়ি jore zore joray joresh druto'); L('slower', 'ধীরে ধীর আস্তে ধীরগতি dhire dhir dhiro aste ashte');
L('set', 'সেট রাখো রাখুন রাখেন রাখ rakho rakhun rakhen');
L('switch', 'বদলাও বদলান বদলে বদলানো পাল্টাও পাল্টান পাল্টে পাল্টানো পরিবর্তন সুইচ bodlao bodlan bodle bodlano boddle paltao paltan palte paltano poriborton porivortan suich');
L('change', 'চেঞ্জ'); L('other', 'অন্য অন্যটা অন্যটি অপর অপরটা onno onnota onnoti oporta');
L('next', 'পরের পরবর্তী পরেরটা porer porerta porobortti'); L('previous', 'আগের আগেরটা পূর্ববর্তী ager agerta');
L('pause', 'থামো থামাও থামান থামুন থাম থেমে থামাই থামা থমকাও স্থির thamo thamao thaman thamun tham thamen ruko rukho sthir');
L('play', 'চালাও চালান চালিয়ে চালাই চলুক চলো শুরু প্লে chalao chalan chaliye chalaw chalau cholo cholok shuru suru shuro');
L('on', 'চালু chalu'); L('off', 'বন্ধ বন্ধের bondho bondo bondhu bandho bondh bandh');
L('zoom', 'জুম জুমের jum joom zum'); L('closer', 'কাছে কাছাকাছি kache kachakachi'); L('farther', 'দূরে দূরের dure durer');
L('rotate', 'ঘোরাও ঘোরান ঘুরাও ঘুরান ঘুরো ঘোরো ঘুরিয়ে ঘোরিয়ে ঘোরানো ghorao ghoran ghurao ghuran ghuro ghoro ghurie ghoriye ghuriye');
L('left', 'বামে বাম বাঁয়ে বাঁ বাঁদিকে baame bame bam baam bayen baye bamdike'); L('right', 'ডানে ডান ডানদিকে dane dan daan dandike');
L('scroll', 'স্ক্রল স্ক্রোল scrol skrol'); L('reset', 'রিসেট রিস্টার্ট পুনরায় ডিফল্ট risett riset punoray default');
L('exit', 'বের বেরিয়ে বেরোও বেরিয়ো ber beriye berao beriyao'); L('sleep', 'ঘুমাও ঘুমান ghumao ghuman'); L('mute', 'চুপ চুপচাপ chup');
L('maximum', 'সর্বোচ্চ সর্বাধিক sorbocco sorboccho sorbadhik'); L('minimum', 'সর্বনিম্ন sorbonimno'); L('full', 'পুরো puro');
// --- spoken Bangla numbers become English number words, which the number parser already understands
L('', 'করো করুন করেন কর কোরো করে কোরে কইরা দাও দিন দেন দিয়ে দে একটু এখন এবার এটা ওটা এই ওই টা টি ভাই দয়া দিকে koro korun koren kor kore kori dao din den diye ektu ekhon ebar eta ota ei oi bhai doya dike');
L('zero', 'শূন্য শুন্য shunno sunno'); L('one', 'এক ek'); L('two', 'দুই দুটি দুটো dui duto duti dwi'); L('three', 'তিন তিনটি তিনটা tin tinta');
L('four', 'চার চারটি char charta'); L('five', 'পাঁচ পাচ পাঁচটি panch pach paanch'); L('six', 'ছয় ছয়টি choy chhoy chhoi choi');
L('seven', 'সাত সাতটি shat saat'); L('eight', 'আট আটটি aat aath'); L('nine', 'নয় নয়টি noy nou'); L('ten', 'দশ dosh dos');
L('eleven', 'এগারো এগার egaro'); L('twelve', 'বারো baro baaro'); L('thirteen', 'তেরো তের tero tera'); L('fourteen', 'চৌদ্দ choudda choddo');
L('fifteen', 'পনেরো পনের ponero'); L('sixteen', 'ষোল sholo'); L('seventeen', 'সতেরো সতের shotero sotero'); L('eighteen', 'আঠারো আঠার atharo');
L('nineteen', 'উনিশ unish'); L('twenty', 'বিশ bish'); L('thirty', 'ত্রিশ trish tirish'); L('forty', 'চল্লিশ challish'); L('fifty', 'পঞ্চাশ ponchash');
L('sixty', 'ষাট'); L('seventy', 'সত্তর shottor'); L('eighty', 'আশি ashi'); L('ninety', 'নব্বই nobboi'); L('hundred', 'শত একশো একশ shoto eksho');
L('point', 'দশমিক doshomik dosomik'); L('sade', 'সাড়ে sade sare'); L('1.5', 'দেড় der'); L('2.5', 'আড়াই arai');
L('first', 'প্রথম prothom'); L('second', 'দ্বিতীয় ditiyo'); L('third', 'তৃতীয় tritiyo'); L('fourth', 'চতুর্থ chaturtho'); L('fifth', 'পঞ্চম ponchom');
// multi-word Bangla expressions, matched before single words (spaces on both sides are required)
const PHRASES = [
  [/(?<= )(?:ঠিক|thik) (?:কর(?:ো|ুন|েন)?|kor(?:o|un|en)?)(?= )/g, 'set'],
  [/(?<= )(?:সবচেয়ে|সবচেয়ে|sobcheye) (?:বেশি|বেশী|beshi)(?= )/g, 'maximum'], [/(?<= )(?:সবচেয়ে|sobcheye) (?:কম|kom)(?= )/g, 'minimum'],
  [/(?<= )(?:গরম|gorom) (?:রাত|raat|rat)(?= )/g, 'hot night'],
  [/(?<= )(?:শোনা|শুনো|শুনতে|shona|shuno) (?:বন্ধ|bondho|bondo)(?= )/g, 'stop listening'],
  [/(?<= )(?:জুম|jum|zoom) (?:ইন|in)(?= )/g, 'zoom in'], [/(?<= )(?:জুম|jum|zoom) (?:আউট|aut|out)(?= )/g, 'zoom out'],
  [/(?<= )(?:ফিট|fit) (?:টু |to )?(?:স্ক্রিন|পর্দা|screen|porda)(?= )/g, 'fit screen'],
  [/(?<= )(?:বন্ধ|bondho|bondo) (?:কর(?:ো|ুন)?|koro|korun)(?= )/g, 'off'], [/(?<= )(?:চালু|chalu) (?:কর(?:ো|ুন)?|koro|korun)(?= )/g, 'on']
];
const bnSuffix = ['গুলো', 'গুলি', 'টার', 'টির', 'টা', 'টি', 'ের', 'কে', 'তে', 'য়', 'ে', 'র', 'ও', 'ই'];
function stemBn(tok) { for (const s of bnSuffix) if (tok.length > s.length + 1 && tok.endsWith(s)) { const r = LEX[tok.slice(0, -s.length)]; if (r !== undefined) return r; } return null; }
// words that are already right: never "corrected" by fuzzy matching
const TARGETS = ('wind speed increase decrease temperature ambient rain rainfall intensity rotor diameter gear ratio reduction room volume occupants occupancy people crowd background ventilation duct pressure pond water oxygen demand units boats turbines prototypes building aeration window application switch change toggle flip next previous other another different monsoon cyclone storm hurricane typhoon heatwave canyon sheltered breeze rooftop park night condition conditions case scenario environment weather pattern profile steady constant gusts lull repeating sensor anemometer microcontroller enclosure housing probe mounting brake rugged parts hardware sensors zoom rotate orbit spin scroll pause freeze resume continue play reset camera view fullscreen screen maximize minimize expand exit leave close quit listening sleep help commands panel closeup flow airflow streamlines maximum minimum highest lowest raise reduce lower boost faster slower stronger weaker higher hotter cooler colder warmer bigger smaller larger shrink heavier lighter simulation prototype left right top bottom upward downward scene strength accelerate').split(' ');
const KEEP = new Set([...TARGETS, ...'the and for with this that then than from into over what when where which while about also just only some very much many more less well here there been have has had does did can could would should will may might shall are was were not yes okay hey please jarvis start stop hold wait halt then now back side home open show hide down upon like want need make give take turn look move come goes going went them they their your mine ours ones zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty thirty forty fifty sixty seventy eighty ninety hundred point first second third fourth fifth closer nearer farther further enlarge normal field wide near far full upward downward slow quick quicker amplify crank enhance intensify strengthen weaken soften ease decelerate trim lessen heighten elevate lift hike upgrade begin proceed run said'.split(' '), ...(INC.source + ' ' + DEC.source).match(/[a-z]{3,}/g)]);
const nrm = s => s.replace(/ph/g, 'f').replace(/ck/g, 'k').replace(/[cq]/g, 'k').replace(/x/g, 'ks').replace(/z/g, 'j').replace(/v/g, 'w').replace(/(.)\1+/g, '$1');
const POOL = [], poolSeen = new Set();
for (const w of TARGETS) if (w.length >= 4) { const n = nrm(w); if (!poolSeen.has(n)) { poolSeen.add(n); POOL.push([n, w, false]); } }
for (const k in LEX) if (/^[a-z]{4,}$/.test(k) && LEX[k]) { const n = nrm(k); if (!poolSeen.has(n)) { poolSeen.add(n); POOL.push([n, LEX[k], true]); } }
function editDistance(a, b) {          // Damerau-Levenshtein: a swapped pair of letters counts as one mistake
  const m = a.length, n = b.length, d = Array.from({length: m + 1}, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
  }
  return d[m][n];
}
function fuzzyWord(tok) {              // the nearest command word, if it is close enough (looser for longer words)
  const n = nrm(tok), len = n.length, maxd = len <= 5 ? 1 : len <= 8 ? 2 : 3; let best = null, bd = 99;
  for (const [pn, canon, bangla] of POOL) {
    const lim = bangla ? (len >= 6 ? 1 : 0) : maxd;      // Bangla spellings vary, but short ones must not swallow English words ("nice" is not "niche")
    if (pn[0] !== n[0] || Math.abs(pn.length - len) > lim) continue;
    const d = editDistance(n, pn); if (d <= lim && d < bd) { bd = d; best = canon; }
  }
  return best;
}
// mis-hearings that are safe in any sentence
const MIS = {spit: 'speed', sped: 'speed', spid: 'speed', speeds: 'speed', increas: 'increase', incris: 'increase', increased: 'increase', decrees: 'decrease', decreased: 'decrease',
  rein: 'rain', rane: 'rain', zoon: 'zoom', zum: 'zoom', joom: 'zoom', paws: 'pause', pawz: 'pause', poz: 'pause', pose: 'pause', recent: 'reset', reseat: 'reset', break: 'brake', brick: 'brake',
  routed: 'rotate', mansoon: 'monsoon', munsoon: 'monsoon', monsun: 'monsoon', sicklone: 'cyclone', psyclone: 'cyclone', hitwave: 'heatwave', windo: 'window'};
// mis-hearings that only make sense next to another command word ("when speed", "bond volume", "rotate lift")
const CTX_CMD = new Set('speed increase decrease set up down more less faster slower higher lower raise reduce volume aeration pattern type size intensity'.split(' '));
const CTX = {wind: 'win when wine wend wand wing wined winds', rain: 'ring rang', pond: 'bond pound pawn pone', pattern: 'pattern', gusts: 'just gas gast gus', steady: 'study stady', left: 'lift laughed lef', right: 'write rite ride'};
const CTX_MAP = {}; for (const k in CTX) for (const w of CTX[k].split(' ')) CTX_MAP[w] = k;
function canonWord(tok) {
  if (/^[\d.\-]+$/.test(tok)) return tok;
  if (tok in LEX) return LEX[tok];
  if (/[ঀ-৿]/.test(tok)) { const s = stemBn(tok); return s === null ? tok : s; }
  if (KEEP.has(tok)) return tok;
  if (tok in MIS) return MIS[tok];
  if (tok.length >= 4) { const f = fuzzyWord(tok); if (f) return f; }
  return tok;
}
function canon(t) {
  let s = ' ' + nfc(t).split(' ').filter(Boolean).join(' ') + ' ';
  for (const [re, rep] of PHRASES) s = s.replace(re, rep);
  let out = s.trim().split(' ').filter(Boolean).map(canonWord).filter(w => w !== '').join(' ').split(' ').filter(Boolean);
  const cmd = out.some(w => CTX_CMD.has(w)), turn = out.some(w => /^(rotate|turn|look|scroll|orbit|spin)$/.test(w));
  out = out.map(w => { const c = CTX_MAP[w]; if (!c || c === 'pattern') return w; if (c === 'left' || c === 'right') return turn ? c : w; if (c === 'gusts' || c === 'steady') return out.includes('pattern') || out.includes('type') ? c : w; return cmd ? c : w; });
  return out.join(' ');
}

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

function parseText(raw, useCanon) {
  raw = toAsciiDigits(nfc(raw));
  let t = raw.toLowerCase().replace(/(\d),(\d)/g, '$1.$2').replace(/(\d)\.(?=\d)/g, '$1DECIMAL')
    .replace(/[.,!?'"।॥‘’“”]/g, ' ').replace(/DECIMAL/g, '.').replace(/(?<=[a-z])-(?=[a-z])/g, ' ').replace(/\s+/g, ' ').trim();
  t = t.replace(/^(hey |ok |okay |hi |hello )?(jarvis|jarvas|jarvice|jarvish|jarbis|jervis|garvis|charvis|service|travis|jar vis|জারভিস|জার্ভিস|জারভিছ) ?/, '').replace(/^(please|can you|could you|would you) /, '').replace(/ please$/, '').trim();
  t = t.replace(/\b(wine|wend|winds|wynd)\b/g, 'wind').replace(/\b(increases|increasing)\b/g, 'increase').replace(/\b(decreases|decreasing|reduces|reducing|lowers|lowering)\b/g, 'decrease');
  // Offline English may transcribe the short imperative "set" as "said".
  t = t.replace(/^said (?=(the )?(wind|rain|air|water|room|pond|rotor|gear|occupants|people|units|boats|oxygen|background|duct)\b)/, 'set ')
    .replace(/\b(when|win) speed\b/g, 'wind speed');
  if (useCanon) t = canon(t);
  t = numberWords(t).replace(/\bsade (\d+(?:\.\d+)?)\b/g, (m, n) => String(+n + .5)); t = t.replace(/\bco 2\b/g, 'co2').replace(/\bheat wave\b/g, 'heatwave').replace(/\bclose[- ]up\b/g, 'closeup').replace(/\bfull screen\b/g, 'fullscreen');
  if (!t) return null;
  const num = (t.match(/-?\d+(\.\d+)?/) || [])[0], has = r => r.test(t), both = (a, b) => has(new RegExp('\\b(?:' + a + ')\\b.*\\b(?:' + b + ')\\b|\\b(?:' + b + ')\\b.*\\b(?:' + a + ')\\b'));   // both words, in either order (Bangla puts the verb last)

  /* --- assistant control --- */
  if (has(/^(stop listening|mute|go to sleep|sleep|be quiet)$/)) return () => { setVoice(false); return 'Voice control off'; };
  if (has(/^(help|show help|what can i say|show commands|commands)$/)) return () => { toggleHud(true); $('#jv-help', root).open = true; return 'Here are the commands'; };
  if (has(/^(hide|close) (the )?(panel|hud|jarvis|help)$/)) return () => { toggleHud(false); return 'Panel closed'; };
  if (has(/^(show|open) (the )?(panel|hud|jarvis)$/)) return () => { toggleHud(true); return 'Panel open'; };

  /* --- screen / view tools --- */
  const fitBtn = () => $('[data-tool="fit"]', face()), fitOn = () => fitBtn().getAttribute('aria-pressed') === 'true' || !!document.fullscreenElement || !!$('.viewport.expanded', face());
  if ((both('fit|fits', 'screen') || has(/\bfullscreen\b|\bmaximi[sz]e\b|\bexpand\b|\bfill the screen\b/)) && !has(/\b(exit|leave|close|minimi[sz]e|quit|stop|off)\b/))
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
  if ((has(/\b(pause|freeze|stop the simulation|stop simulation|hold|halt|standstill)\b/) || has(/^(stop|wait)$/) || both('simulation|sim', 'off|stop')) && !has(/listening/)) return () => { const b = $('[data-tool="pause"]', face()); if (b.getAttribute('aria-pressed') !== 'true') b.click(); return 'Paused'; };
  if (has(/\b(play|resume|continue|unpause|start|begin|proceed|run)\b/) || both('simulation|sim', 'on')) return () => { const b = $('[data-tool="pause"]', face()); if (b.getAttribute('aria-pressed') === 'true') b.click(); return 'Playing'; };
  if (has(/\b(flow|flows|airflow|streamlines?)\b/) && !has(/\b(increase|decrease|set)\b/)) return () => {
    const b = $('[data-tool="flows"]', face()), on = b.getAttribute('aria-pressed') === 'true', want = has(/\b(off|hide|disable|stop)\b/) ? false : has(/\b(on|show|enable|start)\b/) ? true : !on;
    if (want !== on) b.click(); return want ? 'Flow on' : 'Flow off';
  };
  if (has(/\b(zoom|closer|nearer|enlarge|farther|further)\b/)) return () => { const out = has(/\bout\b|\bback\b|\bwider\b|\baway\b|\bfarther\b|\bfurther\b/); animate(out ? 1.035 : .965, 0, has(/\b(lot|max|fully|all the way)\b/) ? 40 : 18); return out ? 'Zooming out' : 'Zooming in'; };
  if (both('rotate|orbit|turn|spin|look', 'left|right|up|down')) return () => {
    const d = has(/\bleft\b/) ? [-.04, 0] : has(/\bright\b/) ? [.04, 0] : has(/\bup\b/) ? [0, .02] : [0, -.02]; animate(1, d, 16, true); return 'Rotating'; };
  if (has(/\bscroll\b/)) return () => { const up = has(/\b(up|top|upward)\b/); scrollBy(up ? -1 : 1, has(/\b(top|bottom|end)\b/) ? 8 : .7); return up ? 'Scrolling up' : 'Scrolling down'; };
  if (has(/\bbrake\b/)) return () => { const el = $('[data-toggle="brake"]', face()), want = has(/\b(off|release|disengage|free)\b/) ? false : true; if (el.checked !== want) el.click(); return want ? 'Brake on' : 'Brake off'; };
  if (both('rugged|robust|suggest|recommend|best', 'parts|hardware|sensors?') || has(/\bpick rugged\b/)) return () => { $('[data-suggest]', face()).click(); return 'Rugged parts selected'; };
  if (has(/\b(open|show)\b.*\bprototype\b/)) return () => { $('#reference-open').click(); return 'Prototype'; };

  /* --- windows --- */
  if (both('next|previous|other|another|different|switch|flip|change|toggle|swap|shift|opposite', 'window|application|app|tab|page|screen|scene|mode|side') && !has(/fit|full|zoom|rotate|wind pattern|wind type|sensor|case|condition/))
    return () => 'Window: ' + flipWindow(has(/previous/) ? -1 : 1);
  if (has(/\bbuilding\b|\bventilation\b|\bhouse\b|\bindoors?\b/) && !has(/background/) && !findVar(t)) return () => { if (ZW().mode() !== 'air') flipWindow(); return 'Building ventilation'; };
  if (has(/\bbuilding ventilation\b/)) return () => { if (ZW().mode() !== 'air') flipWindow(); return 'Building ventilation'; };
  if (has(/\b(pond aeration|aeration)\b/) || (has(/\b(pond|fish|paddle)\b/) && !has(/volume|size/) && !has(/\b(increase|decrease|set)\b/)) || (has(/\bwater\b/) && !findVar(t) && !has(/\b(increase|decrease|set)\b/))) return () => { if (ZW().mode() !== 'water') flipWindow(); return 'Pond aeration'; };

  /* --- wind pattern / type --- */
  if (has(/\b(pattern|type|profile|kind)\b/) && has(/\bwind\b|\bpattern\b|\bprofile\b/) && !has(/sensor/) && !both('increase|decrease', 'wind speed')) return () => {
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
  let v = findVar(t);
  const words = t.split(' ').filter(Boolean);
  // short commands with no named control ("faster", "increase", "more", "বাড়াও") mean the wind speed
  if (!v && words.length <= 4 && (has(/\b(increase|raise|more|faster|stronger|higher|boost|bump|accelerate|harder|quicker)\b/) || has(/\b(decrease|reduce|less|slower|weaker|lower|calm|slow|weaken)\b/))) v = {key: 'wind', alias: 'wind'};
  if (v) {
    if (v.wrongMode) return () => (v.wrongMode === 'air' ? 'That control is in Building ventilation' : 'That control is in Pond aeration');
    const [label, min, max, step, unit] = ZW().definitions[v.key];
    const aliasWords = new Set((v.alias || '').split(' ')), fillers = /^(the|to|at|is|a|of|value|now|level|me|my|on|as|be|it|for)$/;
    const justNameAndNumber = !!num && words.every(w => /^-?\d+(\.\d+)?$/.test(w) || aliasWords.has(w) || fillers.test(w));   // "wind 8", "wind speed to 8"
    const plan = (cur, st) => {
      if (has(/\b(max|maximum|maximise|maximize|highest|full|top)\b/) && !num) return max;
      if (has(/\b(min|minimum|minimise|minimize|lowest|zero|none|off)\b/) && !num) return min;
      if (num && has(/\bby\b/)) return cur + (has(DEC) && !has(INC) ? -1 : 1)*+num;
      if (num && (has(/\b(set|make|change)\b/) || ((has(INC) || has(DEC)) && has(/\b(to|at)\b/)))) return +num;
      if (num && (has(INC) || has(DEC))) return cur + (has(DEC) ? -1 : 1)*+num;
      if (justNameAndNumber) return +num;
      if (has(DEC) && !has(INC)) return cur - st;
      if (has(INC)) return cur + st;
      return null;
    };
    const fn = () => {
      const el = $('[data-param="' + v.key + '"]', face()); if (!el) return 'That control is not available here';
      const target = plan(+el.value, STEP[v.key] || (max - min)/10);
      if (target === null) return 'Say increase, decrease, or set ' + label.toLowerCase() + ' to a number';
      const got = setRange(el, target);
      return (label + ' ' + fmtNum(got, step) + ' ' + (UNIT_SAY[v.key] || unit.replace(': 1', 'to 1'))).trim();
    };
    fn.weak = plan(0, 1) === null;               // only a hint would come back: another reading of the same sentence may be better
    return fn;
  }
  return null;
}
// An accented or Bangla sentence is read twice (translated to command words, and as heard); the better match wins.
function parse(raw) {
  let a = null, b = null;
  try { a = parseText(raw, true); } catch (e) { console.error('JARVIS parse error', e); }
  try { b = parseText(raw, false); } catch (e) { console.error('JARVIS parse error', e); }
  return [a, b].find(f => f && !f.weak) || a || b || null;
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
  if (!fn) { heardEl.textContent = '“' + text + '” — not understood. Try: “wind faster”, “wind 8”, “pond”, “বাতাস বাড়াও”'; toast('Not understood: ' + text, true); return false; }
  let msg; try { msg = fn(); } catch (e) { console.error('JARVIS command error', e); toast('Could not do that', true); return false; }
  if (msg) { toast(msg); say(msg); }
  return true;
}

/* ---- speech recognition ---- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = null, voiceOn = false, voiceBusy = false, recErrs = 0, voiceSession = 0, recRetry = 0, localVoice = null, voiceAbort = null;
const safeParse = a => { try { return !!parse(a); } catch (e) { return false; } };
let micStream = null, micCtx = null, micTimer = 0, micTestTimer = 0;
const micSay = t => { micEl.textContent = t; };
function micMeterStop() {
  clearInterval(micTimer); clearTimeout(micTestTimer);
  if (micStream) micStream.getTracks().forEach(t => t.stop()); micStream = null;
  try { micCtx?.close()?.catch(() => {}); } catch (e) {} micCtx = null;
  micFill.style.width = '0%'; $('#jv-miclevel', root).setAttribute('aria-valuenow', '0');
  $('#jv-mic-test', root).textContent = 'CHECK MICROPHONE · 8 SECONDS';
}
function prepareMicAudio() {
  // Run during the button click, before awaiting permission, to preserve audio activation.
  micMeterStop();
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio) return; // The optional browser speech service can still work without a meter.
  micCtx = new Audio();
  micCtx.resume().catch(e => micSay('Audio could not start: ' + e.message));
}
async function micMeterStart(stream) {
  micStream = stream;
  if (!micCtx) { micSay('Input level unavailable: Web Audio is unsupported'); return; }
  await micCtx.resume();
  if (micCtx.state !== 'running') throw new Error('Audio is suspended. Click Voice off and on to resume it.');
  const an = micCtx.createAnalyser(); an.fftSize = 1024;
  const source = micCtx.createMediaStreamSource(stream), mute = micCtx.createGain(); mute.gain.value = 0;
  source.connect(an); an.connect(mute); mute.connect(micCtx.destination);
  const buf = new Float32Array(an.fftSize), started = performance.now(); let lastSound = started, mutedSince = 0, recovered = 0;
  const track = stream.getAudioTracks?.()[0];
  if (track) { track.addEventListener('mute', () => { mutedSince = mutedSince || performance.now(); }); track.addEventListener('unmute', () => { mutedSince = 0; lastSound = performance.now(); }); }
  micTimer = setInterval(() => {
    an.getFloatTimeDomainData(buf); let sum = 0; for (const x of buf) sum += x*x;
    const rms = Math.sqrt(sum/buf.length), level = Math.min(100, Math.round(rms*500)), now = performance.now();
    micFill.style.width = level + '%'; $('#jv-miclevel', root).setAttribute('aria-valuenow', String(level));
    if (rms > .004) lastSound = now;
    // track.muted flickers true for a moment while the browser starts the device, so only trust it when it stays true AND no audio is arriving
    const flagged = !!track && (track.muted || track.readyState === 'ended' || track.enabled === false);
    if (flagged && !mutedSince) mutedSince = now; if (!flagged) mutedSince = 0;
    const audioFlowing = now - lastSound < 1500;
    const stuck = flagged && !audioFlowing && now - mutedSince > 1500;
    if (stuck && voiceOn && now - recovered > 15000 && now - mutedSince > 4000) {      // one automatic retry: grab the microphone again
      recovered = now; toast('Microphone went silent — reconnecting…', true);
      setVoice(false); setTimeout(() => setVoice(true), 400); return;
    }
    micSay(track?.readyState === 'ended' ? 'Microphone disconnected — plug it in or pick another one, then turn Voice off and on'
      : stuck ? 'Microphone is blocked or muted by the device — press your keyboard mic key, check Windows Settings › Privacy › Microphone, then turn Voice off and on'
      : now - lastSound > 3500 ? 'No input detected — check your selected microphone or mute switch'
      : 'Input ' + level + '% · ' + (level > 2 ? 'audio detected' : 'quiet — speak to test'));
  }, 90);
}
async function micState() {            // ask for the microphone first so a refusal is visible instead of silent
  if (!navigator.mediaDevices?.getUserMedia) return {state: 'timeout'};
  let expired = false, timer;
  try {
    const request = navigator.mediaDevices.getUserMedia({audio: {channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true}})
      .then(st => { if (expired) { st.getTracks().forEach(t => t.stop()); return null; } return st; });
    const st = await Promise.race([request, new Promise(r => { timer = setTimeout(() => { expired = true; r(null); }, 12000); })]);
    return st ? {state: 'ok', stream: st} : {state: 'timeout'};
  } catch (e) { return {state: e?.name === 'NotFoundError' ? 'none' : e?.name === 'NotReadableError' ? 'busy' : 'blocked'}; }
  finally { clearTimeout(timer); }
}
let voiceLang = 'mix', mixLang = 'en-IN';
try { const saved = localStorage.getItem('jv-lang'); if (saved && [...langEl.options].some(o => o.value === saved)) voiceLang = saved; } catch (e) {}
langEl.value = voiceLang;
const sessionLang = () => voiceLang === 'mix' ? mixLang : voiceLang;
langEl.addEventListener('change', () => { voiceLang = langEl.value; try { localStorage.setItem('jv-lang', voiceLang); } catch (e) {} if (voiceOn) { try { rec && rec.abort(); } catch (e) {} } });
langEl.disabled = engineEl.value === 'offline';
engineEl.addEventListener('change', () => {
  setVoice(false); langEl.disabled = engineEl.value === 'offline';
  heardEl.textContent = engineEl.value === 'offline' ? 'Offline English selected (English only, no Bangla). Turn Voice on; the first model load takes a moment.' : 'Online speech service selected (understands accents and Bangla; needs internet). Turn Voice on.';
});
function autoFallback(why) {            // Auto engine: the online service is not usable, so continue with the offline English model
  if (engineEl.value !== 'auto') return false;
  setVoice(false); engineEl.value = 'offline'; langEl.disabled = true;
  toast('Online speech unavailable — using offline English', true); heardEl.textContent = 'Online speech unavailable (' + why + '). Switched to Offline English. Bangla needs the online service.';
  setTimeout(() => setVoice(true), 150); return true;
}
function voiceFailure(label, message) {
  setVoice(false); setModeUi('voice', 'err', label); heardEl.textContent = message; micSay(label.toLowerCase());
}
$('#jv-mic-test', root).addEventListener('click', async () => {
  if (voiceOn || voiceBusy) { toast('The MIC bar is already monitoring your input'); return; }
  if (micStream) { setVoice(false); return; }
  setVoice(false); const session = voiceSession;
  try {
    prepareMicAudio(); voiceBusy = true;
    const mic = await micState();
    if (session !== voiceSession) { mic.stream?.getTracks().forEach(t => t.stop()); return; }
    if (!mic.stream) throw new Error(mic.state === 'busy' ? 'Microphone is busy in another application.' : mic.state === 'none' ? 'No microphone found.' : 'Allow microphone access for this page, then try again.');
    await micMeterStart(mic.stream); voiceBusy = false;
    heardEl.textContent = 'Microphone check: speak now. Voice recognition is off.';
    $('#jv-mic-test', root).textContent = 'STOP MICROPHONE CHECK';
    micTestTimer = setTimeout(() => { micMeterStop(); micSay('Check finished — turn Voice on to use commands'); }, 8000);
  } catch (e) { if (session === voiceSession) voiceFailure('MIC ERROR', e.message); }
});
async function setVoice(on) {
  if (!on) { stopBreath(); voiceSession++; voiceOn = voiceBusy = false; clearTimeout(recRetry); voiceAbort?.abort(); voiceAbort = null; localVoice?.stop(); localVoice = null; const old = rec; rec = null; try { old && old.abort(); } catch (e) {} micMeterStop(); micSay('off'); setModeUi('voice', '', 'OFF'); return; }
  if (voiceOn || voiceBusy) return;
  stopBreath(); $('#jv-enable-blow', root).checked=false;
  if (!window.isSecureContext || location.protocol === 'file:') { toast('Open http://localhost:5500 or an HTTPS link', true); heardEl.textContent = 'Run START-SERVER.bat, then open http://localhost:5500. Shared links need HTTPS.'; return; }
  const offline = engineEl.value === 'offline' || (engineEl.value === 'auto' && !SR);
  if (!offline && !SR) { setModeUi('voice', 'err', 'N/A'); toast('Select Offline English for this browser', true); heardEl.textContent = 'Browser speech service is unavailable. Select Voice engine → Offline English, then turn Voice on.'; return; }
  const session = ++voiceSession; voiceBusy = true; setModeUi('voice', 'busy', 'LOADING');
  try { prepareMicAudio(); } catch (e) { voiceFailure('AUDIO ERROR', e.message); return; }
  const mic = await micState();
  if (session !== voiceSession) { mic.stream?.getTracks().forEach(t => t.stop()); return; }
  if (['none', 'blocked', 'busy'].includes(mic.state)) {
    voiceFailure(mic.state === 'none' ? 'NO MIC' : mic.state === 'busy' ? 'MIC BUSY' : 'BLOCKED', mic.state === 'none' ? 'No microphone found.' : mic.state === 'busy' ? 'Microphone is busy or unavailable. Close other microphone apps and try again.' : 'Microphone blocked — allow Microphone in the browser site permissions, then switch Voice on again.'); return;
  }
  if (offline && !mic.stream) { voiceFailure('NO MIC', 'Microphone permission is still pending. Allow it, then turn Voice on again.'); return; }
  if (mic.stream) {
    try { await micMeterStart(mic.stream); } catch (e) { if (session === voiceSession) voiceFailure('AUDIO ERROR', e.message); return; }
    if (session !== voiceSession) return;
  } else micSay('mic permission pending');
  if (offline) {
    voiceAbort = new AbortController();
    try {
      if (!window.LocalVoice) throw new Error('Missing offline-voice.js. Extract the complete updated ZIP.');
      const local = await window.LocalVoice.start({stream:mic.stream, audioContext:micCtx, signal:voiceAbort.signal,
        onStatus: text => { if (session === voiceSession) heardEl.textContent = text; },
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
  r.lang = sessionLang(); r.continuous = true; r.interimResults = true; r.maxAlternatives = 5;
  const fire = (i, alts) => { if (!current() || done.has(i)) return; done.add(i); const clean = alts.filter(t => !isEcho(t)); if (!clean.length) return;
    const ok = runCommand(clean.find(safeParse) || clean[0]);
    if (!ok && voiceLang === 'mix') { mixLang = mixLang === 'en-IN' ? 'bn-BD' : 'en-IN'; setTimeout(() => { if (rec === r) { try { r.abort(); } catch (e) {} } }, 0); }   // not understood: try the other language next
  };
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
    if (e.error === 'not-allowed') { voiceOn = false; setModeUi('voice', 'err', 'BLOCKED'); heardEl.textContent = 'Microphone / speech service blocked. Allow the microphone for this page (lock icon in the address bar). Voice works in Chrome and Edge only.'; }
    else if (e.error === 'audio-capture') { voiceOn = false; setModeUi('voice', 'err', 'NO MIC'); heardEl.textContent = 'No microphone found.'; }
    else if (e.error === 'network' || e.error === 'service-not-allowed') { if (autoFallback(e.error)) return; voiceFailure('SERVICE', 'Browser speech service returned network. The microphone may still work. Select Voice engine → Offline English, then turn Voice on.'); return; }
    else if (e.error === 'language-not-supported') { voiceOn = false; setModeUi('voice', 'err', 'LANGUAGE'); heardEl.textContent = 'Choose another voice language and turn Voice on again.'; }
    if (!voiceOn) micMeterStop();
  };                                             // "no-speech" and "aborted" are normal: the session simply restarts below
  r.onend = () => {
    if (rec !== r || session !== voiceSession) return;
    rec = null; if (!voiceOn) return;
    const quick = performance.now() - started < 1500 && lastError !== 'no-speech'; recErrs = quick ? recErrs + 1 : 0;
    if (recErrs > 6) { if (autoFallback('session kept ending')) return; voiceFailure('SERVICE', 'Browser speech service ended repeatedly (' + (lastError || 'no error provided') + '). Select Voice engine → Offline English, then turn Voice on.'); return; }
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
                                     : await mod.FaceLandmarker.createFromOptions(files, {...opts, numFaces: 1, outputFaceBlendshapes: !!document.getElementById('jv-enable-blow')?.checked});
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
let camGen = 0;                         // bumped on every close, so a camera that finishes opening AFTER you switched it off is shut again
async function openCamera() {
  const gen = camGen;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({video: {width: {ideal: 320}, height: {ideal: 240}, frameRate: {ideal: 30}, facingMode: 'user'}, audio: false});
    if (gen !== camGen) { stream.getTracks().forEach(t => t.stop()); return false; }
    cam.stream = stream;
    cam.video.srcObject = cam.stream; previewVideo.srcObject = cam.stream; await cam.video.play(); previewVideo.play().catch(() => {});
    cam.on = true; cam.last = -1; $('#jv-cam', root).classList.add('on'); cam.raf = requestAnimationFrame(loop); return true;
  } catch (e) { console.error(e); if (gen === camGen) toast('Camera blocked or unavailable', true); return false; }
}
function closeCamera() {                // really releases the camera (the light goes off)
  camGen++; lighten(false);
  cam.stream?.getTracks().forEach(t => t.stop()); cam.stream = null; cam.on = false; cancelAnimationFrame(cam.raf);
  cam.video.srcObject = previewVideo.srcObject = null; $('#jv-cam', root).classList.remove('on'); ctx.clearRect(0, 0, overlay.width, overlay.height);
}
function stopCameraIfIdle() {
  if (handsOn || faceOn || $$('.jv-mode.busy', root).some(b => b.dataset.jv !== 'voice')) { if (!camActive()) lighten(false); return; }
  closeCamera();                        // nothing needs it: release it, and cancel a camera that is still opening
}
/* Camera picture button: shows or hides the live camera picture in the control panel. The camera itself keeps running,
   so hand and face gestures work exactly the same with the picture hidden (a separate hidden video feeds the models). */
const camViewBtn = $('#jv-camview', root), camBox = $('#jv-cam', root);
let camShown = true; try { camShown = localStorage.getItem('jv-camview') !== 'hidden'; } catch (e) {}
function setCamView(show, save = true) {
  camShown = !!show; camBox.hidden = !camShown;
  camViewBtn.textContent = camShown ? 'CAMERA PICTURE: SHOWN — click to hide' : 'CAMERA PICTURE: HIDDEN — click to show';
  camViewBtn.setAttribute('aria-pressed', String(camShown)); camViewBtn.classList.toggle('on', camShown);
  if (camShown) previewVideo.play?.().catch(() => {});
  if (save) try { localStorage.setItem('jv-camview', camShown ? 'shown' : 'hidden'); } catch (e) {}
}
camViewBtn.addEventListener('click', () => setCamView(!camShown));
setCamView(camShown, false);

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
  faceOn = true; resetFace(); lighten(true); setModeUi('face', 'on', 'ON'); faceEl.textContent = 'Look at the screen, then turn your head';
}

let lastInfer = 0, cycle = 0, cost = 0;
const camActive = () => handsOn || faceOn;
function loop() {                          // models run on the main thread: use at most ~20% of it, hands and face take turns, and back right off while the mouse is in use
  if (!cam.on) return;
  const v = cam.video, now = performance.now(), gap = mouseBusy() && handsOn ? 350 : Math.max(40, cost*3);
  if (v.readyState >= 2 && v.currentTime !== cam.last && now - lastInfer >= gap) {
    cam.last = v.currentTime; lastInfer = now; cycle++;
    const both = handsOn && faceOn, doFace = faceOn && faceLm && (!both || cycle % 2 === 0), doHands = handsOn && handLm && (!both || cycle % 2 !== 0), t0 = performance.now();   // hands and face take equal turns, so a head turn is seen quickly
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
   FACE GESTURE: turn the head right / left -> next / previous scenario
   ===================================================================== */
let faceArmed = false, faceYaw = 0, faceSince = 0, faceLast = 0, faceNeutral = null, faceSamples = [], faceTurn = 0, faceLost = 0, faceFlipAt = 0, faceFlipSide = 0, faceHist = [], faceRearm = 0;
let tiltNeutral = null, tiltSamples = [], faceTilt = 0, tiltCand = 0, tiltSince = 0, tiltActive = false, tiltDir = 0, tiltStart = 0, tiltReady = false, tiltAcc = 0, tiltSet = -1;
let blowing = false, blowAcc = 0, blowSet = -1, blowSince = 0, blowLastHit = 0, blowTick = 0, blowTarget = null;
let breathInput=null, breathAbort=null, breathRequest=0, breathFloor=0, breathCount=0, breathTicks=0, breathMouth=0, breathMouthAt=0;
function resetBlow() {                    // stops blowing but KEEPS the wind speed you reached
  blowing=false;blowTarget=null;blowSince=blowLastHit=blowTick=0;
  blowFill.style.width='0%';
}
function stopBreath(){
  if(breathInput||breathAbort){micFill.style.width='0%';$('#jv-miclevel',root).setAttribute('aria-valuenow','0');micSay('off');}
  breathRequest++;breathAbort?.abort();breathAbort=null;breathInput?.stop();breathInput=null;
  breathFloor=breathCount=breathTicks=breathMouth=breathMouthAt=0;resetBlow();
}
async function startBreath(){
  setVoice(false);const request=++breathRequest;breathAbort=new AbortController();
  breathFloor=breathCount=breathTicks=0;
  blowEl.textContent='Allow the microphone, then stay quiet for one second';
  try{
    if(!window.BreathInput)throw new Error('Missing breath-input.js. Reload the updated app.');
    const input=await window.BreathInput.start({signal:breathAbort.signal,onSample:sample=>{
      if(request!==breathRequest)return;
      const level=Math.min(100,Math.round(sample.rms*500));micFill.style.width=level+'%';$('#jv-miclevel',root).setAttribute('aria-valuenow',String(level));
      micSay('Breath microphone · '+level+'%');
      try{processBlow(sample,sample.at??performance.now());}catch(e){console.error('JARVIS blow error',e);}
    },onError:e=>{if(request===breathRequest){stopBreath();$('#jv-enable-blow',root).checked=false;blowEl.textContent=e.message;}}});
    if(request!==breathRequest){input.stop();return;}breathInput=input;
  }catch(e){if(request===breathRequest){stopBreath();$('#jv-enable-blow',root).checked=false;blowEl.textContent='Breath microphone: '+e.message;}}
}
function resetFace() { faceArmed = false; faceYaw = faceSince = faceLast = faceTurn = faceLost = faceFlipAt = faceFlipSide = faceRearm = 0; faceNeutral = null; faceSamples = []; faceHist = []; faceTilt = 0; tiltNeutral = null; tiltSamples = []; tiltCand = tiltSince = tiltDir = tiltStart = 0; tiltActive = false; tiltReady = false; tiltSet = -1; breathMouth = breathMouthAt = 0; }
$('#jv-enable-blow', root).addEventListener('change', () => {
  const on=$('#jv-enable-blow',root).checked;
  if(on)startBreath();else{stopBreath();micMeterStop();}
  try { faceLm?.setOptions({outputFaceBlendshapes: on}); } catch (e) {}
});
$('#jv-center', root).addEventListener('click', () => { resetFace(); faceEl.textContent = faceOn ? 'Look at the screen' : 'Enable Face first'; });
function yawOf(lm) {                      // 0 = looking straight, about +-0.5 = fully turned
  const nose = lm[1], l = lm[234], r = lm[454], w = r.x - l.x;
  return Math.abs(w) < 1e-4 ? 0 : (nose.x - (l.x + r.x)/2)/w;
}
function rollOf(lm) {                     // head tilt in degrees; positive = YOUR right ear towards your right shoulder (camera sees you mirrored)
  const l = lm[234], r = lm[454], dx = r.x - l.x;
  return Math.abs(dx) < 1e-4 ? 0 : -Math.atan2(r.y - l.y, dx)*180/Math.PI;
}
function blowScore(cats) {                // 0..1 from the face model's mouth blendshapes: puckered / rounded lips or puffed cheeks
  if (!cats) return 0;
  const g = n => (cats.find(c => c.categoryName === n) || {}).score || 0;
  const smile = (g('mouthSmileLeft') + g('mouthSmileRight'))/2;
  return clamp(Math.max(g('cheekPuff')*1.6, g('mouthPucker')*.8 + g('mouthFunnel')*.5) - smile*.5, 0, 1);
}
function noteMouth(cats, now) { breathMouth = blowScore(cats); breathMouthAt = now; }   // camera: how puckered the lips are (optional helper)
/* One microphone reading (every ~80 ms). Blowing = steady, noisy (not voice-like) sound clearly above the room noise.
   While it lasts the wind rises at a FIXED rate (T.blowRate), whatever the loudness, so the result is repeatable.
   Puckered lips seen by the camera lower the loudness needed; lips alone never change anything. */
function processBlow(sample, now) {
  if (!$('#jv-enable-blow', root).checked) return;
  if (voiceOn || voiceBusy || now < speakUntil) { resetBlow(); return; }
  const el = $('[data-param="wind"]', face()); if (!el) return;
  const rms = sample.rms; breathTicks++;
  if (breathCount < T.blowCalib) {                                   // learn the room noise first (a loud room is accepted after ~3 s)
    if (rms < .06 || breathTicks > 40) { breathFloor = (breathFloor*breathCount + Math.min(rms, .06))/(breathCount + 1); breathCount++; }
    blowEl.textContent = 'Stay quiet for a second — measuring the room noise'; return;
  }
  const floor = clamp(breathFloor, .002, .04);
  const lips = now - breathMouthAt < 700 && breathMouth > (blowing ? T.blowOff : T.blowOn);
  const onLevel = lips ? Math.max(.015, floor*3) : Math.max(.03, floor*6), offLevel = lips ? Math.max(.01, floor*2) : Math.max(.015, floor*3);
  const hit = sample.periodicity < .5 && rms > (blowing ? offLevel : onLevel);   // noisy air, not a voice or a hum, and clearly louder than the room
  if (hit) blowLastHit = now;
  else if (!blowing && rms < floor*2.5 + .004) breathFloor = breathFloor*.98 + rms*.02;    // keep following the room noise while quiet
  const active = blowLastHit > 0 && now - blowLastHit <= T.blowGap;
  blowFill.style.width = Math.round(clamp(blowing ? 1 : rms/onLevel, 0, 1)*100) + '%';
  if (!blowing) {                                                       // starting needs breath sound NOW, kept up for blowHold ms (a short puff or click does nothing)
    if (!hit) { if (!active) { blowSince = 0; blowEl.textContent = 'Ready — pucker your lips and blow toward the microphone'; } return; }
    blowSince = blowSince || now;
    if (now - blowSince < T.blowHold) { blowEl.textContent = 'Breath detected… keep blowing'; return; }
    blowing = true; blowTarget = el; blowAcc = blowSet = +el.value; blowTick = now;
  }
  if (!active) {                                                        // the breath ended: the wind stays where it got to
    const shown = +el.value; resetBlow(); blowSince = 0;
    blowEl.textContent = 'Released — wind stays at ' + shown.toFixed(1) + ' m/s. Blow again to raise it more'; return;
  }
  if (el !== blowTarget) { blowTarget = el; blowAcc = blowSet = +el.value; }     // the window was switched while blowing
  if (Math.abs(+el.value - blowSet) > .3) blowAcc = +el.value;           // you moved the slider by hand: continue from there
  const dt = Math.min(.15, Math.max(0, (now - blowTick)/1000)); blowTick = now;
  blowAcc = clamp(blowAcc + T.blowRate*dt, +el.min, +el.max); blowSet = setRange(el, blowAcc);
  blowEl.textContent = 'Blowing → ' + blowSet.toFixed(1) + ' m/s · stop blowing to keep it';
}
const sideName = v => v > 0 ? 'left' : 'right';     // the camera sees you mirrored: a positive reading means YOU turned to your left
function doFlip(now, side) {
  faceArmed = false; faceSince = 0; faceTurn = 0; faceFlipAt = now; faceFlipSide = side; faceRearm = 0; faceHist = [];
  const dir = side > 0 ? -1 : 1;                   // side > 0 = you turned to YOUR left (camera is mirrored): left = back, right = next scenario
  const m = stepCase(dir); faceEl.textContent = 'Scenario → ' + m; toast('Scenario: ' + m); say(m);
}
function processTilt(now, dt) {
  const el = $('[data-param="wind"]', face()), box = $('#jv-tilt', root);
  if (!box.checked || !el || $('#jv-enable-blow',root).checked) { tiltActive = false; tiltCand = tiltSince = 0; return false; }
  const t = faceTilt, a = Math.abs(t);
  if (Math.abs(faceYaw) > T.yawOn*.9) { tiltActive = false; tiltCand = tiltSince = 0; return false; }   // a head turn is in progress: never mix the two
  if (a < T.tiltOff) { tiltReady = true; tiltCand = tiltSince = 0; if (tiltActive) tiltActive = false; return false; }
  if (!tiltActive) {
    if (!tiltReady || a < T.tiltOn) { if (a < T.tiltOn) tiltCand = tiltSince = 0; return a >= T.tiltOn && !tiltReady ? 'tilt back upright first' : false; }
    const dir = Math.sign(t);
    if (tiltCand !== dir) { tiltCand = dir; tiltSince = now; }
    if (now - tiltSince < T.tiltHold) return 'Tilt ' + (dir > 0 ? 'right' : 'left') + '… keep going';
    tiltActive = true; tiltDir = dir; tiltStart = now; tiltAcc = +el.value; tiltSet = tiltAcc; tiltReady = false;
  }
  if (Math.sign(t) !== tiltDir || a < T.tiltOn*.6 || now - tiltStart >= T.tiltMax) { tiltActive = false; tiltCand = tiltSince = 0; return now - tiltStart >= T.tiltMax ? 'tilt back upright to push again' : false; }
  if (Math.abs(+el.value - tiltSet) > .25) tiltAcc = +el.value;            // someone moved the slider meanwhile: continue from there
  const power = clamp((a - T.tiltOn)/Math.max(1, T.tiltFull - T.tiltOn), 0, 1);
  tiltAcc = clamp(tiltAcc + tiltDir*T.tiltRate*(.4 + .6*power)*dt/1000, +el.min, +el.max);
  tiltSet = setRange(el, tiltAcc);
  return (tiltDir > 0 ? 'Tilt right → wind ' : 'Tilt left → wind ') + tiltSet.toFixed(1) + ' m/s';
}
function processFace(faces, now, cats) {
  if (!faces.length) { resetFace(); breathMouth=0; faceEl.textContent = 'No face — look at the screen'; return; }
  faceLost = 0;
  if (faceLast && now - faceLast > 3000) resetFace();
  const dt = faceLast ? Math.min(400, now - faceLast) : 100; faceLast = now;
  const raw = yawOf(faces[0]), rawTilt = rollOf(faces[0]);
  // Auto-calibration: the first moment a face is seen counts as "looking at the screen" and "head upright".
  if (faceNeutral === null) {
    faceSamples.push(raw); tiltSamples.push(rawTilt);
    if (faceSamples.length >= 4) { faceNeutral = mean(faceSamples); tiltNeutral = mean(tiltSamples); faceSamples = []; tiltSamples = []; faceArmed = true; faceYaw = 0; faceTilt = 0; tiltReady = true; faceEl.textContent = 'Ready — turn head right = next scenario, left = back'; }
    else faceEl.textContent = 'Starting…';
    return;
  }
  faceYaw += (raw - faceNeutral - faceYaw)*(1 - Math.exp(-dt/80));
  faceTilt += (rawTilt - tiltNeutral - faceTilt)*(1 - Math.exp(-dt/110));
  yawDot.style.left = (50 - clamp(faceYaw/.3, -1, 1)*46) + '%';     // the preview is mirrored, so the dot follows YOUR turn
  const a = Math.abs(faceYaw);
  if (a < T.yawOff && Math.abs(faceTilt) < T.tiltOff) { faceNeutral += (raw - faceNeutral)*Math.min(1, dt/6000); tiltNeutral += (rawTilt - tiltNeutral)*Math.min(1, dt/6000); }   // slowly follow small posture changes
  if (document.hidden) { faceSince = faceTurn = 0; return; }           // (the mouse no longer blocks face gestures)
    faceHist.push({t: now, y: faceYaw}); while (faceHist.length > 1 && now - faceHist[0].t > 400) faceHist.shift();
  const tiltMsg = processTilt(now, dt), tilting = tiltActive || Math.abs(faceTilt) > T.tiltOn*.8;
  if (!faceArmed) {                                                     // rearm: come most of the way back, OR sweep to the other side
    const back = a < T.yawOff;
    if (back) { faceRearm = faceRearm || now; if (now - faceRearm >= 250) { faceArmed = true; faceRearm = 0; faceSince = 0; faceTurn = 0; } } else faceRearm = 0;
  }
  if (faceArmed && !tilting && !blowing) {
    const side = Math.sign(faceYaw), moved = faceHist.length > 1 ? faceYaw - faceHist[0].y : 0;
    const flick = a > T.yawOn*.8 && Math.sign(moved) === side && Math.abs(moved) > T.yawOn*T.yawFlick;
    let held = false;
    if (a > T.yawOn) {
      if (faceTurn !== side) { faceSince = 0; faceTurn = side; }
      faceSince = faceSince || now; held = now - faceSince >= T.yawHold;
    } else { faceSince = 0; faceTurn = 0; }
    faceEl.textContent = a > T.yawOn*.6 ? 'Turning ' + sideName(faceYaw) + '…' : 'Ready — turn head right = next scenario, left = back';
    if (now - faceFlipAt > T.yawCool && (held || flick)) { doFlip(now, side); return; }
  } else if (!faceArmed) faceEl.textContent = 'Switched → face the screen to rearm';
  if (tiltMsg) faceEl.textContent = tiltMsg;
  noteMouth(cats, now);
}

/* =====================================================================
   HAND GESTURES
   ===================================================================== */
const hands = [];
let lastSwipe = 0, lastZoom = 0;
const INTERACTIVE = 'button,select,input,label,a,summary,canvas,[role=tab]';
function newSlot() {
  const el = document.createElement('div'); el.className = 'jv-cursor'; el.innerHTML = '<i></i><b></b>'; cursorsHost.append(el);
  return {el, wrist: {x: 0, y: 0}, sx: null, sy: null, pinch: false, pinchSince: 0, pinchReady: false, pinchFrames: 0, pinchAim: null, dwell: null, prevE: null, v: [0, 0, 0, 0], hist: [], prevC: null, drag: null, lock: null, acc: 0, prevP: null, peaceSince: 0, scrollV: 0, hover: null, pose: '—'};
}
function clearHands() { for (const h of hands) { releaseHand(h); h.el.remove(); } hands.length = 0; }
function resetHandZoom(h){h.zoomActive=null;h.zoomArmSince=0;h.zoomPose=0;h.zoomPoseSince=0;h.zoomLast=0;}
function releaseHand(h) { resetHandZoom(h); h.pinch = false; h.pinchSince = 0; h.pinchFrames = 0; h.dwell = null; h.el.style.setProperty('--dwell', 0); h.el.classList.remove('dwell'); h.pinchReady = false; h.pinchAim = null; h.drag = null; h.peaceSince = 0; unlock(h); if (h.hover) { h.hover.classList.remove('jv-hover'); h.hover = null; } }
function unlock(h) { if (h.lock) { h.lock.box.classList.remove('jv-lock'); h.lock = null; } h.acc = 0; h.prevP = null; }

function analyze(lm, AR) {
  const D = (a, b) => Math.hypot((a.x - b.x)*AR, a.y - b.y);
  const palm = Math.max(D(lm[0], lm[9]), D(lm[5], lm[17])*1.15) || .1, tips = [8, 12, 16, 20], pips = [6, 10, 14, 18];
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
  const wantPinch = a.pinchD < (h.pinch || h.pinchSince ? T.pinchOff : T.pinchOn);
  if (a.pinchD > T.pinchOn*1.3) h.pinchReady = true;       // fingers have been apart since the last click
  const peace = a.ext[0] && a.ext[1] && !a.ext[2] && !a.ext[3] && a.pinchD > .8 && !wantPinch;
  const openPalm = a.nExt >= 3 && a.pinchD > .8 && !peace && !wantPinch;
  const point = a.ext[0] && !a.ext[1] && !a.ext[2] && !a.ext[3] && !wantPinch;
  /* --- ZOOM. Hold two fingers still over the scene for half a second to ARM it ("ZOOM READY").
         After that the hand POSE decides, never hand movement, so nothing can drift or zoom by itself:
           open hand (3-4 fingers up)  = zoom IN at a steady speed
           curled fingers (fist-like)  = zoom OUT at a steady speed
           one or two fingers          = hold still
         A pose must stay steady for a moment before it counts. Pinch, move the hand away, or wait 2.5 s to leave zoom mode. --- */
  const yieldM = mouseBusy(), dtf = h.prevT ? clamp((now - h.prevT)/33, .5, 12) : 1; h.prevT = now;
  let zooming = false;
  const overScene = h.sx != null && document.elementFromPoint(h.sx, h.sy)?.tagName === 'CANVAS';
  const canZoom = overScene && !yieldM && !wantPinch && !h.pinch && !h.lock && a.pinchD > (h.zoomActive ? .6 : .8);
  if (!canZoom || (h.zoomActive && (h.zoomActive !== scene() || now - h.zoomIdle > 2500 || Math.hypot(lm[0].x - h.zoomWrist.x, lm[0].y - h.zoomWrist.y) > .15))) resetHandZoom(h);
  if (canZoom && peace && !h.zoomActive) {
    if (!h.zoomArmSince || Math.hypot(lm[0].x - h.zoomWrist.x, lm[0].y - h.zoomWrist.y) > .025) { h.zoomArmSince = now; h.zoomWrist = {...lm[0]}; }
    if (now - h.zoomArmSince >= 500) { h.zoomActive = scene(); h.zoomIdle = now; h.zoomPose = 0; h.zoomPoseSince = now; h.zoomLast = now; }
  } else if (!peace && !h.zoomActive) h.zoomArmSince = 0;
  if (h.zoomActive) {
    const want = a.nExt >= 3 ? 1 : a.nExt === 0 ? -1 : 0;           // 1 = zoom in, -1 = zoom out, 0 = hold
    if (want !== h.zoomPose) { h.zoomPose = want; h.zoomPoseSince = now; h.zoomLast = now; }
    if (peace) h.zoomIdle = now;
    if (want !== 0 && now - h.zoomPoseSince >= T.zoomPoseMs) {
      const sec = clamp((now - h.zoomLast)/1000, 0, .12); h.zoomLast = now;
      scene().zoomBy(Math.exp(-want*T.zoomRate*sec)); zooming = true; lastZoom = h.zoomIdle = now;
    }
  }
  h.prevE = a.e;
  /* --- cursor --- */
  const anchor = peace ? mid(lm[8], lm[12]) : lm[8];
  let [tx, ty] = toScreen(anchor.x, anchor.y);
  if (h.zoomActive && h.sx != null) { tx=h.sx; ty=h.sy; }
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
  h.pose = h.pinch || wantPinch ? 'PINCH' : h.zoomActive ? (zooming ? (h.zoomPose > 0 ? 'ZOOM IN' : 'ZOOM OUT') : 'ZOOM READY') : h.zoomArmSince ? 'HOLD TO ZOOM' : peace ? 'TWO FINGERS' : openPalm ? 'OPEN PALM' : point ? 'POINT' : a.nExt === 0 ? 'FIST' : 'HAND';
  h.el.className = 'jv-cursor' + (h.pinch ? ' pinch' : '') + (peace ? ' two' : '') + (openPalm ? ' open' : ''); $('b', h.el).textContent = h.pose;
  /* --- hover highlight (the cursor layer has pointer-events:none, so elementFromPoint sees through it) --- */
  const under = document.elementFromPoint(h.sx, h.sy), hov = !peace && under ? under.closest(INTERACTIVE) : null, mark = hov && hov.tagName !== 'CANVAS' ? hov : null;
  if (mark !== h.hover) { h.hover?.classList.remove('jv-hover'); h.hover = mark; mark?.classList.add('jv-hover'); }

  /* --- pinch: click / drag --- */
  if (wantPinch && h.pinchReady) { h.pinchSince = h.pinchSince || now; h.pinchFrames++; }
  else { h.pinchSince = 0; h.pinchFrames = 0; }
  if (!h.pinch && h.pinchSince && (now - h.pinchSince >= T.pinchHold || h.pinchFrames >= 2)) {
    h.pinch = true; h.pinchReady = false; unlock(h); clickAt(h, h.sx, h.sy);
    if (h.pinchAim) { const tip = toScreen(lm[8].x, lm[8].y); h.pinchAim.tipX = tip[0]; h.pinchAim.tipY = tip[1]; }
  }
  if (!wantPinch) { h.pinch = false; h.pinchSince = 0; h.pinchFrames = 0; h.pinchAim = null; h.drag = null; }
  if (h.pinch && h.drag) {
    if (h.drag.type === 'range') dragRange(h.drag.el, h.sx);
    else if (h.drag.type === 'orbit' && scene()) { scene().orbitBy(-(h.sx - h.drag.x)*.007, (h.sy - h.drag.y)*.005); h.drag.x = h.sx; h.drag.y = h.sy; }
  }

  /* --- hover to click: keep the ring still over a button for about a second (buttons, tabs, tick boxes only) --- */
  const dwellOn = $('#jv-dwell', root).checked, dwellEl = dwellOn && !wantPinch && !h.pinch && !peace && !openPalm && !zooming && !h.lock && under ? under.closest('button,a,summary,[role=tab],label.switch-control,input[type=checkbox]') : null;
  if (dwellEl && !dwellEl.disabled && !dwellEl.closest('#jv-panel .jv-head')) {
    if (!h.dwell || h.dwell.el !== dwellEl || Math.hypot(h.sx - h.dwell.x, h.sy - h.dwell.y) > T.dwellMove) h.dwell = {el: dwellEl, x: h.sx, y: h.sy, since: now, done: h.dwell && h.dwell.el === dwellEl && h.dwell.done};
    if (!h.dwell.done) {
      const f = clamp((now - h.dwell.since)/T.dwellMs, 0, 1); h.el.style.setProperty('--dwell', f); h.el.classList.add('dwell');
      if (f >= 1) { h.dwell.done = true; h.el.classList.remove('dwell'); h.el.style.setProperty('--dwell', 0); clickAt(h, h.sx, h.sy); }
    } else { h.el.classList.remove('dwell'); }
  } else { h.dwell = null; h.el.classList.remove('dwell'); h.el.style.setProperty('--dwell', 0); }

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
  if (openPalm && !h.zoomActive && !zooming && now - lastZoom > 250) {
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
document.addEventListener('visibilitychange', () => { if (document.hidden) { clearHands(); resetFace(); if (voiceOn || voiceBusy || breathAbort) setVoice(false); } });
window.addEventListener('pagehide', stopAll);
$('#jv-form', root).addEventListener('submit', e => { e.preventDefault(); const i = $('#jv-input', root); if (i.value.trim()) runCommand(i.value.trim()); i.value = ''; });
document.addEventListener('keydown', e => { if (e.key === 'j' && e.altKey) { e.preventDefault(); toggleHud(); } });

// small debug / test hook
window.JARVIS = {command: runCommand, parse, feedHands: (list, now, ar) => { if (ar) { Object.defineProperty(cam.video, 'videoWidth', {value: 640, configurable: true}); Object.defineProperty(cam.video, 'videoHeight', {value: 480, configurable: true}); } processHands(list, now); }, feedFace: processFace, hands, T, toggleHud, canon};
})();