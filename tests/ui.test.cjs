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
test('all original inputs and weather cases remain usable without bottom readout panels',()=>{
  const f=fixture();
  for(const mode of ['air','water']){
    f.d.getElementById(mode+'-tab').click();const s=f.api.state();assert.equal(s.mode,mode);
    for(const scenario of f.api.scenarios[mode]){
      s.root.querySelector(`[data-scenario="${scenario.id}"]`).click();assert.equal(s.scenario.id,scenario.id);
      assert.equal(s.root.querySelector('[data-scenario-select]').value,scenario.id);
      assert.equal(s.root.querySelector('.readouts, [data-status-box], [data-metric]'),null);
      assert.deepEqual(s.current,M.steady(s.p,M.liveWind(s.p,s.t),s.hw));
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
