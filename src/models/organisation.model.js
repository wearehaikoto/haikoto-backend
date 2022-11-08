const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const organisationSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },

        slug: {
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

// set mongoose options to have lean turned on by default | ref: https://itnext.io/performance-tips-for-mongodb-mongoose-190732a5d382
mongoose.Query.prototype.setOptions = function () {
    if (this.mongooseOptions().lean == null) {
        this.mongooseOptions({ lean: true });
    }
    return this;
};

module.exports = mongoose.model("organisation", organisationSchema);
