module.exports = function (sequelize, DataTypes) {
	const Company = sequelize.define(
		"Company",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				allowNull: false,
				autoIncrement: true,
			},
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
				type: DataTypes.STRING,
				allowNull: false,
			},
			phoneNumber: {
				type: DataTypes.STRING,
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
