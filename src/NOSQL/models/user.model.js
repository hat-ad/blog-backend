const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    userCode: {
      type: String,
      slug: ["email"],
      unique: true,
    },
    password: { type: String },
    token: { type: String, default: null },
    is_active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema);
