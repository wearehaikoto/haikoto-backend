const Card = require("../models/card.model");
const UserService = require("./user.service");
const Survey = require("./../models/survey.model");
const Hashtag = require("../models/hashtag.model");
const ProjectService = require("./project.service");
const CustomError = require("../utils/custom-error");

class SurveyService {
    async create(userId, data) {
        if (data.project) await ProjectService.getOne(data.project);

        const checkIfCanContinue = await this.checkIfNewCardForSurvey(userId, data.project);
        if (!checkIfCanContinue) throw new CustomError("you have already played all the cards");

        // Check if the user + project (if any) has an oldSurvey
        const oldSurvey = await this.getOneByUser(userId, data.project).catch((e) => console.log("user does not have oldSurvey", e.message));
        if (oldSurvey) return { ...oldSurvey.toObject(), continue: true };

        // Create Survey with user + project (if any) if no oldSurvey
        const survey = await new Survey({ user: userId, project: data.project }).save();
        return { ...survey.toObject(), continue: false };
    }

    async getAll() {
        return await Survey.find({ isDeleted: false });
    }

    async getAllByOrganisation(organisationId, shouldPopulate = false) {
        // Get all Id's of users from organisation
        const usersFromOrganisation = await UserService.getAllByOrganisation(organisationId);
        const userIds = usersFromOrganisation.map((user) => user._id);

        // Get all surveys from users
        const surveys = Survey.find({ user: { $in: userIds }, isDeleted: false });

        if (shouldPopulate) {
            surveys.populate("leftSwipedCards rightSwipedCards leftSwipedHashtags rightSwipedHashtags");
        }

        // Return surveys
        return await surveys;
    }

    async getOneByUser(userId, projectId = undefined) {
        return await Survey.findOne({ user: userId, project: projectId, isDeleted: false });
    }

    async getAllByUser(userId) {
        return await Survey.find({ user: userId, isDeleted: false });
    }

    async checkIfNewCardForSurvey(userId, projectId = undefined) {
        // await Survey.deleteOne({ user: userId, project: projectId }); // for easy testing delete all everytime

        // If there is no survey for the user with project, return true
        const survey = await this.getOneByUser(userId, projectId).catch((e) => console.log("user does not have oldSurvey", e.message));
        if (!survey) return true;

        // If there is a survey for the user, check if there are any cards left
        const newCard = await this.newCard(survey._id).catch((e) => console.log("no new card is available", e.message));
        const newHashtag = await this.newHashtag(survey._id).catch((e) => console.log("no new hashtag is available", e.message));

        if (!newCard && !newHashtag) return false;

        // Return true if there is a new card or hashtag to play
        return true;
    }

    async getOne(surveyId) {
        const survey = await Survey.findOne({ _id: surveyId });
        if (!survey) throw new CustomError("survey does not exist", 404);
        return survey;
    }

    async newCard(surveyId) {
        const survey = await this.getOne(surveyId);

        // Top Level Parent

        // Get a random card from the database that
        // - is not a parent card
        // - does not have a hashtag in leftSwipedHashtags
        // - have a card in rightSwipedHashtags,
        // - has not been used in the survey.
        const newRandomCard = await Card.aggregate([
            {
                $match: {
                    isDeleted: false,
                    hashtags: {
                        $nin: survey.leftSwipedHashtags,
                        $in: survey.rightSwipedHashtags
                    },
                    _id: {
                        $nin: survey.leftSwipedCards
                            .map((c) => c._id)
                            .concat(survey.rightSwipedCards)
                            .map((c) => c._id)
                    }
                }
            },
            { $sample: { size: 1 } }
        ]);

        if (newRandomCard.length === 0) throw new CustomError("all cards have been played");

        // Populate the card hashtags
        await Card.populate(newRandomCard, { path: "hashtags" });

        // Return the card
        return newRandomCard[0];
    }

    async newHashtag(surveyId) {
        const survey = await this.getOne(surveyId);

        // Query build up
        const query = {
            $nin: survey.leftSwipedHashtags
                .map((hashtag) => hashtag._id)
                .concat(survey.rightSwipedHashtags)
                .map((hashtag) => hashtag._id)
        };

        // Check if the survey is attached to a project and get all the project hashtags
        if (survey.project) {
            query["$in"] = survey.project.hashtags;
        }

        // Get one Hashtag where
        // - parentHashtag is NULL
        // - is not used in the survey
        const newRandomParentHashtag = await Hashtag.aggregate([
            {
                $match: {
                    isDeleted: false,
                    parentHashtag: null,
                    _id: query
                }
            },
            { $sample: { size: 1 } }
        ]);

        // Return the hashtag
        if (newRandomParentHashtag.length !== 0) return newRandomParentHashtag[0];

        // Delete $in from query for the next query
        delete query["$in"];

        // Get one Hashtag where
        // - parentHashtag is not null and is same as one of the hashtags in rightSwipedHashtags
        // - is not used in the survey
        const newRandomHashtag = await Hashtag.aggregate([
            {
                $match: {
                    isDeleted: false,
                    parentHashtag: {
                        $in: survey.rightSwipedHashtags.map((hashtag) => hashtag._id)
                    },
                    _id: query
                }
            },
            { $sample: { size: 1 } }
        ]);

        if (newRandomHashtag.length === 0) throw new CustomError("all hashtags have been used");

        // Return the hashtag
        return newRandomHashtag[0];
    }

    async addLeftSwipedCard(surveyId, data) {
        if (!data.cardId) throw new CustomError("card id is required");
        const survey = await Survey.findOneAndUpdate({ _id: surveyId }, { $push: { leftSwipedCards: { $each: [data.cardId], $position: 0 } } }, { new: true });
        if (!survey) throw new CustomError("survey does not exist", 404);
        return survey;
    }

    async addRightSwipedCard(surveyId, data) {
        if (!data.cardId) throw new CustomError("card id is required");
        const survey = await Survey.findOneAndUpdate({ _id: surveyId }, { $push: { rightSwipedCards: data.cardId } }, { new: true });
        if (!survey) throw new CustomError("survey does not exist", 404);
        return survey;
    }

    async updateRightSwipedCards(surveyId, data) {
        if (!data.cardIds) throw new CustomError("card id's are required");
        const survey = await this.update(surveyId, { rightSwipedCards: data.cardIds });
        return survey;
    }

    async addLeftSwipedHashtag(surveyId, data) {
        if (!data.hashtagId) throw new CustomError("hashtag id is required");
        const survey = await Survey.findOneAndUpdate({ _id: surveyId }, { $push: { leftSwipedHashtags: data.hashtagId } }, { new: true });
        if (!survey) throw new CustomError("survey does not exist", 404);
        return survey;
    }

    async addRightSwipedHashtag(surveyId, data) {
        if (!data.hashtagId) throw new CustomError("hashtag id is required");
        const survey = await Survey.findOneAndUpdate({ _id: surveyId }, { $push: { rightSwipedHashtags: data.hashtagId } }, { new: true });
        if (!survey) throw new CustomError("survey does not exist", 404);
        return survey;
    }

    async update(surveyId, data) {
        const survey = await Survey.findByIdAndUpdate({ _id: surveyId }, { $set: data }, { new: true });
        if (!survey) throw new CustomError("survey does not exist", 404);
        return survey;
    }

    async delete(surveyId) {
        const survey = await this.update(surveyId, { isDeleted: true });
        return survey;
    }
}

module.exports = new SurveyService();
