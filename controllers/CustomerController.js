const { Customers } = require("../models");
const { CustomerWait } = require("../models");
const { Employees } = require("../models");
const { Op } = require("sequelize");
const { deleteFiles } = require("../services/upload");

const checkPhoneExists = async (checkPhones) => {
	const exitsPhoneEmployee = await Employees.findAll({
		where: {
			phone: checkPhones,
		},
	});
	let exitsPhoneCustomer = await Customers.findAll({
		where: {
			phone: checkPhones,
		},
	});
	return exitsPhoneEmployee || exitsPhoneCustomer;
};

const getPagination = (page, size) => {
	const limit = size ? +size : 10;
	const offset = page ? page * limit : 0;
	return { limit, offset };
};

const getAll = async (req, res) => {
	const { limit, offset } = getPagination(req.query.page, req.query.size);
	try {
		const work_type =
			req.role == "hourly"
				? "theo_gio"
				: req.role == "stay"
				? "o_lai"
				: [
						"o_lai",
						"theo_gio",
						"nuoi_de",
						"nuoi_benh",
						"tap_vu",
						"phu_quan",
						"ld_pho_thong",
						"khac",
				  ];
		const customers = await Customers.findAll({
			where: { work_type },
			order: [["id", "DESC"]],
		});
		customers.map(
			(customer) =>
				(customer.phone = {
					number: customer.phone,
					checked: customer.phoneChecked,
				})
		);
		res.json({ success: true, message: "Get all customers ok", customers });
	} catch (error) {
		console.log(error);
		return res
			.status(401)
			.json({ success: false, message: "Get customers false" });
	}
};

const getCustomer = async (req, res) => {
	try {
		const id = req.params.id;
		const customer = await Customers.findOne({ where: { id } });
		customer.phone = {
			number: customer.phone,
			checked: customer.phoneChecked,
		};
		res.json({ success: true, message: "Get customer ok", customer });
	} catch (error) {
		console.log(error);
		return res
			.status(401)
			.json({ success: false, message: "Get customer false" });
	}
};

