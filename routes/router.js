const express = require("express");
const route = express.Router();
const authRouter = require("./auth");
const customerRouter = require("./customer");
const employeeRouter = require("./employee");

route.use("/auth", authRouter);
route.use("/customer", customerRouter);
route.use("/employee", employeeRouter);

module.exports = route;
