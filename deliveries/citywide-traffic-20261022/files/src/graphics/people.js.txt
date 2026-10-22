import {pedestrianSignal} from './traffic.js';
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
    const edge={id:edges.length,from:a,to:b,length,tx:dx/length,tz:dz/length,crossing};a.edges.push(edge);edges.push(edge);
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
  const targets=graph.nodes.filter(n=>Math.abs(n.ix-start.ix)+Math.abs(n.iz-start.iz)>=3);
  const end=targets[p.seed%targets.length],queue=[start],previous=new Map([[start.id,null]]);
  for(let i=0;i<queue.length&&!previous.has(end.id);i++)for(const edge of queue[i].edges){
    if(previous.has(edge.to.id))continue;previous.set(edge.to.id,edge);queue.push(edge.to);
  }
  const route=[];let current=end;
  while(current!==start){const edge=previous.get(current.id);route.push(edge);current=edge.from;}
  return route.reverse();
}

export function buildPedestrians(city,values){
  city.pedestrianTime=0;city.sidewalks=sidewalkNetwork(city.network);
  city.pedestrianQueues=city.sidewalks.edges.map(()=>[]);
  const starts=city.sidewalks.edges.filter(e=>!e.crossing);
  city.pedestrians=values.map((look,i)=>{
    const edge=starts[(i*37)%starts.length],p={look,edge,distance:edge.length*(.12+(i*.61803398875%1)*.76),speed:0,cruise:1.75+(i%5)*.09,
      seed:i+17,route:[],state:'walking',walkBlend:0,steps:0,pause:0,crossingsCompleted:0,visited:new Set([edge.from.ix+':'+edge.from.iz]),
      pose:{...look,position:[0,-.09,0],grounded:true,rotation:0,limbs:{},gesture:0}};
    p.route=nextRoute(city.sidewalks,p,edge.to);return p;
  });
  city.pedestrianPoses=city.pedestrians.map(p=>p.pose);
}

function canCross(city,p,edge,remaining){
  if(!edge.crossing)return true;
  if(remaining<edge.length/p.cruise+.5||city.network.owners.has(edge.crossing))return false;
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
      if(p.pause>0){p.pause=Math.max(0,p.pause-step);p.speed=0;p.state='conversation';continue;}
      const edge=p.edge,left=edge.length-p.distance;
      if(!p.route.length)p.route=nextRoute(city.sidewalks,p,edge.to);
      const next=p.route[0];
      const blocked=next&&!canCross(city,p,next,walkRemaining);
      let room=left;
      for(const other of city.pedestrianQueues[edge.id])if(other!==p&&other.distance>p.distance+.001)room=Math.min(room,Math.max(0,other.distance-p.distance-.72));
      const target=blocked||room<left?Math.min(p.cruise,Math.sqrt(Math.max(0,3.6*room))):p.cruise;
      p.speed+=Math.max(-step*2.4,Math.min(step*1.8,target-p.speed));
      const distance=Math.min(room,p.speed*step);
      if(room<left&&room<.002){p.speed=0;p.state='waiting';continue;}
      if(distance<left){p.distance+=distance;p.state=edge.crossing?'crossing':'walking';continue;}
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
        p.crossingHeld=true;
      }else if(p.steps%5===0){p.pause=.8+(p.seed%9)*.1;p.speed=0;}
    }
  }
  for(let i=0;i<pedestrians.length;i++){
    const p=pedestrians[i],e=p.edge,pose=p.pose;
    const lane=.23*Math.max(0,Math.min(1,p.distance/.8,(e.length-p.distance)/.8));
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
