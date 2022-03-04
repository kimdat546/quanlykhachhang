module.exports = function (sequelize, DataTypes) {
	const Incurred = sequelize.define(
		"Incurred",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				allowNull: false,
				autoIncrement: true,
			},
			incurredName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			incurredAmount: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			note: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			tableName: "incurred",
			timestamps: true,
		}
	);

	return Incurred;
};
