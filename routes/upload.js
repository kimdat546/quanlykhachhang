const express = require("express");
const route = express.Router();
const { verifyToken } = require("../middlewares/auth");
const path = require("path");
const dir = path.join(__dirname, "../");

route.get("/", verifyToken, (req, res) => {
	try {
		const { pathFile } = req.body;
		res.sendFile(path.join(dir, pathFile));
	} catch (error) {
		console.log("error " + error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
});

module.exports = route;
