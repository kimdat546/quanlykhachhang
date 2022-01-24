const argon2 = require("argon2");
const { Users } = require("../models");
const jwt = require("jsonwebtoken");

const checkuser = async (req, res) => {
    try {
        const user = await Users.findById(req.userId).select("-password");
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
        const checkuser = await Users.findOne({ where: { username } });
        const checkemail = await Users.findOne({ where: { email } });
        if (checkuser || checkemail)
            return res
                .status(400)
                .json({ success: false, message: "User already exists" });
        else {
            const hashpassword = await argon2.hash(password);
            const newUser = new Users({
                username,
                password: hashpassword,
                email,
                role: role || "member",
            });
            await newUser.save();
            const accessToken = jwt.sign(
                { userId: newUser.id, role: newUser.role },
                process.env.ACCESS_TOKEN_SECRET
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
        const user = await Users.findOne({ username });
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
                    process.env.ACCESS_TOKEN_SECRET
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

module.exports = { checkuser, register, login };
