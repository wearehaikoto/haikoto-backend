const HashtagService = require("./hashtag.service");
const Project = require("./../models/project.model");
const CustomError = require("./../utils/custom-error");

class ProjectService {
    async create(data) {
        if (!data.name) throw new CustomError("project name is required");

        if (!data.hashtagRefs) data.hashtagRefs = [];
        if (data.hashtagRefs.length === 0) throw new CustomError("project must have at least one hashtag");

        // Check that hashtagRefs are valid hashtagId's
        for (let i = 0; i < data.hashtagRefs.length; i++) {
            await HashtagService.getOne(data.hashtagRefs[i]);
        }

        const context = {
            name: data.name,
            deadline: data.deadline,
            hashtagRefs: data.hashtagRefs,
            organisationRef: data.organisationRef || null
        };

        return await new Project(context).save();
    }

    async getAll() {
        return await Project.find({})
            // check if not deleted
            .where({ isDeleted: { $in: [false, undefined] } })
            // Populate organisationRef
            .populate({ path: "organisationRef", select: "name" });
    }

    async getAllForUser(user, organisation = null) {
        // If no organisation, get all projects for no organisation.
        if (organisation) {
            return await Project.find({ organisationRef: organisation._id })
                // check if not deleted
                .where({ isDeleted: { $in: [false, undefined] } });
        }

        // if organiation, get all projects for the organisation
        return await Project.find({ organisationRef: null })
            // check if not deleted
            .where({ isDeleted: { $in: [false, undefined] } });
    }

    async getAllForOrganisation(organisationId) {
        return await Project.find({ organisationRef: organisationId })
            // check if not deleted
            .where({ isDeleted: { $in: [false, undefined] } });
    }

    async getOne(projectId) {
        const project = await Project.findOne({ _id: projectId })
            // check if not deleted
            .where({ isDeleted: { $in: [false, undefined] } });

        if (!project) throw new CustomError("Project does not exists");

        return project;
    }

    async update(projectId, data) {
        const project = await Project.findByIdAndUpdate({ _id: projectId }, { $set: data }, { new: true })
            // check if not deleted
            .where({ isDeleted: { $in: [false, undefined] } });

        if (!project) throw new CustomError("Project dosen't exist", 404);

        return project;
    }

    async delete(projectId) {
        return await this.update(projectId, { isDeleted: true });
    }
}

module.exports = new ProjectService();
