const express = require("express");
const route = express.Router();
const verifyToken = require("../middlewares/auth");
const EmployeeController = require("../controllers/EmployeeController");
const { validate } = require("../services/validator");
const { body } = require("express-validator");

const validateEmployee = [
    body("name", "Invalid name").not().isEmpty(),
    // body("phone", "Invalid phone").isMobilePhone("vi-VN"),
];

//@route GET api/employee
//@get all employee
route.get("/", verifyToken, EmployeeController.getAll);

//@ route GET api/employee/id
//@get employee with id
route.get("/:id", verifyToken, EmployeeController.getEmployee);

//@ route POST api/employee/add
route.post(
    "/add",
    verifyToken,
    validate(validateEmployee),
    EmployeeController.addEmployee
);

//@ route PUT api/employee/edit/id
route.put(
    "/edit/:id",
    verifyToken,
    validate(validateEmployee),
    EmployeeController.updateEmployee
);

//@ route DELETE api/employee/delete/id
route.delete("/delete/:id", verifyToken, EmployeeController.deleteEmployee);

module.exports = route;
