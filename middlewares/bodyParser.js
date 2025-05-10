const bodyParser = require('body-parser');

module.exports = [
  bodyParser.json(),
  bodyParser.text({ type: 'application/xml' }), // Para notificações do YouTube
];
