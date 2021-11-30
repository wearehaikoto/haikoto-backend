const { role } = require("../config");
const router = require("express").Router();
const authGuard = require("../middlewares/auth.middleware");
const GameCtrl = require("../controllers/game.controller.js");

// @route   GET /api/game/
router.get("/", authGuard(role.USER), GameCtrl.getAll);

// @route   GET /api/game/me
router.get("/me", authGuard(role.USER), GameCtrl.getAllByUser);

// @route   GET /api/game/:gameId
router.get("/:gameId", authGuard(role.USER), GameCtrl.getOne);

// @route   GET /api/game/:gameId
router.get("/:gameId", authGuard(role.USER), GameCtrl.getOne);

// @route   POST /api/game/create
router.post("/create", authGuard(role.USER), GameCtrl.create);

// @route   GET /api/game/:gameId/addNoCard
router.post("/:gameId/addNoCard", authGuard(role.USER), GameCtrl.addNoCard);

// @route   GET /api/game/:gameId/addYesCard
router.post("/:gameId/addYesCard", authGuard(role.USER), GameCtrl.addYesCard);

// @route   GET /api/game/:gameId/updateYesCards
router.post( "/:gameId/updateYesCards", authGuard(role.USER), GameCtrl.updateYesCards );

module.exports = router;
