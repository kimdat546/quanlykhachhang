const { Employees } = require("../models");

const getAll = async (req, res) => {
    try {
        const employees = await Employees.findAll();
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
        listphone,
        birthday,
        identification,
        gender,
        avatar,
        address,
        ability_work,
        note,
        blacklist,
        ideti_file,
    } = req.body;
    try {
        const newEmployee = {
            name,
            listphone,
            birthday: birthday || null,
            identification,
            gender: gender || false,
            avatar: req.files || null,
            address: JSON.parse(address) || null,
            ability_work,
            note,
            blacklist: blacklist || false,
            ideti_file,
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
        listphone,
        birthday,
        identification,
        gender,
        avatar,
        address,
        ability_work,
        note,
        blacklist,
        ideti_file,
    } = req.body;
    try {
        const conditionUpdateEmployee = {
            id: req.params.id,
        };
        let updateEmployee = {
            name,
            listphone,
            birthday: birthday || null,
            identification,
            gender: gender || false,
            avatar: req.files || null,
            address: JSON.parse(address) || null,
            ability_work,
            note,
            blacklist: blacklist || false,
            ideti_file,
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
