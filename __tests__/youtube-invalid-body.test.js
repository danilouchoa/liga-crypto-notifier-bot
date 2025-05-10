const request = require('supertest');
const app = require('../src/index');

jest.mock('../src/routes/youtube', () => {
  process.env.TELEGRAM_BOT_TOKEN = 'fake-telegram-token';
  process.env.TELEGRAM_CHAT_ID = 'fake-chat-id';
  return jest.requireActual('../src/routes/youtube');
});

describe('POST /youtube-callback com corpo inválido', () => {
  it('deve retornar 400 se o corpo não for um JSON válido', async () => {
    const response = await request(app)
      .post('/youtube-callback')
      .set('Content-Type', 'application/json')
      .send('isso não é um JSON'); // string malformada

    expect(response.status).toBe(400); // Verifica se o status é 400
    expect(response.text).toBe('Formato inválido'); // Verifica a mensagem de erro
  });

  it('deve retornar 400 se o corpo não for um XML válido', async () => {
    const response = await request(app)
      .post('/youtube-callback')
      .set('Content-Type', 'application/xml')
      .send('<feed><invalid></feed>'); // XML malformado

    expect(response.status).toBe(400); // Verifica se o status é 400
    expect(response.text).toBe('Erro ao parsear XML'); // Verifica a mensagem de erro
  });

  it('deve retornar 400 se o corpo for vazio', async () => {
    const response = await request(app)
      .post('/youtube-callback')
      .set('Content-Type', 'application/xml')
      .send(''); // Corpo vazio

    expect(response.status).toBe(400); // Verifica se o status é 400
    expect(response.text).toBe('Formato inválido'); // Verifica a mensagem de erro
  });
});
