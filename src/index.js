// src/index.js

require('dotenv').config();
const express = require('express');

const app = express();

// Middlewares
const logger = require('../middlewares/logger');
const bodyParserMiddleware = require('../middlewares/bodyParser');
const errorHandler = require('../middlewares/errorHandler');
const { securityMiddleware, secure404 } = require('../middlewares/security');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../docs/swagger');
const rootRedirect = require('../middlewares/rootRedirect');

app.disable('x-powered-by');
app.use(securityMiddleware());
app.use(logger);
app.use(bodyParserMiddleware);

// Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/', rootRedirect); // redireciona para /docs com headers

// Rotas da API
const routes = require('./routes');
app.use('/', routes);

// Handler de erro global
app.use(errorHandler);

// Respostas seguras para rotas comuns de crawlers
app.get(['/robots.txt', '/sitemap.xml'], (req, res) => {
  res.setHeader('Content-Security-Policy', "default-src 'none';");
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.status(404).send('Not found');
});

// 404 seguro
app.use(secure404);

// CLI
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor ativo na porta ${PORT}`);
  });
}

module.exports = app;
