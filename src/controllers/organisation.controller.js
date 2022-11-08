const OrganisationServ = require("./../services/organisation.service");

const response = require("./../utils/response");

class OrganisationContoller {
    async create(req, res) {
        const result = await OrganisationServ.create(req.body);
        res.status(201).send(response("organisation created", result));
    }

    async getAll(req, res) {
        const result = await OrganisationServ.getAll();
        res.status(200).send(response("All organisation", result));
    }

    async getOneBySlug(req, res) {
        const result = await OrganisationServ.getOneBySlug(req.params.slug);
        res.status(200).send(response("organisation data", result));
    }

    async getOne(req, res) {
        const result = await OrganisationServ.getOne(req.params.organisationId);
        res.status(200).send(response("organisation data", result));
    }

    async update(req, res) {
        const result = await OrganisationServ.update(req.params.organisationId, req.body);
        res.status(200).send(response("organisation updated", result));
    }

    async delete(req, res) {
        const result = await OrganisationServ.delete(req.params.organisationId);
        res.status(200).send(response("organisation deleted", result));
    }
}

module.exports = new OrganisationContoller();
