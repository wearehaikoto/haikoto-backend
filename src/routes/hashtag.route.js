const router = require("express").Router();
const HashtagCtrl = require("./../controllers/hashtag.controller");
const auth = require("./../middlewares/auth.middleware");
const { role } = require("./../config");

router.post("/", auth(role.ADMIN), HashtagCtrl.create);

router.get("/", auth(role.ADMIN), HashtagCtrl.getAll);

router.get("/titles", auth(role.USER), HashtagCtrl.getAllTitles);

router.get("/:hashtagId", auth(role.USER), HashtagCtrl.getOne);

router.put("/:hashtagId", auth(role.ADMIN), HashtagCtrl.update);

router.delete("/:hashtagId", auth(role.ADMIN), HashtagCtrl.delete);

module.exports = router;
