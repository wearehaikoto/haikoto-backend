const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        codeName: {
            type: String,
            required: true,
            trim: true
        },
        role: {
            type: String,
            required: true,
            enum: ["user", "admin"],
            default: "user"
        },
        organisation: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "organisation"
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
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("findOne", function (next) {
    this.populate("organisation");

    next();
});

module.exports = mongoose.model("user", userSchema);
