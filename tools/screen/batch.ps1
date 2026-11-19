param(
  [string]$Dir = "",
  [string]$Out = "docs/screens"
)

$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $root
if (-not $Dir) {
  $Dir = Join-Path "images" ([string][char]0x9875 + [char]0x9762)
}
New-Item -ItemType Directory -Force $Out | Out-Null

$files = Get-ChildItem $Dir -File -Filter *.png |
  Where-Object { $_.Name -match '_(\d{3})_772\.png$' } |
  Sort-Object Name

$ok = 0
$fail = @()
foreach ($f in $files) {
  $n = [regex]::Match($f.Name, '_(\d{3})_772\.png$').Groups[1].Value
  Write-Output "OCR $n $($f.Name)"
  powershell -NoProfile -File tools\screen\scan.ps1 -Name $n -Image $f.FullName | Out-Null
  $json = ".scratch\screen\$n\analysis.json"
  if (Test-Path $json) {
    Copy-Item $json (Join-Path $Out "$n.json") -Force
    $ok++
  } else {
    $fail += $n
  }
}

Write-Output "done ok=$ok fail=$($fail -join ',')"
