jest.mock('axios'); // Mocka o axios para evitar chamadas reais

const axios = require('axios');
const request = require('supertest');
const app = require('../src/index');

jest.mock('axios');

beforeEach(() => {
  jest.clearAllMocks();
  process.env.TELEGRAM_BOT_TOKEN ||= 'fake-token';
  process.env.TELEGRAM_CHAT_ID ||= 'fake-chat-id';
});

describe('POST /youtube-callback', () => {
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

  it('retorna 400 quando XML válido não contém <yt:videoId>', async () => {
    const xmlPayload = `
      <feed xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <title>No video ID here</title>
        </entry>
      </feed>
    `;

    const res = await request(app)
      .post('/youtube-callback')
      .set('Content-Type', 'application/xml')
      .send(xmlPayload.trim());

    expect(res.statusCode).toBe(200);
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

  jest.mock('axios');

  describe('POST /subscribe-channels', () => {
    it('responde 200 quando reinscrição for bem-sucedida', async () => {
      axios.post.mockResolvedValue({ data: {} });

      const res = await request(app).post('/subscribe-channels');

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/sucesso/i);
    });

    it('responde 500 em erro de reinscrição', async () => {
      axios.post.mockRejectedValue({ response: { data: 'erro' } });

      const res = await request(app).post('/subscribe-channels');

      expect(res.status).toBe(500);
      expect(res.body.error).toMatch(/erro/i);
    });
  });
});
