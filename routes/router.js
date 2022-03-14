const express = require("express");
const route = express.Router();
const authRouter = require("./auth");
const customerRouter = require("./customer");
const employeeRouter = require("./employee");
const contractRouter = require("./contract");
const companyRouter = require("./company");
const tagsRouter = require("./tags");
const incurredRouter = require("./incurred");

// test image route
const imagesRoute = require("./images");

route.use("/auth", authRouter);
route.use("/customer", customerRouter);
route.use("/employee", employeeRouter);
route.use("/contract", contractRouter);
route.use("/company", companyRouter);
// route.use("/upload", uploadRouter);
route.use("/tags", tagsRouter);
route.use("/incurred", incurredRouter);

route.use("/images", imagesRoute);

module.exports = route;
