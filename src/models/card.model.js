const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user"
        },
        title: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        hashtags: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: "hashtag"
                }
            ],
            required: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        eloRating: {
            type: Number,
            default: 1500
        }
    },
    {
        timestamps: true
    }
);

// Export the model
module.exports = mongoose.model("card", cardSchema);
