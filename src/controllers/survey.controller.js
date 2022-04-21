const response = require("../utils/response");
const SurveyServ = require("./../services/survey.service");

class SurveyContoller {
    async create(req, res) {
        const result = await SurveyServ.create(req.$user._id, req.body);
        res.status(201).send(response("survey created", result));
    }

    async getAll(req, res) {
        const result = await SurveyServ.getAll();
        res.status(200).send(response("all survey", result));
    }

    async getAllByOrganisation(req, res) {
        const result = await SurveyServ.getAllByOrganisation(req.params.organisationId);
        res.status(200).send(response("all surveys by organisation", result));
    }

    async getOneByMe(req, res) {
        const result = await SurveyServ.getOneByUser(req.$user._id);
        res.status(200).send(response("survey by user", result));
    }

    async getOneByUser(req, res) {
        const result = await SurveyServ.getOneByUser(req.params.userId);
        res.status(200).send(response("survey by user", result));
    }

    async checkIfNewCardForSurvey(req, res) {
        const result = await SurveyServ.checkIfNewCardForSurvey(req.$user._id);
        res.status(200).send(response("survey query", result));
    }

    async getOne(req, res) {
        const result = await SurveyServ.getOne(req.params.surveyId);
        res.status(200).send(response("survey data", result));
    }

    async newCard(req, res) {
        const result = await SurveyServ.newCard(req.params.surveyId);
        res.status(200).send(response("new card", result));
    }

    async newHashtag(req, res) {
        const result = await SurveyServ.newHashtag(req.params.surveyId, req.$user._id);
        res.status(200).send(response("new hashtag", result));
    }

    async addLeftSwipedCard(req, res) {
        const result = await SurveyServ.addLeftSwipedCard(req.params.surveyId, req.body);
        res.status(200).send(response("new left swiped card added", result));
    }

    async addRightSwipedCard(req, res) {
        const result = await SurveyServ.addRightSwipedCard(req.params.surveyId, req.body);
        res.status(200).send(response("new right swiped card added", result));
    }

    async updateRightSwipedCards(req, res) {
        const result = await SurveyServ.updateRightSwipedCards(req.params.surveyId, req.body);
        res.status(200).send(response("right swiped cards updated", result));
    }

    async addLeftSwipedHashtag(req, res) {
        const result = await SurveyServ.addLeftSwipedHashtag(req.params.surveyId, req.body);
        res.status(200).send(response("new left swiped hashtag added", result));
    }

    async addRightSwipedHashtag(req, res) {
        const result = await SurveyServ.addRightSwipedHashtag(req.params.surveyId, req.body);
        res.status(200).send(response("new right swiped hashtag added", result));
    }

    async update(req, res) {
        const result = await SurveyServ.update(req.params.surveyId, req.body);
        res.status(200).send(response("survey updated", result));
    }

    async delete(req, res) {
        const result = await SurveyServ.delete(req.params.surveyId);
        res.status(200).send(response("survey deleted", result));
    }
}

module.exports = new SurveyContoller();
