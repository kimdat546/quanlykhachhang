const express = require("express");
const route = express.Router();
const authRouter = require("./auth");
const customerRouter = require("./customer");

route.use("/auth", authRouter);
route.use("/customer", customerRouter);

module.exports = route;
