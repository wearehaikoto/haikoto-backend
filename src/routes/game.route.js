const { role } = require("../config");
const router = require("express").Router();
const authGuard = require("../middlewares/auth.middleware");
const GameCtrl = require("../controllers/game.controller.js");

// @route   GET /api/game/
router.get("/", authGuard(role.USER), GameCtrl.getAll);

// @route   GET /api/game/me
router.get("/me", authGuard(role.USER), GameCtrl.getAllByUser);

// @route   GET /api/game/checkIfNewCardForGame
router.get("/checkIfNewCardForGame", authGuard(role.USER), GameCtrl.checkIfNewCardForGame);

// @route   GET /api/game/:gameId
router.get("/:gameId", authGuard(role.USER), GameCtrl.getOne);

// @route   POST /api/game/create
router.post("/create", authGuard(role.USER), GameCtrl.create);

// @route   POST /api/game/:gameId/newCard
router.post("/:gameId/newCard", authGuard(role.USER), GameCtrl.newCard);

// @route   POST /api/game/:gameId/newCard
router.post("/:gameId/newHashtag", authGuard(role.USER), GameCtrl.newHashtag);

// @route   PUT /api/game/:gameId/addLeftSwipedCard
router.put("/:gameId/addLeftSwipedCard", authGuard(role.USER), GameCtrl.addLeftSwipedCard);

// @route   PUT /api/game/:gameId/addRightSwipedCard
router.put("/:gameId/addRightSwipedCard", authGuard(role.USER), GameCtrl.addRightSwipedCard);

// @route   PUT /api/game/:gameId/addLeftSwipedHashtag
router.put("/:gameId/addLeftSwipedHashtag", authGuard(role.USER), GameCtrl.addLeftSwipedHashtag);

// @route   PUT /api/game/:gameId/addRightSwipedHashtag
router.put("/:gameId/addRightSwipedHashtag", authGuard(role.USER), GameCtrl.addRightSwipedHashtag);

// @route   PATCH /api/game/:gameId/updateRightSwipedCards
router.patch("/:gameId/updateRightSwipedCards", authGuard(role.USER), GameCtrl.updateRightSwipedCards);

module.exports = router;
