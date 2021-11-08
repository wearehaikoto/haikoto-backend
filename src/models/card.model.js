const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
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
module.exports = mongoose.model("Card", UserSchema);
