const User = require("./../models/user.model");
const TokenService = require("./token.service");
const CustomError = require("./../utils/custom-error");

class AuthService {
    // User sign up
    async signup(data) {
        // Create user in database
        const user = new User(data);
        await user.save();

        // Generate token
        const token = await TokenService.generateToken({ user });

        return (data = {
            user,
            token
        });
    }

    // User loginOrSignup
    async loginOrSignup(data) {
        if (!data.codeName) throw new CustomError("codeName is required");

        // Check if user already exist
        const user = await User.findOne({ codeName: data.codeName });

        // Create user if not exist
        if (!user) {
            return await this.signup(data);
        }

        // Generate token
        const token = await TokenService.generateToken({ user });

        return (data = {
            user,
            token
        });
    }
}

module.exports = new AuthService();
