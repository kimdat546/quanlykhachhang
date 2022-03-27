"use strict";

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
		await queryInterface.bulkInsert(
			"company",
			[
				{
					id: 1,
					companyAddress:
						"759/32 Quang Trung, P 12, Q Gò Vấp, TP Hồ Chí Minh",
					companyName: "CÔNG TY TNHH GIÚP VIỆC NHÀ THIÊN PHÚC",
					feeVehicle: "10,000",
					phoneNumber: "0901 100 263 - 0948 062 227 - 0962 832 349",
					taxCode: "0316011833",
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
		await queryInterface.bulkDelete("Company", null, {});
	},
};
