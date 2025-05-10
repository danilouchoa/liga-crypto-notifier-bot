const request = require('supertest');
const app = require('../src/index');

describe('Rotas 404 especiais', () => {
  it('GET /robots.txt deve responder com 404', async () => {
    const res = await request(app).get('/robots.txt');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('GET /sitemap.xml deve responder com 404', async () => {
    const res = await request(app).get('/sitemap.xml');
    expect(res.status).toBe(404);
  });

  it('GET /rota-invalida deve cair no secure404', async () => {
    const res = await request(app).get('/inexistente-total');
    expect(res.status).toBe(404);
  });
});
