const Sequelize = require("sequelize");
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
            role: {
                type: DataTypes.ENUM("admin", "member"),
                allowNull: false,
                defaultValue: "member",
            },
        },
        {
            tableName: "users",
            timestamps: true,
        }
    );
    return Users;
};
