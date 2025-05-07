// __tests__/youtube-invalid-body.test.js
const request = require('supertest');
const app = require('../src/index');

describe('POST /youtube-callback com corpo inválido', () => {
  it('deve retornar 400 se o corpo não for um JSON válido', async () => {
    const response = await request(app)
      .post('/youtube-callback')
      .set('Content-Type', 'application/json')
      .send('isso não é um JSON'); // string malformada

    expect(response.status).toBe(400);
    expect(response.text).toBe('Formato inválido');
  });
});
