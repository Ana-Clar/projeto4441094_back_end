const prisma = require('../infrastructure/prisma');

const criarPedido = async (req, res) => {
    try {
        const { canalPedido, unidadeId, itens } = req.body;
        const usuarioId = req.usuario.id;

        // 1. ERRO 422: Request inválido (Falta canalPedido ou itens)
        if (!canalPedido || !itens || itens.length === 0) {
            return res.status(422).json({ 
                error: "VALIDACAO", 
                message: "canalPedido e itens são obrigatórios.",
                timestamp: new Date().toISOString(),
                path: "/pedidos"
            });
        }

        // 2. ERRO 422: Canal inválido
        const canaisValidos = ['APP', 'TOTEM', 'BALCAO', 'PICKUP', 'WEB'];
        if (!canaisValidos.includes(canalPedido)) {
            return res.status(422).json({ 
                error: "VALIDACAO", 
                message: "canalPedido inválido. Use APP, TOTEM, BALCAO, PICKUP ou WEB.",
                timestamp: new Date().toISOString(),
                path: "/pedidos"
            });
        }

        // 3. ERRO 404: Unidade inexistente
        const unidadeExiste = await prisma.unidade.findUnique({ where: { id: unidadeId } });
        if (!unidadeExiste) {
            return res.status(404).json({ 
                error: "NAO_ENCONTRADO", 
                message: "Unidade não encontrada.",
                timestamp: new Date().toISOString(),
                path: "/pedidos"
            });
        }

        let valorTotal = 0;
        const itensParaSalvar = [];

        for (const item of itens) {
            // 4. ERRO 404: Produto inexistente
            const produtoExiste = await prisma.produto.findUnique({ where: { id: item.produtoId } });
            if (!produtoExiste) {
                return res.status(404).json({ 
                    error: "NAO_ENCONTRADO", 
                    message: `Produto ID ${item.produtoId} não encontrado.`,
                    timestamp: new Date().toISOString(),
                    path: "/pedidos"
                });
            }

            // 5. ERRO 409: Sem estoque
            const estoque = await prisma.estoque.findUnique({
                where: { unidadeId_produtoId: { unidadeId, produtoId: item.produtoId } }
            });

            if (!estoque || estoque.quantidade < item.quantidade) {
                return res.status(409).json({ 
                    error: "ESTOQUE_INSUFICIENTE", 
                    message: "Não há quantidade suficiente para um ou mais itens.",
                    details: [{ field: "itens", issue: `Disponível: ${estoque ? estoque.quantidade : 0}` }],
                    timestamp: new Date().toISOString(),
                    path: "/pedidos"
                });
            }

            valorTotal += produtoExiste.preco * item.quantidade;
            itensParaSalvar.push({
                produtoId: item.produtoId,
                quantidade: item.quantidade,
                precoUnitario: produtoExiste.preco
            });
        }

        // Criar o Pedido
        const pedido = await prisma.pedido.create({
            data: {
                canalPedido,
                usuarioId,
                unidadeId,
                valorTotal,
                status: "AGUARDANDO_PAGAMENTO",
                itens: { create: itensParaSalvar }
            }
        });

        // Dar baixa no Estoque
        for (const item of itens) {
            await prisma.estoque.update({
                where: { unidadeId_produtoId: { unidadeId, produtoId: item.produtoId } },
                data: { quantidade: { decrement: item.quantidade } }
            });
        }

        return res.status(201).json({ mensagem: "Pedido criado com sucesso!", pedido });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "ERRO_INTERNO", message: "Erro ao criar pedido." });
    }
};

// Rota restrita para GERENTE listar todos os pedidos
const listarTodosPedidos = async (req, res) => {
    try {
        const pedidos = await prisma.pedido.findMany();
        return res.status(200).json(pedidos);
    } catch (error) {
        return res.status(500).json({ error: "ERRO_INTERNO" });
    }
};

module.exports = { criarPedido, listarTodosPedidos };
