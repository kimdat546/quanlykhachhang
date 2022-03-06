const { Contracts, Customers, Employees } = require("../models");
const Sequelize = require("sequelize");

const changStatus = async (
	type,
	id_customer,
	id_employee,
	id_employee_change,
	id_contract,
	id_contract_change
) => {
	switch (type) {
		case "create": {
			await Customers.update(
				{ status: "Interviewing" },
				{
					where: {
						id: id_customer,
					},
				}
			);
			await Employees.update(
				{ status: "Interviewing" },
				{
					where: {
						id: id_employee,
					},
				}
			);
			break;
		}
		case "success": {
			await Contracts.update(
				{ status: "Successful" },
				{
					where: {
						id: id_contract,
					},
				}
			);
			await Customers.update(
				{ status: "Successful" },
				{
					where: {
						id: id_customer,
					},
				}
			);
			await Employees.update(
				{ status: "Working" },
				{
					where: {
						id: id_employee,
					},
				}
			);
			break;
		}
		case "fail": {
			await Contracts.update(
				{ status: "Failure" },
				{
					where: {
						id: id_contract,
					},
				}
			);
			await Customers.update(
				{ status: "Failure" },
				{
					where: {
						id: id_customer,
					},
				}
			);
			await Employees.update(
				{ status: "Waiting" },
				{
					where: {
						id: id_employee,
					},
				}
			);
			break;
		}
		case "change": {
			await Contracts.update(
				{ status: "RequestChange" },
				{
					where: {
						id: id_contract,
					},
				}
			);
			await Customers.update(
				{ status: "RequestChange" },
				{
					where: {
						id: id_customer,
					},
				}
			);
			await Employees.update(
				{ status: "Waiting" },
				{
					where: {
						id: id_employee,
					},
				}
			);
			await Employees.update(
				{ status: "Interviewing" },
				{
					where: {
						id: id_employee_change,
					},
				}
			);
			break;
		}
		case "changeSuccess": {
			await Contracts.update(
				{ status: "ChangeSuccessfully" },
				{
					where: {
						id: id_contract,
					},
				}
			);
			await Contracts.update(
				{ status: "ChangeSuccessfully" },
				{
					where: {
						id: id_contract_change,
					},
				}
			);
			await Customers.update(
				{ status: "ChangeSuccessfully" },
				{
					where: {
						id: id_customer,
					},
				}
			);
			await Employees.update(
				{ status: "Working" },
				{
					where: {
						id: id_employee_change,
					},
				}
			);
			break;
		}
		case "changeFail": {
			await Contracts.update(
				{ status: "ChangeFailure" },
				{
					where: {
						id: id_contract,
					},
				}
			);
			await Contracts.update(
				{ status: "ChangeFailure" },
				{
					where: {
						id: id_contract_change,
					},
				}
			);
			await Customers.update(
				{ status: "ChangeFailure" },
				{
					where: {
						id: id_customer,
					},
				}
			);
			await Employees.update(
				{ status: "Waiting" },
				{
					where: {
						id: id_employee_change,
					},
				}
			);
			break;
		}
		case "cancelContract": {
			await Contracts.update(
				{ status: "CancelContract" },
				{
					where: {
						id: id_contract,
					},
				}
			);
			id_contract_change &&
				(await Contracts.update(
					{ status: "ChangeFailure" },
					{
						where: {
							id: id_contract_change,
						},
					}
				));
			await Customers.update(
				{ status: "CancelContract" },
				{
					where: {
						id: id_customer,
					},
				}
			);
			await Employees.update(
				{ status: "Waiting" },
				{
					where: {
						id: id_employee,
					},
				}
			);
			break;
		}
		case "splitFees": {
			await Contracts.update(
				{ status: "SplitFees" },
				{
					where: {
						id: id_contract,
					},
				}
			);
			id_contract_change &&
				(await Contracts.update(
					{ status: "ChangeFailure" },
					{
						where: {
							id: id_contract_change,
						},
					}
				));
			await Customers.update(
				{ status: "SplitFees" },
				{
					where: {
						id: id_customer,
					},
				}
			);
			await Employees.update(
				{ status: "Waiting" },
				{
					where: {
						id: id_employee,
					},
				}
			);
			break;
		}
		case "contractExpires": {
			await Contracts.update(
				{ status: "ContractExpires" },
				{
					where: {
						id: id_contract,
					},
				}
			);
			await Customers.update(
				{ status: "ContractExpires" },
				{
					where: {
						id: id_customer,
					},
				}
			);
			await Employees.update(
				{ status: "Waiting" },
				{
					where: {
						id: id_employee,
					},
				}
			);
			break;
		}
		default:
			break;
	}
};

