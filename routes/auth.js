const express = require("express");
const route = express.Router();
const { verifyToken, verifyRefreshToken } = require("../middlewares/auth");
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
route.post("/register", verifyToken, validateRegister, AuthController.register);

//@route POST api/auth/login
route.post("/login", validateLogin, AuthController.login);

//@route POST api/auth/changepassword
route.post(
	"/changepassword",
	verifyToken,
	validateChangePassword,
	AuthController.changePassword
);

//@get access token is logged in
route.get("/token", verifyRefreshToken, AuthController.token);

route.post("/logout", verifyToken, AuthController.logout);

route.get("/getall", verifyToken, AuthController.getAllUser);

/**
 * @description get user by role
 */
route.get("/getByRole/:role", verifyToken, AuthController.getByRole);

route.post("/edit/:id", verifyToken, AuthController.editUser);

route.post("/delete/:id", verifyToken, AuthController.deleteUser);

route.get("/:id", verifyToken, AuthController.getUser);

module.exports = route;
