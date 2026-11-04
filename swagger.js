const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Raízes do Nordeste',
      version: '1.0.0',
      description: 'Documentação do Back-end do Projeto Multidisciplinar.',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['./src/api/*.js'], // Caminho dos arquivos com as rotas
};

module.exports = swaggerJsDoc(options);