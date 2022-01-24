module.exports = function (sequelize, DataTypes) {
    const Khachhang = sequelize.define(
        "Khachhang",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
            },
            tenkhachhang: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            dienthoai: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            diachi: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            congviec: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            cannguoi: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            luong: {
                type: DataTypes.DECIMAL(10, 0),
                allowNull: true,
                defaultValue: 0,
            },
            thoigian: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            trangthai: {
                type: DataTypes.ENUM(
                    "Đang Tìm Người",
                    "Đang Phỏng Vấn",
                    "Đang Đổi Người",
                    "Thành Công",
                    "Thất Bại"
                ),
                allowNull: true,
                defaultValue: "Đang Tìm Người",
            },
        },
        {
            tableName: "khachhang",
            timestamps: false,
        }
    );
    Khachhang.associate = (models) => {
        Khachhang.hasMany(models.Hopdong, {
            as: "hopdong",
            foreignKey: "idkhachhang",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION",
        });
    };
    return Khachhang;
};
