require("dotenv").config();
module.exports = {
	development: {
		username: process.env.USERMYSQL,
		password: process.env.PASSMYSQL,
		database: process.env.DATABASE,
		host: process.env.HOST,
		dialect: process.env.DIALECT,
		timezone: process.env.TIMEZONE,
	},
	test: {
		username: process.env.USERMYSQL,
		password: process.env.PASSMYSQL,
		database: process.env.DATABASE,
		host: process.env.HOST,
		dialect: process.env.DIALECT,
		timezone: process.env.TIMEZONE,
	},
	production: {
		username: process.env.USERMYSQL,
		password: process.env.PASSMYSQL,
		database: process.env.DATABASE,
		host: process.env.HOST,
		dialect: process.env.DIALECT,
		timezone: process.env.TIMEZONE,
	},
};
