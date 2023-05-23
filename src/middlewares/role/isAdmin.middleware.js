export const isAdmin = (req, res, next) => {

    if (req.user.role === "admin") return next();
    req.logger.warn(`Unauthorized user. User role: ${req.user.role}`)
    return res.status(403).json({ status: "error", message: "Admin role required" });
};