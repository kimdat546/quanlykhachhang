const { Employees } = require("../models");

const getAll = async (req, res) => {
    try {
        const employees = await Employees.findAll();
        employees.map(
            (employee) =>
                (employee.phone = {
                    number: employee.phone,
                    checked: employee.phoneChecked,
                })
        );
        res.json({ success: true, message: "Get all employees ok", employees });
    } catch (error) {
        console.log(error);
        return res
            .status(401)
            .json({ success: false, message: "Get employees false" });
    }
};

const getEmployee = async (req, res) => {
    try {
        const id = req.params.id;
        const employee = await Employees.findOne({ where: { id } });
        employee.phone = {
            number: employee.phone,
            checked: employee.phoneChecked,
        };
        res.json({ success: true, message: "Get employee ok", employee });
    } catch (error) {
        console.log(error);
        return res
            .status(401)
            .json({ success: false, message: "Get employee false" });
    }
};

const addEmployee = async (req, res) => {
    const {
        name,
        phone,
        relation,
        birthday,
        identification,
        gender,
        address,
        ability_work,
        note,
        blacklist,
    } = req.body;
    let avatar;
    let identity_file = [];
    req.files.forEach((item) => {
        if (item.fieldname === "avatar") avatar = item.path;
        if (item.fieldname === "identity_file") identity_file.push(item.path);
    });
    try {
        const newEmployee = {
            name,
            phone: JSON.parse(phone).number,
            phoneChecked: JSON.parse(phone).checked,
            relation: JSON.parse(relation),
            birthday: birthday || null,
            identification: { ...JSON.parse(identification), identity_file },
            gender: gender || "male",
            address: JSON.parse(address) || null,
            ability_work: JSON.parse(ability_work),
            note,
            blacklist: blacklist || false,
            avatar,
        };
        await Employees.create(newEmployee);
        return res.json({
            success: true,
            message: "New employee successfully created",
            employee: newEmployee,
        });
    } catch (error) {
        console.log("error " + error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};
const updateEmployee = async (req, res) => {
    const {
        name,
        phone,
        relation,
        birthday,
        identification,
        gender,
        address,
        ability_work,
        note,
        blacklist,
    } = req.body;
    try {
        const conditionUpdateEmployee = {
            id: req.params.id,
        };
        let updateEmployee = {
            name,
            phone: JSON.parse(phone).number,
            phoneChecked: JSON.parse(phone).checked,
            relation: JSON.parse(relation),
            birthday,
            identification: { ...JSON.parse(identification), identity_file },
            gender,
            address: JSON.parse(address),
            ability_work: JSON.parse(ability_work),
            note,
            blacklist,
            avatar,
        };
        updateEmployee = await Employees.update(updateEmployee, {
            where: conditionUpdateEmployee,
        });

        if (!updateEmployee)
            return res.status(401).json({
                success: false,
                message: "Update employee failed",
            });
        res.json({ success: true, message: "Update employee successfully" });
    } catch (error) {
        console.log("error " + error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const conditionDeleteEmployee = {
            id: req.params.id,
        };

        const deleteEmployee = await Employees.destroy({
            where: conditionDeleteEmployee,
        });

        if (!deleteEmployee)
            return res.status(401).json({
                success: false,
                message: "Delete false",
            });
        res.json({
            success: true,
            message: "Delete ok",
            employee: deleteEmployee,
        });
    } catch (error) {
        console.log("error " + error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    getAll,
    getEmployee,
    addEmployee,
    updateEmployee,
    deleteEmployee,
};
