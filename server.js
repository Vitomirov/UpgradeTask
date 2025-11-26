const express = require('express');

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
app.use(express.json()); // JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // URL-encoded bodies

// ===================================
// API ROUTES
// ===================================
app.use('/api/users', userRoutes);       // POST /api/users, GET /api/users/:id
app.use('/api/purchases', purchaseRoutes); // POST /api/purchases

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'Upgrade Task' });
});

// Main application function
async function startServer() {
    try {
        // 1️⃣ Check database connection
        await checkDbConnection();
        console.log('Server: Database connection established successfully.');

        // 2️⃣ Start Express server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        // 3️⃣ Start bonus worker
        BonusWorker.start();
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

startServer();
