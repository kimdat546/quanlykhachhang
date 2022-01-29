module.exports = function (sequelize, DataTypes) {
    const Customers = sequelize.define(
        "Customers",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING(12),
                allowNull: true,
            },
            check_phone: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: true,
            },
            relation: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            work_type: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            work_detail: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            birthday: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            identification: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            address: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            note: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            salary: {
                type: DataTypes.DECIMAL(10, 0),
                allowNull: true,
                defaultValue: 0,
            },
            follow: {
                type: DataTypes.ENUM(
                    "month",
                    "year",
                    "week",
                ),
                allowNull: true,
                defaultValue: "month",
            },
            status: {
                type: DataTypes.ENUM(
                    "success",
                ),
                allowNull: true,
                defaultValue: "success",
            },
            blacklist: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false,
            },
        },
        {
            tableName: "customers",
            timestamps: false,
        }
    );
    // Customers.associate = (models) => {
    //     Customers.hasMany(models.Contracts, {
    //         as: "Contracts",
    //         foreignKey: "Customer_id",
    //         onDelete: "NO ACTION",
    //         onUpdate: "NO ACTION",
    //     });
    // };
    return Customers;
};
