const { pool } = require("../Utils/DBconnect");

async function createFacilitiesTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS facilities (
            facilities_id SERIAL PRIMARY KEY,
            facilities_name VARCHAR(100) NOT NULL UNIQUE,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        const client = await pool.connect();
        await client.query(query);
        client.release();
    } catch (error) {
        console.error("Error creating facilities table:", error);
    }
}

async function findFacilityById(id) {
    const { rows } = await pool.query(
        "SELECT * FROM facilities WHERE facilities_id = $1",
        [id]
    );
    return rows[0];
}

async function findFacilityByName(name) {
    const { rows } = await pool.query(
        `SELECT * FROM facilities
        WHERE facilities_name ILIKE $1
        ORDER BY facilities_name`,
        [`%${name}%`]
    );
    return rows;
}

async function findFacilitiesByIds(ids) {
    if (!ids || !ids.length) return [];
    const { rows } = await pool.query(
        "SELECT * FROM facilities WHERE facilities_id = ANY($1)",
        [ids]
    );
    return rows;
}

async function getAllFacilities() {
    const { rows } = await pool.query(
        "SELECT * FROM facilities ORDER BY facilities_name"
    );
    return rows;
}

module.exports = {
    createFacilitiesTable,
    findFacilityById,
    findFacilityByName,
    findFacilitiesByIds,
    getAllFacilities
};
