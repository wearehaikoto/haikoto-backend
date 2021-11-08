const router = require("express").Router();
const AuthCtrl = require("../controllers/auth.controller.js");

// @route   POST /api/auth/login
router.post("/login", AuthCtrl.login);

// @route   POST /api/auth/signup
router.post("/signup", AuthCtrl.signup);

module.exports = router;
