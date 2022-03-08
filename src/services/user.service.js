const User = require("./../models/user.model");
const CustomError = require("./../utils/custom-error");

class UserService {
    async create(data) {
        return await new User(data).save();
    }

    async getAll() {
        return await User.find({ isDeleted: false }, { password: 0, __v: 0 });
    }

    async getOne(userId) {
        const user = await User.findOne({ _id: userId }, { password: 0, __v: 0 });
        if (!user) throw new CustomError("user does not exist", 404);
        return user;
    }

    async update(userId, data) {
        const user = await User.findByIdAndUpdate({ _id: userId }, { $set: data }, { new: true });
        if (!user) throw new CustomError("user does not exist", 404);
        return user;
    }

    async updateRole(userId, data) {
        if (!data.role) throw new CustomError("user role is required");
        const user = await this.update(userId, { role: data.role });
        return user;
    }

    async delete(userId) {
        const user = await this.update(userId, { isDeleted: true });
        return user;
    }
}

module.exports = new UserService();
