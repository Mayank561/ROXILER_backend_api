const express = require('express');
const morgan = require('morgan');
const app = express();
const productRoutes = require('./routes/productRoutes');

// Middleware
app.use(express.json());

app.use(morgan('dev'));

// Routes
app.use('/api/products', productRoutes);

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
