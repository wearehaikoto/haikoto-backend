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
          isDeleted: {
              type: Boolean,
              default: false
          },
     },
     {
          timestamps: true
     }
);

module.exports = mongoose.model("organisation", organisationSchema)
