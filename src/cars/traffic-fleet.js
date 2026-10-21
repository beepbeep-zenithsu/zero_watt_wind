import * as T from '../../vendor/three.module.js';
import {GLTFLoader} from '../../vendor/addons/loaders/GLTFLoader.js';
import {TRAFFIC_CARS, TRAFFIC_LOD_DISTANCES, TRAFFIC_LOD_HYSTERESIS} from './car-catalog.js';

/**
 * Premium traffic fleet.
 *
 * Each of the city's moving cars is assigned one of the eight premium models
 * (car index i uses TRAFFIC_CARS[i % 8], so both lanes get a mix). Each model is
 * fetched once; every car then holds a THREE.LOD whose levels are clones that
 * SHARE geometry, materials and textures with the cached template.
 * Until a model has loaded (or if its files are missing) the car keeps using the
 * original instanced sedan/crossover, so traffic never disappears.
 */
const loader = new GLTFLoader();
const cache = new Map();
export const fleetStatus = {loaded: new Set(), failed: new Map()};
const ROAD_Y = -.18;

function loadGlb(url) {
  return loader.loadAsync(url).then(gltf => gltf.scene).catch(error => {
    fleetStatus.failed.set(url, error.message || String(error));
    return null;
  });
}

/** Fits one template to the catalog length and sits its wheels on y=0. Shared resources are flagged so retireShell never disposes them. */
function prepareTemplate(scene, spec, level) {
  scene.updateMatrixWorld(true);
  const box = new T.Box3().setFromObject(scene), size = box.getSize(new T.Vector3());
  const fit = size.z > .01 ? spec.length / size.z : 1;
  scene.traverse(o => {
    if (!o.isMesh) return;
    o.castShadow = level < 2;       // distant cars cast no shadow
    o.receiveShadow = level === 0;  // only nearby cars receive shadows
    o.geometry.userData.sharedAsset = true;
    for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
      m.userData.sharedAsset = true;
      m.envMapIntensity = .8;
    }
  });
  scene.userData.fit = fit;
  scene.userData.lift = -box.min.y * fit;
  if (Math.abs(fit - 1) > .05) console.warn(`ZeroWatt: ${spec.id} LOD${level} rescaled by ${fit.toFixed(3)} to ${spec.length} m.`);
  return scene;
}

/** Resolves to [lod0, lod1, lod2] templates, or null if LOD0 is missing. Missing coarser levels reuse the nearest finer one. Cached per car id. */
export function loadTrafficCar(spec) {
  if (!cache.has(spec.id)) {
    cache.set(spec.id, Promise.all(spec.lods.map(loadGlb)).then(scenes => {
      if (!scenes[0]) {
        console.warn(`ZeroWatt: premium traffic model ${spec.id} not found; original car retained.`);
        return null;
      }
      const levels = [];
      scenes.forEach((scene, level) => levels.push(scene ? prepareTemplate(scene, spec, level) : levels[level - 1]));
      fleetStatus.loaded.add(spec.id);
      return levels;
    }));
  }
  return cache.get(spec.id);
}

/** Builds one traffic car's THREE.LOD. Clones share geometry/material/texture objects with the templates. */
export function buildTrafficLod(levels, distances = TRAFFIC_LOD_DISTANCES, hysteresis = TRAFFIC_LOD_HYSTERESIS) {
  const lod = new T.LOD();
  levels.forEach((template, level) => {
    const holder = new T.Group();
    holder.scale.setScalar(template.userData.fit);
    holder.position.y = template.userData.lift;
    holder.add(template.clone(true));
    lod.addLevel(holder, distances[level], hysteresis);
  });
  return lod;
}

/** Marks every moving city car with a premium model as soon as its files load. */
export function attachTrafficFleet(city) {
  const group = new T.Group();
  group.name = 'Premium traffic fleet';
  city.root.add(group);
  const fleet = city.fleet = {group, cars: []};
  city.cars.forEach((car, i) => {
    const spec = TRAFFIC_CARS[i % TRAFFIC_CARS.length];
    car.model = null;
    car.modelId = spec.id;
    car.model_ready = loadTrafficCar(spec).then(levels => {
      if (!levels || city.root.userData.retired) return false;
      const lod = buildTrafficLod(levels);
      lod.name = `Traffic ${spec.name}`;
      lod.position.y = ROAD_Y;
      group.add(lod);
      car.model = lod;
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
  return true;
}