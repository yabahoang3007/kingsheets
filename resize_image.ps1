Add-Type -AssemblyName System.Drawing

$originalPath = "C:\Users\Henry\Documents\GitHub\kingsheets\ava.jpg"
$optimizedPath = "C:\Users\Henry\Documents\GitHub\kingsheets\ava_optimized.jpg"

$original = [System.Drawing.Image]::FromFile($originalPath)
$width = 100
$height = 100
$resized = New-Object System.Drawing.Bitmap $width, $height
$graphics = [System.Drawing.Graphics]::FromImage($resized)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.DrawImage($original, 0, 0, $width, $height)
$resized.Save($optimizedPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$graphics.Dispose()
$resized.Dispose()
$original.Dispose()

Write-Host "Image resized and saved to $optimizedPath"