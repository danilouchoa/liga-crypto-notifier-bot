const express = require('express');
const axios = require('axios');
const escape = require('escape-html');
const router = express.Router();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '8162313624';
const VERIFY_TOKEN = 'ligacrypto_bot';

const logPrefix = '[YouTube Webhook]';

/**
 * @swagger
 * /youtube-callback:
 *   get:
 *     summary: Validação do endpoint de notificação pelo YouTube (WebSub)
 *     description: |
 *       Esta rota é utilizada pelo YouTube como parte do protocolo PubSubHubbub (WebSub) para validar a subscrição do endpoint de callback.
 *       Durante o processo de inscrição, o YouTube realiza uma requisição GET para este endpoint contendo parâmetros de verificação.
 *       Caso o token de verificação esteja correto, a API responde com o valor do parâmetro `hub.challenge`, confirmando a subscrição com sucesso.
 *     tags:
 *       - YouTube
 *     parameters:
 *       - in: query
 *         name: hub.mode
 *         schema:
 *           type: string
 *         required: true
 *         example: subscribe
 *       - in: query
 *         name: hub.challenge
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: hub.verify_token
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Retorna o valor de hub.challenge se verificação for bem-sucedida
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: abc123
 *       400:
 *         description: Parâmetros inválidos
 *       403:
 *         description: Token de verificação inválido
 */

router.get('/youtube-callback', (req, res) => {
  const mode = req.query['hub.mode'];
  const challenge = req.query['hub.challenge'];
  const token = req.query['hub.verify_token'];

  if (!mode || !challenge || !token) {
    console.warn(`${logPrefix} Parâmetros inválidos.`);
    return res.status(400).send('Parâmetros inválidos');
  }

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log(`${logPrefix} Verificação bem-sucedida.`);
    return res.status(200).type('text/plain').send(escape(challenge));
  }

  console.warn(`${logPrefix} Token inválido.`);
  return res.status(403).send('Forbidden');
});

/**
 * @swagger
 * /youtube-callback:
 *   post:
 *     summary: Recebe notificações de novo vídeo ou live do YouTube
 *     description: Usado pelo YouTube para enviar notificações via XML (formato WebSub).
 *     tags:
 *       - YouTube
 *     requestBody:
 *       required: true
 *       content:
 *         application/xml:
 *           schema:
 *             type: string
 *             example: <feed><entry><yt:videoId>abc123</yt:videoId></entry></feed>
 *     responses:
 *       200:
 *         description: Notificação recebida com sucesso (ou ignorada)
 *       400:
 *         description: Tipo de conteúdo inválido
 */
router.post('/youtube-callback', async (req, res) => {
  const xml = req.body;

  if (typeof xml !== 'string') {
    console.warn(`${logPrefix} Tipo inválido: ${typeof xml}`);
    return res.status(200).end();
  }

  if (xml.includes('<entry>')) {
    const match = xml.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
    const videoId = match?.[1];

    if (videoId) {
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      console.log(`${logPrefix} Vídeo detectado: ${videoUrl}`);

      try {
        const telegramRes = await axios.post(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            chat_id: TELEGRAM_CHAT_ID,
            text: `Novo vídeo ou live da LigaCrypto!\n${videoUrl}`,
          }
        );
        console.log(
          `${logPrefix} Notificação enviada. msg_id=${telegramRes.data.result.message_id}`
        );
      } catch (err) {
        console.error(
          `${logPrefix} Erro ao enviar para Telegram:`,
          err.response?.data || err.message
        );
      }
    } else {
      console.warn(`${logPrefix} XML com <entry>, mas sem <videoId>.`);
    }
  } else {
    console.log(`${logPrefix} Sem <entry> no XML. Ignorando.`);
  }

  res.status(200).end();
});

module.exports = router;
