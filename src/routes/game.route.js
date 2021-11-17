const router = require("express").Router();
const authGuard = require("../middlewares/auth.middleware");
const GameCtrl = require("../controllers/game.controller.js");

// @route   GET /api/game/
router.get("/", authGuard(), GameCtrl.getAll);

// @route   GET /api/game/me
router.get("/me", authGuard(), GameCtrl.getAllByUser);

// @route   GET /api/game/:gameId
router.get("/:gameId", authGuard(), GameCtrl.getOne);

// @route   GET /api/game/:gameId
router.get("/:gameId", authGuard(), GameCtrl.getOne);


// @route   POST /api/game/create
router.post("/create", authGuard(), GameCtrl.create);

// @route   GET /api/game/:gameId/addNoCard
router.post("/:gameId/addNoCard", authGuard(), GameCtrl.addNoCard);

// @route   GET /api/game/:gameId/addYesCard
router.post("/:gameId/addYesCard", authGuard(), GameCtrl.addYesCard);

// @route   GET /api/game/:gameId/updateYesCards
router.post("/:gameId/updateYesCards", authGuard(), GameCtrl.updateYesCards);

module.exports = router;
