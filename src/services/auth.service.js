const { JWT_SECRET } = process.env
const JWT = require("jsonwebtoken");
const User = require("./../models/user.model");
const CustomError = require("./../utils/custom-error");

class AuthService {
    // User sign up
    async signup(data) {
        let user = await User.findOne({ codeName: data.codeName });
        if (user) throw new CustomError("Code Name already exists");

        user = new User(data);
        const token = JWT.sign({ id: user._id }, JWT_SECRET);
        await user.save();

        return (data = {
            user,
            token
        });
    }

    // User login
    async login(data) {
        if (!data.codeName) throw new CustomError("codeName is required");

        // Check if user exist
        const user = await User.findOne({ codeName: data.codeName });
        if (!user) throw new CustomError(`No user with code Name: ${data.codeName} found`);

        const token = await JWT.sign({ id: user._id }, JWT_SECRET, { expiresIn: 60 * 60 });

        return (data = {
            user,
            token
        });
    }
}

module.exports = new AuthService();
