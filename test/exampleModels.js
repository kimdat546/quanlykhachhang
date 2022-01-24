module.exports = (sequelize, DataTypes) => {
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
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true,
            },
            role: {
                type: DataTypes.ENUM,
                values: ["admin", "member"],
                allowNull: false,
                defaultValue: "member",
            },
        },
        {
            tableName: "users",
        }
    );
    // Users.associate = (models) => {
    //     Users.hasMany(models.Posts, {
    //         foreignKey: "userId",
    //     });
    // };
    return Users;
};
