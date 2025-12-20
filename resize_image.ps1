param(
    [string]$Source = "ava.jpg",
    [string]$Target = "ava_optimized.jpg"
)

Add-Type -AssemblyName System.Drawing

$originalPath = "$PSScriptRoot\$Source"
$optimizedPath = "$PSScriptRoot\$Target"

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