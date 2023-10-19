const express = require("express");
const UserController = require("../../controllers/user.controller");

const router = express.Router();

router.post("/login", UserController.login);

router.post("/login/social", UserController.socialLogin);

router.post("/create/social", UserController.socialRegister);

router.post("/create", UserController.createUser);

module.exports = router;
