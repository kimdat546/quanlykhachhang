const express = require("express");
const route = express.Router();
const { verifyToken } = require("../middlewares/auth");
const TagsController = require("../controllers/TagsController");

/**
 * @param {string} tag
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

module.exports = route;
