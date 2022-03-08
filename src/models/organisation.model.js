const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const organisationSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        slugUrl: {
            type: String,
            required: true,
            unique: true
        },
        logoUrl: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true
        },
        isDeleted: {
            type: Boolean,
            required: true,
            default: false
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
        }
    },
    {
        timestamps: true
    }
);

organisationSchema.pre("findOne", function (next) {
    this.populate("hashtags");

    next();
});

module.exports = mongoose.model("organisation", organisationSchema);
