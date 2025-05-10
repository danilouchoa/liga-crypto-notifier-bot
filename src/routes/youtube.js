const express = require('express');
const axios = require('axios');
const escape = require('escape-html');
const router = express.Router();
const { XMLParser } = require('fast-xml-parser');

const VERIFY_TOKEN = 'ligacrypto_bot';

const logPrefix = '[YouTube Webhook]';

// funcoes
const safeEscape = (value) => escape(value || '');
const logWithTimestamp = (message) => {
  console.log(`[${new Date().toISOString()}] ${logPrefix} ${message}`);
};
const logErrorWithTimestamp = (message) => {
  console.error(`[${new Date().toISOString()}] ${logPrefix} ${message}`);
};

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
  const mode = safeEscape(req.query['hub.mode']);
  const challenge = safeEscape(req.query['hub.challenge']);
  const token = safeEscape(req.query['hub.verify_token']);

  // Validação geral de parâmetros obrigatórios
  if (!mode || !token || challenge === '' || !challenge) {
    const motivo =
      !mode || !token ? 'Parametros invalidos' : 'Challenge invalido';

    logErrorWithTimestamp(
      `Requisição inválida: mode=${mode}, challenge=${challenge}, token=${token}`
    );
    return res.status(400).send(motivo);
  }

  // Lógica principal
  if (mode === 'subscribe') {
    const crypto = require('crypto');
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
    logWithTimestamp(`Unsubscribe realizado com sucesso`);
    return res.status(200).send('Unsubscribed');
  }

  logErrorWithTimestamp(`Modo inválido fornecido: ${mode}`);
  return res.status(400).send('Modo inválido');
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
    logErrorWithTimestamp(`Tipo inválido de corpo recebido.`);
    return res.status(400).end();
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
  });

  let parsed;
  try {
    parsed = parser.parse(xml);
  } catch (err) {
    logErrorWithTimestamp(`Erro ao parsear XML: ${err.message}`);
    return res.status(400).end();
  }

  const videoId = escape(parsed?.feed?.entry?.['yt:videoId'] || '');

  if (!parsed?.feed?.entry?.['yt:videoId']) {
    logErrorWithTimestamp(`XML recebido em formato inesperado.`);
    return res.status(400).end();
  } else if (videoId) {
    logWithTimestamp(`ID do vídeo: ${videoId}`);
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    logWithTimestamp(`Vídeo detectado: ${videoUrl}`);

    const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = getTelegramConfig();

    try {
      const telegramRes = await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          chat_id: TELEGRAM_CHAT_ID,
          text: `Novo vídeo ou live da LigaCrypto!\n${videoUrl}`,
        },
        { timeout: 5000 } // Timeout de 5 segundos
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
    }
  } else {
    logErrorWithTimestamp(`XML recebido sem <yt:videoId>.`);
  }

  res.status(200).end();
});

module.exports = router;
