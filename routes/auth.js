const express = require("express");
const route = express.Router();
const verifyToken = require("../middlewares/auth");
const AuthController = require("../controllers/AuthController");

//@route POST api/auth
//@check user is logged in
route.get("/", verifyToken, AuthController.checkUser);

// @route POST api/auth/register
route.post("/register", AuthController.register);

//@route POST api/auth/login
route.post("/login", AuthController.login);

//@route POST api/auth/changepassword
route.post("/changepassword", verifyToken, AuthController.changePassword);

module.exports = route;
