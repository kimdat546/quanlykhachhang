module.exports = function (sequelize, DataTypes) {
    const Hopdong = sequelize.define(
        "Hopdong",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
            },
            idkhachhang: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "khachhang",
                    key: "id",
                },
                unique: true,
            },
            idlaodong: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "laodong",
                    key: "id",
                },
                unique: true,
            },
            thoigian: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            phidichvu: {
                type: DataTypes.DECIMAL(10, 0),
                allowNull: true,
            },
            chuthich: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            trangthai: {
                type: DataTypes.ENUM(
                    "Đang Phỏng Vấn",
                    "Thành Công",
                    "Thất Bại",
                    "Yêu Cầu Đổi Người",
                    "Đổi Người Thành Công",
                    "Đổi Người Thất Bại",
                    "Hủy Hợp Đồng Trả Phí",
                    "Chia Phí",
                    "Hợp Đồng Hết Hạn",
                    "Xóa"
                ),
                allowNull: true,
            },
            yeucaudoinguoi: {
                type: DataTypes.INTEGER,
                allowNull: true,
                unique: true,
            },
            maso: {
                type: DataTypes.STRING(10),
                allowNull: true,
            },
        },
        {
            tableName: "hopdong",
            timestamps: false,
        }
    );
    Hopdong.associate = (models) => {
        Hopdong.belongsTo(models.Khachhang, {
            as: "idkhachhang_khachhang",
            foreignKey: "idkhachhang",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION",
        });
        Hopdong.belongsTo(models.Laodong, {
            as: "idlaodong_laodong",
            foreignKey: "idlaodong",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION",
        });
    };

    return Hopdong;
};
