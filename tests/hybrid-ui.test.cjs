const {test}=require('node:test'),assert=require('node:assert/strict');
const {JSDOM}=require('jsdom'),fs=require('node:fs'),path=require('node:path'),{buildSync}=require('esbuild');
const root=path.join(__dirname,'..'),M=require('../model.js');
const stub=`class FieldScene {
  constructor(host){this.renderer={domElement:host.ownerDocument.createElement('canvas')};host.prepend(this.renderer.domElement);this.view='field';}
  setEnvironment(s,p){this.settings=p;this.scenario=s;}setHardware(){}setView(v){this.view=v;}setFlows(v){this.flows=v;}resize(){}render(){}zoomBy(){}setDoorOpen(){}
}`;
const sceneStub=`export class AdvancedScene {
  constructor(host){this.host=host;this.renderer={domElement:host.ownerDocument.createElement('canvas')};host.prepend(this.renderer.domElement);this.assetReady=Promise.resolve();this.panes=[];this.tour=false;}
  setEnvironment(s,p){this.settings=p;this.scenario=s;}setHardware(){}setView(v){this.view=v;if(v==='inside'){this.setDoorOpen(true);this.section=false;this.exploded=false;}}setFlows(v){this.flows=v;}setEnergy(v){this.energy=v;}setQuality(v){this.quality=v;}setSection(v){this.section=v;}setExploded(v){this.exploded=v;}setSunPosition(v){this.sunHour=v;}setDoorOpen(v){this.doorOpen=v;}
  resize(){}render(){}inspectPart(v){this.part=v;}
}`;
const contents=fs.readFileSync(path.join(root,'app.js'),'utf8').replace("import {FieldScene} from './scene.js';",stub);
const uiSource=fs.readFileSync(path.join(root,'src/advanced/hybrid-ui.js'),'utf8').replace("const {AdvancedScene}=await import('./advanced-scene.js');","const {AdvancedScene}=await Promise.resolve({AdvancedScene: window.TestAdvancedScene});");
const bundledUI=buildSync({stdin:{contents:uiSource,resolveDir:path.join(root,'src/advanced')},bundle:true,format:'iife',globalName:'HybridUI',write:false}).outputFiles[0].text;
const code=buildSync({stdin:{contents:contents.replace("import {installHybrid} from './src/advanced/hybrid-ui.js';","const {installHybrid}=window.HybridUI;"),resolveDir:root},bundle:true,format:'iife',write:false}).outputFiles[0].text;
function fixture(){
  const dom=new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'),{url:'http://localhost/',runScripts:'outside-only'});
  const w=dom.window;w.WindModel=M;w.matchMedia=()=>({matches:false});w.requestAnimationFrame=()=>0;
  w.eval(sceneStub.replace('export class AdvancedScene','window.TestAdvancedScene=class AdvancedScene'));
  w.eval(bundledUI);w.eval(code);
  return {w,d:w.document,s:w.ZW.states.air,close:()=>w.close()};
}
test('mode switching preserves the original scene and uses a bounded cached advanced instance',async()=>{
  const f=fixture(),s=f.s,basic=s.scene;basic.cameraMarker={orbit:.7,zoom:12};
  for(let i=0;i<8;i++){
    await s.hybrid.choose('advanced');assert.equal(s.scene,s.hybrid.scene);assert.equal(basic.renderer.domElement.hidden,true);
    assert.equal(s.root.querySelector('.controls').hidden,true);assert.equal(s.root.querySelector('.hy-controls').hidden,false);
    s.hybrid.tick(.1,true);const time=s.hybrid.sample.time;
    await s.hybrid.choose('basic');assert.equal(s.scene,basic);s.hybrid.tick(.1,true);assert.equal(s.hybrid.sample.time,time);
    assert.equal(basic.renderer.domElement.hidden,false);assert.equal(s.hybrid.scene.renderer.domElement.hidden,true);
  }
  assert.deepEqual(basic.cameraMarker,{orbit:.7,zoom:12});assert.equal(s.root.querySelectorAll('canvas').length,2);assert.equal(s.p.wind,4.5);
  f.close();
});
test('presets, presentation controls, component selection and pause update real state',async()=>{
  const f=fixture(),s=f.s,h=s.hybrid;await h.choose('advanced');
  for(const [preset,state] of [['wind','WIND'],['hybrid','HYBRID'],['electric','ELECTRIC'],['protected','PROTECTED']]){
    s.root.querySelector(`[data-hy-preset="${preset}"]`).click();for(let i=0;i<150;i++)h.tick(.1,true);h.render();
    assert.equal(h.sample.state,state,preset);assert.equal(s.root.querySelector('.hy-telemetry, [data-hy-stat], .hy-power-chain, .hy-clutches'),null);
  }
  for(const [key,property] of [['section','section'],['exploded','exploded'],['energy','energy'],['airflow','flows'],['night','night'],['fault','fault']]){
    const button=s.root.querySelector(`[data-hy-action="${key}"]`),before=button.getAttribute('aria-pressed')==='true';button.click();
    assert.equal(button.getAttribute('aria-pressed'),String(!before));assert.equal(['night','fault'].includes(key)?h.p[property]:h.scene[property],!before);
  }
  const parts=s.root.querySelector('[data-hy-component]');parts.value='WindClutch';parts.dispatchEvent(new f.w.Event('change'));assert.equal(h.scene.part,'WindClutch');assert.match(s.root.querySelector('[data-hy-part-name]').textContent,/freewheel/);
  const pause=s.root.querySelector('[data-hy-action="pause"]');pause.click();assert.equal(s.running,false);const time=h.sample.time;h.tick(.1,false);assert.equal(h.sample.time,time);
  f.w.ZW.switchMode('water');assert.equal(f.w.ZW.mode(),'water');f.w.ZW.switchMode('air');assert.equal(s.ventilationMode,'advanced');assert.equal(s.scene,h.scene);
  f.close();
});

