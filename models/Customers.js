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
			work_type: {
				type: DataTypes.ENUM(
					"o_lai",
					"theo_gio",
					"nuoi_de",
					"nuoi_benh",
					"tap_vu",
					"phu_quan",
					"ld_pho_thong",
					"khac"
				),
				allowNull: true,
				defaultValue: "theo_gio",
			},
			work_detail: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			birthday: {
				type: DataTypes.STRING(50),
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
				type: DataTypes.TEXT,
				allowNull: true,
			},
			salary: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: 0,
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
			status: {
				type: DataTypes.ENUM("success", "fail"),
				allowNull: true,
				defaultValue: "success",
			},
			blacklist: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: false,
			},
			note_blacklist: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			country: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: "Việt Nam",
			},
			reason: {
				type: DataTypes.JSON,
				allowNull: true,
			},
			markBy: {
                type: DataTypes.UUID,
				allowNull: true,
			},
			location: {
                type: DataTypes.JSON,
				allowNull: true,
			},
		},
		{
			tableName: "customers",
			timestamps: true,
		}
	);

	Customers.associate = (models) => {
		Customers.hasMany(models.ListPhones, {
			as: "ListPhones",
			foreignKey: "customer_id",
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		});
		Customers.hasMany(models.Contracts, {
			as: "Contracts",
			foreignKey: "customer_id",
			onDelete: "NO ACTION",
			onUpdate: "NO ACTION",
		});
	};
	return Customers;
};
