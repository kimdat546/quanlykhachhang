const express = require("express");
const route = express.Router();
const authRouter = require("./auth");
const customerRouter = require("./customer");
const employeeRouter = require("./employee");
const contractRouter = require("./contract");
const tagsRouter = require("./tags");

route.use("/auth", authRouter);
route.use("/customer", customerRouter);
route.use("/employee", employeeRouter);
route.use("/contract", contractRouter);
// route.use("/upload", uploadRouter);
route.use("/tags", tagsRouter);

module.exports = route;
