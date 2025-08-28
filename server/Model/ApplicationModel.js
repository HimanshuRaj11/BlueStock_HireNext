const { pool } = require("../Utils/DBconnect");
const { STATUS } = require("../Utils/ApplicationConstants");

async function createApplicationTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS applications (
            id SERIAL PRIMARY KEY,
            applicant_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            recruiter_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
            status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
            resume TEXT NOT NULL,
            date_of_application TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            date_of_joining TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT date_check CHECK (date_of_joining IS NULL OR date_of_joining >= date_of_application)
        );
    `;
    await pool.query(query);
}

module.exports = {
    createApplicationTable
};
