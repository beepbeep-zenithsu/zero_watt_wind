import * as T from '../../vendor/three.module.js';
import {mergeGeometries} from '../../vendor/addons/utils/BufferGeometryUtils.js';

const clamp=T.MathUtils.clamp;
const palettes={wind:'#bbd7dc',intake:'#70cbd2',exhaust:'#e7ad76',drive:'#d7c58d'};

function material(kind) {
  const uniforms={time:{value:0},speed:{value:1},strength:{value:0}};
  const m=new T.MeshBasicMaterial({color:palettes[kind],transparent:true,opacity:1,
    depthWrite:false,toneMapped:true,side:T.DoubleSide});
  m.userData.trails=uniforms;
  m.onBeforeCompile=shader=>{
    shader.uniforms.zwTrailTime=uniforms.time;
    shader.uniforms.zwTrailSpeed=uniforms.speed;
    shader.uniforms.zwTrailStrength=uniforms.strength;
    shader.vertexShader='varying vec2 zwTrailUV;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
      zwTrailUV=uv;`);
    shader.fragmentShader='varying vec2 zwTrailUV; uniform float zwTrailTime; uniform float zwTrailSpeed; uniform float zwTrailStrength;\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      float phase=fract(zwTrailUV.x*3.0-zwTrailTime);
      float tail=smoothstep(.15,.70,phase)*(1.0-smoothstep(.78,.86,phase));
      float ends=smoothstep(0.0,.04,zwTrailUV.x)*(1.0-smoothstep(.93,1.0,zwTrailUV.x));
      diffuseColor.a*=zwTrailStrength*(.035+.76*tail)*ends;`);
  };
  m.customProgramCacheKey=()=> 'zw-directional-trail';
  return m;
}

/** Fixed, pooled path geometry; only four material uniforms change each frame.
 * Paths illustrate model flow, not a CFD solution. No independent RAF loop.
 */
