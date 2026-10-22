/* Complete byte-for-byte text copies, not patches. Regenerate after source edits. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),folder=path.join(root,'deliveries/traffic-lods-20261022');
const files=[
  'CAR_INTEGRATION_PROGRESS.md','package.json','app.bundle.js','car-showcase.bundle.js',
  'src/cars/car-catalog.js','src/cars/traffic-fleet.js','src/cars/installed-fleet.js',
  'scripts/blender/prepare_car.py','scripts/blender/make_traffic_lods.py','scripts/blender/test_traffic_lods.py',
  'tools/download-traffic-models.cjs','tools/download-traffic-models.ps1','tools/make-traffic-lods.ps1',
  'tools/validate-traffic-assets.cjs','tools/test-traffic-lods.cjs','tools/package-city.ps1','tools/deliver-traffic-pipeline.cjs',
  'tests/fleet.test.cjs','assets/cars/SOURCES.md','assets/cars/traffic-sources.json',
  'assets/cars/metadata/jaguar-e-type.json','assets/cars/metadata/porsche-taycan.json',
  'assets/cars/metadata/ferrari-roma.json','assets/cars/metadata/de-tomaso-p72.json','assets/cars/metadata/download-access.json',
  'docs/cars/TRAFFIC-PIPELINE.md','docs/cars/fixture-validation.json'
];
const replace=new Set(['CAR_INTEGRATION_PROGRESS.md','package.json','app.bundle.js','car-showcase.bundle.js',
  'src/cars/car-catalog.js','src/cars/traffic-fleet.js','scripts/blender/prepare_car.py','tests/fleet.test.cjs','tools/package-city.ps1']);
const hash=data=>crypto.createHash('sha256').update(data).digest('hex');
const manifest=[];
for(const file of files){
  const content=fs.readFileSync(path.join(root,file)),destination=path.join(folder,'files',file+'.txt');
  fs.mkdirSync(path.dirname(destination),{recursive:true});fs.writeFileSync(destination,content);
  if(!content.equals(fs.readFileSync(destination)))throw Error('Text copy differs: '+file);
  manifest.push({action:replace.has(file)?'REPLACE':'CREATE',path:file,textCopy:path.relative(folder,destination).replaceAll('\\','/'),bytes:content.length,sha256:hash(content)});
}
fs.writeFileSync(path.join(folder,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
const link=file=>path.join(folder,file).replaceAll('\\','/');
const rows=manifest.map(m=>`| ${m.action} | ${m.path} | [Complete file](<${link(m.textCopy)}>) |`).join('\n');
fs.writeFileSync(path.join(folder,'DELIVERY.md'),`# Complete updated traffic pipeline files

**Eight-car replacement remains unfinished: 0/8 requested meshes are downloaded or installed.**
This delivery contains the implemented and tested acquisition/Blender/LOD/runtime pipeline,
source evidence and credits. No technical fixture is presented as a branded car.
Four CC-BY candidates require authenticated downloads; four sources remain unresolved.

${manifest.length} full byte-identical text copies are linked below. Copy each file's ENTIRE
contents to its listed project path (remove the final .txt extension). CREATE means a
new file; REPLACE means replace the full existing file. Do not paste these into an
existing file as an appended snippet. Parent folders must exist or be created.

| Action | Project path | Full contents |
|---|---|---|
${rows}

[SHA-256/byte manifest](<${link('manifest.json')}>) records every complete text copy.
The complete project is also in [ZeroWatt-Premium-City.zip](<${path.join(root,'ZeroWatt-Premium-City.zip').replaceAll('\\','/')}>),
under ZeroWatt-City/. It preserves prior simulation files and assets. Technical fixture
meshes and unreviewed downloads are excluded. The previous full ZIP is preserved at
checkpoints/city-before-traffic-lods-20261022.zip.

Validation: npm run build passed; npm test passed 70/70. Blender 5.2.2 headlessly built
three levels from an original technical fixture (6,784/1,936/580 triangles), including
embedded texture limits, four wheel groups, credit/hash checks and GLTFLoader placement.
The PowerShell driver passed the same fixture. Authenticated asset downloads and actual
eight-car visual/GPU performance remain untested. Installed fleet registry is empty.

Use docs/cars/TRAFFIC-PIPELINE.md for acquisition/configuration/build commands and
CAR_INTEGRATION_PROGRESS.md for the exact remaining work. Previous state is retained in
previous-car-progress.md in this folder. After applying these files, npm run build and
npm start keep the current website usable with its existing moving traffic.
`);
console.log(`${manifest.length} complete copies verified: ${path.join(folder,'DELIVERY.md')}`);
