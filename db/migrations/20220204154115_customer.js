const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * changeColumn(work_type) => "customers"
 *
 */

const info = {
  revision: 5,
  name: "customer",
  created: "2022-02-04T15:41:15.266Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "changeColumn",
    params: [
      "customers",
      "work_type",
      {
        type: Sequelize.ENUM(
          "o_lai",
          "theo_gio",
          "nuoi_de",
          "nuoi_benh",
          "tap_vu",
          "phu_quan",
          "ld_pho_thong",
          "khac"
        ),
        field: "work_type",
        defaultValue: "theo_gio",
        allowNull: true,
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
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
