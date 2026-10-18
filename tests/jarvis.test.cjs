const {test} = require('node:test');
const assert = require('node:assert/strict');
const {JSDOM} = require('jsdom');
const fs = require('node:fs');
const source = fs.readFileSync(require('node:path').join(__dirname, '..', 'jarvis.js'), 'utf8');

function fixture({offline=false, localStart, audioContext, dwell=false} = {}) {
  const dom = new JSDOM('<body><div id="faces"><div id="air"><div class="viewport"><canvas></canvas></div></div><div id="water"><div class="viewport"></div></div></div><button id="target">Test</button></body>', {url:'http://localhost:5500', runScripts:'outside-only', pretendToBeVisual:true});
  const w = dom.window, d = w.document;
  let clock = 10000, target = d.querySelector('#target'), clicks = 0, switches = 0, zooms = 0;
  const timers = new Map(); let timerId = 0;
  w.setTimeout = (fn, ms) => { const id = ++timerId; timers.set(id, {fn, at:clock + ms}); return id; };
  w.clearTimeout = id => timers.delete(id);
  w.setInterval = (fn, ms) => { const id = ++timerId; timers.set(id, {fn, at:clock + ms, every:ms}); return id; };
  w.clearInterval = id => timers.delete(id);
  if (audioContext) w.AudioContext = audioContext;
  w.requestAnimationFrame = () => 0; w.performance.now = () => clock;
  w.HTMLCanvasElement.prototype.getContext = () => ({clearRect(){}});
  w.HTMLMediaElement.prototype.play = async () => {};
  Object.defineProperty(w, 'isSecureContext', {value:true});
  Object.defineProperty(w, 'innerWidth', {value:1000}); Object.defineProperty(w, 'innerHeight', {value:800});
  const defs = {wind:['Wind speed',0,30,.1,'m/s'], rain:['Rain intensity',0,1,.1,''], room:['Room volume',30,500,10,'m³']};
  const states = {};
  for (const mode of ['air','water']) {
    const root = d.querySelector('#' + mode), p = {};
    for (const [key, [,min,max,step]] of Object.entries(defs)) {
      const label = d.createElement('label'); label.className = 'control';
      const input = d.createElement('input'); input.type = 'range'; input.dataset.param = key;
      Object.assign(input, {min, max, step, value:key === 'wind' ? 4.5 : key === 'room' ? 150 : 0});
      p[key] = +input.value; input.addEventListener('input', () => p[key] = +input.value);
      input.getBoundingClientRect = () => ({left:100, right:900, top:200, bottom:230, width:800});
      label.append(input); root.append(label);
    }
    states[mode] = {root, p, scene:{zoomBy(){zooms++;},orbitBy(){}}};
  }
  let mode = 'air';
  w.ZW = {state:() => states[mode], mode:() => mode, states, definitions:defs, switchMode(next){mode = next; switches++;}};
  d.elementFromPoint = () => target; target.addEventListener('click', () => clicks++);
  const recs = [];
  w.SpeechRecognition = class {
    constructor(){recs.push(this);}
    start(){this.onstart?.();}
    abort(){this.onend?.();}
  };
  const tracks = [];
  Object.defineProperty(w.navigator, 'mediaDevices', {value:{getUserMedia:async () => {
    const track = {stopped:false, stop(){this.stopped = true;}}; tracks.push(track);
    return {getTracks:() => [track]};
  }}});
  if (localStart) w.LocalVoice = {start:localStart};
  w.eval(source);
  d.querySelector('#jv-dwell').checked = dwell;
  if (!offline) { const engine=d.querySelector('#jv-voice-engine'); engine.value='browser'; engine.dispatchEvent(new w.Event('change')); }
  return {w,d,states,recs,tracks,api:w.JARVIS, get clicks(){return clicks;}, get switches(){return switches;},get zooms(){return zooms;},
    get now(){return clock;}, wind:() => states.air.p.wind,
    target(el){target = el;}, tick(ms){clock += ms; for (const [id,t] of [...timers]) if (t.at <= clock) {if(t.every)t.at=clock+t.every;else timers.delete(id); t.fn();}},
    hands(lm, ms=100){clock += ms; w.JARVIS.feedHands(lm ? [lm] : [], clock);},
    face(yaw=0, cats=[], ms=100){clock += ms; w.JARVIS.feedFace(yaw === null ? [] : [faceMesh(yaw)], clock, cats);},
    async voice(){d.querySelector('[data-jv="voice"]').click(); for(let i=0;i<8;i++) await Promise.resolve();},
    emit(text, final=true, index=0){const result = [{transcript:text}]; result.isFinal = final; const results = []; results[index] = result; recs.at(-1).onresult({resultIndex:index,results});},
    close(){dom.window.close();}};
}
function hand(pinch=false, two=false, dx=0) {
  const lm = Array.from({length:21}, () => ({x:.5 + dx,y:.72,z:0}));
  lm[0].y = .85; lm[9].y = .7;
  lm[6].y = .5; lm[8].y = .3;
  lm[4] = {x:(pinch ? .505 : .72) + dx,y:pinch ? .303 : .62,z:0};
  for (const [pip,tip] of [[10,12],[14,16],[18,20]]) {lm[pip].y = .72; lm[tip].y = two && tip === 12 ? .32 : .81;}
  return lm;
}
function faceMesh(yaw) {
  const lm = Array.from({length:478}, () => ({x:.5,y:.5,z:0}));
  lm[234].x=.3; lm[454].x=.7; lm[1].x=.5 + yaw*.4; return lm;
}
const pucker = [{categoryName:'mouthPucker',score:1},{categoryName:'mouthFunnel',score:1}];
function calibrate(f){for(let i=0;i<12;i++) f.face();}

