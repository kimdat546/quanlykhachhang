module.exports = function (sequelize, DataTypes) {
	const Company = sequelize.define(
		"Company",
		{
			companyName: {
				type: DataTypes.STRING,
				primaryKey: true,
				allowNull: false,
			},
			companyAddress: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			feeVehicle: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			taxCode: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			tableName: "company",
			timestamps: true,
		}
	);

	return Company;
};
