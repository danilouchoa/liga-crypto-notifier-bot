const request = require('supertest');
const app = require('../src/index');
const axios = require('axios');

jest.mock('axios');

beforeEach(() => {
  jest.clearAllMocks();
  process.env.TELEGRAM_BOT_TOKEN ||= 'fake-token';
  process.env.TELEGRAM_CHAT_ID ||= 'fake-chat-id';
});

describe('POST /youtube-callback com falha no envio ao Telegram', () => {
  it('deve logar erro se o envio ao Telegram falhar', async () => {
    const errorSimulado = Object.assign(
      new Error('Erro simulado no Telegram'),
      {
        response: {
          status: 500,
          data: 'Erro simulado no Telegram',
        },
      }
    );

    axios.post.mockRejectedValue(errorSimulado);

    const payload = `
      <feed xmlns:yt="http://www.youtube.com/xml/schemas/2015"
            xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <yt:videoId>abc123</yt:videoId>
        </entry>
      </feed>`;

    const response = await request(app)
      .post('/youtube-callback')
      .set('Content-Type', 'application/xml')
      .send(payload.trim());

    expect(response.status).toBe(200);
    expect(axios.post).toHaveBeenCalled();
    expect(response.text).toBe('');
  });

  it('não deve chamar o Telegram se o XML não contiver <yt:videoId>', async () => {
    const payload = `
      <feed xmlns:yt="http://www.youtube.com/xml/schemas/2015"
            xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <yt:channelId>channel123</yt:channelId>
          <title>Exemplo de vídeo</title>
        </entry>
      </feed>`;

    const response = await request(app)
      .post('/youtube-callback')
      .set('Content-Type', 'application/xml')
      .send(payload.trim());

    expect(response.status).toBe(200);
    expect(axios.post).not.toHaveBeenCalled();
  });
});
