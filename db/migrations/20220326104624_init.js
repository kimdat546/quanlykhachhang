const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "company", deps: []
 * createTable() => "customers", deps: []
 * createTable() => "employees", deps: []
 * createTable() => "incurred", deps: []
 * createTable() => "tags", deps: []
 * createTable() => "users", deps: []
 * createTable() => "contracts", deps: [customers, employees]
 * createTable() => "customer_wait", deps: [customers]
 *
 */

const info = {
  revision: 1,
  name: "init",
  created: "2022-03-26T10:46:23.983Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "company",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        companyName: {
          type: Sequelize.STRING,
          field: "companyName",
          allowNull: false,
          primaryKey: true,
        },
        companyAddress: {
          type: Sequelize.STRING,
          field: "companyAddress",
          allowNull: false,
        },
        feeVehicle: {
          type: Sequelize.STRING,
          field: "feeVehicle",
          allowNull: false,
        },
        phoneNumber: {
          type: Sequelize.STRING,
          field: "phoneNumber",
          allowNull: false,
        },
        taxCode: { type: Sequelize.STRING, field: "taxCode", allowNull: false },
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
        phoneChecked: {
          type: Sequelize.BOOLEAN,
          field: "phoneChecked",
          defaultValue: true,
          allowNull: true,
        },
        relation: { type: Sequelize.JSON, field: "relation", allowNull: true },
        work_type: {
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
        work_detail: {
          type: Sequelize.STRING,
          field: "work_detail",
          allowNull: true,
        },
        birthday: {
          type: Sequelize.STRING(50),
          field: "birthday",
          allowNull: true,
        },
        identification: {
          type: Sequelize.JSON,
          field: "identification",
          allowNull: true,
        },
        gender: {
          type: Sequelize.ENUM("male", "female", "another"),
          field: "gender",
          defaultValue: "male",
          allowNull: true,
        },
        avatar: { type: Sequelize.STRING, field: "avatar", allowNull: true },
        address: { type: Sequelize.JSON, field: "address", allowNull: true },
        note: { type: Sequelize.TEXT, field: "note", allowNull: true },
        salary: {
          type: Sequelize.STRING,
          field: "salary",
          defaultValue: 0,
          allowNull: true,
        },
        follow: {
          type: Sequelize.ENUM("month", "year", "week", "half_day", "hour"),
          field: "follow",
          defaultValue: "month",
          allowNull: true,
        },
        blacklist: {
          type: Sequelize.BOOLEAN,
          field: "blacklist",
          defaultValue: false,
          allowNull: true,
        },
        note_blacklist: {
          type: Sequelize.STRING,
          field: "note_blacklist",
          allowNull: true,
        },
        country: {
          type: Sequelize.STRING,
          field: "country",
          defaultValue: "Việt Nam",
          allowNull: true,
        },
        reason: { type: Sequelize.JSON, field: "reason", allowNull: true },
        markBy: { type: Sequelize.UUID, field: "markBy", allowNull: true },
        location: { type: Sequelize.JSON, field: "location", allowNull: true },
        status: {
          type: Sequelize.ENUM(
            "Looking",
            "Interviewing",
            "Successful",
            "Failure",
            "RequestChange",
            "ChangeSuccessfully",
            "ChangeFailure",
            "CancelContract",
            "SplitFees",
            "ContractExpires"
          ),
          field: "status",
          defaultValue: "Looking",
          allowNull: true,
        },
        create_date: {
          type: Sequelize.DATE,
          field: "create_date",
          defaultValue: Sequelize.NOW,
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
    fn: "createTable",
    params: [
      "employees",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        name: { type: Sequelize.STRING(50), field: "name", allowNull: false },
        phone: {
          type: Sequelize.STRING(12),
          field: "phone",
          unique: true,
          allowNull: true,
        },
        phoneChecked: {
          type: Sequelize.BOOLEAN,
          field: "phoneChecked",
          defaultValue: true,
          allowNull: true,
        },
        relation: { type: Sequelize.JSON, field: "relation", allowNull: true },
        birthday: {
          type: Sequelize.STRING(50),
          field: "birthday",
          allowNull: true,
        },
        identification: {
          type: Sequelize.JSON,
          field: "identification",
          allowNull: true,
        },
        gender: {
          type: Sequelize.ENUM("male", "female", "another"),
          field: "gender",
          defaultValue: "male",
          allowNull: true,
        },
        avatar: { type: Sequelize.STRING, field: "avatar", allowNull: true },
        address: { type: Sequelize.JSON, field: "address", allowNull: true },
        ability_work: {
          type: Sequelize.JSON,
          field: "ability_work",
          allowNull: true,
        },
        need_work: {
          type: Sequelize.STRING,
          field: "need_work",
          allowNull: true,
        },
        note: { type: Sequelize.TEXT, field: "note", allowNull: true },
        blacklist: {
          type: Sequelize.BOOLEAN,
          field: "blacklist",
          defaultValue: false,
          allowNull: true,
        },
        note_blacklist: {
          type: Sequelize.STRING,
          field: "note_blacklist",
          allowNull: true,
        },
        country: {
          type: Sequelize.STRING,
          field: "country",
          defaultValue: "Việt Nam",
          allowNull: true,
        },
        reason: { type: Sequelize.JSON, field: "reason", allowNull: true },
        markBy: { type: Sequelize.UUID, field: "markBy", allowNull: true },
        location: { type: Sequelize.JSON, field: "location", allowNull: true },
        status: {
          type: Sequelize.ENUM("Interviewing", "Working", "Waiting"),
          field: "status",
          defaultValue: "Waiting",
          allowNull: true,
        },
        create_date: {
          type: Sequelize.DATE,
          field: "create_date",
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
    fn: "createTable",
    params: [
      "incurred",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        incurredName: {
          type: Sequelize.STRING,
          field: "incurredName",
          allowNull: false,
        },
        incurredAmount: {
          type: Sequelize.STRING,
          field: "incurredAmount",
          allowNull: false,
        },
        note: { type: Sequelize.STRING, field: "note", allowNull: true },
        incurredDate: {
          type: Sequelize.STRING,
          field: "incurredDate",
          defaultValue: "26/3/2022",
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
      "tags",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        tag_name: {
          type: Sequelize.STRING,
          field: "tag_name",
          allowNull: false,
        },
        list_tags: {
          type: Sequelize.JSON,
          field: "list_tags",
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
        name: { type: Sequelize.STRING(50), field: "name", allowNull: false },
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
          allowNull: true,
        },
        phone: {
          type: Sequelize.STRING(12),
          field: "phone",
          unique: true,
          allowNull: true,
        },
        role: {
          type: Sequelize.ENUM("admin", "both", "stay", "hourly"),
          field: "role",
          defaultValue: "both",
          allowNull: false,
        },
        authorization: {
          type: Sequelize.JSON,
          field: "authorization",
          allowNull: true,
        },
        refreshToken: {
          type: Sequelize.TEXT,
          field: "refreshToken",
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
          references: { model: "customers", key: "id" },
          field: "customer_id",
          allowNull: false,
        },
        employee_id: {
          type: Sequelize.INTEGER,
          onUpdate: "NO ACTION",
          onDelete: "NO ACTION",
          references: { model: "employees", key: "id" },
          field: "employee_id",
          allowNull: false,
        },
        fee_service: {
          type: Sequelize.STRING,
          field: "fee_service",
          allowNull: true,
        },
        fee_vehicle: {
          type: Sequelize.STRING,
          field: "fee_vehicle",
          allowNull: true,
        },
        follow: {
          type: Sequelize.ENUM("month", "week", "day", "half_day", "hour"),
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
            "Interviewing",
            "Successful",
            "Failure",
            "RequestChange",
            "ChangeSuccessfully",
            "ChangeFailure",
            "CancelContract",
            "SplitFees",
            "ContractExpires",
            "SuccessfulExpires"
          ),
          field: "status",
          defaultValue: "Interviewing",
          allowNull: true,
        },
        exchange_id: {
          type: Sequelize.INTEGER,
          field: "exchange_id",
          allowNull: true,
        },
        old_contract_id: {
          type: Sequelize.INTEGER,
          field: "old_contract_id",
          allowNull: true,
        },
        markBy: { type: Sequelize.UUID, field: "markBy", allowNull: true },
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
      "customer_wait",
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
          onUpdate: "CASCADE",
          onDelete: "NO ACTION",
          references: { model: "customers", key: "id" },
          field: "customer_id",
          unique: true,
          allowNull: false,
        },
        status: {
          type: Sequelize.ENUM("waiting", "promise", "exchange", "again"),
          field: "status",
          defaultValue: "waiting",
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
    params: ["company", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["contracts", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["customers", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["customer_wait", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["employees", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["incurred", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["tags", { transaction }],
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
