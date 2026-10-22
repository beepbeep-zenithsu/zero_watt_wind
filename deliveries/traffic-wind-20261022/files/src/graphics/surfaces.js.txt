import * as T from '../../vendor/three.module.js';
import {RoomEnvironment} from '../../vendor/addons/environments/RoomEnvironment.js';
import {HDRLoader} from '../../vendor/addons/loaders/HDRLoader.js';

let outdoorHDR;

export function installReflections(scene, renderer) {
  const room = new RoomEnvironment();
  const pmrem = new T.PMREMGenerator(renderer);
  const target = pmrem.fromScene(room, .08);
  scene.environment = target.texture; scene.environmentIntensity = .45;
  room.dispose(); pmrem.dispose();
  let retired=false;target.addEventListener('dispose',()=>retired=true);
  outdoorHDR??=new HDRLoader().loadAsync('assets/textures/city/daylight.hdr');
  outdoorHDR.then(texture=>{
    if(retired)return;
    texture.mapping=T.EquirectangularReflectionMapping;
    const generator=new T.PMREMGenerator(renderer),outdoor=generator.fromEquirectangular(texture);
    generator.dispose();scene.environment=outdoor.texture;scene.userData.outdoorLighting=true;
    target.addEventListener('dispose',()=>outdoor.dispose());
  }).catch(error=>console.warn('Outdoor reflection map unavailable; neutral studio lighting retained.',error.message));
  return target;
}

// Seamless deterministic normals: no external texture or image request.
function normalTexture(size, strength) {
  const pixels = new Uint8Array(size*size*4);
  for (let y=0;y<size;y++) for (let x=0;x<size;x++) {
    const u=x/size*Math.PI*2, v=y/size*Math.PI*2;
    const dx=strength*(Math.cos(u*4+Math.sin(v*2))+.4*Math.cos(u*11-v*7));
    const dy=strength*(Math.sin(v*5+Math.cos(u*3))+.4*Math.sin(v*9+u*6));
    const n=new T.Vector3(-dx,-dy,1).normalize(), i=(y*size+x)*4;
    pixels.set([(n.x*.5+.5)*255,(n.y*.5+.5)*255,(n.z*.5+.5)*255,255],i);
  }
  const texture = new T.DataTexture(pixels,size,size,T.RGBAFormat);
  texture.wrapS=texture.wrapT=T.RepeatWrapping;
  texture.magFilter=T.LinearFilter; texture.minFilter=T.LinearMipmapLinearFilter;
  texture.generateMipmaps=true; texture.needsUpdate=true;
  return texture;
}

