const { pool } = require("../Utils/DBconnect");

async function createCategoryTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS master_job_category_list (
            category_id SERIAL PRIMARY KEY,
            category_name VARCHAR(100) NOT NULL UNIQUE,
            slug VARCHAR(100) NOT NULL UNIQUE,
            description TEXT,
            sector VARCHAR(50),
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await pool.query(query);
}

async function findCategoryById(id) {
    const { rows } = await pool.query(
        "SELECT * FROM master_job_category_list WHERE category_id = $1",
        [id]
    );
    return rows[0];
}

async function findCategoryByName(name) {
    const { rows } = await pool.query(
        `SELECT * FROM master_job_category_list
        WHERE category_name ILIKE $1 
        ORDER BY category_name 
        LIMIT 10`,
        [`%${name}%`]
    );
    return rows;
}

async function findCategoryBySlug(slug) {
    const { rows } = await pool.query(
        "SELECT * FROM master_job_category_list WHERE slug = $1",
        [slug]
    );
    return rows[0];
}

async function findCategoryByIds(ids) {
    if (!ids || !ids.length) return [];
    const { rows } = await pool.query(
        "SELECT * FROM master_job_category_list WHERE category_id = ANY($1)",
        [ids]
    );
    return rows;
}

async function getAllCategories() {
    const { rows } = await pool.query(
        "SELECT * FROM master_job_category_list ORDER BY category_name"
    );
    return rows;
}

async function getSuggestedCategories() {
    const { rows } = await pool.query(
        `SELECT * FROM master_job_category_list 
         ORDER BY RANDOM() 
         LIMIT 8`
    );
    return rows;
}

module.exports = {
    createCategoryTable,
    findCategoryById,
    findCategoryByName,
    findCategoryBySlug,
    findCategoryByIds,
    getAllCategories,
    getSuggestedCategories
};