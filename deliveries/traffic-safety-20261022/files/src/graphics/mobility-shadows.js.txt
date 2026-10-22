import * as T from '../../vendor/three.module.js';

/** Shared soft grounding shadows avoid re-drawing every rider/limb into the sun map. */
export function buildMobilityShadows(city){
  const size=32,data=new Uint8Array(size*size*4);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const r=Math.hypot((x+.5-size/2)/(size/2),(y+.5-size/2)/(size/2));
    data.set([18,25,26,Math.round(Math.max(0,1-r)**1.7*95)],(y*size+x)*4);
  }
  const texture=new T.DataTexture(data,size,size);texture.needsUpdate=true;
  const material=new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false});material.userData.ownedTextures=[texture];
  const count=city.cars.length+city.cyclists.length+city.pedestrians.length;
  const mesh=city.mobilityShadows=new T.InstancedMesh(new T.PlaneGeometry(1,1).rotateX(-Math.PI/2),material,count);
  mesh.name='Shared moving contact shadows';mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);
  mesh.boundingBox=city.motionBounds.clone();mesh.boundingSphere=city.motionBounds.getBoundingSphere(new T.Sphere());
  city.root.add(mesh);city.shadowPose=new T.Object3D();city.shadowPoint=new T.Vector3();
}

export function updateMobilityShadows(city){
  const mesh=city.mobilityShadows,pose=city.shadowPose,point=city.shadowPoint;let index=0;
  const put=(x,y,z,yaw,w,d)=>{pose.position.set(x,y+.012,z);pose.rotation.set(0,yaw,0);pose.scale.set(w,1,d);pose.updateMatrix();mesh.setMatrixAt(index++,pose.matrix);};
  for(const car of city.cars){city.paths[car.lane].getPointAt(car.renderPhase??car.phase,point);put(point.x,-.18,point.z,car.heading,2.0,4.3);}
  for(const rider of city.cyclists)put(rider.position[0],-.18,rider.position[2],rider.heading,.65,1.9);
  for(const person of city.pedestrians){const p=person.pose.position;put(p[0],p[1],p[2],person.heading,.54,.64);}
  mesh.instanceMatrix.needsUpdate=true;
}
