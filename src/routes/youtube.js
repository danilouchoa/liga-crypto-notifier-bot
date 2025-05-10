const express = require('express');
const axios = require('axios');
const escape = require('escape-html');
const crypto = require('crypto');
const { XMLParser, XMLValidator } = require('fast-xml-parser');
const {
  setHeaders: setSecurityHeaders,
} = require('../../middlewares/applySecurityHeaders');

const router = express.Router();
const VERIFY_TOKEN = 'ligacrypto_bot';
const logPrefix = '[YouTube Webhook]';

// Funções auxiliares
const safeEscape = (value) => escape(value || '');

const logWithTimestamp = (message) => {
  console.log(`[${new Date().toISOString()}] ${logPrefix} ${message}`);
};

const logErrorWithTimestamp = (message) => {
  console.error(`[${new Date().toISOString()}] ${logPrefix} ${message}`);
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  ignoreNameSpace: false, // <- importante
});

const getTelegramConfig = () => {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '8162313624';

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    throw new Error(
      'As variáveis de ambiente TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID não estão definidas.'
    );
  }
  return { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID };
};

// GET /youtube-callback
router.get('/youtube-callback', (req, res) => {
  const mode = safeEscape(req.query['hub.mode']);
  const challenge = safeEscape(req.query['hub.challenge']);
  const token = safeEscape(req.query['hub.verify_token']);

  if (!mode || !token || !challenge || challenge.trim() === '') {
    logErrorWithTimestamp(
      `Requisição inválida: mode=${mode}, challenge=${challenge}, token=${token}`
    );
    return res.status(400).send('Parametros invalidos');
  }

  if (mode === 'subscribe') {
    const tokenBuffer = Buffer.from(token);
    const verifyTokenBuffer = Buffer.from(VERIFY_TOKEN);

    if (
      tokenBuffer.length === verifyTokenBuffer.length &&
      crypto.timingSafeEqual(tokenBuffer, verifyTokenBuffer)
    ) {
      logWithTimestamp(
        `Verificação bem-sucedida: mode=${mode}, challenge=${challenge}`
      );
      return res.status(200).type('text/plain').send(challenge);
    } else {
      logErrorWithTimestamp(
        `Token inválido fornecido. mode=${mode}, token=${token}`
      );
      return res.status(403).send('Token invalido');
    }
  }

  if (mode === 'unsubscribe') {
    logWithTimestamp('Unsubscribe realizado com sucesso');
    return res.status(200).send('Unsubscribed');
  }

  logErrorWithTimestamp(`Modo inválido fornecido: ${mode}`);
  return res.status(400).send('Modo invalido');
});

// POST /youtube-callback
router.post('/youtube-callback', async (req, res) => {
  const xml = req.body;
  let parsed;

  if (!xml || xml.trim() === '') {
    logErrorWithTimestamp('Corpo da requisição vazio.');
    return res.status(400).send('Formato invalido');
  }

  const validationResult = XMLValidator.validate(xml);
  if (validationResult !== true) {
    logErrorWithTimestamp(`Erro ao parsear XML: ${validationResult.err.msg}`);
    return res.status(400).send('Erro ao parsear XML');
  }

  try {
    parsed = parser.parse(xml);
  } catch (err) {
    logErrorWithTimestamp(`Erro ao parsear XML: ${err.message}`);
    return res.status(400).send('Erro ao parsear XML');
  }

  const rawEntries = parsed?.feed?.entry;
  if (!rawEntries) {
    logWithTimestamp('XML recebido sem entry. Nenhuma ação necessária.');
    setSecurityHeaders(res);
    return res.status(200).end();
  }

  const entries = Array.isArray(rawEntries) ? rawEntries : [rawEntries];
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = getTelegramConfig();

  for (const entry of entries) {
    const videoId = entry?.['yt:videoId'];
    if (typeof videoId !== 'string' || !videoId.trim()) {
      logWithTimestamp('Entry sem <yt:videoId>. Ignorando.');
      continue;
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    logWithTimestamp(`Vídeo detectado: ${videoUrl}`);

    try {
      const telegramRes = await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          chat_id: TELEGRAM_CHAT_ID,
          text: `Novo vídeo ou live da LigaCrypto!\n${videoUrl}`,
        },
        { timeout: 5000 }
      );

      logWithTimestamp(
        `Notificação enviada. msg_id=${safeEscape(telegramRes.data.result.message_id)}`
      );
    } catch (err) {
      logErrorWithTimestamp(`Erro ao enviar para Telegram: ${err.message}`);
      if (err.response) {
        logErrorWithTimestamp(
          `Detalhes do erro: status=${err.response.status}, data=${JSON.stringify(err.response.data)}`
        );
      }
      logErrorWithTimestamp('Erro ao enviar para Telegram. Continuando fluxo.');
      continue;
    }
  }

  setSecurityHeaders(res);
  return res.status(200).end();
});

module.exports = router;
