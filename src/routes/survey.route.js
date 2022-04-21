const { role } = require("../config");
const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const SurveyCtrl = require("../controllers/survey.controller");

router.post("/", auth(role.USER), SurveyCtrl.create);

router.get("/", auth(role.ADMIN), SurveyCtrl.getAll);

router.get("/user/me", auth(role.USER), SurveyCtrl.getOneByMe);

router.get("/user/check-new-card", auth(role.USER), SurveyCtrl.checkIfNewCardForSurvey);

router.get("/user/:userId", auth(role.ADMIN), SurveyCtrl.getOneByUser);

router.get("/:surveyId", auth(role.USER), SurveyCtrl.getOne);

router.post("/:surveyId/card/new", auth(role.USER), SurveyCtrl.newCard);

router.post("/:surveyId/hashtag/new", auth(role.USER), SurveyCtrl.newHashtag);

router.post("/:surveyId/card/add-left-swiped-card", auth(role.USER), SurveyCtrl.addLeftSwipedCard);

router.post("/:surveyId/card/add-right-swiped-card", auth(role.USER), SurveyCtrl.addRightSwipedCard);

router.put("/:surveyId/card/update-right-swiped-cards", auth(role.USER), SurveyCtrl.updateRightSwipedCards);

router.post("/:surveyId/hashtag/add-left-swiped-hashtag", auth(role.USER), SurveyCtrl.addLeftSwipedHashtag);

router.post("/:surveyId/hashtag/add-right-swiped-hashtag", auth(role.USER), SurveyCtrl.addRightSwipedHashtag);

router.put("/:surveyId", auth(role.ADMIN), SurveyCtrl.update);

router.delete("/:surveyId", auth(role.ADMIN), SurveyCtrl.delete);

module.exports = router;
