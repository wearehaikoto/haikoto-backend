const ObjectId = require("mongoose").Types.ObjectId;
const Organisation = require("./../models/organisation.model");
const CustomError = require("./../utils/custom-error");

class OrganisationService {
    async create(data) {
        if (!data.name) throw new CustomError("organisation name is required");
        if (!data.slugUrl) throw new CustomError("Organisation slug is required");
        if (!data.logoUrl) throw new CustomError("Organisation logo is required");
        if (!data.hashtags) data.hashtags = [];

        // Check that hashtags are valid cardId's
        for (let i = 0; i < data.hashtags.length; i++) {
            if (!ObjectId.isValid(data.hashtags[i])) throw new CustomError("invalid hashtag");
        }

        // Check the slug is unique
        const slugExist = await Organisation.findOne({ slugUrl: data.slugUrl });
        if (slugExist) throw new CustomError("another organisation with this slug already exists");

        return await new Organisation(data).save();
    }

    async getAll() {
        return await Organisation.find({ isDeleted: false });
    }

    async getOneBySlugUrl(slugUrl) {
        const organisation = await Organisation.findOne({ slugUrl });
        if (!organisation) throw new CustomError("organisation does not exist", 404);
        return organisation;
    }

    async getOne(organisationId) {
        const organisation = await Organisation.findOne({ _id: organisationId });
        if (!organisation) throw new CustomError("organisation does not exist", 404);
        return organisation;
    }

    async update(organisationId, data) {
        // Check the slug is unique
        const slugExist = await Organisation.findOne({ slugUrl: data.slugUrl });
        if (slugExist && slugExist.id !== organisationId) throw new CustomError("another organisation with this slug already exists");

        const organisation = await Organisation.findByIdAndUpdate({ _id: organisationId }, { $set: data }, { new: true });
        if (!organisation) throw new CustomError("organisation does not exist", 404);

        return organisation;
    }

    async delete(organisationId) {
        const organisation = await this.update(organisationId, { isDeleted: true });
        return organisation;
    }
}

module.exports = new OrganisationService();
