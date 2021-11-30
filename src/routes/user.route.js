const { role } = require("../config");
const router = require("express").Router();
const authGuard = require("../middlewares/auth.middleware");
const UserCtrl = require("../controllers/user.controller.js");

// @route   GET /api/user/
router.get("/", authGuard(role.ADMIN), UserCtrl.getAll);

// @route   GET /api/user/:userId
router.get("/:userId", authGuard(role.USER), UserCtrl.getOne);

// @route   DELETE /api/user/:userId
router.delete("/:userId", authGuard(role.ADMIN), UserCtrl.delete);

module.exports = router;
