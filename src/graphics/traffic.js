/** Metres/seconds, stable substeps, shared by both ventilation modes and pond. */
export const TRAFFIC_CRUISE=Object.freeze({car:8.4,wetCar:4.8,stormCar:1.8,bicycle:5,wetBicycle:2.8,stormBicycle:1.4});
export function signalState(time){
  const t=((time%40)+40)%40;
  if(t<11)return ['green','red'];
  if(t<14)return ['amber','red'];
  if(t<15)return ['red','red'];
  if(t<26)return ['red','green'];
  if(t<29)return ['red','amber'];
  return ['red','red'];
}

// A dedicated nine-second walk phase clears turning traffic before people cross.
export function pedestrianSignal(time){const t=((time%40)+40)%40;return t>=30&&t<39?39-t:0;}

function exitClear(controller,car,line){
  if(!line.exit)return true;
  const clearance=car.clearance||5.7,positions=controller.trafficPositions;
  for(let i=0;i<controller.cars.length;i++){
    if(controller.cars[i]===car)continue;
    if(Math.hypot(positions[i*2]-line.exit.x,positions[i*2+1]-line.exit.z)<clearance)return false;
  }
  return true;
}

export function prepareTraffic(city){
  city.stops=city.paths.map(path=>{
    if(city.network){
      const stops=[],steps=Math.max(1200,Math.ceil(path.getLength()*8));let previous=new Set();
      for(let i=-1;i<steps;i++){
        const phase=(i/steps+1)%1,p=path.getPointAt(phase),t=path.getTangentAt(phase),active=new Set();
        for(const junction of city.network.junctions){
          const ahead=(junction.x-p.x)*t.x+(junction.z-p.z)*t.z;
          const across=Math.abs((junction.x-p.x)*t.z-(junction.z-p.z)*t.x);
          if(Math.max(Math.abs(t.x),Math.abs(t.z))>.98&&ahead>0&&ahead<7.2&&across<4.2){
            active.add(junction.id);
            if(i>=0&&!previous.has(junction.id))stops.push({phase,axis:Math.abs(t.x)>.98?0:1,junction});
          }
        }
        previous=active;
      }
      // An outside-lane corner can face the same junction on both sides of
      // its turn. Keep the incoming stop, not a second red light mid-turn.
      const visits=new Map();
      for(const stop of stops){if(!visits.has(stop.junction.id))visits.set(stop.junction.id,[]);visits.get(stop.junction.id).push(stop);}
      return [...visits.values()].map(group=>group.reduce((best,stop,index)=>{
        const previous=group[(index+group.length-1)%group.length];
        const gap=(stop.phase-previous.phase+1)%1;
        return !best||gap>best.gap?{stop,gap}:best;
      },null).stop).sort((a,b)=>a.phase-b.phase);
    }
    const stops=[];let was=false;
    for(let i=-1;i<1200;i++){
      const phase=(i/1200+1)%1,p=path.getPointAt(phase),t=path.getTangentAt(phase);
      const horizontal=Math.abs(t.x)>.98,vertical=Math.abs(t.z)>.98;
      const approaching=(horizontal&&p.x*t.x>0&&Math.abs(p.x)>city.rx-7.2)||(vertical&&p.z*t.z>0&&Math.abs(p.z)>city.rz-7.2);
      if(i>=0&&approaching&&!was)stops.push({phase,axis:horizontal?0:1});
      was=approaching;
    }
    return stops;
  });
  city.pathLengths=city.paths.map(p=>p.getLength());
  city.stops.forEach((stops,i)=>{for(const line of stops)if(line.junction)line.exit=city.paths[i].getPointAt((line.phase+19/city.pathLengths[i])%1);});
  city.trafficRemainder=0;city.trafficPhases=new Float64Array(city.cars.length);
  city.trafficPositions=new Float64Array(city.cars.length*2);city.trafficDirections=new Float64Array(city.cars.length*2);
  city.cars.forEach(c=>{
    c.speed=0;c.acceleration=0;c.wheelAngle=0;c.steering=0;
    c.renderPhase=c.phase;c.renderWheelAngle=0;
    c.tangent=city.paths[c.lane].getTangentAt(c.phase);c.nextTangent=c.tangent.clone();
    c.heading=Math.atan2(c.tangent.x,c.tangent.z);
  });
}

