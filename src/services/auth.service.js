const JWT = require("jsonwebtoken");

const { JWT_SECRET } = require("../config");
const User = require("../models/user.model");
const UserService = require("./user.service");
const CustomError = require("../utils/custom-error");

class AuthService {
    async register(data) {
        // Create new user
        const user = await UserService.create(data);

        // Generate JWT
        const token = await JWT.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: 60 * 60 * 24 });

        return { user, token: token };
    }

    async login(req) {
        const data = req.body;

        if (!data.codeName) throw new CustomError("code name is required");

        // Check if user exist, pass organisation (if any)
        const user = await User.findOne({ codeName: data.codeName, organisationRef: data.organisationRef })
            // check if not deleted
            .where({ isDeleted: { $in: [false, undefined] } });

        // If user does not exist, create new user
        if (!user) {
            return await this.register(data);
        }

        // Generate JWT
        const token = await JWT.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: 60 * 60 * 24 });

        return { user, token: token };
    }
}

module.exports = new AuthService();
