module.exports = function (sequelize, DataTypes) {
	const Users = sequelize.define(
		"Users",
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				allowNull: false,
				defaultValue: DataTypes.UUIDV4,
			},
			name: {
				type: DataTypes.STRING(50),
				allowNull: false,
			},
			username: {
				type: DataTypes.STRING(50),
				allowNull: false,
				unique: true,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING(50),
				allowNull: false,
				unique: true,
			},
			phone: {
				type: DataTypes.STRING(12),
				allowNull: true,
				unique: true,
			},
			role: {
				type: DataTypes.ENUM("admin", "both", "stay", "hourly"),
				allowNull: false,
				defaultValue: "both",
			},
			authorization: {
				type: DataTypes.ARRAY(
					DataTypes.ENUM(
						1, //Xem lao dong he thong
						2, //Xem lao dong tk chinh minh
						3, //Xem lao dong cac tk con
						4, //Xem khach hang he thong
						5, //Xem khach hang tk chinh minh
						6, //Xem khach hang cac tk con
						7, //Xem hop dong he thong
						8, //Xem hop dong tk chinh minh
						9, //Xem hop dong cac tk con
						10, //Sua lao dong he thong
						11, //Sua lao dong tk chinh minh
						12, //Sua lao dong cac tk con
						13, //Sua khach hang he thong
						14, //Sua khach hang tk chinh minh
						15, //Sua khach hang cac tk con
						16, //Sua hop dong he thong
						17, //Sua hop dong tk chinh minh
						18 //Sua hop dong cac tk con
					)
				),
				allowNull: true,
			},
			refreshToken: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
		},
		{
			tableName: "users",
			timestamps: true,
		}
	);
	return Users;
};
