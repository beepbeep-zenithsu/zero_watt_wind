const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
const {makeScene,ready,T,updateCity}=require('../tools/verify-graphics.cjs');
const M=require('../model.js');

test('Blender neighborhood and detailed site are installed in both applications',async()=>{
  for(const mode of ['air','water']){
    const s=makeScene(mode),p={...M.defaults,_mode:mode,units:1,boats:1,upb:1};
    s.setEnvironment({weather:'clear',environment:'park'},p);await ready(s);
    const neighborhood=s.scene.getObjectByName('Blender neighborhood');assert.ok(neighborhood);
    const apartments=neighborhood.children.filter(o=>o.userData.asset?.startsWith('site-apartment'));
    assert.equal(apartments.length,3);assert.ok(apartments.every(o=>o.children.every(m=>m.isInstancedMesh)));
    const buildings=neighborhood.children.filter(o=>o.userData.cityBuildings);
    const facadeColors=new Set();
    for(const batch of buildings)for(const mesh of batch.children)if(mesh.instanceColor){
      for(let i=0;i<mesh.count;i++){const c=new T.Color();mesh.getColorAt(i,c);facadeColors.add(c.getHexString());}
    }
    assert.ok(facadeColors.size>=70,'coordinated individual building facade colors');
    assert.ok(buildings.reduce((count,b)=>count+b.children[0].count,0)>=100,'district has several blocks and a skyline');
    const quadrants=new Set(),matrix=new T.Matrix4(),point=new T.Vector3();
    for(const batch of buildings)for(let i=0;i<batch.children[0].count;i++){
      batch.children[0].getMatrixAt(i,matrix);point.setFromMatrixPosition(matrix);
      quadrants.add(`${Math.sign(point.x)},${Math.sign(point.z)}`);
      assert.ok(Math.abs(point.x)>s.city.hx||Math.abs(point.z)>s.city.hz,'buildings must stay outside the installation parcel');
    }
    for(const quadrant of ['-1,-1','-1,1','1,-1','1,1'])assert.ok(quadrants.has(quadrant));
    for(const name of ['Connected city streets','Continuous city sidewalks','Pedestrian zebra crossings','Civic plaza paving'])assert.ok(neighborhood.getObjectByName(name));
    assert.ok(s.shell.getObjectByName('Detailed landscaped site'));assert.ok(s.shell.getObjectByName('Jointed promenade pavers'));
    let districtMeshes=0,visibleMeshes=0;
    neighborhood.traverse(o=>{if(o.isMesh){let parent=o;while(parent&&parent!==s.city.fleet.group)parent=parent.parent;if(!parent)districtMeshes++;}});
    neighborhood.traverseVisible(o=>{if(o.isMesh)visibleMeshes++;});
    assert.ok(districtMeshes<250,'repeated district and rider geometry stays instanced');
    assert.ok(visibleMeshes<500,'only active premium LOD levels contribute visible mesh objects');
    if(mode==='air'){
      assert.ok(s.shell.getObjectByName('Blender architectural details'));
      assert.ok(s.people[0].getObjectByName('Blender site-seated-person'));
      // Added trim and drain pipes must preserve the actual window apertures.
      s.scene.updateMatrixWorld(true);
      for(const pane of s.panes){
        const side=Math.sign(pane.x);
        const ray=new T.Raycaster(new T.Vector3(pane.x+side*.6,pane.y+.3,pane.zc+pane.width*.2),new T.Vector3(-side,0,0),0,1);
        const opaque=ray.intersectObjects(s.shell.children,true).filter(h=>!h.object.material.transparent);
        assert.equal(opaque.length,0,'window trim must stay clear of the inlet');
      }
    }else{
      assert.ok(s.shell.getObjectByName('Jointed pond coping stones'));
      assert.ok(s.boatGroups[0].getObjectByName('Blender site-deck-cleat'));
      assert.ok(s.boatGroups[0].getObjectByName('Blender site-lifebuoy'));
      assert.ok(s.fish[0].getObjectByName('Blender site-fish'));
    }
  }
});

test('Urban Canyon uses detailed Blender towers and keeps the inspection camera clear',async()=>{
  const s=makeScene('air'),p={...M.defaults,_mode:'air',units:1};
  s.setEnvironment({weather:'clear',environment:'canyon'},p);s.setView('field');await ready(s);
  s.scene.updateMatrixWorld(true);s.cameraPosition(true);
  assert.equal(s.canyon.visible,true);assert.equal(s.canyon.children.length,2);
  for(const tower of s.canyon.children){
    assert.equal(tower.userData.asset,'site-canyon-tower');
    assert.ok(new T.Box3().setFromObject(tower).getSize(new T.Vector3()).y>15);
  }
  const focus=new T.Vector3(0,3.7,0),direction=focus.clone().sub(s.camera.position);
  const ray=new T.Raycaster(s.camera.position,direction.clone().normalize(),0,direction.length());
  assert.equal(ray.intersectObject(s.canyon,true).length,0,'nearby towers must frame the installation, not hide it');
  s.setEnvironment({weather:'clear',environment:'roof'},p);assert.equal(s.canyon.visible,false);
  assert.ok(s.scene.getObjectByName('Blender neighborhood'),'ordinary weather still has the full city');
});

