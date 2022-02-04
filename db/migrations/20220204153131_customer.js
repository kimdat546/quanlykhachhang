const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * removeColumn(check_phone) => "customers"
 * addColumn(gender) => "customers"
 * addColumn(avatar) => "customers"
 * changeColumn(phone) => "customers"
 * changeColumn(work_type) => "customers"
 * changeColumn(salary) => "customers"
 * changeColumn(status) => "customers"
 * changeColumn(avatar) => "employees"
 *
 */

const info = {
  revision: 3,
  name: "customer",
  created: "2022-02-04T15:31:31.394Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "removeColumn",
    params: ["customers", "check_phone", { transaction }],
  },
  {
    fn: "addColumn",
    params: [
      "customers",
      "gender",
      {
        type: Sequelize.ENUM("male", "female"),
        field: "gender",
        defaultValue: "male",
        allowNull: true,
      },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "customers",
      "avatar",
      { type: Sequelize.STRING, field: "avatar", allowNull: true },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "customers",
      "phone",
      { type: Sequelize.JSON, field: "phone", allowNull: true },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "customers",
      "work_type",
      {
        type: Sequelize.ENUM("theo_gio"),
        field: "work_type",
        defaultValue: "theo_gio",
        allowNull: true,
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "customers",
      "salary",
      {
        type: Sequelize.STRING,
        field: "salary",
        defaultValue: 0,
        allowNull: true,
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "customers",
      "status",
      {
        type: Sequelize.ENUM("success", "fail"),
        field: "status",
        defaultValue: "success",
        allowNull: true,
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "employees",
      "avatar",
      { type: Sequelize.JSON, field: "avatar", allowNull: true },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "removeColumn",
    params: ["customers", "gender", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["customers", "avatar", { transaction }],
  },
  {
    fn: "addColumn",
    params: [
      "customers",
      "check_phone",
      {
        type: Sequelize.BOOLEAN,
        field: "check_phone",
        defaultValue: true,
        allowNull: true,
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "customers",
      "phone",
      { type: Sequelize.STRING(12), field: "phone", allowNull: true },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "customers",
      "work_type",
      { type: Sequelize.STRING, field: "work_type", allowNull: true },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "customers",
      "salary",
      {
        type: Sequelize.DECIMAL(10),
        field: "salary",
        defaultValue: 0,
        allowNull: true,
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "customers",
      "status",
      {
        type: Sequelize.ENUM("success"),
        field: "status",
        defaultValue: "success",
        allowNull: true,
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "employees",
      "avatar",
      { type: Sequelize.STRING, field: "avatar", allowNull: true },
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
