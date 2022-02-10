const { Contracts, Customers, Employees } = require("../models");
const Sequelize = require("sequelize");

const getPagination = (page, size) => {
	const limit = size ? +size : 10;
	const offset = page ? page * limit : 0;
	return { limit, offset };
};

const getAll = async (req, res) => {
	const { limit, offset } = getPagination(req.query.page, req.query.size);
	try {
		const contracts = await Contracts.findAndCountAll({
			include: [
				{
					model: Customers,
					as: "customer",
					// where: { id: Contracts.customer_id },
					attributes: ["name", "phone"],
				},
				{
					model: Employees,
					as: "employee",
					// where: { id: Contracts.employee_id },
					attributes: ["name", "phone"],
				},
			],
			order: [["exchange_id", "ASC"]],
			limit,
			offset,
		});
		res.json({ success: true, message: "Get all contracts ok", contracts });
	} catch (error) {
		console.log(error);
		return res
			.status(401)
			.json({ success: false, message: "Get contracts false" });
	}
};

const getContract = async (req, res) => {
	try {
		const id = req.params.id;
		const contract = await Contracts.findOne({
			include: [
				{
					model: Customers,
					as: "customer",
					// where: { id: Contracts.customer_id },
					attributes: ["name", "phone"],
				},
				{
					model: Employees,
					as: "employee",
					// where: { id: Contracts.employee_id },
					attributes: ["name", "phone"],
				},
			],
			where: { id },
		});
		res.json({ success: true, message: "Get contract ok", contract });
	} catch (error) {
		console.log(error);
		return res
			.status(401)
			.json({ success: false, message: "Get contract false" });
	}
};

const addContract = async (req, res) => {
	const {
		id_customer,
		id_employee,
		fee_service,
		fee_vehicle,
		follow,
		trial_time,
		exchange_time_max,
		note,
		country,
	} = req.body;

	if (exchange_time_max > 3 && req.role !== "admin") {
		return res.status(400).json({
			success: false,
			message: "Role must be admin",
		});
	}

	try {
		const newContract = new Contracts({
			customer_id: id_customer,
			employee_id: id_employee,
			fee_service: fee_service || 0,
			fee_vehicle: fee_vehicle || 0,
			follow: follow || "month",
			trial_time: trial_time || 30,
			exchange_time_max: exchange_time_max || 3,
			note,
			country: country || "Việt Nam",
		});

		await newContract.save();

		await Contracts.update(
			{ ...newContract, exchange_id: newContract.id },
			{
				where: { id: newContract.id },
			}
		);

		return res.json({
			success: true,
			message: "New contract successfully created",
			contract: newContract,
		});
	} catch (error) {
		console.log("error " + error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

const updateContract = async (req, res) => {
	const {
		id_customer,
		id_employee,
		fee_service,
		fee_vehicle,
		follow,
		trial_time,
		exchange_time_max,
		note,
		country,
	} = req.body;

	if (exchange_time_max > 3 && req.role !== "admin") {
		return res.status(400).json({
			success: false,
			message: "Role must be admin",
		});
	}

	try {
		const conditionUpdateContract = {
			id: req.params.id,
		};
		let updateContract = {
			customer_id: id_customer,
			employee_id: id_employee,
			fee_service,
			fee_vehicle,
			follow,
			trial_time,
			exchange_time_max,
			note,
			country,
		};
		updateContract = await Contracts.update(updateContract, {
			where: conditionUpdateContract,
		});

		if (!updateContract)
			return res.status(401).json({
				success: false,
				message: "Update contract failed",
			});
		res.json({ success: true, message: "Update contract successfully" });
	} catch (error) {
		console.log("error " + error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

const deleteContract = async (req, res) => {
	try {
		const conditionDeleteContract = {
			id: req.params.id,
		};

		const deleteContract = await Contracts.destroy({
			where: conditionDeleteContract,
		});

		if (!deleteContract)
			return res.status(401).json({
				success: false,
				message: "Delete false",
			});
		res.json({
			success: true,
			message: "Delete ok",
			contract: deleteContract,
		});
	} catch (error) {
		console.log("error " + error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

module.exports = {
	getAll,
	getContract,
	addContract,
	updateContract,
	deleteContract,
};
