const router = require("express").Router();

router.get("/sign-in", async (req, res) => {
  res.status(200).json({ message: "Login Success" });
});

module.exports = router;
