const response = require("../utils/response");
const AuthService = require("../services/auth.service");

class AuthContoller {
    async loginOrSignup(req, res) {
        const result = await AuthService.loginOrSignup(req.body);
        res.status(200).send(response("User login Successful...", result));
    }
}

module.exports = new AuthContoller();
