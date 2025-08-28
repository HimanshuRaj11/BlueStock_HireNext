const WorkExperience = require("../Model/WorkExperienceModel");
const { checkWorkExperienceInput } = require("../Validation/WorkExperienceValidation");

exports.createWorkExperience = async (req, res) => {
    try {
        const experience = await WorkExperience.createWorkExperience({
            user_id: req.user.id,
            ...req.body
        });
        res.status(201).json(experience);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getWorkExperiences = async (req, res) => {
    try {
        const experiences = await WorkExperience.getWorkExperiences(req.user.id);
        res.json(experiences);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateWorkExperience = async (req, res) => {
    try {
        const experience = await WorkExperience.updateWorkExperience(
            req.params.id,
            req.body
        );
        if (!experience) {
            return res.status(404).json({ message: "Experience not found" });
        }
        res.json(experience);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteWorkExperience = async (req, res) => {
    try {
        await WorkExperience.deleteWorkExperience(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};