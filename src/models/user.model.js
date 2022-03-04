const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        codeName: {
            type: String,
            trim: true,
            required: true
        },
        role: {
            type: String,
            trim: true,
            enum: ["user", "admin"],
            default: "user"
        },
        organisation: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "organisation"
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

userSchema.pre("findOne", function (next) {
    this.populate("organisation");
    next();
});

// Export the model
module.exports = mongoose.model("user", userSchema);
