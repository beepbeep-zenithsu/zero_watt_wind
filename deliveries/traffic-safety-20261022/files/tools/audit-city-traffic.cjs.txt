/* Deterministic long-run traffic audit. Shapes are conservative ground footprints. */
const fs=require('node:fs'),path=require('node:path');
const {makeScene,ready,advanceCityMobility}=require('./verify-graphics.cjs'),M=require('../model.js');
function boxesOverlap(a,b){
  const dx=b.x-a.x,dz=b.z-a.z;
  for(const [x,z] of [[a.tx,a.tz],[-a.tz,a.tx],[b.tx,b.tz],[-b.tz,b.tx]]){
    const ra=Math.abs(x*a.tx+z*a.tz)*a.length+Math.abs(-x*a.tz+z*a.tx)*a.width;
    const rb=Math.abs(x*b.tx+z*b.tz)*b.length+Math.abs(-x*b.tz+z*b.tx)*b.width;
    if(Math.abs(dx*x+dz*z)>=ra+rb-.01)return false;
  }
  return true;
}
function diskBox(p,b){
  const dx=p.x-b.x,dz=p.z-b.z;
  const along=Math.max(0,Math.abs(dx*b.tx+dz*b.tz)-b.length),across=Math.max(0,Math.abs(-dx*b.tz+dz*b.tx)-b.width);
  return Math.hypot(along,across)<.27;
}
async function audit({mode='air',weather='clear',seconds=600,large=false}={}){
  const s=makeScene(mode),params={...M.defaults,_mode:mode,units:large?10:1,room:large?500:150,pond:large?500:100,boats:large?6:1,upb:large?2:1,rain:weather==='rain'?.8:weather==='storm'?1:0};
  s.setEnvironment({weather,environment:'park'},params);await ready(s);s.reducedMotion=false;
  const users=[...s.city.cars,...s.city.cyclists],last=users.map(c=>c.wheelAngle),wait=new Float64Array(users.length),maxWait=new Float64Array(users.length);
  const pedLast=s.city.pedestrians.map(p=>p.pose.position.slice()),pedWait=new Float64Array(80),pedMax=new Float64Array(80);
  const collisions={vehicle:0,pedestrian:0,mixed:0},examples=[],crossings=new Set();
  for(let frame=0;frame<seconds*10;frame++){
    s.time=frame/10;advanceCityMobility(s,.1);
    const boxes=users.map((c,i)=>{
      const bike=i>=s.city.cars.length,ctrl=bike?s.city.cycleTraffic:s.city,p=ctrl.paths[c.lane].getPointAt(c.phase),heading=c.heading;
      if(c.wheelAngle-last[i]>.0001)wait[i]=0;else wait[i]+=.1;
      maxWait[i]=Math.max(maxWait[i],wait[i]);last[i]=c.wheelAngle;
      return {id:i,bike,x:p.x,z:p.z,tx:Math.sin(heading),tz:Math.cos(heading),length:bike?1.03:2.48,width:bike?.33:.96};
    });
    const people=s.city.pedestrians.map((p,i)=>{
      const a=p.pose.position,prev=pedLast[i];
      if(Math.hypot(a[0]-prev[0],a[2]-prev[2])>.0001)pedWait[i]=0;else pedWait[i]+=.1;
      pedMax[i]=Math.max(pedMax[i],pedWait[i]);prev[0]=a[0];prev[2]=a[2];return {id:i,x:a[0],z:a[2]};
    });
    for(const id of s.city.network.crossings.keys())crossings.add(id);
    const record=(kind,a,b)=>{collisions[kind]++;if(examples.filter(e=>e.kind===kind).length<5)examples.push({kind,time:s.time,a,b});};
    for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++)if(boxesOverlap(boxes[i],boxes[j]))record('vehicle',boxes[i],boxes[j]);
    for(let i=0;i<people.length;i++){
      for(let j=i+1;j<people.length;j++)if(Math.hypot(people[i].x-people[j].x,people[i].z-people[j].z)<.54)record('pedestrian',people[i],people[j]);
      for(const box of boxes)if(diskBox(people[i],box))record('mixed',people[i],box);
    }
  }
  const report={mode,weather,large,seconds,cars:s.city.cars.length,cyclists:s.city.cyclists.length,pedestrians:s.city.pedestrians.length,collisions,examples,
    longestCarWait:Math.max(...maxWait.slice(0,s.city.cars.length)),longestBicycleWait:Math.max(...maxWait.slice(s.city.cars.length)),longestPedestrianWait:Math.max(...pedMax),
    stationaryUsers:[...maxWait].map((max,i)=>({id:i,kind:i<s.city.cars.length?'car':'bicycle',maxWait:max})).filter(p=>p.maxWait>80),
    pedestrianCrossings:crossings.size,minimumCarDistance:Math.min(...s.city.cars.map(c=>c.wheelAngle*.345)),minimumBicycleDistance:Math.min(...s.city.cyclists.map(c=>c.wheelAngle*.35)),minimumPedestrianCrossings:Math.min(...s.city.pedestrians.map(p=>p.crossingsCompleted)),
    blockedWalkers:s.city.pedestrians.map((p,i)=>({id:i,wait:pedWait[i],edge:p.edge.id,distance:p.distance,length:p.edge.length,from:p.edge.from.id,to:p.edge.to.id,corner:p.corner?.id,destinationOwner:s.city.pedestrians.indexOf(s.city.pavementOwners.get(p.edge.to.id)),next:p.route[0]?.id,held:p.crossingHeld,pending:p.pendingCross,leaders:s.city.pedestrians.filter(q=>q!==p&&q.edge===p.edge&&q.distance>p.distance).map(q=>({id:s.city.pedestrians.indexOf(q),d:q.distance}))})).filter(p=>p.wait>40),
    blockedVehicles:users.map((c,i)=>{
      const ctrl=i<s.city.cars.length?s.city:s.city.cycleTraffic,p=ctrl.paths[c.lane].getPointAt(c.phase);
      const next=ctrl.stops[c.lane].map(l=>({id:l.junction.id,distance:(l.phase-c.phase+1)%1*ctrl.pathLengths[c.lane]})).sort((a,b)=>a.distance-b.distance)[0];
      return {id:i,wait:wait[i],lane:c.lane,x:p.x,z:p.z,speed:c.speed,next};
    }).filter(c=>c.wait>30),
    junctionStates:s.city.network.junctions.map(j=>({id:j.id,priority:s.city.network.pedestrianPriority.has(j.id),walkUntil:s.city.network.walkUntil.get(j.id),owner:s.city.network.owners.get(j.id)?.members.map(m=>({id:users.indexOf(m.car),committed:m.committed,inside:m.wasInside})),started:s.city.network.owners.get(j.id)?.started}))};
  return report;
}
module.exports={audit,boxesOverlap,diskBox};
if(require.main===module)audit({mode:process.argv.includes('--water')?'water':'air',weather:process.argv.includes('--rain')?'rain':process.argv.includes('--storm')?'storm':'clear',seconds:Number(process.env.AUDIT_SECONDS)||600,large:process.argv.includes('--large')}).then(report=>{
  const file=path.join(__dirname,'../docs/cars/traffic-safety-audit.json');fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}).catch(e=>{console.error(e);process.exitCode=1;});
