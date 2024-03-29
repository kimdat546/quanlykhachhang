const express = require("express");
const route = express.Router();
const { verifyToken } = require("../middlewares/auth");
const EmployeeController = require("../controllers/EmployeeController");
const { validate } = require("../services/validator");
const { body } = require("express-validator");
const { optimizeImage, uploadImages } = require("../services/upload");

const validateEmployee = [
	body("name", "Invalid name").not().isEmpty(),
	body("address", "Invalid address").isJSON(),
	body("birthday", "Invalid birthday").isDate(),
	// body("phone", "Invalid phone").isMobilePhone("vi-VN"),
];

//@route GET api/employee
//@get all employee
route.get("/", verifyToken, EmployeeController.getAll);

/**
 * @route GET api/employee/by_hour
 * @desc get employee by hour
 * @access Admin, Manager Hour
 * @return {Object} employee
 */
route.post("/by_hour", verifyToken, EmployeeController.getByHour);

/**
 * @route GET api/employee/id
 * @desc get employee with id
 * @access Public
 * @return {Object} employee
 * @param {Number} id
 */
route.get("/:id", verifyToken, EmployeeController.getEmployee);

//@ route POST api/employee/add
route.post(
	"/add",
	verifyToken,
	uploadImages,
	optimizeImage,
	EmployeeController.addEmployee
);

//@ route PUT api/employee/edit/id
route.put(
	"/edit/:id",
	verifyToken,
	uploadImages,
	optimizeImage,
	EmployeeController.updateEmployee
);

//@ route DELETE api/employee/delete/id
route.delete("/delete/:id", verifyToken, EmployeeController.deleteEmployee);

/**
 * @param {string} searchContent
 * @returns {object}
 * @description search employee by text
 */

route.get(
	"/search/:searchContent",
	verifyToken,
	EmployeeController.searchEmployee
);

module.exports = route;
