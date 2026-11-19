param(
  [Parameter(Mandatory=$true)][string]$Name,
  [Parameter(Mandatory=$true)][string]$Image
)
$ErrorActionPreference = 'Stop'
$root = 'E:\ai-workspaces\uni-app'
$scratch = Join-Path $root ".scratch\screen\$Name"
New-Item -ItemType Directory -Force $scratch | Out-Null
python "$root\tools\screen\slice.py" $Image "$scratch" | Out-File "$scratch\chunks.json" -Encoding utf8
powershell -NoProfile -File "$root\tools\screen\ocr.ps1" -Manifest "$scratch\chunks.json" -Out "$scratch\lines.json"
python "$root\tools\screen\analyze.py" $Image "$scratch\lines.json" "$scratch\analysis.json"
Write-Output "OK $scratch\analysis.json"
