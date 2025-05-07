const bodyParser = require('body-parser');

module.exports = [
  bodyParser.json(),
  bodyParser.text({ type: 'application/atom+xml' }), // Para notificações do YouTube
];
