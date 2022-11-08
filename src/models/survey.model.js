const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UniqueIDGenerator = require("../utils/unique-id-generator");

const surveySchema = new Schema(
    {
        uniqueId: {
            type: String,
            required: true,
            unique: true,
            default: () => "S0-" + new UniqueIDGenerator().generateCustom(9)
        },

        userRef: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "user"
        },

        projectRef: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "project"
        },

        leftSwipedCardRefs: [
            {
                type: Schema.Types.ObjectId,
                ref: "card"
            }
        ],
        rightSwipedCardRefs: [
            {
                type: Schema.Types.ObjectId,
                ref: "card"
            }
        ],

        leftSwipedHashtagRefs: [
            {
                type: Schema.Types.ObjectId,
                ref: "hashtag"
            }
        ],
        rightSwipedHashtagRefs: [
            {
                type: Schema.Types.ObjectId,
                ref: "hashtag"
            }
        ]
    },
    {
        timestamps: true
    }
);

surveySchema.pre("findOne", function (next) {
    this.populate("userRef");
    this.populate("projectRef");
    this.populate("leftSwipedCardRefs");
    this.populate("rightSwipedCardRefs");
    this.populate("leftSwipedHashtagRefs");
    this.populate("rightSwipedHashtagRefs");
    next();
});

// set mongoose options to have lean turned on by default | ref: https://itnext.io/performance-tips-for-mongodb-mongoose-190732a5d382
mongoose.Query.prototype.setOptions = function () {
    if (this.mongooseOptions().lean == null) {
        this.mongooseOptions({ lean: true });
    }
    return this;
};

module.exports = mongoose.model("survey", surveySchema);
