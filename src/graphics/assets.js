import * as T from '../../vendor/three.module.js';
import { GLTFLoader } from '../../vendor/addons/loaders/GLTFLoader.js';
import {personColorKey} from './people.js';
import {finishCityMaterial,metreScaleUV} from './city-materials.js';

const loader = new GLTFLoader();
const library = new Map();
export const assetStatus = {loaded: new Set(), failed: new Map()};

export function loadAsset(name) {
  if (!library.has(name)) {
    // Relative to the document, including /zero_watt_wind/ on GitHub Pages.
    const folder=name.startsWith('site-')?'environment':'zw-upgrade';
    library.set(name, loader.loadAsync(`assets/${folder}/${name}.glb`).then(gltf => {
      gltf.scene.traverse(o => {
        if (!o.isMesh) return;
        o.castShadow = o.receiveShadow = true;
        o.geometry.userData.sharedAsset = true;
        metreScaleUV(o);
        for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
          m.userData.sharedAsset = true;
          m.envMapIntensity = .8;
          finishCityMaterial(m);
        }
      });
      assetStatus.loaded.add(name);
      return gltf.scene;
    }).catch(error => {
      assetStatus.failed.set(name, error.message);
      console.warn(`ZeroWatt: original geometry retained for ${name}:`, error.message);
      return null;
    }));
  }
  return library.get(name);
}

export function disposeGeometry(root) {
  const geometries = new Set();
  root.traverse(o => {
    if (o.geometry && !o.geometry.userData.sharedAsset && !o.geometry.userData.sharedStatic) geometries.add(o.geometry);
  });
  geometries.forEach(g => g.dispose());
}

/** Contents change; the original pivot stays owned by FieldScene.render. */
export function upgradePart(group, name, {scale, rotation, appearance, replace = true} = {}) {
  group.userData.assetRequested = name;
  group.userData.assetReady = loadAsset(name).then(template => {
    if (!template || group.userData.retired) return false;
    if (replace) { disposeGeometry(group); group.clear(); }
    const model = template.clone(true);
    if(appearance)model.traverse(o=>{
      if(!o.isMesh)return;
      const key=personColorKey(o.material.name);
      if(key){o.material=o.material.clone();o.material.userData.sharedAsset=false;o.material.color.set(appearance[key]);}
      if(o.name.startsWith('HairLong'))o.visible=!!appearance.longHair;
    });
    if (scale) model.scale.set(...scale);
    if (rotation) model.rotation.set(...rotation);
    model.name = `Blender ${name}`;
    group.add(model);
    group.userData.asset = name;
    return true;
  });
  return group;
}

export function addAsset(parent, name, position, scale = [1, 1, 1], rotation) {
  const group = new T.Group();
  group.position.set(...position); parent.add(group);
  return upgradePart(group, name, {scale, rotation});
}

