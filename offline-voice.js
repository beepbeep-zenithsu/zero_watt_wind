/* Local English speech recognition. Audio stays in this browser; Vosk runs in a worker. */
(() => {
  'use strict';
  let runtimePromise;
  function loadRuntime() {
    if (window.Vosk) return Promise.resolve(window.Vosk);
    if (!runtimePromise) runtimePromise = new Promise((resolve, reject) => {
      const script = document.createElement('script'); script.src = 'vendor/vosk/vosk.js';
      script.onload = () => window.Vosk ? resolve(window.Vosk) : reject(new Error('Offline voice runtime did not initialise'));
      script.onerror = () => { script.remove(); reject(new Error('Missing vendor/vosk/vosk.js — extract the complete updated ZIP')); };
      document.head.append(script);
    }).catch(e => { runtimePromise = null; throw e; });
    return runtimePromise;
  }
  async function start({stream, audioContext, signal, onStatus = () => {}, onPartial = () => {}, onFinal = () => {}, onError = () => {}}) {
    let stopped = false, model, recognizer, source, processor, mute, timer, rejectPending;
    const ownContext = !audioContext;
    const context = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    const aborted = () => new DOMException('Voice startup cancelled', 'AbortError');
    function stop() {
      if (stopped) return; stopped = true; clearTimeout(timer);
      signal?.removeEventListener('abort', stop); rejectPending?.(aborted());
      if (processor) { processor.onaudioprocess = null; processor.disconnect(); }
      source?.disconnect(); mute?.disconnect();
      try { recognizer?.remove(); } catch (e) {}
      model?.terminate();
      if (ownContext) context.close().catch(() => {});
    }
    signal?.addEventListener('abort', stop, {once:true});
    function wait(promise, ms, message) {
      return new Promise((resolve, reject) => {
        rejectPending = reject;
        timer = setTimeout(() => reject(new Error(message)), ms);
        Promise.resolve(promise).then(resolve, reject);
      }).finally(() => { clearTimeout(timer); rejectPending = null; });
    }
    try {
      if (signal?.aborted) throw aborted();
      await wait(context.resume(), 8000, 'Audio is suspended. Click Voice off and on to resume it.');
      if (stopped) throw aborted();
      onStatus('Loading offline English speech engine…');
      const Vosk = await wait(loadRuntime(), 15000, 'Offline voice runtime timed out. Reload the page.');
      if (stopped) throw aborted();
      model = new Vosk.Model(new URL('vendor/vosk/english-small.tar.gz', document.baseURI).href, -1);
      await wait(new Promise((resolve, reject) => {
        model.on('load', message => message.result ? resolve() : reject(new Error('Offline English model could not load')));
        model.on('error', message => reject(new Error(message.error || 'Offline model error')));
      }), 90000, 'Offline English model timed out. Keep vendor/vosk/ in the extracted folder.');
      if (stopped) throw aborted();
      recognizer = new model.KaldiRecognizer(context.sampleRate);
      recognizer.on('partialresult', message => { if (!stopped) onPartial(message.result?.partial || ''); });
      recognizer.on('result', message => { if (!stopped) onFinal(message.result?.text || ''); });
      model.on('error', message => { if (!stopped) { onError(new Error(message.error || 'Offline recognition failed')); stop(); } });
      source = context.createMediaStreamSource(stream);
      processor = context.createScriptProcessor(4096, 1, 1);
      mute = context.createGain(); mute.gain.value = 0;
      processor.onaudioprocess = event => {
        if (stopped) return;
        try { recognizer.acceptWaveform(event.inputBuffer); }
        catch (e) { onError(e); stop(); }
      };
      source.connect(processor); processor.connect(mute); mute.connect(context.destination);
      onStatus('Offline English ready — say one command, then pause');
      return {stop};
    } catch (e) { stop(); throw e; }
  }
  window.LocalVoice = {start};
})();
