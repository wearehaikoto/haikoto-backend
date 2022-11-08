const router = require("express").Router();
const SurveyCtrl = require("./../controllers/survey.controller");
const auth = require("./../middlewares/auth.middleware");
const { role } = require("./../config");

router.post("/", auth(role.USER), SurveyCtrl.create);

router.get("/", auth(role.ADMIN), SurveyCtrl.getAll);

router.get("/organisation/:organisationId", auth(role.USER), SurveyCtrl.getAllForOrganisation);

router.get("/:surveyId/card/new", auth(role.USER), SurveyCtrl.getNewCard);

router.get("/:surveyId/hashtag/new", auth(role.USER), SurveyCtrl.getNewHashtag);

router.get("/:surveyId", auth(role.USER), SurveyCtrl.getOne);

router.put("/:surveyId", auth(role.ADMIN), SurveyCtrl.update);

router.patch("/:surveyId/card/left-swiped", auth(role.USER), SurveyCtrl.updateLeftSwipedCardRefs);
router.patch("/:surveyId/card/right-swiped", auth(role.USER), SurveyCtrl.updateRightSwipedCardRefs);

router.patch("/:surveyId/hashtag/left-swiped", auth(role.USER), SurveyCtrl.updateLeftSwipedHashtagRefs);
router.patch("/:surveyId/hashtag/right-swiped", auth(role.USER), SurveyCtrl.updateRightSwipedHashtagRefs);

router.delete("/:surveyId", auth(role.ADMIN), SurveyCtrl.delete);

module.exports = router;
