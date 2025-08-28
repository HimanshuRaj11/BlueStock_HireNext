const { pool } = require("../Utils/DBconnect");

async function createSkillsTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS master_skills_list (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE,
            slug VARCHAR(120) NOT NULL UNIQUE,
            category VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await pool.query(query);
}

async function findSkillById(id) {
  const { rows } = await pool.query(
    "SELECT id, name FROM master_skills_list WHERE id = $1",
    [id]
  );
  return rows[0];
}

async function findSkillsByName(name) {
  const { rows } = await pool.query(
    `SELECT id, name FROM master_skills_list 
     WHERE name ILIKE $1 
     ORDER BY name 
     LIMIT 10`,
    [`%${name}%`]
  );
  return rows;
}

async function findSkillsByIds(ids) {
  if (!ids || !ids.length) return [];
  const { rows } = await pool.query(
    "SELECT id, name FROM master_skills_list WHERE id = ANY($1)",
    [ids]
  );
  return rows;
}

async function getAllSkills() {
  const { rows } = await pool.query(
    "SELECT id, name FROM master_skills_list ORDER BY name"
  );
  return rows;
}

async function findSuggestedSkills() {
  // Option 1: Get random 8 skills
  const { rows } = await pool.query(
    `SELECT id, name FROM master_skills_list 
     ORDER BY RANDOM() 
     LIMIT 8`
  );
  return rows;
}

module.exports = {
  createSkillsTable,
  findSkillById,
  findSkillsByName,
  findSkillsByIds,
  getAllSkills,
  findSuggestedSkills
};