const express = require("express");
const route = express.Router();
const { Company } = require("../models");
const { verifyToken } = require("../middlewares/auth");
route.get("/company", verifyToken, async (req, res) => {
	try {
		const company = await Company.findAll();
		res.json({
			success: true,
			message: "Get info company success",
			company,
		});
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
});
route.post("/company", verifyToken, async (req, res) => {
	const { companyName, companyAddress, feeVehicle, taxCode } = req.body;
	try {
		const company = new Company({
			companyName,
			companyAddress,
			feeVehicle,
			taxCode,
		});
		await company.save();
		res.json({
			success: true,
			message: "Enter info company success",
			company,
		});
	} catch (error) {
		console.log(error);

		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
});
route.put("/company", verifyToken, async (req, res) => {
	const { companyName, companyAddress, feeVehicle, taxCode } = req.body;
	try {
		const company = {
			companyName,
			companyAddress,
			feeVehicle,
			taxCode,
		};
		await Company.update(company, { where: { companyName: companyName } });
		res.json({
			success: true,
			message: "Update info company success",
			company,
		});
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
});

module.exports = route;
