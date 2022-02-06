const express = require("express");
const route = express.Router();
const verifyToken = require("../middlewares/auth");
const AuthController = require("../controllers/AuthController");

const {
    validateLogin,
    validateRegister,
    validateChangePassword,
} = require("../services/validator");

//@route POST api/auth
//@check user is logged in
route.get("/", verifyToken, AuthController.checkUser);

// @route POST api/auth/register
route.post("/register", validateRegister, AuthController.register);

//@route POST api/auth/login
route.post("/login", validateLogin, AuthController.login);

//@route POST api/auth/changepassword
route.post(
    "/changepassword",
    verifyToken,
    validateChangePassword,
    AuthController.changePassword
);

//@check user is logged in
route.post("/token", verifyToken, AuthController.token);

module.exports = route;
