const {test}=require('node:test'),assert=require('node:assert/strict');
const path=require('node:path'),Module=require('node:module');
const {buildSync}=require('esbuild');
const root=path.join(__dirname,'..');
const bundle=buildSync({stdin:{contents:"export {FieldScene} from './scene.js'; export * as T from './vendor/three.module.js';",resolveDir:root},bundle:true,platform:'node',format:'cjs',write:false});
const compiled=new Module(path.join(root,'scene-test.cjs'),module);
compiled._compile(bundle.outputFiles[0].text,compiled.id);
const {FieldScene,T}=compiled.exports;

test('window apertures remain clear of opaque walls as the building changes size',()=>{
  for(const [W,D,count] of [[6,6,1],[15,9,5],[26,12,10]]){
    const s=Object.create(FieldScene.prototype);
    Object.assign(s,{shell:new T.Group(),roomW:W,roomD:D,count,panes:[],people:[],mats:new Proxy({},{get:()=>new T.MeshBasicMaterial()})});
    s.buildRoomShell();
    assert.equal(s.panes.length,2*Math.max(1,Math.floor(D/2.6)));
    for(const pane of s.panes){
      const side=Math.sign(pane.x);
      // Open the pane, then look through the opening perpendicular to the wall.
      pane.piv.rotation.y=pane.sign*1.1;s.shell.updateMatrixWorld(true);
      const ray=new T.Raycaster(new T.Vector3(pane.x+side*.6,pane.y+.3,pane.zc+pane.width*.2),new T.Vector3(-side,0,0),0,1);
      assert.equal(ray.intersectObjects(s.shell.children,true).length,0,'window opening must not have a solid wall or pane across it');
    }
  }
});
