/** Metres/seconds, stable substeps, shared by both ventilation modes and pond. */
export const TRAFFIC_CRUISE=Object.freeze({car:8.4,wetCar:4.8,stormCar:1.8,bicycle:5,wetBicycle:2.8,stormBicycle:1.4});
const SIGNALS=[['green','red'],['amber','red'],['red','red'],['red','green'],['red','amber']];
export function signalOffset(junction){
  if(!junction)return 0;if(typeof junction==='object')return junction.offset||0;
  const [x,z]=junction.split(':').map(Number);return (x+z)%2*20;
}
export function signalState(time,junction){
  const t=(((time+signalOffset(junction))%40)+40)%40;
  if(t<11)return SIGNALS[0];if(t<14)return SIGNALS[1];if(t<15)return SIGNALS[2];
  if(t<26)return SIGNALS[3];if(t<29)return SIGNALS[4];return SIGNALS[2];
}

// A dedicated nine-second walk phase clears turning traffic before people cross.
export function pedestrianSignal(time,junction){const t=(((time+signalOffset(junction))%40)+40)%40;return t>=30&&t<39?39-t:0;}

export function trafficSignal(network,time,junction){
  const id=typeof junction==='string'?junction:junction?.id,owner=network.owners.get(id);
  if((network.walkUntil.get(id)||0)>time||(network.clearUntil.get(id)||0)>time||(!owner&&network.pedestrianPriority.has(id)))return SIGNALS[2];
  if(owner){
    const elapsed=time-owner.started;
    return elapsed<8?SIGNALS[owner.axis?3:0]:elapsed<10?SIGNALS[owner.axis?4:1]:SIGNALS[2];
  }
  return signalState(time,junction);
}

const members=owner=>owner?.members||[];
function owns(owner,car){return members(owner).some(claim=>claim.car===car);}
function compatible(controller,car,line,owner){
  return members(owner).every(claim=>{
    if(claim.car===car)return true;
    const a=line.entryDirection,b=claim.line.entryDirection,c=line.exitDirection,d=claim.line.exitDirection;
    const entry=a.x*b.x+a.z*b.z,exit=c.x*d.x+c.z*d.z;
    return (entry>.995&&exit>.995)||(entry<-.995&&a.x*c.x+a.z*c.z>.995&&b.x*d.x+b.z*d.z>.995);
  });
}

function exitClear(controller,car,line){
  if(!line.exit)return true;
  const positions=controller.trafficPositions,directions=controller.trafficDirections;
  const tx=line.exitDirection.x,tz=line.exitDirection.z,halfLength=car.clearance?1.05:2.5,halfWidth=car.clearance?.36:.98;
  for(let i=0;i<controller.cars.length;i++){
    const other=controller.cars[i];if(other===car)continue;
    const dx=positions[i*2]-line.exit.x,dz=positions[i*2+1]-line.exit.z;
    const ox=directions[i*2],oz=directions[i*2+1],length=other.clearance?1.05:2.5,width=other.clearance?.36:.98;
    const dot=Math.abs(tx*ox+tz*oz),cross=Math.abs(tx*oz-tz*ox);
    // Test the actual lane corridor, not a large circle that also covers the
    // oncoming lane and can make two otherwise clear exits wait forever.
    if(Math.abs(dx*tx+dz*tz)<halfLength+length*dot+width*cross+.65&&
      Math.abs(dx*tz-dz*tx)<halfWidth+width*dot+length*cross+.10)return false;
  }
  return true;
}

// Test the next physical pose, including the outside of a turning bumper.
// Reservations control right of way; this final gate also protects queue tails
// shared by different routes and the separate car/cycle simulation passes.
function poseClear(city,car,x,z,tx,tz){
  const length=car.clearance?1.05:2.5,width=car.clearance?.36:.98;
  for(const controller of city.network?.controllers||[city]){
    const padding=controller===city?.12:.32;
    for(let i=0;i<controller.cars.length;i++){
      const other=controller.cars[i];if(other===car)continue;
      const dx=controller.trafficPositions[i*2]-x,dz=controller.trafficPositions[i*2+1]-z;
      const ol=other.clearance?1.05:2.5,ow=other.clearance?.36:.98;
      if(Math.abs(dx)>length+width+ol+ow+padding||Math.abs(dz)>length+width+ol+ow+padding)continue;
      const ox=controller.trafficHeadings[i*2],oz=controller.trafficHeadings[i*2+1];
      let separate=false;
      for(let axis=0;axis<4;axis++){
        const ax=axis===0?tx:axis===1?-tz:axis===2?ox:-oz;
        const az=axis===0?tz:axis===1?tx:axis===2?oz:ox;
        const a=Math.abs(ax*tx+az*tz)*length+Math.abs(-ax*tz+az*tx)*width;
        const b=Math.abs(ax*ox+az*oz)*ol+Math.abs(-ax*oz+az*ox)*ow;
        if(Math.abs(dx*ax+dz*az)>=a+b+padding){separate=true;break;}
      }
      if(!separate)return false;
    }
  }
  return true;
}

