import {pedestrianSignal,signalOffset} from './traffic.js';
const skins=['#bb8765','#724b36','#e0b593','#99613e','#d29b76','#513729'];
const shirts=['#386b7b','#a75f4d','#d3bf8b','#69775c','#8483a1','#d3d4cc','#335a64','#ad8555'];
const pants=['#283843','#3d4141','#65574b','#34464d','#515568'];
const hairs=['#291e19','#493024','#806144','#181b1d','#aaaa9d'];
export function personLook(i){return {skinColor:skins[i%skins.length],shirtColor:shirts[i%shirts.length],trouserColor:pants[(i*3)%pants.length],hairColor:hairs[(i*7)%hairs.length],longHair:i%3===1};}
export const personColorKey=name=>({'Person skin':'skinColor','Person shirt':'shirtColor','Person trousers':'trouserColor','Person hair':'hairColor'})[name];

/** Corners are joined along pavements and across the painted zebra crossings. */
export function sidewalkNetwork(network){
  const nodes=[],edges=[],corners=new Map(),{xs,zs}=network,offset=5.7;
  for(let ix=0;ix<xs.length;ix++)for(let iz=0;iz<zs.length;iz++)for(const sx of [-1,1])for(const sz of [-1,1]){
    const node={id:nodes.length,ix,iz,sx,sz,x:xs[ix]+sx*offset,z:zs[iz]+sz*offset,edges:[]};
    nodes.push(node);corners.set(`${ix}:${iz}:${sx}:${sz}`,node);
  }
  const at=(i,j,sx,sz)=>corners.get(`${i}:${j}:${sx}:${sz}`);
  const join=(a,b,crossing=null)=>{
    if(!b)return;
    const dx=b.x-a.x,dz=b.z-a.z,length=Math.hypot(dx,dz);
    const edge={id:edges.length,from:a,to:b,length,tx:dx/length,tz:dz/length,crossing,junction:crossing?network.junctions.find(j=>j.id===crossing):null};a.edges.push(edge);edges.push(edge);
  };
  for(const n of nodes){
    join(n,at(n.ix+n.sx,n.iz,-n.sx,n.sz));
    join(n,at(n.ix,n.iz+n.sz,n.sx,-n.sz));
    join(n,at(n.ix,n.iz,-n.sx,n.sz),`${n.ix}:${n.iz}`);
    join(n,at(n.ix,n.iz,n.sx,-n.sz),`${n.ix}:${n.iz}`);
  }
  return {nodes,edges};
}

function nextRoute(graph,p,start){
  p.seed=(Math.imul(p.seed,1664525)+1013904223)>>>0;
  // Walk to another part of town rather than pacing along one block.
  const targets=graph.nodes.filter(n=>Math.abs(n.ix-start.ix)+Math.abs(n.iz-start.iz)>=3&&n.edges.some(e=>!e.crossing));
  const end=targets[p.seed%targets.length],first={node:start,crossed:!!p.edge.crossing},queue=[first],previous=new Map([[start.id*2+Number(first.crossed),null]]);
  let finish=null;
  for(let i=0;i<queue.length&&!finish;i++)for(const edge of queue[i].node.edges){
    // Always clear a crossing onto pavement before attempting another road.
    if(queue[i].crossed&&edge.crossing)continue;
    const key=edge.to.id*2+Number(!!edge.crossing);if(previous.has(key))continue;
    const next={node:edge.to,crossed:!!edge.crossing,key};previous.set(key,{edge,parent:queue[i]});queue.push(next);
    if(edge.to===end){finish=next;break;}
  }
  const route=[];let current=finish;
  while(current&&current!==first){const step=previous.get(current.key);route.push(step.edge);current=step.parent;}
  return route.reverse();
}

export function buildPedestrians(city,values){
  city.pedestrianTime=0;city.sidewalks=sidewalkNetwork(city.network);
  city.pedestrianQueues=city.sidewalks.edges.map(()=>[]);
  city.pavementOwners=new Map();city.pavementRequests=city.sidewalks.nodes.map(()=>new Map());city.pavementTicket=0;
  const starts=city.sidewalks.edges.filter(e=>!e.crossing);
  city.pedestrians=values.map((look,i)=>{
    const edge=starts[(i*37)%starts.length],p={look,edge,distance:edge.length*(.12+(i*.61803398875%1)*.76),speed:0,cruise:1.75+(i%5)*.09,
      seed:i+17,route:[],state:'walking',walkBlend:0,steps:0,pause:0,waitingFor:0,crossingsCompleted:0,visited:new Set([edge.from.ix+':'+edge.from.iz]),
      pose:{...look,position:[0,-.09,0],grounded:true,rotation:0,limbs:{},gesture:0}};
    p.route=nextRoute(city.sidewalks,p,edge.to);return p;
  });
  city.pedestrianPoses=city.pedestrians.map(p=>p.pose);
}

