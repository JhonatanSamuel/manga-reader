const http  = require('http');
const https = require('https');
const fs    = require('fs');
const path  = require('path');

const PORT     = 8080;
const API_HOST = 'api.mangadex.org';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
};

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // /api/* → proxy para api.mangadex.org
  if (req.url.startsWith('/api/') || req.url.startsWith('/api?')) {
    const apiPath = req.url.replace(/^\/api/, '');
    const opts = {
      hostname: API_HOST,
      path:     apiPath,
      method:   'GET',
      headers:  { 'Accept': 'application/json', 'User-Agent': 'MangaBR/1.0' },
    };

    const proxy = https.request(opts, (r) => {
      res.writeHead(r.statusCode, { 'Content-Type': 'application/json' });
      r.pipe(res);
    });
    proxy.on('error', (e) => {
      res.writeHead(502);
      res.end(JSON.stringify({ error: e.message }));
    });
    proxy.end();
    return;
  }

  // arquivos estáticos
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const ext  = path.extname(filePath);
    const mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });

}).listen(PORT, '127.0.0.1', () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════╗');
  console.log('  ║     MangaBR - Servidor rodando!      ║');
  console.log('  ╠══════════════════════════════════════╣');
  console.log('  ║  Abra no navegador:                  ║');
  console.log(`  ║  http://localhost:${PORT}               ║`);
  console.log('  ║                                      ║');
  console.log('  ║  Pressione Ctrl+C para encerrar      ║');
  console.log('  ╚══════════════════════════════════════╝');
  console.log('');
});
