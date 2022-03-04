const { JWT_SECRET } = process.env;
const JWT = require("jsonwebtoken");

class TokenService {
    // Create a new Token for a user
    async generateToken(user) {
        const token = JWT.sign({ id: user._id, ...user.toObject() }, JWT_SECRET);
        return token;
    }

    // Decode a token
    async decodeToken(token) {
        try {
            const decodedToken = JWT.verify(token, JWT_SECRET);
            return decodedToken;
        } catch (error) {
            return null;
        }
    }
}

module.exports = new TokenService();
