import * as T from '../../vendor/three.module.js';
import {GLTFLoader} from '../../vendor/addons/loaders/GLTFLoader.js';
import {FieldScene} from '../../scene.js';
import {retireShell} from '../graphics/assets.js';

const TAU=Math.PI*2;
export const COMPONENTS={
  WindRotor:['Spiral wind rotor','Three formed spiral blades capture wind. The rotor turns on a horizontal input shaft; its reported speed is measured independently of the fan.'],
  Frame:['Bearings & mounting frame','Two pillow blocks support the input shaft. A bridge bearing supports the common fan shaft; isolated roof feet carry the structure.'],
  WindClutch:['W · wind freewheel','Engages when the wind input catches the common shaft. Overruns when motor assistance drives the fan faster, preventing the motor from back-driving the rotor.'],
  InputGear:['90° bevel transmission','A pair of equal 24-tooth miter gears transfers rotation through 90 degrees at a 1:1 ratio. Input and output axes converge at the pitch apex.'],
  Motor:['DC assist motor','A protected 24 V DC bus supplies a variable motor driver. Assistance follows the speed deficit, available electrical power and battery protection.'],
  Belt:['Belt & pulley transmission','External tangents route a closed belt around 22:34 drive and driven pulleys. Motor RPM is 34/22 times the driven pulley RPM.'],
  MotorClutch:['M · motor freewheel','The motor pulley engages the common shaft only while providing torque. With adequate wind, the motor and belt stop while the fan continues.'],
  Fan:['Pitched axial exhaust fan','The vertical shaft drives seven pitched blades above the roof penetration. Air rises from the room into a sealed plenum and leaves through the rear discharge duct.'],
  FanHousing:['Sealed shaft sleeve & plenum','A sleeve isolates the rotating shaft from extracted air. The annular plenum cover seals around it; a real side opening connects the rectangular exhaust branch.'],
  Duct:['Exhaust duct & outdoor cowl','A continuous enclosed branch leads from the plenum to the rear roof edge. Flanged joints and a rain cap protect the outdoor discharge.'],
  SolarArray:['180 W sun-tracking photovoltaic module','The module turns and tilts on a fixed roof rack to face the sunlight. Change the sun position to follow the tracker. Output follows irradiance, controller losses and day/night conditions.'],
  Electrical:['Protected DC bus & battery','PV → charge controller → protected DC bus / 240 Wh battery → motor driver. Fuses and a disconnect protect the motor circuit. Low state of charge locks out assistance.'],
  Sensors:['Dual shaft tachometers','Hall sensors monitor the input and common fan shaft separately. Relative speeds, 90/105% hysteresis and 1.5 s verification govern assistance.']
};

/** Shares the existing architectural renderer and orbit controls. This instance
 * owns its assembly and VFX; the Basic instance remains independently cached. */
