const express = require('express');
const router = express.Router();
const axios = require('axios');

/**
 * @swagger
 * /subscribe-channels:
 *   post:
 *     summary: Reinscreve o bot nos canais configurados do YouTube
 *     tags:
 *       - Administração
 *     responses:
 *       200:
 *         description: Canais reinscritos com sucesso
 */
router.post('/subscribe-channels', async (req, res) => {
  try {
    const channelId = process.env.YOUTUBE_CHANNEL_ID;
    const verifyToken = process.env.YOUTUBE_VERIFY_TOKEN;
    const callbackUrl = `${process.env.PUBLIC_URL}/youtube-callback`;

    await axios.post('https://pubsubhubbub.appspot.com/subscribe', null, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      params: {
        'hub.callback': callbackUrl,
        'hub.mode': 'subscribe',
        'hub.topic': `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${channelId}`,
        'hub.verify': 'async',
        'hub.verify_token': verifyToken,
      },
    });

    res.status(200).json({ message: 'Inscrição realizada com sucesso.' });
  } catch (err) {
    console.error(
      '[YouTube Subscribe] Erro ao reinscrever:',
      err.response?.data || err.message
    );
    res.status(500).json({ error: 'Erro ao reinscrever canal.' });
  }
});

module.exports = router;
