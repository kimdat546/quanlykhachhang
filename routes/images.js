const express = require("express");
const route = express.Router();
const fs = require("fs");
const readFile = fs.readFileSync;
var path = require("path");
const { verifyToken } = require("../middlewares/auth");

route.post("", verifyToken, async (req, res) => {
	const { listImage } = req.body;
	const files = listImage.map(function (filename) {
		filepath = path.join(__dirname, "../uploads") + "/" + filename;
		if (fs.existsSync(filepath)) {
			return {
				filename: filename,
				file: readFile(filepath),
			};
		}
	});

	Promise.all(files)
		.then((fileNames) => {
			res.json(fileNames);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

module.exports = route;
