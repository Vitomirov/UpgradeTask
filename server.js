const express = require('express');
const bodyParser = require('body-parser');

// Database initialization and connection check
const { checkDbConnection } = require('./src/db/db');

// Import routes
const userRoutes = require('./src/routes/userRoutes');
const purchaseRoutes = require('./src/routes/purchaseRoutes');
const BonusWorker = require('./src/workers/bonusWorker');

// Load .env file variables
require('dotenv').config();

// Define server port
const PORT = process.env.PORT || 3000;

// Initialize Express app
const app = express();

// Middleware setup
app.use(bodyParser.json()); // To support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // To support URL-encoded bodies

// ===================================
// API ROUTES
// ===================================

// User routes: handles POST /api/users and GET /api/users/:id
app.use('/api/users', userRoutes);
// Purchase routes: handles POST /api/purchases
app.use('/api/purchases', purchaseRoutes);


// Basic health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'MLM Bonus API' });
});


// Main application function
async function startServer() {
    // 1. Check database connection
    await checkDbConnection();

    // 2. Start the Express server
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    BonusWorker.start();
}

startServer();