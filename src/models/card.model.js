const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardSchema = new Schema(
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

        hashtagRefs: [
            {
                type: Schema.Types.ObjectId,
                ref: "hashtag"
            }
        ],

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

cardSchema.pre("findOne", function (next) {
    this.populate("hashtagRefs");
    next();
});

// set mongoose options to have lean turned on by default | ref: https://itnext.io/performance-tips-for-mongodb-mongoose-190732a5d382
mongoose.Query.prototype.setOptions = function () {
    if (this.mongooseOptions().lean == null) {
        this.mongooseOptions({ lean: true });
    }
    return this;
};

module.exports = mongoose.model("card", cardSchema);
