const applySecurityHeaders = require('./applySecurityHeaders');

module.exports = function rootRedirect(req, res) {
  applySecurityHeaders(res);
  res.redirect(302, '/docs');
};
