const Card = require("../models/card.model");
const UserService = require("./user.service");
const Survey = require("./../models/survey.model");
const Hashtag = require("../models/hashtag.model");
const ProjectService = require("./project.service");
const CustomError = require("./../utils/custom-error");

class SurveyService {
    async create(data, user) {
        if (!data.projectRef) throw new CustomError("survey project is required");

        // if a project is passed, check if the project is valid
        if (data.projectRef) await ProjectService.getOne(data.projectRef);

        // Check if there's an existing survey for this user & project
        const existingSurvey = await Survey.findOne({ userRef: user._id, projectRef: data.projectRef });
        if (existingSurvey) return { ...existingSurvey, status: "resumed" };

        // If no existing survey, create one
        const context = {
            userRef: user._id,
            projectRef: data.projectRef,

            leftSwipedCardRefs: [],
            rightSwipedCardRefs: [],
            leftSwipedHashtagRefs: [],
            rightSwipedHashtagRefs: []
        };

        const survey = await new Survey(context).save();

        return { ...survey.toObject(), status: "new" };
    }

    async getAll() {
        return await Survey.find({})
            // Populate userRef
            .populate({ path: "userRef", select: "codeName", populate: { path: "organisationRef", select: "name" } })
            // Populate userRef
            .populate({ path: "projectRef", select: "name" });
    }

    async getAllForOrganisation(organisationId) {
        // Get all Id's of users from organisation
        const usersFromOrganisation = await UserService.getAllForOrganisation(organisationId);
        const userIds = usersFromOrganisation.map((user) => user._id);

        // Get all surveys from users
        return await Survey.find({ userRef: { $in: userIds } })
            // Populate userRef
            .populate({ path: "userRef", select: "codeName" })
            // Populate userRef
            .populate({ path: "projectRef", select: "name" });
    }

    async getNewCard(surveyId) {
        const survey = await this.getOne(surveyId);

        // Get a random card from the database that
        // - has not been used in the survey.
        // - does not have a hashtag in leftSwipedHashtagRefs
        // - has a hashtag in rightSwipedHashtagRefs

        const newRandomCard = await Card.aggregate([
            {
                $match: {
                    isDeleted: false,
                    hashtagRefs: {
                        $nin: survey.leftSwipedHashtagRefs.map((hashtag) => hashtag._id),
                        $in: survey.rightSwipedHashtagRefs.map((hashtag) => hashtag._id)
                    },
                    _id: {
                        $nin: survey.leftSwipedCardRefs.map((card) => card._id).concat(survey.rightSwipedCardRefs.map((card) => card._id))
                    }
                }
            },
            { $sample: { size: 1 } }
        ]);

        // If no card left, return null
        // if (newRandomCard.length === 0) throw new CustomError("all cards have been played");
        if (newRandomCard.length === 0) return null;

        // Populate the card hashtagRefs // commented out because terminal was throwing error "TypeError: Cannot read property 'wasPopulated' of undefined"
        // await Card.populate(newRandomCard, { path: "hashtagRefs" });

        // Return the card
        return newRandomCard[0];
    }

    async getNewHashtag(surveyId) {
        const survey = await this.getOne(surveyId);

        // Query build up
        const query = {
            $nin: survey.leftSwipedHashtagRefs.map((hashtag) => hashtag._id).concat(survey.rightSwipedHashtagRefs.map((hashtag) => hashtag._id))
        };

        // Check if the survey is attached to a projectRef and get all the project hashtagRefs
        if (survey.projectRef) {
            const projectHashtagRefs = survey.projectRef.hashtagRefs;

            query["$in"] = [];

            for (let index = 0; index < projectHashtagRefs.length; index++) {
                const hashtagId = projectHashtagRefs[index];

                // Check if the hashtagId is not
                // - in the leftSwipedHashtagRefs
                // - or in rightSwipedHashtagRefs
                const surveyUsedHashtagRefs = survey.leftSwipedHashtagRefs.map((hashtag) => hashtag._id).concat(survey.rightSwipedHashtagRefs.map((hashtag) => hashtag._id));

                // If the hashtag is not in the surveyUsedHashtagRefs, add it to the query searchIn array of hashtagRefs
                if (surveyUsedHashtagRefs.includes(hashtagId) === false) {
                    query["$in"].push(hashtagId);
                }
            }
        }

        // Get a Parent Hashtag where
        // - is not used in the survey
        // - parentHashtagRef is NULL
        const newRandomParentHashtag = await Hashtag.aggregate([{ $match: { isDeleted: false, _id: query, parentHashtagRef: null } }, { $sample: { size: 1 } }]);

        // If there's a newRandomParentHashtag, return it
        if (newRandomParentHashtag.length !== 0) return newRandomParentHashtag[0];

        // Delete $in from query for the next DB lookup
        delete query["$in"];

        // Get a Hashtag where
        // - is not used in the survey
        // - parentHashtagRef is != null and is same as one of the hashtags in rightSwipedHashtagRefs
        const newRandomHashtag = await Hashtag.aggregate([
            // breaker
            { $match: { isDeleted: false, _id: query, parentHashtagRef: { $in: survey.rightSwipedHashtagRefs.map((hashtag) => hashtag._id) } } },
            { $sample: { size: 1 } }
        ]);

        // If no hashtag left, return null
        // if (newRandomHashtag.length === 0) throw new CustomError("all hashtags have been used");
        if (newRandomHashtag.length === 0) return null;

        // Return the hashtag
        return newRandomHashtag[0];
    }

    async getOne(surveyId) {
        const survey = await Survey.findOne({ _id: surveyId });
        if (!survey) throw new CustomError("Survey does not exists");

        return survey;
    }

    async update(surveyId, data) {
        const survey = await Survey.findByIdAndUpdate({ _id: surveyId }, { $set: data }, { new: true });

        if (!survey) throw new CustomError("Survey dosen't exist", 404);

        return survey;
    }

    async updateLeftSwipedCardRefs(surveyId, data) {
        if (!data.ids) throw new CustomError("card ids are required");
        return await this.update(surveyId, { leftSwipedCardRefs: data.ids });
    }

    async updateRightSwipedCardRefs(surveyId, data) {
        if (!data.ids) throw new CustomError("card ids are required");
        return await this.update(surveyId, { rightSwipedCardRefs: data.ids });
    }

    async updateLeftSwipedHashtagRefs(surveyId, data) {
        if (!data.ids) throw new CustomError("hashtag ids are required");
        return await this.update(surveyId, { leftSwipedHashtagRefs: data.ids });
    }

    async updateRightSwipedHashtagRefs(surveyId, data) {
        if (!data.ids) throw new CustomError("hashtag ids are required");
        return await this.update(surveyId, { rightSwipedHashtagRefs: data.ids });
    }

    async delete(surveyId) {
        return await Survey.deleteOne({ _id: surveyId });
    }
}

module.exports = new SurveyService();
