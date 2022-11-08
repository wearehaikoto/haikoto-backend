const router = require("express").Router();
const OrganisationCtrl = require("./../controllers/organisation.controller");
const auth = require("./../middlewares/auth.middleware");
const { role } = require("./../config");

router.post("/", auth(role.ADMIN), OrganisationCtrl.create);

router.get("/", auth(role.ADMIN), OrganisationCtrl.getAll);

router.get("/slug/:slug", OrganisationCtrl.getOneBySlug);

router.get("/:organisationId", auth(role.ADMIN), OrganisationCtrl.getOne);

router.put("/:organisationId", auth(role.ADMIN), OrganisationCtrl.update);

router.delete("/:organisationId", auth(role.ADMIN), OrganisationCtrl.delete);

module.exports = router;
