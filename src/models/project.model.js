const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
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
        },
        organisation: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "organisation"
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

projectSchema.pre("find", function (next) {
    this.populate("organisation");

    next();
});

projectSchema.pre("findOne", function (next) {
    this.populate("hashtags");
    this.populate("organisation");

    next();
});

module.exports = mongoose.model("project", projectSchema);
