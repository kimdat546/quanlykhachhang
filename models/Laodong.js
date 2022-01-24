module.exports = function (sequelize, DataTypes) {
    const Laodong = sequelize.define(
        "Laodong",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
            },
            tenlaodong: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            dienthoai: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            namsinh: {
                type: DataTypes.DATE(4),
                allowNull: true,
            },
            cmnd: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            ngaycap: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            noicap: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            hokhau: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            diachi: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            yeucaucuthe: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            trangthai: {
                type: DataTypes.ENUM("Y", "N"),
                allowNull: true,
            },
        },
        {
            tableName: "laodong",
            timestamps: false,
        }
    );
    Laodong.associate = (models) => {
        Laodong.hasMany(models.Hopdong, {
            as: "hopdong",
            foreignKey: "idlaodong",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION",
        });
    };
    return Laodong;
};
