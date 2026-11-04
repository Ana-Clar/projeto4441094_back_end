const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../infrastructure/prisma');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza o login do usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 */
const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(422).json({ 
                error: "VALIDACAO", 
                message: "E-mail e senha são obrigatórios." 
            });
        }

        const usuario = await prisma.usuario.findUnique({ where: { email } });

        if (!usuario) {
            return res.status(401).json({ error: "NAO_AUTORIZADO", message: "Credenciais inválidas." });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.status(401).json({ error: "NAO_AUTORIZADO", message: "Credenciais inválidas." });
        }

        const token = jwt.sign(
            { id: usuario.id, perfil: usuario.perfil }, 
            process.env.JWT_SECRET || 'chave-secreta-temporaria', 
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            message: "Login realizado com sucesso",
            token: token,
            usuario: { id: usuario.id, nome: usuario.nome, perfil: usuario.perfil }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "ERRO_INTERNO", message: "Erro no servidor." });
    }
};

module.exports = { login };