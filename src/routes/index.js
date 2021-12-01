const router = require("express").Router();
const trimIncomingRequests = require("../middlewares/trim-incoming-requests.middleware");

// Trim all incoming requests
router.use(trimIncomingRequests);

router.use("/auth", require("./auth.route.js"));

router.use("/user", require("./user.route.js"));

router.use("/card", require("./card.route.js"));

router.use("/hashtag", require("./hashtag.route.js"));

router.use("/game", require("./game.route.js"));


// Allow Playground to be accessed from localhost
if (process.env.NODE_ENV !== "production") {
  router.use("/playground", async (req, res) => {
    res.json({});
  });
}

module.exports = router;
