module.exports = function (sequelize, DataTypes) {
	const Contracts = sequelize.define(
		"Contracts",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				allowNull: false,
				autoIncrement: true,
			},
			customer_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "Customers",
					key: "id",
				},
			},
			employee_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "Employees",
					key: "id",
				},
			},
			fee_service: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			fee_vehicle: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			follow: {
				type: DataTypes.ENUM(
					"month",
					"year",
					"week",
					"half_day",
					"hour"
				),
				allowNull: true,
				defaultValue: "month",
			},
			trial_time: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			exchange_time_max: {
				type: DataTypes.INTEGER(1),
				allowNull: true,
				defaultValue: 3,
			},
			exchange_time: {
				type: DataTypes.INTEGER(1),
				allowNull: true,
				defaultValue: 0,
			},
			note: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			status: {
				type: DataTypes.INTEGER(1),
				allowNull: true,
				defaultValue: 1,
			},
			exchange_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
		},
		{
			tableName: "contracts",
			timestamps: true,
		}
	);
	Contracts.associate = (models) => {
		Contracts.belongsTo(models.Customers, {
			as: "customer",
			foreignKey: "customer_id",
			onDelete: "NO ACTION",
			onUpdate: "NO ACTION",
		});
		Contracts.belongsTo(models.Employees, {
			as: "employee",
			foreignKey: "employee_id",
			onDelete: "NO ACTION",
			onUpdate: "NO ACTION",
		});
	};
	return Contracts;
};
