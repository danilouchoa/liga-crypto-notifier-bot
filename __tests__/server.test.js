// tests/server.test.js
const request = require('supertest');
const app = require('../src/index');

let server;

beforeAll((done) => {
  server = app.listen(0, () => {
    console.log(`Test server ativo na porta ${server.address().port}`);
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

describe('Teste de inicialização do servidor', () => {
  it('GET /health deve responder com 200 OK', async () => {
    const response = await request(server).get('/health');
    expect(response.statusCode).toBe(200);
  });
});
