const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema(
    {
        user: {
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
        },
        isDeleted: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        timestamps: true
    }
);

gameSchema.pre("findOne", function (next) {
    this.populate("user");
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

module.exports = mongoose.model("game", gameSchema);
