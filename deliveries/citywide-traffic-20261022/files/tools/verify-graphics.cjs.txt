/* Offline scene integration check. No browser or WebGL context is created.
   Captures actual FieldScene meshes for Blender geometry review; water shaders
   and browser layout still need an authorized browser session to inspect. */
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),assert=require('node:assert/strict');
const {buildSync}=require('esbuild');
// Node geometry tests do not render pixels. Permit the real GLTFLoader to parse
// embedded textured car files; image dimensions/content are validated separately
// and the actual PBR output is reviewed in Blender.
globalThis.self ??= globalThis;
globalThis.createImageBitmap ??= async()=>({width:1,height:1,close(){}});
const root=path.join(__dirname,'..');
const build=buildSync({stdin:{contents:`export {FieldScene} from './scene.js';export * as T from './vendor/three.module.js';
  export {GLTFLoader} from './vendor/addons/loaders/GLTFLoader.js';export {createWaterMaterial,applySurfaceDetail,applyVentilationMaterials} from './src/graphics/surfaces.js';
  export {VentilationVFX} from './src/graphics/ventilation-vfx.js';export {advanceCamera} from './src/graphics/camera.js';
  export {assetStatus} from './src/graphics/assets.js';
  export {updateCity} from './src/graphics/city.js';
  export {AdvancedScene} from './src/advanced/advanced-scene.js';
  export * from './src/advanced/hybrid-model.js';`,resolveDir:root},bundle:true,platform:'node',format:'cjs',write:false});
const compiled=new Module(path.join(root,'verify-runtime.cjs'),module);compiled._compile(build.outputFiles[0].text,compiled.id);
const {T,FieldScene,GLTFLoader,createWaterMaterial,assetStatus,applySurfaceDetail,applyVentilationMaterials,VentilationVFX}=compiled.exports,M=require('../model.js');
GLTFLoader.prototype.loadAsync=async function(url){const b=fs.readFileSync(path.join(root,url));return this.parseAsync(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'');};
const output=path.join(root,'docs/upgrade'),snapshots=path.join(root,'.upgrade-baseline/verification');
fs.mkdirSync(snapshots,{recursive:true});
const source=fs.readFileSync(path.join(root,'scene.js'),'utf8');
const start=source.indexOf('this.mats = ')+12,end=source.indexOf(';',source.indexOf('\n    };',start));
const materialSource=source.slice(start,end);

