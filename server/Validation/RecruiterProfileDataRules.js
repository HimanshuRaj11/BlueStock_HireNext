const { body } = require("express-validator");

exports.checkRecruiterProfileInput = [
    body("purpose")
        .notEmpty().withMessage("Purpose is required")
        .isIn(["hire", "host_hackathon"]).withMessage("Invalid purpose"),
    
    body("designation")
        .notEmpty().withMessage("Designation is required")
        .isLength({ max: 100 }).withMessage("Designation too long"),
        
    body("work_experience_years")
        .notEmpty().withMessage("Work experience is required")
        .isFloat({ min: 0 }).withMessage("Invalid work experience")
        .toFloat()  
        .custom(value => {
            const decimalPlaces = (value.toString().split('.')[1] || []).length;
            return decimalPlaces <= 1;
        }).withMessage("Only 1 decimal place allowed"),
        
    body("current_company")
        .notEmpty().withMessage("Company name is required")
        .isLength({ max: 255 }).withMessage("Company name too long"),
        
    body("company_email")
        .notEmpty().withMessage("Company email is required")
        .isEmail().withMessage("Invalid company email"),
        
    body("about")
        .optional()
        .isString().withMessage("About must be text"),
        
    body("full_address")
        .optional()
        .isString().withMessage("Address must be text"),
        
    body("social_links")
        .optional()
        .isObject().withMessage("Social links must be an object")
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

exports.checkRecruiterSkillsInput = [
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