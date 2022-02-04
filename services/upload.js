const multer = require("multer");


const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, "./uploads/");
        },
        filename: function (req, file, callback) {
            callback(null, `${Date.now()}_${file.originalname}`);
        },
    }),
});
module.exports = upload;
