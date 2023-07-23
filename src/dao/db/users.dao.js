import { usersModel } from "./models/users.model.js";

export default class UserDao {

    async createUser(user) {

        const newUser = await usersModel.create(user);
        return newUser;
    };

    async getAll() {

        const users = await usersModel.find();
        return users.map(user => user.toObject());
    };

    async findOne(email) {

        const result = await usersModel.findOne({email});
        return result;
    };

    async updateUser(userId, userToReplace) {
        const filter = {email: userId}
        const update = { $set: userToReplace };
        const result = await usersModel.updateOne(filter, update);
        return result;
    }

    async findById(id) {

        const result = await usersModel.findById({_id: id});
        return result;
    };
}