const ImgBB = require("../lib/imgbb");
const Organisation = require("./../models/organisation.model");
const CustomError = require("./../utils/custom-error");

class OrganisationService {
    async create(data) {
        if (!data.name) throw new CustomError("organisation name is required");
        if (!data.slug) throw new CustomError("organisation slug is required");
        if (!data.base64) throw new CustomError("organisation logo is required");

        // Check the slug is unique
        const slugExist = await Organisation.findOne({ slug: data.slug });
        if (slugExist) throw new CustomError("another organisation with this slug already exists");

        const uploadImage = await ImgBB.uploadImage(data.base64);
        data.logoUrl = uploadImage.Location;

        const context = {
            name: data.name,
            slug: String(data.slug).toLowerCase(),
            logoUrl: data.logoUrl
        };

        return await new Organisation(context).save();
    }

    async getAll() {
        return await Organisation.find({})
            // check if not deleted
            .where({ isDeleted: { $in: [false, undefined] } });
    }

    async getOneBySlug(slug) {
        const organisation = await Organisation.findOne({ slug })
            // check if not deleted
            .where({ isDeleted: { $in: [false, undefined] } });

        if (!organisation) throw new CustomError("organisation does not exist", 404);

        return organisation;
    }

    async getOne(organisationId) {
        const organisation = await Organisation.findOne({ _id: organisationId })
            // check if not deleted
            .where({ isDeleted: { $in: [false, undefined] } });

        if (!organisation) throw new CustomError("Organisation does not exists");

        return organisation;
    }

    async update(organisationId, data) {
        const organisation = await Organisation.findByIdAndUpdate({ _id: organisationId }, { $set: data }, { new: true })
            // check if not deleted
            .where({ isDeleted: { $in: [false, undefined] } });

        if (!organisation) throw new CustomError("Organisation dosen't exist", 404);

        return organisation;
    }

    async delete(organisationId) {
        return await this.update(organisationId, { isDeleted: true });
    }
}

module.exports = new OrganisationService();
