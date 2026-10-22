import * as T from '../../vendor/three.module.js';
import {bakeRoute} from './motion-route.js';

export function roundedRoadRoute(minX,maxX,minZ,maxZ,{reverse=false,lane=1.25,radius=4}={}){
  const offset=reverse?-lane:lane,left=minX+offset,right=maxX-offset,back=minZ+offset,front=maxZ-offset;
  const r=Math.min(radius,(right-left)/3,(front-back)/3),arc=Math.PI*r/2;
  const width=right-left-2*r,depth=front-back-2*r;
  const segments=[
    {n:arc,c:[right-r,front-r],a:0},{n:width,p:[right-r,front],t:[-1,0]},
    {n:arc,c:[left+r,front-r],a:Math.PI/2},{n:depth,p:[left,front-r],t:[0,-1]},
    {n:arc,c:[left+r,back+r],a:Math.PI},{n:width,p:[left+r,back],t:[1,0]},
    {n:arc,c:[right-r,back+r],a:Math.PI*1.5},{n:depth,p:[right,back+r],t:[0,1]}
  ],length=segments.reduce((n,s)=>n+s.n,0);
  function sample(phase,target,tangent){
    let distance=((reverse?-phase:phase)%1+1)%1*length;
    let segment=segments.at(-1);
    for(const s of segments){if(distance<s.n){segment=s;break;}distance-=s.n;}
    if(segment.c){
      const a=segment.a+distance/r;
      if(tangent)target.set(-Math.sin(a),0,Math.cos(a));
      else target.set(segment.c[0]+Math.cos(a)*r,0,segment.c[1]+Math.sin(a)*r);
    }else if(tangent)target.set(segment.t[0],0,segment.t[1]);
    else target.set(segment.p[0]+segment.t[0]*distance,0,segment.p[1]+segment.t[1]*distance);
    if(tangent&&reverse)target.multiplyScalar(-1);return target;
  }
  // Exact line/arc joins keep opposing lanes separated. A Catmull-Rom spline
  // through unevenly spaced corner points bowed the long straights sideways.
  return {getLength:()=>length,getPointAt:(p,t=new T.Vector3())=>sample(p,t,false),getTangentAt:(p,t=new T.Vector3())=>sample(p,t,true)};
}

/** Every block edge is served, including the four previously empty corner blocks. */
export function roadNetwork(xs,zs){
  const rectangles=[
    [xs[1],xs[2],zs[1],zs[2],false], [xs[1],xs[2],zs[1],zs[2],true],
    [xs[0],xs[1],zs[1],zs[2],false], [xs[2],xs[3],zs[1],zs[2],false],
    [xs[0],xs[3],zs[0],zs[1],false], [xs[0],xs[3],zs[2],zs[3],false],
    [xs[0],xs[3],zs[0],zs[3],false], [xs[0],xs[3],zs[0],zs[3],true],
    [xs[0],xs[1],zs[0],zs[1],false], [xs[2],xs[3],zs[0],zs[1],false],
    [xs[0],xs[1],zs[2],zs[3],false], [xs[2],xs[3],zs[2],zs[3],false]
  ];
  const routes=(lane,radius)=>rectangles.map(([a,b,c,d,reverse])=>bakeRoute(roundedRoadRoute(a,b,c,d,{reverse,lane,radius})));
  return {paths:routes(1.25,4),cyclePaths:routes(3.65,2.4),
    junctions:xs.flatMap((x,i)=>zs.map((z,j)=>({id:`${i}:${j}`,x,z,offset:(i+j)%2*20}))),owners:new Map(),crossings:new Map(),walkUntil:new Map(),walkAdmissionUntil:new Map(),walkCycle:new Map(),lastWalkAt:new Map(),pedestrianPriority:new Set(),clearUntil:new Map(),controllers:[],requests:new Map(),ticket:0,xs,zs};
}

/** Stagger departures on shared road segments; no initial overlapping vehicles. */
export function seedRoadUsers(paths,counts,make,{junctions=[],junctionClearance=11,spacing=6,laneWidth=2.1}={}){
  const users=[],point=new T.Vector3(),otherPoint=new T.Vector3(),direction=new T.Vector3();
  // Fill the most constrained short routes first; broad outer circuits can use
  // many other blocks and must not consume every safe slot in a corner block.
  const order=paths.map((_,i)=>i).sort((a,b)=>paths[a].getLength()-paths[b].getLength()||a-b);
  order.forEach(lane=>{
    const count=counts[lane];
    for(let i=0;i<count;i++){
      const start=(i/count+lane*.117)%1;let phase=start,found=false;
      for(let attempt=0;attempt<3000;attempt++){
        phase=(start+attempt*.618033988749895)%1;
        paths[lane].getPointAt(phase,point);
        if(junctions.some(j=>Math.abs(point.x-j.x)<junctionClearance&&Math.abs(point.z-j.z)<junctionClearance))continue;
        paths[lane].getTangentAt(phase,direction);
        if(users.every(other=>{
          paths[other.lane].getPointAt(other.phase,otherPoint);
          const dx=point.x-otherPoint.x,dz=point.z-otherPoint.z;
          return Math.abs(dx*direction.z-dz*direction.x)>laneWidth||Math.abs(dx*direction.x+dz*direction.z)>spacing;
        })){found=true;break;}
      }
      if(!found)throw new Error(`No safe starting space for road route ${lane}`);
      users.push({...make(users.length,lane),lane,phase});
    }
  });
  return users.sort((a,b)=>a.lane-b.lane);
}
