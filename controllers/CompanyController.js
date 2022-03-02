const { Company } = require("../models");

/**
 * @description Get info company
 */
const getInfoCompany = async (req, res) => {
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
};

/**
 * @description Update info company
 * @param {string} companyName, companyAddress, feeVehicle, taxCode, companyPhone
 */

const updateInfoCompany = async (req, res) => {
	try {
		const {
			idCompany,
			companyName,
			companyAddress,
			feeVehicle,
			companyTaxCode,
			companyPhone,
		} = req.body;
		console.log(companyName);
		const company = {
			companyName,
			companyAddress,
			feeVehicle,
			phoneNumber: companyPhone,
			taxCode: companyTaxCode,
		};
		await Company.update(company, { where: { id: idCompany } });
		res.json({
			success: true,
			message: "Cập nhật thông tin thành công",
			company,
		});
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

const createInfoCompany = async (req, res) => {
	try {
		const {
			companyName,
			companyAddress,
			feeVehicle,
			companyTaxCode,
			companyPhone,
		} = req.body;
		const company = {
			companyName,
			companyAddress,
			feeVehicle,
			phoneNumber: companyPhone,
			taxCode: companyTaxCode,
		};
		await Company.create(company);
		res.json({
			success: true,
			message: "Create info company success",
			company,
		});
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

module.exports = { getInfoCompany, updateInfoCompany, createInfoCompany };
