const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
async function run(){
 for(const uid of ['32aa25ea6e1b40f395b2aff33ca0a279','875072396ef541e3b106152e6dea6978','000aed7c07034556bc66733d5abb8464']){
  const r=await fetch('https://api.sketchfab.com/v3/models/'+uid,{signal:AbortSignal.timeout(60000)});if(!r.ok)throw Error('Model metadata '+r.status);
  const m=await r.json();fs.writeFileSync(path.join(root,'downloads/cars',uid+'.json'),JSON.stringify(m,null,2));
  console.log(JSON.stringify({uid,name:m.name,author:m.user,license:m.license,description:m.description,triangles:m.faceCount},null,2));
 }
 const r=await fetch('https://api.osf.io/v2/nodes/w2qu9/files/osfstorage/',{signal:AbortSignal.timeout(60000)});
 if(r.ok){const m=await r.json();fs.writeFileSync(path.join(root,'downloads/cars/s3d3c-files.json'),JSON.stringify(m,null,2));console.log('S3D3C files',JSON.stringify(m.data?.map(d=>({name:d.attributes.name,kind:d.attributes.kind,links:d.links,relationships:d.relationships}))))}
 const project=await fetch('https://api.osf.io/v2/nodes/w2qu9/',{signal:AbortSignal.timeout(60000)});
 if(project.ok){const m=await project.json();fs.writeFileSync(path.join(root,'downloads/cars/s3d3c-project.json'),JSON.stringify(m,null,2));console.log('S3D3C PROJECT',JSON.stringify(m.data.attributes));}
}
run().catch(e=>{console.error(e.message);process.exitCode=1;});
