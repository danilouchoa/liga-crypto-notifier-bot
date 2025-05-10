const request = require('supertest');
const app = require('../src/index');

jest.mock('../src/routes/youtube', () => {
  process.env.TELEGRAM_BOT_TOKEN = 'fake-telegram-token';
  process.env.TELEGRAM_CHAT_ID = 'fake-chat-id';
  return jest.requireActual('../src/routes/youtube');
});

describe('GET /youtube-callback', () => {
  describe('Casos válidos', () => {
    it('retorna 200 com o valor de challenge quando todos os parâmetros são válidos', async () => {
      const res = await request(app).get('/youtube-callback').query({
        'hub.mode': 'subscribe',
        'hub.challenge': '1234',
        'hub.verify_token': 'ligacrypto_bot',
      });

      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('1234');
    });

    it('retorna 200 com mensagem "Unsubscribed" quando modo é unsubscribe', async () => {
      const res = await request(app).get('/youtube-callback').query({
        'hub.mode': 'unsubscribe',
        'hub.challenge': '1234',
        'hub.verify_token': 'ligacrypto_bot',
      });

      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('Unsubscribed');
    });
  });

  describe('Casos inválidos', () => {
    it('retorna 400 quando nenhum parâmetro é enviado', async () => {
      const res = await request(app).get('/youtube-callback');
      expect(res.statusCode).toBe(400);
      expect(res.text).toBe('Parametros invalidos');
    });

    it('retorna 400 quando apenas o modo é enviado', async () => {
      const res = await request(app).get('/youtube-callback').query({
        'hub.mode': 'subscribe',
      });
      expect(res.statusCode).toBe(400);
      expect(res.text).toBe('Parametros invalidos');
    });

    it('retorna 400 quando challenge está ausente', async () => {
      const res = await request(app).get('/youtube-callback').query({
        'hub.mode': 'subscribe',
        'hub.verify_token': 'ligacrypto_bot',
      });
      expect(res.statusCode).toBe(400);
      expect(res.text).toBe('Challenge invalido');
    });

    it('retorna 400 quando challenge está vazio', async () => {
      const res = await request(app).get('/youtube-callback').query({
        'hub.mode': 'subscribe',
        'hub.challenge': '',
        'hub.verify_token': 'ligacrypto_bot',
      });
      expect(res.statusCode).toBe(400);
      expect(res.text).toBe('Challenge invalido');
    });

    it('retorna 403 quando o token é inválido', async () => {
      const res = await request(app).get('/youtube-callback').query({
        'hub.mode': 'subscribe',
        'hub.challenge': 'abcd',
        'hub.verify_token': 'token_errado',
      });
      expect(res.statusCode).toBe(403);
      expect(res.text).toBe('Token invalido');
    });

    it('retorna 400 quando o modo é inválido', async () => {
      const res = await request(app).get('/youtube-callback').query({
        'hub.mode': 'invalidmode',
        'hub.challenge': '9999',
        'hub.verify_token': 'ligacrypto_bot',
      });
      expect(res.statusCode).toBe(400);
      expect(res.text).toBe('Modo inválido');
    });
  });
});
