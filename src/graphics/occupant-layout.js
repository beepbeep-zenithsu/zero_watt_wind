/** Reserve a corner workstation before filling the waiting area with seats. */
export function occupantLayout(width, depth, count=30) {
  const desk={x:-width/2+1.10,z:-depth/2+.85};
  const operator={x:desk.x,z:desk.z+.95,rotation:Math.PI,role:'computer-operator'};
  const reserved={minX:desk.x-.95,maxX:desk.x+1.10,minZ:desk.z-.65,maxZ:desk.z+1.45};
  const cols=Math.max(7,Math.floor((width-1.2)/.8)+1),rows=Math.max(5,Math.floor((depth-2.1)/.95)+1);
  const candidates=[];
  for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
    const x=-width/2+.6+col*(width-1.2)/(cols-1),z=-depth/2+.7+row*(depth-2.1)/(rows-1);
    // Include the chair back, seated body and forward shoe projection.
    if(x+.34>reserved.minX&&x-.34<reserved.maxX&&z+.62>reserved.minZ&&z-.30<reserved.maxZ)continue;
    candidates.push({x,z,rotation:0,role:'waiting-seat'});
  }
  const seats=[operator];
  // Spread low occupancy across the room; increasing occupancy only adds seats.
  while(seats.length<count&&candidates.length){
    let best=0,score=-1;
    candidates.forEach((p,i)=>{
      const distance=Math.min(...seats.map(q=>(p.x-q.x)**2+(p.z-q.z)**2));
      if(distance>score){score=distance;best=i;}
    });
    seats.push(candidates.splice(best,1)[0]);
  }
  if(seats.length<count)throw Error('Room cannot accommodate the configured occupant seats');
  return {desk,reserved,seats:seats.slice(0,count)};
}
