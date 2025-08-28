const { pool } = require("../Utils/DBconnect");

async function createEducationTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS education (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            course_name VARCHAR(100) NOT NULL,
            specialization VARCHAR(100),
            college_name VARCHAR(255) NOT NULL,
            percentage_cgpa VARCHAR(20) NOT NULL,
            start_year INTEGER NOT NULL,
            end_year INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT valid_years CHECK (end_year >= start_year)
        );
    `;
    await pool.query(query);
}

async function addEducation(userId, educationData) {
    const { course_name, specialization, college_name, percentage_cgpa, start_year, end_year } = educationData;
    const query = `
        INSERT INTO education 
        (user_id, course_name, specialization, college_name, percentage_cgpa, start_year, end_year)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`;
    const values = [userId, course_name, specialization, college_name, percentage_cgpa, start_year, end_year];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

async function getEducationByUser(userId) {
    const { rows } = await pool.query(
        "SELECT * FROM education WHERE user_id = $1 ORDER BY end_year DESC",
        [userId]
    );
    return rows;
}

async function updateEducation(id, userId, educationData) {
    const { course_name, specialization, college_name, percentage_cgpa, start_year, end_year } = educationData;
    const query = `
        UPDATE education SET
        course_name = $1,
        specialization = $2,
        college_name = $3,
        percentage_cgpa = $4,
        start_year = $5,
        end_year = $6,
        updated_at = NOW()
        WHERE id = $7 AND user_id = $8
        RETURNING *`;
    const values = [course_name, specialization, college_name, percentage_cgpa, start_year, end_year, id, userId];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

async function deleteEducation(id, userId) {
    const { rowCount } = await pool.query(
        "DELETE FROM education WHERE id = $1 AND user_id = $2",
        [id, userId]
    );
    return rowCount > 0;
}

module.exports = {
    createEducationTable,
    addEducation,
    getEducationByUser,
    updateEducation,
    deleteEducation
};