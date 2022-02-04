const { Customers } = require("../models");

const getAll = async (req, res) => {
    try {
        const customers = await Customers.findAll();
        res.json({ success: true, message: "Get all customers ok", customers });
    } catch (error) {
        console.log(error);
        return res
            .status(401)
            .json({ success: false, message: "Get customers false" });
    }
};

const getCustomer = async (req, res) => {
    try {
        const id = req.params.id;
        const customer = await Customers.findOne({ where: { id } });
        res.json({ success: true, message: "Get customer ok", customer });
    } catch (error) {
        console.log(error);
        return res
            .status(401)
            .json({ success: false, message: "Get customer false" });
    }
};

const addCustomer = async (req, res) => {
    const {
        name,
        phone,
        relation,
        work_type,
        work_detail,
        birthday,
        identification,
        address,
        note,
        salary,
        follow,
        status,
        blacklist,
        gender,
        avatar,
    } = req.body;
    // console.log({
    //     name,
    //     phone,
    //     relation,
    //     work_type:work_type[0],
    //     work_detail,
    //     birthday,
    //     identification,
    //     address,
    //     note,
    //     salary,
    //     follow,
    //     status,
    //     blacklist,
    //     gender,
    //     avatar,
    // });
    console.log(req.files);
    try {
        const newCustomer = {
            name,
            phone,
            relation,
            work_type: work_type[0] || "theo_gio",
            work_detail,
            birthday,
            identification,
            address,
            note,
            salary: salary || 0,
            follow: follow[0] || "month",
            status: status[0] || "success",
            blacklist,
            gender: gender || "male",
        };
        await Customers.create(newCustomer);
        return res.json({
            success: true,
            message: "New customer successfully created",
            customer: newCustomer,
        });
    } catch (error) {
        console.log("error " + error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};
const updateCustomer = async (req, res) => {
    const {
        name,
        phone,
        check_phone,
        relation,
        work_type,
        work_detail,
        birthday,
        identification,
        address,
        note,
        salary,
        follow,
        status,
        blacklist,
    } = req.body;
    try {
        const conditionUpdateCustomer = {
            id: req.params.id,
        };
        let updateCustomer = {
            name,
            phone,
            check_phone,
            relation,
            work_type,
            work_detail,
            birthday,
            identification,
            address,
            note,
            salary,
            follow,
            status,
            blacklist,
        };
        updateCustomer = await Customers.update(updateCustomer, {
            where: conditionUpdateCustomer,
        });

        if (!updateCustomer)
            return res.status(401).json({
                success: false,
                message: "Update customer failed",
            });
        res.json({ success: true, message: "Update customer successfully" });
    } catch (error) {
        console.log("error " + error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const conditionDeleteCustomer = {
            id: req.params.id,
        };

        const deleteCustomer = await Customers.destroy({
            where: conditionDeleteCustomer,
        });

        if (!deleteCustomer)
            return res.status(401).json({
                success: false,
                message: "Delete false",
            });
        res.json({
            success: true,
            message: "Delete ok",
            customer: deleteCustomer,
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
    getCustomer,
    addCustomer,
    updateCustomer,
    deleteCustomer,
};
