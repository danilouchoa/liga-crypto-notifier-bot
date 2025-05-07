const helmet = require('helmet');

module.exports = function securityMiddleware() {
  return helmet();
};
