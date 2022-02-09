const express = require("express");
const route = express.Router();
const { verifyToken } = require("../middlewares/auth");
const ContractController = require("../controllers/ContractController");

//@route GET api/employee
//@get all employee
route.get("/", verifyToken, ContractController.getAll);

//@ route GET api/employee/id
//@get employee with id
route.get("/:id", verifyToken, ContractController.getContract);

//@ route POST api/employee/add
route.post("/add", verifyToken, ContractController.addContract);

//@ route PUT api/employee/edit/id
route.put("/edit/:id", verifyToken, ContractController.updateContract);

//@ route DELETE api/employee/delete/id
route.delete("/delete/:id", verifyToken, ContractController.deleteContract);

module.exports = route;
