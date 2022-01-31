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
                    ref: "card"
                }
            ],
            required: true
        },
        eloRating: {
            type: Number,
            default: 1500
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
);

cardSchema.pre("findOne", function (next) {
    this.populate("userId", "_id codeName name");
    this.populate("hashtags");
    next();
});

// Export the model
module.exports = mongoose.model("card", cardSchema);

