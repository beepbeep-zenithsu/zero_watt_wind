// Downloads the MediaPipe hand + face models and runtime into vendor/mediapipe/ so Jarvis hand/face control works OFFLINE.
// Run once while online:   npm run get-models     (needs Node 18+)
const fs = require('fs'), path = require('path');
const VER = '0.10.14', CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@' + VER, GCS = 'https://storage.googleapis.com/mediapipe-models/';
const files = [
  [CDN + '/vision_bundle.mjs', 'vision_bundle.mjs'],
  [CDN + '/wasm/vision_wasm_internal.js', 'wasm/vision_wasm_internal.js'],
  [CDN + '/wasm/vision_wasm_internal.wasm', 'wasm/vision_wasm_internal.wasm'],
  [CDN + '/wasm/vision_wasm_nosimd_internal.js', 'wasm/vision_wasm_nosimd_internal.js'],
  [CDN + '/wasm/vision_wasm_nosimd_internal.wasm', 'wasm/vision_wasm_nosimd_internal.wasm'],
  [GCS + 'hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task', 'hand_landmarker.task'],
  [GCS + 'face_landmarker/face_landmarker/float16/1/face_landmarker.task', 'face_landmarker.task']
];
(async () => {
  for (const [url, name] of files) {
    const out = path.join(__dirname, 'vendor', 'mediapipe', name); fs.mkdirSync(path.dirname(out), {recursive: true});
    process.stdout.write('downloading ' + name + ' ... ');
    const r = await fetch(url); if (!r.ok) { console.log('FAILED (' + r.status + ')'); process.exitCode = 1; continue; }
    fs.writeFileSync(out, Buffer.from(await r.arrayBuffer())); console.log('ok');
  }
  console.log('\nDone. Open the site with Live Server (http://localhost...) so the browser may load the local models.');
})();
