import { UserRepositoryWithDao } from "../repository/index.repository.js";
import Logger from '../config/logger.js'

const log = new Logger();

export default class UserService {

    async createUser(user) {

        const newUser = await UserRepositoryWithDao.createUser(user);
        return newUser;
    };

    async getAll() {

        const users = await UserRepositoryWithDao.getAll();
        return users
    };

    async findOne(email) {

        const result = await UserRepositoryWithDao.findOne(email);
        return result;
    };

    async updateUser(userId, userToReplace) {

        const result = await UserRepositoryWithDao.updateUser(userId, userToReplace);
        return result;
    }

    async findById(id) {

        const result = await UserRepositoryWithDao.findById(id);
        return result;
    };

    async uploadFiles(userId, files, reference) {

        if (!userId) {
            return res.status(401).json({ status: 'error', error: "Se requiere un usuario." });
        }
        if (!files) {
            return res.status(401).json({ status: 'error', error: "Se requieren archivos." });
        }

        try {
            const user = await UserRepositoryWithDao.findById(userId);
            if (!user) {
                return res.status(401).json({ status: 'error', error: "No se encuentra al usuario." });
            }
            if (!user.documents) {
                user.documents = [];
            }

            files.forEach(file => {
                user.documents.push({
                    name: file.filename,
                    reference: reference,
                    status: "Uploaded"
                });
            });

            const updatedUser = await UserRepositoryWithDao.updateUser(userId, user);

            log.logger.info(`Archivos cargados satisfactoriamente: User ID ${userId}`);
            return updatedUser;

        } catch (error) {
            log.logger.warn(`Error cargando archivos: ${error.message}`);
            next(error);
        }
    };

    async swapUserRole(email) {

        if (!email) {
            return res.status(401).json({ status: 'error', error: "Se requiere email." });
        }

        try {

            let user = await UserRepositoryWithDao.findOne(email);
            log.logger.debug(`Obteniendo datos desde: ${email}`);

            if (!user) {
                return res.status(401).json({ status: 'error', error: "No se encuentra el usuario." });
            }

            if (user.role === "admin") {
                return res.status(403).json({ status: "error", message: "Admin users no pueden cambiar de roles" });

            } else {

                const requiredDocuments = ["Identification", "Proof of address", "Proof of bank account"];
                const hasRequiredDocuments = requiredDocuments.every(document => {
                    return user.documents.some(doc => doc.reference.includes(document) && doc.status === "Uploaded");
                });

                if (hasRequiredDocuments) {

                    if (user.role === "user") {
                        user.role = "premium";
                        const changedRole = await UserRepositoryWithDao.updateUser(email, user);
                        return res.status(200).json({ status: "success", message: `El rol se cambio con exito a  ${user.role}.` });

                    } else if (user.role === "premium") {
                        user.role = "user";
                        const changedRole = await UserRepositoryWithDao.updateUser(email, user);
                        return res.status(200).json({ status: "success", message: `El rol se cambio con exito a  ${user.role}.` });
                    }

                }
            }
        } catch (error) {
            log.logger.warn(`Error cambiando el rol: ${error.message}`);
            next(error);
        }
    };

};