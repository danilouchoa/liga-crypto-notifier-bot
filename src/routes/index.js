// routes/index.js

const express = require('express');
const router = express.Router();

const youtubeRoutes = require('./youtube');
const healthRoutes = require('./health');
const subscribeRoutes = require('./subscribe');

router.use('/', subscribeRoutes);
router.use('/', youtubeRoutes);
router.use('/', healthRoutes);

module.exports = router;
