const mongoose = require("mongoose");

const hashtagSchema = new mongoose.Schema(
     {
          name: {
               type: String,
               required: true,
               unique: true
          },
          parentHashtag: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "hashtag",
               default: null
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
