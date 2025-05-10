const request = require('supertest');
const app = require('../src/index');

jest.mock('axios');

beforeEach(() => {
  jest.clearAllMocks();
  process.env.TELEGRAM_BOT_TOKEN ||= 'fake-token';
  process.env.TELEGRAM_CHAT_ID ||= 'fake-chat-id';
});

describe('POST /youtube-callback com corpo invalido', () => {
  it('deve retornar 400 se o corpo não for um JSON válido', async () => {
    const response = await request(app)
      .post('/youtube-callback')
      .set('Content-Type', 'application/json')
      .send('isso não é um JSON');

    expect(response.status).toBe(400);
    expect(response.text).toBe('Formato invalido');
  });

  it('deve retornar 400 se o corpo não for um XML válido', async () => {
    const response = await request(app)
      .post('/youtube-callback')
      .set('Content-Type', 'application/xml')
      .send('<feed><invalid></feed>');

    expect(response.status).toBe(400);
    expect(response.text).toBe('Erro ao parsear XML');
  });

  it('deve retornar 400 se o corpo for vazio', async () => {
    const response = await request(app)
      .post('/youtube-callback')
      .set('Content-Type', 'application/xml')
      .send('');

    expect(response.status).toBe(400);
    expect(response.text).toBe('Formato invalido');
  });

  it('deve retornar 200 se o XML não contiver a tag <yt:videoId>', async () => {
    const response = await request(app)
      .post('/youtube-callback')
      .set('Content-Type', 'application/xml').send(`
        <feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns="http://www.w3.org/2005/Atom">
          <entry>
            <title>Video sem ID</title>
          </entry>
        </feed>
      `);

    expect(response.status).toBe(200);
  });
});
