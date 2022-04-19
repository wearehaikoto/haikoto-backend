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
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("organisation", organisationSchema);
