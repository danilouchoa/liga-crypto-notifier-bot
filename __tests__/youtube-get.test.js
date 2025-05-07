const request = require('supertest');
const app = require('../src/index');

describe('GET /youtube-callback', () => {
  it('retorna 200 e challenge quando o token é válido', async () => {
    const res = await request(app).get('/youtube-callback').query({
      'hub.mode': 'subscribe',
      'hub.challenge': '1234',
      'hub.verify_token': 'ligacrypto_bot',
    });

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('1234');
  });

  it('retorna 403 quando o token é inválido', async () => {
    const res = await request(app).get('/youtube-callback').query({
      'hub.mode': 'subscribe',
      'hub.challenge': 'abcd',
      'hub.verify_token': 'token_errado',
    });

    expect(res.statusCode).toBe(403);
    expect(res.text).toBe('Forbidden');
  });
});
