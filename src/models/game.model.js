const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user"
        },
        rightSwipedCards: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: "card"
                }
            ],
            required: true
        },
        leftSwipedCards: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: "card"
                }
            ],
            required: true
        },
        rightSwipedHashtags: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: "card"
                }
            ],
            required: true
        },
        leftSwipedHashtags: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: "card"
                }
            ],
            required: true
        }
    },
    {
        timestamps: true
    }
);

gameSchema.pre("findOne", function (next) {
    this.populate("userId");
    this.populate({
        path: "leftSwipedCards",
        populate: { path: "hashtags" }
    });
    this.populate({
        path: "rightSwipedCards",
        populate: { path: "hashtags" }
    });
    this.populate("leftSwipedHashtags");
    this.populate("rightSwipedHashtags");
    next();
});

// Export the model
module.exports = mongoose.model("Game", gameSchema);
