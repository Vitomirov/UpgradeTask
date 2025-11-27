const knex = require('knex');
const knexConfig = require('../../knexfile');

// Initialize Knex instance using the development configuration.
const db = knex(knexConfig.development);

// Checks the database connection health.

async function checkDbConnection() {
    try {
        await db.raw('SELECT 1');
        console.log('DB: Database connection established successfully.');
    } catch (error) {
        console.error('Failed to connect to database.', error.message);
        process.exit(1); 
    }
}

// Export the Knex instance and the connection checker function.
module.exports = {
    db,
    checkDbConnection
};