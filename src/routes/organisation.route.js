const { role } = require("./../config");
const router = require("express").Router();
const auth = require("./../middlewares/auth.middleware");
const OrganisationCtrl = require("./../controllers/organisation.controller");

router.post("/", auth(role.ADMIN), OrganisationCtrl.create);

router.get("/", auth(role.ADMIN), OrganisationCtrl.getAll);

router.get("/slug/:slugUrl", OrganisationCtrl.getOneBySlugUrl);

router.get("/:organisationId", auth(role.ADMIN), OrganisationCtrl.getOne);

router.put("/:organisationId", auth(role.ADMIN), OrganisationCtrl.update);

router.delete("/:organisationId", auth(role.ADMIN), OrganisationCtrl.delete);

module.exports = router;
