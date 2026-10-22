/* Complete source copies and binary inventory for the installed city upgrade. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),folder=path.join(root,'deliveries/city-mobility-20261022');
const files=[
  'CAR_INTEGRATION_PROGRESS.md','package.json','index.html','scene.js','app.bundle.js','car-showcase.bundle.js',
  'src/cars/car-catalog.js','src/cars/traffic-fleet.js','src/cars/installed-fleet.js',
  'src/graphics/city.js','src/graphics/traffic.js','src/graphics/assets.js','src/graphics/road-network.js','src/graphics/cyclists.js','src/graphics/occupant-layout.js',
  'scripts/blender/prepare_car.py','scripts/blender/make_traffic_lods.py','scripts/blender/test_traffic_lods.py',
  'scripts/blender/build_city_cyclists.py','scripts/blender/prepare_downloaded_traffic.py','scripts/blender/refine_traffic_materials.py','scripts/blender/inspect_traffic_sources.py','scripts/blender/render_mobility_review.py',
  'tools/run-blender.cjs','tools/build-environment.cjs','tools/download-traffic-models.cjs','tools/download-traffic-models.ps1','tools/make-traffic-lods.ps1',
  'tools/validate-traffic-assets.cjs','tools/test-traffic-lods.cjs','tools/verify-graphics.cjs','tools/capture-mobility-review.cjs','tools/update-car-source-report.cjs',
  'tools/deliver-city-mobility.cjs','tools/package-city.ps1','tools/fetch-car-candidate-metadata.cjs','tools/inspect-public-car-repositories.cjs','tools/research-account-free-cars.cjs','tools/search-car-repositories.cjs',
  'tests/fleet.test.cjs','tests/environment.test.cjs','tests/city-mobility.test.cjs','assets/environment/manifest.json',
  'assets/cars/SOURCES.md','assets/cars/CREDITS.html','assets/cars/traffic-sources.json',
  'docs/cars/TRAFFIC-PIPELINE.md','docs/cars/CITY-MOBILITY.md','docs/cars/installed-asset-validation.json','docs/cars/mobility-validation.json','docs/cars/fixture-validation.json'
];
for(const name of fs.readdirSync(path.join(root,'assets/cars/metadata')).filter(n=>n.endsWith('.json')))files.push('assets/cars/metadata/'+name);
for(const id of ['jaguar-e-type','porsche-taycan','de-tomaso-p72'])files.push(`assets/cars/traffic/${id}.report.json`);
const binary=[];
for(const id of ['jaguar-e-type','porsche-taycan','de-tomaso-p72'])for(const suffix of ['-lod0.glb','-lod1.glb','-lod2.glb','.blend'])binary.push(`assets/cars/traffic/${id}${suffix}`);
binary.push('assets/environment/site-cyclist.glb','assets/environment/city-cyclists.blend');
for(const name of ['installed-cars-review.png','cyclist-review.png','workstation-review.png'])binary.push('docs/cars/'+name);
const created=new Set(['src/cars/installed-fleet.js','src/graphics/road-network.js','src/graphics/cyclists.js','src/graphics/occupant-layout.js','scripts/blender/build_city_cyclists.py','scripts/blender/prepare_downloaded_traffic.py','scripts/blender/refine_traffic_materials.py','scripts/blender/inspect_traffic_sources.py','scripts/blender/render_mobility_review.py','tools/deliver-city-mobility.cjs','tools/capture-mobility-review.cjs','tools/update-car-source-report.cjs','tests/city-mobility.test.cjs','assets/cars/CREDITS.html','assets/cars/metadata/acquisition-receipts.json','docs/cars/CITY-MOBILITY.md','docs/cars/installed-asset-validation.json','docs/cars/mobility-validation.json']);
const hash=data=>crypto.createHash('sha256').update(data).digest('hex');
const manifest=[];
for(const file of files){
  const data=fs.readFileSync(path.join(root,file)),copy=path.join(folder,'files',file+'.txt');
  fs.mkdirSync(path.dirname(copy),{recursive:true});fs.writeFileSync(copy,data);
  if(!data.equals(fs.readFileSync(copy)))throw Error('Copy differs: '+file);
  manifest.push({action:created.has(file)?'CREATE':'REPLACE',path:file,textCopy:path.relative(folder,copy).replaceAll('\\','/'),bytes:data.length,sha256:hash(data)});
}
for(const file of binary){const data=fs.readFileSync(path.join(root,file));manifest.push({action:'CREATE',path:file,bytes:data.length,sha256:hash(data)});}
fs.writeFileSync(path.join(folder,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
const link=file=>path.join(root,file).replaceAll('\\','/');
const rows=manifest.filter(m=>m.textCopy).map(m=>`| ${m.action} | ${m.path} | [Full contents](<${path.join(folder,m.textCopy).replaceAll('\\','/')}>) |`).join('\n');
const assets=manifest.filter(m=>!m.textCopy).map(m=>`- [${m.path}](<${link(m.path)}>) (${m.bytes.toLocaleString('en-US')} bytes)`).join('\n');
fs.writeFileSync(path.join(folder,'DELIVERY.md'),`# City traffic, bicycles and workstation delivery

Actual Jaguar E-Type, Porsche Taycan and De Tomaso P72 models are installed across all 18 moving cars. Each type includes three headless Blender-generated LODs and a packed editable Blender source. These are downloaded creator meshes, credited under CC BY 4.0, obtained without an account through the public Objaverse archive. Original source URLs, licenses, modifications and SHA-256 receipts are included.

**The eight-car request remains partially complete: 3/8 car types are installed.** Ferrari Roma, McLaren GT, Pininfarina Battista, McLaren Elva and Lotus Evija still lack an accepted account-free, redistributable download. No other car is labeled as one of these five. See [source evidence](<${link('assets/cars/SOURCES.md')}>).

Ten animated riders pedal bicycles. Cars and bikes use eight routes across the district, share junction reservations and accelerate smoothly. Dry-weather cruising speeds are 7.2 m/s for cars and 4.2 m/s for bicycles; wet and storm conditions slow traffic. The computer now occupies a rear corner with exactly one operator. The other seats stay clear of the desk up to 30 occupants, including the smallest room.

[Download the complete updated project](<${link('ZeroWatt-Premium-City.zip')}>). Extract it, then use the existing server or run npm install and npm start. The ZIP contains all website files, binary assets and these complete source copies under ZeroWatt-City/. The previous full project remains in checkpoints/city-before-mobility-20261022.zip.

Validation: npm run build; 73/73 tests; headless Blender source preparation, nine production LOD exports and fixture round trip; real GLTFLoader placement and wheel checks. Geometry/motion checks and Blender review renders passed. Browser FPS and GPU performance have not been measured. [Validation report](<${link('docs/cars/mobility-validation.json')}>) and [asset checks](<${link('docs/cars/installed-asset-validation.json')}>) are included.

## Actual assets and review images

${assets}

## Complete source files

${files.length} byte-identical full text copies follow. CREATE means add the listed file; REPLACE means replace the entire existing file. Remove the extra .txt extension when copying. Use the ZIP to apply everything together, including the binary models. Do not append these contents to existing files. [SHA-256 inventory](<${path.join(folder,'manifest.json').replaceAll('\\','/')}>) covers the text originals and binary assets.

| Action | Project path | Complete file |
|---|---|---|
${rows}
`);
console.log(`${files.length} complete source copies and ${binary.length} binary assets inventoried: ${path.join(folder,'DELIVERY.md')}`);
