import {HYBRID_DEFAULTS,createHybridState,stepHybrid} from './hybrid-model.js';

const partInfo={
  WindRotor:['Spiral wind rotor','Three curved blades capture wind and drive the horizontal input shaft.'],
  Frame:['Bearings & support frame','Pillow blocks, a vertical bridge bearing and vibration-isolated roof mounts support both axes.'],
  WindClutch:['W · wind freewheel','Connects the wind input when it catches the common shaft; overruns during faster motor drive.'],
  InputGear:['90° bevel gears','Equal miter gears couple the horizontal and vertical axes at a 1:1 ratio.'],
  Motor:['DC assist motor','A PWM driver requests only the power needed and available on the protected 24 V bus.'],
  Belt:['Belt & pulleys','The 22:34 pulley radii set motor speed to 1.545 times the common shaft speed.'],
  MotorClutch:['M · motor freewheel','Isolates the stationary motor transmission during adequate wind.'],
  Fan:['Pitched axial fan','A vertical shaft extracts indoor air through the roof opening into the sealed plenum.'],
  FanHousing:['Shaft sleeve & plenum','The sealed sleeve isolates the rotating shaft from air. Section view reveals the fan and chamber.'],
  Duct:['Exhaust duct & cowl','A connected rectangular branch carries air out past the rear roof edge.'],
  SolarArray:['Sun-tracking photovoltaic array','A fixed roof rack supports a module that turns and tilts toward the sun. Change Sun position to see it follow the light. Estimated output follows irradiance and controller losses.'],
  Electrical:['Battery & controller','A 240 Wh concept battery charges from surplus PV. Fuses, a disconnect and a driver protect the DC bus.'],
  Sensors:['Shaft tachometers','Independent input and fan speeds govern assistance with hysteresis and timed verification.']
};
const range=(key,label,min,max,step,value,unit)=>`<label class="hy-range"><span>${label}<output data-hy-out="${key}">${value} ${unit}</output></span><input type="range" data-hy-param="${key}" aria-label="${label}" min="${min}" max="${max}" step="${step}" value="${value}"></label>`;
const toggle=(key,label,on=false)=>`<button type="button" data-hy-action="${key}" aria-pressed="${on}">${label}</button>`;
const n=(v,d=0)=>Number(v||0).toLocaleString('en-US',{maximumFractionDigits:d,minimumFractionDigits:d});

