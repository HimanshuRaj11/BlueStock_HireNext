const { pool } = require("../Utils/DBconnect");

async function createWorkExperienceTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS work_experience (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            company_name VARCHAR(100) NOT NULL,
            designation VARCHAR(100) NOT NULL,
            employment_type INTEGER NOT NULL CHECK (employment_type BETWEEN 1 AND 4),
            location VARCHAR(100) NOT NULL,
            start_month INTEGER NOT NULL CHECK (start_month BETWEEN 1 AND 12),
            start_year INTEGER NOT NULL,
            end_month INTEGER CHECK (end_month BETWEEN 1 AND 12),
            end_year INTEGER,
            currently_working BOOLEAN DEFAULT FALSE,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS work_experience_skill_map (
            work_experience_id INTEGER REFERENCES work_experience(id) ON DELETE CASCADE,
            skill_id INTEGER REFERENCES master_skills_list(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (work_experience_id, skill_id)
        );
    `;
    await pool.query(query);
}

async function getWorkExperiences(userId) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Get work experiences
        const workExpQuery = `
            SELECT * FROM work_experience 
            WHERE user_id = $1 
            ORDER BY start_year DESC, start_month DESC
        `;
        const workExpResult = await client.query(workExpQuery, [userId]);
        
        if (workExpResult.rows.length === 0) {
            await client.query('COMMIT');
            return [];
        }
        
        // Get skill IDs for each work experience
        const skillMapQuery = `
            SELECT skill_id, work_experience_id 
            FROM work_experience_skill_map 
            WHERE work_experience_id = ANY($1)
        `;
        const workExpIds = workExpResult.rows.map(row => row.id);
        const skillMapResult = await client.query(skillMapQuery, [workExpIds]);
        
        await client.query('COMMIT');
        
        // Combine the data
        const experiences = workExpResult.rows.map(exp => {
            const skills = skillMapResult.rows
                .filter(row => row.work_experience_id === exp.id)
                .map(row => row.skill_id);
            return { ...exp, skills };
        });
        
        return experiences;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function createWorkExperience(experienceData) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        let skills = experienceData.skills || [];
        if (typeof skills === 'string') {
            skills = skills.split(',').map(s => s.trim()).filter(s => s);
        } else if (!Array.isArray(skills)) {
            skills = [];
        }
        
        // Insert work experience
        const workExpQuery = `
            INSERT INTO work_experience (
                user_id, company_name, designation, employment_type, location,
                start_month, start_year, end_month, end_year, currently_working, 
                description
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `;
        const workExpResult = await client.query(workExpQuery, [
            experienceData.user_id,
            experienceData.company_name,
            experienceData.designation,
            experienceData.employment_type,
            experienceData.location,
            experienceData.start_month,
            experienceData.start_year,
            experienceData.end_month,
            experienceData.end_year,
            experienceData.currently_working,
            experienceData.description
        ]);
        
        const newExperience = workExpResult.rows[0];
        
        // Insert skill mappings if there are any skills
        if (skills.length > 0) {
            const skillMapQuery = `
                INSERT INTO work_experience_skill_map (work_experience_id, skill_id)
                VALUES ${skills.map((_, i) => `($${i*2+1}, $${i*2+2})`).join(', ')}
            `;
            const skillMapValues = skills.flatMap(skillId => [newExperience.id, skillId]);
            await client.query(skillMapQuery, skillMapValues);
        }
        
        await client.query('COMMIT');
        return { ...newExperience, skills };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function updateWorkExperience(id, experienceData) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        let skills = experienceData.skills || [];
        if (typeof skills === 'string') {
            skills = skills.split(',').map(s => s.trim()).filter(s => s);
        } else if (!Array.isArray(skills)) {
            skills = [];
        }
        
        // Update work experience
        const workExpQuery = `
            UPDATE work_experience SET
                company_name = $1,
                designation = $2,
                employment_type = $3,
                location = $4,
                start_month = $5,
                start_year = $6,
                end_month = $7,
                end_year = $8,
                currently_working = $9,
                description = $10,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $11
            RETURNING *
        `;
        const workExpResult = await client.query(workExpQuery, [
            experienceData.company_name,
            experienceData.designation,
            experienceData.employment_type,
            experienceData.location,
            experienceData.start_month,
            experienceData.start_year,
            experienceData.end_month,
            experienceData.end_year,
            experienceData.currently_working,
            experienceData.description,
            id
        ]);
        
        const updatedExperience = workExpResult.rows[0];
        
        // Update skill mappings
        // First delete existing mappings
        await client.query(
            'DELETE FROM work_experience_skill_map WHERE work_experience_id = $1',
            [id]
        );
        
        // Then insert new mappings if there are any skills
        if (skills.length > 0) {
            const skillMapQuery = `
                INSERT INTO work_experience_skill_map (work_experience_id, skill_id)
                VALUES ${skills.map((_, i) => `($${i*2+1}, $${i*2+2})`).join(', ')}
            `;
            const skillMapValues = skills.flatMap(skillId => [id, skillId]);
            await client.query(skillMapQuery, skillMapValues);
        }
        
        await client.query('COMMIT');
        return { ...updatedExperience, skills };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function deleteWorkExperience(id) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Delete from skill map first (due to foreign key constraint)
        await client.query(
            'DELETE FROM work_experience_skill_map WHERE work_experience_id = $1',
            [id]
        );
        
        // Then delete from work experience
        await client.query(
            'DELETE FROM work_experience WHERE id = $1',
            [id]
        );
        
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    createWorkExperienceTable,
    getWorkExperiences,
    createWorkExperience,
    updateWorkExperience,
    deleteWorkExperience
};