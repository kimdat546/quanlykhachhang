const express = require("express");
const route = express.Router();
const verifyToken = require("../middlewares/auth");
const CustomerController = require("../controllers/CustomerController");
const { validate } = require("../services/validator");
const { body } = require("express-validator");

const validateCustomer = [
    body("name", "Invalid name").not().isEmpty(),
    body("phone", "Invalid phone").isLength({ max: 12 }),
    // body("phone", "Invalid phone").isMobilePhone("vi-VN"),
];

//@route GET api/customers
//@get all customers
route.get("/", verifyToken, CustomerController.getAll);

//@ route GET api/customers/id
//@get customer with id
route.get("/:id", verifyToken, CustomerController.getCustomer);

//@ route POST api/customers/
route.post(
    "/add",
    verifyToken,
    validate(validateCustomer),
    CustomerController.addCustomer
);

//@ route PUT api/customers/id
route.put(
    "/edit/:id",
    verifyToken,
    validate(validateCustomer),
    CustomerController.updateCustomer
);

//@ route DELETE api/post/ delete
route.delete("/delete/:id", verifyToken, CustomerController.deleteCustomer);

module.exports = route;
