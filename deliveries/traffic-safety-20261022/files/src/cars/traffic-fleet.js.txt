import * as T from '../../vendor/three.module.js';
import {GLTFLoader} from '../../vendor/addons/loaders/GLTFLoader.js';
import {TRAFFIC_CARS, TRAFFIC_LOD_DISTANCES, TRAFFIC_LOD_HYSTERESIS} from './car-catalog.js';

/**
 * Premium traffic fleet.
 *
 * Moving traffic uses the genuinely installed members of the eight-car catalog.
 * Pending car names are never placed on a different mesh. Each model is
 * fetched once; moving cars are instanced by model part and camera-selected LOD.
 * Geometry, materials, textures and transform buffers are shared across the city.
 * Until a model has loaded (or if its files are missing) the car keeps using the
 * original instanced sedan/crossover, so traffic never disappears.
 */
const loader = new GLTFLoader();
const cache = new Map();
export const fleetStatus = {loaded: new Set(), failed: new Map()};
const ROAD_Y = -.18;
const lampPose=new T.Object3D();
const fleetCamera=new T.Vector3(),fleetWorld=new T.Matrix4(),fleetPart=new T.Matrix4(),wheelTranslation=new T.Matrix4(),wheelRotation=new T.Matrix4();

function instanceLevels(city,type,templates){
  type.levels=templates.map((template,index)=>{
    template.updateMatrixWorld(true);
    const data=template.userData,fit=new T.Matrix4().makeScale(data.fit,data.fit,data.fit);
    fit.setPosition(data.centerX||0,data.lift,data.centerZ||0);
    const level={parts:[],wheels:new Map(),fit,count:0};
    template.traverse(source=>{
      if(!source.isMesh)return;
      const mesh=new T.InstancedMesh(source.geometry,source.material,type.cars.length);
      mesh.name=`${type.spec.id} LOD${index} ${source.name}`;mesh.count=0;mesh.visible=false;
      mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.castShadow=index===0;mesh.receiveShadow=index===0;
      mesh.boundingBox=city.motionBounds.clone();mesh.boundingSphere=city.motionBounds.getBoundingSphere(new T.Sphere());
      city.fleet.group.add(mesh);
      let spin=source.parent;while(spin&&spin!==template&&!spin.userData.zwWheelPivot)spin=spin.parent;
      const wheel=spin?.userData.zwWheelPivot?source.userData.zwWheelPart:null;
      if(wheel&&!level.wheels.has(wheel))level.wheels.set(wheel,{center:spin.parent.position.clone(),radius:spin.userData.radius,matrix:new T.Matrix4()});
      level.parts.push({mesh,offset:source.matrixWorld.clone(),wheel});
    });
    return level;
  });
}

/** One instanced draw per model part/LOD, independent of the number of cars. */
export function flushTrafficFleet(city,camera){
  const fleet=city.fleet;if(!fleet)return;
  if(camera){camera.getWorldPosition(fleetCamera);city.root.updateWorldMatrix(true,false);city.root.worldToLocal(fleetCamera);}else fleetCamera.set(0,25,30);
  for(const type of fleet.types.values()){
    if(!type.levels)continue;
    for(const level of type.levels)level.count=0;
    for(const car of type.cars){
      if(!car.model)continue;
      const distance=car.model.position.distanceTo(fleetCamera);let index=car.renderLod??1;
      if(index>0&&distance<TRAFFIC_LOD_DISTANCES[index]*(1-TRAFFIC_LOD_HYSTERESIS))index--;
      if(index<2&&distance>=TRAFFIC_LOD_DISTANCES[index+1])index++;
      // The red P72's heavily reduced mesh collapses its curved silhouette.
      // Its original is only 21k triangles, so retain that body at every range.
      if(type.spec.id==='de-tomaso-p72')index=0;
      car.renderLod=index;
      const level=type.levels[index],slot=level.count++;
      car.model.updateMatrix();fleetWorld.multiplyMatrices(car.model.matrix,level.fit);
      for(const [id,wheel] of level.wheels){
        const {center,radius,matrix}=wheel;
        matrix.makeTranslation(center.x,center.y,center.z);
        wheelRotation.makeRotationY(id.startsWith('F')?(car.steering||0):0);matrix.multiply(wheelRotation);
        wheelRotation.makeRotationX((car.renderWheelAngle??car.wheelAngle??0)*(car.wheelRadius||.345)/radius);matrix.multiply(wheelRotation);
        wheelTranslation.makeTranslation(-center.x,-center.y,-center.z);matrix.multiply(wheelTranslation);
      }
      for(const part of level.parts){
        if(part.wheel)fleetPart.multiplyMatrices(level.wheels.get(part.wheel).matrix,part.offset);else fleetPart.copy(part.offset);
        fleetPart.premultiply(fleetWorld);part.mesh.setMatrixAt(slot,fleetPart);
      }
    }
    for(const level of type.levels)for(const {mesh} of level.parts){mesh.count=level.count;mesh.visible=level.count>0;if(level.count)mesh.instanceMatrix.needsUpdate=true;}
  }
}

