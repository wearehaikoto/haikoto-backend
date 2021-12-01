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
  const CardModel = require("../models/card.model");
  router.use("/playground", async (req, res) => {
    const cards = await CardModel.find({});
    res.json(cards);



    // - todo: run when switched to ATLAS


    // const allCardsHashtags = [];
    // cards.forEach(card => card.cardHashtags.forEach(hashtag => allCardsHashtags.push(hashtag)));
    // // For reach #hashtags, create a new card for it
    // allCardsHashtags.forEach(async (hashtag) => {
    //   // Create a new card
    //   const newCard = new CardModel({
    //     userId: "",
    //     cardTitle: hashtag,
    //     cardImage: "https://i.ibb.co/0FtrsWH/green-screen.png",
    //     cardHashtags: [hashtag],
    //     cardType: "parent"
    //   });

    //   // Save the new card
    //   await newCard.save();
    // });

    // return res.json({ allCardsHashtags });


    // Add a cardType child to all cards 
    // const cards = await CardModel.updateMany({}, { $set: { cardType: "child" } });
    // return res.json({ cards });
  });
}

module.exports = router;
