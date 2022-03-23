const { Employees } = require("../models");
const { Customers } = require("../models");
const { Users } = require("../models");
const { Op } = require("sequelize");
const { deleteFiles } = require("../services/upload");
const { formatDate } = require("../utils");

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

const getIdAdmin = async () => {
	const id_admin = await Users.findAll({
		where: {
			role: "admin",
		},
		attributes: ["id"],
	});
	return id_admin.map((item) => item.id);
};

const getMarkBy = async (id) => {
	let employeeTmp = await Employees.findOne({
		where: {
			id: id,
		},
		attributes: ["markBy"],
	});
	return employeeTmp.markBy;
};

const getPagination = (page, size) => {
	const limit = size ? +size : 10;
	const offset = page ? page * limit : 0;
	return { limit, offset };
};

const getAll = async (req, res) => {
	try {
		const { authorization } = req;
		console.log(authorization);
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
		let employees = await Employees.findAll({
			where: {
				need_work: {
					[Op.in]: [...need_work],
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
		if (!(req.role == "admin")) {
			if (!authorization.includes(1)) {
				employees = employees.filter(
					(item) => !id_admin.includes(item.markBy)
				);
				if (!authorization.includes(2)) {
					// nếu đúng thì loại bỏ những thông tin chính bản thân tự thêm vào
					employees = employees.filter(
						(item) => !(item.markBy == req.userId)
					);
				}
				if (!authorization.includes(3)) {
					// nếu đúng thì loại bỏ những thông tin người khác (ko phải admin) thêm vào
					employees = employees.filter(
						(item) => !(item.markBy != req.userId)
					);
				}
				if (employees.length == 0)
					// nếu đã loại bỏ 3 trường hợp trên thì rõ ràng không có quyền xem gì hết
					return res.status(401).json({
						success: false,
						message: "Bạn không có quyền truy cập",
						permission: false,
					});
				return res.json({
					success: true,
					message: "Get employees ok",
					employees,
				});
			}
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
		if (!(req.role == "admin")) {
			if (id_admin.includes(employee.markBy)) {
				res.json({
					success: false,
					message: "Get employee false",
					permission: false,
				});
				return;
			}
			if (authorization.includes(1)) {
				res.json({
					success: true,
					message: "Get employee ok",
					employee,
				});
				return;
			}
			if (!authorization.includes(2)) {
				if (employee.markBy == req.userId) {
					res.json({
						success: false,
						message: "Get employee false",
						permission: false,
					});
				}
			} else if (!authorization.includes(3)) {
				if (employee.markBy != req.userId) {
					res.json({
						success: false,
						message: "Get employee false",
						permission: false,
					});
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
	try {
		if (!(req.role == "admin")) {
			const authorization = req.authorization;
			if (!authorization.includes(11)) {
				res.json({
					success: false,
					message: "Bạn không có quyền thêm lao động",
					permission: false,
				});
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
			if (item.fieldname === "avatar") avatar = temp;
			if (item.fieldname === "identity_file") identity_file.push(temp);
		});

		const newEmployee = new Employees({
			name,
			phone: JSON.parse(phone).number || null,
			phoneChecked: JSON.parse(phone).checked || null,
			relation: JSON.parse(relation) || null,
			birthday: birthday || null,
			identification: { ...JSON.parse(identification), identity_file },
			gender: gender || "male",
			address: JSON.parse(address) || null,
			ability_work: (ability_work && JSON.parse(ability_work)) || null,
			need_work,
			note,
			blacklist: blacklist || false,
			note_blacklist,
			avatar,
			markBy: req.userId,
			location: JSON.parse(location) || null,
			create_date: formatDate(createDate),
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
	const { id } = req.params;
	const { authorization } = req;
	console.log(authorization);
	try {
		if (!(req.role == "admin")) {
			let idAdmin = await getIdAdmin();
			let markByTmp = await getMarkBy(id);
			if (!authorization.includes(10)) {
				if (idAdmin.includes(markByTmp)) {
					return res.json({
						success: false,
						message: "You can not update",
						permission: false,
					});
				}
			}
			if (!authorization.includes(11)) {
				if (markByTmp == req.userId) {
					return res.json({
						success: false,
						message: "You can not update",
						permission: false,
					});
				}
			}
			if (!authorization.includes(12)) {
				if (markByTmp != req.userId) {
					return res.json({
						success: false,
						message: "You can not update",
						permission: false,
					});
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
			list_file_old_remove,
			reason,
			update_employee_reason,
			update_employee_reason_other,
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
			if (item === null) return;
			let temp = item.path;
			if (item.fieldname === "avatar") avatar = temp;
			if (item.fieldname === "identity_file") identity_file.push(temp);
		});

		if (list_file_old_remove && list_file_old_remove.length > 0) {
			let files = await Employees.findOne({
				where: { id: req.params.id },
				attributes: ["identification"],
			});
			let files_old = JSON.parse(list_file_old_remove);
			deleteFiles(files_old);
			files_old.forEach((item) => {
				// remove file in database
				let index = files.identification.identity_file.indexOf(item);
				if (index > -1) {
					files.identification.identity_file.splice(index, 1);
				}
			});
			identity_file = [
				...files.identification.identity_file,
				...identity_file,
			];
		}
		const updateReason =
			update_employee_reason == "Khác"
				? {
						updateDate: Date.now(),
						update_employee_reason,
						update_employee_reason_other,
				  }
				: {
						updateDate: Date.now(),
						update_employee_reason,
				  };
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
			reason: !!reason
				? [...JSON.parse(reason), updateReason]
				: [updateReason],
		};
		updateEmployee = await Employees.update(updateEmployee, {
			where: { id: id },
		});

		if (!updateEmployee)
			return res.status(401).json({
				success: false,
				message: "Update employee failed",
			});
		res.json({ success: true, message: "Update employee successfully" });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

const deleteEmployee = async (req, res) => {
	const id = req.params.id;
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
		let employeeTmp = await Employees.findOne({
			where: {
				id,
			},
			attributes: ["markBy"],
		});
		employeeTmp = employeeTmp.markBy;
		if (!authorization.includes(10)) {
			if (id_admin.includes(employeeTmp)) {
				res.json({
					success: false,
					message: "You can not delete",
					permission: false,
				});
			}
			if (!authorization.includes(11)) {
				if (employeeTmp == req.userId) {
					res.json({
						success: false,
						message: "You can not delete",
						permission: false,
					});
				}
			} else if (!authorization.includes(12)) {
				if (employeeTmp != req.userId) {
					res.json({
						success: false,
						message: "You can not delete",
						permission: false,
					});
				}
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

const searchEmployee = async (req, res) => {
	const { searchContent } = req.params;

	try {
		const employees = await Employees.findAll({
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
					{
						address: {
							address_resident: {
								[Op.like]: `%${searchContent}%`,
							},
						},
					},
				],
			},
			order: [["id", "DESC"]],
		});
		if (!employees)
			return res.status(401).json({
				success: false,
				message: "Không tìm thấy khách hàng",
			});
		res.json({
			success: true,
			message: "Tìm thấy khách hàng",
			employees,
		});
	} catch (error) {
		console.log("error: " + error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

module.exports = {
	getAll,
	getEmployee,
	addEmployee,
	updateEmployee,
	deleteEmployee,
	getByHour,
	searchEmployee,
};
