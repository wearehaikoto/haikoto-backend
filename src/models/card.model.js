const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "users"
        },
        cardTitle: {
            type: String,
            required: true
        },
        cardImage: {
            type: String,
            required: true
        },
        cardCategory: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Export the model
module.exports = mongoose.model("Card", CardSchema);