export function installHybrid(s,{recompute,toggleFit,setSceneView}){
  const root=s.root,host=root.querySelector('.viewport'),layout=root.querySelector('.sim-layout');
  const controls=root.querySelector('.controls');
  s.ventilationMode='basic';
  const h=s.hybrid={p:{...HYBRID_DEFAULTS},sample:createHybridState(),scene:null,loading:false,selected:null};
  const selector=document.createElement('div');selector.className='vent-mode-selector';
  selector.setAttribute('role','group');selector.setAttribute('aria-label','Ventilation mode');
  selector.innerHTML=`<button data-vent-mode="basic" aria-pressed="true"><i>01</i><span><strong>Basic Mode</strong><small>Wind-Driven Ventilation</small></span><b>WIND</b></button><button data-vent-mode="advanced" aria-pressed="false"><i>02</i><span><strong>Advanced Mode</strong><small>Solar-Assisted Hybrid Ventilation</small></span><b>WIND + SOLAR</b></button>`;
  root.querySelector('.window').prepend(selector);
  const aside=document.createElement('aside');aside.className='hy-controls';aside.hidden=true;
  aside.innerHTML=`<div class="hy-eyebrow">ADVANCED SYSTEM <span>24 V DC</span></div><h2>Energy in balance.</h2><p class="hy-intro">Wind first. Assistance when needed.</p>
    <label class="hy-select">Scenario<select data-hy-select="weather"><option value="sunny">Sunny · solar + wind</option><option value="canyon">Urban canyon · sheltered wind + solar</option><option value="monsoon">Monsoon · wind only</option></select></label>
    <div class="hy-presets" role="group" aria-label="Operating demonstrations"><button data-hy-preset="wind">Adequate wind</button><button data-hy-preset="hybrid">Weak wind</button><button data-hy-preset="electric">No wind</button><button data-hy-preset="protected">Low battery</button></div>
    <div class="hy-section-label">ENVIRONMENT</div>
    ${range('wind','Wind speed',0,20,.1,h.p.wind,'m/s')}${range('irradiance','Solar irradiance',0,1200,10,h.p.irradiance,'W/m²')}${range('sunHour','Sun position',6,18,.25,h.p.sunHour,'h')}${range('soc','Set battery charge',0,100,1,h.p.soc,'%')}${range('targetRPM','Target fan speed',80,500,10,h.p.targetRPM,'RPM')}
    <label class="hy-select">Control policy<select data-hy-select="control"><option value="auto">Automatic assistance</option><option value="wind-only">Wind only · motor inhibited</option></select></label>
    <div class="hy-inline-toggles">${toggle('night','Night')}${toggle('fault','Inject fault')}</div>
    <div class="hy-section-label">PRESENTATION</div>
    <label class="hy-select">Animation & simulation speed<select data-hy-select="speed"><option value=".5">0.5×</option><option value="1" selected>1× · real time</option><option value="2">2×</option><option value="5">5×</option></select></label>
    <label class="hy-select">Render quality<select data-hy-select="quality"><option value="auto">Adaptive</option><option value="high">High · soft shadows</option><option value="low">Low · reduced resolution</option></select></label>
    <div class="hy-section-label">COMPONENT INSPECTION</div>
    <label class="hy-select"><span class="sr-only">Select component</span><select data-hy-component><option value="">Choose a component…</option>${Object.entries(partInfo).map(([key,[name]])=>`<option value="${key}">${name}</option>`).join('')}</select></label>
    <div class="hy-inspection" aria-live="polite"><small>ENGINEERING NOTES</small><h3 data-hy-part-name>One connected system.</h3><p data-hy-part-text>Select a component in the scene or the list to focus the camera and explore its function.</p></div>
    <p class="hy-note">Concept demonstration. RPM, power and airflow are estimates, not certified performance. Flow paths are illustrative. Rotation displayed at 0.22× to reduce aliasing.</p>`;
  layout.insertBefore(aside,controls);
  const overlay=document.createElement('div');overlay.className='hy-overlay';overlay.hidden=true;
  overlay.innerHTML=`<p class="hy-asset-error" data-hy-assets role="status" hidden></p>
    <label class="hy-viewport-scenario"><span class="sr-only">Advanced scenario</span><select data-hy-select="weather" aria-label="Advanced scenario"><option value="sunny">☀ Sunny · solar + wind</option><option value="canyon">≋ Urban canyon</option><option value="monsoon">☂ Monsoon · wind only</option></select></label>
    <div class="hy-toolbar" role="group" aria-label="Advanced scene controls">${toggle('pause',s.running?'Pause':'Play',!s.running)}${toggle('section','Section')}${toggle('exploded','Explode')}${toggle('airflow','Airflow',true)}${toggle('energy','Energy',true)}${toggle('tour','Tour')}<button data-hy-action="home">Reset camera</button><button data-hy-action="fit">⛶ Full screen</button></div>
    <div class="hy-room-controls" role="group" aria-label="Room access">${toggle('door','Open door')}${toggle('inside','Enter room')}<button data-hy-action="city">City view</button></div>`;
  host.append(overlay);
  host.addEventListener('hybrid-inspect',e=>showPart(e.detail));
  host.addEventListener('door-change',()=>h.render?.());
  function assetError(message){const status=overlay.querySelector('[data-hy-assets]');status.textContent=message;status.hidden=false;}
  host.addEventListener('hybrid-error',()=>assetError('Assembly unavailable · check assets/hybrid or run npm run assets:hybrid'));
  function showPart(key){
    if(!partInfo[key])return;h.selected=key;
    aside.querySelector('[data-hy-component]').value=key;
    aside.querySelector('[data-hy-part-name]').textContent=partInfo[key][0];
    aside.querySelector('[data-hy-part-text]').textContent=partInfo[key][1];
  }
  async function choose(mode){
    if(mode===s.ventilationMode)return;
    if(!s.basicScene)s.basicScene=s.scene;
    s.ventilationMode=mode;root.dataset.ventilation=mode;
    selector.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.ventMode===mode));
    const advanced=mode==='advanced';controls.hidden=advanced;aside.hidden=!advanced;overlay.hidden=!advanced;
    if(s.basicScene?.renderer)s.basicScene.renderer.domElement.hidden=advanced;
    if(advanced){
      if(!h.scene&&!h.loading){
        h.loading=true;
        try{
          const {AdvancedScene}=await import('./advanced-scene.js');
          h.scene=new AdvancedScene(host);
          applyEnvironment();h.scene.setSunPosition(h.p.sunHour);
          h.scene.setHardware(s.hw,s.p);h.scene.setView('field');h.scene.setQuality(h.p.quality);
          h.scene.setFlows(h.airflow??true);h.scene.setEnergy(h.energy??true);
          h.scene.setSection(!!h.section);h.scene.setExploded(!!h.exploded);
          await h.scene.assetReady;
          if(h.scene.failed)assetError('Assembly failed to load');
        }catch(e){assetError('3D unavailable · controls and energy model remain active');console.error(e);}
        finally{h.loading=false;}
      }
      // Async imports/exports may finish after the user switches back to Basic.
      if(s.ventilationMode==='advanced'&&h.scene){s.scene=h.scene;h.scene.renderer.domElement.hidden=false;h.scene.resize();}
      else if(h.scene)h.scene.renderer.domElement.hidden=true;
    }else{
      if(h.scene){h.scene.tour=false;h.scene.renderer.domElement.hidden=true;}
      s.scene=s.basicScene;s.scene?.resize();
    }
    h.render();
  }
  selector.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>choose(b.dataset.ventMode)));
  aside.querySelectorAll('[data-hy-param]').forEach(el=>el.addEventListener('input',()=>{
    const key=el.dataset.hyParam;h.p[key]=Number(el.value);
    const unit={wind:'m/s',irradiance:'W/m²',soc:'%',targetRPM:'RPM'}[key];
    aside.querySelector(`[data-hy-out="${key}"]`).textContent=key==='sunHour'?sunTime():n(h.p[key],key==='wind'?1:0)+' '+unit;
    if(key==='sunHour')h.scene?.setSunPosition(h.p.sunHour);
    if(key==='irradiance'&&h.scene)h.scene.irradiance=h.p.irradiance;
    if(key==='soc'){h.sample.soc=h.p.soc;h.sample.lowBattery=h.p.soc<=h.p.lowSOC;}
    h.render();
  }));
  [...aside.querySelectorAll('[data-hy-select]'),...overlay.querySelectorAll('[data-hy-select]')].forEach(el=>el.addEventListener('change',()=>{
    const key=el.dataset.hySelect;h.p[key]=key==='speed'?Number(el.value):el.value;
    if(key==='quality')h.scene?.setQuality(el.value);
    if(key==='weather'){
      root.querySelectorAll('[data-hy-select="weather"]').forEach(select=>select.value=h.p.weather);
      if(h.p.weather==='canyon'){
        h.p.wind=2.8;const wind=aside.querySelector('[data-hy-param="wind"]');wind.value=h.p.wind;wind.dispatchEvent(new Event('input'));
      }
      h.p.night=false;aside.querySelector('[data-hy-action="night"]').setAttribute('aria-pressed',false);
      applyEnvironment();h.tick(0,false);h.render();
    }
  }));
  aside.querySelector('[data-hy-component]').addEventListener('change',e=>{showPart(e.target.value);h.scene?.inspectPart(e.target.value);});
  const presets={wind:{wind:6,irradiance:850,soc:72,fault:false,night:false},hybrid:{wind:4,irradiance:400,soc:65,fault:false,night:false},electric:{wind:0,irradiance:700,soc:65,fault:false,night:false},protected:{wind:2,irradiance:150,soc:8,fault:false,night:false}};
  aside.querySelectorAll('[data-hy-preset]').forEach(b=>b.addEventListener('click',()=>{
    Object.assign(h.p,presets[b.dataset.hyPreset],{control:'auto'});h.sample=createHybridState(h.p);
    aside.querySelector('[data-hy-select="control"]').value='auto';
    aside.querySelectorAll('[data-hy-param]').forEach(el=>{el.value=h.p[el.dataset.hyParam];el.dispatchEvent(new Event('input'));});
    for(const key of ['night','fault'])aside.querySelector(`[data-hy-action="${key}"]`).setAttribute('aria-pressed',h.p[key]);
    applyEnvironment();h.render();
  }));
  function applyEnvironment(){
    // Advanced has its own daylight controls, independent of the Basic scenario.
    const monsoon=h.p.weather==='monsoon';
    h.scene?.setEnvironment({...s.scenario,weather:monsoon?'rain':h.p.night?'night':'clear',environment:h.p.weather==='canyon'?'canyon':'park'},{...s.p,wind:h.p.wind,rain:monsoon?.85:0,ambient:monsoon?26:29});
    if(h.scene){h.scene.monsoon=monsoon;h.scene.irradiance=monsoon?0:h.p.irradiance;h.scene.setSunPosition(h.p.sunHour);}
    for(const key of ['irradiance','sunHour'])aside.querySelector(`[data-hy-param="${key}"]`).disabled=monsoon;
    aside.querySelector('[data-hy-select="control"]').disabled=monsoon;
    aside.querySelector('[data-hy-select="control"]').value=monsoon?'wind-only':h.p.control;
    aside.querySelector('[data-hy-out="irradiance"]').textContent=n(monsoon?0:h.p.irradiance)+' W/m²';
    aside.querySelector('[data-hy-action="night"]').disabled=monsoon;
    // A fully open inlet is used in this isolated concept installation.
    h.scene?.panes.forEach(p=>p.piv.rotation.y=p.sign*.8);
  }
  function sunTime(){
    const minutes=Math.round(h.p.sunHour*60);
    return `${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`;
  }
  function action(button){
    const key=button.dataset.hyAction;
    if(key==='pause'){s.running=!s.running;button.textContent=s.running?'Pause':'Play';button.setAttribute('aria-pressed',!s.running);return;}
    if(key==='home'){if(h.scene){h.scene.tour=false;h.scene.setView('field');}h.render();return;}
    if(key==='city'){h.scene?.setView('city');h.render();return;}
    if(key==='fit'){toggleFit(s);return;}
    if(key==='door'){if(h.scene)h.scene.setDoorOpen(!h.scene.doorOpen);h.render();return;}
    if(key==='inside'){
      if(h.scene){if(h.scene.view==='inside')h.scene.setDoorOpen(true);h.scene.setView(h.scene.view==='inside'?'field':'inside');}
      h.render();return;
    }
    const value=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',value);
    if(key==='night'||key==='fault'){h.p[key]=value;if(key==='night')applyEnvironment();}
    else h[key]=value;
    if(key==='section')h.scene?.setSection(value);
    if(key==='exploded')h.scene?.setExploded(value);
    if(key==='airflow')h.scene?.setFlows(value);
    if(key==='energy')h.scene?.setEnergy(value);
    if(key==='tour'&&h.scene){if(value&&h.scene.view==='inside')h.scene.setView('field');h.scene.tour=value;h.scene.tourTime=0;h.scene.cameraUser=false;}
    h.render();
  }
  [...aside.querySelectorAll('[data-hy-action]'),...overlay.querySelectorAll('[data-hy-action]')].forEach(b=>b.addEventListener('click',()=>action(b)));
  h.choose=choose;h.applyEnvironment=applyEnvironment;
  h.tick=(dt,running)=>{
    if(s.ventilationMode!=='advanced')return;
    const elapsed=running?dt*h.p.speed:0;
    // A five-minute illustrative day. Tracking needs no manual panel adjustment.
    if(elapsed&&!h.p.night&&h.p.weather!=='monsoon'){
      h.p.sunHour=6+((h.p.sunHour-6+elapsed*12/300)%12);
      aside.querySelector('[data-hy-param="sunHour"]').value=h.p.sunHour;
      aside.querySelector('[data-hy-out="sunHour"]').textContent=sunTime();
      h.scene?.setSunPosition(h.p.sunHour);
    }
    // Fixed small steps preserve freewheel/control behavior at all speed settings.
    let remaining=elapsed;
    if(!remaining)stepHybrid(h.sample,h.p,0);
    while(remaining>1e-8){const step=Math.min(remaining,.025);stepHybrid(h.sample,h.p,step);remaining-=step;}
    if(h.scene){h.scene.hybridSample=h.sample;h.scene.hybridWind=h.p.wind;h.scene.irradiance=h.p.weather==='monsoon'?0:h.p.irradiance;}
  };
  h.render=()=>{
    const tour=overlay.querySelector('[data-hy-action="tour"]');
    if(h.scene)tour.setAttribute('aria-pressed',h.scene.tour);
    if(h.scene)overlay.querySelector('[data-hy-action="section"]').setAttribute('aria-pressed',h.scene.section);
    if(h.scene){
      const inside=h.scene.view==='inside',door=overlay.querySelector('[data-hy-action="door"]'),enter=overlay.querySelector('[data-hy-action="inside"]');
      door.setAttribute('aria-pressed',!!h.scene.doorOpen);door.textContent=h.scene.doorOpen?'Close door':'Open door';
      enter.setAttribute('aria-pressed',inside);enter.textContent=inside?'Leave room':'Enter room';
      overlay.querySelector('[data-hy-action="exploded"]').setAttribute('aria-pressed',h.scene.exploded);
    }
  };
  aside.querySelector('[data-hy-out="sunHour"]').textContent=sunTime();
  h.render();return h;
}
