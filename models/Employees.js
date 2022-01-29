module.exports = function (sequelize, DataTypes) {
    const Employees = sequelize.define(
        "Employees",
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
            listphone: {
                type: DataTypes.JSON,
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
            gender: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false,
            },
            avatar: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            address: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            ability_work: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            note: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            blacklist: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false,
            },
            ideti_file: {
                type: DataTypes.JSON,
                allowNull: true,
            },
        },
        {
            tableName: "employees",
            timestamps: false,
        }
    );
    // Employees.associate = (models) => {
    //     Employees.hasMany(models.Contracts, {
    //         as: "Contracts",
    //         foreignKey: "Customer_id",
    //         onDelete: "NO ACTION",
    //         onUpdate: "NO ACTION",
    //     });
    // };
    return Employees;
};
