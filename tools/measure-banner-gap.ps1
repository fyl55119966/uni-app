Add-Type -AssemblyName System.Drawing

$files = @(
  'c:\Users\Administrator\AppData\Roaming\Trae CN\User\workspaceStorage\87abefd27c6a113ea9be382248ec6708\paste-files\ead98e01-9e4e-49df-a900-8db89c0930e1_image.png',
  'c:\Users\Administrator\AppData\Roaming\Trae CN\User\workspaceStorage\87abefd27c6a113ea9be382248ec6708\paste-files\3a74ccfb-a54a-4e3b-9bc0-074e002f03db_image.png'
)

foreach ($f in $files) {
  $bmp = [System.Drawing.Bitmap]::FromFile($f)
  $w = $bmp.Width; $h = $bmp.Height
  Write-Host "==== $([IO.Path]::GetFileName($f))  ${w}x${h} ===="
  # per-column: mean RGB and std-dev of luminance
  $info = @()
  for ($x = 0; $x -lt $w; $x++) {
    $sumR=0; $sumG=0; $sumB=0; $sumY=0
    $ys = New-Object int[] $h
    for ($y = 0; $y -lt $h; $y++) {
      $c = $bmp.GetPixel($x, $y)
      $sumR+=$c.R; $sumG+=$c.G; $sumB+=$c.B
      $lum = [int](0.299*$c.R + 0.587*$c.G + 0.114*$c.B)
      $ys[$y] = $lum; $sumY += $lum
    }
    $meanY = $sumY / $h
    $var = 0.0
    for ($y = 0; $y -lt $h; $y++) { $d = $ys[$y] - $meanY; $var += $d*$d }
    $std = [math]::Sqrt($var / $h)
    $info += [PSCustomObject]@{ x=$x; mR=[int]($sumR/$h); mG=[int]($sumG/$h); mB=[int]($sumB/$h); std=[math]::Round($std,1) }
  }
  # classify: gap = solid column (std small) and not pure white (meanR<248)
  $segs = @()
  $cur = $null; $start = 0
  for ($x = 0; $x -lt $w; $x++) {
    $i = $info[$x]
    $isGap = ($i.std -le 10 -and $i.mR -lt 248 -and $i.mB -lt 225)
    if ($cur -eq $null) { $cur = $isGap; $start = $x }
    elseif ($isGap -ne $cur) {
      $segs += [PSCustomObject]@{ gap=$cur; start=$start; end=$x-1; width=$x-$start }
      $cur=$isGap; $start=$x
    }
  }
  $segs += [PSCustomObject]@{ gap=$cur; start=$start; end=$w-1; width=$w-$start }
  foreach ($s in $segs) {
    if ($s.width -lt 2) { continue }
    $label = if ($s.gap) { 'GAP' } else { 'card' }
    $mid = $info[[int](($s.start+$s.end)/2)]
    Write-Host ("  {0,-5} x={1,4}..{2,-4} width={3,4}  meanRGB=({4},{5},{6}) std={7}" -f $label, $s.start, $s.end, $s.width, $mid.mR, $mid.mG, $mid.mB, $mid.std)
  }
  $bmp.Dispose()
}