test('face control never changes wind by default, including speaking-like lip shapes', () => {
  const f = fixture(); calibrate(f); for(let i=0;i<600;i++) f.face(0,pucker);
  assert.equal(f.wind(),4.5); assert.equal(f.switches,0); f.close();
});
test('optional lip gesture requires a hold, stops after two seconds and requires release', () => {
  const f = fixture(); calibrate(f); const box=f.d.querySelector('#jv-enable-blow'); box.click();
  for(let i=0;i<8;i++) f.face();
  for(let i=0;i<4;i++) f.face(0,pucker); assert.equal(f.wind(),4.5);
  for(let i=0;i<40;i++) f.face(0,pucker); const raised=f.wind(); assert.ok(raised>4.5 && raised<13);
  for(let i=0;i<100;i++) f.face(0,pucker); assert.equal(f.wind(),raised);
  box.click(); for(let i=0;i<20;i++) f.face(0,pucker); assert.equal(f.wind(),raised); f.close();
});
test('head turn switches once per hold and rearms only at centre', () => {
  const f=fixture(); calibrate(f); for(let i=0;i<30;i++) f.face(.4);
  assert.equal(f.switches,1); for(let i=0;i<30;i++) f.face(-.4); assert.equal(f.switches,1);
  for(let i=0;i<20;i++) f.face(); for(let i=0;i<20;i++) f.face(-.4); assert.equal(f.switches,2);
  f.face(null); for(let i=0;i<20;i++) f.face(.4); assert.equal(f.switches,2); f.close();
});
test('resting hands cannot change wind; pinch clicks once until released', () => {
  const f=fixture(); for(let i=0;i<100;i++) f.hands(hand()); assert.equal(f.clicks,0); assert.equal(f.wind(),4.5);
  f.hands(hand(true)); f.hands(hand(true)); assert.equal(f.clicks,1);
  for(let i=0;i<50;i++) f.hands(hand(true)); assert.equal(f.clicks,1);
  f.hands(hand()); f.hands(hand(true)); f.hands(hand(true)); assert.equal(f.clicks,2);
  assert.equal(f.zooms,0); f.close();
});
test('tracking begins pinched and tracking loss cannot generate phantom clicks', () => {
  const f=fixture(); for(let i=0;i<12;i++) f.hands(hand(true)); assert.equal(f.clicks,0);
  f.hands(hand()); f.hands(hand(true)); f.hands(hand(true)); assert.equal(f.clicks,1);
  f.hands(null); for(let i=0;i<10;i++) f.hands(hand(true)); assert.equal(f.clicks,1); f.close();
});
test('pinch drags sliders and releases without repeated clicks', () => {
  const f=fixture(), input=f.d.querySelector('#air [data-param="wind"]'); f.target(input);
  f.hands(hand()); f.hands(hand(true)); f.hands(hand(true)); const first=f.wind();
  for(let i=0;i<8;i++) f.hands(hand(true,false,-.1)); assert.ok(f.wind()>first);
  f.hands(hand()); const released=f.wind(); for(let i=0;i<20;i++) f.hands(hand()); assert.equal(f.wind(),released); f.close();
});
test('two-finger adjustment ignores small neutral jitter and releases immediately', () => {
  const f=fixture(), input=f.d.querySelector('#air [data-param="wind"]'); f.target(input);
  for(let i=0;i<100;i++) f.hands(hand(false,true,(i%2 ? 1 : -1)*.004)); assert.equal(f.wind(),4.5);
  for(let i=0;i<8;i++) f.hands(hand(false,true,-.12)); assert.ok(f.wind()>4.5);
  f.hands(hand()); assert.equal(f.api.hands[0].lock,null); f.close();
});
test('commands preserve decimals, spoken numbers, relative changes and limits', () => {
  const f=fixture();
  for(const [command, expected] of [['set the wind speed to 7.5',7.5],['Jarvis increase wind speed',9.5],['decrease wind speed by two point five',7],['set wind to thirty',30],['increase wind',30],['set wind to zero',0],['set wind to point five',.5],['increase wind 2',2.5],['wind speed 12',2.5]]) {
    assert.equal(f.api.command(command),true,command); assert.equal(f.wind(),expected,command);
  }
  f.api.command('set room volume to one hundred and fifty'); assert.equal(f.states.air.p.room,150);
  f.api.command('set rain to 0.2'); assert.equal(f.states.air.p.rain,.2); f.close();
});
test('common offline mishearing of set is limited to a command at the start', () => {
  const f=fixture();f.api.command('said wind speed to seven point five');assert.equal(f.wind(),7.5);
  f.api.command('he said wind speed to twelve');assert.equal(f.wind(),7.5);f.close();
});
test('speech previews do not execute; each final result executes once', async () => {
  const f=fixture(); await f.voice(); assert.equal(f.recs.length,1);
  f.emit('increase wind speed',false); f.tick(5000); assert.equal(f.wind(),4.5);
  f.emit('set wind speed to 7.5'); assert.equal(f.wind(),7.5);
  f.emit('increase wind speed'); assert.equal(f.wind(),7.5);
  f.emit('increase wind speed',true,1); assert.equal(f.wind(),9.5);
  f.d.querySelector('#jv-stop').click(); assert.ok(f.tracks.every(t=>t.stopped));
  f.emit('increase wind speed',true,2); assert.equal(f.wind(),9.5); f.close();
});
test('lip gesture cannot change wind while voice is active', async () => {
  const f=fixture(); calibrate(f); f.d.querySelector('#jv-enable-blow').click(); await f.voice();
  for(let i=0;i<100;i++) f.face(0,pucker); assert.equal(f.wind(),4.5); f.close();
});
test('stop cancels a pending microphone permission request', async () => {
  const f=fixture(); let resolve,stopped=false;
  f.w.navigator.mediaDevices.getUserMedia=()=>new Promise(r=>resolve=r);
  f.d.querySelector('[data-jv="voice"]').click(); f.d.querySelector('#jv-stop').click();
  resolve({getTracks:()=>[{stop(){stopped=true;}}]}); for(let i=0;i<10;i++) await Promise.resolve();
  assert.equal(f.recs.length,0); assert.equal(stopped,true); f.close();
});
test('speech restarts after a normal end and ignores an old session after stop', async () => {
  const f=fixture(); await f.voice(); const old=f.recs[0]; f.tick(3000); old.onend(); f.tick(300);
  assert.equal(f.recs.length,2); f.emit('increase wind speed'); assert.equal(f.wind(),6.5);
  f.d.querySelector('#jv-stop').click(); old.onend(); f.tick(4000); assert.equal(f.recs.length,2); f.close();
});
test('blocked speech service releases the microphone and reports the error', async () => {
  const f=fixture(); await f.voice(); f.recs[0].onerror({error:'not-allowed'});
  assert.ok(f.tracks.every(t=>t.stopped)); assert.match(f.d.querySelector('#jv-heard').textContent,/blocked/i);
  f.recs[0].onend(); f.tick(3000); assert.equal(f.recs.length,1); f.close();
});
test('browser service network failure preserves its cause and points to offline voice', async () => {
  const f=fixture(); await f.voice(); f.recs[0].onerror({error:'network'}); f.recs[0].onend(); f.tick(5000);
  assert.equal(f.recs.length,1); assert.ok(f.tracks.every(t=>t.stopped));
  assert.match(f.d.querySelector('#jv-heard').textContent,/network.*Offline English/); f.close();
});
test('normal no-speech timeouts do not accumulate startup failures', async () => {
  const f=fixture(); await f.voice();
  for(let i=0;i<12;i++){f.recs.at(-1).onerror({error:'no-speech'}); f.recs.at(-1).onend(); f.tick(300);}
  assert.equal(f.recs.length,13); assert.equal(f.d.querySelector('[data-jv="voice"] span').textContent,'ON'); f.close();
});
test('offline voice is the default and only final utterances change the app', async () => {
  let callbacks, stopped=false;
  const f=fixture({offline:true,localStart:async options=>{callbacks=options;return{stop(){stopped=true;}};}});
  assert.equal(f.d.querySelector('#jv-voice-engine').value,'offline'); await f.voice(); assert.equal(f.recs.length,0);
  callbacks.onPartial('increase wind speed'); assert.equal(f.wind(),4.5);
  callbacks.onFinal('set wind speed to seven point five'); assert.equal(f.wind(),7.5);
  f.d.querySelector('#jv-stop').click(); assert.equal(stopped,true); assert.ok(f.tracks.every(t=>t.stopped));
  callbacks.onFinal('increase wind speed'); assert.equal(f.wind(),7.5); f.close();
});
test('cancelling offline model loading cannot reactivate voice', async () => {
  let finish,signal,stopped=false;
  const f=fixture({offline:true,localStart:options=>{signal=options.signal;return new Promise(r=>finish=r);}});
  await f.voice(); f.d.querySelector('#jv-stop').click(); assert.equal(signal.aborted,true);
  finish({stop(){stopped=true;}}); for(let i=0;i<10;i++) await Promise.resolve();
  assert.equal(stopped,true); assert.equal(f.d.querySelector('[data-jv="voice"] span').textContent,'OFF'); f.close();
});

