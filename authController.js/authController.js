// src/api/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// A função que vai lidar com a rota de login
const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // 1. Buscar o usuário no banco de dados pelo e-mail
        const usuario = await prisma.usuario.findUnique({ where: { email } });

        if (!usuario) {
            return res.status(401).json({ 
                error: "UNAUTHORIZED", 
                message: "Credenciais inválidas." 
            });
        }

        // 2. Comparar a senha enviada com a senha criptografada (hash) no banco
        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.status(401).json({ 
                error: "UNAUTHORIZED", 
                message: "Credenciais inválidas." 
            });
        }

        // 3. Gerar o Token JWT
        // DICA: Coloque essa string secreta no seu arquivo .env para segurança!
        const token = jwt.sign(
            { id: usuario.id, perfil: usuario.perfil }, 
            process.env.JWT_SECRET || 'chave-secreta-temporaria', 
            { expiresIn: '1d' }
        );

        // 4. Retornar o token (nunca retorne a senha!)
        return res.status(200).json({
            message: "Login realizado com sucesso",
            token: token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                perfil: usuario.perfil
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            error: "INTERNAL_SERVER_ERROR", 
            message: "Erro interno no servidor." 
        });
    }
};

module.exports = { login };