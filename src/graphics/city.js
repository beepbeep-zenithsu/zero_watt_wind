import * as T from '../../vendor/three.module.js';
import {addAssetInstances} from './assets.js';
import {prepareTraffic,advanceTraffic,signalState,TRAFFIC_CRUISE} from './traffic.js';
import {personLook,buildPedestrians,pedestrianPoses} from './people.js';
import {attachTrafficFleet,placeFleetCar,flushTrafficFleet} from '../cars/traffic-fleet.js';
import {roadNetwork,seedRoadUsers} from './road-network.js';
import {buildCyclists,updateCyclists} from './cyclists.js';
import {buildMobilityShadows,updateMobilityShadows} from './mobility-shadows.js';

const ROAD=9.6,SIDEWALK=1.65;
const carColors=['#4c7c92','#ddd4bd','#9d4e3e','#596b55','#b4bdc0','#d6ae53'];
const facadePalette=['#8c8b80','#c4b49c','#9c7761','#777f83','#68766f','#aa8b78','#79888e','#b7b1a3'];
function boxes(parent,name,values,material){
  const mesh=new T.InstancedMesh(new T.BoxGeometry(1,1,1),material,values.length),p=new T.Object3D();
  mesh.name=name;mesh.receiveShadow=true;
  values.forEach(([x,y,z,w,h,d],i)=>{p.position.set(x,y,z);p.scale.set(w,h,d);p.updateMatrix();mesh.setMatrixAt(i,p.matrix);});
  parent.add(mesh);return mesh;
}