function canCross(city,p,edge,remaining){
  if(!edge.crossing)return true;
  const now=city.simulationTime||0,until=city.network.walkUntil.get(edge.crossing)||0;
  // A late-clearing vehicle must not make pedestrians miss every walk phase.
  // Start a full local walk window after the junction actually clears.
  const admission=city.network.walkAdmissionUntil.get(edge.crossing)||0;
  remaining=pedestrianSignal(now,edge.junction);
  const served=city.network.walkCycle.get(edge.crossing)===Math.floor((now+signalOffset(edge.junction))/40);
  const cooled=now-(city.network.lastWalkAt.get(edge.crossing)??-100)>=24;
  const accepted=until>now?admission>now:cooled&&((remaining>0&&!served)||city.network.pedestrianPriority.has(edge.crossing));
  if(!accepted||city.network.owners.has(edge.crossing))return false;
  const j=edge.junction;
  for(const controller of [city,city.cycleTraffic]){
    if(!controller?.trafficPositions)continue;
    const positions=controller.trafficPositions,directions=controller.trafficDirections;
    for(let i=0;i<controller.cars.length;i++){
      const bike=!!controller.cars[i].clearance,l=bike?1.05:2.5,w=bike?.36:.98;
      const ex=Math.abs(directions[i*2])*l+Math.abs(directions[i*2+1])*w;
      const ez=Math.abs(directions[i*2+1])*l+Math.abs(directions[i*2])*w;
      if(Math.abs(positions[i*2]-j.x)<6.6+ex&&Math.abs(positions[i*2+1]-j.z)<6.6+ez)return false;
    }
  }
  return true;
}

function departureClear(city,p,edge){
  return !city.pedestrianQueues[edge.id].some(other=>other!==p&&other.distance<.9);
}

function pavementPermit(city,p,remaining){
  const edge=p.edge,node=edge.to,left=edge.length-p.distance,owners=city.pavementOwners;
  if(owners.get(node.id)===p)return true;
  if(left>3)return false;
  const waiting=city.pavementRequests[node.id];
  if(!waiting.has(p))waiting.set(p,city.pavementTicket++);
  if(owners.has(node.id))return false;
  let first=null,order=Infinity;
  for(const [other,ticket] of waiting){
    if(other.edge.to!==node){waiting.delete(other);continue;}
    const next=other.route[0];
    const atFront=!city.pedestrianQueues[other.edge.id].some(ahead=>ahead!==other&&ahead.distance>other.distance+.001);
    if(next&&atFront&&ticket<order&&canCross(city,other,next,remaining)&&departureClear(city,other,next)){first=other;order=ticket;}
  }
  if(first!==p)return false;
  owners.set(node.id,p);waiting.delete(p);p.corner=node;
  // Reserve an accepted crossing while taking the final approach to its curb.
  // This commitment is honored even if the walk signal changes mid-step.
  const next=p.route[0];
  if(next.crossing){
    const now=city.simulationTime||0;
    if((city.network.walkUntil.get(next.crossing)||0)<=now){
      city.network.walkAdmissionUntil.set(next.crossing,now+4);
      city.network.walkCycle.set(next.crossing,Math.floor((now+signalOffset(next.junction))/40));
      city.network.lastWalkAt.set(next.crossing,now);city.network.pedestrianPriority.delete(next.crossing);
    }
    const approach=(p.edge.length-p.distance)/Math.max(1.2,p.speed),clearAt=now+approach+next.length/p.cruise+1;
    city.network.walkUntil.set(next.crossing,Math.max(city.network.walkUntil.get(next.crossing)||0,clearAt));
    if(!city.network.crossings.has(next.crossing))city.network.crossings.set(next.crossing,new Set());
    city.network.crossings.get(next.crossing).add(p);p.pendingCross=next.crossing;
  }
  return true;
}

