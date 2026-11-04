const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "NAO_AUTORIZADO", message: "Token não fornecido." });
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'chave-secreta-temporaria');
        req.usuario = decoded; // Salva os dados do usuário na requisição
        return next();
    } catch (err) {
        return res.status(401).json({ error: "NAO_AUTORIZADO", message: "Token inválido ou expirado." });
    }
};