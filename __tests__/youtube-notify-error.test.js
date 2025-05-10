const request = require('supertest');
const app = require('../src/index');
const axios = require('axios');

jest.mock('axios'); // Mocka o axios para evitar chamadas reais
jest.mock('../src/routes/youtube', () => {
  process.env.TELEGRAM_BOT_TOKEN = 'fake-telegram-token';
  process.env.TELEGRAM_CHAT_ID = 'fake-chat-id';
  return jest.requireActual('../src/routes/youtube');
});

describe('POST /youtube-callback com falha no envio ao Telegram', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  it('deve logar erro se o envio ao Telegram falhar', async () => {
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
  });

  it('não deve chamar o Telegram se o XML não contiver <yt:videoId>', async () => {
    const payload = `
      <feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <title>Sem videoId</title>
        </entry>
      </feed>
    `;

    const response = await request(app)
      .post('/youtube-callback')
      .set('Content-Type', 'application/xml')
      .send(payload.trim());

    expect(response.status).toBe(200); // A API responde 200 mesmo sem videoId
    expect(axios.post).not.toHaveBeenCalled(); // Verifica que o Telegram não foi chamado
  });
});
