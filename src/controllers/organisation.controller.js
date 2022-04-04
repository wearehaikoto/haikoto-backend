const response = require("./../utils/response");
const OrganisationServ = require("./../services/organisation.service");

class OrganisationContoller {
    async create(req, res) {
        const result = await OrganisationServ.create(req.body);
        res.status(201).send(response("organisation created", result));
    }

    async getAll(req, res) {
        const result = await OrganisationServ.getAll();
        res.status(200).send(response("all organisation", result));
    }

    async getOneBySlugUrl(req, res) {
        const result = await OrganisationServ.getOneBySlugUrl(req.params.slugUrl);
        res.status(200).send(response("organisation data", result));
    }

    async getOneExportData(req, res) {
        const result = await OrganisationServ.getOneExportData(req.params.organisationId);
        res.status(200).send(response("organisation export data", result));
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
