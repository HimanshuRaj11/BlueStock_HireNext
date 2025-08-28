const Skill = require("../Model/SkillModel");

exports.searchSkills = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.status(400).json({
        status: 'error',
        message: 'Search term must be at least 2 characters'
      });
    }
    const skills = await Skill.findSkillsByName(q);
    res.json({
      status: 'success',
      data: skills
    });
  } catch (error) {
    console.error('Search skills error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

exports.getSkillsByIds = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid skill IDs provided'
      });
    }
    const skills = await Skill.findSkillsByIds(ids);
    res.json({
      status: 'success',
      data: skills
    });
  } catch (error) {
    console.error('Get skills by IDs error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.getAllSkills();
    res.json({
      status: 'success',
      data: skills
    });
  } catch (error) {
    console.error('Get all skills error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

exports.getSuggestedSkills = async (req, res) => {
  try {
    const suggestedSkills = await Skill.findSuggestedSkills();
    
    if (!suggestedSkills || suggestedSkills.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No suggested skills found'
      });
    }

    res.json({
      status: 'success',
      data: suggestedSkills
    });
  } catch (error) {
    console.error('Get suggested skills error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};