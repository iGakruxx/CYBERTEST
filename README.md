# CYBERTEST

Local, scope-controlled workspace for authorized internal security assessments. It is a dependency-free MVP that runs on Node.js 20+ and serves a responsive UI.

## Implemented

- Local network-interface discovery via Node's operating-system APIs.
- Explicit assessment-scope confirmation and strict input validation.
- Nmap availability detection and controlled Quick, Standard, and Deep (safe scripts) scan profiles.
- Local assessment project persistence in `data/`; raw Nmap XML is preserved when a scan succeeds.
- Professional dark dashboard, tool settings, project view, workflow guardrails, and activity log.

## Run on Windows

```powershell
node server.js
```

If `node` is not available in your PowerShell `PATH`, use the included Windows launcher:

```powershell
.\start-cybertest.ps1
```

Or double-click `start-cybertest.cmd`.

Then open `http://localhost:4173`. Nmap must be installed and resolvable via `PATH` for scans to run. Tool status is visible under Settings. Test the input constraint with:

```powershell
node --test
```

To enable real local scans on Windows, install Nmap from [nmap.org/download](https://nmap.org/download.html), reopen PowerShell, and verify:

```powershell
nmap --version
```

The app itself is a local web interface; it does not need administrator privileges for normal startup. Some Nmap options may require an elevated terminal depending on the target and Windows configuration.

## Run on Kali Linux

Kali is a good environment for the command-line security tools used by this project. From a terminal:

```bash
cd ~/CYBERTEST
sudo apt update
sudo apt install -y nodejs npm nmap
node --version
nmap --version
node server.js
```

Open `http://localhost:4173` in a browser. If port 4173 is occupied, choose another local port:

```bash
PORT=8080 node server.js
```

Kali and Windows can use the same Git repository, but scan data is intentionally ignored by Git (`data/`). Keep reports and evidence that contain sensitive information out of public repositories.

## Which environment should I use?

Dual boot is useful when you want Kali's native networking and security-tool ecosystem, while Windows is convenient for everyday development and the dashboard. It is not required: for this MVP, Windows plus Nmap is enough, and Kali is helpful when you later add Nuclei or other authorized assessment tools. WSL2 is a practical middle ground if you want Linux tools without rebooting; use native Kali/dual boot for labs where wireless adapters, routing, or raw packet access matter.

## Safe test targets

Only scan systems you own or have explicit permission to assess. For a public connectivity check, use the Nmap project’s intentionally provided test host `scanme.nmap.org` and a light profile, respecting its usage policy. For repeatable testing, prefer a local lab such as OWASP Juice Shop or WebGoat running on your own machine.

## Security posture

CYBERTEST never starts a scan without an explicit target and authorization confirmation. It does not send assessment data externally, fabricate findings, run Metasploit, or automatically perform destructive validation. The Ethical Hacking, Evidence, Report, and Web modules currently provide gated workflow surfaces; they need their respective local integrations before they should be presented as operational capabilities.

## Packaging direction

The HTTP core is deliberately separated from the UI, making it practical to wrap in Tauri later. A production build should replace JSON-file persistence with SQLite, add a Tauri command bridge, and implement report/evidence exporters with tests on Windows and Kali.
