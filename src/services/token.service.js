const { JWT_SECRET } = process.env;
const JWT = require("jsonwebtoken");

class TokenService {
    // Create a new Token for a user
    async generateToken(user) {
        const token = JWT.sign({ id: user._id, codeName: user.codeName }, JWT_SECRET);
        return token;
    }
}

module.exports = new TokenService();
