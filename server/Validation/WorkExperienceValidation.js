const { body } = require("express-validator");

exports.checkWorkExperienceInput = [
    body("company_name")
        .notEmpty().withMessage("Company name is required")
        .isLength({ max: 100 }).withMessage("Company name too long"),
        
    body("designation")
        .notEmpty().withMessage("Designation is required")
        .isLength({ max: 100 }).withMessage("Designation too long"),
        
    body("employment_type")
        .notEmpty().withMessage("Employment type is required")
        .isInt({ min: 1, max: 4 }).withMessage("Invalid employment type"),
        
    body("location")
        .notEmpty().withMessage("Location is required")
        .isLength({ max: 100 }).withMessage("Location too long"),
        
    body("start_month")
        .notEmpty().withMessage("Start month is required")
        .isInt({ min: 1, max: 12 }).withMessage("Invalid month"),
        
    body("start_year")
        .notEmpty().withMessage("Start year is required")
        .isInt({ min: 1900, max: new Date().getFullYear() }).withMessage("Invalid year"),
        
    body("end_month")
        .optional()
        .isInt({ min: 1, max: 12 }).withMessage("Invalid month"),
        
    body("end_year")
        .optional()
        .isInt({ min: 1900 }).withMessage("Invalid year"),
        
    body("currently_working")
        .optional()
        .isBoolean().withMessage("Currently working must be boolean"),
        
    body("description")
        .optional()
        .isLength({ max: 10000 }).withMessage("Description too long")
];