const ProjectServ = require("./../services/project.service");

const response = require("./../utils/response");

class ProjectContoller {
    async create(req, res) {
        const result = await ProjectServ.create(req.body);
        res.status(201).send(response("project created", result));
    }

    async getAll(req, res) {
        const result = await ProjectServ.getAll();
        res.status(200).send(response("all projects", result));
    }

    async getAllDefaults(req, res) {
        const result = await ProjectServ.getAllDefaults();
        res.status(200).send(response("all default projects", result));
    }

    async getAllByOrganisation(req, res) {
        const result = await ProjectServ.getAllByOrganisation(req.params.organisationId);
        res.status(200).send(response("all projects by organisation", result));
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
