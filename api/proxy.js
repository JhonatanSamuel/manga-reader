const https = require('https');
const url   = require('url');

// Vercel serverless — proxy para api.mangadex.org
// Rota: /api/* → api.mangadex.org/*
module.exports = function handler(req, res) {
  // req.url ex: /api/manga?title=naruto  ou  /api/at-home/server/abc
  const parsed  = url.parse(req.url);
  const apiPath = parsed.pathname.replace(/^\/api/, '') || '/';
  const query   = parsed.query ? '?' + parsed.query : '';
  const target  = apiPath + query;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }

  const proxyReq = https.request(
    {
      hostname: 'api.mangadex.org',
      path: target,
      method: 'GET',
      headers: { Accept: 'application/json', 'User-Agent': 'MangaBR/1.0' },
    },
    (proxyRes) => {
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(proxyRes.statusCode);
      proxyRes.pipe(res);
    }
  );

  proxyReq.on('error', (e) => {
    if (!res.headersSent) { res.writeHead(502); res.end(JSON.stringify({ error: e.message })); }
  });

  proxyReq.end();
};
