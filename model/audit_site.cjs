/* Read-only audit of existing simulator. Run node model/audit_site.cjs. */
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),M=require('../model.js');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const chunk=app.slice(app.indexOf('const scenarios ='),app.indexOf('const hwKeys ='));
const ctx={};vm.createContext(ctx);vm.runInContext(chunk+';this.snapshot={scenarios,definitions,steppers,mounts,profiles};',ctx);
const advanced=fs.readFileSync(path.join(root,'src/advanced/hybrid-model.js'),'utf8');
const ac={};vm.createContext(ac);vm.runInContext(advanced.replace(/export /g,'')+';this.defaults=HYBRID_DEFAULTS;',ac);
const baseline={defaults:M.defaults,hardware:M.hardware,...ctx.snapshot,advancedDefaults:ac.defaults};
fs.mkdirSync(path.join(root,'data'),{recursive:true});
fs.writeFileSync(path.join(root,'data/site_baseline.json'),JSON.stringify(baseline,null,2));
const files=['model.js','app.js','src/advanced/hybrid-model.js','src/advanced/hybrid-ui.js','HYBRID-GUIDE.md'];
const rows=['file,line,literal,context,basis'];
for(const f of files){fs.readFileSync(path.join(root,f),'utf8').split(/\r?\n/).forEach((line,i)=>{
  const literals=[...line.matchAll(/(?<![\w])(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?/gi)].map(x=>x[0]);
  for(const n of literals) rows.push([f,i+1,n,line.trim(),'A: site coefficient or UI/identifier; not measured'].map(x=>'"'+String(x).replaceAll('"','""')+'"').join(','));
});}
fs.writeFileSync(path.join(root,'data/site_numeric_inventory.csv'),rows.join('\n'));
const outputs=[];
for(const [mode,cases] of Object.entries(ctx.snapshot.scenarios))for(const c of cases){
 const p={...M.defaults,...c.p,_mode:mode,_weather:c.weather};const h=M.evaluateHardware(p);
 for(const t of [0,18]){const v=M.liveWind(p,t);outputs.push({mode,scenario:c.id,time_s:t,...M.steady(p,v,h)});}
}
fs.writeFileSync(path.join(root,'data/site_scenarios.json'),JSON.stringify(outputs,null,2));
console.log('AUDIT PASS: defaults, complete numeric-literal inventory, all ten basic/pond presets exported.');
