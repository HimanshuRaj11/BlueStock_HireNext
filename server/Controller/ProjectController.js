const createError = require("http-errors");
const {
    addProject,
    getProjectsByUser,
    updateProject,
    deleteProject
} = require("../Model/ProjectModel");
const { pool } = require("../Utils/DBconnect");

const addProjectRecord = async (req, res, next) => {
    try {
        if (req.user.role !== 3) {
            throw createError(403, "Only regular users can add project records");
        }
        const project = await addProject(req.user.id, req.body);
        res.status(201).json({ status: true, result: project });
    } catch (error) {
        next(error);
    }
};

const getUserProjects = async (req, res, next) => {
    try {
        const projects = await getProjectsByUser(req.user.id);
        res.status(200).json({ status: true, result: projects });
    } catch (error) {
        next(error);
    }
};

const getProjectsByUserId = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        
        // Verify the user exists
        const userCheck = await pool.query(
            "SELECT id FROM users WHERE id = $1",
            [userId]
        );
        
        if (userCheck.rowCount === 0) {
            return next(createError(404, "User not found"));
        }

        // Get project records
        const { rows } = await pool.query(
            "SELECT * FROM user_projects WHERE user_id = $1 ORDER BY start_date DESC",
            [userId]
        );

        res.status(200).json({
            status: true,
            result: rows
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
        next(createError(500, "Failed to fetch project records"));
    }
};

const updateProjectRecord = async (req, res, next) => {
    try {
        if (req.user.role !== 3) {
            throw createError(403, "Only regular users can update project records");
        }
        const updated = await updateProject(
            req.params.id,
            req.user.id,
            req.body
        );
        if (!updated) throw createError(404, "Project record not found");
        res.status(200).json({ status: true, result: updated });
    } catch (error) {
        next(error);
    }
};

const deleteProjectRecord = async (req, res, next) => {
    try {
        if (req.user.role !== 3) {
            throw createError(403, "Only regular users can delete project records");
        }
        const deleted = await deleteProject(req.params.id, req.user.id);
        if (!deleted) throw createError(404, "Project record not found");
        res.status(200).json({ status: true, message: "Project record deleted" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addProjectRecord,
    getUserProjects,
    updateProjectRecord,
    getProjectsByUserId,
    deleteProjectRecord
};