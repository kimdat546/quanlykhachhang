const { Contracts, Customers, Employees, Users } = require("../models");

/**
 * @param {number} id_contract, id_employee, userId, note
 */

const copyInfoFromOldContract = async (
	id_contract,
	id_employee,
	userId = null,
	note = null
) => {
	try {
		const oldContract = await Contracts.findOne({
			where: { id: id_contract },
		});
		const {
			customer_id,
			fee_service,
			fee_vehicle,
			follow,
			trial_time,
			exchange_time_max,
			exchange_time,
			markBy,
			old_contract_id,
		} = oldContract;
		if (exchange_time >= exchange_time_max) {
			return {
				status: false,
				message: "Đã đạt giới hạn đổi người",
			};
		}
		const newContract = new Contracts({
			customer_id: customer_id,
			employee_id: id_employee,
			fee_service: fee_service,
			fee_vehicle: fee_vehicle,
			follow: follow,
			trial_time: trial_time,
			exchange_time_max: exchange_time_max,
			exchange_time: exchange_time + 1,
			note: note,
			markBy: userId ? userId : markBy,
			exchange_id: id_contract,
			old_contract_id: old_contract_id ? old_contract_id : id_contract,
		});
		return await newContract.save();
	} catch (error) {
		console.log(error);
	}
};

/**
 * @param {number} id_employee
 */
