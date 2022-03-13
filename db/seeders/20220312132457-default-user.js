"use strict";
const bcrypt = require("bcrypt");
module.exports = {
	async up(queryInterface, Sequelize) {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */
		const hashPassword = await bcrypt.hash("@QuanLy1968", 10);
		await queryInterface.bulkInsert(
			"Users",
			[
				{
					id: "7328ca6e-78f4-492c-b704-45d52aa2e257",
					name: "Admin",
					username: "thienphuc",
					password: hashPassword,
					email: "windev.thang@gmail.com",
					role: "admin",
					authorization: JSON.stringify([
						1, 2, 3, 4, 5, 6, 7, 8, 9, 101, 11, 12, 13, 14, 15, 16,
						17, 18,
					]),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		);
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete("Users", null, {});
	},
};