/** Layout follows the installation footprint, including the largest pond/roof. */
export function buildCity(s){
  const air=s.mode==='air',W=air?s.roomW:s.pondL,D=air?s.roomD:s.pondW,zc=air?0:s.pondZc;
  const root=new T.Group();root.name='Blender neighborhood';root.position.z=zc;s.shell.add(root);
  const hx=W/2+10.3,hz=D/2+10.3,rx=hx+ROAD/2,rz=hz+ROAD/2;
  const xs=[-rx-28,-rx,rx,rx+28],zs=[-rz-28,-rz,rz,rz+28];
  const city=s.city={root,hx,hz,rx,rz,zc,batches:[],cars:[],lighting:null,signalPhase:null};
  city.network=roadNetwork(xs,zs);
  city.motionBounds=new T.Box3(new T.Vector3(xs[0]-8,-1,zs[0]-8),new T.Vector3(xs[3]+8,5,zs[3]+8));
  root.userData.parcel={width:W,depth:D,hx,hz,rx,rz};
  const road=s.mat('#353d40',.95,0),curb=s.mat('#b4b9b6',.9,0),paving=s.mat('#a6aba9',.93,0);
  road.normalMap=paving.normalMap=s.surfaceNormal||null;road.normalScale.set(.14,.14);paving.normalScale.set(.09,.09);
  city.roadMaterial=road;
  const blockPaving=s.mat('#919b95',.95,0),paint=s.mat('#e1e3d6',.85,0),yellow=s.mat('#c7b776',.9,0);
  s.box(230,.08,230,s.mat('#8c9591',.98,0),root,0,-.30,0).name='Continuous city ground';
  const roads=[],walks=[],curbs=[],dashes=[],centerLines=[],crossings=[],plaza=[];
  const limitX=rx+49,limitZ=rz+49;
  for(const x of xs)roads.push([x,-.215,0,ROAD,.06,limitZ*2]);
  for(const z of zs)roads.push([0,-.210,z,limitX*2,.06,ROAD]);
  // Sidewalks and curb stones stop at intersections, leaving connected roads.
  for(const x of xs)for(let j=0;j<=zs.length;j++){
    const a=j===0?-limitZ:zs[j-1]+ROAD/2,b=j===zs.length?limitZ:zs[j]-ROAD/2;
    for(const side of [-1,1]){
      walks.push([x+side*(ROAD/2+SIDEWALK/2),-.15,(a+b)/2,SIDEWALK,.12,b-a]);
      curbs.push([x+side*(ROAD/2+.08),-.09,(a+b)/2,.16,.17,b-a]);
    }
    for(let z=a+1;z<b-1;z+=3.3)for(const side of [-1,1])dashes.push([x+side*2.35,-.171,z,.065,.008,1.3]);
    for(const side of [-1,1])centerLines.push([x+side*.13,-.170,(a+b)/2,.035,.008,b-a]);
  }
  for(const z of zs)for(let j=0;j<=xs.length;j++){
    const a=j===0?-limitX:xs[j-1]+ROAD/2,b=j===xs.length?limitX:xs[j]-ROAD/2;
    for(const side of [-1,1]){
      walks.push([(a+b)/2,-.15,z+side*(ROAD/2+SIDEWALK/2),b-a,.12,SIDEWALK]);
      curbs.push([(a+b)/2,-.09,z+side*(ROAD/2+.08),b-a,.17,.16]);
    }
    for(let x=a+1;x<b-1;x+=3.3)for(const side of [-1,1])dashes.push([x,-.166,z+side*2.35,1.3,.008,.065]);
    for(const side of [-1,1])centerLines.push([(a+b)/2,-.165,z+side*.13,b-a,.008,.035]);
  }
  for(const x of xs)for(const z of zs)for(const side of [-1,1])for(let k=-5;k<=5;k++){
    crossings.push([x+side*(ROAD/2+.90),-.162,z+k*.66,1.55,.010,.32]);
    crossings.push([x+k*.66,-.161,z+side*(ROAD/2+.90),.32,.010,1.55]);
  }
  const cell=air?1.25:1.8;
  for(let x=-hx+cell/2;x<hx;x+=cell)for(let z=-hz+cell/2;z<hz;z+=cell)plaza.push([x,-.20,z,cell-.025,.08,cell-.025]);
  boxes(root,'Connected city streets',roads,road);
  boxes(root,'Continuous city sidewalks',walks,paving);
  boxes(root,'Intersection curb stones',curbs,curb);
  boxes(root,'Street lane markings',dashes,paint);
  boxes(root,'Road center lines',centerLines,yellow);
  boxes(root,'Pedestrian zebra crossings',crossings,paint);
  boxes(root,'Civic plaza paving',plaza,paving);
  // Terracotta cycle promenade and limestone edges frame the civic parcel.
  const promenade=[],promenadeEdges=[];
  for(const side of [-1,1]){
    promenade.push([side*(hx-.86),-.150,0,1.35,.018,2*hz-1.7]);
    promenade.push([0,-.149,side*(hz-.86),2*hx-1.7,.018,1.35]);
    promenadeEdges.push([side*(hx-1.60),-.145,0,.075,.025,2*hz-1.7]);
    promenadeEdges.push([0,-.144,side*(hz-1.60),2*hx-1.7,.025,.075]);
  }
  boxes(root,'Civic cycle promenade',promenade,s.mat('#92796c',.95,0));
  boxes(root,'Limestone promenade edging',promenadeEdges,s.mat('#cec4ac',.94,0));

  const poses=new Map();let buildingIndex=0,personIndex=0;
  const put=(name,position,rotation=0,scale=1,color)=>{
    if(/apartment|tower|shopfront|distant-block|skyline/.test(name)){
      const i=buildingIndex++;color=new T.Color(facadePalette[i%facadePalette.length]).offsetHSL((i%7-3)*.003,0,(Math.floor(i/8)%17-8)*.006).getStyle();
    }
    const look=name==='site-pedestrian'?personLook(personIndex++):{};
    if(!poses.has(name))poses.set(name,[]);poses.get(name).push({position,rotation,scale,color,grounded:!name.startsWith('site-city-'),...look});
  };
  const lots=[],courtyards=[];
  const planters=[];
  for(const x of [-hx+3.6,hx-3.6])for(const z of [-hz+3.6,hz-3.6]){
    planters.push([x,-.13,z,3.5,.18,2.6]);put('tree',[x,-.05,z],0,[.92,1.1,.92]);
    put('site-bench',[x,-.15,z+2.1]);put('site-street-bin',[x+1.4,-.15,z+2.1]);
  }
  boxes(root,'Raised civic garden beds',planters,s.mat('#546947',.99,0));
  for(let ix=0;ix<3;ix++)for(let iz=0;iz<3;iz++){
    if(ix===1&&iz===1)continue;
    const x=(xs[ix]+xs[ix+1])/2,z=(zs[iz]+zs[iz+1])/2;
    const dx=(xs[ix+1]-xs[ix])/2-9.5,dz=(zs[iz+1]-zs[iz])/2-9.5;
    lots.push([x,-.215,z,xs[ix+1]-xs[ix]-ROAD-.3,.08,zs[iz+1]-zs[iz]-ROAD-.3]);
    const facing=iz===0?0:iz===2?Math.PI:ix===0?Math.PI/2:-Math.PI/2;
    for(let a=0;a<2;a++)for(let b=0;b<2;b++){
      const n=ix*11+iz*7+a*3+b,bx=x+(a?dx:-dx),bz=z+(b?dz:-dz);
      const kind=n%7===0?'site-canyon-tower':n%4===0?'site-shopfront':`site-apartment-${['low','mid','tall'][n%3]}`;
      const scale=kind==='site-canyon-tower'?1:kind==='site-shopfront'?1:[1.45,2.0+(n%3)*.12,1.45];
      put(kind,[bx,-.16,bz],facing,scale);
    }
    // The internal courtyards have trees and furniture instead of bare terrain.
    const gardenW=Math.min(5,dx*2-7),gardenD=Math.min(5,dz*2-7);
    courtyards.push([x,-.11,z,gardenW,.13,gardenD]);
    put('tree',[x,-.045,z],0,[.65,1.3,.65]);
    put('site-bench',[x,-.175,z+gardenD/2+.7]);
    put('site-street-bin',[x,-.175,z-gardenD/2-.7]);
  }
  boxes(root,'Paved city blocks',lots,blockPaving);
  boxes(root,'Residential courtyard gardens',courtyards,s.mat('#647b56',.98,0));
  // A lower-detail outer skyline closes all four views, rather than a single backdrop.
  for(let i=-5;i<=5;i++)for(const side of [-1,1]){
    const spread=i*10;
    const kind=['site-distant-block','site-skyline-glass','site-skyline-brick'][(i+6)%3];
    put(kind,[spread,-.25,side*(rz+49+(i%2)*7)],side<0?0:Math.PI,[1.12,.88+(Math.abs(i)*7%5)*.10,1.05]);
    put(kind,[side*(rx+49+(i%2)*6),-.25,spread],-side*Math.PI/2,[1.1,.92+(Math.abs(i)*5%4)*.10,1.05]);
  }
  if(!s.compactGraphics)for(let i=-5;i<=5;i++)for(const side of [-1,1]){
    const kind=['site-skyline-brick','site-distant-block','site-skyline-glass'][(i+6)%3];
    put(kind,[i*13+5,-.25,side*(rz+73)],0,[1.6,1.10+(i*i%5)*.10,1.6]);
    put(kind,[side*(rx+73),-.25,i*13+5],Math.PI/2,[1.6,1.05+(i*i%6)*.08,1.6]);
  }
  // Pavement details repeat in batches, keeping the district affordable to render.
  const signalPoses=[[],[]];
  for(const x of xs)for(const z of zs){
    for(const sx of [-1,1])for(const sz of [-1,1]){
      const px=x+sx*(ROAD/2+.65),pz=z+sz*(ROAD/2+.65);
      put('site-street-lamp',[px,-.09,pz],Math.atan2(-sx,-sz));
      signalPoses[sx===sz?0:1].push({position:[px,-.09,pz],rotation:sx===sz?(sz>0?Math.PI:0):(sx>0?-Math.PI/2:Math.PI/2)});
      if(Math.abs(x)===rx&&Math.abs(z)===rz)put('site-pedestrian',[px+sx*.75,-.09,pz+sz*.65],Math.atan2(-sx,-sz),.92+(sx+sz+2)*.025);
    }
  }
  for(const side of [-1,1]){
    const z=side*(rz-ROAD/2-.9),x=side*(rx-ROAD/2-.9);
    for(let i=-1;i<=1;i++){
      put('site-street-lamp',[i*8,-.09,z],side>0?Math.PI:0);
      put('site-street-lamp',[x,-.09,i*7],-side*Math.PI/2);
    }
    put('site-bus-shelter',[side*4,-.10,side*(rz+ROAD/2+1)],side<0?0:Math.PI);
    put('site-hydrant',[side*(rx+ROAD/2+.8),-.08,3]);
    put('site-street-bin',[side*7,-.09,side*(rz+ROAD/2+.85)]);
    put('site-cycle-rack',[side*(W/2+3.9),-.16,air?D/2+2:0],0);
    for(let i=0;i<3;i++)put('site-bicycle',[side*(W/2+3.9),-.16,(air?D/2+2:0)-.7+i*.7],side>0?0:Math.PI);
    // No parked cars: every vehicle in the district is moving traffic (see city.cars below).
    for(let i=0;i<3;i++)put('site-pedestrian',[side*(rx+ROAD/2+1),-.09,(i-1)*7],side>0?-Math.PI/2:Math.PI/2);
    put('site-pedestrian',[side*4+.65,-.09,side*(rz+ROAD/2+.8)],side<0?0:Math.PI);
    put('site-pedestrian',[side*4-.65,-.09,side*(rz+ROAD/2+.8)],side<0?0:Math.PI);
  }
  poses.set('site-pedestrian',Array.from({length:80},(_,i)=>({...personLook(i),position:[0,-.09,0],scale:.94+(i%4)*.025})));
  for(const [name,values] of poses){
    const batch=addAssetInstances(root,name,values,{lighting:true,surfaceNormal:s.surfaceNormal,motionBounds:name==='site-pedestrian'?city.motionBounds:null});city.batches.push(batch);
    if(name==='site-pedestrian'){city.walkers=batch;buildPedestrians(city,values);}
    if(name.startsWith('site-apartment')||name==='site-shopfront'||name==='site-canyon-tower'||name==='site-distant-block'||name.startsWith('site-skyline'))batch.userData.cityBuildings=true;
  }
  city.signals=signalPoses.map(values=>addAssetInstances(root,'site-traffic-signal',values,{lighting:true}));
  city.paths=city.network.paths;
  city.cars=seedRoadUsers(city.paths,city.paths.map(()=>3),i=>({kind:i%2,color:carColors[i%6]}));
  prepareTraffic(city);
  city.traffic=addAssetInstances(root,'site-city-sedan',city.cars.filter(c=>c.kind===0).map(()=>({position:[0,-.18,0]})),{lighting:true});
  city.crossovers=addAssetInstances(root,'site-city-crossover',city.cars.filter(c=>c.kind===1).map(()=>({position:[0,-.18,0]})),{lighting:true});
  city.batches.push(city.traffic,city.crossovers);
  buildCyclists(city);
  attachTrafficFleet(city);
  buildMobilityShadows(city);
  city.lights=[];
  for(const [x,z] of [[-rx,rz],[rx,-rz],[-rx,-rz],[rx,rz]]){
    const light=new T.PointLight('#ffe0ae',0,13,2);light.position.set(x,4.6,z);root.add(light);city.lights.push(light);
  }
  updateCity(s,0);
}

