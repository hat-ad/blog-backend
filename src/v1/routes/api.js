const express = require("express");
const { auth } = require("../../middleware/checkAuth");

const router = express.Router();

const apiUser = require("./api/user.api");
router.use("/user", apiUser);

const apiUpload = require("./api/upload.api");
router.use("/upload", auth, apiUpload);

const apiBlog = require("./api/blog.api");
router.use("/blog", auth, apiBlog);

module.exports = router;
