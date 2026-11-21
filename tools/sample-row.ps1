Add-Type -AssemblyName System.Drawing

$files = @(
  'c:\Users\Administrator\AppData\Roaming\Trae CN\User\workspaceStorage\87abefd27c6a113ea9be382248ec6708\paste-files\ead98e01-9e4e-49df-a900-8db89c0930e1_image.png',
  'c:\Users\Administrator\AppData\Roaming\Trae CN\User\workspaceStorage\87abefd27c6a113ea9be382248ec6708\paste-files\3a74ccfb-a54a-4e3b-9bc0-074e002f03db_image.png'
)

foreach ($f in $files) {
  $bmp = [System.Drawing.Bitmap]::FromFile($f)
  $w = $bmp.Width; $h = $bmp.Height
  Write-Host "==== $([IO.Path]::GetFileName($f))  ${w}x${h} ===="
  foreach ($y in @([int]($h*0.2), [int]($h*0.35), [int]($h*0.5))) {
    $line = "y=$y  "
    for ($x = 0; $x -lt $w; $x += 5) {
      $c = $bmp.GetPixel($x, $y)
      $line += "x$x=($($c.R),$($c.G),$($c.B)) "
    }
    Write-Host $line
  }
  $bmp.Dispose()
}