test('city traffic pauses with the simulation, responds to weather and has independent night lighting',async()=>{
  const s=makeScene('air'),p={...M.defaults,_mode:'air',units:1};
  s.setEnvironment({weather:'clear',environment:'roof'},p);await ready(s);s.reducedMotion=false;
  const sample=M.steady(p,p.wind,M.evaluateHardware(p));
  const before=s.city.cars.map(c=>c.phase);s.render(.1,sample,true);
  assert.ok(s.city.cars.some((c,i)=>c.phase!==before[i]));
  const paused=s.city.cars.map(c=>c.phase);s.render(.5,sample,false);assert.deepEqual(s.city.cars.map(c=>c.phase),paused);
  for(let i=0;i<360;i++){
    s.time+=.1;updateCity(s,.1);
    for(const car of s.city.cars)for(const other of s.city.cars){
      if(car===other||car.lane!==other.lane)continue;
      const gap=(other.phase-car.phase+1)%1*s.city.paths[car.lane].getLength();
      assert.ok(gap>5.49,'vehicles must queue behind a stopped vehicle without overlapping');
    }
  }
  s.setEnvironment({weather:'night',environment:'roof'},p);s.render(0,sample,false);
  assert.ok(s.city.lights.every(l=>l.intensity>0));
  assert.equal(s.city.fleet.lamps.visible,true,'actual premium traffic retains night head/tail lamps');
  assert.ok(s.city.batches.some(b=>b.userData.glowMaterials.some(m=>m.emissiveIntensity>1)));
  s.setEnvironment({weather:'rain',environment:'roof'},{...p,rain:.85});s.render(0,sample,false);
  assert.ok(s.city.lights.every(l=>l.intensity===0));assert.ok(s.city.roadMaterial.roughness<.4);
});

test('city rebuilds fit large installations and retire instances without disposing cached models',async()=>{
  for(const mode of ['air','water']){
    const s=makeScene(mode),p={...M.defaults,_mode:mode,units:1,boats:1,upb:1};
    s.setEnvironment({weather:'clear',environment:'park'},p);await ready(s);
    const old=s.city.root,mesh=s.city.traffic.children[0];let disposed=0,geometryDisposed=0;
    mesh.addEventListener('dispose',()=>disposed++);mesh.geometry.addEventListener('dispose',()=>geometryDisposed++);
    s.setEnvironment({weather:'clear',environment:'park'},{...p,units:mode==='air'?10:12,boats:6,upb:2,pond:500});await ready(s);
    assert.equal(old.userData.retired,true);assert.equal(disposed,1);assert.equal(geometryDisposed,0);
    const parcel=s.city.root.userData.parcel;
    assert.equal(parcel.width,mode==='air'?s.roomW:s.pondL);assert.equal(parcel.depth,mode==='air'?s.roomD:s.pondW);
    assert.ok(parcel.rx>parcel.width/2+10);assert.ok(parcel.rz>parcel.depth/2+10);
  }
});

test('vehicle integration accelerates smoothly, articulates wheels and is stable across frame rates',async()=>{
  const a=makeScene('air'),b=makeScene('air'),p={...M.defaults,_mode:'air',units:1};
  for(const s of [a,b]){s.setEnvironment({weather:'clear',environment:'roof'},p);await ready(s);s.reducedMotion=false;}
  for(let i=0;i<300;i++){a.time=i/60;updateCity(a,1/60);}
  for(let i=0;i<600;i++){b.time=i/120;updateCity(b,1/120);}
  a.city.cars.forEach((c,i)=>{
    assert.ok(c.speed>=0&&c.speed<=8.4001);assert.ok(c.wheelAngle>=0);
    assert.ok(Math.abs(c.phase-b.city.cars[i].phase)<.0005,'equivalent elapsed time follows the same path');
    assert.ok(Number.isFinite(c.steering));
  });
  assert.ok(a.city.cars.some(c=>c.wheelAngle>5));
  const wheel=a.city.traffic.children.find(o=>o.name.startsWith('FL_'));
  assert.ok(wheel,'actual Blender wheel mesh retained');
  const matrix=new T.Matrix4();wheel.getMatrixAt(0,matrix);
  assert.ok(matrix.elements.every(Number.isFinite));
});

