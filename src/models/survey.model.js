const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const surveySchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user"
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "project"
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
                    ref: "hashtag"
                }
            ],
            required: true
        },
        leftSwipedHashtags: {
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
            required: true,
            default: false
        }
    },
    {
        timestamps: true
    }
);

surveySchema.pre("findOne", function (next) {
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
    this.populate("project");

    next();
});

module.exports = mongoose.model("survey", surveySchema);
