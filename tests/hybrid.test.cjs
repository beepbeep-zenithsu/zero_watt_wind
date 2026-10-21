const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {HYBRID_DEFAULTS,createHybridState,stepHybrid,AdvancedScene,makeScene,ready,T,meshSnapshot}=require('../tools/verify-graphics.cjs');
const M=require('../model.js');
function run(options,seconds=20,state){const p={...HYBRID_DEFAULTS,...options},s=state||createHybridState(p);for(let i=0;i<seconds*40;i++)stepHybrid(s,p,.025);return s;}
test('wind, weak-wind hybrid, motor-only and protection demonstrations settle correctly',()=>{
  const wind=run({wind:6});assert.equal(wind.state,'WIND');assert.equal(wind.motorW,0);assert.ok(wind.windEngaged);assert.ok(wind.batteryW>0);
  const hybrid=run({wind:4});assert.equal(hybrid.state,'HYBRID');assert.ok(hybrid.windContribution>0);assert.ok(hybrid.motorW>0);assert.ok(hybrid.windEngaged&&hybrid.motorEngaged);assert.ok(Math.abs(hybrid.fanRPM-240)<.1);
  const electric=run({wind:0,night:true});assert.equal(electric.state,'ELECTRIC');assert.equal(electric.windRPM,0);assert.equal(electric.windEngaged,false);assert.equal(electric.pvW,0);assert.ok(electric.batteryW<0);assert.ok(electric.soc<72);assert.ok(Math.abs(electric.motorRPM/electric.fanRPM-34/22)<1e-10);
  const low=run({wind:2,soc:8});assert.equal(low.state,'PROTECTED');assert.equal(low.motorW,0);assert.ok(low.fanRPM>0);assert.ok(low.belowTarget);assert.match(low.warning,/Low battery/);
  const fault=run({wind:6,fault:true});assert.equal(fault.motorW,0);assert.ok(fault.fanRPM>240,'wind operation survives motor faults');assert.match(fault.warning,/fault/);
});
test('PV and battery are finite; empty night system stops and full battery curtails surplus',()=>{
  const dead=run({wind:0,soc:0,night:true});assert.equal(dead.motorW,0);assert.equal(dead.fanRPM,0);assert.equal(dead.airflow,0);
  const full=run({wind:6,soc:100});assert.equal(full.soc,100);assert.equal(full.batteryW,0);assert.ok(full.curtailedW>0);
  const limited=run({wind:0,targetRPM:500,irradiance:0});assert.ok(limited.belowTarget);assert.ok(limited.motorW<=95);assert.ok(limited.motorW>=0);
  const s=createHybridState({soc:60});const pv=run({wind:0,irradiance:100},20,s);
  assert.ok(pv.pvW<20);assert.ok(pv.batteryW<0);assert.ok(Math.abs(pv.motorW-pv.pvW+pv.batteryW)<1e-9);
});
test('assistance requires timed verification; battery recovery has separate hysteresis',()=>{
  const s=createHybridState();run({wind:0},1,s);assert.equal(s.assist,false);run({wind:0},1,s);assert.equal(s.assist,true);
  s.soc=10;stepHybrid(s,HYBRID_DEFAULTS,.025);assert.equal(s.motorW,0);assert.equal(s.lowBattery,true);
  s.soc=16;stepHybrid(s,HYBRID_DEFAULTS,.025);assert.equal(s.lowBattery,true);
  s.soc=21;stepHybrid(s,HYBRID_DEFAULTS,.025);assert.equal(s.lowBattery,false);
  const a=run({wind:0});const before=[a.soc,a.fanRPM,a.time];stepHybrid(a,{wind:0},0);assert.deepEqual([a.soc,a.fanRPM,a.time],before);
});
async function advancedFixture(){
  const s=makeScene('air');Object.setPrototypeOf(s,AdvancedScene.prototype);
  s.host={dataset:{},dispatchEvent(){}};
  s.renderer={render(){},domElement:{setAttribute(){},addEventListener(){}},shadowMap:{}};
  s.initializeHybrid();
  const p={...M.defaults,_mode:'air',wind:4};s.setEnvironment({weather:'clear',environment:'roof'},p);
  await s.assetReady;await ready(s);assert.equal(s.failed,false);
  return {s,p,sample:M.steady(p,4,M.evaluateHardware(p))};
}
test('actual Blender GLB loads with finite geometry, all pivots and the intended shaft origins',async()=>{
  const {s}=await advancedFixture();
  for(const name of ['WindRotor','Frame','WindClutch','InputGear','OutputGear','Motor','Belt','MotorClutch','Fan','FanHousing','Duct','SolarArray','Electrical','Sensors'])assert.ok(s.parts[name],name);
  assert.ok(s.parts.WindRotor.position.distanceTo(new T.Vector3(-1.83,1.55,0))<.00001);
  assert.ok(s.parts.Fan.position.distanceTo(new T.Vector3(1.02,.31,0))<.00001);
  let vertices=0,meshes=0;
  s.assembly.traverse(o=>{if(o.isMesh){meshes++;const a=o.geometry.attributes.position;vertices+=a.count;assert.ok(Array.from(a.array).every(Number.isFinite));}});
  assert.ok(meshes<65);assert.ok(vertices<200000);
  s.scene.updateMatrixWorld(true);
  const bounds=new T.Box3().setFromObject(s.assembly);assert.ok(bounds.max.x<5&&bounds.min.x>-4);assert.ok(bounds.min.y>1.4&&bounds.max.y<7);
  const fanBounds=new T.Box3().setFromObject(s.parts.Fan);assert.ok(fanBounds.min.y>3.8&&fanBounds.max.y<4.2);
  const pvBounds=new T.Box3().setFromObject(s.parts.SolarArray);assert.ok(pvBounds.min.y>=3.7,'PV sits on roof');
  const vertex=new T.Vector3();
  s.parts.Frame.traverse(o=>{if(o.isMesh){
    const positions=o.geometry.attributes.position;
    for(let i=0;i<positions.count;i++){
      vertex.fromBufferAttribute(positions,i).applyMatrix4(o.matrixWorld);
      if(Math.hypot(vertex.x-1.02,vertex.z)<.45)assert.ok(vertex.y<4.881,'fan bridge must stay below the bevel gears');
    }
  }});
});
test('advanced animation shares RPM ratios, pauses, sections and reassembles without drifting',async()=>{
  const {s,sample}=await advancedFixture();s.hybridSample=run({wind:4});
  const input=s.parts.InputGear.rotation.x,fan=s.parts.Fan.rotation.y,motor=s.parts.MotorPulley.rotation.y;
  s.render(.1,sample,true);
  const fd=s.parts.Fan.rotation.y-fan,md=s.parts.MotorPulley.rotation.y-motor;
  assert.ok(Math.abs(s.parts.InputGear.rotation.x-input+fd)<1e-10);
  assert.ok(Math.abs(md/fd-34/22)<1e-10);
  const angle=s.parts.Fan.rotation.y;s.render(.1,sample,false);assert.equal(s.parts.Fan.rotation.y,angle);
  s.setSection(true);assert.equal(s.shell.getObjectByName('full-roof').visible,false);assert.equal(s.parts.CabinetDoor.visible,false);
  s.setSection(false);assert.equal(s.shell.getObjectByName('full-roof').visible,true);
  assert.equal(s.unitRoot.visible,false);assert.equal(s.ventilationVFX.root.visible,false);
  const home=s.parts.WindRotor.position.clone();s.setExploded(true);s.render(.1,sample,false);assert.ok(s.parts.WindRotor.position.distanceTo(home)>.5);
  s.setExploded(false);s.render(.1,sample,false);assert.ok(s.parts.WindRotor.position.distanceTo(home)<1e-8);
  s.setFlows(false);s.setEnergy(false);s.render(.1,sample,false);assert.ok(s.pathLayers.every(l=>!l.particles.visible));
  s.reducedMotion=false;s.tour=true;s.cameraUser=false;s.tourTime=0;
  s.updateHybrid(6.1,s.hybridSample,false);assert.ok(s.target.distanceTo(new T.Vector3(-1.8,5.2,0))<1e-8);
  s.tour=false;s.reducedMotion=true;
  // Save actual scene geometry for visual review, independently of a browser.
  s.setSection(true);s.setFlows(true);s.setEnergy(true);s.setView('field');s.render(.016,sample,true);s.cameraPosition(true);
  fs.mkdirSync(path.join(__dirname,'../docs/hybrid'),{recursive:true});
  meshSnapshot(s,path.join(__dirname,'../.upgrade-baseline/verification/hybrid.json'));
});