const success = async (req, res) => {
	try {
		const { id_customer, id_employee, id_contract } = req.body;
		await changStatus("success", id_customer, id_employee, "", id_contract);
		res.json({ success: true, message: "Success" });
	} catch (error) {
		console.log(error);
		return res.status(401).json({ success: false, message: "False" });
	}
};
const fail = async (req, res) => {
	try {
		const { id_customer, id_employee, id_contract } = req.body;
		await changStatus("fail", id_customer, id_employee, "", id_contract);
		res.json({ success: true, message: "Success" });
	} catch (error) {
		console.log(error);
		return res.status(401).json({ success: false, message: "False" });
	}
};
const change = async (req, res) => {
	try {
		const { id_customer, id_employee, id_employee_change, id_contract } =
			req.body;
		await changStatus(
			"change",
			id_customer,
			id_employee,
			id_employee_change,
			id_contract
		);
		res.json({ success: true, message: "Success" });
	} catch (error) {
		console.log(error);
		return res.status(401).json({ success: false, message: "False" });
	}
};
const changeSuccess = async (req, res) => {
	try {
		const {
			id_customer,
			id_employee_change,
			id_contract,
			id_contract_change,
		} = req.body;
		await changStatus(
			"changeSuccess",
			id_customer,
			"",
			id_employee_change,
			id_contract,
			id_contract_change
		);
		res.json({ success: true, message: "Success" });
	} catch (error) {
		console.log(error);
		return res.status(401).json({ success: false, message: "False" });
	}
};
const changeFail = async (req, res) => {
	try {
		const {
			id_customer,
			id_employee_change,
			id_contract,
			id_contract_change,
		} = req.body;
		await changStatus(
			"changeFail",
			id_customer,
			"",
			id_employee_change,
			id_contract,
			id_contract_change
		);
		res.json({ success: true, message: "Success" });
	} catch (error) {
		console.log(error);
		return res.status(401).json({ success: false, message: "False" });
	}
};
const cancelContract = async (req, res) => {
	try {
		const { id_customer, id_employee, id_contract, id_contract_change } =
			req.body;
		await changStatus(
			"cancelContract",
			id_customer,
			id_employee,
			"",
			id_contract,
			id_contract_change
		);
		res.json({ success: true, message: "Success" });
	} catch (error) {
		console.log(error);
		return res.status(401).json({ success: false, message: "False" });
	}
};
const splitFees = async (req, res) => {
	try {
		const { id_customer, id_employee, id_contract, id_contract_change } =
			req.body;
		await changStatus(
			"splitFees",
			id_customer,
			id_employee,
			"",
			id_contract,
			id_contract_change
		);
		res.json({ success: true, message: "Success" });
	} catch (error) {
		console.log(error);
		return res.status(401).json({ success: false, message: "False" });
	}
};
const contractExpires = async (req, res) => {
	try {
		const { id_customer, id_employee, id_contract } = req.body;
		await changStatus(
			"contractExpires",
			id_customer,
			id_employee,
			"",
			id_contract
		);
		res.json({ success: true, message: "Success" });
	} catch (error) {
		console.log(error);
		return res.status(401).json({ success: false, message: "False" });
	}
};

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
					attributes: ["name", "phone", "status"],
				},
				{
					model: Employees,
					as: "employee",
					// where: { id: Contracts.employee_id },
					attributes: ["name", "phone", "status"],
				},
			],
			order: [
				["id", "DESC"],
				["exchange_id", "DESC"],
			],
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
					attributes: ["name", "phone", "status"],
				},
				{
					model: Employees,
					as: "employee",
					// where: { id: Contracts.employee_id },
					attributes: ["name", "phone", "status"],
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
		trial_change,
		exchange_time_max,
		note,
		note_blacklist,
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
			trial_change: trial_change || 30,
			exchange_time_max: exchange_time_max || 3,
			note,
			note_blacklist,
			country: country || "Việt Nam",
			markBy: req.userId,
		});

		await newContract.save();

		await Contracts.update(
			{ ...newContract, exchange_id: newContract.id },
			{
				where: { id: newContract.id },
			}
		);
		await changStatus("create", id_customer, id_employee);

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
		trial_change,
		exchange_time_max,
		note,
		note_blacklist,
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
			trial_change,
			exchange_time_max,
			note,
			note_blacklist,
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

const changeEmployee = async (req, res) => {
	const { id_contract, id_employee } = req.body;
	try {
		let newContract = Contracts.findOne({ where: { id: id_contract } });
		await changStatus(
			"change",
			newContract.customer_id,
			newContract.employee_id,
			id_employee,
			newContract.id
		);
		newContract = {
			...newContract,
			employee_id: id_employee,
			exchange_id: id_contract,
			markBy: req.userId,
		};
		newContract = new Contracts(newContract);

		await newContract.save();

		return res.json({
			success: true,
			message: "Change employee successfully created",
			contract: newContract,
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
	success,
	fail,
	change,
	changeSuccess,
	changeFail,
	cancelContract,
	splitFees,
	contractExpires,
	changeEmployee,
};
