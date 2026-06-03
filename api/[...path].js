const https = require('https');

// Vercel serverless function — proxy para api.mangadex.org
// Recebe: /api/manga?title=naruto  →  encaminha: api.mangadex.org/manga?title=naruto
module.exports = function handler(req, res) {
  const segments = [].concat(req.query.path || []);
  const subPath  = segments.join('/');

  const queryParams = { ...req.query };
  delete queryParams.path;

  const qs = Object.entries(queryParams)
    .flatMap(([k, v]) => [].concat(v).map(i => `${k}=${encodeURIComponent(i)}`))
    .join('&');

  const targetPath = `/${subPath}${qs ? '?' + qs : ''}`;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const proxyReq = https.request(
    {
      hostname: 'api.mangadex.org',
      path: targetPath,
      method: 'GET',
      headers: { 'Accept': 'application/json', 'User-Agent': 'MangaBR/1.0' },
    },
    (proxyRes) => {
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(proxyRes.statusCode);
      proxyRes.pipe(res);
    }
  );

  proxyReq.on('error', (e) => {
    if (!res.headersSent) {
      res.writeHead(502);
      res.end(JSON.stringify({ error: e.message }));
    }
  });

  proxyReq.end();
};
