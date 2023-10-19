const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String },
    content: { type: String },
    image: { type: String },
    readTime: { type: Number },
    slug: {
      type: String,
      slug: ["title"],
      unique: true,
    },
    author: {
      type: String,
    },
  },
  { timestamps: true }
);

// Creating a virtual to populate the author field with user data using userCode
blogSchema.virtual("authorInfo", {
  ref: "user",
  localField: "author",
  foreignField: "userCode",
  justOne: true,
});

module.exports = mongoose.model("Blog", blogSchema);
