module.exports = (perfisPermitidos) => {
    return (req, res, next) => {
        // O authMiddleware já rodou e colocou o usuário em req.usuario
        if (!req.usuario || !perfisPermitidos.includes(req.usuario.perfil)) {
            return res.status(403).json({ 
                error: "ACESSO_NEGADO", 
                message: "Você não tem permissão para acessar este recurso. Perfil inadequado.",
                timestamp: new Date().toISOString(),
                path: req.originalUrl
            });
        }
        return next();
    };
};