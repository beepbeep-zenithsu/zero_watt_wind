const path=require('node:path'),fs=require('node:fs');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_DIR||path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
(async()=>{
  const http=require('node:http'),root=path.resolve(__dirname,'..');
  const preview=http.createServer((req,res)=>{
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
    if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
    fs.readFile(file,(error,data)=>{
      if(error){res.writeHead(404);return res.end();}
      res.setHeader('Content-Type',({'.js':'text/javascript','.html':'text/html','.css':'text/css','.json':'application/json'})[path.extname(file)]||'application/octet-stream');res.end(data);
    });
  });
  await new Promise(resolve=>preview.listen(0,'127.0.0.1',resolve));
  const base='http://127.0.0.1:'+preview.address().port;
  const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
  try{
    const page=await browser.newPage({viewport:{width:1280,height:800}});await page.routeWebSocket('**/ws',s=>s.close());
    const result=[];
    for(const preference of ['no-preference','reduce']){
      await page.emulateMedia({reducedMotion:preference});await page.goto(base);
      await page.waitForFunction(()=>window.ZW?.state().scene?.city?.cars.every(c=>c.model));
      for(const mode of ['basic','advanced','water']){
        if(mode==='advanced'){await page.locator('[data-vent-mode="advanced"]').click();await page.waitForFunction(()=>ZW.states.air.hybrid.scene?.city?.cars.every(c=>c.model));}
        if(mode==='water'){await page.evaluate(()=>ZW.switchMode('water'));await page.waitForFunction(()=>ZW.state().scene?.city?.cars.every(c=>c.model));}
        const sample=()=>page.evaluate(()=>{const s=ZW.state();return {running:s.running,reduced:s.scene.reducedMotion,time:s.scene.time,cars:s.scene.city.cars.map(c=>({phase:c.phase,speed:c.speed,x:c.model.position.x,z:c.model.position.z}))};});
        const initial=await sample();
        if(!initial.running){const selector=mode==='advanced'?'[data-hy-action="pause"]':'#'+(mode==='water'?'water':'air')+'-face [data-tool="pause"]';await page.locator(selector).click();}
        const before=await sample();await page.waitForTimeout(3500);const after=await sample();
        const moved=after.cars.filter((c,i)=>Math.hypot(c.x-before.cars[i].x,c.z-before.cars[i].z)>.05).length;
        const entry={preference,mode,initiallyRunning:initial.running,running:after.running,reduced:after.reduced,timeChange:after.time-before.time,movingCars:moved,maxSpeed:Math.max(...after.cars.map(c=>c.speed))};
        result.push(entry);console.log('LIVE_MOTION',JSON.stringify(entry));
        if(moved<18)throw Error('Actual webpage traffic failed to move after Play: '+preference+'/'+mode);
      }
    }
    fs.writeFileSync(path.join(__dirname,'../docs/cars/live-traffic-motion.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
  }finally{await browser.close();preview.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
