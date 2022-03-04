const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const organisationSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        url_slug: {
            type: String,
            unique: true
        },
        logo: {
            type: String
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
        isDeleted: {
            type: Boolean,
            default: false
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
