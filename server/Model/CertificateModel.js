const { pool } = require("../Utils/DBconnect");

async function createCertificateTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS user_certificates (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(255) NOT NULL,
            issuing_organization VARCHAR(255) NOT NULL,
            issue_date DATE NOT NULL,
            expiry_date DATE,
            credential_id VARCHAR(100),
            credential_url VARCHAR(255),
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await pool.query(query);
}

async function addCertificate(userId, certificateData) {
    const { title, issuing_organization, issue_date, expiry_date, credential_id, credential_url, description } = certificateData;
    const query = `
        INSERT INTO user_certificates 
        (user_id, title, issuing_organization, issue_date, expiry_date, credential_id, credential_url, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`;
    const values = [userId, title, issuing_organization, issue_date, expiry_date, credential_id, credential_url, description];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

async function getCertificatesByUser(userId) {
    const { rows } = await pool.query(
        "SELECT * FROM user_certificates WHERE user_id = $1 ORDER BY issue_date DESC",
        [userId]
    );
    return rows;
}

async function updateCertificate(id, userId, certificateData) {
    const { title, issuing_organization, issue_date, expiry_date, credential_id, credential_url, description } = certificateData;
    const query = `
        UPDATE user_certificates SET
        title = $1,
        issuing_organization = $2,
        issue_date = $3,
        expiry_date = $4,
        credential_id = $5,
        credential_url = $6,
        description = $7,
        updated_at = NOW()
        WHERE id = $8 AND user_id = $9
        RETURNING *`;
    const values = [title, issuing_organization, issue_date, expiry_date, credential_id, credential_url, description, id, userId];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

async function deleteCertificate(id, userId) {
    const { rowCount } = await pool.query(
        "DELETE FROM user_certificates WHERE id = $1 AND user_id = $2",
        [id, userId]
    );
    return rowCount > 0;
}

module.exports = {
    createCertificateTable,
    addCertificate,
    getCertificatesByUser,
    updateCertificate,
    deleteCertificate
};