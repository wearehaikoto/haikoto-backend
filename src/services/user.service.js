const User = require("./../models/user.model");
const CustomError = require("./../utils/custom-error");
const ObjectId = require("mongoose").Types.ObjectId;

class UserService {
  async getAll() {
    return await User.find({ isDeleted: false }, { __v: 0 });
  }

  async getOne(userId) {
    if (!ObjectId.isValid(userId)) throw new CustomError("User does not exist");

    const user = await User.findOne({ _id: userId });
    if (!user) throw new CustomError("User does not exist");

    return user;
  }

  async updateRole(userId, data) {
    if (!data.role) throw new CustomError("User Role is required");
    if (!ObjectId.isValid(userId)) throw new CustomError("User does not exist");

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { role: data.role },
      { new: true }
    );
    if (!user) throw new CustomError("User does not exist");

    return user;
  }

  async delete(userId) {
    if (!ObjectId.isValid(userId)) throw new CustomError("User does not exist");

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { isDeleted: true },
      { new: true }
    );

    if (!user) throw new CustomError("User does not exist");

    return user;
  }
}

module.exports = new UserService();
