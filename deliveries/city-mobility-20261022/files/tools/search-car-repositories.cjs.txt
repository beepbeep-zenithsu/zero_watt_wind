// Search public repositories for independently distributed, attributable assets.
// A repository software license is never treated as the car model's license.
const fs=require('node:fs');
async function run(){
 const result=[];
 for(const q of ['"Ferrari Roma"','"McLaren GT"','"McLaren Elva"','"Lotus Evija"','"Pininfarina Battista"']){
  const r=await fetch('https://api.github.com/search/repositories?per_page=20&q='+encodeURIComponent(q),{headers:{'User-Agent':'ZeroWatt-car-source-research'},signal:AbortSignal.timeout(60000)});
  if(!r.ok){result.push({query:q,error:r.status});continue;}
  const m=await r.json();result.push({query:q,total:m.total_count,repositories:m.items.map(x=>({name:x.full_name,url:x.html_url,description:x.description,license:x.license?.spdx_id}))});
 }
 fs.writeFileSync('downloads/cars/repository-candidates.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}
run().catch(e=>{console.error(e.message);process.exitCode=1;});
