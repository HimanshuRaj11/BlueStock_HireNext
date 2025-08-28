const { pool } = require("../Utils/DBconnect");
const bcrypt = require("bcrypt");

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(16);
    return bcrypt.hash(password, salt);
}

async function createUserTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(100),
            email VARCHAR(255) UNIQUE NOT NULL,
            password TEXT,
            full_name VARCHAR(255),
            profile_photo TEXT,
            google_uid VARCHAR(255) UNIQUE,
            signup_type VARCHAR(1) DEFAULT 'e' CHECK (signup_type IN ('g', 'e', 'm')),
            location TEXT,
            gender CHAR(1) CHECK (gender IS NULL OR gender IN ('M', 'F')),
            role INTEGER DEFAULT 3 CHECK (role IN (1, 2, 3)),
            resume TEXT,
            dob DATE,  
            preference INTEGER CHECK (preference IN (1, 2, 3)),
            mobile_no VARCHAR(20) CHECK (mobile_no IS NULL OR mobile_no ~ '^\\+[1-9]\\d{1,14}$'),
            ac_status INTEGER DEFAULT 1 CHECK (ac_status IN (1, 2, 3)),
            heading VARCHAR(200),
            is_mail_verified BOOLEAN DEFAULT FALSE,
            is_mo_verified BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await pool.query(query);
}

// Helper to find or create Google user
async function findOrCreateGoogleUser(googleUser) {
    const { email, full_name, profile_photo, google_uid } = googleUser;
    
    const { rows: existingByGoogle } = await pool.query(
        "SELECT * FROM users WHERE google_uid = $1", 
        [google_uid]
    );
    
    if (existingByGoogle.length) {
        return existingByGoogle[0];
    }

    const { rows: existingByEmail } = await pool.query(
        "SELECT * FROM users WHERE email = $1", 
        [email]
    );
    
    if (existingByEmail.length) {
        await pool.query(
            `UPDATE users 
            SET google_uid = $1, signup_type = 'g', full_name = $2, profile_photo = $3, is_mail_verified = TRUE 
            WHERE email = $4`,
            [google_uid, full_name, profile_photo, email]
        );
        // Re-fetch updated user
        const { rows: updatedUser } = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        return updatedUser[0];
    }

    const { rows: countResult } = await pool.query("SELECT COUNT(*) FROM users");
    const userCount = parseInt(countResult[0].count, 10);
    const role = userCount === 0 ? 1 : 3;
    const nameParts = full_name.trim().split(/\s+/);
    const first_name = nameParts[0] || '';
    const last_name = nameParts.slice(1).join(' ') || '';

    const { rows: newUser } = await pool.query(
        `INSERT INTO users 
        (email, full_name, first_name, last_name, profile_photo, google_uid, signup_type, role, dob, preference, mobile_no, ac_status, is_mail_verified) 
        VALUES ($1, $2, $3, $4, $5, $6, 'g', $7, NULL, NULL, NULL, 1, TRUE) 
        RETURNING *`,
        [email, full_name, first_name, last_name, profile_photo, google_uid, role]
    );

    return newUser[0];
}

async function findOrCreateGoogleRecruiter(googleUser) {
    const { email, full_name, profile_photo, google_uid } = googleUser;

    const { rows: existingByGoogle } = await pool.query(
        "SELECT * FROM users WHERE google_uid = $1", 
        [google_uid]
    );

    if (existingByGoogle.length) {
        return existingByGoogle[0];
    }

    const { rows: existingByEmail } = await pool.query(
        "SELECT * FROM users WHERE email = $1", 
        [email]
    );

    if (existingByEmail.length) {
        await pool.query(
            `UPDATE users 
            SET google_uid = $1, signup_type = 'g', full_name = $2, profile_photo = $3, is_mail_verified = TRUE 
            WHERE email = $4`,
            [google_uid, full_name, profile_photo, email]
        );
        const { rows: updatedUser } = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        return updatedUser[0];
    }

    const nameParts = full_name.trim().split(/\s+/);
    const first_name = nameParts[0] || '';
    const last_name = nameParts.slice(1).join(' ') || '';

    const { rows: newUser } = await pool.query(
        `INSERT INTO users 
        (email, full_name, first_name, last_name, profile_photo, google_uid, signup_type, role, dob, preference, mobile_no, ac_status, is_mail_verified) 
        VALUES ($1, $2, $3, $4, $5, $6, 'g', 2, NULL, NULL, NULL, 1, TRUE) 
        RETURNING *`,
        [email, full_name, first_name, last_name, profile_photo, google_uid]
    );

    return newUser[0];
}


module.exports = {
    createUserTable,
    hashPassword,
    findOrCreateGoogleUser,
    findOrCreateGoogleRecruiter
};