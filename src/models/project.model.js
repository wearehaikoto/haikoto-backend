const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },

        deadline: {
            type: Date,
            required: false,
            default: null
        },

        hashtagRefs: [
            {
                type: Schema.Types.ObjectId,
                ref: "hashtag"
            }
        ],

        organisationRef: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "organisation",
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

projectSchema.pre("findOne", function (next) {
    this.populate("hashtagRefs");
    this.populate("organisationRef");
    next();
});

// set mongoose options to have lean turned on by default | ref: https://itnext.io/performance-tips-for-mongodb-mongoose-190732a5d382
mongoose.Query.prototype.setOptions = function () {
    if (this.mongooseOptions().lean == null) {
        this.mongooseOptions({ lean: true });
    }
    return this;
};

module.exports = mongoose.model("project", projectSchema);
