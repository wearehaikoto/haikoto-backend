const response = require("./../utils/response");
const OrganisationService = require("./../services/organisation.service");

class OrganisationContoller {
    async create(req, res) {
        const result = await OrganisationService.create(req.body);
        res.status(201).send(response("organisation created", result));
    }

    async getAll(req, res) {
        const result = await OrganisationService.getAll();
        res.status(200).send(response("All organisation", result));
    }

    async getOne(req, res) {
        const result = await OrganisationService.getOne(req.params.organisationId);
        res.status(200).send(response("organisation data", result));
    }

    async getByUrlSlug(req, res) {
        const result = await OrganisationService.getByUrlSlug(req.params.url_slug);
        res.status(200).send(response("organisation data", result));
    }

    async update(req, res) {
        const result = await OrganisationService.update(req.params.organisationId, req.body);
        res.status(200).send(response("organisation updated", result));
    }

    async delete(req, res) {
        const result = await OrganisationService.delete(req.params.organisationId);
        res.status(200).send(response("organisation deleted", result));
    }
}

module.exports = new OrganisationContoller();
