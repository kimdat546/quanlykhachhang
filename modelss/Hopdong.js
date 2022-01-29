module.exports = function (sequelize, DataTypes) {
    const Contracts = sequelize.define(
        "Contracts",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
            },
            customer_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "Customers",
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
            tableName: "contracts",
            timestamps: false,
        }
    );
    Contracts.associate = (models) => {
        Contracts.belongsTo(models.Customers, {
            as: "customerId_customer",
            foreignKey: "customer_id",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION",
        });
        Contracts.belongsTo(models.Laodong, {
            as: "idlaodong_laodong",
            foreignKey: "idlaodong",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION",
        });
    };

    return Hopdong;
};