test('complete traffic cycle includes amber, clearance and actual red-light stopping',async()=>{
  const s=makeScene('air'),p={...M.defaults,_mode:'air',units:1};
  s.setEnvironment({weather:'clear',environment:'roof'},p);await ready(s);s.reducedMotion=false;
  const colors=new Set(),car=s.city.cars[0],line=s.city.stops[0].find(l=>l.axis===1&&!l.junction.offset),length=s.city.paths[0].getLength();
  s.city.cars=[car]; // Isolate the signal stop from the separate queue-spacing test.
  s.city.cycleTraffic.cars=[];s.city.pedestrians=[];
  s.city.network.owners.clear();s.city.network.crossings.clear();
  car.phase=(line.phase-7/length+1)%1;
  for(let i=0;i<600;i++){
    s.time=i/60;updateCity(s,1/60);colors.add(s.city.signalState.join('/'));
  }
  assert.ok(car.speed<.1,'car has braked at a red signal');
  const remaining=(line.phase-car.phase+1)%1*length;
  assert.ok(remaining>=3.29&&remaining<3.8,'extra front-bumper clearance protects turning traffic');
  const stopped=car.phase;
  for(let i=0;i<1800;i++){s.time=10+i/60;updateCity(s,1/60);colors.add(s.city.signalState.join('/'));}
  assert.ok(car.phase!==stopped,'car resumes when permitted');
  for(const state of ['green/red','amber/red','red/red','red/green','red/amber'])assert.ok(colors.has(state),state);
  assert.ok(!colors.has('green/green'));
  const {trafficSignal}=await import(pathToFileURL(path.join(__dirname,'../src/graphics/traffic.js')).href);
  s.city.signals.forEach((batch,axis)=>{
    const lenses=batch.children.filter(mesh=>mesh.material.name.startsWith('City signal'));
    batch.userData.signalPoses.forEach((pose,i)=>{
      let lit=0;
      for(const mesh of lenses){
        const color=new T.Color();mesh.getColorAt(i,color);
        const expected=mesh.material.name.endsWith(trafficSignal(s.city.network,s.city.simulationTime,pose.junction)[axis]);
        assert.ok(Math.abs(color.r-(expected?1:.055))<.00001);if(color.r>.9)lit++;
      }
      assert.equal(lit,1,'exactly one active lens on each physical signal');
    });
  });
});

test('pedestrians walk, converse, gesture, resume and pause without route jumps',async()=>{
  const s=makeScene('air');s.setEnvironment({weather:'clear',environment:'roof'},{...M.defaults,_mode:'air',units:1});await ready(s);s.reducedMotion=false;
  const walker=s.city.walkers.children.find(m=>m.name==='Body_Person_skin'),matrix=new T.Matrix4();
  const states=new Set();let last;
  for(let i=0;i<3600;i++){
    s.time=i/30;updateCity(s,1/30);for(const person of s.city.pedestrians)states.add(person.state);
    walker.getMatrixAt(0,matrix);const point=new T.Vector3().setFromMatrixPosition(matrix);
    if(last)assert.ok(point.distanceTo(last)<.085,`continuous fast walking at t=${s.city.pedestrianTime.toFixed(3)}`);last=point;
  }
  for(const state of ['walking','conversation','waiting','crossing'])assert.ok(states.has(state),state);
  const t=s.city.pedestrianTime;updateCity(s,0);assert.equal(s.city.pedestrianTime,t);
  assert.equal(new Set(s.city.pedestrians.map(p=>p.look.shirtColor)).size,8);
});

test('entrance ray selection toggles a smoothly hinged door and ignores an empty click',async()=>{
  const s=makeScene('air'),p={...M.defaults,_mode:'air',units:1};
  s.setEnvironment({weather:'clear',environment:'roof'},p);await ready(s);
  s.renderer.domElement={getBoundingClientRect:()=>({left:0,top:0,width:900,height:600})};
  s.camera.position.set(s.doorPivot.position.x+.7,1.8,s.roomD/2+5);s.camera.lookAt(s.doorPivot.position.x+.65,1.5,s.roomD/2);s.camera.updateMatrixWorld(true);
  const center=new T.Vector3(.65,1.1,0);s.doorPivot.localToWorld(center);center.project(s.camera);
  assert.equal(s.pickDoor((center.x+1)*450,(1-center.y)*300),true);assert.equal(s.doorOpen,true);
  const sample=M.steady(p,p.wind,M.evaluateHardware(p));
  s.render(.05,sample,false);assert.ok(s.doorPivot.rotation.y<0&&s.doorPivot.rotation.y>-Math.PI*.58);
  for(let i=0;i<60;i++)s.render(.05,sample,false);
  assert.equal(s.doorPivot.rotation.y,s.doorTarget);
  s.setDoorOpen(false);for(let i=0;i<60;i++)s.render(.05,sample,false);assert.equal(s.doorPivot.rotation.y,0);
  assert.equal(s.pickDoor(-100,-100),false);
});

test('traffic starts with bounded jerk and smoothly eases its heading',async()=>{
  const s=makeScene('air');s.setEnvironment({weather:'clear',environment:'roof'},{...M.defaults,_mode:'air',units:1});await ready(s);s.reducedMotion=false;
  const car=s.city.cars[2];let acceleration=car.acceleration,speed=car.speed,heading=car.heading;
  for(let i=0;i<180;i++){
    s.time=i/120;updateCity(s,1/120);
    assert.ok(Math.abs(car.acceleration-acceleration)<=2.2/120+1e-6,'startup acceleration must ramp instead of snapping');
    assert.ok(Math.abs(car.speed-speed)<2.4/120+.001);
    const turn=Math.atan2(Math.sin(car.heading-heading),Math.cos(car.heading-heading));assert.ok(Math.abs(turn)<.04);
    acceleration=car.acceleration;speed=car.speed;heading=car.heading;
  }
  assert.ok(car.speed>.3);
});
