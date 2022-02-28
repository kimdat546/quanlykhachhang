module.exports = function (sequelize, DataTypes) {
	const Tags = sequelize.define(
		"Tags",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				allowNull: false,
				autoIncrement: true,
			},
			tag_name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			list_tags: {
				type: DataTypes.JSON,
				allowNull: true,
			},
		},
		{
			tableName: "tags",
			timestamps: true,
		}
	);
	return Tags;
};