test('sun tracking aligns the module normal and keeps the roof rack anchored',async()=>{
  const {s,sample}=await advancedFixture(),rack=s.assembly.getObjectByName('SolarRack');
  s.scene.updateMatrixWorld(true);const fixed=new T.Box3().setFromObject(rack);
  const angles=[];
  for(const hour of [6,9,12,15,18]){
    s.setSunPosition(hour);s.scene.updateMatrixWorld(true);
    const normal=new T.Vector3(0,1,0).transformDirection(s.parts.SolarTilt.matrixWorld);
    assert.ok(normal.dot(s.sunDirection)>.99999,'module must face the same direction as the sunlight');
    const bounds=new T.Box3().setFromObject(rack);assert.ok(bounds.min.distanceTo(fixed.min)<1e-7);assert.ok(bounds.max.distanceTo(fixed.max)<1e-7);
    assert.ok(new T.Box3().setFromObject(s.parts.SolarTilt).min.y>3.75,'tilting module must clear the roof');
    angles.push(s.parts.SolarYaw.rotation.y);
  }
  assert.ok(angles[0]<angles[2]&&angles[2]<angles[4]);
  s.irradiance=1000;s.render(.016,sample,false);assert.equal(s.sunDisc,undefined);assert.equal(s.sunRays,undefined);assert.ok(s.sun.intensity>4);
  s.night=true;s.render(.016,sample,false);assert.equal(s.sun.intensity,0);
  s.night=false;s.irradiance=0;s.render(.016,sample,false);assert.equal(s.sun.intensity,0);
  s.monsoon=true;s.setSunPosition(14);s.render(.016,sample,false);assert.equal(s.sun.intensity,0);assert.equal(s.parts.SolarYaw.rotation.y,0);assert.equal(s.parts.SolarTilt.rotation.x,Math.PI/18);
});

