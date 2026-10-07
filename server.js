const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { execFile } = require('node:child_process');

const root = __dirname;
const publicDir = path.join(root, 'public');
const dataDir = path.join(root, 'data');
fs.mkdirSync(dataDir, { recursive: true });

function send(res, status, body, type = 'application/json') {
  res.writeHead(status, { 'Content-Type': `${type}; charset=utf-8`, 'Cache-Control': 'no-store' });
  res.end(type === 'application/json' ? JSON.stringify(body) : body);
}
function readJson(req) { return new Promise((resolve, reject) => { let raw = ''; req.on('data', c => raw += c); req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { reject(new Error('Invalid JSON')); } }); }); }
function run(command, args, timeout = 180000) { return new Promise(resolve => execFile(command, args, { timeout, windowsHide: true }, (error, stdout, stderr) => resolve({ error: error?.message, stdout, stderr }))); }
function network() {
  const interfaces = os.networkInterfaces();
  const results = Object.entries(interfaces).flatMap(([name, addresses]) => (addresses || []).filter(a => a.family === 'IPv4' && !a.internal).map(a => ({ name, ip: a.address, netmask: a.netmask, cidr: a.cidr || null, mac: a.mac })));
  return { hostname: os.hostname(), platform: `${os.type()} ${os.release()}`, interfaces: results, active: results[0] || null };
}
function validScope(target) {
  return typeof target === 'string' && /^[a-zA-Z0-9.:/\-\[\]]{1,255}$/.test(target.trim());
}
async function tools() {
  const list = process.platform === 'win32' ? ['where'] : ['which'];
  const names = ['nmap', 'nuclei', 'msfconsole'];
  const result = {};
  for (const name of names) { const answer = await run(list[0], [name], 5000); result[name] = { installed: !answer.error && Boolean(answer.stdout.trim()), path: answer.stdout.trim().split(/\r?\n/)[0] || null }; }
  return result;
}
async function nmapScan({ target, profile = 'standard' }) {
  if (!validScope(target)) return { ok: false, message: 'Invalid assessment scope.' };
  const installed = (await tools()).nmap.installed;
  if (!installed) return { ok: false, code: 'TOOL_NOT_FOUND', message: 'Nmap is not installed or not in PATH. Configure it in Settings.' };
  const profiles = { quick: ['-T4', '--top-ports', '100', '-sV'], standard: ['-sV', '--top-ports', '1000', '-T3'], deep: ['-sV', '-O', '--script', 'safe', '-T3'] };
  const answer = await run('nmap', [...(profiles[profile] || profiles.standard), '-oX', '-', target]);
  return { ok: !answer.error, output: answer.stdout, error: answer.stderr || answer.error || null };
}
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (req.method === 'GET' && url.pathname === '/api/network') return send(res, 200, network());
    if (req.method === 'GET' && url.pathname === '/api/tools') return send(res, 200, await tools());
    if (req.method === 'POST' && url.pathname === '/api/scan') return send(res, 200, await nmapScan(await readJson(req)));
    if (req.method === 'POST' && url.pathname === '/api/projects') { const project = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...(await readJson(req)) }; fs.writeFileSync(path.join(dataDir, `${project.id}.json`), JSON.stringify(project, null, 2)); return send(res, 201, project); }
    if (req.method === 'GET' && url.pathname === '/api/projects') { const projects = fs.readdirSync(dataDir).filter(f => f.endsWith('.json')).map(f => JSON.parse(fs.readFileSync(path.join(dataDir, f)))); return send(res, 200, projects); }
    const file = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
    const filePath = path.resolve(publicDir, file);
    if (!filePath.startsWith(publicDir) || !fs.existsSync(filePath)) return send(res, 404, { error: 'Not found' });
    const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript' };
    return send(res, 200, fs.readFileSync(filePath), types[path.extname(filePath)] || 'text/plain');
  } catch (error) { return send(res, 500, { error: error.message }); }
});
server.listen(process.env.PORT || 4173, () => console.log('CYBERTEST running at http://localhost:4173'));