export class AdvancedScene extends FieldScene {
  constructor(host) {
    super(host,'air');
    this.initializeHybrid();
  }
  unitPos(){return {x:0,y:3.7,z:0};}
  initializeHybrid(){
    const host=this.host;
    this.renderer.domElement.setAttribute('aria-label','Advanced solar-assisted hybrid ventilation. Drag to orbit; choose a component to inspect.');
    this.hybridRoot=new T.Group();this.hybridRoot.name='Advanced hybrid ventilation';
    this.scene.add(this.hybridRoot);this.hybridRoot.position.y=3.7;
    this.parts={};this.explosion=0;this.exploded=false;this.section=false;
    this.energy=true;this.tour=false;this.tourTime=0;this.failed=false;
    this.cameraUser=false;this.raycaster=new T.Raycaster();
    this.sunHour=10;this.sunDirection=new T.Vector3();
    this.setSunPosition(this.sunHour);
    this.assetReady=new GLTFLoader().loadAsync('assets/hybrid/hybrid-assembly.glb').then(gltf=>{
      this.assembly=gltf.scene;this.hybridRoot.add(this.assembly);
      Object.keys(COMPONENTS).concat(['WindShaft','OutputGear','FanShaft','MotorPulley','FanPulley','SectionGuard','CabinetDoor','SolarYaw','SolarTilt']).forEach(name=>{
        const part=this.assembly.getObjectByName(name);
        if(part){this.parts[name]=part;part.userData.home=part.position.clone();}
      });
      this.assembly.traverse(o=>{if(o.isMesh){o.castShadow=o.receiveShadow=true;
        o.material=o.material.clone();
        o.material.envMapIntensity=.85;
        if(o.material.name.includes('Brushed stainless'))o.material.normalMap=this.surfaceNormal;
      }});
      if(this.parts.OutputGear)this.parts.OutputGear.rotation.y=Math.PI/24;
      this.host.dataset.hybridAssets='ready';this.setSunPosition(this.sunHour);this.applyHybridView();return this.assembly;
    }).catch(error=>{
      this.failed=true;this.host.dataset.hybridAssets='failed';
      host.dispatchEvent(new CustomEvent('hybrid-error',{detail:error.message}));
      console.error('Hybrid assembly failed to load:',error);return null;
    });
    this.bindInspection();
  }
  setEnvironment(s,p) {
    // The reference assembly is one complete installation; Basic retains its unit grid.
    super.setEnvironment(s,{...p,units:1,room:150,people:4,diameter:1});
    if(this.hybridRoot&&!this.traces)this.buildPaths();
    this.applyHybridView();
    if(this.sunDirection)this.setSunPosition(this.sunHour);
    this.panes.forEach(p=>p.piv.rotation.y=p.sign*.8);
  }
  setSunPosition(hour){
    this.sunHour=T.MathUtils.clamp(Number(hour)||10,6,18);
    const phase=(this.sunHour-6)/12*Math.PI;
    this.sunDirection.set(-Math.cos(phase),Math.max(.12,Math.sin(phase)*1.5),.65).normalize();
    const center=new T.Vector3(-2.2,5,2);
    this.sun.target.position.copy(center);this.scene.add(this.sun.target);
    this.sun.position.copy(center).addScaledVector(this.sunDirection,24);
    if(this.parts?.SolarYaw)this.parts.SolarYaw.rotation.y=this.monsoon?0:Math.atan2(this.sunDirection.x,this.sunDirection.z);
    if(this.parts?.SolarTilt)this.parts.SolarTilt.rotation.x=this.monsoon?Math.PI/18:Math.acos(this.sunDirection.y);
  }
  applyView() {
    super.applyView();
    if(this.hybridRoot)this.applyHybridView();
  }
  applyHybridView() {
    this.unitRoot.visible=false;this.table.visible=false;this.fx.visible=false;
    this.env.visible=true;this.shell.visible=true;
    if(this.ventilationVFX)this.ventilationVFX.root.visible=false;
    // Preserve opaque architectural masses; section only the roof and front wall.
    this.hybridRoof??=new T.MeshStandardMaterial({color:'#b8b7a8',roughness:.83,normalMap:this.surfaceNormal});
    this.hybridWall??=new T.MeshStandardMaterial({color:'#d7d2bd',roughness:.91,normalMap:this.surfaceNormal});
    this.hybridWall.normalScale.set(.13,.13);this.hybridRoof.normalScale.set(.16,.16);
    this.shell.traverse(o=>{if(o.isMesh&&o.material===this.mats.shellGlass&&o.name!=='full-roof')o.material=this.hybridWall;});
    const roof=this.shell.getObjectByName('full-roof');
    if(roof){roof.material=this.hybridRoof;roof.material.side=T.DoubleSide;roof.visible=!this.section;roof.castShadow=true;}
    for(const name of ['front-wall-left','front-wall-right']){
      const wall=this.shell.getObjectByName(name);if(wall){wall.material=this.hybridWall;wall.visible=!this.section;}
    }
    if(this.parts.SectionGuard)this.parts.SectionGuard.visible=!this.section;
    if(this.parts.CabinetDoor)this.parts.CabinetDoor.visible=!this.section;
    // A half-shell reveals fan blades without making the rest of the building transparent.
    const housing=this.parts.FanHousing;
    if(housing)housing.traverse(o=>{if(o.isMesh){
      o.material.clippingPlanes=this.section?[new T.Plane(new T.Vector3(0,0,-1),0)]:[];
      o.material.clipShadows=true;
    }});
    this.renderer.localClippingEnabled=!!this.section;
  }
  setView(view) {
    if(!this.hybridRoot){super.setView(view);return;}
    this.view=view;this.applyHybridView();this.cameraUser=false;this.tour=false;
    this.host.dataset.sceneView=view;
    this.minElevation=view==='inside'?-1.2:.05;
    this.camera.fov=view==='inside'?68:38;this.camera.updateProjectionMatrix();
    if(view==='inside'){
      this.setDoorOpen(true);this.setSection(false);this.setExploded(false);
      this.interiorEye=new T.Vector3(this.doorPivot.position.x-.025,1.65,this.roomD/2-1.30);
      this.angle=.65;this.elevation=.05;this.distance=1;
      this.cameraPosition(true);return;
    }
    this.target.set(0,view==='bench'?4.65:2.6,0);
    this.angle=.87;this.elevation=view==='flow'?.24:.48;
    if(this.scenario?.environment==='canyon'){this.angle=.25;this.elevation=.40;}
    this.distance=(view==='bench'?9:17)*Math.max(1,.95/(this.camera.aspect||1));
    this.maxDistance=260;
    if(view==='city'){this.target.set(0,4,0);this.angle=.50;this.elevation=.72;this.distance=145;}
    this.cameraPosition();
  }
  cameraPosition(snap=false){
    // Interior entry should immediately place the eye through the open doorway.
    super.cameraPosition(snap||this.view==='inside');
  }
  zoomBy(f){
    if(this.view!=='inside'){super.zoomBy(f);return;}
    this.cameraUser=true;
    this.interiorEye.addScaledVector(new T.Vector3(-Math.sin(this.angle),0,-Math.cos(this.angle)),(1-f)*3);
    this.interiorEye.x=T.MathUtils.clamp(this.interiorEye.x,-this.roomW/2+.5,this.roomW/2-.5);
    this.interiorEye.z=T.MathUtils.clamp(this.interiorEye.z,-this.roomD/2+.5,this.roomD/2-.5);
    this.cameraPosition(true);
  }
  setSection(on){this.section=on;this.applyHybridView();}
  setExploded(on){this.exploded=on;}
  setEnergy(on){this.energy=on;}
  setQuality(value){
    const low=value==='low'||(value==='auto'&&this.compactGraphics);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,low?1:1.7));
    this.renderer.shadowMap.enabled=!low;
    this.pathLayers?.forEach(l=>l.particles.count=low?6:12);
    if(this.traces)this.traces.visible=!low||this.flows;
  }
  inspectPart(name){
    const alias={rotor:'WindRotor',intake:'Fan',exhaust:'Duct'};
    name=alias[name]||name;const part=this.parts[name];if(!part)return;
    if(this.view==='inside')this.setView('field');
    this.selected=name;this.tour=false;this.cameraUser=false;
    this.assembly.traverse(o=>{if(o.isMesh)o.material.emissiveIntensity=0;});
    part.traverse(o=>{if(o.isMesh){o.material.emissive.set('#6d7945');o.material.emissiveIntensity=.17;}});
    this.hybridRoot.updateMatrixWorld(true);
    const bounds=new T.Box3().setFromObject(part);bounds.getCenter(this.target);
    this.distance=Math.max(4.3,bounds.getSize(new T.Vector3()).length()*1.65)*Math.max(1,.85/this.camera.aspect);
    if(name==='Electrical'){this.target.set(4.6,2.65,1.8);this.distance=4.8*Math.max(1,.85/this.camera.aspect);}
    this.angle=1.0;this.elevation=.36;this.cameraPosition();
    this.host.dispatchEvent(new CustomEvent('hybrid-inspect',{detail:name}));
  }
  bindInspection(){
    const canvas=this.renderer.domElement;let down;
    canvas.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];this.tour=false;});
    canvas.addEventListener('pointerup',e=>{
      if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5||!this.assembly)return;
      const r=canvas.getBoundingClientRect();
      this.raycaster.setFromCamera(new T.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),this.camera);
      const hit=this.raycaster.intersectObjects([this.assembly,this.shell],true).find(h=>{
        for(let o=h.object;o;o=o.parent)if(!o.visible)return false;
        return true;
      });
      let door=hit?.object;while(door&&door!==this.doorPivot)door=door.parent;
      if(door)return; // Shared pointer handler owns door toggling in both modes.
      let o=hit?.object;while(o&&!COMPONENTS[o.name])o=o.parent;
      if(o)this.inspectPart(o.name);
    });
    canvas.addEventListener('wheel',()=>this.tour=false,{passive:true});
    canvas.addEventListener('keydown',()=>this.tour=false);
  }
  buildPaths(){
    this.traces=new T.Group();this.traces.name='Illustrative hybrid energy and airflow';this.scene.add(this.traces);
    this.pathLayers=[];
    const path=(kind,points,color)=>{
      const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)),false,'centripetal');
      const geo=new T.BufferGeometry().setFromPoints(curve.getPoints(60));
      const line=new T.Line(geo,new T.LineBasicMaterial({color,transparent:true,opacity:.18,depthWrite:false}));
      this.traces.add(line);
      const particles=new T.InstancedMesh(new T.SphereGeometry(.033,6,4),new T.MeshBasicMaterial({color,transparent:true,opacity:.78,depthWrite:false}),12);
      particles.frustumCulled=false;this.traces.add(particles);
      this.pathLayers.push({kind,curve,line,particles,phase:0});
    };
    // Fresh air crosses an actual operable side-window opening.
    const pane=this.panes.find(p=>p.x<0)||{x:-4.47,y:1.8,zc:0};
    this.intakeAnchor=[pane.x,pane.y,pane.zc];
    for(const z of [-.16,.16]){
      path('intake',[[pane.x-1.3,pane.y,pane.zc+z],[pane.x,pane.y,pane.zc+z],[-1.5,1.5,pane.zc+z],[.5,1.8,.35],[1.02,2.72,0]],'#70cbd2');
      path('exhaust',[[1.02+z,2.72,0],[1.02+z,3.45,0],[1.02+z,4.02,0],[1.02+z,4.04,-.75],[1.02+z,4.04,-2.7],[1.02+z,4.04,-3.65]],'#eda866');
      path('wind',[[-6,5.1+z,0],[-4.5,5.2+z,.1],[-3.1,5.25+z,.1]],'#d6e8e8');
    }
    path('pv',[[-2.2,5,2],[-2.2,3.765,2.65],[4.42,3.765,2.65],[4.55,3.25,2.65],[4.51,3.05,1.8]],'#dfc57f');
    path('motor',[[4.51,2.85,1.53],[4.60,2.85,1.53],[4.60,3.765,1.53],[4.15,3.765,1.30],[2.18,3.765,.92],[2.18,4.90,.92],[2.45,5.15,.7]],'#dfc57f');
    this.particlePose=new T.Object3D();
    // Screen lives inside an existing opening, not across an opaque wall.
    const mat=new T.MeshStandardMaterial({color:'#68736e',metalness:.5,roughness:.6});
    const grille=new T.Group();grille.name='Fitted intake grille';this.shell.add(grille);
    const w=pane.width-.16,h=1.34,bars=Math.ceil(w/.11);
    for(let i=0;i<=bars;i++)this.box(.025,h,.018,mat,grille,pane.x,pane.y,pane.zc-w/2+i*w/bars);
    for(const side of [-1,1]){
      this.box(.06,.045,w+.06,mat,grille,pane.x,pane.y+side*h/2,pane.zc);
      this.box(.06,h,.045,mat,grille,pane.x,pane.y,pane.zc+side*w/2);
    }
    this.box(.17,1.48,1.24,this.hybridWall,this.shell,4.33,2.70,1.8).name='Cabinet structural service panel';
    // The marked belt surface travels at r_driven × shaft angular velocity.
    const points=[],phi=Math.atan2(.70,1.16),alpha=Math.acos(.12/Math.hypot(1.16,.70));
    for(let i=0;i<=48;i++){const a=phi+alpha+(TAU-2*alpha)*i/48;points.push(new T.Vector3(1.02+.34*Math.cos(a),.95,.34*Math.sin(a)));}
    for(let i=0;i<=48;i++){const a=phi-alpha+2*alpha*i/48;points.push(new T.Vector3(2.18+.22*Math.cos(a),.95,.70+.22*Math.sin(a)));}
    this.beltCurve=new T.CurvePath();
    for(let i=0;i<points.length;i++)this.beltCurve.add(new T.LineCurve3(points[i],points[(i+1)%points.length]));
    this.beltMarkers=new T.InstancedMesh(new T.SphereGeometry(.028,6,4),new T.MeshStandardMaterial({color:'#526357',roughness:.85}),24);
    this.beltMarkers.name='Synchronized belt surface';this.hybridRoot.add(this.beltMarkers);this.beltPhase=0;
  }
  updateHybrid(dt,sample,running){
    if(!sample)return;
    const anim=running?dt:0,scale=.22; // shared 0.22× rotational display scale prevents aliasing
    const fanStep=sample.fanRPM/60*TAU*anim*scale;
    const windStep=sample.windRPM/60*TAU*anim*scale;
    const motorStep=sample.motorRPM/60*TAU*anim*scale;
    for(const name of ['WindRotor','WindShaft'])if(this.parts[name])this.parts[name].rotation.x+=windStep;
    for(const name of ['WindClutch','InputGear'])if(this.parts[name])this.parts[name].rotation.x+=fanStep;
    for(const name of ['OutputGear','FanShaft','Fan'])if(this.parts[name])this.parts[name].rotation.y-=fanStep;
    if(this.parts.MotorPulley)this.parts.MotorPulley.rotation.y-=motorStep;
    for(const name of ['FanPulley','MotorClutch'])if(this.parts[name])this.parts[name].rotation.y-=sample.motorEngaged?fanStep:0;
    for(const [name,on] of [['WindClutch',sample.windEngaged],['MotorClutch',sample.motorEngaged]]){
      this.parts[name]?.traverse(o=>{if(o.isMesh){o.material.emissive.set(on?'#7c5b16':'#000000');o.material.emissiveIntensity=on?.22:0;}});
    }
    const a=this.reducedMotion?1:1-Math.exp(-dt*5);
    this.explosion+=((this.exploded?1:0)-this.explosion)*a;
    const offsets={WindRotor:[-.9,.1,0],WindShaft:[-.35,.1,0],WindClutch:[-.1,.45,0],InputGear:[-.15,.85,0],OutputGear:[.15,.60,0],
      FanShaft:[0,.25,0],Fan:[0,-.4,0],SectionGuard:[0,1.30,0],Motor:[.65,.2,.3],MotorPulley:[.65,.2,.3],Belt:[.3,.2,.15],MotorClutch:[0,.35,0],FanPulley:[0,.35,0],CabinetDoor:[.65,0,0]};
    for(const [name,offset] of Object.entries(offsets)){
      const part=this.parts[name];if(part)part.position.copy(part.userData.home).addScaledVector(new T.Vector3(...offset),this.explosion);
    }
    this.beltPhase=(this.beltPhase+(sample.motorEngaged?fanStep*.34/this.beltCurve.getLength():0))%1;
    this.beltMarkers.visible=this.explosion<.05;
    for(let i=0;i<24;i++){
      this.particlePose.position.copy(this.beltCurve.getPointAt((i/24+this.beltPhase)%1));
      this.particlePose.updateMatrix();this.beltMarkers.setMatrixAt(i,this.particlePose.matrix);
    }
    this.beltMarkers.instanceMatrix.needsUpdate=true;
    // Circulation is suspended in exploded view because the assembly is disconnected.
    for(const layer of this.pathLayers){
      const energy=['pv','motor'].includes(layer.kind);
      const power=layer.kind==='pv'?sample.pvW:sample.motorW;
      const active=energy?this.energy&&power>.1:this.flows&&(layer.kind==='wind'?sample.windRPM>1:sample.fanRPM>2);
      layer.line.visible=layer.particles.visible=active&&this.explosion<.05;
      if(!active)continue;
      const speed=energy?.14+power/900:layer.kind==='wind'?.12+sample.windRPM/2000:.12+sample.fanRPM/1000;
      layer.phase=(layer.phase+anim*speed)%1;
      for(let i=0;i<12;i++){
        this.particlePose.position.copy(layer.curve.getPointAt((i/12+layer.phase)%1));
        this.particlePose.updateMatrix();layer.particles.setMatrixAt(i,this.particlePose.matrix);
      }
      layer.particles.instanceMatrix.needsUpdate=true;
    }
    if(this.tour&&!this.cameraUser&&!this.reducedMotion){
      this.tourTime+=dt;const shot=Math.floor(this.tourTime/6)%9;
      const shots=[[0,2.8,0,15.2,.85,.45],[-1.8,5.2,0,6,.5,.25],[.85,5.1,0,4.5,.9,.32],[2,4.8,.5,4.5,1,.35],[1.02,4,0,5.5,.8,.16],[0,1.7,0,11,.8,.16],[-2.2,4.3,1.8,6,.8,.55],[4.6,2.7,1.8,4.5,1.1,.15],[0,3,0,15.2,1.2,.48]];
      const q=shots[shot];this.target.set(q[0],q[1],q[2]);this.distance=q[3]*Math.max(1,.85/this.camera.aspect);this.angle=q[4]+Math.sin(this.tourTime*.13)*.08;this.elevation=q[5];
      if(shot===4||shot===5||shot===7){if(!this.section)this.setSection(true);}
    }
  }
  render(dt,sample,running){
    this.skyDt=dt;
    this.updateHybrid(dt,this.hybridSample,running);
    // Let the existing scene handle weather, landscaping, camera and renderer.
    // Original powered paths are hidden and do not run in the advanced mode.
    const vfx=this.ventilationVFX;this.ventilationVFX=null;
    const v=this.hybridSample;
    super.render(dt,v?{...sample,wind:this.hybridWind??sample.wind,shaft:v.windW,airflow:v.airflow,outputRPM:v.fanRPM}:sample,running);this.ventilationVFX=vfx;
    if(vfx)vfx.root.visible=false;
  }
  applySky(flash){
    super.applySky(flash);
    if(!this.hybridRoot)return;
    const daylight=!this.night&&!this.monsoon&&(this.irradiance??1000)>0;
    this.scene.fog.density=this.monsoon?.005:this.night?.0025:.0012;
    if(!this.night){
      this.scene.background.set(this.monsoon?'#8596a7':'#a4d3f1');
      this.hemi.color.set(this.monsoon?'#c9d8e5':'#dcefff');this.hemi.groundColor.set('#77735a');
      this.hemi.intensity=this.monsoon?.52:.55;this.fill.intensity=.18;
      this.roomLight.intensity=this.monsoon?3:1.7;
      this.clouds.visible=!!this.monsoon;
    }
    this.sun.intensity=daylight?3.6*T.MathUtils.clamp((this.irradiance??1000)/1000,0,1.2):0;
    if(daylight)this.sun.color.set('#fff0cf');
    const sky=this._hybridSky??={color:this.scene.background.clone(),sun:this.sun.intensity,hemi:this.hemi.intensity,room:this.roomLight.intensity};
    const a=this.reducedMotion?1:1-Math.exp(-(this.skyDt||.016)*2);
    sky.color.lerp(this.scene.background,a);this.scene.background.copy(sky.color);this.scene.fog.color.copy(sky.color);
    sky.sun+=(this.sun.intensity-sky.sun)*a;sky.hemi+=(this.hemi.intensity-sky.hemi)*a;sky.room+=(this.roomLight.intensity-sky.room)*a;
    this.sun.intensity=sky.sun;this.hemi.intensity=sky.hemi;this.roomLight.intensity=sky.room;
  }
  dispose(){
    this.resizeObserver.disconnect();this.renderer.dispose();
    retireShell(this.scene);this.renderer.domElement.remove();
  }
}
