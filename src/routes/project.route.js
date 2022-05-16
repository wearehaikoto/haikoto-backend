const { role } = require("./../config");
const router = require("express").Router();
const auth = require("./../middlewares/auth.middleware");
const ProjectCtrl = require("./../controllers/project.controller");

router.post("/", auth(role.ADMIN), ProjectCtrl.create);

router.get("/", auth(role.ADMIN), ProjectCtrl.getAll);

router.get("/defaults", auth(role.USER), ProjectCtrl.getAllDefaults);

router.get("/org/:organisationId", auth(role.USER), ProjectCtrl.getAllByOrganisation);

router.get("/:projectId", auth(role.ADMIN), ProjectCtrl.getOne);

router.put("/:projectId", auth(role.ADMIN), ProjectCtrl.update);

router.delete("/:projectId", auth(role.ADMIN), ProjectCtrl.delete);

module.exports = router;
