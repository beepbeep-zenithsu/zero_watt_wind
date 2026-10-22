const {spawnSync}=require('node:child_process');
for(const script of ['build_environment.py','build_city_architecture.py','build_city_vehicles.py','build_city_people.py','build_city_bicycles.py','build_city_cyclists.py']){
  const result=spawnSync(process.execPath,['tools/run-blender.cjs',`scripts/blender/${script}`],{stdio:'inherit',windowsHide:true});
  if(result.error)throw result.error;
  if(result.status!==0)process.exit(result.status??1);
}
