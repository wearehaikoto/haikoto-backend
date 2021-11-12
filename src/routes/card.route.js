const router = require("express").Router();
const authGuard = require("../middlewares/auth.middleware");
const CardCtrl = require("../controllers/card.controller.js");

// @route   GET /api/card/
router.get("/", authGuard(), CardCtrl.getAll);

// @route   GET /api/card/me
router.get("/me", authGuard(), CardCtrl.getAllByUser);

// @route   GET /api/card/categories
router.get("/categories", authGuard(), CardCtrl.getAllCategories);

// @route   GET /api/card/:cardId
router.get("/:cardId", authGuard(), CardCtrl.getOne);

// @route   POST /api/card/create
router.post("/create", authGuard(), CardCtrl.create);

// @route   DELETE /api/card/:cardId
router.delete("/:cardId", authGuard(), CardCtrl.delete);

module.exports = router;
