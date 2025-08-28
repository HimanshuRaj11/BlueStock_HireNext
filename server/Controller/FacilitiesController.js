const Facilities = require("../Model/FacilitiesModel");

exports.searchFacilities = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) {
            return res.status(400).json({
                status: 'error',
                message: 'Search term must be at least 2 characters'
            });
        }
        const facilities = await Facilities.findFacilityByName(q);
        res.json({
            status: 'success',
            data: facilities
        });
    } catch (error) {
        console.error('Search facilities error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
}

exports.getFacilitiesById = async (req, res) => {
    try {
        const { id } = req.params;
        const facility = await Facilities.findFacilityById(id);
        if (!facility) {
            return res.status(404).json({ message: "Facility not found" });
        }
        res.json(facility);
    } catch (error) {
        console.error('Get facility by ID error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
}

exports.getFacilitiesByIds = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid facility IDs provided'
            });
        }
        const facilities = await Facilities.findFacilitiesByIds(ids);
        res.json({
            status: 'success',
            data: facilities
        });
    } catch (error) {
        console.error('Get facilities by IDs error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
}

exports.getAllFacilities = async (req, res) => {
    try {
        const facilities = await Facilities.getAllFacilities();
        res.json({
            status: 'success',
            data: facilities
        });
    } catch (error) {
        console.error('Get all facilities error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
}