export function pedestrianPoses(city,dt,reduced=false){
  const elapsed=reduced?0:Math.max(0,Math.min(dt,.12));city.pedestrianTime+=elapsed;
  const walkRemaining=pedestrianSignal(city.simulationTime||0),pedestrians=city.pedestrians;
  // Fixed small steps keep waits and turns continuous across different frame rates.
  for(let remaining=elapsed;remaining>1e-8;){
    const step=Math.min(1/60,remaining);remaining-=step;
    for(const queue of city.pedestrianQueues)queue.length=0;
    for(const p of pedestrians)city.pedestrianQueues[p.edge.id].push(p);
    for(const p of pedestrians){
      if(p.corner&&p.edge.from===p.corner&&p.distance>=1.25){city.pavementOwners.delete(p.corner.id);p.corner=null;}
      if(!p.route.length)p.route=nextRoute(city.sidewalks,p,p.edge.to);
    }
    for(const p of pedestrians){
      if(p.pause>0){p.pause=Math.max(0,p.pause-step);p.speed=0;p.state='conversation';continue;}
      const edge=p.edge,left=edge.length-p.distance;
      if(!p.route.length)p.route=nextRoute(city.sidewalks,p,edge.to);
      const next=p.route[0];
      const permitted=pavementPermit(city,p,walkRemaining);
      const blocked=!permitted;
      let room=left;
      if(blocked)room=Math.max(0,left-1.25);
      for(const other of city.pedestrianQueues[edge.id])if(other!==p&&other.distance>p.distance+.001)room=Math.min(room,Math.max(0,other.distance-p.distance-.72));
      const target=room<left?Math.min(p.cruise,Math.sqrt(Math.max(0,3.6*room))):p.cruise;
      p.speed+=Math.max(-step*2.4,Math.min(step*1.8,target-p.speed));
      const distance=Math.min(room,p.speed*step);
      if(room<left&&room<.002){p.speed=0;p.state='waiting';p.waitingFor+=step;continue;}
      if(distance<left){p.distance+=distance;if(distance>.00001)p.waitingFor=0;p.state=edge.crossing?'crossing':'walking';continue;}
      if(p.crossingHeld){
        const crossing=city.network.crossings.get(edge.crossing);crossing?.delete(p);
        if(!crossing?.size)city.network.crossings.delete(edge.crossing);
        p.crossingsCompleted++;p.crossingHeld=false;
      }
      if(blocked){p.distance=edge.length;p.speed=0;p.state='waiting';continue;}
      p.visited.add(edge.to.ix+':'+edge.to.iz);p.steps++;
      if(!p.route.length)p.route=nextRoute(city.sidewalks,p,edge.to);
      const entering=p.route.shift();p.edge=entering;p.distance=0;
      if(entering.crossing){
        if(!city.network.crossings.has(entering.crossing))city.network.crossings.set(entering.crossing,new Set());
        city.network.crossings.get(entering.crossing).add(p);
        p.crossingHeld=true;p.pendingCross=null;
      }else if(p.steps%5===0){p.pause=.8+(p.seed%9)*.1;p.speed=0;}
    }
  }
  for(let i=0;i<pedestrians.length;i++){
    const p=pedestrians[i],e=p.edge,pose=p.pose;
    const lane=.33*Math.max(0,Math.min(1,p.distance/.8,(e.length-p.distance)/.8));
    pose.position[0]=e.from.x+e.tx*p.distance-e.tz*lane;
    pose.position[2]=e.from.z+e.tz*p.distance+e.tx*lane;
    pose.position[1]=-.09-(e.crossing?.09*Math.max(0,Math.min(1,p.distance/.9,(e.length-p.distance)/.9)):0);
    const desired=Math.atan2(e.tx,e.tz);p.heading??=desired;
    p.heading+=Math.atan2(Math.sin(desired-p.heading),Math.cos(desired-p.heading))*(1-Math.exp(-elapsed*10));pose.rotation=p.heading;
    p.walkBlend+=(Math.min(1,p.speed/p.cruise)-p.walkBlend)*(1-Math.exp(-elapsed*9));
    const gait=Math.sin(city.pedestrianTime*8.7+i*.75)*.36*p.walkBlend,talking=p.state==='conversation'&&!reduced;
    pose.limbs.LegL=gait;pose.limbs.LegR=-gait;
    pose.limbs.ArmL=-gait*.7+(talking?-.4+Math.sin(city.pedestrianTime*2.4+i)*.12:0);pose.limbs.ArmR=gait*.7;
    pose.gesture=talking?.16+Math.sin(city.pedestrianTime*1.7)*.07:0;
  }
  return city.pedestrianPoses;
}

export function updatePedestrianDemand(city){
  const priority=city.network.pedestrianPriority;priority.clear();const now=city.simulationTime||0;
  for(const p of city.pedestrians){
    const next=p.route[0];
    if(p.waitingFor<12||!next?.crossing||p.edge.length-p.distance>2)continue;
    if(city.pavementOwners.has(p.edge.to.id)||!departureClear(city,p,next))continue;
    if(city.pedestrianQueues[p.edge.id].some(other=>other!==p&&other.distance>p.distance+.001))continue;
    if(now-(city.network.lastWalkAt.get(next.crossing)??-100)>=24)priority.add(next.crossing);
  }
}
