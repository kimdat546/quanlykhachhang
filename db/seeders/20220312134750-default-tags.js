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
			"tags",
			[
				{
					id: "1",
					tag_name: "salary",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: "2",
					tag_name: "work_recommend",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: "3",
					tag_name: "work_ability",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: "4",
					tag_name: "contract",
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
		await queryInterface.bulkDelete("Tags", null, {});
	},
};
