const express = require("express");
const route = express.Router();
const { verifyToken } = require("../middlewares/auth");
const CustomerController = require("../controllers/CustomerController");
const { validate } = require("../services/validator");
const { body } = require("express-validator");
const { upload, optimizeImage, uploadImages } = require("../services/upload");

const validateCustomer = [
	body("name", "Invalid name").not().isEmpty(),
	body("phone", "Invalid phone").isLength({ max: 12 }),
	// body("phone", "Invalid phone").isMobilePhone("vi-VN"),
];

//@ route POST api/customer/add
route.post(
	"/add",
	verifyToken,
	uploadImages,
	optimizeImage,
	CustomerController.addCustomer
);

//@ route PUT api/customer/edit/id
route.put(
	"/edit/:id",
	verifyToken,
	upload.any(),
	CustomerController.updateCustomer
);

//@ route DELETE api/customer/delete/id
route.delete("/delete/:id", verifyToken, CustomerController.deleteCustomer);

/**
 * @param {string} searchContent
 * @returns {object}
 * @description search customer by text
 */

route.get(
	"/search/:searchContent",
	verifyToken,
	CustomerController.searchCustomer
);

/**
 * @param {number} id
 * @returns {object}
 * @description add customer to wait list
 */

route.post(
	"/add-to-wait-list/:id",
	verifyToken,
	CustomerController.addCustomerToWaitingList
);

/**
 * @param {number} id
 * @returns {object}
 * @description remove customer from wait list
 */

route.delete(
	"/remove-from-wait-list/:id",
	verifyToken,
	CustomerController.removeCustomerFromWaitingList
);

/**
 * @return {object}
 * @description get all customer in wait list
 */

route.get("/getCustomerWait", verifyToken, CustomerController.getListWaiting);

//@route GET api/customer
//@get all customer
route.get("/", verifyToken, CustomerController.getAll);

//@ route GET api/customer/id
//@get customer with id
route.get("/:id", verifyToken, CustomerController.getCustomer);

/**
 * @description return error file big size
 */
route.use(function (err, req, res, next) {
	if (err.code === "LIMIT_FILE_SIZE") {
		res.send({
			result: "fail",
			error: { code: 1001, message: "File is too big" },
		});
		return;
	}

	// Handle any other errors
});

module.exports = route;
