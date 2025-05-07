const express = require('express');
const axios = require('axios');
const router = express.Router();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '8162313624';
const VERIFY_TOKEN = 'ligacrypto_bot';

const logPrefix = '[YouTube Webhook]';

// GET /youtube-callback -> verificação do PubSubHubbub
router.get('/youtube-callback', (req, res) => {
  const mode = req.query['hub.mode'];
  const challenge = req.query['hub.challenge'];
  const token = req.query['hub.verify_token'];

  if (
    typeof mode !== 'string' ||
    typeof challenge !== 'string' ||
    typeof token !== 'string'
  ) {
    console.warn(
      `${logPrefix} Parâmetros de verificação inválidos ou ausentes: mode=${mode}, token=${token}`
    );
    return res.status(400).send('Parâmetros inválidos');
  }

  console.log(
    `${logPrefix} GET /youtube-callback - mode=${mode}, token=${token}`
  );

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log(
      `${logPrefix} Verificação bem-sucedida. Respondendo com challenge.`
    );
    res.set('Content-Type', 'text/plain');
    return res.status(200).send(challenge);
  }

  console.warn(
    `${logPrefix} Verificação falhou. Token inválido recebido: ${token}`
  );
  return res.status(403).send('Forbidden');
});

// POST /youtube-callback -> notificação de novo vídeo/live
router.post('/youtube-callback', async (req, res) => {
  const xml = req.body;

  if (typeof xml !== 'string') {
    console.warn(
      `${logPrefix} Corpo da requisição não é uma string. Tipo recebido: ${typeof xml}`
    );
    return res.status(200).end(); // Silenciosamente ignora sem erro
  }

  console.log(
    `${logPrefix} POST /youtube-callback - XML recebido com ${xml.length} bytes`
  );

  if (xml.includes('<entry>')) {
    const match = xml.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
    const videoId = match?.[1];

    if (videoId) {
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      console.log(`${logPrefix} Novo vídeo/live detectado: ${videoUrl}`);

      try {
        const telegramRes = await axios.post(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            chat_id: TELEGRAM_CHAT_ID,
            text: `Novo vídeo ou live da LigaCrypto!\n${videoUrl}`,
          }
        );
        console.log(
          `${logPrefix} Notificação enviada com sucesso ao Telegram. msg_id=${telegramRes.data.result.message_id}`
        );
      } catch (err) {
        console.error(
          `${logPrefix} Falha ao enviar mensagem para o Telegram:`,
          err.response?.data || err.message
        );
      }
    } else {
      console.warn(`${logPrefix} <entry> detectado, mas sem <videoId> válido.`);
    }
  } else {
    console.log(`${logPrefix} Payload POST não contém <entry>. Ignorando.`);
  }

  res.status(200).end();
});

module.exports = router;
