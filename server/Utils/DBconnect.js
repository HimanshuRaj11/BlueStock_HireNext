require("dotenv").config();
const { Pool } = require("pg");

// Create a connection pool
const pool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
});

async function DBConnectionHandler() {
    try {
        const client = await pool.connect();
        console.log("✅ PostgreSQL connected successfully");
        client.release(); // Release to pool
    } catch (err) {
        process.exit(1);
    }
}

module.exports = DBConnectionHandler;
module.exports.pool = pool; // Export pool to be used in queries
