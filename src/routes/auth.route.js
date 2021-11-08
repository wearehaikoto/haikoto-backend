const router = require("express").Router();
const AuthCtrl = require("../controllers/auth.controller.js");

// @route   POST /api/auth/loginOrSignup
router.post("/loginOrSignup", AuthCtrl.loginOrSignup);

module.exports = router;
