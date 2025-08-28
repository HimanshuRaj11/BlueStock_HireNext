const createError = require("http-errors");
const {
    addEducation,
    getEducationByUser,
    updateEducation,
    deleteEducation
} = require("../Model/EducationModel");
const { pool } = require("../Utils/DBconnect");

const addEducationRecord = async (req, res, next) => {
    try {
        if (req.user.role !== 3 && req.user.role !== 2) {
            throw createError(403, "Only regular users and recruiters can add education records");
        }
        const education = await addEducation(req.user.id, req.body);
        res.status(201).json({ status: true, result: education });
    } catch (error) {
        next(error);
    }
};

const getUserEducation = async (req, res, next) => {
    try {
        const education = await getEducationByUser(req.user.id);
        res.status(200).json({ status: true, result: education });
    } catch (error) {
        next(error);
    }
};

const getEducationByUserId = async (req, res, next) => {
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

        // Get education records
        const { rows } = await pool.query(
            "SELECT * FROM education WHERE user_id = $1 ORDER BY end_year DESC",
            [userId]
        );

        res.status(200).json({
            status: true,
            result: rows
        });
    } catch (error) {
        console.error("Error fetching education:", error);
        next(createError(500, "Failed to fetch education records"));
    }
};

const updateEducationRecord = async (req, res, next) => {
    try {
        if (req.user.role !== 3 && req.user.role !== 2) {
            throw createError(403, "Only regular users and recruiters can update education records");
        }
        const updated = await updateEducation(
            req.params.id,
            req.user.id,
            req.body
        );
        if (!updated) throw createError(404, "Education record not found");
        res.status(200).json({ status: true, result: updated });
    } catch (error) {
        next(error);
    }
};

const deleteEducationRecord = async (req, res, next) => {
    try {
        if (req.user.role !== 3 && req.user.role !== 2) {
            throw createError(403, "Only regular users and recruiters can delete education records");
        }
        const deleted = await deleteEducation(req.params.id, req.user.id);
        if (!deleted) throw createError(404, "Education record not found");
        res.status(200).json({ status: true, message: "Education record deleted" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addEducationRecord,
    getUserEducation,
    updateEducationRecord,
    getEducationByUserId,
    deleteEducationRecord
};