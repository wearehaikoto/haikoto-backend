const ObjectId = require("mongoose").Types.ObjectId;
const CustomError = require("./../utils/custom-error");
const Organisation = require("./../models/organisation.model");

class OrganisationService {
  async create(data) {

    if (!data.name) throw new CustomError("Organisation Name is required");
    if (!data.url_slug) throw new CustomError("Organisation URL Slug is required");
    if (!data.logo) throw new CustomError("Organisation Logo is required");
    if (!data.hashtags) data.hashtags = [];

    // Check that hashtags are valid cards with Id
    for (let i = 0; i < data.hashtags.length; i++) {
      if (!ObjectId.isValid(data.hashtags[i]))
        throw new CustomError("Invalid HashtagId");
    }

    // Check that url_slug is unique
    const slugExist = await Organisation.findOne({ url_slug: data.url_slug });
    if (slugExist) throw new CustomError("This Organisation URL Slug already exists");

    // This url slug is already in use
    return await new Organisation(data).save();
  }

  async getAll() {
    return await Organisation.find({ isDeleted: false });
  }

  async getOne(organisationId) {
    const organisation = await Organisation.findOne({ _id: organisationId });
    if (!organisation) throw new CustomError("Organisation does not exists");

    return organisation;
  }

  async getByUrlSlug(url_slug) {
    const organisation = await Organisation.findOne({ url_slug });
    if (!organisation) throw new CustomError("Organisation does not exists");

    return organisation;
  }

  async update(organisationId, data) {
    if (!ObjectId.isValid(organisationId)) throw new CustomError("Card does not exist");

    if (!data.name) throw new CustomError("Organisation Name is required");
    if (!data.url_slug) throw new CustomError("Organisation URL Slug is required");
    if (!data.logo) throw new CustomError("Organisation Logo is required");
    if (!data.hashtags) data.hashtags = [];

    // Check that hashtags are valid cards with Id
    for (let i = 0; i < data.hashtags.length; i++) {
      if (!ObjectId.isValid(data.hashtags[i]))
        throw new CustomError("Invalid HashtagId");
    }

    // Check that url_slug is unique
    const slugExist = await Organisation.findOne({ url_slug: data.url_slug });
    if (slugExist) throw new CustomError("This Organisation URL Slug already exists");

    const organisation = await Organisation.findByIdAndUpdate(
      { _id: organisationId },
      { $set: data },
      { new: true }
    );

    if (!organisation) throw new CustomError("Organisation dosen't exist", 404);

    return organisation;
  }

  async delete(organisationId) {
    if (!ObjectId.isValid(organisationId)) throw new CustomError("Organisation does not exist");

    const organisation = await Organisation.findOneAndUpdate(
      { _id: organisationId },
      { isDeleted: true },
      { new: true }
    );

    if (!organisation) throw new CustomError("Organisation does not exist");

    return organisation;
  }
}

module.exports = new OrganisationService();
