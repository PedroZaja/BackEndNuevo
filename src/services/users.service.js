import { UserRepositoryWithDao } from "../repository/index.repository.js";

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
    

};