const request = require('supertest');
const app = require('../src/index');

describe('GET /docs', () => {
  it('retorna 200 com HTML da documentação', async () => {
    const res = await request(app).get('/docs');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('<redoc spec-url="/docs/openapi.json">');
  });
});
