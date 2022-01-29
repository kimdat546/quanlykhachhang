const argon2 = require("argon2");
const { Users } = require("../models");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const checkUser = async (req, res) => {
    try {
        const user = await Users.findOne({ where: { id: req.userId } });
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
    if (!username || !password || !email)
        return res.status(400).json({
            success: false,
            message: "Username, Password or email is required",
        });
    try {
        const checkUser = await Users.findOne({
            where: { [Op.or]: [{ username }, { email }] },
        });
        if (checkUser)
            return res
                .status(400)
                .json({ success: false, message: "User already exists" });
        else {
            const hashPassword = await argon2.hash(password);
            const newUser = new Users({
                username,
                password: hashPassword,
                email,
                role: role || "member",
            });
            await newUser.save();
            const accessToken = jwt.sign(
                { userId: newUser.id, role: newUser.role },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: process.env.ACCESS_TOKEN_LIFE,
                }
            );
            res.json({ success: true, message: "User created", accessToken });
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
    if (!username || !password)
        return res.status(400).json({
            success: false,
            message: "Username or Password is required",
        });
    try {
        const user = await Users.findOne({ where: { username } });
        if (!user)
            return res
                .status(400)
                .json({ success: false, message: "Username is incorrect" });
        else {
            const passwordValid = await argon2.verify(user.password, password);
            if (!passwordValid)
                res.status(400).json({
                    success: false,
                    message: "Password is incorrect",
                });
            else {
                const accessToken = jwt.sign(
                    { userId: user.id, role: user.role },
                    process.env.ACCESS_TOKEN_SECRET,
                    {
                        expiresIn: process.env.ACCESS_TOKEN_LIFE,
                    }
                );
                res.json({
                    success: true,
                    message: "Login successfully",
                    accessToken,
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
        const passwordValid = await argon2.verify(user.password, passwordOld);
        if (!passwordValid)
            res.status(400).json({
                success: false,
                message: "Password is incorrect",
            });
        else {
            try {
                const hashPassword = await argon2.hash(passwordNew);
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

module.exports = { checkUser, register, login, changePassword };
