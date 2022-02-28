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
		return res.status(401).json({ success: false, message: "Tag exist" });
	}
	try {
		const list_tags = await Tags.findOne({
			where: {
				tag_name: tag_name,
			},
		});
		await Tags.update(
			{
				list_tags:
					list_tags.list_tags && list_tags.list_tags.length > 0
						? [...list_tags.list_tags, tag]
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
			message: "Add tag ok",
		});
	} catch (error) {
		console.log("error " + error);
		return res
			.status(401)
			.json({ success: false, message: "Add tag false" });
	}
};

/**
 * @description get all tags
 */
const getAllTagsByTagName = async (req, res) => {
	const { tag_name } = req.body;
	try {
		const tags = await Tags.findOne({
			where: {
				tag_name: tag_name,
			},
		});
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
			const newListTags = list_tags.list_tags.filter(
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
				message: "Delete tag ok",
			});
		} catch (error) {
			console.log(error);
			return res
				.status(401)
				.json({ success: false, message: "Delete tag false" });
		}
	return res.json({
		success: false,
		message: "Tag not exist",
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
	getAllTagsByTagName,
	deleteTag,
	deleteAllTagsByTagName,
};
