const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  codeName: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
}, {
  timestamps: true
});

// Export the model
module.exports = mongoose.model("User", UserSchema);