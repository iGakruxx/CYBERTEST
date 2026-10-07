# Cybertest

<p align="center">
  <img src="public/assets/cybertest-logo.png" alt="Cybertest — By Gabriel Huertas" width="560">
</p>

Espacio de trabajo local y controlado por alcance para evaluaciones internas de seguridad autorizadas. Es un MVP sin dependencias externas que usa Node.js 20+ y sirve una interfaz con estética Liquid Glass inspirada en Apple.

## Funcionalidades incluidas

- Descubrimiento de interfaces de red locales mediante las API del sistema operativo.
- Confirmación explícita de autorización y validación estricta de los objetivos.
- Detección de Nmap y perfiles de análisis Rápido, Estándar y Profundo (solo scripts seguros de Nmap).
- Persistencia local de proyectos en `data/`; conserva el XML original cuando el análisis finaliza correctamente.
- Panel de control, vista de herramientas, proyectos, registro de actividad y controles de flujo.

## Ejecutar en Windows

Desde la carpeta del proyecto:

```powershell
cd C:\Users\GeoxOS\Documents\ChatGPT\CYBERTEST
.\start-cybertest.ps1
```

Si PowerShell bloquea el script:

```powershell
powershell -ExecutionPolicy Bypass -File .\start-cybertest.ps1
```

Abre [http://localhost:4173](http://localhost:4173). Para realizar análisis, Nmap debe estar instalado y disponible en `PATH`. Compruébalo con:

```powershell
nmap --version
```

Puedes ejecutar las pruebas con:

```powershell
node --test
```

## Ejecutar en Kali Linux

Clona el repositorio y prepara las herramientas una sola vez:

```bash
cd ~
git clone https://github.com/iGakruxx/CYBERTEST.git
cd CYBERTEST
sudo apt update
sudo apt install -y nodejs npm nmap
node --version
nmap --version
node server.js
```

Luego abre [http://localhost:4173](http://localhost:4173). En usos posteriores basta con:

```bash
cd ~/CYBERTEST
node server.js
```

Si el puerto está ocupado, usa otro puerto local:

```bash
PORT=8080 node server.js
```

## Entorno recomendado

Windows es suficiente para desarrollar y usar la interfaz. Kali resulta útil para laboratorios y para herramientas de seguridad nativas. El arranque dual es conveniente cuando necesitas acceso nativo a redes, adaptadores inalámbricos, rutas o paquetes sin las limitaciones de una capa de virtualización; WSL2 es una alternativa práctica si no necesitas esas capacidades.

## Uso responsable

Analiza únicamente sistemas propios o para los que tengas autorización explícita. Para una comprobación pública y ligera, Nmap ofrece `scanme.nmap.org` bajo sus condiciones de uso. Para pruebas repetibles, es preferible montar un laboratorio propio, por ejemplo OWASP Juice Shop o WebGoat.

Cybertest no inicia análisis sin objetivo y confirmación explícitos; no inventa resultados ni ejecuta explotación automática o validaciones destructivas. Los módulos de Hacking Ético, Evidencia, Informes y Pentest Web son superficies de flujo controladas y requieren sus integraciones locales antes de considerarse operativos.
