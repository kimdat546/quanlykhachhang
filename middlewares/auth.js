const jwt = require("jsonwebtoken");
const { Users } = require("../models");

const checkExpired = (exp) => {
	const current_time = Date.now() / 1000;
	if (exp < current_time) {
		return false;
	}
	return true;
};

const checkAuthorization = async (auth, id) => {
	const user = await Users.findOne({
		where: {
			id: id,
		},
		attributes: ["authorization"],
	});
	// compare two array user.authorization and auth
	if (
		typeof user.authorization === "string" ||
		user.authorization instanceof String
	)
		user.authorization = user.authorization
			.replace(/[\[\]']+/g, "")
			.split(",");
	return (
		user.authorization.length === auth.length &&
		user.authorization.every((value, index) => value == auth[index])
	);
};

const generateAccessToken = (payload) =>
	jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: process.env.ACCESS_TOKEN_LIFE,
	});

const verifyToken = async (req, res, next) => {
	const authHeader = req.header("Authorization");
	const token = authHeader && authHeader.split(" ")[1];
	if (!token)
		return res
			.status(401)
			.json({ success: false, message: "Access token not found" });
	else {
		try {
			if (
				checkExpired(jwt.decode(token, process.env.ACCESS_TOKEN_SECRET))
					.exp
			) {
				return res
					.status(401)
					.json({ success: false, message: "Access token expired" });
			} else {
				const decode = jwt.verify(
					token,
					process.env.ACCESS_TOKEN_SECRET
				);
				req.userId = decode.userId;
				req.role = decode.role;
				req.authorization = decode.authorization;

				let check = await checkAuthorization(
					req.authorization,
					req.userId
				);
				next();
			}
		} catch (error) {
			console.log("error " + error);
			return res
				.status(403)
				.json({ success: false, message: "Invalid token" });
		}
	}
};
const verifyTokenSpecial = async (req, res, next) => {
	const authHeader = req.header("Authorization");
	const token = authHeader && authHeader.split(" ")[1];
	if (!token)
		return res
			.status(401)
			.json({ success: false, message: "Access token not found" });
	else {
		try {
			if (
				checkExpired(jwt.decode(token, process.env.ACCESS_TOKEN_SECRET))
					.exp
			) {
				return res
					.status(401)
					.json({ success: false, message: "Access token expired" });
			} else {
				const decode = jwt.verify(
					token,
					process.env.ACCESS_TOKEN_SECRET
				);
				req.userId = decode.userId;
				req.role = decode.role;
				req.authorization = decode.authorization;
				if (
					typeof req.authorization === "string" ||
					req.authorization instanceof String
				)
					req.authorization = req.authorization
						.replace(/[\[\]']+/g, "")
						.split(",");
				let check = await checkAuthorization(
					req.authorization,
					req.userId
				);
				if (!check) {
					const user = await Users.findOne({
						where: { id: req.userId },
						attributes: ["role", "authorization", "refreshToken"],
					});
					if (!user)
						return res.json({
							success: false,
							message: "User invalid",
						});
					const accessToken = generateAccessToken({
						userId: req.userId,
						role: user.role,
						authorization: user.authorization,
					});

					return res.status(403).json({
						success: true,
						accessToken,
						refreshToken: user.refreshToken,
					});
				}
				next();
			}
		} catch (error) {
			console.log("error " + error);
			return res.status(403).json({
				success: false,
				message: "Invalid token",
				error: decode,
			});
		}
	}
};
const verifyRefreshToken = (req, res, next) => {
	const authHeader = req.header("Authorization");
	const token = authHeader && authHeader.split(" ")[1];
	if (!token)
		return res
			.status(401)
			.json({ success: false, message: "Refresh token not found" });
	else {
		try {
			if (
				checkExpired(
					jwt.decode(token, process.env.REFRESH_TOKEN_SECRET)
				).exp
			) {
				return res
					.status(401)
					.json({ success: false, message: "Refresh token expired" });
			} else {
				const decode = jwt.verify(
					token,
					process.env.REFRESH_TOKEN_SECRET
				);
				req.userId = decode.userId;
				req.role = decode.role;
				req.authorization = decode.authorization;
				next();
			}
		} catch (error) {
			console.log("error " + error);
			return res
				.status(403)
				.json({ success: false, message: "Invalid token" });
		}
	}
};

module.exports = {
	verifyToken,
	verifyRefreshToken,
	checkExpired,
	verifyTokenSpecial,
};
