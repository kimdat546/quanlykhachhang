const express = require("express");
const route = express.Router();
const authRouter = require("./auth");

route.use("/auth", authRouter);

module.exports = route;
