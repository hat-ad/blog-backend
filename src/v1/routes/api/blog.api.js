const express = require("express");
const BlogController = require("../../controllers/blog.controller");
const router = express.Router();

router.post("/", BlogController.createBlog);
router.get("/", BlogController.getBlogs);
router.put("/", BlogController.updateBlog);
router.post("/delete", BlogController.deleteBlog);

module.exports = router;