test('advanced daylight, tracking and room controls stay independent of Basic',async()=>{
  const f=fixture(),s=f.s,h=s.hybrid,basic=s.scene;
  s.scenario={...s.scenario,weather:'night'};
  await h.choose('advanced');
  assert.equal(h.scene.scenario.weather,'clear');assert.equal(h.scene.settings.rain,0);
  const sun=s.root.querySelector('[data-hy-param="sunHour"]');sun.value='15.5';sun.dispatchEvent(new f.w.Event('input'));
  assert.equal(h.scene.sunHour,15.5);assert.match(s.root.querySelector('[data-hy-out="sunHour"]').textContent,/15:30/);
  assert.equal(s.root.querySelector('.hy-scene-title, .hy-sun-status, .hy-flow-legend, [data-hy-room-hint], .hy-bottom-caption'),null);
  h.tick(1,true);assert.ok(h.scene.sunHour>15.5,'sunlight and tracking advance automatically');
  const hour=h.scene.sunHour;h.tick(1,false);assert.equal(h.scene.sunHour,hour);
  const door=s.root.querySelector('[data-hy-action="door"]'),inside=s.root.querySelector('[data-hy-action="inside"]');
  door.click();assert.equal(h.scene.doorOpen,true);assert.equal(door.textContent,'Close door');
  door.click();assert.equal(h.scene.doorOpen,false);
  inside.click();assert.equal(h.scene.view,'inside');assert.equal(h.scene.doorOpen,true);assert.equal(inside.textContent,'Leave room');
  door.click();assert.equal(h.scene.doorOpen,false);assert.equal(h.scene.view,'inside');
  inside.click();assert.equal(h.scene.view,'field');assert.equal(h.scene.doorOpen,true);
  inside.click();s.root.querySelector('[data-hy-action="home"]').click();assert.equal(h.scene.view,'field');assert.equal(inside.textContent,'Enter room');
  s.root.querySelector('[data-hy-action="night"]').click();assert.equal(h.scene.scenario.weather,'night');h.tick(0,false);assert.equal(h.sample.pvW,0);
  await h.choose('basic');assert.equal(s.scene,basic);assert.equal(s.doorOpen,false);
  f.close();
});

test('Monsoon disables all solar and motor assistance, preserves wind and restores Sunny',async()=>{
  const f=fixture(),s=f.s,h=s.hybrid;await h.choose('advanced');
  s.root.querySelector('[data-hy-preset="hybrid"]').click();for(let i=0;i<100;i++)h.tick(.1,true);
  assert.ok(h.sample.motorW>0);assert.ok(h.sample.pvW>0);
  const weather=s.root.querySelector('[data-hy-select="weather"]'),sunHour=h.p.sunHour;
  weather.value='monsoon';weather.dispatchEvent(new f.w.Event('change'));
  assert.equal(h.scene.scenario.weather,'rain');assert.ok(h.scene.settings.rain>.5);assert.equal(h.scene.monsoon,true);
  for(let i=0;i<100;i++)h.tick(.1,true);
  assert.equal(h.sample.pvW,0);assert.equal(h.sample.motorW,0);assert.equal(h.sample.motorRPM,0);assert.equal(h.sample.batteryW,0);
  assert.equal(h.sample.state,'WIND');assert.ok(h.sample.fanRPM>0);assert.equal(h.p.sunHour,sunHour);
  assert.equal(s.root.querySelector('[data-hy-param="irradiance"]').disabled,true);
  weather.value='sunny';weather.dispatchEvent(new f.w.Event('change'));for(let i=0;i<100;i++)h.tick(.1,true);
  assert.equal(h.scene.scenario.weather,'clear');assert.equal(h.scene.settings.rain,0);assert.equal(h.scene.monsoon,false);
  assert.ok(h.sample.pvW>0);assert.ok(h.sample.motorW>0);assert.ok(h.p.sunHour>sunHour);
  f.close();
});

test('Advanced Urban Canyon selects the rebuilt district and sheltered wind without disabling solar',async()=>{
  const f=fixture(),s=f.s,h=s.hybrid;await h.choose('advanced');
  const weather=s.root.querySelector('[data-hy-select="weather"]');weather.value='canyon';weather.dispatchEvent(new f.w.Event('change'));
  assert.equal(h.scene.scenario.environment,'canyon');assert.equal(h.p.wind,2.8);assert.equal(h.scene.scenario.weather,'clear');
  for(let i=0;i<100;i++)h.tick(.1,true);
  assert.ok(h.sample.pvW>0);assert.ok(h.sample.motorW>0);assert.equal(h.scene.monsoon,false);
  f.close();
});

test('Advanced viewport scenario menu works in fit screen and stays synchronized with sidebar',async()=>{
  const f=fixture(),s=f.s,h=s.hybrid;await h.choose('advanced');
  const sidebar=s.root.querySelector('.hy-controls [data-hy-select="weather"]'),viewport=s.root.querySelector('.hy-overlay [data-hy-select="weather"]');
  s.root.querySelector('[data-hy-action="fit"]').click();assert.equal(s.root.querySelector('.viewport').classList.contains('expanded'),true);
  for(const mode of ['canyon','monsoon','sunny']){
    viewport.value=mode;viewport.dispatchEvent(new f.w.Event('change'));
    assert.equal(sidebar.value,mode);assert.equal(h.p.weather,mode);assert.equal(h.scene.monsoon,mode==='monsoon');
  }
  sidebar.value='monsoon';sidebar.dispatchEvent(new f.w.Event('change'));assert.equal(viewport.value,'monsoon');
  f.close();
});
