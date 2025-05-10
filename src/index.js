// src/index.js

require('dotenv').config();
const express = require('express');

const app = express();

// Middlewares
const logger = require('../middlewares/logger');
const bodyParserMiddleware = require('../middlewares/bodyParser');
const errorHandler = require('../middlewares/errorHandler');
const { securityMiddleware, secure404 } = require('../middlewares/security');
const rootRedirect = require('../middlewares/rootRedirect');
const docsHandler = require('../middlewares/docsHandler');

app.disable('x-powered-by');
app.use(securityMiddleware());
app.use(logger);
bodyParserMiddleware.forEach((mw) => app.use(mw));

// Redirecionamento da raiz para a doc
app.get('/', rootRedirect);

// Modularização da documentação Redoc
docsHandler(app);

// Rotas da API
const routes = require('./routes');
app.use('/', routes);

// Handler de erro global
app.use(errorHandler);

// Respostas seguras para crawlers e bots
const handleBotsRequest = require('../middlewares/robotsHandler');
app.get(['/robots.txt', '/sitemap.xml'], handleBotsRequest);

// 404 para demais rotas
app.use(secure404);

// CLI
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(
      `Servidor ativo na porta ${PORT} — Ambiente: ${process.env.NODE_ENV || 'development'}`
    );
    console.log(`Documentação disponível em http://localhost:${PORT}/docs`);
  });
}

module.exports = app;
