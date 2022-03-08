const router = require("express").Router();
const AuthCtrl = require("./../controllers/auth.controller");

router.post("/login", AuthCtrl.login);

module.exports = router;
