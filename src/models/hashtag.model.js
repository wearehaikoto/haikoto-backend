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
            required: false,
            default: null
        },

        imageUrl: {
            type: String,
            required: false,
            default: null
        },

        bgColor: {
            type: String,
            required: false,
            default: null
        },

        parentHashtagRef: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "hashtag",
            default: null
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

hashtagSchema.pre("findOne", function (next) {
    this.populate("parentHashtagRef");
    next();
});

// set mongoose options to have lean turned on by default | ref: https://itnext.io/performance-tips-for-mongodb-mongoose-190732a5d382
mongoose.Query.prototype.setOptions = function () {
    if (this.mongooseOptions().lean == null) {
        this.mongooseOptions({ lean: true });
    }
    return this;
};

module.exports = mongoose.model("hashtag", hashtagSchema);
