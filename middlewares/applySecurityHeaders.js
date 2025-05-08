// middlewares/applySecurityHeaders.js

function setSecurityHeaders(res) {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; frame-ancestors 'none'"
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
}

function applySecurityHeaders() {
  return (req, res, next) => {
    setSecurityHeaders(res);
    next();
  };
}

module.exports = applySecurityHeaders;
module.exports.setHeaders = setSecurityHeaders;
