const HashtagService = require("./hashtag.service");
const Project = require("./../models/project.model");
const CustomError = require("./../utils/custom-error");

class ProjectService {
    async create(data) {
        if (!data.name) throw new CustomError("project name is required");
        // if (!data.organisation) throw new CustomError("project organisation is required");
        if (!data.hashtags) data.hashtags = [];

        // Check that hashtags are valid hashtagId's
        for (let i = 0; i < data.hashtags.length; i++) {
            await HashtagService.getOne(data.hashtags[i]);
        }

        const context = {
            name: data.name,
            organisation: data.organisation ? data.organisation : undefined,
            hashtags: data.hashtags
        };

        return await new Project(context).save();
    }

    async getAll() {
        return await Project.find({ isDeleted: false });
    }

    async getAllByOrganisation(organisationId) {
        return await Project.find({ organisation: organisationId, isDeleted: false });
    }

    async getOne(projectId) {
        const project = await Project.findOne({ _id: projectId });
        if (!project) throw new CustomError("project does not exist", 404);
        return project;
    }

    async update(projectId, data) {
        if (typeof data.organisation !== undefined && !data.organisation) data.organisation = undefined;

        const project = await Project.findByIdAndUpdate({ _id: projectId }, { $set: data }, { new: true });
        if (!project) throw new CustomError("project does not exist", 404);

        return project;
    }

    async delete(projectId) {
        const project = await this.update(projectId, { isDeleted: true });
        return project;
    }
}

module.exports = new ProjectService();
