const {test}=require('node:test'), assert=require('node:assert/strict');
const {JSDOM}=require('jsdom'), fs=require('node:fs'), path=require('node:path');
const code=fs.readFileSync(path.join(__dirname,'..','offline-voice.js'),'utf8');
function setup({hold=false, fail=false}={}) {
  const dom=new JSDOM('',{url:'http://localhost:5500',runScripts:'outside-only'}), w=dom.window;
  let model, recognizer, processor, disconnected=0;
  const node=()=>({connect(){},disconnect(){disconnected++;}});
  const context={sampleRate:48000,destination:{},resume:async()=>{},createMediaStreamSource:node,
    createScriptProcessor(){processor={...node(),onaudioprocess:null};return processor;},createGain:()=>({...node(),gain:{value:1}})};
  w.Vosk={Model:class {
    constructor(){model=this;this.handlers={};this.terminated=false;
      this.KaldiRecognizer=class {constructor(rate){assert.equal(rate,48000);recognizer=this;this.handlers={};this.buffers=[];}on(e,cb){this.handlers[e]=cb;}acceptWaveform(b){this.buffers.push(b);}remove(){this.removed=true;}};
      if(!hold) Promise.resolve().then(()=>this.handlers[fail?'error':'load'](fail?{error:'bad model'}:{result:true}));
    }
    on(e,cb){this.handlers[e]=cb;}terminate(){this.terminated=true;}
  }};
  w.eval(code);
  return {w,dom,context,get model(){return model;},get recognizer(){return recognizer;},get processor(){return processor;},get disconnected(){return disconnected;}};
}
test('offline engine forwards audio, previews and finals, and disconnects everything on stop',async()=>{
  const f=setup(), partial=[],final=[];
  const voice=await f.w.LocalVoice.start({stream:{},audioContext:f.context,onPartial:t=>partial.push(t),onFinal:t=>final.push(t)});
  const buffer={};f.processor.onaudioprocess({inputBuffer:buffer});assert.equal(f.recognizer.buffers[0],buffer);
  f.recognizer.handlers.partialresult({result:{partial:'set wind'}});f.recognizer.handlers.result({result:{text:'set wind to seven'}});
  assert.deepEqual(partial,['set wind']);assert.deepEqual(final,['set wind to seven']);voice.stop();
  assert.ok(f.model.terminated && f.recognizer.removed);assert.equal(f.processor.onaudioprocess,null);assert.equal(f.disconnected,3);
  f.recognizer.handlers.result({result:{text:'increase wind'}});assert.equal(final.length,1);f.dom.window.close();
});
test('aborting model load terminates the worker and rejects startup',async()=>{
  const f=setup({hold:true}), abort=new f.w.AbortController();
  const pending=f.w.LocalVoice.start({stream:{},audioContext:f.context,signal:abort.signal});
  for(let i=0;i<15;i++)await Promise.resolve();assert.ok(f.model);abort.abort();
  await assert.rejects(pending,{name:'AbortError'});assert.ok(f.model.terminated);f.dom.window.close();
});
test('bad offline models report failure and terminate their worker',async()=>{
  const f=setup({fail:true});await assert.rejects(f.w.LocalVoice.start({stream:{},audioContext:f.context}),/bad model/);
  assert.ok(f.model.terminated);f.dom.window.close();
});
