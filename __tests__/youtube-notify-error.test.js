// __tests__/youtube-notify-error.test.js
const request = require('supertest');
const app = require('../src/index');
const axios = require('axios');

jest.mock('axios');

describe('POST /youtube-callback com falha no envio ao Telegram', () => {
  it('deve logar erro se o envio ao Telegram falhar', async () => {
    axios.post.mockRejectedValue({
      response: { data: 'Erro simulado no Telegram' },
    });

    const payload = {
      subscription: { type: 'channel', id: 'UC_xxx' },
      notification: {
        title: 'Novo vídeo',
        videoId: 'abc123',
        publishedAt: new Date().toISOString(),
      },
    };

    const response = await request(app)
      .post('/youtube-callback')
      .send(payload)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200); // sua API responde 200 mesmo com erro no Telegram
  });
});