function makeScene(mode){
  const s=Object.create(FieldScene.prototype);
  Object.assign(s,{mode,host:{dataset:{}},angle:.8,elevation:.42,distance:16,target:new T.Vector3(0,2,0),
    view:'field',time:0,count:1,extent:12,rotors:[],rotorGroups:[],gears:[],fans:[],vfans:[],units:[],trees:[],fish:[],rings:[],rainRings:[],people:[],panes:[],debris:[],puddles:[],hazes:[],water:null,canyon:null,
    flows:true,haze:0,rainAmt:0,storm:false,night:false,flashT:0,lightT:3,layoutKey:'',roomW:6,roomD:6,pondL:9,pondW:5,sensors:null,
    boats:1,upb:1,mount:'boat',boatGroups:[],boatPose:[],boatTheta:[],boatSim:[],lanes:[],laneOf:[],pondZc:6,benchBoat:null,compactGraphics:false,reducedMotion:true});
  s.scene=new T.Scene();s.scene.background=new T.Color('#b6cbd0');s.scene.fog=new T.FogExp2('#b6cbd0',.011);
  s.camera=new T.PerspectiveCamera(38,1.5,.1,240);
  s.sun=new T.DirectionalLight('#fff1dd',3);s.hemi=new T.HemisphereLight('#e8f3da','#263b2c',1.8);s.fill=new T.DirectionalLight('#c7dce6',.65);
  s.roomLight=new T.PointLight();s.flashLight=new T.PointLight();
  s.scene.add(s.sun,s.hemi,s.fill,s.roomLight,s.flashLight);
  s.mats=new Function('T','createWaterMaterial','return '+materialSource).call(s,T,createWaterMaterial);
  s.hazeMat=s.mats.haze;
  s.surfaceNormal=applySurfaceDetail(s.mats);if(mode==='air')applyVentilationMaterials(s.mats);
  for(const name of ['env','shell','unitRoot','fx','table']){s[name]=new T.Group();s.scene.add(s[name]);}
  s.table.visible=false;s.renderer={render(){}};
  s.buildStatic();s.buildTable();s.buildUnits();s.buildFx();
  if(mode==='air')s.ventilationVFX=new VentilationVFX(s);
  return s;
}
async function ready(s){
  const pending=[];s.scene.traverse(o=>{if(o.userData.assetReady)pending.push(o.userData.assetReady);});
  if(s.city)pending.push(...s.city.cars.map(c=>c.model_ready));
  await Promise.all(pending);
  assert.equal(assetStatus.failed.size,0);
  if(s.city){compiled.exports.updateCity(s,0);s.scene.updateMatrixWorld(true);s.camera.updateMatrixWorld();s.city.root.traverse(o=>{if(o.isLOD)o.update(s.camera);});}
}
function meshSnapshot(s,file){
  s.scene.updateMatrixWorld(true);const batches=new Map();
  const q=new T.Vector3(),normal=new T.Vector3(),normalMatrix=new T.Matrix3(),world=new T.Matrix4(),instance=new T.Matrix4();
  let meshes=0,triangles=0;
  s.scene.traverseVisible(o=>{
    if(!o.isMesh)return;meshes++;
    const material=Array.isArray(o.material)?o.material[0]:o.material;
    if(material.opacity<.08)return;
    const key=material.uuid;
    if(!batches.has(key)){
      const batch={name:material.name||key,color:material.color.toArray(),roughness:material.roughness??.8,metalness:material.metalness??0,alpha:material.userData.trails ? .55 : material.opacity,positions:[],normals:[],indices:[]};
      if(material.map?.isDataTexture){const image=material.map.image;batch.texture={width:image.width,height:image.height,data:Array.from(image.data)};batch.uvs=[];}
      batches.set(key,batch);
    }
    const batch=batches.get(key),g=o.geometry,p=g.attributes.position,index=g.index;
    const n=o.isInstancedMesh?o.count:1;
    for(let j=0;j<n;j++){
      if(o.isInstancedMesh){o.getMatrixAt(j,instance);world.multiplyMatrices(o.matrixWorld,instance);}else world.copy(o.matrixWorld);
      normalMatrix.getNormalMatrix(world);
      const base=batch.positions.length/3;
      for(let i=0;i<p.count;i++){
        q.fromBufferAttribute(p,i).applyMatrix4(world);batch.positions.push(...q.toArray().map(v=>+v.toFixed(5)));
        normal.fromBufferAttribute(g.attributes.normal,i).applyMatrix3(normalMatrix).normalize();batch.normals.push(...normal.toArray().map(v=>+v.toFixed(5)));
        if(batch.texture)batch.uvs.push(g.attributes.uv.getX(i),g.attributes.uv.getY(i));
      }
      const count=index?index.count:p.count;triangles+=count/3;
      for(let i=0;i<count;i+=3){
        const corners=[0,1,2].map(k=>index?index.getX(i+k):i+k),trails=material.userData.trails;
        if(trails){
          const u=corners.reduce((a,k)=>a+g.attributes.uv.getX(k),0)/3;
          const phase=((u*3-trails.time.value)%1+1)%1;
          if(phase<.35||phase>.82||u<.04||u>.94)continue;
        }
        batch.indices.push(...corners.map(k=>base+k));
      }
    }
  });
  fs.writeFileSync(file,JSON.stringify({mode:s.mode,camera:{position:s.camera.position.toArray(),target:s.target.toArray()},batches:[...batches.values()]}));
  return {visibleMeshObjects:meshes,visibleTriangles:triangles,materialBatches:batches.size};
}
async function verify(){
  const report={kind:'Offline scene/asset integration; no WebGL or browser',cases:[],snapshots:{}};
  for(const mode of ['air','water']){
    const s=makeScene(mode);
    const scenarios=mode==='air'?['clear','heat','rain','storm']:['clear','night','rain','storm'];
    for(const count of [1,mode==='air'?10:12])for(const weather of scenarios){
      const p={...M.defaults,_mode:mode,_weather:weather,units:count,boats:count===1?1:6,upb:count===1?1:2,ratio:count===1?2:5,wind:weather==='storm'?19:4.5,rain:['rain','storm'].includes(weather)?1:0};
      const scenario={weather,environment:weather==='heat'?'canyon':'park'};
      s.setEnvironment(scenario,p);s.setHardware(M.evaluateHardware(p),p);s.setView('field');await ready(s);
      const sample=M.steady(p,p.wind,M.evaluateHardware(p));
      const angle=s.rotors[0].rotation.x,fan=s.fans[0].rotation.z,vfan=s.vfans[0].rotation.y;s.render(.016,sample,true);
      assert.ok(s.rotors[0].rotation.x>angle);assert.equal(s.units.filter(u=>u.g.visible).length,count);
      const rotorDelta=s.rotors[0].rotation.x-angle;
      assert.ok(Math.abs((s.fans[0].rotation.z-fan)-rotorDelta/p.ratio)<1e-10);
      assert.ok(Math.abs((s.vfans[0].rotation.y-vfan)+rotorDelta/p.ratio)<1e-10);
      const paused=s.rotors[0].rotation.x;s.render(.016,sample,false);assert.equal(s.rotors[0].rotation.x,paused);
      assert.equal(s.rain.visible,!!p.rain);assert.equal(s.stars.visible,weather==='night');
      s.setView('bench');s.render(.016,sample,true);assert.equal(s.units.filter(u=>u.g.visible).length,1);
      s.camera.updateMatrixWorld(true);s.scene.updateMatrixWorld(true);
      const rotorBounds=new T.Box3().setFromObject(s.rotorGroups[0]);
      for(const x of [rotorBounds.min.x,rotorBounds.max.x])for(const y of [rotorBounds.min.y,rotorBounds.max.y])for(const z of [rotorBounds.min.z,rotorBounds.max.z]){
        const point=new T.Vector3(x,y,z).project(s.camera);assert.ok(Math.abs(point.x)<1&&Math.abs(point.y)<1,'close-up must contain the whole rotor');
      }
      s.setView('field');
      for(const mount of mode==='water'?['boat','anchored']:['roof']){
        if(mode==='water'){p.mount=mount;s.setEnvironment(scenario,p);await ready(s);s.render(.016,sample,true);}
      }
      report.cases.push({mode,count,weather,pause:true,closeup:true,mounting:true,loaded:true});
    }
    const p={...M.defaults,_mode:mode,wind:4.5,units:1,boats:1,upb:1};
    s.setEnvironment({weather:'clear',environment:'park'},p);s.setView('field');await ready(s);s.render(.016,M.steady(p,4.5,M.evaluateHardware(p)),false);
    report.snapshots[mode]=meshSnapshot(s,path.join(snapshots,mode+'.json'));
    s.setView('bench');s.render(.016,M.steady(p,4.5,M.evaluateHardware(p)),false);
    report.snapshots[mode+'-machinery']=meshSnapshot(s,path.join(snapshots,mode+'-machinery.json'));
  }
  report.assetsLoaded=[...assetStatus.loaded];
  fs.writeFileSync(path.join(output,'scene-verification.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
}
module.exports={makeScene,ready,meshSnapshot,...compiled.exports};
if(require.main===module)verify().catch(error=>{console.error(error);process.exitCode=1;});
