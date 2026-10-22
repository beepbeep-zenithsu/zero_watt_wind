/* Creator metadata + reviewed public archives, or the official authenticated API.
   Never downloads viewer caches or saves credentials.
   node tools/download-traffic-models.cjs --metadata-only
   The three reviewed Objaverse sources require no account. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {Readable} = require('node:stream');
const {pipeline} = require('node:stream/promises');
const root = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'assets/cars/traffic-sources.json'), 'utf8'));
const args = process.argv.slice(2), metadataOnly = args.includes('--metadata-only');
const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
const metadataDir = path.join(root, 'assets/cars/metadata');
const downloadDir = path.join(root, 'downloads/cars');
const token = process.env.SKETCHFAB_ACCESS_TOKEN;
async function api(url, authenticated = false) {
  const response = await fetch(url, {headers: authenticated ? {Authorization: `Bearer ${token}`} : {}, signal: AbortSignal.timeout(60000)});
  if (!response.ok) throw new Error(response.status === 401 ? 'Official download requires a Sketchfab account/API token.' : `Official API returned HTTP ${response.status}`);
  return response.json();
}
async function run() {
  if (only && !manifest.cars.some(c=>c.id===only)) throw new Error('Unknown car id: ' + only);
  fs.mkdirSync(metadataDir, {recursive:true});
  const result = [];
  for (const car of manifest.cars.filter(c => !only || c.id === only)) {
    try {
      if (!car.source?.uid) throw new Error('No redistribution-cleared source selected.');
      const source = car.source;
      const metadata = await api(`https://api.sketchfab.com/v3/models/${source.uid}`);
      fs.writeFileSync(path.join(metadataDir, `${car.id}.json`), JSON.stringify(metadata, null, 2) + '\n');
      if (metadataOnly) {result.push({id:car.id,status:'metadata-saved',license:metadata.license?.url}); continue;}
      if (!source.verified) throw new Error('Source provenance must be reviewed before downloading.');
      const license = metadata.license?.url?.replace('http:', 'https:');
      if (license !== source.licenseUrl) throw new Error('Current source license differs from the recorded license.');
      if (!metadata.isDownloadable) throw new Error('Creator has disabled downloads.');
      let downloadUrl=source.downloadUrl,ext='.glb';
      if(downloadUrl){
        const prefix='https://huggingface.co/datasets/allenai/objaverse/resolve/main/glbs/';
        if(!downloadUrl.startsWith(prefix)||!downloadUrl.endsWith('/'+source.uid+'.glb'))throw new Error('Unreviewed public download source.');
      }else{
        if (!token) throw new Error('No reviewed account-free URL; official download requires OAuth authentication.');
        const links = await api(`https://api.sketchfab.com/v3/models/${source.uid}/download`, true);
        const item = links.glb || links.gltf;
        if (!item?.url || new URL(item.url).protocol !== 'https:') throw new Error('API supplied no supported HTTPS download.');
        downloadUrl=item.url;ext=links.glb===item?'.glb':'.zip';
      }
      fs.mkdirSync(downloadDir, {recursive:true});
      const filename=source.originalFile || car.id+ext;
      if(path.basename(filename)!==filename)throw new Error('Invalid original filename');
      const file = path.join(downloadDir, filename);
      if(fs.existsSync(file)){
        const hash=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
        if(hash!==source.originalSha256)throw new Error('Existing source differs; preserve it for inspection.');
        result.push({id:car.id,status:'already-downloaded',file:path.relative(root,file),sha256:hash});continue;
      }
      const response = await fetch(downloadUrl, {signal:AbortSignal.timeout(300000)});
      if (!response.ok) throw new Error(`Asset download returned HTTP ${response.status}`);
      const partial = file + '.partial';
      await pipeline(Readable.fromWeb(response.body), fs.createWriteStream(partial, {flags:'wx'}));
      fs.renameSync(partial, file);
      const sha256 = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
      if(source.originalSha256&&source.originalSha256!==sha256)throw new Error('Downloaded source differs from the reviewed hash; inspect before using.');
      fs.writeFileSync(file + '.receipt.json', JSON.stringify({id:car.id,source:source.url,license,sha256,bytes:fs.statSync(file).size,downloadedAt:new Date().toISOString()}, null, 2) + '\n');
      result.push({id:car.id,status:'downloaded',file:path.relative(root,file),sha256});
    } catch (error) {result.push({id:car.id,status:'blocked',reason:error.message});}
  }
  console.log(JSON.stringify(result, null, 2));
  if (result.some(r => r.status === 'blocked')) process.exitCode = 1;
}
run().catch(error => {console.error(error.message);process.exitCode=1;});
