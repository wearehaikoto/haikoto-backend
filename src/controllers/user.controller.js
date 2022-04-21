const response = require("./../utils/response");
const UserService = require("./../services/user.service");

class UserContoller {
    async create(req, res) {
        const result = await UserService.create(req.body);
        res.status(200).send(response("user created", result));
    }

    async getAll(req, res) {
        const result = await UserService.getAll();
        res.status(200).send(response("all users", result));
    }

    async getAllByOrganisation(req, res) {
        const result = await UserService.getAllByOrganisation(req.params.organisationId);
        res.status(200).send(response("all users by organisation", result));
    }

    async getMe(req, res) {
        const result = await UserService.getOne(req.$user._id);
        res.status(200).send(response("user data", result));
    }

    async getOne(req, res) {
        const result = await UserService.getOne(req.params.userId);
        res.status(200).send(response("user data", result));
    }

    async update(req, res) {
        const result = await UserService.update(req.params.userId, req.body);
        res.status(200).send(response("user updated", result));
    }

    async updateRole(req, res) {
        const result = await UserService.updateRole(req.params.userId, req.body);
        res.status(200).send(response("user role updated", result));
    }

    async delete(req, res) {
        const result = await UserService.delete(req.params.userId);
        res.status(200).send(response("user deleted", result));
    }
}

module.exports = new UserContoller();
