const skins=['#bb8765','#724b36','#e0b593','#99613e','#d29b76','#513729'];
const shirts=['#386b7b','#a75f4d','#d3bf8b','#69775c','#8483a1','#d3d4cc','#335a64','#ad8555'];
const pants=['#283843','#3d4141','#65574b','#34464d','#515568'];
const hairs=['#291e19','#493024','#806144','#181b1d','#aaaa9d'];
export function personLook(i){return {skinColor:skins[i%skins.length],shirtColor:shirts[i%shirts.length],trouserColor:pants[(i*3)%pants.length],hairColor:hairs[(i*7)%hairs.length],longHair:i%3===1};}
export const personColorKey=name=>({'Person skin':'skinColor','Person shirt':'shirtColor','Person trousers':'trouserColor','Person hair':'hairColor'})[name];

export function buildPedestrians(city,values){
  city.pedestrianTime=0;
  // Two people per path, on a sidewalk segment that never crosses traffic.
  city.pedestrians=values.map((v,i)=>{
    const pair=Math.floor(i/2),side=pair%2?1:-1,street=pair%4<2;
    const block=Math.floor(pair/4),along=[-city.rx-14,0,city.rx+14][block%3],outer=block>=3?28:0;
    const center=street?[along,-.09,side*(city.rz+5.65+outer)]:[side*(city.rx+5.65+outer),-.09,along];
    const start=-6.4,end=6.4;
    return {look:v,center,street,start,end,pair,partner:i%2,offset:pair*2.37,state:'walking'};
  });
}

export function pedestrianPoses(city,dt,reduced=false){
  if(!reduced)city.pedestrianTime+=dt;
  return city.pedestrians.map((p,i)=>{
    const total=city.pedestrianTime+p.offset,clock=total%38,partner=(p.partner+Math.floor(total/38))%2;
    // Approach from opposite ends, pause to face/gesture, then continue apart.
    const facing=partner?-1:1;let at,walk,heading;
    if(clock<14){at=partner?p.end-clock*.42:p.start+clock*.42;walk=1;heading=facing;p.state='walking';}
    else if(clock<24){at=partner?.52:-.52;walk=0;heading=facing;p.state='conversation';}
    else{const travel=(clock-24)*(p.end+.52)/14;at=partner?.52-travel:-.52+travel;walk=1;heading=facing;p.state='walking';}
    // Small U-turns take place at path ends; no walking through road junctions.
    const [x,y,z]=p.center;
    const lane=walk?(partner?.28:-.28):0;
    p.lateral??=lane;const sidestep=(lane-p.lateral)*(1-Math.exp(-dt*3));p.lateral+=Math.max(-dt*.45,Math.min(dt*.45,sidestep));
    const position=p.street?[x+at,y,z+p.lateral]:[x+p.lateral,y,z+at];
    p.walkBlend??=walk;p.walkBlend+=(walk-p.walkBlend)*(1-Math.exp(-dt*8));
    const gait=!reduced?Math.sin(city.pedestrianTime*6.3+i*.25)*.28*p.walkBlend:0;
    const talking=!walk&&!reduced;
    const desired=p.street?heading*Math.PI/2:(heading>0?0:Math.PI);
    p.heading??=desired;p.heading+=Math.atan2(Math.sin(desired-p.heading),Math.cos(desired-p.heading))*(1-Math.exp(-dt*7));
    return {...p.look,position,grounded:true,rotation:p.heading,
      limbs:{LegL:gait,LegR:-gait,ArmL:-gait*.7+(talking?-.40+Math.sin(clock*2.4)*.12:0),ArmR:gait*.7},gesture:talking?.16+Math.sin(clock*1.7)*.07:0};
  });
}