function testAudio() {
  const audio={amplitude:0,closed:false,created:0};
  audio.Context=class {
    constructor(){audio.created++;this.state='running';this.destination={};}
    resume(){return Promise.resolve();}
    close(){audio.closed=true;return Promise.resolve();}
    createMediaStreamSource(){return {connect(){}};}
    createGain(){return {gain:{value:1},connect(){}};}
    createAnalyser(){return {fftSize:1024,connect(){},getFloatTimeDomainData(buf){buf.fill(audio.amplitude);}};}
  };
  return audio;
}
test('microphone check measures sound, detects silence, and releases input after eight seconds',async()=>{
  const audio=testAudio(),f=fixture({audioContext:audio.Context});
  f.d.querySelector('#jv-mic-test').click();
  assert.equal(audio.created,1,'audio is activated before awaiting permission');
  for(let i=0;i<12;i++)await Promise.resolve();
  const meter=f.d.querySelector('#jv-miclevel');
  f.tick(100);assert.equal(meter.getAttribute('aria-valuenow'),'0');
  audio.amplitude=.1;f.tick(100);assert.equal(meter.getAttribute('aria-valuenow'),'50');
  assert.match(f.d.querySelector('#jv-micstate').textContent,/audio detected/);
  audio.amplitude=0;f.tick(4000);assert.match(f.d.querySelector('#jv-micstate').textContent,/No input detected/);
  f.tick(4000);assert.equal(meter.getAttribute('aria-valuenow'),'0');
  assert.ok(audio.closed&&f.tracks.every(t=>t.stopped));assert.equal(f.recs.length,0);f.close();
});
test('audio setup failures are visible and release the microphone',async()=>{
  const audio=testAudio();audio.Context.prototype.createAnalyser=()=>{throw new Error('Audio device unavailable');};
  const f=fixture({audioContext:audio.Context});await f.voice();
  assert.equal(f.recs.length,0);assert.ok(f.tracks.every(t=>t.stopped));
  assert.match(f.d.querySelector('#jv-heard').textContent,/Audio device unavailable/);f.close();
});

test('hover-to-click clicks a button once after about a second and not again until the ring leaves', () => {
  const f=fixture({dwell:true}); for(let i=0;i<5;i++) f.hands(hand()); assert.equal(f.clicks,0);
  for(let i=0;i<20;i++) f.hands(hand()); assert.equal(f.clicks,1);
  for(let i=0;i<60;i++) f.hands(hand()); assert.equal(f.clicks,1);
  const other=f.d.createElement('button'); f.d.body.append(other); f.target(other); for(let i=0;i<20;i++) f.hands(hand()); assert.equal(f.clicks,1); f.close();
});
test('a quick two-frame pinch clicks even on a slow camera', () => {
  const f=fixture(); f.hands(hand()); f.hands(hand(true),30); f.hands(hand(true),30); assert.equal(f.clicks,1); f.close();
});
test('face switch works right after the face appears, without holding still to calibrate', () => {
  const f=fixture(); for(let i=0;i<5;i++) f.face(); for(let i=0;i<6;i++) f.face(.3); assert.equal(f.switches,1); f.close();
});
