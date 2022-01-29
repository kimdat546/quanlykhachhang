const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "customers", deps: []
 * createTable() => "users", deps: []
 *
 */

const info = {
  revision: 1,
  name: "init",
  created: "2022-01-26T05:05:31.539Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "customers",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        name: { type: Sequelize.STRING(50), field: "name", allowNull: false },
        phone: { type: Sequelize.STRING(12), field: "phone", allowNull: true },
        check_phone: {
          type: Sequelize.BOOLEAN,
          field: "check_phone",
          defaultValue: true,
          allowNull: true,
        },
        relation: { type: Sequelize.JSON, field: "relation", allowNull: true },
        work_type: {
          type: Sequelize.STRING,
          field: "work_type",
          allowNull: true,
        },
        work_detail: {
          type: Sequelize.STRING,
          field: "work_detail",
          allowNull: true,
        },
        birthday: { type: Sequelize.DATE, field: "birthday", allowNull: true },
        identification: {
          type: Sequelize.JSON,
          field: "identification",
          allowNull: true,
        },
        address: { type: Sequelize.JSON, field: "address", allowNull: true },
        note: { type: Sequelize.STRING, field: "note", allowNull: true },
        salary: {
          type: Sequelize.DECIMAL(10),
          field: "salary",
          defaultValue: 0,
          allowNull: true,
        },
        follow: {
          type: Sequelize.ENUM("month", "year", "week"),
          field: "follow",
          defaultValue: "month",
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM("success"),
          field: "status",
          defaultValue: "success",
          allowNull: true,
        },
        blacklist: {
          type: Sequelize.BOOLEAN,
          field: "blacklist",
          defaultValue: false,
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
];

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["customers", { transaction }],
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
