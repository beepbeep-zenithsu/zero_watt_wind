import * as T from '../../vendor/three.module.js';

const cache=new Map(),loader=new T.TextureLoader();
function map(name,color=false){
  if(typeof document==='undefined')return null;
  if(!cache.has(name)){
    const texture=loader.load(`assets/textures/city/${name}.jpg`);
    texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.anisotropy=4;
    if(color)texture.colorSpace=T.SRGBColorSpace;
    cache.set(name,texture);
  }
  return cache.get(name);
}

/** Scanned albedo/roughness/normals; cached across every mode and weather. */
export function finishCityMaterial(material){
  const name=material.name;
  const wall=/Limestone render|Warm white precast|Sage ceramic cladding|Honed grey sandstone/.test(name),brick=name==='Terracotta brick';
  if(wall||brick){
    const family=brick?'brick':'plaster';
    material.map=map(`${family}-Diffuse`,true);material.normalMap=map(`${family}-nor_gl`);
    material.roughnessMap=map(`${family}-Rough`);material.normalScale.set(brick?.55:.20,brick?.55:.20);
    material.roughness=.92;material.metalness=0;
  }
  if(/glazing|architectural glass/.test(name)){
    material.color.set(name==='Interior shadow glazing'?'#172026':'#34414a');material.roughness=.16;
    material.metalness=.32;material.envMapIntensity=1.3;
  }
  if(name==='City vehicle enamel'){
    // Clear-coat is preserved from the Blender glTF material.
    material.roughness=.22;material.metalness=.72;material.envMapIntensity=1.4;
  }
  material.needsUpdate=true;
  return material;
}

export function metreScaleUV(mesh){
  if(!/Limestone render|Terracotta brick|Sage ceramic cladding|Honed grey sandstone|Warm white precast/.test(mesh.material.name))return;
  const geometry=mesh.geometry,p=geometry.attributes.position,n=geometry.attributes.normal,uv=new Float32Array(p.count*2);
  for(let i=0;i<p.count;i++){
    const ax=Math.abs(n.getX(i)),ay=Math.abs(n.getY(i)),az=Math.abs(n.getZ(i));
    if(ay>ax&&ay>az){uv[i*2]=p.getX(i)/2;uv[i*2+1]=p.getZ(i)/2;}
    else if(ax>az){uv[i*2]=p.getZ(i)/2;uv[i*2+1]=p.getY(i)/2;}
    else{uv[i*2]=p.getX(i)/2;uv[i*2+1]=p.getY(i)/2;}
  }
  geometry.setAttribute('uv',new T.BufferAttribute(uv,2));
}
