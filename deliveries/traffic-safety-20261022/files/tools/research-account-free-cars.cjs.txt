// Public creator search + public Objaverse index. No authenticated downloads or viewer extraction.
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib');
const root=path.resolve(__dirname,'..'),folder=path.join(root,'downloads/cars');
const index=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(folder,'objaverse-object-paths.json.gz'))));
const queries=['jaguar e type','taycan','ferrari roma','mclaren gt','battista','mclaren elva','lotus evija'];
async function run(){
  const all=[];
  for(const query of queries){
    const response=await fetch('https://api.sketchfab.com/v3/search?type=models&count=100&q='+encodeURIComponent(query),{signal:AbortSignal.timeout(60000)});
    if(!response.ok)throw Error('Public creator search HTTP '+response.status);
    const data=await response.json();
    fs.writeFileSync(path.join(folder,'search-'+query.replaceAll(' ','-')+'.json'),JSON.stringify(data,null,2));
    for(const m of data.results || [])all.push({query,uid:m.uid,name:m.name,author:m.user?.displayName,license:m.license?.url,downloadable:m.isDownloadable,archive:index[m.uid]||null,description:m.description,url:m.viewerUrl});
  }
  fs.writeFileSync(path.join(folder,'account-free-candidates.json'),JSON.stringify(all,null,2));
  console.log(JSON.stringify(all.filter(m=>m.archive),null,2));
}
run().catch(e=>{console.error(e.message);process.exitCode=1;});
