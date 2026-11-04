# API Back-end - Rede "Raízes do Nordeste"

Este projeto é uma API RESTful desenvolvida em Node.js para gerenciar os pedidos multicanal (APP, TOTEM, BALCAO, PICKUP, WEB) da rede de lanchonetes Raízes do Nordeste. A API conta com autenticação via JWT, controle de perfis (Roles), validação de estoque, integração simulada de pagamento (Mock) e documentação Swagger.

## Tecnologias Utilizadas
* **Node.js** (Ambiente de execução)
* **Express** (Framework web)
* **Prisma ORM** (Persistência de dados)
* **SQLite** (Banco de dados relacional)
* **JWT** (Autenticação via Token)
* **Swagger** (Documentação da API)

## Pré-requisitos
Antes de começar, você vai precisar ter instalado em sua máquina:
* [Node.js](https://nodejs.org/en/) (versão LTS)
* Um gerenciador de pacotes (NPM, que já vem com o Node)

## Passo a Passo para Execução:

### 1. Instalar as dependências
No terminal, dentro da pasta do projeto, execute:
```bash
npm install

2.
*Crie um arquivo chamado .env na raiz do projeto e adicione a chave secreta para o JWT:
JWT_SECRET=sua_chave_super_secreta_aqui
(Nota: O arquivo .env.example está disponível no repositório como referência).

3.Criar o Banco de Dados e Tabelas:
* npx prisma migrate dev --name init

4.Popular o Banco (Seed com dados de teste)
* node seed.js

5.Iniciar o Servidor:
* node app.js

6. Documentação
*Com o servidor rodando, acesse a documentação no navegador:
l http://localhost:3000/docs

Usuários para Teste
* Gerente: gerente@raizes.com | Senha: Senha@123
* Cliente: cliente@teste.com | Senha: Senha@123

7. Testes (Thunder Client / Postman)
* Importe o arquivo testes_thunder.json (disponível neste repositório) para rodar os cenários de teste (positivos e negativos). Não esqueça de usar o Token gerado no Login no Header Authorization das rotas protegidas.