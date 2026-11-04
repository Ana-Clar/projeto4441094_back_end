const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3'); 
const bcrypt = require('bcryptjs');

// Configurando o adaptador do SQLite
const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando o seed do banco de dados...');

  // 1. Criar usuários (com senha criptografada - LGPD)
  const senhaHash = await bcrypt.hash('Senha@123', 10);

  const gerente = await prisma.usuario.upsert({
    where: { email: 'gerente@raizes.com' },
    update: {},
    create: {
      nome: 'Gerente Recife',
      email: 'gerente@raizes.com',
      senha: senhaHash,
      perfil: 'GERENTE',
      consentimentoLGPD: true,
    },
  });

  const cliente = await prisma.usuario.upsert({
    where: { email: 'cliente@teste.com' },
    update: {},
    create: {
      nome: 'Cliente Teste',
      email: 'cliente@teste.com',
      senha: senhaHash,
      perfil: 'CLIENTE',
      consentimentoLGPD: true,
    },
  });

  // 2. Criar uma Unidade
  const unidadeRecife = await prisma.unidade.create({
    data: { nome: 'Raízes do Nordeste - Recife' }
  });

  // 3. Criar Produtos
  const tapioca = await prisma.produto.create({
    data: {
      nome: 'Tapioca de Carne Seca',
      preco: 15.50,
    },
  });

  const cuscuz = await prisma.produto.create({
    data: {
      nome: 'Cuscuz Completo',
      preco: 12.00,
    },
  });

  // 4. Adicionar Estoque para a Unidade
  await prisma.estoque.create({
    data: {
      unidadeId: unidadeRecife.id,
      produtoId: tapioca.id,
      quantidade: 50, // 50 tapiocas disponíveis
    },
  });

  await prisma.estoque.create({
    data: {
      unidadeId: unidadeRecife.id,
      produtoId: cuscuz.id,
      quantidade: 30, // 30 cuscuz disponíveis
    },
  });

  console.log('Seed concluído com sucesso!');
  console.log('Usuário Gerente:', gerente.email, '| Senha: Senha@123');
  console.log('Usuário Cliente:', cliente.email, '| Senha: Senha@123');
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
