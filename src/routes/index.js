// routes/index.js

const express = require('express');
const router = express.Router();

const youtubeRoutes = require('./youtube');
const healthRoutes = require('./health');

router.use('/', youtubeRoutes);
router.use('/', healthRoutes);

module.exports = router;
