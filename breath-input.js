/* Local breath-noise input. Lip confirmation is applied by Jarvis, separately. */
(function(root,factory){
  if(typeof module==='object'&&module.exports) module.exports=factory();
  else root.BreathInput=factory();
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  /* Features of one short block of microphone samples.
     rms         - loudness (DC removed)
     periodicity - 0..1, how strongly the sound repeats at a voice pitch (85-400 Hz) AND keeps repeating one period later.
                   Voices and hums score high; blown air (random turbulence, also its low rumble) scores low.
     Blowing on a microphone is mostly low-frequency rumble. A plain autocorrelation would read that rumble as "periodic",
     so the signal is pre-emphasised first (flattening the spectrum) and a real pitch must repeat at twice its period too. */
  function analyse(input,sampleRate){
    const hop=Math.max(1,Math.floor(sampleRate/12000)), n=Math.floor(input.length/hop), a=new Float32Array(n);
    let mean=0,energy=0;
    for(let i=0;i<n;i++){let m=0;for(let k=0;k<hop;k++)m+=input[i*hop+k];a[i]=m/hop;mean+=a[i];} mean/=n;
    for(let i=0;i<n;i++){a[i]-=mean;energy+=a[i]*a[i];}
    const rms=Math.sqrt(energy/n); let periodicity=0;
    if(rms>.0005){
      const d=new Float32Array(n); for(let i=1;i<n;i++)d[i]=a[i]-.95*a[i-1];
      const rate=sampleRate/hop, lo=Math.max(2,Math.floor(rate/400)), hi=Math.min(Math.floor(n*.45),Math.floor(rate/85));
      const corr=lag=>{let c=0,x=0,y=0;for(let i=lag;i<n;i++){c+=d[i]*d[i-lag];x+=d[i]*d[i];y+=d[i-lag]*d[i-lag];}return c/Math.sqrt(x*y||1);};
      let best=0,bestLag=0;
      for(let lag=lo;lag<=hi;lag++){const c=corr(lag);if(c>best){best=c;bestLag=lag;}}
      periodicity=best;
      if(bestLag&&bestLag*2<n*.7){                    // a real pitch is still there one period later; random low-passed rumble is not
        let second=0;for(let l=bestLag*2-1;l<=bestLag*2+1;l++)second=Math.max(second,corr(l));
        periodicity=Math.min(best,Math.max(0,second)/.75);
      }
    }
    return {rms,periodicity};
  }
  async function start({signal,onSample=()=>{},onError=()=>{}}={}){
    const Audio=window.AudioContext||window.webkitAudioContext;
    if(!Audio||!navigator.mediaDevices?.getUserMedia) throw new Error('Microphone audio is unavailable in this browser.');
    const context=new Audio(); let stream,source,analyser,mute,timer,timeout,stopped=false;
    const aborted=()=>new DOMException('Breath input cancelled','AbortError');
    function stop(){
      if(stopped)return;stopped=true;clearInterval(timer);clearTimeout(timeout);
      signal?.removeEventListener('abort',stop);source?.disconnect();analyser?.disconnect();mute?.disconnect();
      stream?.getTracks().forEach(t=>{t.onended=null;t.stop();});context.close().catch(()=>{});
    }
    signal?.addEventListener('abort',stop,{once:true});
    try{
      if(signal?.aborted)throw aborted();
      await context.resume();
      const request=navigator.mediaDevices.getUserMedia({audio:{channelCount:1,echoCancellation:false,noiseSuppression:false,autoGainControl:false}}).then(s=>{
        if(stopped){s.getTracks().forEach(t=>t.stop());throw aborted();}return s;
      });
      stream=await Promise.race([request,new Promise((_,reject)=>{timeout=setTimeout(()=>reject(new Error('Microphone permission is pending. Allow it, then enable Blow again.')),12000);})]);
      clearTimeout(timeout);if(stopped)throw aborted();
      if(context.state!=='running')throw new Error('Audio is suspended. Enable Blow again to resume it.');
      source=context.createMediaStreamSource(stream);analyser=context.createAnalyser();analyser.fftSize=2048;
      mute=context.createGain();mute.gain.value=0;source.connect(analyser);analyser.connect(mute);mute.connect(context.destination);
      const samples=new Float32Array(analyser.fftSize);
      const fail=e=>{if(!stopped){stop();onError(e);}};
      stream.getTracks().forEach(t=>t.onended=()=>fail(new Error('Microphone disconnected.')));
      timer=setInterval(()=>{
        if(stopped)return;
        try{analyser.getFloatTimeDomainData(samples);onSample({...analyse(samples,context.sampleRate),at:performance.now()});}
        catch(e){fail(e);}
      },80);
      return {stop};
    }catch(e){stop();throw e;}
  }
  return {analyse,start};
});