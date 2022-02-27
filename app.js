const path = require("path");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const rfs = require("rotating-file-stream");
const connectDB = require("./test/connectDB");
const db = require("./models");
const dotenv = require("dotenv");
var fs = require("fs");
const { verifyToken } = require("./middlewares/auth");
dotenv.config();

const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

const app = express();

const accessLog = rfs.createStream("access.log", {
	interval: "1d",
	path: path.join(__dirname, "logs"),
});

app.use(
	isProduction ? morgan("combined", { stream: accessLog }) : morgan("dev")
);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dir = path.join(__dirname, "uploads");
app.use("/uploads", verifyToken, express.static(dir));

connectDB();
// db.sequelize.sync().then(() => {
//     console.log("Connect db ok");
// });

const router = require("./routes/router");
app.use("/api", router);
app.get("/", (req, res) => {
	res.json({
		message: "Page not found",
	});
});
// app.get("*", (req, res) => {
// 	res.json({
// 		message: "Page not found",
// 	});
// });

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
