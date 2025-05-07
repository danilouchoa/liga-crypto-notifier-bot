const request = require('supertest');
const app = require('../src/index');

describe('GET /health', () => {
  it('retorna status 200 e corpo "OK"', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('OK');
  });
});
