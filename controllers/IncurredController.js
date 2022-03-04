const { Incurred } = require("../models");
const { Op } = require("sequelize");

/**
 * @param {string} incurredName, incurredAmount, note
 * @returns {object}
 * @description create incurred
 */

const createIncurred = async (req, res) => {
	const { incurredName, incurredAmount, note } = req.body;
	try {
		await Incurred.create({
			incurredName,
			incurredAmount,
			note,
		});
		return res.json({
			success: true,
			message: "Thêm chi tiêu thành công",
		});
	} catch (error) {
		return res
			.status(401)
			.json({ success: false, message: "Thêm chi tiêu thất bại" });
	}
};

/**
 * @description get all incurred
 */

const getAllIncurred = async (req, res) => {
	try {
		const incurred = await Incurred.findAll({
			order: [["id", "DESC"]],
		});
		return res.json({
			success: true,
			data: incurred,
		});
	} catch (error) {
		return res
			.status(401)
			.json({ success: false, message: "Lấy chi tiêu thất bại" });
	}
};

/**
 * @param {string} id, incurredName, incurredAmount, note
 * @returns {object}
 * @description edit incurred by id
 */

const editIncurred = async (req, res) => {
	const { id } = req.params;
	const { incurredName, incurredAmount, note } = req.body;
	try {
		await Incurred.update(
			{
				incurredName,
				incurredAmount,
				note,
			},
			{
				where: {
					id: id,
				},
			}
		);
		return res.json({
			success: true,
			message: "Sửa chi tiêu thành công",
		});
	} catch (error) {
		return res
			.status(401)
			.json({ success: false, message: "Sửa chi tiêu thất bại" });
	}
};

/**
 * @param {string} id
 * @returns {object}
 * @description delete incurred by id
 */

const deleteIncurred = async (req, res) => {
	const { id } = req.params;
	try {
		await Incurred.destroy({
			where: {
				id: id,
			},
		});
		return res.json({
			success: true,
			message: "Xóa chi tiêu thành công",
		});
	} catch (error) {
		return res
			.status(401)
			.json({ success: false, message: "Xóa chi tiêu thất bại" });
	}
};

module.exports = {
	createIncurred,
	getAllIncurred,
	editIncurred,
	deleteIncurred,
};
