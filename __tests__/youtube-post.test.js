jest.mock('axios'); // Mocka o axios para evitar chamadas reais
jest.mock('../src/routes/youtube'); // Mocka o módulo do YouTube

const axios = require('axios');
const request = require('supertest');
const app = require('../src/index');

describe('POST /youtube-callback', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
    process.env.TELEGRAM_BOT_TOKEN = 'fake-telegram-token';
    process.env.TELEGRAM_CHAT_ID = 'fake-chat-id';
  });

  it('retorna 200 quando XML válido é enviado com videoId', async () => {
    // Simula uma resposta bem-sucedida do Telegram
    axios.post.mockResolvedValue({
      data: {
        result: {
          message_id: 9999,
        },
      },
    });

    const xmlPayload = `
      <feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <yt:videoId>mGI_X5PiAcI</yt:videoId>
        </entry>
      </feed>
    `;

    const res = await request(app)
      .post('/youtube-callback')
      .set('Content-Type', 'application/xml')
      .send(xmlPayload.trim());

    expect(res.statusCode).toBe(200);
    expect(axios.post).toHaveBeenCalled(); // Verifica se o Telegram foi chamado
  });

  it('retorna 200 mesmo sem <entry> (deve ignorar)', async () => {
    const xmlPayload = `
      <feed xmlns="http://www.w3.org/2005/Atom">
        <title>No video entry</title>
      </feed>
    `;

    const res = await request(app)
      .post('/youtube-callback')
      .set('Content-Type', 'application/xml')
      .send(xmlPayload.trim());

    expect(res.statusCode).toBe(200);
  });

  it('retorna 400 quando XML inválido é enviado', async () => {
    const invalidXmlPayload = `
      <feed>
        <invalid>Missing required fields</invalid>
      </feed>
    `;

    const res = await request(app)
      .post('/youtube-callback')
      .set('Content-Type', 'application/xml')
      .send(invalidXmlPayload.trim());

    expect(res.statusCode).toBe(400); // Verifica se a API retorna erro para XML inválido
  });

  it('retorna 200 mas loga erro quando o Telegram falha', async () => {
    // Simula uma falha no envio ao Telegram
    axios.post.mockRejectedValue({
      response: {
        status: 500,
        data: 'Erro simulado no Telegram',
      },
    });

    const payload = `
      <feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <yt:videoId>abc123</yt:videoId>
        </entry>
      </feed>
    `;

    const response = await request(app)
      .post('/youtube-callback')
      .set('Content-Type', 'application/xml')
      .send(payload.trim());

    expect(response.status).toBe(200); // A API responde 200 mesmo com erro no Telegram
    expect(axios.post).toHaveBeenCalled(); // Verifica se o Telegram foi chamado
  }, 10000); // Aumenta o timeout para 10 segundos
});
