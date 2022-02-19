const { Employees } = require("../models");
const { ListPhones } = require("../models");
const Sequelize = require("sequelize");

const checkPhoneExists = async (checkPhones) => {
	let exitsPhone = await ListPhones.findAll({
		where: {
			phone: {
				[Sequelize.Op.in]: checkPhones,
			},
		},
	});
	return exitsPhone;
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
				? ["theo_gio"]
				: req.role == "stay"
				? ["o_lai"]
				: ["o_lai", "theo_gio"];
		const employees = await Employees.findAll({
			limit,
			offset,
			where: {
				work_type: {
					[Op.in]: [...work_type],
				},
			},
			order: [["id", "DESC"]],
		});
		employees.map(
			(employee) =>
				(employee.phone = {
					number: employee.phone,
					checked: employee.phoneChecked,
				})
		);
		res.json({ success: true, message: "Get all employees ok", employees });
	} catch (error) {
		console.log(error);
		return res
			.status(401)
			.json({ success: false, message: "Get employees false" });
	}
};

const getEmployee = async (req, res) => {
	try {
		const id = req.params.id;
		const employee = await Employees.findOne({ where: { id } });
		employee.phone = {
			number: employee.phone,
			checked: employee.phoneChecked,
		};
		res.json({ success: true, message: "Get employee ok", employee });
	} catch (error) {
		console.log(error);
		return res
			.status(401)
			.json({ success: false, message: "Get employee false" });
	}
};

const addEmployee = async (req, res) => {
	const {
		name,
		phone,
		relation,
		birthday,
		identification,
		gender,
		address,
		ability_work,
		need_work,
		note,
		blacklist,
		note_blacklist,
	} = req.body;

	//check phones exist
	let checkPhones = [];
	checkPhones.push(JSON.parse(phone).number);
	// JSON.parse(relation).forEach((item) => checkPhones.push(item.phone));
	const existPhone = await checkPhoneExists(checkPhones);
	if (existPhone.length > 0) {
		return res.status(400).json({
			success: false,
			message: "Phone number already exists",
			existPhone,
		});
	}

	let avatar;
	let identity_file = [];
	req.files.forEach((item) => {
		if (item.fieldname === "avatar") avatar = item.path;
		if (item.fieldname === "identity_file") identity_file.push(item.path);
	});

	try {
		const newEmployee = new Employees({
			name,
			phone: JSON.parse(phone).number || null,
			phoneChecked: JSON.parse(phone).checked || null,
			relation: JSON.parse(relation) || null,
			birthday: birthday || null,
			identification: { ...JSON.parse(identification), identity_file },
			gender: gender || "male",
			address: JSON.parse(address) || null,
			ability_work: JSON.parse(ability_work) || null,
			need_work,
			note,
			blacklist: blacklist || false,
			note_blacklist,
			avatar,
			markBy: req.userId,
		});
		await newEmployee.save();

		await ListPhones.bulkCreate(
			checkPhones.map((item) => {
				return { phone: item, employee_id: newEmployee.id };
			})
		);

		return res.json({
			success: true,
			message: "New employee successfully created",
			employee: newEmployee,
		});
	} catch (error) {
		console.log("error " + error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};
const updateEmployee = async (req, res) => {
	const {
		name,
		phone,
		relation,
		birthday,
		identification,
		gender,
		address,
		ability_work,
		need_work,
		note,
		blacklist,
		note_blacklist,
	} = req.body;
	try {
		const conditionUpdateEmployee = {
			id: req.params.id,
		};
		let updateEmployee = {
			name,
			phone: JSON.parse(phone).number,
			phoneChecked: JSON.parse(phone).checked,
			relation: JSON.parse(relation),
			birthday,
			identification: { ...JSON.parse(identification) },
			gender,
			address: JSON.parse(address),
			ability_work: JSON.parse(ability_work),
			need_work,
			note,
			blacklist,
			note_blacklist,
			// avatar,
		};
		updateEmployee = await Employees.update(updateEmployee, {
			where: conditionUpdateEmployee,
		});

		if (!updateEmployee)
			return res.status(401).json({
				success: false,
				message: "Update employee failed",
			});
		res.json({ success: true, message: "Update employee successfully" });
	} catch (error) {
		console.log("error " + error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

const deleteEmployee = async (req, res) => {
	try {
		const conditionDeleteEmployee = {
			id: req.params.id,
		};

		const deleteEmployee = await Employees.destroy({
			where: conditionDeleteEmployee,
		});

		if (!deleteEmployee)
			return res.status(401).json({
				success: false,
				message: "Delete false",
			});
		res.json({
			success: true,
			message: "Delete ok",
			employee: deleteEmployee,
		});
	} catch (error) {
		console.log("error " + error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

const getByHour = async (req, res) => {
	try {
		const employee = await Employees.findAll({
			where: {
				need_work: "theo_gio",
			},
		});
		res.json({
			success: true,
			message: "Get employee by hour ok",
			employee,
		});
	} catch (error) {
		return res
			.status(401)
			.json({ success: false, message: "Get employee by hour false" });
	}
};

module.exports = {
	getAll,
	getEmployee,
	addEmployee,
	updateEmployee,
	deleteEmployee,
	getByHour,
};
