const bcrypt = require("bcrypt");
const { Users } = require("../models");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { checkExpired } = require("../middlewares/auth");
const generateAccessToken = (payload) =>
	jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: process.env.ACCESS_TOKEN_LIFE,
	});
const generateRefreshToken = (payload) =>
	jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: process.env.REFRESH_TOKEN_LIFE,
	});

const updateRefreshToken = async (user, refreshToken) => {
	let updateUser = {
		...user,
		refreshToken,
	};
	updateUser = await Users.update(updateUser, {
		where: { id: user.id },
	});
};

const checkUser = async (req, res) => {
	try {
		const user = await Users.findOne(
			{
				attributes: ["id", "username", "email", "role"],
			},
			{ where: { id: req.userId } }
		);
		if (!user)
			return res
				.status(400)
				.json({ success: false, message: "Users not found" });
		res.json({ success: true, user });
	} catch (error) {
		console.error(error.message);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

const register = async (req, res) => {
	const { username, password, email, role } = req.body;
	try {
		const checkUser = await Users.findOne({
			where: { [Op.or]: [{ username }, { email }] },
		});
		if (checkUser)
			return res
				.status(400)
				.json({ success: false, message: "User already exists" });
		else {
			const hashPassword = await bcrypt.hash(password, 10);

			const newUser = new Users({
				username,
				password: hashPassword,
				email,
				role: role || "member",
			});
			await newUser.save();

			const refreshToken = generateRefreshToken({
				userId: newUser.id,
				role: newUser.role,
			});
			let updateUser = {
				...newUser,
				refreshToken,
			};
			updateUser = await Users.update(updateUser, {
				where: { id: newUser.id },
			});
			const accessToken = generateAccessToken({
				userId: newUser.id,
				role: newUser.role,
			});

			res.json({
				success: true,
				message: "User created",
				accessToken,
				refreshToken,
			});
		}
	} catch (error) {
		console.log("Error register: " + error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

const login = async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await Users.findOne({ where: { username } });
		if (!user)
			return res
				.status(400)
				.json({ success: false, message: "Username is incorrect" });
		else {
			const passwordValid = await bcrypt.compare(password, user.password);
			if (!passwordValid)
				res.status(400).json({
					success: false,
					message: "Password is incorrect",
				});
			else {
				let refreshToken = user.refreshToken;
				if (user.refreshToken) {
					const checkExp = await checkExpired(
						jwt.decode(
							user.refreshToken,
							process.env.REFRESH_TOKEN_SECRET
						).exp
					);
					if (checkExp) {
						refreshToken = user.refreshToken;
					} else {
						refreshToken = generateRefreshToken({
							userId: user.id,
							role: user.role,
						});
						await updateRefreshToken(user, refreshToken);
					}
				} else {
					refreshToken = generateRefreshToken({
						userId: user.id,
						role: user.role,
					});
					await updateRefreshToken(user, refreshToken);
				}

				const accessToken = generateAccessToken({
					userId: user.id,
					role: user.role,
				});

				res.json({
					success: true,
					message: "Login successfully",
					accessToken,
					refreshToken,
				});
			}
		}
	} catch (error) {
		console.log("Error login: " + error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

const changePassword = async (req, res) => {
	const { passwordOld, passwordNew } = req.body;
	const id = req.userId;
	if (!passwordOld || !passwordNew)
		return res.status(400).json({
			success: false,
			message: "PasswordOld or PasswordNew is required",
		});

	const user = await Users.findOne({ where: { id } });
	if (!user)
		return res
			.status(400)
			.json({ success: false, message: "User invalid" });
	else {
		const passwordValid = await bcrypt.compare(passwordOld, user.password);
		if (!passwordValid)
			res.status(400).json({
				success: false,
				message: "Password is incorrect",
			});
		else {
			try {
				const hashPassword = await bcrypt.hash(passwordNew, 10);
				let updateUser = {
					...user,
					password: hashPassword,
				};
				updateUser = await Users.update(updateUser, {
					where: { id },
				});
				if (!updateUser)
					return res.status(401).json({
						success: false,
						message: "Change password failed",
					});
				res.json({
					success: true,
					message: "Change password successfully",
				});
			} catch (error) {
				console.log("error " + error);
				return res.status(500).json({
					success: false,
					message: "Internal server error",
				});
			}
		}
	}
};

const token = async (req, res) => {
	try {
		const accessToken = generateAccessToken({
			userId: req.userId,
			role: req.role,
		});
		res.json({ success: true, accessToken });
	} catch (error) {
		console.error(error.message);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

const logout = async (req, res) => {
	const id = req.userId;

	const user = await Users.findOne({ where: { id } });
	if (!user)
		return res
			.status(400)
			.json({ success: false, message: "User invalid" });
	else {
		try {
			let updateUser = {
				...user,
				refreshToken: null,
			};
			updateUser = await Users.update(updateUser, {
				where: { id },
			});
			if (updateUser)
				res.json({
					success: true,
					message: "Logout successfully",
				});
		} catch (error) {
			console.log("error " + error);
			return res.status(500).json({
				success: false,
				message: "Internal server error",
			});
		}
	}
};

module.exports = { checkUser, register, login, changePassword, token, logout };
