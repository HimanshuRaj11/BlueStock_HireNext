const Category = require("../Model/CategoryModel");

exports.searchCategories = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) {
            return res.status(400).json({
                status: 'error',
                message: 'Search term must be at least 2 characters'
            });
        }
        const categories = await Category.findCategoryByName(q);
        res.json({
            status: 'success',
            data: categories
        });
    } catch (error) {
        console.error('Search categories error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findCategoryById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (error) {
        console.error('Get category by ID error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

exports.getCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await Category.findCategoryBySlug(slug);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (error) {
        console.error('Get category by slug error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

exports.getCategoriesByIds = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid category IDs provided'
            });
        }
        const categories = await Category.findCategoryByIds(ids);
        res.json({
            status: 'success',
            data: categories
        });
    } catch (error) {
        console.error('Get categories by IDs error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.getAllCategories();
        res.json({
            status: 'success',
            data: categories
        });
    } catch (error) {
        console.error('Get all categories error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

exports.getSuggestedCategories = async (req, res) => {
    try {
        const suggestedCategories = await Category.getSuggestedCategories();
        if (!suggestedCategories || suggestedCategories.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No suggested categories found'
            });
        }
        res.json({
            status: 'success',
            data: suggestedCategories
        });
    } catch (error) {
        console.error('Get suggested categories error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};