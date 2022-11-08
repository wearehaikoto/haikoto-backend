const router = require("express").Router();
const CardCtrl = require("./../controllers/card.controller");
const auth = require("./../middlewares/auth.middleware");
const { role } = require("./../config");

router.post("/", auth(role.ADMIN), CardCtrl.create);

router.get("/", auth(role.ADMIN), CardCtrl.getAll);

router.get("/:cardId", auth(role.USER), CardCtrl.getOne);

router.put("/:cardId", auth(role.ADMIN), CardCtrl.update);

router.delete("/:cardId", auth(role.ADMIN), CardCtrl.delete);

module.exports = router;
