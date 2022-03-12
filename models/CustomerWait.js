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
				unique: true,
			},
			status: {
				/**
				 * waiting: Khách đợi
				 * promise: Hẹn ngày
				 * exchange: Đổi người
				 * again: Khách thuê lại
				 */
				type: DataTypes.ENUM("waiting", "promise", "exchange", "again"),
				allowNull: false,
				defaultValue: "waiting",
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
			foreignKey: "customer_id",
			as: "customer",
			onDelete: "NO ACTION",
		});
	};
	return CustomerWait;
};
