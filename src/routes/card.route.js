const router = require("express").Router();
const authGuard = require("../middlewares/auth.middleware");
const CardCtrl = require("../controllers/card.controller.js");

// @route   GET /api/card/
router.get("/", authGuard(), CardCtrl.getAll);

// @route   GET /api/card/me
router.get("/me", authGuard(), CardCtrl.getAllByUser);

// @route   POST /api/card/create
router.post("/create", authGuard(), CardCtrl.create);

module.exports = router;
