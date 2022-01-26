const { role } = require("../config");
const router = require("express").Router();
const authGuard = require("../middlewares/auth.middleware");
const CardCtrl = require("../controllers/card.controller.js");

// @route   GET /api/card/
router.get("/", authGuard(role.ADMIN), CardCtrl.getAll);

// @route   GET /api/card/me
router.get("/me", authGuard(role.USER), CardCtrl.getAllByUser);

// @route   GET /api/card/getAllCardsAsHashtag
router.get("/getAllCardsAsHashtag", authGuard(role.USER), CardCtrl.getAllCardsAsHashtag);

// @route   GET /api/card/:cardId
router.get("/:cardId", authGuard(role.USER), CardCtrl.getOne);

// @route   POST /api/card/create
router.post("/create", authGuard(role.USER), CardCtrl.create);

// @route   PUT /api/card/elo_rating_update
// router.put("/elo_rating_update", authGuard(role.USER), CardCtrl.eloRatingUpdate);

// @route   PUT /api/card/
router.put("/:cardId/", authGuard(role.USER), CardCtrl.update);

// @route   DELETE /api/card/:cardId
router.delete("/:cardId", authGuard(role.USER), CardCtrl.delete);

module.exports = router;