export function prepareTraffic(city){
  if(city.network&&!city.network.controllers.includes(city))city.network.controllers.push(city);
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
  city.stops.forEach((stops,i)=>{for(const line of stops)if(line.junction){
    // Locate the first safe landing after THIS junction. A fixed 19 m
    // lookahead overshot tight turns into the next red-light queue, creating
    // circular waits even though the actual junction exit had enough room.
    let phase=line.phase;
    for(let metres=.25;metres<60;metres+=.25){
      phase=(line.phase+metres/city.pathLengths[i])%1;
      const p=city.paths[i].getPointAt(phase);
      if(Math.abs(p.x-line.junction.x)>9.65||Math.abs(p.z-line.junction.z)>9.65)break;
    }
    line.exit=city.paths[i].getPointAt(phase);line.exitDirection=city.paths[i].getTangentAt(phase);
    line.entryDirection=city.paths[i].getTangentAt(line.phase);
    line.entryPoint=city.paths[i].getPointAt(line.phase);
  }});
  city.trafficRemainder=0;city.trafficPhases=new Float64Array(city.cars.length);
  city.trafficPositions=new Float64Array(city.cars.length*2);city.trafficDirections=new Float64Array(city.cars.length*2);
  city.trafficHeadings=new Float64Array(city.cars.length*2);
  city.cars.forEach(c=>{
    c.speed=0;c.acceleration=0;c.wheelAngle=0;c.steering=0;c.stationaryFor=0;
    c.renderPhase=c.phase;c.renderWheelAngle=0;
    c.tangent=city.paths[c.lane].getTangentAt(c.phase);c.nextTangent=c.tangent.clone();
    c.heading=Math.atan2(c.tangent.x,c.tangent.z);
  });
}

