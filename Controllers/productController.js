const axios = require('axios');
const { Op, Sequelize } = require('sequelize');
const moment = require('moment');
const ProductTransaction = require('../models/ProductTransaction');

const sequelize = new Sequelize('new-data', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

// API to initialize the database with seed data
async function initializeDatabase(req, res) {
  try {
    // Fetch seed data from external API
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const seedData = response.data;
    
    // Sync model with database and insert seed data
    await ProductTransaction.sync({ force: true });
    await ProductTransaction.bulkCreate(seedData);
    
    // Send success message
    res.send('Database initialized with seed data.');
  } catch (error) {
    // Log and handle errors
    console.error('Error initializing database:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function listTransactions(req, res) {
  try {
    const { month, page = 1, perPage = 10, search = '' } = req.query;
    const whereClause = month ? { dateOfSale: { [Op.like]: `%${month}-%` } } : {};
    
    // Fetch transactions based on query parameters
    const transactions = await ProductTransaction.findAndCountAll({
      where: {
        [Op.and]: [
          whereClause,
          {
            [Op.or]: [
              { title: { [Op.like]: `%${search}%` } },
              { description: { [Op.like]: `%${search}%` } },
              { price: { [Op.like]: `%${search}%` } },
            ]
          }
        ]
      },
      offset: (page - 1) * perPage,
      limit: perPage,
    });
    
    // Send transactions as JSON response
    res.json(transactions);
  } catch (error) {
    // Log and handle errors
    console.error('Error fetching transactions:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function getStatistics(req, res) {
  try {
    const { month } = req.query;

    // Validate month parameter
    if (!month || !moment(month, 'YYYY-MM', true).isValid()) {
      return res.status(400).json({ error: 'Invalid month parameter. Please use YYYY-MM format.' });
    }

    // Calculate statistics based on the month
    const [totalSaleAmount, totalSoldItems, totalNotSoldItems] = await Promise.all([
      ProductTransaction.sum('price', { where: { dateOfSale: { [Op.like]: `${month}-%` } } }),
      ProductTransaction.count({ where: { dateOfSale: { [Op.like]: `${month}-%` } } }),
      ProductTransaction.count({ where: { dateOfSale: { [Op.like]: `${month}-%`, [Op.not]: null } } })
    ]);

    // Send statistics as JSON response
    res.json({ totalSaleAmount, totalSoldItems, totalNotSoldItems });
  } catch (error) {
    // Log and handle errors
    console.error('Error fetching statistics:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function getBarChartData(req, res) {
  try {
    const { month } = req.query;

    // Validate month parameter
    if (!month || !moment(month, 'YYYY-MM', true).isValid()) {
      return res.status(400).json({ error: 'Invalid month parameter. Please use YYYY-MM format.' });
    }

    // Define price ranges
    const priceRanges = [
      { min: 0, max: 100 }, { min: 101, max: 200 }, { min: 201, max: 300 },
      { min: 301, max: 400 }, { min: 401, max: 500 }, { min: 501, max: 600 },
      { min: 601, max: 700 }, { min: 701, max: 800 }, { min: 801, max: 900 }, { min: 901, max: Infinity }
    ];

    // Fetch bar chart data for each price range
    const barChartData = await Promise.all(priceRanges.map(async (range) => {
      const itemCount = await ProductTransaction.count({
        where: {
          price: { [Op.between]: [range.min, range.max] },
          dateOfSale: { [Op.like]: `${month}-%` }
        }
      });
      return { priceRange: `${range.min} - ${range.max}`, itemCount };
    }));

    // Send bar chart data as JSON response
    res.json(barChartData);
  } catch (error) {
    // Log and handle errors
    console.error('Error fetching bar chart data:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function getPieChartData(req, res) {
  try {
    const { month } = req.query;

    // Fetch pie chart data grouped by category
    const pieChartData = await ProductTransaction.findAll({
      attributes: ['category', [sequelize.fn('COUNT', sequelize.col('*')), 'itemCount']], 
      where: {
        dateOfSale: { 
          [Op.like]: `${month}-%` // Filter by the month in dateOfSale
        }
      },
      group: 'category'
    });

    // Send pie chart data as JSON response
    res.json(pieChartData);
  } catch (error) {
    // Log and handle errors
    console.error('Error fetching pie chart data:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function getCombinedData(req, res) {
  try {
    const { month } = req.query;

    // Execute the SQL query to get bar chart data
    const barChartData = await sequelize.query(`
      SELECT
        (CASE 
          WHEN price BETWEEN 0 AND 100 THEN '0 - 100'
          WHEN price BETWEEN 101 AND 200 THEN '101 - 200'
          WHEN price BETWEEN 201 AND 300 THEN '201 - 300'
          WHEN price BETWEEN 301 AND 400 THEN '301 - 400'
          WHEN price BETWEEN 401 AND 500 THEN '401 - 500'
          WHEN price BETWEEN 501 AND 600 THEN '501 - 600'
          WHEN price BETWEEN 601 AND 700 THEN '601 - 700'
          WHEN price BETWEEN 701 AND 800 THEN '701 - 800'
          WHEN price BETWEEN 801 AND 900 THEN '801 - 900'
          ELSE '901 - above' 
        END) AS priceRange, 
        COUNT(*) AS itemCount 
      FROM 
        ProductTransactions 
      WHERE 
        dateOfSale LIKE :month 
      GROUP BY 
        priceRange
    `, {
      replacements: { month: `%${month}-%` },
      type: sequelize.QueryTypes.SELECT
    });

    // Fetch transactions and pie chart data
    const [transactions, pieChartData] = await Promise.all([
      ProductTransaction.findAndCountAll({
        where: { dateOfSale: { [Op.like]: `%${month}-%` } }
      }),
      ProductTransaction.findAll({
        attributes: ['category', [sequelize.fn('COUNT', sequelize.col('id')), 'itemCount']],
        where: { dateOfSale: { [Op.like]: `%${month}-%` } },
        group: 'category'
      })
    ]);

    // Send combined data as JSON response
    res.json({ transactions, barChartData, pieChartData });
  } catch (error) {
    // Log and handle errors
    console.error('Error fetching combined data:', error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = { initializeDatabase, listTransactions, getStatistics, getBarChartData, getPieChartData, getCombinedData };
