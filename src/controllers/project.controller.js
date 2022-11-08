const ProjectServ = require("./../services/project.service");

const response = require("./../utils/response");

class ProjectContoller {
    async create(req, res) {
        const result = await ProjectServ.create(req.body);
        res.status(201).send(response("project created", result));
    }

    async getAll(req, res) {
        const result = await ProjectServ.getAll();
        res.status(200).send(response("All project", result));
    }

    async getAllForUser(req, res) {
        const result = await ProjectServ.getAllForUser(req.$user, req.$organisation);
        res.status(200).send(response("All project for user", result));
    }

    async getAllForOrganisation(req, res) {
        const result = await ProjectServ.getAllForOrganisation(req.params.organisationId);
        res.status(200).send(response("All project for organisation", result));
    }

    async getOne(req, res) {
        const result = await ProjectServ.getOne(req.params.projectId);
        res.status(200).send(response("project data", result));
    }

    async update(req, res) {
        const result = await ProjectServ.update(req.params.projectId, req.body);
        res.status(200).send(response("project updated", result));
    }

    async delete(req, res) {
        const result = await ProjectServ.delete(req.params.projectId);
        res.status(200).send(response("project deleted", result));
    }
}

module.exports = new ProjectContoller();
