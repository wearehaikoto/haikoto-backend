const router = require("express").Router();

router.use("/auth", require("./auth.route.js"));

router.use("/card", require("./card.route.js"));

module.exports = router;
