const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hashtagSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        imageUrl: {
            type: String,
            required: false
        },
        isDeleted: {
            type: Boolean,
            required: true,
            default: false
        },
        parentHashtag: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "hashtag"
        }
    },
    {
        timestamps: true
    }
);

hashtagSchema.pre("findOne", function (next) {
    this.populate("parentHashtag");

    next();
});

module.exports = mongoose.model("hashtag", hashtagSchema);
