'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Define sample data
    const sampleData = [
      {
        title: 'Product 1',
        description: 'Description of product 1',
        price: 50.99,
        dateOfSale: new Date(),
        category: 'Category A',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Product 2',
        description: 'Description of product 2',
        price: 100.50,
        dateOfSale: new Date(),
        category: 'Category B',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      // Add more sample data as needed
    ];

    // Insert sample data into the database
    await queryInterface.bulkInsert('ProductTransactions', sampleData, {});
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the inserted sample data
    await queryInterface.bulkDelete('ProductTransactions', null, {});
  }
};
