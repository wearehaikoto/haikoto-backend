const router = require("express").Router();

// Trim all incoming requests
router.use(require("./../middlewares/trim-incoming-requests.middleware"));

router.use("/auth", require("./auth.route"));

router.use("/cards", require("./card.route"));

router.use("/surveys", require("./survey.route"));

router.use("/hashtags", require("./hashtag.route"));

router.use("/organisations", require("./organisation.route"));

router.use("/projects", require("./project.route"));

router.use("/users", require("./user.route"));

router.get("/", (req, res) => {
    return res.status(200).json({ message: "Hello world from haikoto! :)" });
});

// Allow Playground to be accessed from localhost
if (process.env.NODE_ENV !== "production") {
    router.use("/playground", async (req, res) => {
        const results = {};
        res.json(results);
    });
}

module.exports = router;
