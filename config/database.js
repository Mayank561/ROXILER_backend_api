const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('new-data', 'root', '', {
  dialect: 'mysql',
  host: 'localhost'
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

module.exports = sequelize;