export function createWaterMaterial() {
  const normal = normalTexture(128,.28); normal.repeat.set(14,10);
  const m = new T.MeshStandardMaterial({color:'#456f68', roughness:.21, metalness:.12,
    transparent:true, opacity:.88, depthWrite:false, side:T.DoubleSide,
    normalMap:normal, normalScale:new T.Vector2(.3,.3), envMapIntensity:1.15});
  const uniforms = {zwTime:{value:0}, zwAmplitude:{value:.02}, zwSize:{value:new T.Vector2(20,12)}};
  m.userData.waterUniforms=uniforms;
  m.onBeforeCompile = shader => {
    Object.assign(shader.uniforms,uniforms);
    shader.vertexShader = 'uniform float zwTime; uniform float zwAmplitude; varying vec2 zwUV;\n'+shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <beginnormal_vertex>',`#include <beginnormal_vertex>
      float wx = position.x * 1.7 + zwTime * 1.3;
      float wy = position.y * 2.1 + zwTime * .8;
      objectNormal = normalize(vec3(-1.7*cos(wx)*cos(wy)*zwAmplitude,
        2.1*sin(wx)*sin(wy)*zwAmplitude, 1.0));`);
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
      transformed.z += sin(wx)*cos(wy)*zwAmplitude;
      zwUV = uv;`);
    shader.fragmentShader = 'varying vec2 zwUV; uniform vec2 zwSize;\n'+shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      vec2 bank = min(zwUV, 1.0-zwUV)*zwSize;
      float depthTint = smoothstep(0.0, 1.4, min(bank.x, bank.y));
      diffuseColor.rgb *= mix(vec3(1.35,1.19,.89),vec3(.76,.94,1.0),depthTint);`);
  };
  m.customProgramCacheKey=()=> 'zw-water-1';
  return m;
}

export function updateWater(material, time, rain, wind, storm) {
  const u=material.userData.waterUniforms;
  u.zwTime.value=time;
  u.zwAmplitude.value=.014+.035*rain+Math.min(wind,20)*.0014+(storm ? .035 : 0);
  material.normalMap.offset.set(time*.008,time*.004);
  material.normalScale.setScalar(.23+rain*.16);
}

export function applySurfaceDetail(mats) {
  const grain=normalTexture(64,.045); grain.repeat.set(4,4);
  for(const name of ['steel','white','black','wood','concrete','path','pontoon']) {
    mats[name].normalMap=grain; mats[name].normalScale=new T.Vector2(.11,.11);
  }
  mats.white.color.set('#dce2dc'); mats.white.roughness=.4; mats.white.metalness=.22;
  mats.black.color.set('#243b37'); mats.black.roughness=.46; mats.black.metalness=.45;
  mats.steel.roughness=.34; mats.steel.metalness=.78;
  mats.concrete.color.set('#aaafa0'); mats.concrete.roughness=.9;
  mats.wood.color.set('#96744f'); mats.wood.roughness=.69;
  const pixels=new Uint8Array(128*32*4);
  for(let y=0;y<32;y++)for(let x=0;x<128;x++){
    const grain=.82+.13*Math.sin(y*2.8+Math.sin(x*.07+y*.6))+.05*Math.sin(y*9+x*.12);
    pixels.set([232*grain,219*grain,195*grain,255],(y*128+x)*4);
  }
  const timber=new T.DataTexture(pixels,128,32);timber.colorSpace=T.SRGBColorSpace;
  timber.wrapS=timber.wrapT=T.RepeatWrapping;timber.repeat.set(3,2);timber.needsUpdate=true;
  mats.wood.map=timber;mats.wood.userData.ownedTextures=[timber];
  const wetPixels=new Uint8Array(64*64*4);
  for(let y=0;y<64;y++)for(let x=0;x<64;x++){
    const dx=(x-31.5)/31.5,dy=(y-31.5)/31.5,angle=Math.atan2(dy,dx);
    const edge=.78+.10*Math.sin(angle*3)+.055*Math.cos(angle*7);
    const alpha=255*(1-T.MathUtils.smoothstep(Math.hypot(dx,dy),edge-.16,edge));
    wetPixels.set([alpha,alpha,alpha,255],(y*64+x)*4);
  }
  const wetMask=new T.DataTexture(wetPixels,64,64);wetMask.magFilter=T.LinearFilter;wetMask.needsUpdate=true;
  mats.puddle.alphaMap=wetMask;mats.puddle.opacity=.48;mats.puddle.depthWrite=false;
  mats.puddle.color.set('#6d837c');mats.puddle.roughness=.13;mats.puddle.metalness=.12;
  mats.puddle.userData.ownedTextures=[wetMask];
  mats.shellGlass.opacity=.075; mats.shellGlass.color.set('#c3d4cf');
  return grain;
}

export function applyVentilationMaterials(mats) {
  mats.shellGlass.opacity=.045;mats.shellGlass.color.set('#c4d5d9');
  mats.win.color.set('#a6bdc7');mats.win.opacity=.22;mats.win.roughness=.16;
  mats.win.metalness=.08;mats.win.envMapIntensity=.8;
  mats.dark.color.set('#263a3b');mats.concrete.color.set('#939c94');
  mats.shirtA.color.set('#527580');mats.shirtB.color.set('#7b846c');
}
