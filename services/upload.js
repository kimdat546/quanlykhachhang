const multer = require("multer");
const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "../uploads");

const createFolder = (dir) => {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
};

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
createFolder(path.join(dir, `../uploads/${currentYear}`));
createFolder(path.join(dir, `../uploads/${currentYear}/${currentMonth}`));

const upload = multer({
	storage: multer.diskStorage({
		destination: function (req, file, callback) {
			callback(null, `./uploads/${currentYear}/${currentMonth}`);
		},
		filename: function (req, file, callback) {
			callback(null, `${Date.now()}_${file.originalname}`);
		},
	}),
});
module.exports = upload;
