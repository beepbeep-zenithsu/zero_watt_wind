const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),Module=require('node:module');
const {buildSync}=require('esbuild');
const root=path.join(__dirname,'..'),M=require('../model.js');
const result=buildSync({stdin:{contents:`export {GLTFLoader} from './vendor/addons/loaders/GLTFLoader.js';
  export {FieldScene} from './scene.js';export * as T from './vendor/three.module.js';
  export * from './src/graphics/surfaces.js';export * from './src/graphics/assets.js';`,resolveDir:root},bundle:true,platform:'node',format:'cjs',write:false});
const compiled=new Module(path.join(root,'graphics-test.cjs'),module);compiled._compile(result.outputFiles[0].text,compiled.id);
const {GLTFLoader,T,FieldScene,createWaterMaterial,updateWater,upgradePart,retireShell}=compiled.exports;

test('engineering source hash and all 84 representative outputs match the pre-upgrade baseline',()=>{
  const baseline=JSON.parse(fs.readFileSync(path.join(root,'docs/upgrade/calculation-baseline.json')));
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'model.js'))).digest('hex'),baseline.sha256);
  assert.equal(baseline.cases.length,84);
  for(const {p,result} of baseline.cases)assert.deepEqual(M.steady(p,p.wind,M.evaluateHardware(p)),result);
});

const parsed=new Map();
test('every exported GLB loads through the actual r180 loader with finite geometry and expected axes',async()=>{
  const entries=['zw-upgrade','environment'].flatMap(folder=>Object.entries(JSON.parse(fs.readFileSync(path.join(root,`assets/${folder}/manifest.json`))).assets).map(([name,entry])=>({name,entry,folder})));
  const details=[];
  for(const {name,entry,folder} of entries){
    const bytes=fs.readFileSync(path.join(root,`assets/${folder}/${name}.glb`));
    assert.equal(bytes.readUInt32LE(0),0x46546c67);assert.equal(bytes.readUInt32LE(4),2);
    const gltf=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
    parsed.set(name,gltf.scene);
    let triangles=0,meshes=0;
    gltf.scene.traverse(o=>{if(!o.isMesh)return;meshes++;
      assert.ok(o.material.isMeshStandardMaterial);assert.ok(o.geometry.attributes.normal);
      for(const n of o.geometry.attributes.position.array)assert.ok(Number.isFinite(n));
      triangles+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3;
    });
    assert.equal(triangles,entry.triangles);assert.equal(meshes,entry.meshes);
    const box=new T.Box3().setFromObject(gltf.scene),size=box.getSize(new T.Vector3());
    if(name==='rotor'){assert.ok(size.x>1.8&&size.x<2.1);assert.ok(size.y>1.8&&size.y<2.5);}
    if(name==='fan'){assert.ok(size.y<.4&&size.x>1.4&&size.z>1.4);}
    if(name==='paddle'){assert.ok(size.z>1.4&&size.z<1.6&&size.y>3.1);}
    if(name==='bearing-frame'){assert.ok(box.min.y>=-.001&&box.max.y>.9);}
    if(name==='bearing'){assert.ok(Math.abs(size.y-size.z)<.002);assert.ok(box.min.y<0&&box.max.y>0);}
    if(name.startsWith('site-apartment')){assert.ok(size.x>4&&size.x<5);assert.ok(entry.meshes<=9);assert.ok(triangles>7000&&triangles<16000);}
    if(name==='site-seated-person'){assert.ok(box.max.y>1.3&&box.max.y<1.5);assert.ok(box.min.y>=-.0001);}
    details.push({name,meshes,triangles,bytes:bytes.length,bounds:{min:box.min.toArray(),max:box.max.toArray()}});
  }
  fs.writeFileSync(path.join(root,'docs/upgrade/asset-validation.json'),JSON.stringify(details,null,2));
});

test('water uses stable GPU deformation and responds to weather without changing simulation state',()=>{
  const m=createWaterMaterial(),p={...M.defaults};
  const shader={uniforms:{},vertexShader:T.ShaderLib.standard.vertexShader,fragmentShader:T.ShaderLib.standard.fragmentShader};
  m.onBeforeCompile(shader);
  assert.ok(shader.vertexShader.includes('transformed.z += sin(wx)'));
  assert.ok(shader.fragmentShader.includes('depthTint'));
  updateWater(m,10,0,4,false);const calm=m.userData.waterUniforms.zwAmplitude.value;
  updateWater(m,11,1,19,true);assert.ok(m.userData.waterUniforms.zwAmplitude.value>calm);
  assert.deepEqual(p,{...M.defaults});assert.equal(m.normalMap.image.width,128);
});

test('asset replacement preserves the animated parent transform and shared resources survive layout disposal',async()=>{
  const originalLoad=GLTFLoader.prototype.loadAsync;
  GLTFLoader.prototype.loadAsync=async()=>({scene:parsed.get('rotor')});
  try{
    const group=new T.Group();group.position.set(-2,1.55,0);group.rotation.x=.37;
    const old=new T.BoxGeometry();let disposed=0;old.addEventListener('dispose',()=>disposed++);
    group.add(new T.Mesh(old,new T.MeshBasicMaterial()));
    upgradePart(group,'test-rotor');assert.equal(await group.userData.assetReady,true);
    assert.equal(group.rotation.x,.37);assert.deepEqual(group.position.toArray(),[-2,1.55,0]);assert.equal(disposed,1);
    let sharedDisposed=0;group.traverse(o=>o.geometry?.addEventListener('dispose',()=>sharedDisposed++));
    const shell=new T.Group();shell.add(group);retireShell(shell);
    assert.equal(sharedDisposed,0);assert.equal(shell.children.length,0);
    const retired=new T.Group();upgradePart(retired,'test-rotor');retired.userData.retired=true;
    assert.equal(await retired.userData.assetReady,false);assert.equal(retired.children.length,0);
  }finally{GLTFLoader.prototype.loadAsync=originalLoad;}
});
