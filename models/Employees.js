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
            phone: {
                type: DataTypes.STRING(12),
                allowNull: true,
                unique: true,
            },
            phoneChecked: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: true,
            },
            relation: {
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
                type: DataTypes.ENUM("male", "female", "another"),
                allowNull: true,
                defaultValue: "male",
            },
            avatar: {
                type: DataTypes.STRING,
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
                type: DataTypes.TEXT,
                allowNull: true,
            },
            blacklist: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false,
            },
			country: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: "Việt Nam",
			},
        },
        {
            tableName: "employees",
            timestamps: true,
        }
    );
    Employees.associate = (models) => {
        Employees.hasMany(models.ListPhones, {
            as: "ListPhones",
            foreignKey: "employee_id",
            onDelete: "CASCADE",
			onUpdate: "CASCADE",
        });
		Employees.hasMany(models.Contracts, {
		    as: "Contracts",
		    foreignKey: "employee_id",
		    onDelete: "NO ACTION",
		    onUpdate: "NO ACTION",
		});
    };
    return Employees;
};
