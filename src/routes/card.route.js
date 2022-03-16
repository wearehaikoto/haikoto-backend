const { role } = require("./../config");
const router = require("express").Router();
const auth = require("./../middlewares/auth.middleware");
const CardCtrl = require("./../controllers/card.controller");

router.post("/", auth(role.ADMIN), CardCtrl.create);

router.get("/", auth(role.ADMIN), CardCtrl.getAll);

router.get("/with-hashtags", auth(role.USER), CardCtrl.getAllWithHashtags);

router.get("/user/me", auth(role.USER), CardCtrl.getAllByMe);

router.get("/user/:userId", auth(role.ADMIN), CardCtrl.getAllByUser);

router.get("/:cardId", auth(role.USER), CardCtrl.getOne);

router.put("/:cardId", auth(role.ADMIN), CardCtrl.update);

router.delete("/:cardId", auth(role.ADMIN), CardCtrl.delete);

module.exports = router;
