// __tests__/youtube-callback.test.js
const request = require('supertest');
const app = require('../src/index');

describe('Rota GET /youtube-callback', () => {
  it('deve retornar 400 se o hub.mode estiver ausente', async () => {
    const response = await request(app).get('/youtube-callback').query({
      'hub.challenge': '1234',
      'hub.verify_token': 'ligacrypto_bot',
    });
    expect(response.status).toBe(400);
    expect(response.text).toBe('Parâmetros inválidos');
  });

  it('deve retornar 400 se o hub.challenge estiver ausente', async () => {
    const response = await request(app).get('/youtube-callback').query({
      'hub.mode': 'subscribe',
      'hub.verify_token': 'ligacrypto_bot',
    });
    expect(response.status).toBe(400);
    expect(response.text).toBe('Parâmetros inválidos');
  });

  it('deve retornar 400 se o hub.verify_token estiver ausente', async () => {
    const response = await request(app).get('/youtube-callback').query({
      'hub.mode': 'subscribe',
      'hub.challenge': '1234',
    });
    expect(response.status).toBe(400);
    expect(response.text).toBe('Parâmetros inválidos');
  });

  it('deve retornar 403 se o hub.verify_token for inválido', async () => {
    const response = await request(app).get('/youtube-callback').query({
      'hub.mode': 'subscribe',
      'hub.challenge': '1234',
      'hub.verify_token': 'token_incorreto',
    });
    expect(response.status).toBe(403);
    expect(response.text).toBe('Token inválido');
  });

  it('deve retornar 200 e o hub.challenge se os parâmetros forem válidos', async () => {
    const response = await request(app).get('/youtube-callback').query({
      'hub.mode': 'subscribe',
      'hub.challenge': '1234',
      'hub.verify_token': 'ligacrypto_bot',
    });
    expect(response.status).toBe(200);
    expect(response.text).toBe('1234');
  });
});
