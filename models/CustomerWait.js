module.exports = function (sequelize, DataTypes) {
	const CustomerWait = sequelize.define(
		"CustomerWait",
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
		},
		{
			timestamps: true,
			paranoid: true,
			underscored: true,
			freezeTableName: true,
			tableName: "customer_wait",
		}
	);
	CustomerWait.associate = function (models) {
		CustomerWait.belongsTo(models.Customers, {
			foreignKey: "customerId",
			as: "customer",
		});
	};
	return CustomerWait;
};