function loadGlb(url) {
  return loader.loadAsync(url).then(gltf => gltf.scene).catch(error => {
    fleetStatus.failed.set(url, error.message || String(error));
    return null;
  });
}

/** Fits one template to the catalog length and sits its wheels on y=0. Shared resources are flagged so retireShell never disposes them. */
function prepareTemplate(input, spec, level, frame) {
  // Canonical wrapper lets explicit wheel pivots use X axles and Y steering,
  // even when the imported mesh nodes carry Blender's axis conversion.
  const scene = new T.Group();
  input.rotation.y += T.MathUtils.degToRad(spec.yaw || 0);
  scene.add(input);
  scene.updateMatrixWorld(true);
  const box = new T.Box3().setFromObject(scene), size = box.getSize(new T.Vector3());
  if (box.isEmpty() || !Number.isFinite(size.z) || size.z < .01) throw new Error('Invalid traffic mesh bounds');
  const fit = frame?.fit ?? spec.length / size.z;
  scene.traverse(o => {
    if (!o.isMesh) return;
    o.castShadow = level < 2;       // distant cars cast no shadow
    o.receiveShadow = level === 0;  // only nearby cars receive shadows
    o.geometry.userData.sharedAsset = true;
    for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
      if (!m) continue;
      m.userData.sharedAsset = true;
      m.envMapIntensity = .8;
    }
  });
  scene.userData.fit = fit;
  scene.userData.lift = frame?.lift ?? -box.min.y * fit;
  scene.userData.centerX = frame?.centerX ?? -(box.min.x + box.max.x) * .5 * fit;
  scene.userData.centerZ = frame?.centerZ ?? -(box.min.z + box.max.z) * .5 * fit;
  const wheelParts = new Map();
  scene.traverse(o => {
    if (!o.isMesh || !/^(FL|FR|RL|RR)$/.test(o.userData.zwWheelPart)) return;
    const id = o.userData.zwWheelPart;
    if (!wheelParts.has(id)) wheelParts.set(id, []);
    wheelParts.get(id).push(o);
  });
  for (const [id, parts] of wheelParts) {
    const bounds = new T.Box3();
    parts.forEach(p => bounds.union(new T.Box3().setFromObject(p)));
    const steer = new T.Group(), spin = new T.Group();
    steer.position.copy(bounds.getCenter(new T.Vector3()));
    scene.add(steer); steer.add(spin); scene.updateMatrixWorld(true);
    parts.forEach(p => spin.attach(p));
    steer.userData.zwSteer = id.startsWith('F');
    spin.userData.zwWheelPivot = true;
    spin.userData.radius = bounds.getSize(new T.Vector3()).y * fit * .5;
  }
  if (Math.abs(fit - 1) > .05) console.warn(`ZeroWatt: ${spec.id} LOD${level} rescaled by ${fit.toFixed(3)} to ${spec.length} m.`);
  return scene;
}

/** Resolves to [lod0, lod1, lod2] templates, or null if LOD0 is missing. Missing coarser levels reuse the nearest finer one. Cached per car id. */
export function loadTrafficCar(spec) {
  if (spec.installed === false) return Promise.resolve(null);
  if (!cache.has(spec.id)) {
    cache.set(spec.id, Promise.all(spec.lods.map(loadGlb)).then(scenes => {
      if (!scenes[0]) {
        console.warn(`ZeroWatt: premium traffic model ${spec.id} not found; original car retained.`);
        return null;
      }
      const levels = [];
      scenes.forEach((scene, level) => levels.push(scene ? prepareTemplate(scene, spec, level, levels[0]?.userData) : levels[level - 1]));
      fleetStatus.loaded.add(spec.id);
      return levels;
    }).catch(error => {
      fleetStatus.failed.set(spec.id, error.message || String(error));
      return null;
    }));
  }
  return cache.get(spec.id);
}

