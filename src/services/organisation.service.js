const CustomError = require("./../utils/custom-error");
const Organisation = require("./../models/organisation.model");

class OrganisationService {
  async create(data) {
    return await new Organisation(data).save();
  }

  async getAll() {
    return await Organisation.find({});
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
    const organisation = await Organisation.findOne({ _id: organisationId });
    organisation.remove();
    return organisation;
  }
}

module.exports = new OrganisationService();
