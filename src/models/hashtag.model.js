const mongoose = require("mongoose");

const hashtagSchema = new mongoose.Schema(
     {
          name: {
               type: String,
               required: true,
               unique: true
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


module.exports = mongoose.model("hashtag", hashtagSchema)
