module.exports = function (sequelize, DataTypes) {
  const Customers = sequelize.define(
    "Customers",
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
        type: DataTypes.JSON,
        allowNull: true,
      },
      relation: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      work_type: {
        type: DataTypes.ENUM(
          "o_lai",
          "theo_gio",
          "nuoi_de",
          "nuoi_benh",
          "tap_vu",
          "phu_quan",
          "ld_pho_thong",
          "khac"
        ),
        allowNull: true,
        defaultValue: "theo_gio",
      },
      work_detail: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      birthday: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      identification: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      address: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      note: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      salary: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 0,
      },
      follow: {
        type: DataTypes.ENUM("month", "year", "week"),
        allowNull: true,
        defaultValue: "month",
      },
      status: {
        type: DataTypes.ENUM("success", "fail"),
        allowNull: true,
        defaultValue: "success",
      },
      blacklist: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
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
      identity_file: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      tableName: "customers",
      timestamps: false,
    }
  );
  // Customers.associate = (models) => {
  //     Customers.hasMany(models.Contracts, {
  //         as: "Contracts",
  //         foreignKey: "Customer_id",
  //         onDelete: "NO ACTION",
  //         onUpdate: "NO ACTION",
  //     });
  // };
  return Customers;
};
