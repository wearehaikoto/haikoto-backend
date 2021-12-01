
const { role } = require("../config");
const router = require("express").Router();
const authGuard = require("../middlewares/auth.middleware");
const HashtagCtrl = require("./../controllers/hashtag.controller");

// @route   POST /api/hashtag/create
router.post("/create", authGuard(role.ADMIN), HashtagCtrl.create);

// @route   GET /api/hashtag/
router.get("/", authGuard(role.USER), HashtagCtrl.getAll);

// @route   GET /api/hashtag/:hashtagId
router.get("/:hashtagId", authGuard(role.ADMIN), HashtagCtrl.getOne);

// @route   PUT /api/hashtag/:hashtagId
router.put("/:hashtagId", authGuard(role.ADMIN), HashtagCtrl.update);

// @route   DELETE /api/hashtag/:hashtagId
router.delete("/:hashtagId", authGuard(role.ADMIN), HashtagCtrl.delete);

module.exports = router