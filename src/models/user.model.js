const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        codeName: {
            type: String,
            required: true
        },

        role: {
            type: String,
            required: true,
            enum: ["user", "admin"]
        },

        organisationRef: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "organisation",
            default: null
        },

        isActive: {
            type: Boolean,
            required: true,
            default: true
        },

        lastActive: {
            type: Date,
            required: true,
            default: Date.now
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

module.exports = mongoose.model("user", userSchema);
