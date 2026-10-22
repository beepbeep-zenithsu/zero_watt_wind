param([string]$Only)
$ErrorActionPreference='Stop'
$projectRoot=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$token=Read-Host 'Sketchfab OAuth access token (masked; never saved)' -AsSecureString
$pointer=[IntPtr]::Zero
$previousToken=$env:SKETCHFAB_ACCESS_TOKEN
try {
  $pointer=[Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
  $env:SKETCHFAB_ACCESS_TOKEN=[Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
  $downloadArgs=@((Join-Path $projectRoot 'tools/download-traffic-models.cjs'))
  if ($Only) { $downloadArgs += '--only'; $downloadArgs += $Only }
  & node @downloadArgs
  if ($LASTEXITCODE -ne 0) { throw 'One or more vehicle downloads remain blocked. See the per-car report.' }
} finally {
  $env:SKETCHFAB_ACCESS_TOKEN=$previousToken
  if ($pointer -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer) }
  $token.Dispose()
}
