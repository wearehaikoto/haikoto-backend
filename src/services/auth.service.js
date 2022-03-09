const JWT = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const User = require("../models/user.model");
const CustomError = require("../utils/custom-error");

class AuthService {
    async register(data) {
        if (!data.codeName) throw new CustomError("code name is required");

        // Create user
        const user = await new User(data).save();

        // Generate JWT
        const token = await JWT.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: 60 * 60 * 24 });

        return (data = {
            _id: user._id,
            codeName: user.codeName,
            role: user.role,
            token: token
        });
    }

    async login(data) {
        if (!data.codeName) throw new CustomError("code name is required");

        // Check if user exist, pass organisation (if any)
        const user = await User.findOne({ codeName: data.codeName, organisation: data.organisation });

        // If user does not exist, create new user
        if (!user) {
            return await this.register(data);
        }

        // Generate JWT
        const token = await JWT.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: 60 * 60 * 24 });

        return (data = {
            _id: user._id,
            codeName: user.codeName,
            role: user.role,
            token: token
        });
    }
}

module.exports = new AuthService();
