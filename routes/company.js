const express = require("express");
const route = express.Router();
const { Company } = require("../models");
const { verifyToken } = require("../middlewares/auth");
const {
	getInfoCompany,
	updateInfoCompany,
	createInfoCompany,
} = require("../controllers/CompanyController");

/**
 * @description Get info company
 * @param {string} token
 */

route.get("/", verifyToken, getInfoCompany);

/**
 * @description Update info company
 * @param {string} token, companyName, companyAddress, feeVehicle, taxCode, companyPhone
 */
route.put("/update", verifyToken, updateInfoCompany);

/**
 * @description Create info company
 * @param {string} token, companyName, companyAddress, feeVehicle, taxCode, companyPhone
 */
route.post("/create", verifyToken, createInfoCompany);

module.exports = route;
