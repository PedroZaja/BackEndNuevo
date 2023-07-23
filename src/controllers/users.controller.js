import UserService from "../services/users.service.js";

const userService = new UserService();

export const swapUserClass = async (req, res, next) => {
    try {

        const email = req.params.uid;

        let dbUser = await userService.findOne(email);
        req.logger.debug(`Get user data from: ${email}`);

        if (dbUser.role === "admin") {
            return res.status(403).json({ status: "error", message: "Admin users cant swap roles" });

        } else if (dbUser.role === "user") {
            dbUser.role = "premium";
            const changedRole = await userService.updateUser(email, dbUser);
            return res.status(200).json({ status: "success", message: `The Role was changed successfully to ${dbUser.role}.`});

        } else if (dbUser.role === "premium") {
            dbUser.role = "user";
            const changedRole = await userService.updateUser(email, dbUser);
            return res.status(200).json({ status: "success", message: `The Role was changed successfully to ${dbUser.role}.`});

        }
        
    } catch (error) {
        next(error)
    }
}