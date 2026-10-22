const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),folder=path.join(root,'assets/cars');
const config=JSON.parse(fs.readFileSync(path.join(folder,'traffic-sources.json'),'utf8'));
const installed=config.cars.filter(c=>c.source?.downloadUrl&&fs.existsSync(path.join(folder,'traffic',c.id+'.report.json')));
const receipts=installed.map(c=>{
 const file=path.join(root,'downloads/cars',c.source.originalFile);
 const bytes=fs.readFileSync(file),hash=crypto.createHash('sha256').update(bytes).digest('hex');
 if(hash!==c.source.originalSha256)throw Error('Original car hash differs: '+c.id);
 return {id:c.id,model:c.source.title,author:c.source.author,creatorUrl:c.source.url,license:c.source.license,licenseUrl:c.source.licenseUrl,
   provider:'Allen Institute Objaverse',providerUrl:'https://huggingface.co/datasets/allenai/objaverse',downloadUrl:c.source.downloadUrl,
   authenticated:false,downloadedDate:'2026-10-22',file:c.source.originalFile,bytes:bytes.length,sha256:hash};
});
fs.writeFileSync(path.join(folder,'metadata/acquisition-receipts.json'),JSON.stringify(receipts,null,2)+'\n');
const historical=path.join(folder,'metadata/download-access.json');
const access=JSON.parse(fs.readFileSync(historical));access.context='Historical API-only attempt. Three real models were subsequently downloaded without accounts from licensed public archives; see acquisition-receipts.json.';
fs.writeFileSync(historical,JSON.stringify(access,null,2)+'\n');
const rows=receipts.map(r=>`| ${r.model} | ${r.author} | [Creator](${r.creatorUrl}) | [Public GLB](${r.downloadUrl}) |`).join('\n');
fs.writeFileSync(path.join(folder,'SOURCES.md'),`# Vehicle models — 22 October 2026

**Three genuine types are installed and replace all 18 moving traffic cars.**
The requested eight-car catalog is retained; five types remain uninstalled.
Pending names are never attached to another car's mesh. Current moving traffic
uses the actual Jaguar E-Type, Porsche Taycan and De Tomaso P72.

## Installed account-free downloads

| Model | Creator | Original listing | Download actually used |
|---|---|---|---|
${rows}

All three creator listings declare [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
Public creator metadata is saved in metadata/<id>.json. The exact UIDs were located
in the Allen Institute's published Objaverse index and downloaded without accounts.
No viewer cache was extracted. Original file hashes, sizes, URLs and licenses are
in metadata/acquisition-receipts.json. Optimized export hashes are in traffic/<id>.report.json.

The [Objaverse collection](https://huggingface.co/datasets/allenai/objaverse) is
under [ODC-By 1.0](https://opendatacommons.org/licenses/by/1-0/); individual objects
retain their creator licenses. Collection credit: Matt Deitke et al.,
**Objaverse: A Universe of Annotated 3D Objects**, 2022.

Modifications: scale, grounding/orientation, disconnected wheel separation and
animation, geometry/texture reduction and three LODs. Jaguar paint/normals were
refined. Taycan's source materials were white and untextured; semantic PBR colors
were restored and normals refined. Original bodies and UVs were retained.
Editable normalized .blend files and the three GLBs per model are in traffic/.

Credits are embedded in the GLBs and exposed in the website Credits page and car
showcase. Preserve CREDITS.html, this file, metadata and reports with redistributed
files. Model licenses do not imply manufacturer endorsement or confer trademark rights.

## Remaining five exact models

- **Ferrari Roma:** kulonee's CC-BY listing is verified, but no accepted account-free
  distribution was located. The public Yig1tt/Ferrari-Roma repository has no mesh
  files. RD Studio's free Revit family prohibits redistribution.
- **McLaren GT:** no cleared account-free mesh found. 3D CAD Browser prohibits
  source redistribution; game-derived listings were rejected.
- **Pininfarina Battista:** no cleared account-free mesh found. Several free
  listings explicitly derive from CSR2 or lack usable redistribution evidence.
- **McLaren Elva:** ZIRODESIGN's original UID 000aed7c07034556bc66733d5abb8464 is
  indexed under by/ in the university S3D3C records. Its public OSF project
  description requires contacting authors for model access; only metadata and
  paths are public. No message was sent. Current creator download is disabled.
- **Lotus Evija:** Eliot-M-Digital-Design links to a purchase. The public KPPVIP
  GitHub repository contains GTA files without a model license; not used.

Relevant primary pages:
[Roma](https://sketchfab.com/3d-models/low-poly-ferrari-roma-d830f729e0e64450b8dbe0ad16443ea5),
[Elva archive project](https://osf.io/w2qu9/),
[McLaren GT terms](https://www.3dcadbrowser.com/3d-model/mclaren-gt-2020),
[Evija creator](https://sketchfab.com/3d-models/lotus-evija-onyx-c5bf7b4cca884410a368a10c07ae11e0).

A separate Jaguar restoration scan was downloaded for inspection and rejected in
favor of Nommoc's complete authored car. The more recent Mikhail Hamanovich Taycan
was absent from the public archive; the installed Taycan is martin002's model.
Artist/UID changes are explicit. Research also checked creator listings, Hugging
Face, S3D3C, GitHub, RD Studio and model marketplaces. A download button or code
repository license was not treated as proof of model rights.

metadata/download-access.json preserves the earlier authenticated-API failure;
it does not describe the later successful public-archive downloads.
`);
console.log('Recorded '+receipts.length+' actual account-free source receipts and credits.');