/** Builds one traffic car's THREE.LOD. Clones share geometry/material/texture objects with the templates. */
export function buildTrafficLod(levels, distances = TRAFFIC_LOD_DISTANCES, hysteresis = TRAFFIC_LOD_HYSTERESIS) {
  const lod = new T.LOD();
  const wheels = [];
  levels.forEach((template, level) => {
    const holder = new T.Group();
    holder.scale.setScalar(template.userData.fit);
    holder.position.set(template.userData.centerX || 0, template.userData.lift, template.userData.centerZ || 0);
    const clone = template.clone(true);
    clone.traverse(o => {
      if (o.userData.zwWheelPivot) wheels.push(o);
      if (o.isMesh) {o.castShadow = level < 2; o.receiveShadow = level === 0;}
    });
    holder.add(clone);
    lod.addLevel(holder, distances[level], hysteresis);
  });
  lod.userData.wheelPivots = wheels;
  return lod;
}

/** Installs shared model/LOD batches plus a lightweight pose handle for each car. */
export function attachTrafficFleet(city) {
  const group = new T.Group();
  group.name = 'Premium traffic fleet';
  city.root.add(group);
  const fleet = city.fleet = {group, cars: [],types:new Map()};
  const lamps=fleet.lamps=new T.Group();lamps.name='Moving vehicle night lamps';lamps.visible=false;group.add(lamps);
  const lampGeometry=new T.SphereGeometry(1,8,6);
  fleet.headlamps=new T.InstancedMesh(lampGeometry,new T.MeshBasicMaterial({color:'#fff1c9'}),city.cars.length*2);
  fleet.tailLamps=new T.InstancedMesh(lampGeometry,new T.MeshBasicMaterial({color:'#ff3820'}),city.cars.length*2);
  const hidden=new T.Matrix4().makeScale(0,0,0);
  for(const mesh of [fleet.headlamps,fleet.tailLamps]){mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.boundingBox=city.motionBounds.clone();mesh.boundingSphere=city.motionBounds.getBoundingSphere(new T.Sphere());for(let i=0;i<mesh.count;i++)mesh.setMatrixAt(i,hidden);lamps.add(mesh);}
  const installed = TRAFFIC_CARS.filter(spec => spec.installed);
  const choices = installed.length ? installed : TRAFFIC_CARS;
  city.cars.forEach((car, i) => {
    const spec = choices[i % choices.length];
    car.model = null;
    car.modelId = spec.id;
    if(!fleet.types.has(spec.id))fleet.types.set(spec.id,{spec,cars:[]});
    const type=fleet.types.get(spec.id);type.cars.push(car);
    car.model_ready = loadTrafficCar(spec).then(levels => {
      if (!levels || city.root.userData.retired) return false;
      if(!type.levels)instanceLevels(city,type,levels);
      const lod = new T.Object3D();lod.userData.instancedTraffic=true;
      lod.name = `Traffic ${spec.name}`;
      lod.position.y = ROAD_Y;
      group.add(lod);
      car.model = lod;
      car.lampRig={fleet,index:i,length:spec.length,id:spec.id};
      fleet.cars.push(car);
      return true;
    });
  });
  return fleet;
}

/** Called every frame; allocation-free. Returns true when the premium model owns this car. */
export function placeFleetCar(car, x, z, yaw) {
  if (!car.model) return false;
  car.model.position.set(x, ROAD_Y, z);
  car.model.rotation.y = yaw;
  if(car.lampRig&&car.lampRig.fleet.lamps.visible){
    const {fleet,index,length,id}=car.lampRig;
    for(const side of [-1,1])for(const front of [true,false]){
      const width=id==='porsche-taycan'?.75:id==='de-tomaso-p72'?.62:.54;
      const height=id==='porsche-taycan'?.51:id==='de-tomaso-p72'?.36:.42;
      const localZ=(front?.452:-.445)*length,px=side*width;
      lampPose.position.set(x+px*Math.cos(yaw)+localZ*Math.sin(yaw),height+ROAD_Y,z-px*Math.sin(yaw)+localZ*Math.cos(yaw));
      lampPose.rotation.set(0,yaw,0);lampPose.scale.set(front?.075:.105,front?.045:.033,.035);lampPose.updateMatrix();
      const mesh=front?fleet.headlamps:fleet.tailLamps;mesh.setMatrixAt(index*2+(side>0?1:0),lampPose.matrix);mesh.instanceMatrix.needsUpdate=true;
    }
  }
  for (const wheel of car.model.userData.wheelPivots || []) {
    const radius = wheel.userData.radius;
    if (radius > .01) wheel.rotation.x = ((car.renderWheelAngle ?? car.wheelAngle ?? 0) * (car.wheelRadius || .345) / radius) % (Math.PI * 2);
    if (wheel.parent.userData.zwSteer) wheel.parent.rotation.y = car.steering || 0;
  }
  return true;
}
