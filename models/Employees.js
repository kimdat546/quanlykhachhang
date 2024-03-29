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
				type: DataTypes.STRING(50),
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
			need_work: {
				type: DataTypes.STRING,
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
			status: {
				type: DataTypes.ENUM(
					"Interviewing", //Đang Phỏng Vấn
					"Working", //Đang đi làm
					"Waiting" //Đợi việc
				),
				allowNull: true,
				defaultValue: "Waiting",
			},
			create_date: {
				type: DataTypes.DATE,
				allowNull: true,
			},
		},
		{
			tableName: "employees",
			timestamps: true,
		}
	);
	Employees.associate = (models) => {
		Employees.hasMany(models.Contracts, {
			as: "Contracts",
			foreignKey: "employee_id",
			onDelete: "NO ACTION",
			onUpdate: "NO ACTION",
		});
	};
	return Employees;
};
