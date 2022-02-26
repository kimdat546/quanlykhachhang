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

//@ data { id_customer, id_employee }
route.post("/success", verifyToken, ContractController.success);

//@ data { id_customer, id_employee }
route.post("/fail", verifyToken, ContractController.fail);

//@ data { id_customer, id_employee ,id_employee_change}
route.post("/change", verifyToken, ContractController.change);

//@ data { id_customer, id_employee_change }
route.post("/changeSuccess", verifyToken, ContractController.changeSuccess);

//@ data { id_customer, id_employee_change }
route.post("/changeFail", verifyToken, ContractController.changeFail);

//@ data { id_customer, id_employee, id_employee_change }
route.post("/cancelContract", verifyToken, ContractController.cancelContract);

//@ data { id_customer, id_employee, id_employee_change }
route.post("/splitFees", verifyToken, ContractController.splitFees);

//@ data { id_customer, id_employee, id_employee_change}
route.post("/contractExpires", verifyToken, ContractController.contractExpires);

module.exports = route;
