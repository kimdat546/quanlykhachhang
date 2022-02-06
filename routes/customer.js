const express = require("express");
const route = express.Router();
const {verifyToken} = require("../middlewares/auth");
const CustomerController = require("../controllers/CustomerController");
const { validate } = require("../services/validator");
const { body } = require("express-validator");
const upload = require("../services/upload");

const validateCustomer = [
    body("name", "Invalid name").not().isEmpty(),
    body("phone", "Invalid phone").isLength({ max: 12 }),
    // body("phone", "Invalid phone").isMobilePhone("vi-VN"),
];

//@route GET api/customer
//@get all customer
route.get("/", verifyToken, CustomerController.getAll);

//@ route GET api/customer/id
//@get customer with id
route.get("/:id", verifyToken, CustomerController.getCustomer);

//@ route POST api/customer/add
route.post(
    "/add",
    verifyToken,
    upload.any(),
    // validate(validateCustomer),
    CustomerController.addCustomer
);

//@ route PUT api/customer/edit/id
route.put(
    "/edit/:id",
    verifyToken,
    // validate(validateCustomer),
    CustomerController.updateCustomer
);

//@ route DELETE api/customer/delete/id
route.delete("/delete/:id", verifyToken, CustomerController.deleteCustomer);

module.exports = route;
