const response = require("../utils/response");
const UserService = require("../services/user.service.js");

class UserContoller {
  async getAll(req, res) {
    const result = await UserService.getAll();
    res.status(200).send(response("All Users", result));
  }

  async getOne(req, res) {
    const result = await UserService.getOne(req.params.userId);
    res.status(200).send(response("User data", result));
  }

  async delete(req, res) {
    const result = await UserService.delete(req.params.userId);
    res.status(200).send(response("User deleted", result));
  }
}

module.exports = new UserContoller();
