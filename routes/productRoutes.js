const express = require('express');
const router = express.Router();
const productController = require('../Controllers/productController.js');

// Initialize Database
router.get('/initialize-database', productController.initializeDatabase);

// List Transactions
router.get('/transactions', productController.listTransactions);

// Get Statistics
router.get('/statistics/:month', productController.getStatistics); 

// Get Bar Chart Data
router.get('/bar-chart/:month', productController.getBarChartData); 

// Get Pie Chart Data
router.get('/pie-chart/:month', productController.getPieChartData); 

// Get Combined Data
router.get('/combined-data/:month', productController.getCombinedData); 

module.exports = router;
