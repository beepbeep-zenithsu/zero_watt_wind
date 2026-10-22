/* Real headless Chromium/WebGL smoke and timing review; no app data is changed. */
const fs=require('node:fs'),path=require('node:path');
let chromium;
try{({chromium}=require('playwright'));}catch{
  const runtime=process.env.PLAYWRIGHT_MODULE_DIR||path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
  ({chromium}=require(runtime));
}
async function run(){
  const executable=process.env.EDGE_PATH||['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe','C:/Program Files/Google/Chrome/Application/chrome.exe'].find(f=>fs.existsSync(f));
  const browser=await chromium.launch({headless:true,executablePath:executable});
  try{
    const page=await browser.newPage({viewport:{width:1280,height:800},deviceScaleFactor:1});
    // Ignore the developer server's file-watch reloads while screenshots/reports
    // are written into this same workspace. Application WebGL remains real.
    await page.routeWebSocket('**/ws',socket=>socket.close());
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/__citywide-review',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html><head><style>body{margin:0}#view{width:100vw;height:100vh;position:relative}</style></head><body><div id="view"></div><script src="/model.js"></script></body></html>'}));
    await page.goto('http://127.0.0.1:5500/__citywide-review');
    await page.evaluate(async()=>{
      const {FieldScene}=await import('/scene.js'),{updateCity}=await import('/src/graphics/city.js');
      window.prepareCityReview=async mode=>{
      if(window.cityReview){const old=window.cityReview;old.resizeObserver.disconnect();old.renderer.dispose();old.renderer.forceContextLoss();const host=document.createElement('div');host.id='view';document.querySelector('#view').replaceWith(host);}
      const Scene=mode==='advanced'?(await import('/src/advanced/advanced-scene.js')).AdvancedScene:FieldScene;
      const s=window.cityReview=new Scene(document.querySelector('#view'),mode==='water'?'water':'air'),M=window.WindModel;
      window.cityReviewMode=mode;
      const params={...M.defaults,_mode:mode==='water'?'water':'air',units:1,boats:1,upb:1,people:8,wind:4.5};
      s.setEnvironment({weather:'clear',environment:mode==='water'?'park':'roof'},params);
      const pending=[];s.scene.traverse(o=>{if(o.userData.assetReady)pending.push(o.userData.assetReady);});
      await Promise.all([...pending,...s.city.cars.map(c=>c.model_ready),s.assetReady]);
      s.reducedMotion=false;s.distance=170;s.target.set(0,1,0);s.elevation=.83;s.cameraPosition(true);
      window.reviewSample=M.steady(params,params.wind,M.evaluateHardware(params));
      // Seek deterministically to the crossing phase, then render real animation.
      for(let i=0;i<320;i++){s.time=i/10;updateCity(s,.1);}
      await s.renderer.compileAsync(s.scene,s.camera);
      s.render(0,window.reviewSample,false);
      };await window.prepareCityReview('air');
    });
    const results=[];
    for(const [mode,weather] of [['air','clear'],['air','rain'],['air','night'],['water','clear'],['advanced','clear'],['advanced','rain']]){
      results.push(await page.evaluate(async({mode,weather})=>{
        if(window.cityReviewMode!==mode)await window.prepareCityReview(mode);
        const s=window.cityReview,M=window.WindModel,params={...M.defaults,_mode:mode==='water'?'water':'air',units:1,boats:1,upb:1,people:8,rain:weather==='rain'?.8:0};
        s.setEnvironment({weather,environment:mode==='water'?'park':'roof'},params);
        const timings=[],work=[];let last=0;
        await new Promise(resolve=>{
          let frames=0;const tick=now=>{
            const delta=last?Math.min(.1,(now-last)/1000):1/60;
            if(frames>=30)timings.push(now-last);last=now;
            const started=performance.now();s.render(delta,window.reviewSample,true);
            if(frames>=30)work.push(performance.now()-started);
            if(++frames<150)requestAnimationFrame(tick);else resolve();
          };requestAnimationFrame(tick);
        });
        const percentile=(a,p)=>a.slice().sort((a,b)=>a-b)[Math.floor((a.length-1)*p)];
        const gl=s.renderer.getContext(),ext=gl.getExtension('WEBGL_debug_renderer_info');
        if(s.renderer.info.render.calls<100)throw Error('Scene was not rendered; timing would be invalid');
        return {mode,weather,cars:s.city.cars.length,cyclists:s.city.cyclists.length,pedestrians:s.city.pedestrians.length,drawCalls:s.renderer.info.render.calls,
          triangles:s.renderer.info.render.triangles,medianFrameMs:percentile(timings,.5),p95FrameMs:percentile(timings,.95),medianRenderCpuMs:percentile(work,.5),p95RenderCpuMs:percentile(work,.95),
          renderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),allCarsInstalled:s.city.cars.every(c=>c.model),crossingsCompleted:s.city.pedestrians.reduce((a,p)=>a+p.crossingsCompleted,0)};
      },{mode,weather}));
      await page.screenshot({path:path.join(__dirname,'../docs/cars/citywide-'+(mode==='air'?'':mode+'-')+weather+'.png')});
      console.log('RENDER_REVIEW',JSON.stringify(results.at(-1)));
    }
    await page.goto('http://127.0.0.1:5500/');await page.waitForFunction(()=>window.ZW?.states.air.scene?.city);
    const appModes=[];
    for(const mode of ['air','water'])appModes.push(await page.evaluate(async mode=>{
      ZW.switchMode(mode);const s=ZW.state().scene;
      const pending=[];s.scene.traverse(o=>{if(o.userData.assetReady)pending.push(o.userData.assetReady);});
      await Promise.all([...pending,...s.city.cars.map(c=>c.model_ready)]);
      return {mode,cars:s.city.cars.length,cyclists:s.city.cyclists.length,pedestrians:s.city.pedestrians.length,installed:s.city.cars.every(c=>c.model)};
    },mode));
    await page.evaluate(()=>ZW.switchMode('air'));await page.locator('[data-vent-mode="advanced"]').click();
    await page.waitForFunction(()=>ZW.states.air.hybrid.scene?.assembly&&ZW.states.air.hybrid.scene.city.cars.every(c=>c.model));
    appModes.push(await page.evaluate(()=>{const s=ZW.states.air.hybrid.scene;return {mode:'advanced',cars:s.city.cars.length,cyclists:s.city.cyclists.length,pedestrians:s.city.pedestrians.length,installed:s.city.cars.every(c=>c.model)};}));
    fs.writeFileSync(path.join(__dirname,'../docs/cars/citywide-browser-review.json'),JSON.stringify({kind:'Headless Edge, real WebGL, 1280x800 deviceScaleFactor 1; isolated render timings plus actual app mode-switch smoke',results,appModes,errors,limitation:'Timing describes this machine and browser only; no guarantee for other hardware.'},null,2)+'\n');
    console.log(JSON.stringify({results,appModes,errors},null,2));
    if(errors.length)throw Error('Browser errors');
  }finally{await browser.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