const addCustomer = async (req, res) => {
	const {
		name,
		phone,
		relation,
		work_type,
		work_detail,
		birthday,
		identification,
		gender,
		address,
		note,
		salary,
		follow,
		status,
		blacklist,
		note_blacklist,
		location,
		createDate,
	} = req.body;

	//check phones exist
	let checkPhones = JSON.parse(phone).number;
	const existPhone = await checkPhoneExists(checkPhones);
	if (existPhone && existPhone.length !== 0) {
		return res.status(400).json({
			success: false,
			message: "Phone number already exists",
			existPhone,
		});
	}

	let avatar;
	let identity_file = [];
	req.files.forEach((item) => {
		// get path start with /uploads/ and include uploads
		let temp = item.path;
		temp = temp.split("\\uploads\\")[1];
		if (item.fieldname === "avatar") avatar = temp;
		if (item.fieldname === "identity_file") identity_file.push(temp);
	});
	try {
		const newCustomer = new Customers({
			name,
			phone: JSON.parse(phone).number || null,
			phoneChecked: JSON.parse(phone).checked || null,
			relation: JSON.parse(relation) || null,
			work_type: work_type || "theo_gio",
			work_detail,
			birthday,
			identification: { ...JSON.parse(identification), identity_file },
			gender,
			address: JSON.parse(address) || null,
			note,
			salary: salary || 0,
			follow: follow || "month",
			status: status,
			blacklist: blacklist || false,
			note_blacklist,
			avatar,
			markBy: req.userId,
			location: JSON.parse(location) || null,
			create_date: createDate,
		});
		await newCustomer.save();

		return res.json({
			success: true,
			message: "New customer successfully created",
			customer: newCustomer,
		});
	} catch (error) {
		console.log("error " + error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};
const updateCustomer = async (req, res) => {
	const {
		name,
		phone,
		relation,
		work_type,
		work_detail,
		birthday,
		identification,
		gender,
		address,
		note,
		salary,
		follow,
		status,
		blacklist,
		note_blacklist,
		reason,
		update_customer_reason,
		update_customer_reason_other,
		location,
		createDate,
	} = req.body;

	//check phones exist
	let checkPhones = JSON.parse(phone).number;
	let checkPhonesExists = await Customers.findOne({
		where: { id: req.params.id, phone: checkPhones },
	});
	if (!checkPhonesExists) {
		const existPhone = await checkPhoneExists(checkPhones);
		if (existPhone) {
			return res.status(400).json({
				success: false,
				message: "Phone number already exists",
				existPhone,
			});
		}
	}

	let avatar;
	let identity_file = [];
	req.files.forEach((item) => {
		let temp = item.path;
		temp = temp.split("\\uploads\\")[1];
		if (item.fieldname === "avatar") avatar = temp;
		if (item.fieldname === "identity_file") identity_file.push(temp);
	});

	try {
		const conditionUpdateCustomer = {
			id: req.params.id,
		};
		if (identity_file.length > 0) {
			let files = await Customers.findOne({
				where: { id: req.params.id },
				attributes: ["identification"],
			});
			deleteFiles(files.identification.identity_file);
		}
		const updateReason =
			update_customer_reason == "Khác"
				? {
						updateDate: Date.now(),
						update_customer_reason,
						update_customer_reason_other,
				  }
				: {
						updateDate: Date.now(),
						update_customer_reason,
				  };
		let updateCustomer = {
			name,
			phone: JSON.parse(phone).number,
			phoneChecked: JSON.parse(phone).checked,
			relation: relation ? JSON.parse(relation) : null,
			work_type,
			work_detail,
			birthday,
			identification:
				identity_file.length > 0
					? { ...JSON.parse(identification), identity_file }
					: JSON.parse(identification),
			gender,
			address: JSON.parse(address),
			note,
			salary,
			follow,
			status,
			blacklist,
			note_blacklist,
			avatar,
			reason: !!reason
				? [...JSON.parse(reason), updateReason]
				: [updateReason],
			location: JSON.parse(location),
			create_date: createDate,
		};
		updateCustomer = await Customers.update(updateCustomer, {
			where: conditionUpdateCustomer,
		});

		if (!updateCustomer)
			return res.status(401).json({
				success: false,
				message: "Update customer failed",
			});
		res.json({ success: true, message: "Update customer successfully" });
	} catch (error) {
		console.log("error " + error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

const deleteCustomer = async (req, res) => {
	try {
		const conditionDeleteCustomer = {
			id: req.params.id,
		};

		let files = await Customers.findOne({
			where: { id: req.params.id },
			attributes: ["identification"],
		});
		deleteFiles(files.identification.identity_file);

		const deleteCustomer = await Customers.destroy({
			where: conditionDeleteCustomer,
		});

		if (!deleteCustomer)
			return res.status(401).json({
				success: false,
				message: "Delete false",
			});
		res.json({
			success: true,
			message: "Delete ok",
			customer: deleteCustomer,
		});
	} catch (error) {
		console.log("error " + error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

/**
 * @param {string} searchContent
 * @returns {object}
 * @description search customer by name, phone, address
 */

const searchCustomer = async (req, res) => {
	const { searchContent } = req.params;
	try {
		const customers = await Customers.findAll({
			where: {
				[Op.or]: [
					{
						name: {
							[Op.like]: `%${searchContent}%`,
						},
					},
					{
						phone: {
							[Op.like]: `%${searchContent}%`,
						},
					},
					{
						address: {
							address_current: {
								[Op.like]: `%${searchContent}%`,
							},
						},
					},
				],
			},
		});
		if (!customers)
			return res.status(401).json({
				success: false,
				message: "Không tìm thấy khách hàng",
			});
		res.json({
			success: true,
			message: "Tìm thấy khách hàng",
			customers,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

const addCustomerToWaitingList = async (req, res) => {
	const { id } = req.params;
	const { status, note } = req.body;
	try {
		const customer = await Customers.findOne({
			where: { id: id },
		});
		if (!customer)
			return res.status(401).json({
				success: false,
				message: "Không tìm thấy khách hàng",
			});
		const customerWaitingList = await CustomerWait.findOne({
			where: { customer_id: id },
		});
		if (customerWaitingList) {
			return res.status(401).json({
				success: false,
				message: "Khách hàng đã có trong danh sách chờ",
			});
		}
		const waitingList = await CustomerWait.create({
			customer_id: id,
			status: status[0],
		});
		if (!waitingList)
			return res.status(401).json({
				success: false,
				message: "Không thêm được khách hàng vào danh sách chờ",
			});
		await Customers.update({ note }, { where: { id: id } });
		res.json({
			success: true,
			message: "Thêm khách hàng vào danh sách chờ thành công",
		});
	} catch (error) {
		console.log("error " + error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

const removeCustomerFromWaitingList = async (req, res) => {
	const { id } = req.params;
	console.log(id);
	try {
		const waitingList = await CustomerWait.destroy({
			where: {
				id: id,
			},
		});
		if (!waitingList)
			return res.status(401).json({
				success: false,
				message: "Không xóa được khách hàng khỏi danh sách chờ",
			});
		res.json({
			success: true,
			message: "Xóa khách hàng khỏi danh sách chờ thành công",
		});
	} catch (error) {
		console.log("error " + error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

const getListWaiting = (req, res) => {
	try {
		CustomerWait.findAll({
			include: [
				{
					model: Customers,
					as: "customer",
				},
			],
			order: [["id", "DESC"]],
		})
			.then((data) => {
				res.json({
					success: true,
					message: "Lấy danh sách chờ thành công",
					data,
				});
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({
					success: false,
					message: "Internal server error",
				});
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
	getCustomer,
	addCustomer,
	updateCustomer,
	deleteCustomer,
	searchCustomer,
	addCustomerToWaitingList,
	removeCustomerFromWaitingList,
	getListWaiting,
};
