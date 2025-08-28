const UserProfile = require("../Model/UserProfileModel");

exports.getUserProfile = async (req, res) => {
    try {
        const profile = await UserProfile.getUserProfile(req.user.id);
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createUserProfile = async (req, res) => {
    try {
        const profile = await UserProfile.createUserProfile({
            user_id: req.user.id,
            ...req.body
        });
        res.status(201).json(profile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const profile = await UserProfile.updateUserProfile(
            req.user.id,
            req.body
        );
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.json(profile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateAbout = async (req, res) => {
    try {
        const profile = await UserProfile.updateAbout(
            req.user.id,
            {
                about: req.body.about,
                full_address: req.body.full_address
            }
        );
        if (!profile) {
            return res.status(404).json({ message: "Complete current details first" });
        }
        res.json(profile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateSocialLinks = async (req, res) => {
    try {
        const profile = await UserProfile.updateSocialLinks(
            req.user.id,
            req.body.social_links
        );
        if (!profile) {
            return res.status(404).json({ message: "Complete current details first" });
        }
        res.json(profile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getSkills = async (req, res) => {
    try {
        // First check if profile exists
        const profile = await UserProfile.getUserProfile(req.user.id);
        if (!profile) {
            return res.status(404).json({ message: "Complete current details first" });
        }
        
        const skills = await UserProfile.getSkills(req.user.id);
        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
};

exports.addSkills = async (req, res) => {
    try {
        if (!Array.isArray(req.body.skills)) {
            return res.status(400).json({ message: "Skills should be an array" });
        }
        
        // First check if profile exists
        const profile = await UserProfile.getUserProfile(req.user.id);
        if (!profile) {
            return res.status(404).json({ message: "Complete current details first" });
        }
        
        const updatedSkills = await UserProfile.addSkills(req.user.id, req.body.skills);
        res.json(updatedSkills);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateSkills = async (req, res) => {
    try {
        if (!Array.isArray(req.body.skills)) {
            return res.status(400).json({ message: "Skills should be an array" });
        }
        
        // First check if profile exists
        const profile = await UserProfile.getUserProfile(req.user.id);
        if (!profile) {
            return res.status(404).json({ message: "Complete current details first" });
        }
        
        const updatedSkills = await UserProfile.updateSkills(req.user.id, req.body.skills);
        res.json(updatedSkills);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.removeSkill = async (req, res) => {
    try {
        // First check if profile exists
        const profile = await UserProfile.getUserProfile(req.user.id);
        if (!profile) {
            return res.status(404).json({ message: "Complete current details first" });
        }
        
        const updatedSkills = await UserProfile.removeSkill(req.user.id, req.body.skill);
        res.json(updatedSkills);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};