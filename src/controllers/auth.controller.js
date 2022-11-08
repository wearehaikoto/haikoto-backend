const response = require("../utils/response");
const AuthService = require("../services/auth.service");

class AuthContoller {
    async login(req, res) {
        const result = await AuthService.login(req);
        res.status(200).send(response("user login successful", result));
    }
}

module.exports = new AuthContoller();
