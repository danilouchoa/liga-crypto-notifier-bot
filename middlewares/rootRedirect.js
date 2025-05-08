const { setHeaders } = require('./applySecurityHeaders');

module.exports = function rootRedirect(req, res) {
  setHeaders(res);
  res.redirect(302, '/docs');
};
