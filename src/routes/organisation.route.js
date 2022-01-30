const { role } = require("../config");
const router = require("express").Router();
const authGuard = require("../middlewares/auth.middleware");
const OrganisationCtrl = require("./../controllers/organisation.controller");

// @route   POST /api/organisation/
router.post("/", authGuard(role.ADMIN), OrganisationCtrl.create);

// @route   GET /api/organisation/
router.get("/", authGuard(role.ADMIN), OrganisationCtrl.getAll);

// @route   GET /api/organisation/:url_slug/get
router.get("/:url_slug/get", OrganisationCtrl.getByUrlSlug);

// @route   GET /api/organisation/:organisationId
router.get("/:organisationId", authGuard(role.ADMIN), OrganisationCtrl.getOne);

// @route   PUT /api/organisation/:organisationId
router.put("/:organisationId", authGuard(role.ADMIN), OrganisationCtrl.update);

// @route   DELETE /api/organisation/:organisationId
router.delete("/:organisationId", authGuard(role.ADMIN), OrganisationCtrl.delete);

module.exports = router;
