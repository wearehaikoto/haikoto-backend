const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        codeName: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        role: {
            type: String,
            trim: true,
            enum: ["user", "admin"],
            default: "user"
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
);

// Export the model
module.exports = mongoose.model("user", userSchema);
