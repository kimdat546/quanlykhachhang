const express = require("express");
const route = express.Router();
const authRouter = require("./auth");
const customerRouter = require("./customer");
const employeeRouter = require("./employee");
const contractRouter = require("./contract");

route.use("/auth", authRouter);
route.use("/customer", customerRouter);
route.use("/employee", employeeRouter);
route.use("/contract", contractRouter);
// route.use("/upload", uploadRouter);

module.exports = route;
