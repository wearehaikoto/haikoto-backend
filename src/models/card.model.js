const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        },
        isDeleted: {
            type: Boolean,
            required: true,
            default: false
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user"
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
        }
    },
    {
        timestamps: true
    }
);

cardSchema.pre("findOne", function (next) {
    this.populate("user", "_id codeName name");
    this.populate("hashtags");

    next();
});

module.exports = mongoose.model("card", cardSchema);
