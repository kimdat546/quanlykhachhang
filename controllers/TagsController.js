const { Tags } = require("../models");
const { Op } = require("sequelize");
const res = require("express/lib/response");

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
	if (existTag.list_tags.includes(tag)) {
		return true;
	}
	return false;
};

/**
 * @param {string} tag
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
				list_tags: [...list_tags.list_tags, tag],
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

module.exports = {
	addTag,
	getAllTagsByTagName,
};
