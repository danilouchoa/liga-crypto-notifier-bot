const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verifica o status da aplicação
 *     description: Retorna 200 OK para indicar que a API está operando corretamente.
 *     tags:
 *       - Health Check
 *     responses:
 *       200:
 *         description: A API está saudável
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: OK
 */
router.get('/health', (req, res) => {
  res.status(200).send('OK');
});

module.exports = router;
