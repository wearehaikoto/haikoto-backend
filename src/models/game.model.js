const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user"
        },
        cards: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: "card"
                }
            ],
            required: true
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
    },
    {
        timestamps: true
    }
);

// Export the model
module.exports = mongoose.model("Game", GameSchema);
