const multer = require("multer");
const multerStorage = multer.memoryStorage();
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const dir = path.join(__dirname, "../uploads");

const limits = 6 * 1024 * 1024;

const createFolder = (dir) => {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
};

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
// create folder follow year and month if not exist

const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("image")) {
		cb(null, true);
	} else {
		cb("Please upload only images.", false);
	}
};

const upload = multer({
	limits: limits,
	storage: multerStorage,
	fileFilter: multerFilter,
});

const uploadFiles = upload.any();

const uploadImages = (req, res, next) => {
	createFolder(dir + "/" + currentYear);
	createFolder(dir + "/" + currentYear + "/" + currentMonth);
	uploadFiles(req, res, (err) => {
		if (err instanceof multer.MulterError) {
			// A Multer error occurred when uploading.
			if (err.code === "LIMIT_UNEXPECTED_FILE") {
				// Too many images exceeding the allowed limit
				// ...
			}
		} else if (err) {
			// handle other errors
		}
		// Everything is ok.
		next();
	});
};

const deleteFiles = (files) => {
	return Promise.all(
		files.map(
			(filePath) =>
				new Promise((res, rej) => {
					try {
						fs.unlink("uploads/" + filePath, (err) => {
							if (err) throw err;
							console.log(`${filePath} was deleted`);
							res();
						});
					} catch (err) {
						console.error(err);
						return rej(err);
					}
				})
		)
	);
};

const optimizeImage = async (req, res, next) => {
	if (!req.files) return next();
	await Promise.all(
		req.files.map(async (file) => {
			const newFilename = `${Date.now()}_${file.originalname}`;
			file.path = `${currentYear}/${currentMonth}/${newFilename}`;
			await sharp(file.buffer)
				.resize()
				.webp({ quality: 80 })
				.toFile(
					path.join(
						dir,
						`/${currentYear}/${currentMonth}/${newFilename}`
					)
				);
		})
	);
	next();
};

module.exports = { upload, deleteFiles, optimizeImage, uploadImages };
