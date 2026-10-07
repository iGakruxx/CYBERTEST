const state = { network: null, tools: null, screen: 'Panel', logs: [], projects: [] };
const nav = ['Panel', 'Descubrimiento automático', 'Objetivo manual', 'Pentest de red', 'Pentest web', 'Hacking ético', 'Evidencias', 'Informes', 'Proyectos', 'Configuración'];
const $ = selector => document.querySelector(selector);

function log(message) {
  state.logs.unshift(`[${new Date().toLocaleTimeString()}] ${message}`);
  render();
}

function esc(value = '') {
  return String(value).replace(/[&<>"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[character]));
}

function api(path, options) {
  return fetch(path, options).then(response => response.json());
}

function current() { return state.network?.active; }

function card(label, value) {
  return `<div class="card"><small>${label}</small><div class="value">${esc(value || '—')}</div></div>`;
}

function layout(content) {
  document.querySelector('#app').innerHTML = `<div class="shell"><aside class="side"><div class="brand-lockup"><img src="/assets/cybertest-logo.png" alt="Cybertest — By Gabriel Huertas"></div><nav class="nav" aria-label="Navegación principal">${nav.map(item => `<button class="${state.screen === item ? 'active' : ''}" data-nav="${item}">${item}</button>`).join('')}</nav></aside><main>${content}</main></div>`;
  document.querySelectorAll('[data-nav]').forEach(button => button.onclick = () => { state.screen = button.dataset.nav; render(); });
}

function header(title, caption = 'EVALUACIÓN INTERNA AUTORIZADA') {
  return `<div class="head"><div><div class="eyebrow">${caption}</div><h1>${title}</h1></div><div class="status"><i class="dot"></i>MODO LOCAL</div></div>`;
}

function dashboard() {
  const network = current();
  return `${header('Panel')}<div class="grid">${card('IP local', network?.ip)}${card('Red', network?.cidr)}${card('Interfaz', network?.name)}${card('Puerta de enlace', 'Se detecta al iniciar la evaluación')}</div><div class="cols"><section class="panel"><h2>Posición actual</h2>${network ? `<table><tr><th>IP</th><td>${esc(network.ip)}</td></tr><tr><th>Máscara de red</th><td>${esc(network.netmask)}</td></tr><tr><th>MAC</th><td>${esc(network.mac)}</td></tr><tr><th>Equipo</th><td>${esc(state.network.hostname)}</td></tr></table>` : '<p>Cargando información de red…</p>'}<div class="actions" style="margin-top:15px"><button data-go="Descubrimiento automático">INICIAR DESCUBRIMIENTO</button><button data-go="Objetivo manual">OBJETIVO MANUAL</button></div></section><section class="panel"><h2>Estadísticas de evaluación</h2><div class="severity"><span class="sev critical">CRÍTICO 0</span><span class="sev high">ALTO 0</span><span class="sev medium">MEDIO 0</span><span class="sev low">BAJO 0</span></div><p class="notice">No se fabrican resultados. Las estadísticas solo se actualizan con resultados reales de una evaluación registrada.</p></section></div>${logPanel()}`;
}

function logPanel() {
  return `<section class="panel"><h2>Registro de actividad</h2><div class="log">${state.logs.map(esc).join('\n') || 'Esperando una acción de evaluación.'}</div></section>`;
}

function autoDiscovery() {
  const network = current();
  return `${header('Descubrimiento automático')}<section class="panel"><h2>Segmento local</h2><div class="grid">${card('Interfaz', network?.name)}${card('IP local', network?.ip)}${card('Máscara de red', network?.netmask)}${card('CIDR', network?.cidr)}</div><div class="notice">Las redes enrutable o alcanzables son informativas. No se analizan hasta que se introducen explícitamente como alcance autorizado.</div><div class="actions"><button id="discover">INICIAR DESCUBRIMIENTO DE HOSTS</button><button data-go="Objetivo manual">CAMBIAR ALCANCE</button></div></section>${scopeForm(network?.cidr || '')}${logPanel()}`;
}

function scopeForm(defaultTarget = '') {
  return `<section class="panel"><h2>Alcance de la evaluación</h2><label class="label">Objetivo — CIDR, IP, nombre de host o dominio autorizado</label><input id="target" value="${esc(defaultTarget)}" placeholder="192.168.10.0/24"><label class="label">Perfil de análisis</label><select id="profile"><option value="standard">Análisis estándar (predeterminado)</option><option value="quick">Análisis rápido</option><option value="deep">Análisis profundo — solo scripts seguros de Nmap</option></select><label><input type="checkbox" id="authorized" style="width:auto"> Confirmo que tengo autorización para evaluar este objetivo explícito.</label><div class="actions"><button id="scan">INICIAR EVALUACIÓN</button></div><div id="scan-result"></div></section>`;
}

function manual() {
  return `${header('Objetivo manual')}<section class="panel"><h2>Define un alcance autorizado</h2><p>Introduce únicamente activos que estés autorizado a evaluar. La confirmación del alcance es obligatoria antes de iniciar un escáner.</p>${scopeForm()}</section>${logPanel()}`;
}

function toolsView() {
  const tools = state.tools || {};
  return `${header('Configuración')}<section class="panel"><h2>Detección de herramientas</h2><table><tr><th>Herramienta</th><th>Estado</th><th>Ruta detectada</th></tr>${[['nmap', 'Nmap'], ['nuclei', 'Nuclei'], ['msfconsole', 'Metasploit Framework']].map(([id, name]) => `<tr><td>${name}</td><td>${tools[id]?.installed ? '<span class="sev low">INSTALADA</span>' : '<span class="sev high">NO ENCONTRADA</span>'}</td><td>${esc(tools[id]?.path || 'Configura PATH')}</td></tr>`).join('')}</table><button id="check-tools" style="margin-top:14px">REVISAR HERRAMIENTAS</button><p class="notice">Las herramientas externas son opcionales. Si falta una, la aplicación lo informa claramente y continúa funcionando.</p></section>`;
}

function projects() {
  return `${header('Proyectos')}<section class="panel"><h2>Evaluaciones guardadas</h2>${state.projects.length ? `<table><tr><th>Proyecto</th><th>Alcance</th><th>Creado</th></tr>${state.projects.map(project => `<tr><td>${esc(project.name || 'Evaluación sin título')}</td><td>${esc(project.target || '—')}</td><td>${new Date(project.createdAt).toLocaleString()}</td></tr>`).join('')}</table>` : '<p>Aún no hay proyectos guardados.</p>'}</section>`;
}

function generic() {
  const labels = {
    'Pentest de red': 'Descubrimiento → Enumeración → Análisis → Evaluación → Evidencia → Informe',
    'Pentest web': 'Revisión autorizada de HTTP/TLS y recopilación de evidencias',
    'Hacking ético': 'Validación segura únicamente; sin cargas destructivas ni explotación automática.',
    'Evidencias': 'Adjunta salidas del escáner, capturas, solicitudes, respuestas y notas de validación a un hallazgo.',
    'Informes': 'Genera informes después de registrar hallazgos y evidencias.'
  };
  return `${header(state.screen)}<section class="panel"><h2>${labels[state.screen]}</h2><p>Este módulo permanece controlado hasta crear una evaluación con alcance definido. Los resultados deben provenir de herramientas reales; Cybertest no inventa hosts, CVE, hallazgos ni evidencias.</p><button data-go="Objetivo manual">CREAR ALCANCE DE EVALUACIÓN</button></section>`;
}

function render() {
  const views = { Panel: dashboard, 'Descubrimiento automático': autoDiscovery, 'Objetivo manual': manual, Configuración: toolsView, Proyectos: projects };
  layout((views[state.screen] || generic)());
  wire();
}

function wire() {
  document.querySelectorAll('[data-go]').forEach(button => button.onclick = () => { state.screen = button.dataset.go; render(); });
  $('#check-tools')?.addEventListener('click', async () => { state.tools = await api('/api/tools'); log('Se revisó la disponibilidad de herramientas.'); });
  $('#discover')?.addEventListener('click', () => { log('El descubrimiento de hosts requiere un alcance explícito y confirmado.'); state.screen = 'Objetivo manual'; render(); });
  $('#scan')?.addEventListener('click', async () => {
    const target = $('#target').value.trim();
    const authorized = $('#authorized').checked;
    const profile = $('#profile').value;
    if (!authorized) {
      $('#scan-result').innerHTML = '<div class="notice">Debes confirmar la autorización antes de iniciar un análisis.</div>';
      return;
    }
    log(`Iniciando análisis ${profile} para el alcance autorizado: ${target}`);
    const result = await api('/api/scan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ target, profile }) });
    if (!result.ok) {
      $('#scan-result').innerHTML = `<div class="notice">${esc(result.message || result.error || 'El análisis no se pudo completar')}</div>`;
      log(`Análisis no disponible: ${result.message || result.error}`);
      return;
    }
    await api('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: `Evaluación ${target}`, target, profile, rawNmapXml: result.output }) });
    state.projects = await api('/api/projects');
    $('#scan-result').innerHTML = '<div class="status"><i class="dot"></i>Análisis completado y proyecto guardado. El XML de Nmap se conserva localmente.</div>';
    log('Nmap finalizó; el proyecto se guardó localmente.');
  });
}

async function boot() {
  state.network = await api('/api/network');
  state.tools = await api('/api/tools');
  state.projects = await api('/api/projects');
  log(`Interfaz activa detectada: ${current()?.name || 'ninguna'}`);
}

boot();
