const { pool } = require("../Utils/DBconnect");

async function createProjectTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS user_projects (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            project_url VARCHAR(255),
            start_date DATE NOT NULL,
            end_date DATE,
            is_ongoing BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS project_skill_map (
            project_id INTEGER REFERENCES user_projects(id) ON DELETE CASCADE,
            skill_id INTEGER REFERENCES master_skills_list(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (project_id, skill_id)
        );
    `;
    await pool.query(query);
}

async function addProject(userId, projectData) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const { title, description, skills, project_url, start_date, end_date, is_ongoing } = projectData;
        
        // Insert project
        const projectQuery = `
            INSERT INTO user_projects 
            (user_id, title, description, project_url, start_date, end_date, is_ongoing)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`;
        const projectValues = [
            userId, 
            title, 
            description,
            project_url, 
            start_date, 
            is_ongoing ? null : end_date, 
            is_ongoing
        ];
        const projectResult = await client.query(projectQuery, projectValues);
        const newProject = projectResult.rows[0];

        // Insert skill mappings if there are any skills
        if (skills && skills.length > 0) {
            const processedSkills = skills.map(skill => parseInt(skill)).filter(skill => !isNaN(skill));
            if (processedSkills.length > 0) {
                const skillMapQuery = `
                    INSERT INTO project_skill_map (project_id, skill_id)
                    VALUES ${processedSkills.map((_, i) => `($${i*2+1}, $${i*2+2})`).join(', ')}
                `;
                const skillMapValues = processedSkills.flatMap(skillId => [newProject.id, skillId]);
                await client.query(skillMapQuery, skillMapValues);
            }
        }

        await client.query('COMMIT');
        return { ...newProject, skills: skills || [] };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function getProjectsByUser(userId) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Get projects
        const projectQuery = `
            SELECT * FROM user_projects 
            WHERE user_id = $1 
            ORDER BY start_date DESC
        `;
        const projectResult = await client.query(projectQuery, [userId]);
        
        if (projectResult.rows.length === 0) {
            await client.query('COMMIT');
            return [];
        }
        
        // Get skill IDs for each project
        const skillMapQuery = `
            SELECT skill_id, project_id 
            FROM project_skill_map 
            WHERE project_id = ANY($1)
        `;
        const projectIds = projectResult.rows.map(row => row.id);
        const skillMapResult = await client.query(skillMapQuery, [projectIds]);
        
        await client.query('COMMIT');
        
        // Combine the data
        const projects = projectResult.rows.map(project => {
            const skills = skillMapResult.rows
                .filter(row => row.project_id === project.id)
                .map(row => row.skill_id);
            return { ...project, skills };
        });
        
        return projects;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function updateProject(id, userId, projectData) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const { title, description, skills, project_url, start_date, end_date, is_ongoing } = projectData;
        
        // Update project
        const projectQuery = `
            UPDATE user_projects SET
            title = $1,
            description = $2,
            project_url = $3,
            start_date = $4,
            end_date = $5,
            is_ongoing = $6,
            updated_at = NOW()
            WHERE id = $7 AND user_id = $8
            RETURNING *`;
        const projectValues = [
            title, 
            description,
            project_url, 
            start_date, 
            is_ongoing ? null : end_date, 
            is_ongoing, 
            id, 
            userId
        ];
        const projectResult = await client.query(projectQuery, projectValues);
        const updatedProject = projectResult.rows[0];

        // Update skill mappings
        // First delete existing mappings
        await client.query(
            'DELETE FROM project_skill_map WHERE project_id = $1',
            [id]
        );
        
        // Then insert new mappings if there are any skills
        if (skills && skills.length > 0) {
            const processedSkills = skills.map(skill => parseInt(skill)).filter(skill => !isNaN(skill));
            if (processedSkills.length > 0) {
                const skillMapQuery = `
                    INSERT INTO project_skill_map (project_id, skill_id)
                    VALUES ${processedSkills.map((_, i) => `($${i*2+1}, $${i*2+2})`).join(', ')}
                `;
                const skillMapValues = processedSkills.flatMap(skillId => [id, skillId]);
                await client.query(skillMapQuery, skillMapValues);
            }
        }

        await client.query('COMMIT');
        return { ...updatedProject, skills: skills || [] };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function deleteProject(id, userId) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        await client.query(
            'DELETE FROM project_skill_map WHERE project_id = $1',
            [id]
        );
        
        // Then delete from projects
        const { rowCount } = await client.query(
            "DELETE FROM user_projects WHERE id = $1 AND user_id = $2",
            [id, userId]
        );
        
        await client.query('COMMIT');
        return rowCount > 0;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    createProjectTable,
    addProject,
    getProjectsByUser,
    updateProject,
    deleteProject
};