// middlewares/security.js

const helmet = require('helmet');
const applySecurityHeaders = require('./applySecurityHeaders');

function securityMiddleware() {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"], // Ajuste conforme seu uso
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    referrerPolicy: {
      policy: 'no-referrer',
    },
    frameguard: {
      action: 'deny',
    },
    hsts: {
      maxAge: 63072000,
      includeSubDomains: true,
      preload: true,
    },
    xssFilter: true,
    dnsPrefetchControl: {
      allow: false,
    },
    permittedCrossDomainPolicies: {
      permittedPolicies: 'none',
    },
  });
}

// Corrige warning ESLint e aplica headers adicionais seguros
function secure404(req, res, _next) {
  applySecurityHeaders.setHeaders(res); // Usa função isolada
  res.status(404).send('Not found');
}

module.exports = {
  securityMiddleware,
  secure404,
};
