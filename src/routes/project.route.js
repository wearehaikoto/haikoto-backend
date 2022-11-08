const router = require("express").Router();
const ProjectCtrl = require("./../controllers/project.controller");
const auth = require("./../middlewares/auth.middleware");
const { role } = require("./../config");

router.post("/", auth(role.ADMIN), ProjectCtrl.create);

router.get("/", auth(role.ADMIN), ProjectCtrl.getAll);

router.get("/user", auth(role.USER), ProjectCtrl.getAllForUser);

router.get("/organisation/:organisationId", auth(role.USER), ProjectCtrl.getAllForOrganisation);

router.get("/:projectId", auth(role.ADMIN), ProjectCtrl.getOne);

router.put("/:projectId", auth(role.ADMIN), ProjectCtrl.update);

router.delete("/:projectId", auth(role.ADMIN), ProjectCtrl.delete);

module.exports = router;