test('Monsoon operates solely on wind regardless of battery, sunlight and assistance policy',()=>{
  for(const soc of [0,8,72,100]){
    const s=run({wind:4,weather:'monsoon',irradiance:1200,soc});
    assert.equal(s.pvW,0);assert.equal(s.motorW,0);assert.equal(s.batteryW,0);assert.equal(s.soc,soc);
    assert.ok(s.fanRPM>0);assert.equal(s.state,'WIND');assert.equal(s.motorEngaged,false);
  }
  const still=run({wind:0,weather:'monsoon'});assert.equal(still.fanRPM,0);assert.equal(still.state,'IDLE');
});

test('advanced exhaust clears the roof and the entrance supports an enclosed interior view',async()=>{
  const {s,sample}=await advancedFixture();s.scene.updateMatrixWorld(true);
  const roof=s.shell.getObjectByName('full-roof');
  assert.equal(new T.Raycaster(new T.Vector3(1.02,5,0),new T.Vector3(0,-1,0),0,2).intersectObject(roof).length,0,'intake and roof aperture must share their center');
  assert.ok(new T.Raycaster(new T.Vector3(1.35,5,-1.8),new T.Vector3(0,-1,0),0,2).intersectObject(roof).length,'unused Basic aperture must be filled');
  const grille=new T.Box3().setFromObject(s.shell.getObjectByName('Fitted intake grille'));
  assert.ok(Math.abs(grille.getSize(new T.Vector3()).z-(s.panes[0].width-.10))<.01);
  s.setView('inside');s.render(.016,sample,false);
  assert.equal(s.doorOpen,true);assert.equal(s.section,false);assert.equal(roof.visible,true);
  assert.ok(Math.abs(s.camera.position.x)<s.roomW/2&&Math.abs(s.camera.position.z)<s.roomD/2);
  assert.equal(s.camera.position.y,1.65);
  const forward=s.camera.getWorldDirection(new T.Vector3());assert.ok(forward.z<0,'entry view looks into the room');
  s.orbitBy(0,-.5);assert.ok(s.camera.getWorldDirection(new T.Vector3()).y>0,'interior controls can look up at the ceiling intake');
  s.setDoorOpen(false);for(let i=0;i<60;i++)s.render(.05,sample,false);assert.equal(s.doorPivot.rotation.y,0);assert.equal(s.view,'inside');
  for(let i=0;i<30;i++)s.zoomBy(.5);
  assert.ok(Math.abs(s.camera.position.x)<=s.roomW/2-.5&&Math.abs(s.camera.position.z)<=s.roomD/2-.5);
  s.setView('field');s.cameraPosition(true);assert.ok(s.camera.position.y>3.7);
});
