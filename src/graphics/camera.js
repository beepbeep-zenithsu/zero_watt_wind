import * as T from '../../vendor/three.module.js';

export function advanceCamera(s,dt,snap=false) {
  if(!s._cameraPose)s._cameraPose={angle:s.angle,elevation:s.elevation,distance:s.distance,target:s.target.clone()};
  const pose=s._cameraPose,a=snap||s.reducedMotion?1:1-Math.exp(-Math.max(0,dt)*9);
  let delta=s.angle-pose.angle;delta=Math.atan2(Math.sin(delta),Math.cos(delta));
  pose.angle+=delta*a;pose.elevation+=(s.elevation-pose.elevation)*a;
  pose.distance+=(s.distance-pose.distance)*a;pose.target.lerp(s.target,a);
  if(s.view==='inside'&&s.interiorEye){
    s.camera.position.copy(s.interiorEye);
    const c=Math.cos(pose.elevation);
    s.camera.lookAt(s.interiorEye.x-Math.sin(pose.angle)*c,
      s.interiorEye.y-Math.sin(pose.elevation),s.interiorEye.z-Math.cos(pose.angle)*c);
    return;
  }
  const radius=Math.cos(pose.elevation)*pose.distance;
  s.camera.position.set(pose.target.x+Math.sin(pose.angle)*radius,
    pose.target.y+Math.sin(pose.elevation)*pose.distance,pose.target.z+Math.cos(pose.angle)*radius);
  s.camera.lookAt(pose.target);
}

export function viewDistance(s,distance) {
  const portrait=Math.max(1,1.25/Math.max(.4,s.camera.aspect));
  s.maxDistance=Math.max(220,s.extent*3);
  return T.MathUtils.clamp(distance*portrait,4,s.maxDistance);
}