export function advanceTraffic(city,dt,cruise,allowed){
  const step=1/120;
  // Avoid a catch-up spiral after a background tab or a slow frame.
  city.trafficRemainder+=Math.max(0,Math.min(dt,.12));
  if(city.network)for(const controller of city.network.controllers)if(controller!==city){
    controller.cars.forEach((c,i)=>{
      const p=controller.paths[c.lane].getPointAt(c.phase,c.tangent);
      controller.trafficPositions[i*2]=p.x;controller.trafficPositions[i*2+1]=p.z;
      controller.trafficHeadings[i*2]=Math.sin(c.heading);controller.trafficHeadings[i*2+1]=Math.cos(c.heading);
    });
  }
  while(city.trafficRemainder+1e-9>=step){
    city.trafficRemainder=Math.max(0,city.trafficRemainder-step);
    const phases=city.trafficPhases;
    city.cars.forEach((c,i)=>{
      phases[i]=c.phase;
      const p=city.paths[c.lane].getPointAt(c.phase,c.tangent),t=city.paths[c.lane].getTangentAt(c.phase,c.nextTangent);
      city.trafficPositions[i*2]=p.x;city.trafficPositions[i*2+1]=p.z;
      city.trafficDirections[i*2]=t.x;city.trafficDirections[i*2+1]=t.z;
      city.trafficHeadings[i*2]=Math.sin(c.heading);city.trafficHeadings[i*2+1]=Math.cos(c.heading);
    });
    // Reserve the junction core; the physical gate also protects its exits.
    // Releasing beyond the core avoids circular queues between short blocks.
    if(city.network)for(const [id,owner] of city.network.owners){
      for(let n=owner.members.length-1;n>=0;n--){
        const claim=owner.members[n];if(claim.controller!==city)continue;
        const index=city.cars.indexOf(claim.car);
        if(index<0){owner.members.splice(n,1);continue;}
        const x=city.trafficPositions[index*2],z=city.trafficPositions[index*2+1],j=claim.line.junction;
        const inside=Math.abs(x-j.x)<5.8&&Math.abs(z-j.z)<5.8;
        const distance=(claim.line.phase-claim.car.phase+1)%1*city.pathLengths[claim.car.lane];
        const standOff=claim.car.standOff||3.3;
        claim.committed ||= distance<standOff-.03||(claim.car.phase-claim.line.phase+1)%1*city.pathLengths[claim.car.lane]<20;
        claim.wasInside ||= inside;
        // Once its bumper has crossed the stop boundary, a vehicle must clear
        // the junction even if the signal changes. Releasing at red while its
        // centre was still behind the line stranded cars in turning traffic.
        if((claim.wasInside&&!inside)||(!claim.committed&&!allowed(claim.line.axis,claim.car,distance,claim.line)))owner.members.splice(n,1);
      }
      if(!owner.members.length){city.network.owners.delete(id);city.network.clearUntil.set(id,(city.network.time||0)+.35);}
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
          const owners=city.network.owners,id=line.junction.id,owner=owners.get(id),owned=owns(owner,car);
          const committed=members(owner).some(claim=>claim.car===car&&claim.committed),now=city.network.time||0;
          const protectedCrossing=city.network.crossings.has(id)||(city.network.walkUntil.get(id)||0)>now||(city.network.clearUntil.get(id)||0)>now||(!owner&&city.network.pedestrianPriority.has(id));
          if(committed)permitted=true;
          else if(!owner&&car.stationaryFor>=35&&!protectedCrossing)permitted=true;
          const requests=city.network.requests;
          if(distance<4.8&&!owned){
            if(!requests.has(id))requests.set(id,new Map());
            if(!requests.get(id).has(car))requests.get(id).set(car,{car,controller:city,line,order:city.network.ticket++});
          }
          if(protectedCrossing&&!committed)permitted=false;
          if(permitted&&!owned&&distance<4.8){
            let claimed=false;for(const held of owners.values())if(owns(held,car)){claimed=true;break;}
            if(!claimed){
              if(!requests.has(id))requests.set(id,new Map());
              const waiting=requests.get(id);
              if(!waiting.has(car))waiting.set(car,{car,controller:city,line,order:city.network.ticket++});
              let first=null;
              for(const [user,request] of waiting){
                const d=(request.line.phase-user.phase+1)%1*request.controller.pathLengths[user.lane];
                if(d>12){waiting.delete(user);continue;}
                const aged=!owner&&user.stationaryFor>=35&&!protectedCrossing;
                const exitReady=exitClear(request.controller,user,request.line)||user.stationaryFor>=12;
                if(d<4.8&&(allowed(request.line.axis,user,d,request.line)||aged)&&compatible(request.controller,user,request.line,owner)&&exitReady&&(!first||request.order<first.order))first=request;
              }
              if(first?.car===car){
                const group=owner||{members:[],axis:line.axis,started:now};
                group.members.push({car,controller:city,line,committed:false,wasInside:false});owners.set(id,group);waiting.delete(car);
              }
              else permitted=false;
            }else permitted=false;
          }
          if(owners.has(id)&&!owns(owners.get(id),car)&&!compatible(city,car,line,owners.get(id)))permitted=false;
        }
        if(!permitted)stop=Math.min(stop,distance);
      }
      const clearance=car.clearance||5.7,standOff=car.standOff||3.3;
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
      let travel=Math.min(room,(car.speed+speed)*.5*step),nextHeading=car.heading;
      const safe=distance=>{
        path.getTangentAt((car.phase+distance/length)%1,t);
        const targetHeading=Math.atan2(t.x,t.z),delta=Math.atan2(Math.sin(targetHeading-car.heading),Math.cos(targetHeading-car.heading));
        nextHeading=car.heading+(distance>.000001?delta*(1-Math.exp(-step*14)):0);
        const p=path.getPointAt((car.phase+distance/length)%1,next);
        return poseClear(city,car,p.x,p.z,Math.sin(nextHeading),Math.cos(nextHeading));
      };
      if(travel>0&&!safe(travel)){
        let low=0,high=travel;
        for(let n=0;n<7;n++){const mid=(low+high)/2;if(safe(mid))low=mid;else high=mid;}
        travel=low;car.acceleration=0;
      }
      safe(travel);
      car.speed=travel<.00001?0:Math.min(speed,travel/step);if(room<.002)car.acceleration=0;
      car.phase=(car.phase+travel/length)%1;car.wheelAngle+=travel/(car.wheelRadius||.345);
      car.stationaryFor=travel>.00001?0:car.stationaryFor+step;
      path.getTangentAt(car.phase,t);path.getTangentAt((car.phase+.003)%1,next);
      const localCurvature=Math.atan2(t.z*next.x-t.x*next.z,t.x*next.x+t.z*next.z)/(.003*length);
      const desired=Math.max(-.5,Math.min(.5,Math.atan((car.wheelbase||2.86)*localCurvature)));
      car.steering+=(desired-car.steering)*(1-Math.exp(-step*9));
      car.heading=nextHeading;
      const position=path.getPointAt(car.phase,next);
      city.trafficPositions[index*2]=position.x;city.trafficPositions[index*2+1]=position.z;
      city.trafficHeadings[index*2]=Math.sin(car.heading);city.trafficHeadings[index*2+1]=Math.cos(car.heading);
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
