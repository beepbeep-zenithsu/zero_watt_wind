const fs=require('node:fs'),{spawnSync}=require('node:child_process');
const installed='C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe';
const executable=process.env.BLENDER_PATH||(fs.existsSync(installed)?installed:'blender');
const script=process.argv[2];
if(!script)throw new Error('Pass a Blender Python script path.');
const result=spawnSync(executable,['--background','--python',script],{stdio:'inherit',windowsHide:true});
if(result.error)throw result.error;
process.exitCode=result.status??1;
