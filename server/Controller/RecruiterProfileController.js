const { pool } = require("../Utils/DBconnect");
const createError = require("http-errors");
const { 
    getRecruiterProfile, 
    upsertRecruiterProfile,
    getRecruiterSkills,
    addRecruiterSkills,
    updateRecruiterSkills,
    removeRecruiterSkill
} = require("../Model/RecruiterProfileModel");

const getProfile = async (req, res, next) => {
    try {
        const profile = await getRecruiterProfile(req.user.id);
        if (!profile) {
            return next(createError(404, "Recruiter profile not found"));
        }
        res.status(200).json({ status: true, result: profile });
    } catch (error) {
        next(createError(500, error.message));
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const updatedProfile = await upsertRecruiterProfile(req.user.id, req.body);
        res.status(200).json({ 
            status: true, 
            message: "Profile updated successfully",
            result: updatedProfile 
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};

const getSkills = async (req, res, next) => {
    try {
        const skills = await getRecruiterSkills(req.user.id);
        res.status(200).json({ 
            status: true, 
            skills
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};

const addSkills = async (req, res, next) => {
    try {
        if (!Array.isArray(req.body.skills)) {
            return next(createError(400, "Skills should be an array"));
        }
        const profile = await addRecruiterSkills(req.user.id, req.body.skills);
        res.status(200).json({ 
            status: true, 
            message: "Skills added successfully",
            result: profile 
        });
    } catch (error) {
        next(createError(400, error.message));
    }
};

const updateSkills = async (req, res, next) => {
    try {
        if (!Array.isArray(req.body.skills)) {
            return next(createError(400, "Skills should be an array"));
        }
        const profile = await updateRecruiterSkills(req.user.id, req.body.skills);
        res.status(200).json({ 
            status: true, 
            message: "Skills updated successfully",
            result: profile 
        });
    } catch (error) {
        next(createError(400, error.message));
    }
};

const removeSkill = async (req, res, next) => {
    try {
        const profile = await removeRecruiterSkill(req.user.id, req.body.skillId);
        res.status(200).json({ 
            status: true, 
            message: "Skill removed successfully",
            result: profile 
        });
    } catch (error) {
        next(createError(400, error.message));
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getSkills,
    addSkills,
    updateSkills,
    removeSkill
};