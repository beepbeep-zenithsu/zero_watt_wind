// Optional refresh of the bundled, offline English speech engine. Node 18+.
const fs = require('node:fs/promises'), path = require('node:path');
const files = [
  ['https://cdn.jsdelivr.net/npm/vosk-browser@0.0.8/dist/vosk.js', 'vosk.js'],
  ['https://ccoreilly.github.io/vosk-browser/models/vosk-model-small-en-us-0.15.tar.gz', 'english-small.tar.gz']
];
(async () => {
  const dir = path.join(__dirname, 'vendor', 'vosk'); await fs.mkdir(dir, {recursive:true});
  for (const [url, name] of files) {
    console.log('Downloading ' + name + '…');
    const r = await fetch(url); if (!r.ok) throw new Error(name + ': HTTP ' + r.status);
    const out = path.join(dir, name); await fs.writeFile(out + '.part', Buffer.from(await r.arrayBuffer()));
    await fs.rename(out + '.part', out); console.log(name + ' ready');
  }
})().catch(e => { console.error('Offline voice download failed:', e.message); process.exitCode = 1; });
