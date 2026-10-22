const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
const url=f=>pathToFileURL(path.join(__dirname,'..',f)).href;
test('traffic catalog has eight unique cars with three ascending LODs',async()=>{
  const {TRAFFIC_CARS,TRAFFIC_LOD_DISTANCES}=await import(url('src/cars/car-catalog.js'));
  assert.equal(TRAFFIC_CARS.length,8);
  assert.equal(new Set(TRAFFIC_CARS.map(c=>c.id)).size,8);
  for(const c of TRAFFIC_CARS){assert.equal(c.lods.length,3);assert.ok(c.lods[2].endsWith(`${c.id}-lod2.glb`));}
  assert.deepEqual([...TRAFFIC_LOD_DISTANCES].sort((a,b)=>a-b),TRAFFIC_LOD_DISTANCES);
});
test('LOD clones share geometry and materials with the cached template',async()=>{
  const T=await import(url('vendor/three.module.js')),{buildTrafficLod}=await import(url('src/cars/traffic-fleet.js'));
  const mk=n=>{const g=new T.Group(),m=new T.Mesh(new T.BoxGeometry(1,1,n),new T.MeshStandardMaterial());g.add(m);g.userData.fit=1;g.userData.lift=0;return g;};
  const levels=[mk(4),mk(3),mk(2)],a=buildTrafficLod(levels),b=buildTrafficLod(levels);
  assert.equal(a.levels.length,3);
  const mesh=l=>{let r;l.object.traverse(o=>{if(o.isMesh)r=o;});return r;};
  a.levels.forEach((l,i)=>{assert.equal(mesh(l).geometry,mesh(b.levels[i]).geometry);assert.equal(mesh(l).material,mesh(b.levels[i]).material);});
});

test('uninstalled cars keep the moving fallback without requesting missing GLBs',async()=>{
  const {GLTFLoader}=await import(url('vendor/addons/loaders/GLTFLoader.js'));
  const {loadTrafficCar}=await import(url('src/cars/traffic-fleet.js'));
  const original=GLTFLoader.prototype.loadAsync;let requests=0;
  GLTFLoader.prototype.loadAsync=async()=>{requests++;throw Error('unexpected request');};
  try{assert.equal(await loadTrafficCar({id:'uninstalled-fixture',installed:false}),null);assert.equal(requests,0);}
  finally{GLTFLoader.prototype.loadAsync=original;}
});

test('loaded moving fleet caches files, preserves one fit across LODs and animates explicit wheels',async()=>{
  const T=await import(url('vendor/three.module.js'));
  const {GLTFLoader}=await import(url('vendor/addons/loaders/GLTFLoader.js'));
  const {loadTrafficCar,buildTrafficLod,placeFleetCar}=await import(url('src/cars/traffic-fleet.js'));
  const original=GLTFLoader.prototype.loadAsync;let requests=0;
  GLTFLoader.prototype.loadAsync=async file=>{
    requests++;const level=Number(file.at(-1)),scene=new T.Group();
    const body=new T.Mesh(new T.BoxGeometry(2,1,4.6-level*.02),new T.MeshStandardMaterial());
    body.position.set(30,.8,7);scene.add(body);
    for(const [id,x,z] of [['FL',-1,1.5],['FR',1,1.5],['RL',-1,-1.5],['RR',1,-1.5]]){
      const wheel=new T.Mesh(new T.CylinderGeometry(.35,.35,.2,12),new T.MeshStandardMaterial());
      wheel.rotation.z=Math.PI/2;wheel.position.set(30+x,.35,7+z);wheel.userData.zwWheelPart=id;scene.add(wheel);
    }
    return {scene};
  };
  try{
    const spec={id:'moving-wheel-fixture',installed:true,length:4.6,lods:['fixture0','fixture1','fixture2']};
    const [levels,again]=await Promise.all([loadTrafficCar(spec),loadTrafficCar(spec)]);
    assert.equal(requests,3);assert.equal(levels,again);
    assert.ok(levels.every(l=>l.userData.fit===levels[0].userData.fit));
    const a=buildTrafficLod(levels),b=buildTrafficLod(levels);
    assert.equal(a.userData.wheelPivots.length,12);
    const box=new T.Box3().setFromObject(a.levels[0].object),center=box.getCenter(new T.Vector3());
    assert.ok(Math.abs(box.min.y)<1e-6);assert.ok(Math.abs(center.x)<1e-6&&Math.abs(center.z)<1e-6);
    const car={model:a,wheelAngle:2,steering:.2};
    assert.equal(placeFleetCar(car,10,20,.4),true);assert.deepEqual(a.position.toArray(),[10,-.18,20]);assert.equal(a.rotation.y,.4);
    for(const wheel of a.userData.wheelPivots){
      assert.ok(Math.abs(wheel.rotation.x-2*.345/.35)<1e-6);
      assert.equal(wheel.parent.rotation.y,wheel.parent.userData.zwSteer?.2:0);
    }
    assert.ok(b.userData.wheelPivots.every(w=>w.rotation.x===0),'instances have independent wheel transforms');
    a.levels[2].object.traverse(o=>{if(o.isMesh)assert.equal(o.castShadow,false);});
    const camera=new T.PerspectiveCamera();
    for(const [distance,level] of [[20,0],[60,1],[150,2]]){
      camera.position.set(10,distance,20);camera.updateMatrixWorld();a.updateMatrixWorld();a.update(camera);assert.equal(a.getCurrentLevel(),level);
    }
  }finally{GLTFLoader.prototype.loadAsync=original;}
});

test('empty replacement meshes fail closed and leave fallback traffic available',async()=>{
  const T=await import(url('vendor/three.module.js')),{GLTFLoader}=await import(url('vendor/addons/loaders/GLTFLoader.js'));
  const {loadTrafficCar,fleetStatus}=await import(url('src/cars/traffic-fleet.js'));
  const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async()=>({scene:new T.Group()});
  try{assert.equal(await loadTrafficCar({id:'empty-fixture',installed:true,length:4.6,lods:['a','b','c']}),null);assert.match(fleetStatus.failed.get('empty-fixture'),/bounds/);}
  finally{GLTFLoader.prototype.loadAsync=original;}
});
