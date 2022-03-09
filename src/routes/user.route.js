const { role } = require("./../config");
const router = require("express").Router();
const auth = require("./../middlewares/auth.middleware");
const UserCtrl = require("./../controllers/user.controller");

router.post("/", auth(role.ADMIN), UserCtrl.create);

router.get("/", auth(role.ADMIN), UserCtrl.getAll);

router.get("/me", auth(role.USER), UserCtrl.getMe);

router.get("/:userId", auth(role.ADMIN), UserCtrl.getOne);

router.put("/:userId", auth(role.ADMIN), UserCtrl.update);

router.patch("/:userId/update-role", auth(role.ADMIN), UserCtrl.updateRole);

router.delete("/:userId", auth(role.ADMIN), UserCtrl.delete);

module.exports = router;
