// middlewares/docsHandler.js

const path = require('path');
const express = require('express');

function docsHandler(app) {
  app.use(
    '/docs/openapi.json',
    express.static(path.join(__dirname, '..', 'docs', 'openapi.json'))
  );

  app.get('/docs', (req, res) => {
    res.setHeader(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' https://cdn.redoc.ly",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' https://cdn.redoc.ly data:",
        "connect-src 'self'",
        "worker-src 'self' blob:",
      ].join('; ')
    );

    res.setHeader('Permissions-Policy', 'fullscreen=(), geolocation=()');
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    );
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Cache-Control', 'no-store');

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>API Docs - LigaCrypto</title>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body>
          <redoc spec-url="/docs/openapi.json"></redoc>
          <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js" type="text/javascript"></script>
        </body>
      </html>
    `);
  });
}

module.exports = docsHandler;
