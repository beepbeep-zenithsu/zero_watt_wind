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