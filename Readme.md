# Product API

This API allows you to manage product transactions, including initializing the database with seed data, listing transactions, fetching statistics, and retrieving data for bar charts and pie charts.

## Initialize Database

Initialize the database with seed data from an external JSON file.

- **URL:** `/api/products/initialize-database`
- **Method:** `GET`
- **Success Response:**
  - **Code:** 200
  - **Content:** `Database initialized with seed data.`
- **Error Response:**
  - **Code:** 500
  - **Content:** `Internal Server Error`

## List Transactions

Retrieve a list of transactions, optionally filtered by month and search query.

- **URL:** `/api/products/transactions`
- **Method:** `GET`
- **Query Parameters:**
  - `month` (optional): Filter transactions by month (YYYY-MM format).
  - `page` (optional): Page number for pagination (default is 1).
  - `perPage` (optional): Number of transactions per page (default is 10).
  - `search` (optional): Search query to filter transactions by title, description, or price.
- **Success Response:**
  - **Code:** 200
  - **Content:** Array of transaction objects.
- **Error Response:**
  - **Code:** 500
  - **Content:** `Internal Server Error`

## Get Statistics

Retrieve statistics for the specified month, including total sale amount, total sold items, and total not sold items.

- **URL:** `/api/products/statistics`
- **Method:** `GET`
- **Query Parameters:**
  - `month` (required): Month to retrieve statistics for (YYYY-MM format).
- **Success Response:**
  - **Code:** 200
  - **Content:** JSON object with total sale amount, total sold items, and total not sold items.
- **Error Response:**
  - **Code:** 400
  - **Content:** `Invalid month parameter. Please use YYYY-MM format.`
  - **Code:** 500
  - **Content:** `Internal Server Error`

## Get Bar Chart Data

Retrieve data for a bar chart representing price ranges and item counts for the specified month.

- **URL:** `/api/products/bar-chart`
- **Method:** `GET`
- **Query Parameters:**
  - `month` (required): Month to retrieve data for (YYYY-MM format).
- **Success Response:**
  - **Code:** 200
  - **Content:** Array of objects with price range and item count.
- **Error Response:**
  - **Code:** 400
  - **Content:** `Invalid month parameter. Please use YYYY-MM format.`
  - **Code:** 500
  - **Content:** `Internal Server Error`

## Get Pie Chart Data

Retrieve data for a pie chart representing categories and item counts for the specified month.

- **URL:** `/api/products/pie-chart`
- **Method:** `GET`
- **Query Parameters:**
  - `month` (required): Month to retrieve data for (YYYY-MM format).
- **Success Response:**
  - **Code:** 200
  - **Content:** Array of objects with category and item count.
- **Error Response:**
  - **Code:** 400
  - **Content:** `Invalid month parameter. Please use YYYY-MM format.`
  - **Code:** 500
  - **Content:** `Internal Server Error`

## Get Combined Data

Retrieve combined data including transactions, bar chart data, and pie chart data for the specified month.

- **URL:** `/api/products/combined-data`
- **Method:** `GET`
- **Query Parameters:**
  - `month` (required): Month to retrieve data for (YYYY-MM format).
- **Success Response:**
  - **Code:** 200
  - **Content:** JSON object with transactions, bar chart data, and pie chart data.
- **Error Response:**
  - **Code:** 400
  - **Content:** `Invalid month parameter. Please use YYYY-MM format.`
  - **Code:** 500
  - **Content:** `Internal Server Error`
