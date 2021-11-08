const router = require("express").Router();
const authGuard = require("../middlewares/auth.middleware");
const CardCtrl = require("../controllers/card.controller.js");

// @route   POST /api/card/create
router.post("/create", authGuard(), CardCtrl.create);

module.exports = router;
