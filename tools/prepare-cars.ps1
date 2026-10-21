# Runs scripts\blender\prepare_car.py for every car whose source file exists in downloads\cars\<id>.<ext>
# Usage (project root):  powershell -ExecutionPolicy Bypass -File tools\prepare-cars.ps1
#        one car only:   powershell -ExecutionPolicy Bypass -File tools\prepare-cars.ps1 -Only jaguar-e-type
param([string]$Blender = $env:BLENDER_PATH, [string]$Source = 'downloads\cars', [string[]]$Only)
if (-not $Blender) { $Blender = 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' }
$root = Split-Path -Parent $PSScriptRoot
# Keep lengths in sync with src\cars\car-catalog.js. Change 'front' if the preview shows the car backwards or sideways.
$cars = @(
  @{id='jaguar-e-type';        length=4.45; front='-Y'},
  @{id='porsche-taycan';       length=4.96; front='-Y'},
  @{id='ferrari-roma';         length=4.66; front='-Y'},
  @{id='mclaren-gt';           length=4.68; front='-Y'},
  @{id='pininfarina-battista'; length=4.91; front='-Y'},
  @{id='de-tomaso-p72';        length=4.55; front='-Y'},
  @{id='mclaren-elva';         length=4.61; front='-Y'},
  @{id='lotus-evija';          length=4.69; front='-Y'}
)
foreach ($c in $cars) {
  if ($Only -and ($Only -notcontains $c.id)) { continue }
  $file = Get-ChildItem -Path (Join-Path $root $Source) -Filter ($c.id + '.*') -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Extension -in '.glb', '.gltf', '.fbx', '.obj', '.blend' } | Select-Object -First 1
  if (-not $file) { Write-Warning ('No source file for ' + $c.id + ' in ' + $Source); continue }
  & $Blender --background --python (Join-Path $root 'scripts\blender\prepare_car.py') -- `
    --input $file.FullName --output (Join-Path $root ('assets\cars\' + $c.id + '.glb')) --length $c.length --front $c.front
  if ($LASTEXITCODE -ne 0) { Write-Error ('Blender failed for ' + $c.id) }
}