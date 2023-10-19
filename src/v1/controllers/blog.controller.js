const { EVENTS } = require("../../../Socket/events");
const {
  MESSAGE_CODES,
  RESPONSE_TYPE,
  RESPONSE,
} = require("../../../Socket/socketUtilities");
const { OK, ERROR } = require("../../../utils/responseHelper");
const BlogService = require("../services/blog.services");

exports.createBlog = async (req, res) => {
  try {
    const { userCode } = req.payload;
    const {
      title,
      content,
      // image,
      readTime,
    } = req.body;
    const blog = await BlogService.createBlog({
      title,
      content,
      image:
        "https://cf-assets.www.cloudflare.com/slt3lc6tev37/7Dy6rquZDDKSJoeS27Y6xc/4a671b7cc7894a475a94f0140981f5d9/what_is_a_cdn_distributed_server_map.png",
      readTime,
      author: userCode,
    });
    const savedBlog = await blog.save();
    return OK(res, { blog: savedBlog }, "Blog Created Successfully!");
  } catch (error) {
    return ERROR(res, { error }, error.message || "Something went Wrong");
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const { slug, page, limit } = req.query;
    console.log(page, limit);
    const blog = await BlogService.getBlogs({
      slug,
      page: parseInt(page),
      limit: parseInt(limit),
    });
    if (slug) {
      if (blog.length)
        return OK(res, { blog: blog[0] }, "Blog Found Successfully!");
      else return ERROR(res, null, "No blog found!");
    }

    const blogTotal = await BlogService.countBlogs();
    return OK(
      res,
      { blogs: blog, page, limit, total: blogTotal },
      "Blogs Found Successfully!"
    );
  } catch (error) {
    return ERROR(res, { error }, error.message || "Something went Wrong");
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { slug, title, content, image, readTime } = req.body;
    const { userCode } = req.payload;

    const body = {};
    if (title) body.title = title;
    if (content) body.content = content;
    if (readTime) body.readTime = readTime;
    if (image) body.image = image;

    const blog = await BlogService.getBlogs({
      slug,
      author: userCode,
    });

    if (blog.length) {
      const updatedBlog = await BlogService.updateBlog(slug, body);
      socket.emit(
        EVENTS.BLOG_UPDATE,
        RESPONSE(MESSAGE_CODES.BLOG_UPDATED, updatedBlog, RESPONSE_TYPE.SUCCESS)
      );
      return OK(res, updatedBlog, "Blogs updated Successfully!");
    }
    return ERROR(res, null, "No blog found!");
  } catch (error) {
    return ERROR(res, { error }, error.message || "Something went Wrong");
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { slug } = req.body;
    const { userCode } = req.payload;

    const blog = await BlogService.deleteBlog({
      slug,
      author: userCode,
    });

    if (blog.acknowledged) {
      return OK(res, null, "Blog deleted Successfully!");
    }
    return ERROR(res, null, "Failed to delete blog!");
  } catch (error) {
    return ERROR(res, { error }, error.message || "Something went Wrong");
  }
};
