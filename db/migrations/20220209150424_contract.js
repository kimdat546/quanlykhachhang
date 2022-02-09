const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "contracts", deps: [Customers, Employees]
 * changeColumn(follow) => "customers"
 *
 */

const info = {
  revision: 2,
  name: "contract",
  created: "2022-02-09T15:04:24.141Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "contracts",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        customer_id: {
          type: Sequelize.INTEGER,
          onUpdate: "NO ACTION",
          onDelete: "NO ACTION",
          field: "customer_id",
          references: { model: "Customers", key: "id" },
          allowNull: true,
        },
        employee_id: {
          type: Sequelize.INTEGER,
          onUpdate: "NO ACTION",
          onDelete: "NO ACTION",
          field: "employee_id",
          references: { model: "Employees", key: "id" },
          allowNull: true,
        },
        fee_service: {
          type: Sequelize.DECIMAL(10),
          field: "fee_service",
          allowNull: true,
        },
        fee_vehicle: {
          type: Sequelize.DECIMAL(10),
          field: "fee_vehicle",
          allowNull: true,
        },
        follow: {
          type: Sequelize.ENUM("month", "year", "week", "half_day", "hour"),
          field: "follow",
          defaultValue: "month",
          allowNull: true,
        },
        trial_time: {
          type: Sequelize.INTEGER,
          field: "trial_time",
          allowNull: true,
        },
        exchange_time_max: {
          type: Sequelize.INTEGER(1),
          field: "exchange_time_max",
          defaultValue: 3,
          allowNull: true,
        },
        exchange_time: {
          type: Sequelize.INTEGER(1),
          field: "exchange_time",
          defaultValue: 0,
          allowNull: true,
        },
        note: { type: Sequelize.TEXT, field: "note", allowNull: true },
        status: {
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
          field: "status",
          defaultValue: "Đang Phỏng Vấn",
          allowNull: true,
        },
        exchange_id: {
          type: Sequelize.INTEGER,
          field: "exchange_id",
          allowNull: true,
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
    fn: "changeColumn",
    params: [
      "customers",
      "follow",
      {
        type: Sequelize.ENUM("month", "year", "week", "half_day", "hour"),
        field: "follow",
        defaultValue: "month",
        allowNull: true,
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["contracts", { transaction }],
  },
  {
    fn: "changeColumn",
    params: [
      "customers",
      "follow",
      {
        type: Sequelize.ENUM("month", "year", "week"),
        field: "follow",
        defaultValue: "month",
        allowNull: true,
      },
      { transaction },
    ],
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
