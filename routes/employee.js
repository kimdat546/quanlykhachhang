const express = require("express");
const route = express.Router();
const { verifyToken } = require("../middlewares/auth");
const EmployeeController = require("../controllers/EmployeeController");
const { validate } = require("../services/validator");
const { body } = require("express-validator");
const upload = require("../services/upload");

const validateEmployee = [
	body("name", "Invalid name").not().isEmpty(),
	body("address", "Invalid address").isJSON(),
	body("birthday", "Invalid birthday").isDate(),
	// body("phone", "Invalid phone").isMobilePhone("vi-VN"),
];

//@route GET api/employee
//@get all employee
route.get("/", verifyToken, EmployeeController.getAll);

//@ route GET api/employee/id
//@get employee with id
route.get("/:id", verifyToken, EmployeeController.getEmployee);

//@ route POST api/employee/add
route.post("/add", verifyToken, upload.any(), EmployeeController.addEmployee);

//@ route PUT api/employee/edit/id
route.put(
	"/edit/:id",
	verifyToken,
	upload.any(),
	EmployeeController.updateEmployee
);

//@ route DELETE api/employee/delete/id
route.delete("/delete/:id", verifyToken, EmployeeController.deleteEmployee);

/**
 * @route GET api/employee/by_hour
 * @desc get employee by hour
 * @access Admin, Manager Hour
 * @return {Object} employee
 */
route.get("/by_hour", verifyToken, EmployeeController.getEmployeeByHour);

module.exports = route;
