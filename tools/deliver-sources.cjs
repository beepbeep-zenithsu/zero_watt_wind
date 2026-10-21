/* Full source delivery, excluding generated bundles and binary assets. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.join(__dirname,'..'),out=path.join(root,'docs/upgrade');
const modified=['app.js','index.html','package.json','scene.js'];
const integrated=['premium-assets.js'];
const added=['upgrade.css','src/graphics/assets.js','src/graphics/site.js','src/graphics/surfaces.js','src/graphics/ventilation-vfx.js','src/graphics/camera.js',
  'scripts/blender/build_assets.py','scripts/blender/render_review.py','scripts/blender/validate_library.py',
  'tools/run-blender.cjs','tools/verify-graphics.cjs','tools/deliver-sources.cjs','tests/graphics.test.cjs','tests/ui.test.cjs','tests/ventilation.test.cjs',
  'vendor/addons/loaders/GLTFLoader.js','vendor/addons/utils/BufferGeometryUtils.js','vendor/addons/environments/RoomEnvironment.js'];
const inventory=[];
function record(file,kind){
  const b=fs.readFileSync(path.join(root,file));
  inventory.push({path:file,kind,bytes:b.length,sha256:crypto.createHash('sha256').update(b).digest('hex')});
}
let document='# Full final ZeroWatt source delivery\n\nWorkspace files are authoritative. These are complete source files, not diffs.\n\n';
for(const file of [...modified,...integrated,...added]){
  const content=fs.readFileSync(path.join(root,file),'utf8'),extension=path.extname(file);
  const language={'.js':'javascript','.cjs':'javascript','.py':'python','.css':'css','.html':'html','.json':'json'}[extension]||'text';
  // Longer fences keep upstream documentation examples inside the source block.
  document+=`FILE: \`${file}\`\n\n\`\`\`\`\`\`\`\`${language}\n${content}${content.endsWith('\n')?'':'\n'}\`\`\`\`\`\`\`\`\n\n`;
  record(file,modified.includes(file)?'modified source':integrated.includes(file)?'modified pre-existing untracked source':'new source');
}
for(const file of fs.readdirSync(path.join(root,'assets/zw-upgrade'))){
  if(!/\.(glb|blend|json)$/.test(file))continue;
  record('assets/zw-upgrade/'+file,file.endsWith('.glb')?'Blender runtime asset':file.endsWith('.blend')?'Blender editable source':'generated manifest');
}
record('app.bundle.js','generated production bundle');
for(const file of fs.readdirSync(out)){
  if(file==='FILES.json'||file==='SOURCE-DELIVERY.md')continue;
  record('docs/upgrade/'+file,file.endsWith('.png')?'Blender geometry review render':'documentation or verification output');
}
fs.writeFileSync(path.join(out,'SOURCE-DELIVERY.md'),document);
fs.writeFileSync(path.join(out,'FILES.json'),JSON.stringify(inventory,null,2));
console.log(`Delivered ${modified.length+integrated.length+added.length} complete source files; ${inventory.length} inventory entries.`);
