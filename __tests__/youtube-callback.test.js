// __tests__/youtube-callback.test.js
const request = require('supertest');
const app = require('../src/index');

describe('Rota GET /youtube-callback com parâmetros inválidos', () => {
  it('deve retornar 400 se parâmetros estiverem ausentes ou inválidos', async () => {
    const response = await request(app).get('/youtube-callback'); // sem query params
    expect(response.status).toBe(400);
    expect(response.text).toBe('Parâmetros inválidos');
  });
});
