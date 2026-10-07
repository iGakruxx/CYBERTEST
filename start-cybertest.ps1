$ErrorActionPreference = "Stop"

$nodePath = "C:\Users\GeoxOS\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$appRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$serverPath = Join-Path $appRoot "server.js"

if (-not (Test-Path -LiteralPath $nodePath)) {
    Write-Error "No se encontro Node.js en: $nodePath"
}

if (-not (Test-Path -LiteralPath $serverPath)) {
    Write-Error "No se encontro server.js en: $serverPath"
}

Write-Host "Iniciando CYBERTEST en http://localhost:4173"
Write-Host "Presiona Ctrl+C para detener el servidor."

& $nodePath $serverPath
