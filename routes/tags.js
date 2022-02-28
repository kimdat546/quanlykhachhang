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
 * @param {string} tag_name
 * @returns {object}
 * @description get all tags
 */
route.post("/getByTagName", verifyToken, TagsController.getAllTagsByTagName);

/**
 * @param {string} tag, tag_name
 * @description delete tag from list_tags
 */
route.post("/delete", verifyToken, TagsController.deleteTag);

/**
 * @param {string} tag_name
 * @description delete all tags by tag_name
 */
route.post("/deleteAll", verifyToken, TagsController.deleteAllTagsByTagName);

module.exports = route;
