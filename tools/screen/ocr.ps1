param(
  [Parameter(Mandatory=$true)][string]$Manifest,
  [Parameter(Mandatory=$true)][string]$Out
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Runtime.WindowsRuntime
[Windows.Storage.StorageFile,Windows.Storage,ContentType=WindowsRuntime] | Out-Null
[Windows.Media.Ocr.OcrEngine,Windows.Foundation,ContentType=WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder,Windows.Foundation,ContentType=WindowsRuntime] | Out-Null
[Windows.Globalization.Language,Windows.Foundation,ContentType=WindowsRuntime] | Out-Null

$script:asTask = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 })[0]
function Await-Op($op, [type]$t, [string]$tag) {
  $m = $script:asTask.MakeGenericMethod($t)
  $task = $m.Invoke($null, @($op))
  try { $task.Wait() } catch {
    $ie = $task.Exception.InnerException
    throw "OCR step '$tag' failed: $($ie.GetType().FullName): $($ie.Message)"
  }
  return $task.Result
}

$lang = New-Object Windows.Globalization.Language -ArgumentList 'zh-Hans-CN'
$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage($lang)
if ($null -eq $engine) { $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages() }
if ($null -eq $engine) { throw 'OCR engine unavailable' }

$chunks = (Get-Content $Manifest -Raw -Encoding UTF8 | ConvertFrom-Json).chunks
$all = @()
foreach ($c in $chunks) {
  $file = Await-Op ([Windows.Storage.StorageFile]::GetFileFromPathAsync($c.path)) ([Windows.Storage.StorageFile])
  $stream = Await-Op ($file.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
  $decoder = Await-Op ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
  $bitmap = Await-Op ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
  $result = Await-Op ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])
  $li = 0
  foreach ($line in $result.Lines) {
    foreach ($w0 in $line.Words) {
      $r = $w0.BoundingRect
      $all += [pscustomobject]@{
        text = $w0.Text
        line = $li
        x = [math]::Round($r.X, 1)
        y = [math]::Round($r.Y + $c.yOffset, 1)
        w = [math]::Round($r.Width, 1)
        h = [math]::Round($r.Height, 1)
      }
    }
    $li++
  }
  $stream.Dispose()
}
($all | ConvertTo-Json -Compress) | Out-File -FilePath $Out -Encoding utf8
Write-Output ("lines: " + $all.Count)
