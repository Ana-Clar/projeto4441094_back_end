require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger');

const { login } = require('./src/api/authController');
const authMiddleware = require('./src/api/authMiddleware');
const roleMiddleware = require('./src/api/roleMiddleware'); 
const { criarPedido, listarTodosPedidos } = require('./src/api/pedidoController');
const { processarPagamentoMock } = require('./src/api/pagamentoController');

const app = express();
app.use(express.json());

// Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotas
app.post('/auth/login', login);
app.post('/pedidos', authMiddleware, criarPedido);
app.post('/pagamentos/:pedidoId', authMiddleware, processarPagamentoMock);
app.get('/admin/pedidos', authMiddleware, roleMiddleware(['GERENTE']), listarTodosPedidos);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Documentação Swagger em http://localhost:${PORT}/docs`); // ESSA LINHA É A CHAVE!
});