export class VentilationVFX {
  constructor(scene) {
    this.owner=scene;this.root=new T.Group();this.root.name='Model-driven ventilation paths';
    scene.scene.add(this.root);this.key='';this.layers={};
    this.materials=Object.fromEntries(Object.keys(palettes).map(k=>[k,material(k)]));
    this.points=[new T.Vector3(),new T.Vector3(),new T.Vector3()];
  }
  rebuild() {
    const s=this.owner,bench=s.view==='bench',key=`${s.layoutKey}|${s.view}`;
    if(key===this.key)return;this.key=key;
    for(const layer of Object.values(this.layers))layer.geometry.dispose();
    this.root.clear();this.layers={};
    const paths={wind:[],intake:[],exhaust:[],drive:[]};
    const add=(kind,points,radius=.014)=>{
      const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)),false,'centripetal');
      paths[kind].push(new T.TubeGeometry(curve,s.compactGraphics?24:40,radius,4,false));
    };
    if(bench) {
      const u=s.units[0].g;u.updateMatrixWorld(true);
      const world=p=>u.localToWorld(new T.Vector3(...p)).toArray();
      for(let k=0;k<4;k++)add('wind',[[-5,1.15+k*.3,-.6],[-3.7,1.3+k*.3,-.35],[-2.3,1.4+k*.3,-.1],[-.8,1.5+k*.3,0]].map(world),.012);
      add('drive',[[-1.05,1.55,.12],[.50,1.55,.12],[1.02,1.3,.12],[1.02,-.4,.12]].map(world),.017);
    } else {
      const W=s.roomW,D=s.roomD;
      const streakCount=s.compactGraphics?6:10;
      for(let k=0;k<streakCount;k++){
        const z=-D/2-.6+(k%5)*(D+1.2)/4,y=4.4+Math.floor(k/5)*1.15;
        add('wind',[[-W/2-4,y,z],[-W*.25,y+.10,z+.16],[W*.22,y+.04,z],[W/2+4,y+.16,z-.18]],.010);
      }
      for(const pane of s.panes) {
        const side=Math.sign(pane.x);
        for(const offset of [-.24,.24])add('intake',[
          [pane.x+side*1.4,pane.y+.06,pane.zc+offset],
          [pane.x,pane.y,pane.zc+offset],
          [pane.x-side*1.1,pane.y-.25,pane.zc+offset*.5],
          [pane.x-side*Math.min(W*.38,3),1.35,pane.zc+.5]
        ],.016);
      }
      for(let i=0;i<s.count;i++){
        const q=s.unitPos(i),x=q.x+1.02,z=q.z;
        for(const side of [-1,1])add('exhaust',[
          [x+side*1.35,1.25,z+.8],[x+side*.55,2.4,z+.35],
          [x,3.3,z],[x,4.25,z],[x+.75,5.15,z+.12],[x+2.0,5.35,z+.2]
        ],.019);
        add('drive',[[q.x-1.02,q.y+1.55,z+.12],[q.x+.52,q.y+1.55,z+.12],
          [x,q.y+1.3,z+.12],[x,q.y-.4,z+.12]],.017);
      }
    }
    for(const [kind,geometries] of Object.entries(paths)){
      if(!geometries.length)continue;
      const merged=mergeGeometries(geometries);geometries.forEach(g=>g.dispose());
      const mesh=new T.Mesh(merged,this.materials[kind]);mesh.name=`${kind} directional trails`;
      mesh.frustumCulled=false;mesh.renderOrder=3;this.root.add(mesh);this.layers[kind]=mesh;
    }
  }
  update(dt,sample) {
    const s=this.owner;
    this.root.visible=s.flows;
    if(s.sensors?.mcuLed && s.settings.mcu!=='none'){
      s.sensors.mcuLed.material.emissiveIntensity=sample.shaft>0?1.1+.12*Math.sin(s.time*2):.6;
    }
    if(!s.flows)return;
    this.rebuild();
    const perUnit=Math.max(0,sample.airflow)/Math.max(1,s.count);
    const natural=Math.max(0,s.settings.backgroundACH*s.settings.room);
    const wind=clamp(sample.wind/12,0,1),air=clamp(perUnit/500,0,1);
    const values={wind:[sample.wind>0 ? .22+wind*.48 : 0,.10+Math.min(30,sample.wind)*.026],
      intake:[natural+sample.airflow>0 ? .22+air*.5 : 0,.13+clamp((natural+perUnit)/600,0,1)*.55],
      exhaust:[sample.airflow>0 ? .30+air*.5 : 0,.18+air*.75],
      drive:[sample.shaft>0 ? .48 : 0,.18+Math.min(sample.outputRPM,160)/160*.7]};
    for(const [kind,layer] of Object.entries(this.layers)){
      const u=this.materials[kind].userData.trails,[strength,speed]=values[kind];
      u.speed.value+=(speed-u.speed.value)*(1-Math.exp(-dt*6));
      u.time.value+=dt*u.speed.value;u.strength.value=strength;
      layer.visible=strength>0;
    }
  }
  dispose() {
    Object.values(this.layers).forEach(o=>o.geometry.dispose());
    Object.values(this.materials).forEach(m=>m.dispose());this.root.removeFromParent();
  }
}

/** DOM anchors use the same camera as the canvas; labels never intercept orbit. */
export function updateVentilationLabels(s) {
  if(!s.host.querySelectorAll)return;
  s._callouts??=[...s.host.querySelectorAll('[data-scene-anchor]')];
  const q=s.unitPos(0),pane=s.panes.find(p=>p.x>0)||s.panes[0];
  const anchors={rotor:[q.x-2,q.y+2.3,q.z],exhaust:[q.x+2.4,4.5,q.z+.3],
    intake:pane?[pane.x,pane.y+.7,pane.zc]:[0,1,0]};
  const projected=s._labelPoint??=new T.Vector3();
  for(const el of s._callouts){
    const point=anchors[el.dataset.sceneAnchor];projected.set(...point).project(s.camera);
    const on=s.view!=='bench'&&Math.abs(projected.x)<.88&&Math.abs(projected.y)<.76&&projected.z<1;
    el.hidden=!on;
    if(on){el.style.left=`${(projected.x*.5+.5)*100}%`;el.style.top=`${(-projected.y*.5+.5)*100}%`;}
  }
}
