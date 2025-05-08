const express = require('express');
const router = express.Router();
const axios = require('axios');

/**
 * @swagger
 * /subscribe-channels:
 *   post:
 *     summary: Reinscreve o bot nos canais configurados do YouTube
 *     description:
 *       Realiza a reinscrição do bot no canal do YouTube configurado via PubSubHubbub (WebSub), utilizando o callback definido em `PUBLIC_URL`.
 *     tags:
 *       - Administração
 *     responses:
 *       200:
 *         description: Canais reinscritos com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Inscrição realizada com sucesso.
 *       500:
 *         description: Erro ao reinscrever o canal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro ao reinscrever canal.
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