/** One draw per material for an entire street of repeated Blender models. */
export function addAssetInstances(parent,name,poses,{lighting=false,surfaceNormal=null}={}){
  const group=new T.Group();group.name=`Instanced Blender ${name}`;parent.add(group);
  group.userData.assetRequested=name;group.userData.glowMaterials=[];
  const batches=[],pose=new T.Object3D(),matrix=new T.Matrix4(),partMatrix=new T.Matrix4(),pivot=new T.Matrix4(),rotation=new T.Matrix4();let bottom=0;
  group.setPoses=values=>{
    poses=values;
    for(const {mesh,offset,colorKey,wheel,longHair,limb} of batches){
      values.forEach((value,i)=>{
        pose.position.set(...value.position);pose.rotation.set(0,value.rotation||0,0);
        const scale=value.scale??1;Array.isArray(scale)?pose.scale.set(...scale):pose.scale.setScalar(scale);
        if(value.grounded)pose.position.y-=bottom*pose.scale.y;
        pose.updateMatrix();partMatrix.copy(offset);
        if(longHair&&!value.longHair)partMatrix.makeScale(.00001,.00001,.00001);
        if(limb&&value.limbs){
          const arm=limb.startsWith('Arm'),side=limb.endsWith('L')?-1:1,y=arm?1.27:.89,x=side*(arm?.165:.085);
          pivot.makeTranslation(x,y,0);rotation.makeRotationX(value.limbs[limb]||0);pivot.multiply(rotation);
          if(arm){rotation.makeRotationZ((value.gesture||0)*side);pivot.multiply(rotation);}
          rotation.makeTranslation(-x,-y,0);pivot.multiply(rotation);partMatrix.premultiply(pivot);
        }
        if(wheel){
          const x=wheel.endsWith('L')?-.89:.89,z=wheel.startsWith('F')?1.43:-1.43;
          pivot.makeTranslation(x,.345,z);rotation.makeRotationY(wheel.startsWith('F')?(value.steering||0):0);pivot.multiply(rotation);
          rotation.makeRotationX(value.wheelAngle||0);pivot.multiply(rotation);rotation.makeTranslation(-x,-.345,-z);pivot.multiply(rotation);partMatrix.premultiply(pivot);
        }
        matrix.multiplyMatrices(pose.matrix,partMatrix);mesh.setMatrixAt(i,matrix);
        if(colorKey&&value[colorKey])mesh.setColorAt(i,new T.Color(value[colorKey]));
      });
      mesh.instanceMatrix.needsUpdate=true;
      if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
      mesh.computeBoundingSphere();mesh.computeBoundingBox();
    }
  };
  group.userData.assetReady=loadAsset(name).then(template=>{
    if(!template||group.userData.retired)return false;
    template.updateMatrixWorld(true);
    bottom=new T.Box3().setFromObject(template).min.y;
    template.traverse(source=>{
      if(!source.isMesh)return;
      let material=source.material;
      const facade=name.startsWith('site-')&&/apartment|tower|shopfront|distant-block|skyline/.test(name)&&/Limestone render|Terracotta brick|Sage ceramic cladding/.test(material.name);
      const window=lighting&&/apartment|tower|shopfront|distant-block|skyline/.test(name)&&/glazing|architectural glass/.test(material.name);
      if(facade||window||(lighting&&!Array.isArray(material)&&/^City (glow|signal)/.test(material.name))){
        material=material.clone();material.userData.sharedAsset=false;
        if(window){material.emissive.set('#e2bf89');material.userData.cityWindow=true;material.userData.windowLevel=material.name==='Interior shadow glazing'?.04:material.name==='Smoked architectural glass'?.14:.30;}
        if(facade){material.color.set('#ffffff');if(!material.normalMap)material.normalMap=surfaceNormal;}else group.userData.glowMaterials.push(material);
      }
      const mesh=new T.InstancedMesh(source.geometry,material,poses.length);
      mesh.name=source.name;mesh.castShadow=mesh.receiveShadow=true;
      group.add(mesh);batches.push({mesh,offset:source.matrixWorld.clone(),colorKey:personColorKey(material.name)||((facade||material.name==='City vehicle enamel')?'color':null),wheel:source.name.match(/^(FL|FR|RL|RR)_/)?.[1],longHair:source.name.startsWith('HairLong'),limb:source.name.match(/^(ArmL|ArmR|LegL|LegR)_/)?.[1]});
    });
    group.userData.asset=name;group.setPoses(poses);return true;
  });
  return group;
}

/** Late loads must not resurrect an old layout. Cached GLBs stay shared. */
export function retireShell(root, sharedMaterials = []) {
  const keep = new Set(sharedMaterials), dispose = new Set();
  root.traverse(o => {
    o.userData.retired = true;
    if (o.isInstancedMesh) o.dispose();
    if (o.material) for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
      if (!keep.has(m) && !m.userData.sharedAsset) dispose.add(m);
    }
  });
  disposeGeometry(root); dispose.forEach(m => {m.userData.ownedTextures?.forEach(t=>t.dispose());m.dispose();}); root.clear();
  root.userData.retired=false;
}
