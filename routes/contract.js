const express = require("express");
const route = express.Router();
const { verifyToken } = require("../middlewares/auth");
const ContractController = require("../controllers/ContractController");

//@route GET api/contract
//@get all contract
route.get("/", verifyToken, ContractController.getAll);

//@ route GET api/employee/id
//@get employee with id
route.get("/:id", verifyToken, ContractController.getContract);

//@ route POST api/employee/add
route.post("/add", verifyToken, ContractController.addContract);

//@ route PUT api/employee/edit/id
route.put("/edit/:id", verifyToken, ContractController.updateContract);

//@ data { id_customer, id_employee, id_contract }
route.post("/success", verifyToken, ContractController.success);

//@ data { id_customer, id_employee, id_contract }
route.post("/fail", verifyToken, ContractController.fail);

//@ data { id_customer, id_employee ,id_employee_change, id_contract }
route.post("/change", verifyToken, ContractController.change);

//@ data { id_customer, id_employee, id_contract, id_contract_change }
//id_contract is id new of contract, id_contract_change is id old of contract (option)
route.post("/cancelContract", verifyToken, ContractController.cancelContract);

//@ data { id_customer, id_employee, id_contract, id_contract_change }
//id_contract is id new of contract, id_contract_change is id old of contract (option)
route.post("/splitFees", verifyToken, ContractController.splitFees);

//@ data { id_customer, id_employee, id_contract}
route.post("/contractExpires", verifyToken, ContractController.contractExpires);

/**
 * @return {Object}
 * @param {String} id_customer
 * @description get all contract by id_customer
 */
route.get(
	"/getAllContractByCustomer/:id_customer",
	verifyToken,
	ContractController.getAllContractByCustomer
);

/**
 * @param {number} id_customer
 * @description get id contract by customer
 */
route.get(
	"/getIdContractByCustomer/:id_customer",
	verifyToken,
	ContractController.getIdContractByCustomer
);

module.exports = route;
