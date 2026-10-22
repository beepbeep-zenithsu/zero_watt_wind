const fs = require('node:fs'), path = require('node:path'), {spawnSync} = require('node:child_process');
const root=path.resolve(__dirname,'..');
const blender=process.env.BLENDER_PATH || 'C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe';
const result=spawnSync(blender,['--background','--factory-startup','--disable-autoexec','--python-exit-code','1',
  '--python',path.join(root,'scripts/blender/test_traffic_lods.py')],{cwd:root,stdio:'inherit',windowsHide:true});
if(result.error) throw result.error;
if(result.status) process.exit(result.status);
const directory=path.join(root,'.upgrade-baseline/traffic-lod-validation/exports');
const verify=spawnSync(process.execPath,[path.join(root,'tools/validate-traffic-assets.cjs'),'--directory',directory,'lod-pipeline-fixture'],{cwd:root,encoding:'utf8',windowsHide:true});
fs.writeFileSync(path.join(root,'.upgrade-baseline/traffic-lod-validation/validation.json'),verify.stdout);
process.stdout.write(verify.stdout); process.stderr.write(verify.stderr);
if(verify.status)process.exit(verify.status);
// Round-trip actual Blender GLBs through the project's GLTFLoader and fleet.
// Material texture decode is excluded in this Node-only hierarchy test; embedded
// image dimensions are checked independently by the validator above.
async function roundTrip(){
  const assert=require('node:assert/strict'),{pathToFileURL}=require('node:url');
  const {GLTFLoader}=await import(pathToFileURL(path.join(root,'vendor/addons/loaders/GLTFLoader.js')).href);
  const {loadTrafficCar,buildTrafficLod,placeFleetCar}=await import(pathToFileURL(path.join(root,'src/cars/traffic-fleet.js')).href);
  const original=GLTFLoader.prototype.loadAsync;
  GLTFLoader.prototype.loadAsync=async file=>{
    const data=fs.readFileSync(file),jsonLength=data.readUInt32LE(12),document=JSON.parse(data.toString('utf8',20,20+jsonLength));
    document.materials=(document.materials || []).map(()=>({pbrMetallicRoughness:{metallicFactor:.7,roughnessFactor:.25}}));
    document.images=[];document.textures=[];
    const json=Buffer.from(JSON.stringify(document).padEnd(Math.ceil(Buffer.byteLength(JSON.stringify(document))/4)*4,' '));
    const binary=data.subarray(20+jsonLength),out=Buffer.alloc(20+json.length+binary.length);
    out.writeUInt32LE(0x46546c67,0);out.writeUInt32LE(2,4);out.writeUInt32LE(out.length,8);out.writeUInt32LE(json.length,12);out.writeUInt32LE(0x4e4f534a,16);
    json.copy(out,20);binary.copy(out,20+json.length);
    return new GLTFLoader().parseAsync(out.buffer.slice(out.byteOffset,out.byteOffset+out.byteLength),'');
  };
  try{
    const levels=await loadTrafficCar({id:'actual-export-fixture',installed:true,length:4.6,lods:[0,1,2].map(i=>path.join(directory,`lod-pipeline-fixture-lod${i}.glb`))});
    assert.ok(levels);const model=buildTrafficLod(levels);
    assert.equal(model.userData.wheelPivots.length,12);
    placeFleetCar({model,wheelAngle:3,steering:.15},7,11,.4);
    assert.deepEqual(model.position.toArray(),[7,-.18,11]);
    for(const wheel of model.userData.wheelPivots){assert.ok(wheel.userData.radius>.30&&wheel.userData.radius<.40);assert.ok(wheel.rotation.x>2);}
    console.log('Actual Blender GLB hierarchy, wheel pivots and moving-fleet placement: PASS (technical fixture only).');
  }finally{GLTFLoader.prototype.loadAsync=original;}
}
roundTrip().catch(error=>{console.error(error);process.exitCode=1;});
