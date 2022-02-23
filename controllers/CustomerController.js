const { Customers } = require("../models");
const { ListPhones } = require("../models");
const Sequelize = require("sequelize");
const { deleteFiles } = require("../services/upload");

const checkPhoneExists = async (checkPhones) => {
	let existPhone = await ListPhones.findAll({
		where: {
			phone: {
				[Sequelize.Op.in]: checkPhones,
			},
		},
	});
	return existPhone;
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
			limit,
			offset,
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
		address,
		note,
		salary,
		follow,
		status,
		blacklist,
		note_blacklist,
		location,
	} = req.body;

	//check phones exist
	let checkPhones = [];
	checkPhones.push(JSON.parse(phone).number);
	// JSON.parse(relation).forEach((item) => checkPhones.push(item.phone));
	const existPhone = await checkPhoneExists(checkPhones);
	if (existPhone.length > 0) {
		return res.status(400).json({
			success: false,
			message: "Số điện thoại đã tồn tại",
			existPhone,
		});
	}

	let identity_file = [];
	req.files.forEach((item) => {
		if (item.fieldname === "identity_file") identity_file.push(item.path);
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
			address: JSON.parse(address) || null,
			note,
			salary: salary || 0,
			follow: follow || "month",
			status: status || "success",
			blacklist: blacklist || false,
			note_blacklist,
			markBy: req.userId,
			location: JSON.parse(location) || null,
		});
		await newCustomer.save();

		await ListPhones.bulkCreate(
			checkPhones.map((item) => {
				return { phone: item, customer_id: newCustomer.id };
			})
		);

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
	} = req.body;

	let identity_file = [];
	req.files.forEach((item) => {
		if (item.fieldname === "identity_file") identity_file.push(item.path);
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
			relation: JSON.parse(relation),
			work_type,
			work_detail,
			birthday,
			identification: { ...JSON.parse(identification), identity_file },
			address: JSON.parse(address),
			note,
			salary,
			follow,
			status,
			blacklist,
			note_blacklist,
			reason: reason
				? [...JSON.parse(reason), updateReason]
				: [updateReason],
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

module.exports = {
	getAll,
	getCustomer,
	addCustomer,
	updateCustomer,
	deleteCustomer,
};
