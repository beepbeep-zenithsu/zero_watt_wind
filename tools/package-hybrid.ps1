$ErrorActionPreference = 'Stop'
$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$deliveryPath = Join-Path $projectRoot 'ZeroWatt-Wind-Hybrid.zip'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$stream = [System.IO.File]::Open($deliveryPath, [System.IO.FileMode]::Create)
$archive = [System.IO.Compression.ZipArchive]::new($stream, [System.IO.Compression.ZipArchiveMode]::Create, $false)
try {
    $files = Get-ChildItem -LiteralPath $projectRoot -Recurse -File -Force | Where-Object {
        $relativeName = [System.IO.Path]::GetRelativePath($projectRoot, $_.FullName)
        $relativeName -notmatch '^(node_modules|\.git|\.upgrade-baseline)(\\|/)' -and
        $_.Extension -ne '.zip' -and $_.Name -notmatch '\.blend[0-9]+$'
    }
    foreach ($file in $files) {
        $relativeName = [System.IO.Path]::GetRelativePath($projectRoot, $file.FullName).Replace('\', '/')
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $file.FullName, "ZeroWatt-Wind/$relativeName", [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
    }
} finally {
    $archive.Dispose()
    $stream.Dispose()
}
$check = [System.IO.Compression.ZipFile]::OpenRead($deliveryPath)
try {
    foreach ($required in @('app.bundle.js','HYBRID-GUIDE.md','assets/hybrid/hybrid-assembly.glb','assets/hybrid/hybrid-assembly.blend','src/advanced/hybrid-model.js')) {
        if ($null -eq $check.GetEntry("ZeroWatt-Wind/$required")) { throw "Missing archive entry: $required" }
    }
    [PSCustomObject]@{ Path=$deliveryPath; Files=$check.Entries.Count; Bytes=(Get-Item -LiteralPath $deliveryPath).Length }
} finally { $check.Dispose() }
