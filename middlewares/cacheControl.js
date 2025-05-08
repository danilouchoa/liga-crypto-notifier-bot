// middlewares/cacheControl.js

module.exports = function noStoreCache(req, res, next) {
  res.setHeader('Cache-Control', 'no-store');
  next();
};
