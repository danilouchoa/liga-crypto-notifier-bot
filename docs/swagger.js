// docs/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Liga Crypto Notifier Bot API',
      version: '1.0.0',
      description:
        'Documentação da API de notificações da Liga Crypto via Telegram.',
    },
    servers: [
      {
        url: process.env.PUBLIC_URL || 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJSDoc(options);
