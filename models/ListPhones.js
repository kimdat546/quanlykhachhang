const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
	const ListPhones = sequelize.define(
		"ListPhones",
		{
			phone: {
				type: DataTypes.STRING(12),
				primaryKey: true,
				allowNull: false,
			},
			customer_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: "Customers",
					key: "id",
				},
			},
			employee_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: "Employees",
					key: "id",
				},
			},
		},
		{
			tableName: "listphones",
			timestamps: false,
		}
	);
	ListPhones.associate = (models) => {
		ListPhones.belongsTo(models.Customers, {
			as: "customerId_customer",
			foreignKey: "customer_id",
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		});
		ListPhones.belongsTo(models.Employees, {
			as: "employeeId_employee",
			foreignKey: "employee_id",
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		});
	};
	return ListPhones;
};
