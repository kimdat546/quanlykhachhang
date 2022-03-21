const express = require("express");
const { validationResult } = require("express-validator");
const { body } = require("express-validator");

// parallel processing
const validate = (validations) => {
	return async (req, res, next) => {
		await Promise.all(validations.map((validation) => validation.run(req)));

		const errors = validationResult(req);
		if (errors.isEmpty()) {
			return next();
		}

		res.status(400).json({ errors: errors.array() });
	};
};

const validateLogin = validate([
	body("username", "username không được để trống").not().isEmpty(),
	body("password", "password không được để trống").not().isEmpty(),
]);

const validateRegister = validate([
	body("username", "username không được để trống").not().isEmpty(),
	body("password", "password không được để trống").not().isEmpty(),
	// body("email", "email không được để trống").not().isEmpty(),
	body("password", "password tối thiểu 6 kí tự").isLength({ min: 6 }),
	// body("email", "email sai định dạng").isEmail(),
]);

const validateChangePassword = validate([
	body("passwordOld", "username không được để trống").not().isEmpty(),
	body("passwordNew", "password không được để trống").not().isEmpty(),
	body("passwordNew", "password tối thiểu 6 kí tự").isLength({ min: 6 }),
]);

module.exports = {
	validate,
	validateLogin,
	validateRegister,
	validateChangePassword,
};
