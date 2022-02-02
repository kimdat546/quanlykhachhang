const express = require("express");
const route = express.Router();
const verifyToken = require("../middlewares/auth");
const EmployeeController = require("../controllers/EmployeeController");
const { validate } = require("../services/validator");
const { body } = require("express-validator");
const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
      console.log(file);
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  }),
});


route.use(express.json());
route.use(express.urlencoded({ extended: true }));
// route.use(formidable());

const validateEmployee = [
  body("name", "Invalid name").not().isEmpty(),
  // body("phone", "Invalid phone").isMobilePhone("vi-VN"),
];

//@route GET api/employee
//@get all employee
route.get("/", verifyToken, EmployeeController.getAll);

//@ route GET api/employee/id
//@get employee with id
route.get("/:id", verifyToken, EmployeeController.getEmployee);

//@ route POST api/employee/add
route.post(
  "/add",
  upload.single("avatar"),
  // upload.array("ideti_file", 12),
  EmployeeController.addEmployee
);

//@ route PUT api/employee/edit/id
route.put(
  "/edit/:id",
  verifyToken,
  validate(validateEmployee),
  EmployeeController.updateEmployee
);

//@ route DELETE api/employee/delete/id
route.delete("/delete/:id", verifyToken, EmployeeController.deleteEmployee);

module.exports = route;
