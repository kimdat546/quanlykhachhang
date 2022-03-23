const jwt = require("jsonwebtoken");

const checkExpired = (exp) => {
	const current_time = Date.now() / 1000;
	if (exp < current_time) {
		return false;
	}
	return true;
};

const verifyToken = (req, res, next) => {
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
				req.accessToken = token;
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

module.exports = { verifyToken, verifyRefreshToken, checkExpired };
