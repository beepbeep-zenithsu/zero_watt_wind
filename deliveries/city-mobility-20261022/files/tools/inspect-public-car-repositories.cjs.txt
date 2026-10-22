const fs=require('node:fs');
async function run(){
 const result=[];
 for(const repo of ['Yig1tt/Ferrari-Roma','KPPVIP/Lotus-Evija-2021']){
  const headers={'User-Agent':'ZeroWatt-car-source-research'};
  const r=await fetch('https://api.github.com/repos/'+repo,{headers,signal:AbortSignal.timeout(60000)});
  if(!r.ok){result.push({repo,error:r.status});continue;}
  const m=await r.json(),tree=await fetch('https://api.github.com/repos/'+repo+'/git/trees/'+m.default_branch+'?recursive=1',{headers,signal:AbortSignal.timeout(60000)});
  const files=await tree.json();result.push({repo,license:m.license,files:files.tree?.map(x=>({path:x.path,size:x.size}))});
 }
 fs.writeFileSync('downloads/cars/repository-inspection.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}
run().catch(e=>{console.error(e.message);process.exitCode=1;});