const checkAvailable = async (id_employee) => {
	try {
		const employee = await Employees.findOne({
			where: { id: id_employee },
			attributes: ["id", "status"],
		});
		if (employee.status == "Waiting") {
			return true;
		}
		return false;
	} catch (error) {
		console.log(error);
	}
};
const changStatus = async (
	type,
	id_employee = "",
	id_contract = "",
	id_customer = ""
) => {
	let idBoth;
	if (id_contract) {
		idBoth = await Contracts.findOne({
			where: {
				id: id_contract,
			},
			attributes: ["customer_id", "employee_id"],
		});
	}
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
						id: idBoth.customer_id,
					},
				}
			);
			await Employees.update(
				{ status: "Working" },
				{
					where: {
						id: idBoth.employee_id,
					},
				}
			);
			const currentContract = await Contracts.findOne({
				where: {
					id: id_contract,
				},
				attributes: ["exchange_id"],
			});

			if (currentContract.exchange_id != id_contract) {
				await Contracts.update(
					{ status: "ChangeSuccessfully" },
					{
						where: {
							id: currentContract.exchange_id,
						},
					}
				);
			}
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
						id: idBoth.customer_id,
					},
				}
			);
			await Employees.update(
				{ status: "Waiting" },
				{
					where: {
						id: idBoth.employee_id,
					},
				}
			);
			const currentContract = await Contracts.findOne({
				where: {
					id: id_contract,
				},
				attributes: ["exchange_id"],
			});
			if (currentContract.exchange_id != id_contract) {
				await Contracts.update(
					{ status: "ChangeFailure" },
					{
						where: {
							id: currentContract.exchange_id,
						},
					}
				);
			}
			break;
		}
		case "change": {
			if (id_employee === idBoth.employee_id) {
				return {
					status: false,
					message: "Không thể thay đổi hợp đồng trùng lao động",
				};
			}
			const response = await copyInfoFromOldContract(
				id_contract,
				id_employee
			);
			if (response.status != false) {
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
							id: idBoth.customer_id,
						},
					}
				);
				await Employees.update(
					{ status: "Waiting" },
					{
						where: {
							id: idBoth.employee_id,
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
				if (response.old_contract_id != response.exchange_id) {
					await Contracts.update(
						{ status: "Successful" },
						{
							where: {
								id: response.old_contract_id,
							},
						}
					);
				}
			}
			return response;
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
			await Customers.update(
				{ status: "CancelContract" },
				{
					where: {
						id: idBoth.customer_id,
					},
				}
			);
			await Employees.update(
				{ status: "Waiting" },
				{
					where: {
						id: idBoth.employee_id,
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
			await Customers.update(
				{ status: "SplitFees" },
				{
					where: {
						id: idBoth.customer_id,
					},
				}
			);
			await Employees.update(
				{ status: "Waiting" },
				{
					where: {
						id: idBoth.employee_id,
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
						id: idBoth.customer_id,
					},
				}
			);
			await Employees.update(
				{ status: "Waiting" },
				{
					where: {
						id: idBoth.employee_id,
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
		const { id_contract } = req.body;
		await changStatus("success", "", id_contract);
		res.json({ success: true, message: "Success" });
	} catch (error) {
		console.log(error);
		return res.status(401).json({ success: false, message: "False" });
	}
};
const fail = async (req, res) => {
	try {
		const { id_contract } = req.body;
		await changStatus("fail", "", id_contract);
		res.json({ success: true, message: "Success" });
	} catch (error) {
		console.log(error);
		return res.status(401).json({ success: false, message: "False" });
	}
};
const change = async (req, res) => {
	try {
		const { id_employee, id_contract } = req.body;
		await changStatus("change", id_employee, id_contract)
			.then((response) => {
				if (!response.status) {
					res.json({
						success: false,
						message: response.message,
					});
				} else {
					res.json({ success: true });
				}
			})
			.catch((err) => {
				console.log(err);
			});
	} catch (error) {
		console.log(error);
		return res.status(401).json({ success: false, message: "False" });
	}
};
const cancelContract = async (req, res) => {
	try {
		const { id_contract } = req.body;
		await changStatus("cancelContract", "", id_contract);
		res.json({ success: true, message: "Success" });
	} catch (error) {
		console.log(error);
		return res.status(401).json({ success: false, message: "False" });
	}
};
const splitFees = async (req, res) => {
	try {
		const { id_contract } = req.body;
		await changStatus("splitFees", "", id_contract);
		res.json({ success: true, message: "Success" });
	} catch (error) {
		console.log(error);
		return res.status(401).json({ success: false, message: "False" });
	}
};
const contractExpires = async (req, res) => {
	try {
		const { id_contract } = req.body;
		await changStatus("contractExpires", "", id_contract);
		res.json({ success: true, message: "Success" });
	} catch (error) {
		console.log(error);
		return res.status(401).json({ success: false, message: "False" });
	}
};
const getAll = async (req, res) => {
	await updateStatusContract();
	try {
		let contracts;
		/**
		 * Chỗ này nếu là admin thì sao?
		 */
		if (!(req.role == "admin")) {
			const authorization = req.authorization;
			let id_admin = await Users.findAll({
				where: {
					role: "admin",
				},
				attributes: ["id"],
			});
			id_admin = id_admin.map((item) => {
				return item.id;
			});
			contracts = await Contracts.findAndCountAll({
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
					["exchange_id", "DESC"],
					["id", "DESC"],
				],
			});
			if (!authorization.includes(7)) {
				contracts.filter((item) => {
					if (id_admin.includes(item.markBy)) {
						return false;
					}
				});
				if (!authorization.includes(8)) {
					contracts.filter((item) => {
						if (item.markBy == req.userId) {
							return false;
						}
					});
				} else if (!authorization.includes(9)) {
					contracts.filter((item) => {
						if (item.markBy != req.userId) {
							return false;
						}
					});
				}
				res.json({
					success: true,
					message: "Get all employees ok",
					employees,
				});
			}
		} else {
			contracts = await Contracts.findAndCountAll({
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
					["exchange_id", "DESC"],
					["id", "DESC"],
				],
			});
		}
		res.json({
			success: true,
			message: "Get all contracts ok",
			contracts,
		});
	} catch (error) {
		console.log(error);
		return res
			.status(401)
			.json({ success: false, message: "Get contracts false" });
	}
};

const getContract = async (req, res) => {
	try {
		if (!(req.role == "admin")) {
			const authorization = req.authorization;
			let id_admin = await Users.findAll({
				where: {
					role: "admin",
				},
				attributes: ["id"],
			});
			id_admin = id_admin.map((item) => {
				return item.id;
			});
			const id = req.params.id;
			const contract = await Contracts.findOne({
				include: [
					{
						model: Customers,
						as: "customer",
						// where: { id: Contracts.customer_id },
						// attributes: ["name", "phone", "status", "birthday", "country"],
					},
					{
						model: Employees,
						as: "employee",
						// where: { id: Contracts.employee_id },
						// attributes: ["name", "phone", "status"],
					},
				],
				where: { id },
			});
			if (!authorization.includes(7)) {
				if (id_admin.includes(contract.markBy)) {
					res.json({ success: false, message: "Get contract false" });
				}
				if (!authorization.includes(8)) {
					if (contract.markBy == req.userId) {
						res.json({
							success: false,
							message: "Get contract false",
						});
					}
				} else if (!authorization.includes(9)) {
					if (contract.markBy != req.userId) {
						res.json({
							success: false,
							message: "Get contract false",
						});
					}
				}
			}
		}
		res.json({ success: true, message: "Get contract ok", contract });
	} catch (error) {
		console.log(error);
		return res
			.status(401)
			.json({ success: false, message: "Get contract false" });
	}
};
const addContract = async (req, res) => {
	const authorization = req.authorization;
	if (!(req.role == "admin")) {
		if (!authorization.includes(17)) {
			res.json({
				success: false,
				message: "You can not add an contract",
			});
		}
	}
	const {
		id_customer,
		id_employee,
		fee_service,
		fee_vehicle,
		follow,
		trial_time,
		exchange_time_max,
		note,
		note_blacklist,
		country,
	} = req.body;

	if (exchange_time_max > 3 && req.role !== "admin") {
		if (!authorization.includes(20)) {
			return res.status(400).json({
				success: false,
				message:
					"Cần quyền admin để thay đổi số lần đổi người tối đa nhiều hơn 3!",
			});
		}
	}

	try {
		const checkAvai = await checkAvailable(id_employee);
		if (!checkAvai) {
			return res.status(400).json({
				success: false,
				message: "Lao động không có sẵn",
			});
		}
		const newContract = new Contracts({
			customer_id: id_customer,
			employee_id: id_employee,
			fee_service: fee_service || 0,
			fee_vehicle: fee_vehicle || 0,
			follow: follow || "month",
			trial_time: trial_time || 30,
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
		await changStatus("create", id_employee, "", id_customer);

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

	const id = req.params.id;
	const authorization = req.authorization;
	if (!(req.role == "admin")) {
		let id_admin = await Users.findAll({
			where: {
				role: "admin",
			},
			attributes: ["id"],
		});
		id_admin = id_admin.map((item) => {
			return item.id;
		});
		let contractTmp = await Contracts.findOne({
			where: {
				id,
			},
			attributes: ["markBy"],
		});
		contractTmp = contractTmp.markBy;
		if (!authorization.includes(16)) {
			if (id_admin.includes(contractTmp)) {
				res.json({ success: false, message: "You can not update" });
			}
			if (!authorization.includes(17)) {
				if (contractTmp == req.userId) {
					res.json({ success: false, message: "You can not update" });
				}
			} else if (!authorization.includes(18)) {
				if (contractTmp != req.userId) {
					res.json({ success: false, message: "You can not update" });
				}
			}
		}
		if (exchange_time_max > 3 && req.role !== "admin") {
			if (!authorization.includes(19)) {
				if (id_admin.includes(contractTmp)) {
					return res.status(400).json({
						success: false,
						message: "Role must be admin",
					});
				}
				if (!authorization.includes(20)) {
					if (contractTmp == req.userId) {
						return res.status(400).json({
							success: false,
							message: "Role must be admin",
						});
					}
				} else if (!authorization.includes(21)) {
					if (contractTmp != req.userId) {
						return res.status(400).json({
							success: false,
							message: "Role must be admin",
						});
					}
				}
			}
		}
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

const getAllContractByCustomer = async (req, res) => {
	const { id_customer } = req.params;
	try {
		const contracts = await Contracts.findAll({
			where: {
				customer_id: id_customer,
			},
		});
		if (!contracts)
			return res.status(401).json({
				success: false,
				message: "Contract not found",
			});
		res.json({
			success: true,
			message: "Contract found",
			contracts,
		});
	} catch (error) {
		console.log("error " + error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

/**
 * @param {number} id_customer
 * @description get id contract by customer
 */

const getIdContractByCustomer = async (req, res) => {
	const { id_customer } = req.params;
	try {
		const contract = await Contracts.findAll({
			where: {
				customer_id: id_customer,
			},
			attributes: ["id"],
		});
		if (!contract)
			return res.status(401).json({
				success: false,
				message: "Khách hàng chưa có hợp đồng",
			});
		res.json({
			success: true,
			message: "Tìm thấy hợp đồng",
			contract,
		});
	} catch (error) {
		console.log("error " + error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

const updateStatusContract = async () => {
	try {
		let currentDay = new Date();
		const contracts = await Contracts.findAll();
		contracts.forEach(async (contract) => {
			const {
				createdAt,
				trial_time,
				exchange_time,
				exchange_time_max,
				old_contract_id,
			} = contract;
			let date = new Date(createdAt);
			// count number day from createdAt to currentDay
			let time = Math.floor(
				(currentDay.getTime() - date.getTime()) / (1000 * 3600 * 24)
			);
			if (time > trial_time || exchange_time == exchange_time_max) {
				let updateContract = {
					status: "SuccessfulExpires",
				};
				await Contracts.update(updateContract, {
					where: {
						id: old_contract_id,
					},
				});
			}
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
	success,
	fail,
	change,
	cancelContract,
	splitFees,
	contractExpires,
	getAllContractByCustomer,
	getIdContractByCustomer,
};
