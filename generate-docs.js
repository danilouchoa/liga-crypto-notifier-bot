// generate-docs.js
const fs = require('fs');
const path = require('path');
const swaggerSpec = require('./docs/swagger');

fs.writeFileSync(
  path.join(__dirname, 'docs', 'openapi.json'),
  JSON.stringify(swaggerSpec, null, 2)
);
console.log('✅ Documento OpenAPI gerado com sucesso em docs/openapi.json');
