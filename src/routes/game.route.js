const { role } = require("./../config");
const router = require("express").Router();
const auth = require("./../middlewares/auth.middleware");
const GameCtrl = require("./../controllers/game.controller");

router.post("/", auth(role.ADMIN), GameCtrl.create);

router.get("/", auth(role.USER), GameCtrl.getAll);

router.get("/user/me", auth(role.USER), GameCtrl.getOneByMe);

router.get("/user/check-new-card", auth(role.USER), GameCtrl.checkIfNewCardForGame);

router.get("/user/:userId", auth(role.ADMIN), GameCtrl.getOneByUser);

router.get("/:gameId", auth(role.USER), GameCtrl.getOne);

router.post("/:gameId/card/new", auth(role.USER), GameCtrl.newCard);

router.post("/:gameId/hashtag/new", auth(role.USER), GameCtrl.newHashtag);

router.post("/:gameId/card/add-left-swiped-card", auth(role.USER), GameCtrl.addLeftSwipedCard);

router.post("/:gameId/card/add-right-swiped-card", auth(role.USER), GameCtrl.addRightSwipedCard);

router.put("/:gameId/card/update-right-swiped-cards", auth(role.USER), GameCtrl.updateRightSwipedCards);

router.post("/:gameId/hashtag/add-left-swiped-hashtag", auth(role.USER), GameCtrl.addLeftSwipedHashtag);

router.post("/:gameId/hashtag/add-right-swiped-hashtag", auth(role.USER), GameCtrl.addRightSwipedHashtag);

router.put("/:gameId", auth(role.ADMIN), GameCtrl.update);

router.delete("/:gameId", auth(role.ADMIN), GameCtrl.delete);

module.exports = router;
