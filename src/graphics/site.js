import * as T from '../../vendor/three.module.js';
import {addAsset} from './assets.js';

export function dressArchitecture(s) {
  const {shell:S,mats:m,roomW:W,roomD:D}=s;
  const stone=s.mat('#bebdaf',.93,0), timber=s.mat('#a18a65',.75,0);
  const plaster=s.mat('#d2cfc1',.92,0);plaster.normalMap=s.surfaceNormal||null;plaster.normalScale.set(.12,.12);
  S.getObjectByName('back-wall').material=plaster;
  // Solid knee walls ground the sectioned building; window apertures stay open.
  for(const o of S.children) {
    if(o.isMesh && o.geometry.type==='BoxGeometry' && Math.abs(Math.abs(o.position.x)-W/2)<.01 &&
      o.position.y<1.05 && o.material===m.shellGlass) o.material=plaster;
  }
  // Real tile edges catch the light; one instanced draw covers the entire floor.
  const cols=Math.ceil(W/.8),rows=Math.ceil(D/.8),cw=W/cols,cd=D/rows;
  const floor=s.mat('#bac0b8',.83,0);floor.normalMap=s.surfaceNormal||null;floor.normalScale.set(.10,.10);
  const tiles=new T.InstancedMesh(new T.BoxGeometry(1,1,1),floor,cols*rows),tile=new T.Object3D();
  tiles.name='Architectural floor tiles';tiles.receiveShadow=true;
  for(let i=0;i<cols*rows;i++){
    tile.position.set(-W/2+(i%cols+.5)*cw,.309,-D/2+(Math.floor(i/cols)+.5)*cd);
    tile.scale.set(cw-.018,.018,cd-.018);tile.updateMatrix();tiles.setMatrixAt(i,tile.matrix);
    tiles.setColorAt(i,new T.Color().setScalar(.87+(i*7%9)*.013));
  }
  S.add(tiles);
  // Rear service modules leave the front, moving windows and roof exhausts clear.
  for(const x of [-W/2+.75,W/2-.75]) {
    addAsset(S,'service-wall',[x,0,-D/2+.14]);
  }
  const trim=new T.Group();trim.name='Blender architectural details';S.add(trim);
  for(const side of [-1,1])for(const end of [-1,1])addAsset(trim,'site-corner-pier',[side*W/2,.3,end*D/2]);
  for(const pane of s.panes)addAsset(trim,'site-window-trim',[pane.x,pane.y,pane.zc],[pane.width,1,1],[0,Math.sign(pane.x)*Math.PI/2,0]);
  for(const x of [-W/2+.32,W/2-.32])addAsset(trim,'site-downpipe',[x,0,-D/2],[1,1,1],[0,Math.PI,0]);
  addAsset(trim,'site-entry-canopy',[W/2-1.375,0,D/2+.025]);
  // Roof edge drip caps and joints keep the architecture legible from above.
  const seam=s.mat('#7d827c',.82,.12);
  for(const side of [-1,1]){
    s.box(W+.48,.035,.26,seam,trim,0,3.785,side*D/2);
    s.box(.26,.035,D+.48,seam,trim,side*W/2,3.785,0);
  }
  for(let x=-W/2+.8;x<W/2-.1;x+=1.2)for(const side of [-1,1])s.box(.014,.05,.27,m.dark,trim,x,3.785,side*D/2);
  s.box(W+.7,.10,D+.7,stone,S,0,.02,0);
  for(const side of [-1,1]) {
    s.box(W,.11,.18,timber,S,0,.38,side*D/2);
    // Roof perimeter and parapet are low enough to expose every rotor and gear.
    s.box(W+.35,.14,.15,m.black,S,0,3.7,side*D/2);
    s.box(.15,.14,D+.35,m.black,S,side*W/2,3.7,0);
    s.box(.22,.18,D+.35,m.concrete,S,side*W/2,.27,0);
  }
  // Wall sconces are emissive surfaces, with the existing room light doing illumination.
  for(const x of [-W/2+1.6,W/2-1.6]) {
    const lamp=new T.MeshStandardMaterial({color:'#f3e5c7',emissive:'#e7c68e',emissiveIntensity:.35,roughness:.45});
    s.box(.45,.045,.10,lamp,S,x,3.0,-D/2+.14);
  }
  // A contact shadow beneath the foundation adds depth without another render pass.
  const shadowData=new Uint8Array(64*64*4);
  for(let y=0;y<64;y++)for(let x=0;x<64;x++){
    const edge=Math.max(Math.abs(x/31.5-1),Math.abs(y/31.5-1));
    const alpha=(1-T.MathUtils.smoothstep(edge,.55,1))*.20;
    shadowData.set([25,37,33,Math.round(alpha*255)],(y*64+x)*4);
  }
  const shadow=new T.DataTexture(shadowData,64,64);shadow.needsUpdate=true;
  const shadowMat=new T.MeshBasicMaterial({map:shadow,transparent:true,depthWrite:false});shadowMat.userData.ownedTextures=[shadow];
  const contact=new T.Mesh(new T.PlaneGeometry(W+2,D+2),shadowMat);contact.rotation.x=-Math.PI/2;contact.position.y=-.27;S.add(contact);
}

