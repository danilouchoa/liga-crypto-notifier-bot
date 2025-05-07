jest.mock('axios');
const axios = require('axios');
const request = require('supertest');
const app = require('../src/index');

describe('POST /youtube-callback', () => {
  it('retorna 200 quando XML válido é enviado com videoId', async () => {
    // Simula uma resposta bem-sucedida do Telegram
    axios.post.mockResolvedValue({
      data: {
        result: {
          message_id: 9999,
        },
      },
    });

    const xmlPayload = `
      <feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns="http://www.w3.org/2005/Atom">
        <entry>
          <yt:videoId>mGI_X5PiAcI</yt:videoId>
        </entry>
      </feed>
    `;

    const res = await request(app)
      .post('/youtube-callback')
      .set('Content-Type', 'application/xml')
      .send(xmlPayload.trim());

    expect(res.statusCode).toBe(200);
  });

  it('retorna 200 mesmo sem <entry> (deve ignorar)', async () => {
    const xmlPayload = `
      <feed xmlns="http://www.w3.org/2005/Atom">
        <title>No video entry</title>
      </feed>
    `;

    const res = await request(app)
      .post('/youtube-callback')
      .set('Content-Type', 'application/xml')
      .send(xmlPayload.trim());

    expect(res.statusCode).toBe(200);
  });
});
