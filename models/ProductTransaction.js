const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Assuming you have a database configuration file

const ProductTransaction = sequelize.define('ProductTransaction', {
  // Define your model attributes here
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  dateOfSale: {
    type: DataTypes.DATE,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = ProductTransaction;
