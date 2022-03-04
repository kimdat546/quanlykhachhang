const express = require("express");
const route = express.Router();
const { verifyToken } = require("../middlewares/auth");
const IncurredController = require("../controllers/IncurredController");

/**
 * @description get all incurred
 */
route.get("/", verifyToken, IncurredController.getAllIncurred);

/**
 * @param {string} incurredName, incurredAmount, note
 * @returns {object}
 * @description create incurred
 */
route.post("/create", verifyToken, IncurredController.createIncurred);

/**
 * @param {string} id
 * @returns {object}
 * @description get incurred by id
 */

route.get("/getById/:id", verifyToken, IncurredController.getIncurredById);

/**
 * @param {string} id, incurredName, incurredAmount, note
 * @returns {object}
 * @description edit incurred by id
 */

route.put("/edit/:id", verifyToken, IncurredController.editIncurred);

/**
 * @param {string} id
 * @description delete incurred by id
 */

route.delete("/delete/:id", verifyToken, IncurredController.deleteIncurred);

module.exports = route;
