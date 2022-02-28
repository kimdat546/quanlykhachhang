const express = require("express");
const route = express.Router();
const { verifyToken } = require("../middlewares/auth");
const TagsController = require("../controllers/TagsController");

/**
 * @param {string} tag, tag_name
 * @returns {object}
 * @description add tag to list_tags
 */
route.post("/add", verifyToken, TagsController.addTag);

/**
 * @returns {object}
 * @description get all tags
 */
route.get("/getAllTags", verifyToken, TagsController.getAllTags);

/**
 * @param {string} tag_name
 * @returns {object}
 * @description get all tags by tag_name
 */
route.get(
	"/getByTagName/:tag_name",
	verifyToken,
	TagsController.getAllTagsByTagName
);

/**
 * @param {string} tag, tag_name
 * @description delete tag from list_tags by tag_name
 */
route.post("/delete", verifyToken, TagsController.deleteTag);

/**
 * @param {string} tag_name
 * @description delete all tags by tag_name
 */
route.post("/deleteAll", verifyToken, TagsController.deleteAllTagsByTagName);

module.exports = route;
