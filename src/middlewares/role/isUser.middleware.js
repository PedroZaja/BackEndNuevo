
export const isUser = (req, res, next) => {
    
        if (req.user.role === "user") return next();
        return res.status(403).json({ status: "error", message: "User role required" });

    };