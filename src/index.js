// src/index.js

require('dotenv').config();
const express = require('express');

const app = express();

// Middlewares
const securityMiddleware = require('../middlewares/security');
const logger = require('../middlewares/logger');
const bodyParserMiddleware = require('../middlewares/bodyParser');
const errorHandler = require('../middlewares/errorHandler');

app.disable('x-powered-by');
app.use(securityMiddleware());
app.use(logger);
app.use(bodyParserMiddleware);

// Rotas
const routes = require('./routes');
app.use('/', routes);

// Handler de erro global
app.use(errorHandler);

// Se for chamado diretamente via CLI (ex: node src/index.js)
/* istanbul ignore next */
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor ativo na porta ${PORT}`);
  });
}

// Exporta para testes
module.exports = app;
