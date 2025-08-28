const { body } = require("express-validator");
const { pool } = require("../Utils/DBconnect");
const sanitizeHtml = require("sanitize-html");

exports.checkUserProfileInput = [
    body("user_type")
        .notEmpty().withMessage("Please select your user type (Student, Professional, etc.)")
        .isInt({ min: 1, max: 4 }).withMessage("Invalid user type selected")
        .toInt(),
        
    body("course_name")
        .if(body("user_type").isIn([1, 3, 4]))
        .notEmpty().withMessage("Course name is required for students")
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("Course name must be between 2-100 characters")
        .escape(),
        
    body("specialization")
        .if(body("user_type").isIn([1, 3, 4]))
        .notEmpty().withMessage("Specialization is required for students")
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("Specialization must be between 2-100 characters")
        .escape(),
        
    body("start_year")
        .notEmpty().withMessage("Please enter your start year")
        .isInt({ min: 1900, max: new Date().getFullYear() })
        .withMessage(`Year must be between 1900-${new Date().getFullYear()}`)
        .toInt()
        .custom((value, { req }) => {
            if (req.body.end_year && !req.body.currently_working && value > req.body.end_year) {
                throw new Error("Start year cannot be after end year");
            }
            return true;
        }),
        
    body("end_year")
        .optional()
        .isInt({ min: 1900 }).withMessage("Invalid graduation year")
        .toInt()
        .custom((value, { req }) => {
            const currentYear = new Date().getFullYear();
            if (value > currentYear + 5) {
                throw new Error(`End year cannot be more than 5 years in the future (${currentYear + 5})`);
            }
            if (!req.body.currently_working && value && value < req.body.start_year) {
                throw new Error("Graduation year must be after start year");
            }
            return true;
        }),
        
    body("designation")
        .if(body("user_type").equals(2))
        .notEmpty().withMessage("Job title is required for professionals")
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("Job title must be between 2-100 characters")
        .escape(),
        
    body("work_experience")
        .if(body("user_type").equals(2))
        .notEmpty().withMessage("Please enter your work experience")
        .isFloat({ min: 0, max: 100 }).withMessage("Experience must be between 0-100 years")
        .toFloat(),
        
    body("currently_working")
        .optional()
        .isBoolean().withMessage("Currently Ongoing status must be true or false")
        .toBoolean(),
        
    body("purposes")
        .notEmpty().withMessage("Please select at least one purpose")
        .customSanitizer(value => {
            return Array.isArray(value) ? value : value.toString().split(',').map(p => parseInt(p.trim()));
        })
        .isArray({ min: 1 }).withMessage("Please select at least one purpose")
        .custom((purposes) => {
            const validPurposes = [1, 2, 3, 4];
            if (!purposes.every(p => validPurposes.includes(p))) {
                throw new Error("Invalid purpose selected");
            }
            if (new Set(purposes).size !== purposes.length) {
                throw new Error("Duplicate purposes are not allowed");
            }
            return true;
        }),
        
    body("college_org_name")
        .notEmpty().withMessage("Institution/company name is required")
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2-100 characters")
        .escape()
];

exports.checkAboutInput = [
    body("about")
        .optional()
        .trim()
        .isString().withMessage("About must be text")
        .isLength({ min: 10, max: 2000 })
        .withMessage("About must be between 10-2000 characters")
        .customSanitizer(value => sanitizeHtml(value, {
            allowedTags: [],
            allowedAttributes: {}
        })),
        
    body("full_address")
        .optional()
        .trim()
        .isString().withMessage("Address must be text")
        .isLength({ min: 5, max: 500 })
        .withMessage("Address must be between 5-500 characters")
        .escape()
];

exports.checkSocialLinksInput = [
    body("social_links")
        .optional()
        .isObject()
        .withMessage("Social links must be an object")
        .custom((socialLinks) => {
            if (socialLinks) {
                for (const [key, value] of Object.entries(socialLinks)) {
                    if (value && typeof value === 'string' && !value.startsWith('https://')) {
                        throw new Error(`Social link for ${key} must start with https://`);
                    }
                }
            }
            return true;
        })
];

// Add this to your existing validation exports
exports.checkSkillsInput = [
    body('skills')
        .isArray({ min: 1, max: 20 }).withMessage('You must select 1-20 skills')
        .customSanitizer(skills => [...new Set(skills)])
        .custom(async (skills) => {
            if (skills.length > 20) {
                throw new Error('You cannot have more than 20 skills');
            }
            if (!skills.every(skill => Number.isInteger(skill))) {
                throw new Error('All skill IDs must be integers');
            }
            
            const { rows } = await pool.query(
                'SELECT id FROM skills WHERE id = ANY($1::int[])',
                [skills]
            );
            
            if (rows.length !== skills.length) {
                const validIds = rows.map(r => r.id);
                const invalidIds = skills.filter(id => !validIds.includes(id));
                throw new Error(`Invalid skill IDs: ${invalidIds.join(', ')}`);
            }
            
            return true;
        })
        .withMessage('Some skills are not valid')
];