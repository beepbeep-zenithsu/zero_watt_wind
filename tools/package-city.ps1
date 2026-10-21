$ErrorActionPreference='Stop'
$projectPath=[System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$deliveryPath=Join-Path $projectPath 'ZeroWatt-Premium-City.zip'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$stream=[System.IO.File]::Open($deliveryPath,[System.IO.FileMode]::Create)
$archive=[System.IO.Compression.ZipArchive]::new($stream,[System.IO.Compression.ZipArchiveMode]::Create,$false)
try {
  $files=Get-ChildItem -LiteralPath $projectPath -Recurse -File -Force | Where-Object {
    $relative=[System.IO.Path]::GetRelativePath($projectPath,$_.FullName)
    $relative -notmatch '^(node_modules|\.git|\.upgrade-baseline|checkpoints)(\\|/)' -and
    $_.Extension -ne '.zip' -and $_.Name -notmatch '\.blend[0-9]+$'
  }
  foreach($file in $files){
    $relative=[System.IO.Path]::GetRelativePath($projectPath,$file.FullName).Replace('\','/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive,$file.FullName,"ZeroWatt-City/$relative",'Optimal') | Out-Null
  }
}finally{$archive.Dispose();$stream.Dispose()}
$check=[System.IO.Compression.ZipFile]::OpenRead($deliveryPath)
try {
  foreach($required in @('index.html','app.bundle.js','CITY_UPGRADE_PROGRESS.md','HYBRID-GUIDE.md','assets/environment/city-vehicles.blend','assets/environment/city-people.blend','assets/environment/city-bicycle.blend','assets/environment/site-library.blend','assets/hybrid/hybrid-assembly.blend','src/graphics/traffic.js')){
    if(!$check.GetEntry("ZeroWatt-City/$required")){throw "Missing archive entry: $required"}
  }
  [PSCustomObject]@{Path=$deliveryPath;Files=$check.Entries.Count;Bytes=(Get-Item -LiteralPath $deliveryPath).Length}
}finally{$check.Dispose()}
