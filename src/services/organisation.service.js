const ObjectId = require("mongoose").Types.ObjectId;
const CustomError = require("./../utils/custom-error");
const Organisation = require("./../models/organisation.model");

class OrganisationService {
  async create(data) {
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
