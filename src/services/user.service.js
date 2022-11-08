const User = require("./../models/user.model");
const CustomError = require("./../utils/custom-error");

class UserService {
    async create(data, user = {}) {
        if (!data.codeName) throw new CustomError("code name is required");

        const checkCodeName = await User.findOne({ codeName: data.codeName, organisationRef: data.organisationRef });
        if (checkCodeName) throw new CustomError("code name already exists");

        const context = {
            codeName: data.codeName,
            organisationRef: data.organisationRef,
            // Allow an admin to create another admin user
            role: user.role === "admin" ? data.role || "user" : "user"
        };

        return await new User(context).save();
    }

    async getAll() {
        return await User.find({})
            // check if not deleted
            .where({ isDeleted: { $in: [false, undefined] } })
            // Populate organisationRef
            .populate({ path: "organisationRef", select: "name" });
    }

    async getAllForOrganisation(organisationId) {
        return await User.find({ organisationRef: organisationId })
            // check if not deleted
            .where({ isDeleted: { $in: [false, undefined] } });
    }

    async getMe(userId) {
        return await this.getOne(userId);
    }

    async getOne(userId) {
        const user = await User.findOne({ _id: userId })
            // check if not deleted
            .where({ isDeleted: { $in: [false, undefined] } });

        if (!user) throw new CustomError("user does not exist", 404);

        return user;
    }

    async update(userId, data) {
        const user = await User.findByIdAndUpdate({ _id: userId }, { $set: data }, { new: true })
            // check if not deleted
            .where({ isDeleted: { $in: [false, undefined] } });

        if (!user) throw new CustomError("user does not exist", 404);

        return user;
    }

    async delete(userId) {
        return await this.update(userId, { isDeleted: true });
    }
}

module.exports = new UserService();
