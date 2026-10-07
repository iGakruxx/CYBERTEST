@echo off
set "NODE_EXE=C:\Users\GeoxOS\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
set "APP_ROOT=%~dp0"

if not exist "%NODE_EXE%" (
  echo No se encontro Node.js en: %NODE_EXE%
  exit /b 1
)

echo Iniciando CYBERTEST en http://localhost:4173
echo Presiona Ctrl+C para detener el servidor.
"%NODE_EXE%" "%APP_ROOT%server.js"
