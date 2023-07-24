const isUser = (req, res, next) => {

    if (req.user.role === "user") return next();
    req.logger.warn(`Rol no autorizado. User role: ${req.user.role}`)
    return res.status(403).json({ status: "error", message: "Se necesita un rol" });

};


const isAdminOrPremium = (req, res, next) => {

    if (req.user.role === "admin" || req.user.role === "premium") return next();
    req.logger.warn(`Rol no autorizado. User role: ${req.user.role}`)
    return res.status(403).json({ status: "error", message: "Admin o Premium requerido!" });
};

export default { isAdminOrPremium, isUser };