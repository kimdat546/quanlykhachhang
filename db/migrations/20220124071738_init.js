const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "khachhang", deps: []
 * createTable() => "laodong", deps: []
 * createTable() => "users", deps: []
 * createTable() => "hopdong", deps: [khachhang, laodong]
 *
 */

const info = {
  revision: 1,
  name: "init",
  created: "2022-01-24T07:17:38.515Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "khachhang",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        tenkhachhang: {
          type: Sequelize.STRING(50),
          field: "tenkhachhang",
          allowNull: true,
        },
        dienthoai: {
          type: Sequelize.JSON,
          field: "dienthoai",
          allowNull: true,
        },
        diachi: { type: Sequelize.TEXT, field: "diachi", allowNull: true },
        congviec: { type: Sequelize.TEXT, field: "congviec", allowNull: true },
        cannguoi: { type: Sequelize.TEXT, field: "cannguoi", allowNull: true },
        luong: {
          type: Sequelize.DECIMAL(10),
          field: "luong",
          defaultValue: 0,
          allowNull: true,
        },
        thoigian: { type: Sequelize.DATE, field: "thoigian", allowNull: true },
        trangthai: {
          type: Sequelize.ENUM(
            "Đang Tìm Người",
            "Đang Phỏng Vấn",
            "Đang Đổi Người",
            "Thành Công",
            "Thất Bại"
          ),
          field: "trangthai",
          defaultValue: "Đang Tìm Người",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "laodong",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        tenlaodong: {
          type: Sequelize.STRING(50),
          field: "tenlaodong",
          allowNull: false,
        },
        dienthoai: {
          type: Sequelize.JSON,
          field: "dienthoai",
          allowNull: true,
        },
        namsinh: { type: Sequelize.DATE, field: "namsinh", allowNull: true },
        cmnd: { type: Sequelize.JSON, field: "cmnd", allowNull: true },
        ngaycap: {
          type: Sequelize.DATEONLY,
          field: "ngaycap",
          allowNull: true,
        },
        noicap: { type: Sequelize.TEXT, field: "noicap", allowNull: true },
        hokhau: { type: Sequelize.TEXT, field: "hokhau", allowNull: true },
        diachi: { type: Sequelize.TEXT, field: "diachi", allowNull: true },
        yeucaucuthe: {
          type: Sequelize.TEXT,
          field: "yeucaucuthe",
          allowNull: true,
        },
        trangthai: {
          type: Sequelize.ENUM("Y", "N"),
          field: "trangthai",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "users",
      {
        id: {
          type: Sequelize.UUID,
          field: "id",
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        username: {
          type: Sequelize.STRING(50),
          field: "username",
          unique: true,
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING,
          field: "password",
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING(50),
          field: "email",
          unique: true,
          allowNull: false,
        },
        role: {
          type: Sequelize.ENUM("admin", "member"),
          field: "role",
          defaultValue: "member",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "hopdong",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        idkhachhang: {
          type: Sequelize.INTEGER,
          onUpdate: "NO ACTION",
          onDelete: "NO ACTION",
          field: "idkhachhang",
          unique: true,
          references: { model: "khachhang", key: "id" },
          allowNull: true,
        },
        idlaodong: {
          type: Sequelize.INTEGER,
          onUpdate: "NO ACTION",
          onDelete: "NO ACTION",
          field: "idlaodong",
          unique: true,
          references: { model: "laodong", key: "id" },
          allowNull: true,
        },
        thoigian: { type: Sequelize.DATE, field: "thoigian", allowNull: true },
        phidichvu: {
          type: Sequelize.DECIMAL(10),
          field: "phidichvu",
          allowNull: true,
        },
        chuthich: { type: Sequelize.TEXT, field: "chuthich", allowNull: true },
        trangthai: {
          type: Sequelize.ENUM(
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
          field: "trangthai",
          allowNull: true,
        },
        yeucaudoinguoi: {
          type: Sequelize.INTEGER,
          field: "yeucaudoinguoi",
          unique: true,
          allowNull: true,
        },
        maso: { type: Sequelize.STRING(10), field: "maso", allowNull: true },
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["hopdong", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["khachhang", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["laodong", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["users", { transaction }],
  },
];

const pos = 0;
const useTransaction = true;

const execute = (queryInterface, sequelize, _commands) => {
  let index = pos;
  const run = (transaction) => {
    const commands = _commands(transaction);
    return new Promise((resolve, reject) => {
      const next = () => {
        if (index < commands.length) {
          const command = commands[index];
          console.log(`[#${index}] execute: ${command.fn}`);
          index++;
          queryInterface[command.fn](...command.params).then(next, reject);
        } else resolve();
      };
      next();
    });
  };
  if (useTransaction) return queryInterface.sequelize.transaction(run);
  return run(null);
};

module.exports = {
  pos,
  useTransaction,
  up: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, migrationCommands),
  down: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, rollbackCommands),
  info,
};
