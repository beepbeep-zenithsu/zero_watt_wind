const fs=require('node:fs'),path=require('node:path');
const {makeScene,ready,meshSnapshot,T}=require('./verify-graphics.cjs'),M=require('../model.js');
async function run(){
 const s=makeScene('air'),p={...M.defaults,_mode:'air',units:1,room:30,people:30};
 s.setEnvironment({weather:'clear',environment:'roof'},p);await ready(s);
 s.render(0,M.steady(p,p.wind,M.evaluateHardware(p)),false);
 const review=new T.Scene();
 review.add(s.shell.getObjectByName('Corner computer workstation').clone(true));
 review.add(s.shell.getObjectByName('Architectural floor tiles').clone(true));
 for(const person of s.people)review.add(person.clone(true));
 s.scene=review;s.camera.position.set(7.5,7.5,9);s.target.set(0,.7,0);
 const folder=path.join(__dirname,'../docs/cars');
 const stats=meshSnapshot(s,path.join(folder,'workstation-review.json'));
 fs.writeFileSync(path.join(folder,'mobility-validation.json'),JSON.stringify({
   cars:s.city.cars.length,carTypes:[...new Set(s.city.cars.filter(c=>c.model).map(c=>c.modelId))],allCarsUseRealModels:s.city.cars.every(c=>c.model),
   cyclists:s.city.cyclists.length,routes:s.city.paths.length,junctions:s.city.network.junctions.length,
   computerOperators:s.people.filter(p=>p.userData.seatRole==='computer-operator').length,occupants:30,reviewGeometry:stats,
   limitation:'Offline geometry and deterministic motion checks. No measured browser FPS or GPU performance.'
 },null,2)+'\n');
 console.log('MOBILITY_REVIEW_CAPTURED',stats);
}
run().catch(e=>{console.error(e);process.exitCode=1;});
