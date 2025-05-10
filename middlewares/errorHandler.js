// middlewares/errorHandler.js

function errorHandler(err, req, res, next) {
  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    req.is('application/json')
  ) {
    console.warn('Erro de JSON inválido:', err.message);
    return res.status(400).send('Formato invalido');
  }

  if (req.is('application/xml')) {
    console.warn('Erro de XML inválido:', err.message);
    return res.status(400).send('Erro ao parsear XML');
  }

  next(err); // passa para outros middlewares se não for esse caso
}

module.exports = errorHandler;