export function updateCity(s,dt){
  const city=s.city;if(!city||city.root.userData.retired)return;
  city.simulationTime=s.time||0;
  const signals=signalState(s.time||0);city.signalState=signals;
  const speed=s.storm?TRAFFIC_CRUISE.stormCar:s.rainAmt>.1?TRAFFIC_CRUISE.wetCar:TRAFFIC_CRUISE.car;
  if(!s.reducedMotion)advanceTraffic(city,dt,speed,(axis,car,distance)=>signals[axis]==='green'||(signals[axis]==='amber'&&distance<2.4+car.speed*car.speed/5.2));
  city.fleet.lamps.visible=!!s.night;
  const needsFallback=city.cars.some(c=>!c.model);
  const poses=needsFallback?[]:null;
  const point=city.carPoint ||= new T.Vector3();
  for(const car of city.cars){
    const path=city.paths[car.lane];
    const p=path.getPointAt(car.renderPhase??car.phase,point);
    const yaw=car.heading,premium=placeFleetCar(car,p.x,p.z,yaw);
    // A car whose premium model is loaded hides its original instance (scale ~0) but keeps the same path and physics.
    if(poses)poses.push({position:[p.x,-.18,p.z],rotation:yaw,color:car.color,wheelAngle:car.renderWheelAngle??car.wheelAngle,steering:car.steering,scale:premium?.00001:1});
  }
  if(poses){city.traffic.setPoses(poses.filter((_,i)=>city.cars[i].kind===0));city.crossovers.setPoses(poses.filter((_,i)=>city.cars[i].kind===1));}
  city.traffic.visible=city.cars.some(c=>c.kind===0&&!c.model);
  city.crossovers.visible=city.cars.some(c=>c.kind===1&&!c.model);
  flushTrafficFleet(city,s.camera);
  updateCyclists(city,dt,signals,s.reducedMotion,s.rainAmt>.1,s.storm);
  city.walkers.setPoses(pedestrianPoses(city,dt,s.reducedMotion));
  updateMobilityShadows(city);
  city.roadMaterial.roughness=.95-.76*(s.rainAmt||0);
  for(const batch of city.batches)for(const material of batch.userData.glowMaterials){
    material.emissiveIntensity=s.night?(material.userData.cityWindow?(material.userData.windowLevel??.20):1.7):.005;
  }
  city.signals.forEach((batch,axis)=>{
    for(const m of batch.userData.glowMaterials){
      const lit=m.name.endsWith(signals[axis]);
      m.userData.signalColor??=m.color.clone();m.color.copy(m.userData.signalColor).multiplyScalar(lit?1:.11);
      m.emissiveIntensity=lit?3:.005;
    }
  });
  city.lights.forEach(l=>l.intensity=s.night?15:0);
}
