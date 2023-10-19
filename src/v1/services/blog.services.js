const { db } = require("../../NOSQL/database/connection");

exports.createBlog = async (body) => {
  const blog = await db.Blog.create(body);
  return blog;
};

exports.getBlogs = async ({ slug = "", page = 1, limit = 5 }) => {
  const skip = (page - 1) * limit;
  let query = {};

  if (slug) {
    query = { slug };
  }
  const blogs = await db.Blog.find(query)
    .populate("authorInfo")
    .skip(skip)
    .limit(limit)
    .lean();
  return blogs;
};

exports.countBlogs = async () => {
  const blogs = await db.Blog.count({});
  return blogs;
};

exports.updateBlog = async (slug, body) => {
  const blog = await db.Blog.findOneAndUpdate(
    { slug },
    { ...body },
    { new: true }
  ).lean();
  return blog;
};

exports.deleteBlog = async ({ slug, author }) => {
  const blog = await db.Blog.deleteOne({ slug, author }).lean();
  return blog;
};
