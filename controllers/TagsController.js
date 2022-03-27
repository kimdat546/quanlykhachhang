const { Tags } = require("../models");
const { Op } = require("sequelize");

/**
 * @param {string} tag
 * @returns {object}
 * @description check tag exist
 */
const checkTagExist = async (tag_name, tag) => {
	const existTag = await Tags.findOne({
		where: {
			tag_name: tag_name,
		},
	});
	if (existTag.list_tags && existTag.list_tags.includes(tag)) {
		return true;
	}
	return false;
};

/**
 * @param {string} tag, tag_name
 * @description add tag to list_tags and include old tag
 */
const addTag = async (req, res) => {
	const { tag, tag_name } = req.body;
	const existTag = await checkTagExist(tag_name, tag);
	if (existTag) {
		return res
			.status(401)
			.json({ success: false, message: "Thẻ đã tồn tại" });
	}
	try {
		const list_tags = await Tags.findOne({
			where: {
				tag_name: tag_name,
			},
		});

		await Tags.update(
			{
				list_tags: list_tags.list_tags
					? [...JSON.parse(list_tags.list_tags), tag]
					: [tag],
			},
			{
				where: {
					tag_name: tag_name,
				},
			}
		);
		return res.json({
			success: true,
			message: "Thêm thẻ thành công",
		});
	} catch (error) {
		return res
			.status(401)
			.json({ success: false, message: "Thêm thẻ thất bại" });
	}
};

/**
 * @description get all tags
 */
const getAllTags = async (req, res) => {
	try {
		const tags = await Tags.findAll();
		res.json({ success: true, message: "Get all tags ok", tags });
	} catch (error) {
		console.log(error);
		return res
			.status(401)
			.json({ success: false, message: "Get all tags false" });
	}
};
/**
 * @description get all tags by tag_name
 */
const getAllTagsByTagName = async (req, res) => {
	const { tag_name } = req.params;
	try {
		const tags = await Tags.findOne({
			where: {
				tag_name: tag_name,
			},
		});
		if (tags.list_tags) tags.list_tags = JSON.parse(tags.list_tags);
		res.json({ success: true, message: "Get all tags ok", tags });
	} catch (error) {
		console.log(error);
		return res
			.status(401)
			.json({ success: false, message: "Get all tags false" });
	}
};

/**
 * @param {string} tag, tag_name
 * @description delete tag from list_tags
 */

const deleteTag = async (req, res) => {
	const { tag, tag_name } = req.body;
	const existTag = await checkTagExist(tag_name, tag);
	if (existTag)
		try {
			const list_tags = await Tags.findOne({
				where: {
					tag_name: tag_name,
				},
			});
			const newListTags = [...JSON.parse(list_tags.list_tags)].filter(
				(item) => item !== tag
			);
			await Tags.update(
				{
					list_tags: newListTags,
				},
				{
					where: {
						tag_name: tag_name,
					},
				}
			);
			return res.json({
				success: true,
				message: "Xóa thẻ thành công",
			});
		} catch (error) {
			console.log(error);
			return res
				.status(401)
				.json({ success: false, message: "Xóa thẻ thất bại" });
		}
	return res.json({
		success: false,
		message: "Thẻ không tồn tại",
	});
};

/**
 * @param {string}  tag_name
 * @description delete all tags by tag_name
 */
const deleteAllTagsByTagName = async (req, res) => {
	const { tag_name } = req.body;
	try {
		const tags = await Tags.findOne({
			where: {
				tag_name: tag_name,
			},
		});
		if (tags.list_tags === null || tags.list_tags.length === 0) {
			return res.json({
				success: false,
				message: "Tag is empty",
			});
		}
		await Tags.update(
			{
				list_tags: null,
			},
			{
				where: {
					tag_name: tag_name,
				},
			}
		);
		return res.json({
			success: true,
			message: "Delete all tags ok",
		});
	} catch (error) {
		console.log(error);
		return res
			.status(401)
			.json({ success: false, message: "Delete all tags false" });
	}
};

module.exports = {
	addTag,
	getAllTags,
	getAllTagsByTagName,
	deleteTag,
	deleteAllTagsByTagName,
};
