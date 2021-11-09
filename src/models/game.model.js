const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        cards: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: "Card"
                }
            ],
            required: true
        },
        answers: {
            type: [
                {
                    type: Array || Boolean,
                    required: true
                }
            ],
            required: false
        }
    },
    {
        timestamps: true
    }
);

// Export the model
module.exports = mongoose.model("Game", GameSchema);