function seeded(seed) { return () => { seed=(seed*1664525+1013904223)>>>0;return seed/4294967296; }; }

export function dressLandscape(s) {
  const S=s.shell, air=s.mode==='air';
  const width=air?s.roomW:s.pondL+1.5, depth=air?s.roomD:s.pondW+1.5;
  const zc=air?0:s.pondZc, rnd=seeded(427);
  const soil=s.mat('#605f45',.99,0);
  const site=new T.Group();site.name='Detailed landscaped site';S.add(site);
  const path=s.mat('#bcb4a2',.95,0),edge=s.mat('#8b928a',.88,0);
  // Individually jointed pavers and stone edging use instancing at every site size.
  const paverPositions=[];
  for(const side of [-1,1])for(let z=-depth/2;z<depth/2;z+=.62){
    paverPositions.push([side*(width/2+1.9),-.17,zc+z+.30]);
  }
  const pavers=new T.InstancedMesh(new T.BoxGeometry(.92,.10,.59),path,paverPositions.length),paver=new T.Object3D();
  pavers.name='Jointed promenade pavers';pavers.receiveShadow=true;
  paverPositions.forEach((p,i)=>{paver.position.set(...p);paver.updateMatrix();pavers.setMatrixAt(i,paver.matrix);});site.add(pavers);
  for(const side of [-1,1]){
    s.box(.13,.14,depth+1,edge,site,side*(width/2+1.35),-.11,zc);
    addAsset(site,'site-bench',[side*(width/2+2.2),-.14,zc-depth*.25],[1,1,1],[0,-side*Math.PI/2,0]);
    for(const end of [-1,1])addAsset(site,'site-bollard',[side*(width/2+2.15),-.12,zc+end*depth*.38]);
  }
  // Narrow planting beds meet the architecture/engineered pond edge.
  for(const side of [-1,1]) {
    s.box(1.25,.12,depth+1,soil,S,side*(width/2+1.0),-.19,zc);
  }
  const blade=new T.BufferGeometry();
  blade.setAttribute('position',new T.Float32BufferAttribute([-.04,0,0,.04,0,0,.025,.32,.025,
    0,0,-.04,0,0,.04,.025,.25,.02],3));
  blade.computeVertexNormals();
  const material=s.mat('#6e7c4f',1,0), n=s.compactGraphics?120:320;
  const grass=new T.InstancedMesh(blade,material,n), dummy=new T.Object3D();
  grass.castShadow=false;grass.receiveShadow=true;grass.name='Instanced perimeter grasses';
  for(let i=0;i<n;i++) {
    const side=i%2?1:-1;
    dummy.position.set(side*(width/2+.55+rnd()*1.1),-.13,zc+(rnd()-.5)*(depth+2));
    dummy.rotation.y=rnd()*Math.PI;dummy.scale.setScalar(.5+rnd()*.9);dummy.updateMatrix();
    grass.setMatrixAt(i,dummy.matrix);
    grass.setColorAt(i,new T.Color().setHSL(.20+rnd()*.035,.2,.25+rnd()*.12));
  }
  grass.instanceMatrix.needsUpdate=true;S.add(grass);
  if(!air) {
    for(let i=0;i<12;i++) {
      const side=i%2?1:-1, z=1.6+Math.floor(i/2)*(s.pondW-1)/6;
      addAsset(S,'shore',[side*(s.pondL/2+.45),.65,z],[.75,.8+(i%3)*.15,.8]);
    }
    // Four small practical path lights retain readable machinery at night.
    s.siteLamps=[];
    for(const side of [-1,1]) for(const end of [-1,1]) {
      const x=side*(width/2+1.7),z=zc+end*depth*.38;
      s.cyl(.045,.75,s.mats.dark,S,x,.2,z);
      s.cyl(.10,.08,s.mats.led,S,x,.62,z);
      const light=new T.PointLight('#f9dfaf',0,7,2);light.position.set(x,.75,z);S.add(light);s.siteLamps.push(light);
    }
  }
}
