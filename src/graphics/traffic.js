/** Metres/seconds, stable substeps, shared by both ventilation modes and pond. */
export function signalState(time){
  const t=((time%30)+30)%30;
  if(t<11)return ['green','red'];
  if(t<14)return ['amber','red'];
  if(t<15)return ['red','red'];
  if(t<26)return ['red','green'];
  if(t<29)return ['red','amber'];
  return ['red','red'];
}

export function prepareTraffic(city){
  city.stops=city.paths.map(path=>{
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
  city.cars.forEach(c=>{c.speed=0;c.wheelAngle=0;c.steering=0;});
}

export function advanceTraffic(city,dt,cruise,allowed){
  let remaining=Math.min(dt,.5);
  while(remaining>1e-8){
    const step=Math.min(remaining,1/60);remaining-=step;
    const phases=city.cars.map(c=>c.phase);
    city.cars.forEach((car,index)=>{
      const path=city.paths[car.lane],length=path.getLength();let gap=length,stop=length;
      city.cars.forEach((other,j)=>{if(index!==j&&car.lane===other.lane)gap=Math.min(gap,(phases[j]-phases[index]+1)%1*length);});
      for(const line of city.stops[car.lane]){
        const distance=(line.phase-car.phase+1)%1*length;
        if(!allowed(line.axis,car,distance))stop=Math.min(stop,distance);
      }
      const room=Math.max(0,Math.min(gap-5.7,stop-2.4));
      const target=Math.min(cruise,Math.sqrt(2*2.6*room),Math.max(0,(gap-5.7)/1.1));
      const rate=target>car.speed?1.25:2.8;
      const speed=car.speed+Math.max(-rate*step,Math.min(rate*step,target-car.speed));
      const travel=Math.min(room,(car.speed+speed)*.5*step);
      car.speed=room<.002?0:speed;car.phase=(car.phase+travel/length)%1;
      car.wheelAngle+=travel/.345;
      const t=path.getTangentAt(car.phase),next=path.getTangentAt((car.phase+.003)%1);
      const curvature=Math.atan2(t.z*next.x-t.x*next.z,t.x*next.x+t.z*next.z)/(.003*length);
      const desired=Math.max(-.5,Math.min(.5,Math.atan(2.86*curvature)));
      car.steering+=(desired-car.steering)*(1-Math.exp(-step*9));
    });
  }
}
