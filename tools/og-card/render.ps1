# Renders og-card.html to Portfolio/wwwroot/assets/og-card.jpg (1200x630) with headless Edge.
# Usage: pwsh tools/og-card/render.ps1   (needs Python with Pillow for the PNG -> JPEG step)
$ErrorActionPreference = 'Stop'

$edge = @(
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $edge) { throw 'Microsoft Edge not found.' }

$source  = Join-Path $PSScriptRoot 'og-card.html'
$png     = Join-Path $env:TEMP 'og-card.png'
$jpg     = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\..\Portfolio\wwwroot\assets\og-card.jpg'))
$edgeProfile = Join-Path $env:TEMP 'og-card-edge-profile'   # isolated so a running Edge isn't touched
if (Test-Path $png) { Remove-Item $png }

# --virtual-time-budget lets the Google Fonts requests finish before the capture.
# Start-Process rather than & so Edge's stderr logging isn't a terminating error on Windows PowerShell 5.1.
# WaitForExit on the main process only: -Wait would also wait for Edge's lingering helper processes.
$edgeArgs = @(
    '--headless', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    "--user-data-dir=`"$edgeProfile`"", '--window-size=1200,630', '--virtual-time-budget=10000',
    "--screenshot=`"$png`"", ([Uri]$source).AbsoluteUri
)
$proc = Start-Process -FilePath $edge -ArgumentList $edgeArgs -PassThru -WindowStyle Hidden `
    -RedirectStandardError (Join-Path $env:TEMP 'og-card-edge.log')
if (-not $proc.WaitForExit(60000)) { $proc.Kill(); throw 'Edge timed out after 60s.' }

if (-not (Test-Path $png)) { throw "Edge did not write $png" }

python -c "import sys; from PIL import Image; Image.open(sys.argv[1]).convert('RGB').save(sys.argv[2], 'JPEG', quality=88, optimize=True, progressive=True)" $png $jpg
Remove-Item $png
Get-Item $jpg | Select-Object Name, Length
