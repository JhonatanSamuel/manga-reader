const https = require('https');
const url   = require('url');

// Vercel serverless — proxy para api.mangadex.org e uploads.mangadex.org
// /api/covers/* → uploads.mangadex.org/covers/*  (imagens)
// /api/*        → api.mangadex.org/*              (JSON)
module.exports = function handler(req, res) {
  const parsed  = url.parse(req.url);
  const apiPath = parsed.pathname.replace(/^\/api/, '') || '/';
  const query   = parsed.query ? '?' + parsed.query : '';

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }

  const isCovers = apiPath.startsWith('/covers/');
  const hostname = isCovers ? 'uploads.mangadex.org' : 'api.mangadex.org';
  const target   = isCovers ? apiPath : apiPath + query;

  const proxyReq = https.request(
    {
      hostname,
      path: target,
      method: 'GET',
      headers: {
        'User-Agent': 'MangaBR/1.0',
        ...(isCovers ? { Accept: 'image/jpeg,image/webp,image/*' } : { Accept: 'application/json' }),
      },
    },
    (proxyRes) => {
      if (isCovers) {
        const ct = proxyRes.headers['content-type'] || 'image/jpeg';
        res.setHeader('Content-Type', ct);
        res.setHeader('Cache-Control', 'public, max-age=86400');
      } else {
        res.setHeader('Content-Type', 'application/json');
      }
      res.writeHead(proxyRes.statusCode);
      proxyRes.pipe(res);
    }
  );

  proxyReq.on('error', (e) => {
    if (!res.headersSent) { res.writeHead(502); res.end(JSON.stringify({ error: e.message })); }
  });

  proxyReq.end();
};
