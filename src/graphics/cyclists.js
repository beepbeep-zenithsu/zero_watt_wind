import * as T from '../../vendor/three.module.js';
import {addAssetInstances} from './assets.js';
import {prepareTraffic,advanceTraffic,TRAFFIC_CRUISE} from './traffic.js';
import {seedRoadUsers} from './road-network.js';
import {personLook} from './people.js';

export function cycleLeg(side,angle,result={hip:new T.Vector3(),knee:new T.Vector3(),ankle:new T.Vector3(),pedal:new T.Vector3()}){
  const dy=side*(.15*Math.cos(angle)-.08*Math.sin(angle)),dz=side*(.15*Math.sin(angle)+.08*Math.cos(angle));
  const {hip,knee,ankle,pedal}=result;hip.set(side*.10,1.05,-.22);ankle.set(side*.11,.47+dy,-.06+dz);
  const y=ankle.y-hip.y,z=ankle.z-hip.z,d=Math.hypot(y,z),a=(.44**2-.46**2+d*d)/(2*d),b=Math.sqrt(Math.max(0,.44**2-a*a));
  knee.set(side*.105,hip.y+a*y/d+b*z/d,hip.z+a*z/d-b*y/d);pedal.set(side*.13,.35+dy,-.02+dz);return result;
}

const before=new T.Vector3(),after=new T.Vector3(),midpoint=new T.Vector3(),target=new T.Vector3(),boneRotation=new T.Quaternion(),boneMatrix=new T.Matrix4();
function boneTransform(a,b,c,d,result){
  before.subVectors(b,a).normalize();after.subVectors(d,c).normalize();boneRotation.setFromUnitVectors(before,after);
  midpoint.addVectors(a,b).multiplyScalar(.5);target.addVectors(c,d).multiplyScalar(.5);
  result.makeTranslation(target.x,target.y,target.z).multiply(boneMatrix.makeRotationFromQuaternion(boneRotation)).multiply(boneMatrix.makeTranslation(-midpoint.x,-midpoint.y,-midpoint.z));
}

export function buildCyclists(city){
  const users=seedRoadUsers(city.network.cyclePaths,city.network.cyclePaths.map(()=>2),i=>({
    ...personLook(i+3),wheelRadius:.35,wheelbase:1.18,clearance:2.5,standOff:1.25,headway:1.0,maxAcceleration:1.0,cornerAcceleration:1.1,
    parts:{},initial:[cycleLeg(-1,0),cycleLeg(1,0)],current:[cycleLeg(-1,0),cycleLeg(1,0)],position:[0,-.18,0]
  }));
  const controller=city.cycleTraffic={cars:users,paths:city.network.cyclePaths,network:city.network};
  city.cyclists=users;prepareTraffic(controller);
  const batch=city.cyclistsBatch=addAssetInstances(city.root,'site-cyclist',users,{lighting:true,motionBounds:city.motionBounds});
  city.batches.push(batch);
}

export function updateCyclists(city,dt,signals,reduced,wet,storm){
  const controller=city.cycleTraffic;
  if(!reduced)advanceTraffic(controller,dt,storm?TRAFFIC_CRUISE.stormBicycle:wet?TRAFFIC_CRUISE.wetBicycle:TRAFFIC_CRUISE.bicycle,(axis,car,distance)=>signals[axis]==='green'||(signals[axis]==='amber'&&distance<1.25+car.speed*car.speed/5.2));
  const point=city.cyclePoint ||= new T.Vector3();
  for(const rider of city.cyclists){
    const p=controller.paths[rider.lane].getPointAt(rider.renderPhase??rider.phase,point);
    // Crank cadence is mechanically linked to travelled wheel distance; stopping
    // at a signal stops both the wheels and the rider's feet.
    const angle=(rider.renderWheelAngle??rider.wheelAngle)/2.65,parts=rider.parts;
    for(const [index,side] of [[0,-1],[1,1]]){
      const initial=rider.initial[index],current=cycleLeg(side,angle,rider.current[index]),suffix=side<0?'L':'R';
      for(const [name,a,b,c,d] of [[`CycleThigh${suffix}`,initial.hip,initial.knee,current.hip,current.knee],[`CycleCalf${suffix}`,initial.knee,initial.ankle,current.knee,current.ankle]]){
        parts[name] ||= new T.Matrix4();boneTransform(a,b,c,d,parts[name]);
      }
      for(const name of [`CycleShoe${suffix}`,`CyclePedal${suffix}`]){
        parts[name] ||= new T.Matrix4();parts[name].makeTranslation(0,current.pedal.y-initial.pedal.y,current.pedal.z-initial.pedal.z);
      }
    }
    rider.position[0]=p.x;rider.position[2]=p.z;rider.rotation=rider.heading;rider.crankAngle=angle;
  }
  city.cyclistsBatch.setPoses(city.cyclists);
}
