const { Employees } = require("../models");
const { Customers } = require("../models");
const { ListPhones } = require("../models");
const { Users } = require("../models");
const Sequelize = require("sequelize");

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
		const need_work =
			req.role == "hourly"
				? ["theo_gio"]
				: req.role == "stay"
				? ["o_lai"]
				: ["o_lai", "theo_gio"];
		const employees = await Employees.findAll({
			limit,
			offset,
			where: {
				need_work: {
					[Sequelize.Op.in]: [...need_work],
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
		if (!authorization.includes(1)) {
			employees.filter((item) => {
				if (id_admin.includes(item.markBy)) {
					return false;
				}
			});
			if (!authorization.includes(2)) {
				employees.filter((item) => {
					if (item.markBy == req.userId) {
						return false;
					}
				});
			} else if (!authorization.includes(3)) {
				employees.filter((item) => {
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
		const employee = await Employees.findOne({ where: { id } });
		employee.phone = {
			number: employee.phone,
			checked: employee.phoneChecked,
		};
		if (!authorization.includes(1)) {
			if (id_admin.includes(employee.markBy)) {
				res.json({ success: false, message: "Get employee false" });
			}
			if (!authorization.includes(2)) {
				if (employee.markBy == req.userId) {
					res.json({ success: false, message: "Get employee false" });
				}
			} else if (!authorization.includes(3)) {
				if (employee.markBy != req.userId) {
					res.json({ success: false, message: "Get employee false" });
				}
			}
		}
		res.json({ success: true, message: "Get employee ok", employee });
	} catch (error) {
		console.log(error);
		return res
			.status(401)
			.json({ success: false, message: "Get employee false" });
	}
};

const addEmployee = async (req, res) => {
	const authorization = req.authorization;
	if (!authorization.includes(11)) {
		res.json({ success: false, message: "You can not add an employee" });
	}
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
		location,
		createDate,
	} = req.body;

	//check phones exist
	let checkPhones = JSON.parse(phone).number;
	const existPhone = await checkPhoneExists(checkPhones);
	if (existPhone && existPhone.length !== 0) {
		return res.status(400).json({
			success: false,
			message: "Số điện thoại đã tồn tại",
			existPhone,
		});
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
			location: JSON.parse(location) || null,
			create_date: createDate,
		});
		await newEmployee.save();

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
	let employeeTmp = await Employees.findOne({
		where: {
			id,
		},
		attributes: ["markBy"],
	});
	employeeTmp = employeeTmp.markBy;
	if (!authorization.includes(10)) {
		if (id_admin.includes(employeeTmp)) {
			res.json({ success: false, message: "You can not update" });
		}
		if (!authorization.includes(11)) {
			if (employeeTmp == req.userId) {
				res.json({ success: false, message: "You can not update" });
			}
		} else if (!authorization.includes(12)) {
			if (employeeTmp != req.userId) {
				res.json({ success: false, message: "You can not update" });
			}
		}
	}

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
		location,
		createDate,
	} = req.body;

	//check phones exist
	let checkPhones = JSON.parse(phone).number;
	let checkPhonesExists = await Employees.findOne({
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
		const conditionUpdateEmployee = {
			id: req.params.id,
		};
		if (identity_file.length > 0) {
			let files = await Employees.findOne({
				where: { id: req.params.id },
				attributes: ["identification"],
			});
			deleteFiles(files.identification.identity_file);
		}
		let updateEmployee = {
			name,
			phone: JSON.parse(phone).number,
			phoneChecked: JSON.parse(phone).checked,
			relation: JSON.parse(relation),
			birthday,
			identification: { ...JSON.parse(identification), identity_file },
			gender,
			address: JSON.parse(address),
			ability_work: JSON.parse(ability_work),
			need_work,
			note,
			blacklist,
			note_blacklist,
			avatar,
			location: JSON.parse(location),
			create_date: createDate,
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
	let employeeTmp = await Employees.findOne({
		where: {
			id,
		},
		attributes: ["markBy"],
	});
	employeeTmp = employeeTmp.markBy;
	if (!authorization.includes(10)) {
		if (id_admin.includes(employeeTmp)) {
			res.json({ success: false, message: "You can not delete" });
		}
		if (!authorization.includes(11)) {
			if (employeeTmp == req.userId) {
				res.json({ success: false, message: "You can not delete" });
			}
		} else if (!authorization.includes(12)) {
			if (employeeTmp != req.userId) {
				res.json({ success: false, message: "You can not delete" });
			}
		}
	}

	try {
		const conditionDeleteEmployee = {
			id: req.params.id,
		};

		let files = await Employees.findOne({
			where: { id: req.params.id },
			attributes: ["identification"],
		});
		deleteFiles(files.identification.identity_file);

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

/**
 * @description Check if the destination coordinates are in the customer's area
 */

const arePointsNear = (checkPoint, centerPoint, km) => {
	var ky = 40000 / 360;
	var kx = Math.cos((Math.PI * centerPoint.lat) / 180.0) * ky;
	var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
	var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
	return Math.sqrt(dx * dx + dy * dy);
};

/**
 * @description get all employee in area and work type is by hour
 */

const getByHour = async (req, res) => {
	if (req.role == "stay") {
		res.json({ success: false, message: "Your role is stay" });
	}

	const latCus = req.body.lat;
	const lngCus = req.body.lng;
	try {
		const employee = await Employees.findAll({
			where: {
				need_work: "theo_gio",
			},
		});
		let result = [];
		employee.forEach(async (item) => {
			const { location } = item;
			if (location) {
				const { lat, lng } = location;
				if (
					arePointsNear({ lat, lng }, { lat: latCus, lng: lngCus }, 1)
				) {
					result.push(item);
				}
			}
		});
		res.json({
			success: true,
			message: "Get employee by hour ok",
			employee: result,
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
