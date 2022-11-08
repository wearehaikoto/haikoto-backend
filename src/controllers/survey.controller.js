const SurveyServ = require("./../services/survey.service");

const response = require("./../utils/response");

class SurveyContoller {
    async create(req, res) {
        const result = await SurveyServ.create(req.body, req.$user);
        res.status(201).send(response("survey created", result));
    }

    async getAll(req, res) {
        const result = await SurveyServ.getAll();
        res.status(200).send(response("All survey", result));
    }

    async getAllForOrganisation(req, res) {
        const result = await SurveyServ.getAllForOrganisation(req.params.organisationId);
        res.status(200).send(response("All survey for organisation", result));
    }

    async getNewCard(req, res) {
        const result = await SurveyServ.getNewCard(req.params.surveyId);
        res.status(201).send(response("new card for survey", result));
    }

    async getNewHashtag(req, res) {
        const result = await SurveyServ.getNewHashtag(req.params.surveyId);
        res.status(201).send(response("new hashtag for survey", result));
    }

    async getOne(req, res) {
        const result = await SurveyServ.getOne(req.params.surveyId);
        res.status(200).send(response("survey data", result));
    }

    async update(req, res) {
        const result = await SurveyServ.update(req.params.surveyId, req.body);
        res.status(200).send(response("survey updated", result));
    }

    async updateLeftSwipedCardRefs(req, res) {
        const result = await SurveyServ.updateLeftSwipedCardRefs(req.params.surveyId, req.body);
        res.status(200).send(response("survey left swiped cards updated", result));
    }

    async updateRightSwipedCardRefs(req, res) {
        const result = await SurveyServ.updateRightSwipedCardRefs(req.params.surveyId, req.body);
        res.status(200).send(response("survey right swiped cards updated", result));
    }

    async updateLeftSwipedHashtagRefs(req, res) {
        const result = await SurveyServ.updateLeftSwipedHashtagRefs(req.params.surveyId, req.body);
        res.status(200).send(response("survey left swiped hashtags updated", result));
    }

    async updateRightSwipedHashtagRefs(req, res) {
        const result = await SurveyServ.updateRightSwipedHashtagRefs(req.params.surveyId, req.body);
        res.status(200).send(response("survey right swiped hashtags updated", result));
    }

    async delete(req, res) {
        const result = await SurveyServ.delete(req.params.surveyId);
        res.status(200).send(response("survey deleted", result));
    }
}

module.exports = new SurveyContoller();
