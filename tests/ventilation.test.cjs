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
