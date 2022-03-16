const { role } = require("./../config");
const router = require("express").Router();
const auth = require("./../middlewares/auth.middleware");
const HashtagCtrl = require("./../controllers/hashtag.controller");

router.post("/", auth(role.ADMIN), HashtagCtrl.create);

router.get("/", auth(role.ADMIN), HashtagCtrl.getAll);

router.get("/titles", auth(role.USER), HashtagCtrl.getAllTitles);

router.get("/with-parents", auth(role.USER), HashtagCtrl.getAllWithParentHashtag);

router.get("/:hashtagId", auth(role.ADMIN), HashtagCtrl.getOne);

router.put("/:hashtagId", auth(role.ADMIN), HashtagCtrl.update);

router.delete("/:hashtagId", auth(role.ADMIN), HashtagCtrl.delete);

module.exports = router;
