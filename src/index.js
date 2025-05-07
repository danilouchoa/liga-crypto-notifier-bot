// src/index.js

require('dotenv').config();
const express = require('express');

const app = express();

// Middlewares
const logger = require('../middlewares/logger');
const bodyParserMiddleware = require('../middlewares/bodyParser');
const errorHandler = require('../middlewares/errorHandler');
const { securityMiddleware, secure404 } = require('../middlewares/security');

app.disable('x-powered-by');
app.use(securityMiddleware());
app.use(logger);
app.use(bodyParserMiddleware);

// Rotas
const routes = require('./routes');
app.use('/', routes);

// Handler de erro global
app.use(errorHandler);

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
