const { role } = require("../config");
const User = require("./../models/user.model");
const TokenService = require("./../services/token.service");
const CustomError = require("./../utils/custom-error");

function auth(roles = []) {
  roles = roles.length > 0 ? roles : role.USER;

  return async (req, res, next) => {
    if (!req.headers.authorization)
      throw new CustomError("Unauthorized access: Token not found", 401);

    const token = req.headers.authorization.split(" ")[1];
    const userDataDecodedFromToken = await TokenService.decodeToken(token);

    const user = await User.findOne({ _id: userDataDecodedFromToken.id });

    if (!user)
      throw new CustomError("Unauthorized access: User does not exist", 401);

    if (!roles.includes(user.role))
      throw new CustomError("Unauthorized access", 401);

    req.$user = user;

    next();
  };
}

module.exports = auth;
