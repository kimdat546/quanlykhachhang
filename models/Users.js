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
                type: DataTypes.ENUM("admin", "both", "stay","hourly"),
                allowNull: false,
                defaultValue: "both",
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
