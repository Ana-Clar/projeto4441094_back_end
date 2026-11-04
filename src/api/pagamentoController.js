const prisma = require('../infrastructure/prisma');

const processarPagamentoMock = async (req, res) => {
    try {
        const { pedidoId } = req.params;

        const pedido = await prisma.pedido.findUnique({ where: { id: Number(pedidoId) } });

        if (!pedido) {
            return res.status(404).json({ error: "NAO_ENCONTRADO", message: "Pedido não encontrado." });
        }

        // Simulação de falha: se o valor total for maior que 1000, o cartão é recusado
        const aprovado = pedido.valorTotal <= 1000;
        const statusPagamento = aprovado ? "APROVADO" : "RECUSADO";
        const novoStatusPedido = aprovado ? "PAGO" : "CANCELADO";

        // Registrar pagamento
        await prisma.pagamento.create({
            data: {
                pedidoId: pedido.id,
                status: statusPagamento,
                metodo: "MOCK"
            }
        });

        // Atualizar status do pedido
        await prisma.pedido.update({
            where: { id: pedido.id },
            data: { status: novoStatusPedido }
        });

        return res.status(200).json({ 
            mensagem: `Pagamento ${statusPagamento}`, 
            statusPedido: novoStatusPedido,
            aprovado 
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "ERRO_INTERNO", message: "Erro ao processar pagamento." });
    }
};

module.exports = { processarPagamentoMock }; 