export function advanceTraffic(city,dt,cruise,allowed){
  const step=1/120;
  // Avoid a catch-up spiral after a background tab or a slow frame.
  city.trafficRemainder+=Math.max(0,Math.min(dt,.12));
  while(city.trafficRemainder+1e-9>=step){
    city.trafficRemainder=Math.max(0,city.trafficRemainder-step);
    const phases=city.trafficPhases;
    city.cars.forEach((c,i)=>{
      phases[i]=c.phase;
      const p=city.paths[c.lane].getPointAt(c.phase,c.tangent),t=city.paths[c.lane].getTangentAt(c.phase,c.nextTangent);
      city.trafficPositions[i*2]=p.x;city.trafficPositions[i*2+1]=p.z;
      city.trafficDirections[i*2]=t.x;city.trafficDirections[i*2+1]=t.z;
    });
    // A shared junction belongs to one road user until its rear has cleared.
    // Cyclists and cars share this map, including when their routes differ.
    if(city.network)for(const [id,claim] of city.network.owners){
      if(claim.controller!==city)continue;
      const index=city.cars.indexOf(claim.car);
      if(index<0){city.network.owners.delete(id);continue;}
      const x=city.trafficPositions[index*2],z=city.trafficPositions[index*2+1],j=claim.line.junction;
      const inside=Math.abs(x-j.x)<9.4&&Math.abs(z-j.z)<9.4;
      claim.entered ||= (claim.car.phase-claim.line.phase+1)%1*city.pathLengths[claim.car.lane]<20;
      const distance=(claim.line.phase-claim.car.phase+1)%1*city.pathLengths[claim.car.lane];
      if((claim.entered&&!inside)||(!claim.entered&&!allowed(claim.line.axis,claim.car,distance,claim.line)))city.network.owners.delete(id);
    }
    city.cars.forEach((car,index)=>{
      const path=city.paths[car.lane],length=city.pathLengths[car.lane];let gap=length,stop=length;
      city.cars.forEach((other,j)=>{
        if(index===j)return;
        if(car.lane===other.lane){gap=Math.min(gap,(phases[j]-phases[index]+1)%1*length);return;}
        const dx=city.trafficPositions[j*2]-city.trafficPositions[index*2],dz=city.trafficPositions[j*2+1]-city.trafficPositions[index*2+1];
        const tx=city.trafficDirections[index*2],tz=city.trafficDirections[index*2+1];
        const along=dx*tx+dz*tz,across=Math.abs(dx*tz-dz*tx),aligned=tx*city.trafficDirections[j*2]+tz*city.trafficDirections[j*2+1];
        if(along>0&&across<1.4&&aligned>.7)gap=Math.min(gap,along);
      });
      for(const line of city.stops[car.lane]){
        const distance=(line.phase-car.phase+1)%1*length;
        let permitted=allowed(line.axis,car,distance,line);
        if(line.junction){
          const owners=city.network.owners,id=line.junction.id,claim=owners.get(id);
          const requests=city.network.requests;
          if(distance<4.8&&claim?.car!==car){
            if(!requests.has(id))requests.set(id,new Map());
            if(!requests.get(id).has(car))requests.get(id).set(car,{car,controller:city,line,order:city.network.ticket++});
          }
          if(city.network.crossings?.has(id))permitted=false;
          if(permitted&&!claim&&distance<4.8){
            let claimed=false;for(const owner of owners.values())if(owner.car===car){claimed=true;break;}
            if(!claimed){
              if(!requests.has(id))requests.set(id,new Map());
              const waiting=requests.get(id);
              if(!waiting.has(car))waiting.set(car,{car,controller:city,line,order:city.network.ticket++});
              let first=null;
              for(const [user,request] of waiting){
                const d=(request.line.phase-user.phase+1)%1*request.controller.pathLengths[user.lane];
                if(d>12){waiting.delete(user);continue;}
                if(d<4.8&&allowed(request.line.axis,user,d,request.line)&&exitClear(request.controller,user,request.line)&&(!first||request.order<first.order))first=request;
              }
              if(first?.car===car){owners.set(id,{car,controller:city,line,entered:false});waiting.delete(car);}
              else permitted=false;
            }
          }
          if(owners.get(id)?.car!==car&&owners.has(id))permitted=false;
        }
        if(!permitted)stop=Math.min(stop,distance);
      }
      const clearance=car.clearance||5.7,standOff=car.standOff||2.4;
      const room=Math.max(0,Math.min(gap-clearance,stop-standOff));
      // Preview bends and leave a time headway for the acceleration ramp.
      // Limiting jerk avoids the instant acceleration changes of the old model.
      const ahead=(car.phase+Math.max(2,car.speed*1.6)/length)%1;
      const t=path.getTangentAt(ahead,car.tangent),next=path.getTangentAt((ahead+.004)%1,car.nextTangent);
      const curvature=Math.atan2(t.z*next.x-t.x*next.z,t.x*next.x+t.z*next.z)/(.004*length);
      const cornerSpeed=Math.sqrt((car.cornerAcceleration||1.7)/Math.max(.001,Math.abs(curvature)));
      const brakingSpeed=Math.max(0,Math.sqrt(3*room+2.25)-1.5);
      const target=Math.min(cruise,cornerSpeed,brakingSpeed,Math.max(0,(gap-clearance)/(car.headway||1.4)));
      const desiredAcceleration=Math.max(-2.4,Math.min(car.maxAcceleration||1.8,(target-car.speed)/.65));
      const change=2.2*step;
      car.acceleration+=Math.max(-change,Math.min(change,desiredAcceleration-car.acceleration));
      const speed=Math.max(0,Math.min(cruise,car.speed+car.acceleration*step));
      const travel=Math.min(room,(car.speed+speed)*.5*step);
      car.speed=room<.002?0:speed;if(room<.002)car.acceleration=0;
      car.phase=(car.phase+travel/length)%1;car.wheelAngle+=travel/(car.wheelRadius||.345);
      path.getTangentAt(car.phase,t);path.getTangentAt((car.phase+.003)%1,next);
      const localCurvature=Math.atan2(t.z*next.x-t.x*next.z,t.x*next.x+t.z*next.z)/(.003*length);
      const desired=Math.max(-.5,Math.min(.5,Math.atan((car.wheelbase||2.86)*localCurvature)));
      car.steering+=(desired-car.steering)*(1-Math.exp(-step*9));
      const heading=Math.atan2(t.x,t.z),delta=Math.atan2(Math.sin(heading-car.heading),Math.cos(heading-car.heading));
      car.heading+=delta*(1-Math.exp(-step*14));
    });
  }
  // Render between fixed simulation ticks, including on 144 Hz displays.
  // Less than one step of prediction avoids repeated poses without catching up
  // an entire slow frame or changing the deterministic traffic state.
  for(const car of city.cars){
    const distance=car.speed*city.trafficRemainder;
    car.renderPhase=(car.phase+distance/city.pathLengths[car.lane])%1;
    car.renderWheelAngle=car.wheelAngle+distance/(car.wheelRadius||.345);
  }
}
