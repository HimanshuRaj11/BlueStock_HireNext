const { check } = require("express-validator");
const { JOB_TYPE, JOB_STATUS, VISIBILITY_STATUS, WORKPLACE_TYPE } = require("../Utils/JobConstants");

exports.checkJobInput = [
    check("company").trim().notEmpty().withMessage("Job must have a Company"),
    check("position").trim().notEmpty().withMessage("Job must have a Position"),
    check("job_location")
    .if((value, { req }) => req.body.workplace_type !== 1)
    .trim()
    .notEmpty()
    .withMessage("Job location is required for this workplace type")
    .isLength({ min: 3, max: 100 })
    .withMessage("Job location must be between 3 and 100 characters"),
    check("workplace_type").isInt({ min: 1, max: 4 }).withMessage("Invalid workplace type"),
    check("job_status").isIn(Object.values(JOB_STATUS)).withMessage("Invalid job status"),
    check("job_type").isIn(Object.values(JOB_TYPE)).withMessage("Invalid job type"),
    check("job_vacancy").trim().notEmpty().withMessage("Job Vacancy is required"),
    check("salary_type").isIn(['FIXED', 'RANGE', 'FIXED_INCENTIVE', 'UNPAID']).withMessage("Invalid salary type"),
    check("fixed_amount")
        .if((value, { req }) => ['FIXED', 'FIXED_INCENTIVE'].includes(req.body.salary_type))
        .isFloat({ min: 0 }).withMessage("Fixed amount must be a positive number"),
    check("min_amount")
        .if((value, { req }) => req.body.salary_type === 'RANGE')
        .isFloat({ min: 0 }).withMessage("Minimum amount must be a positive number"),
    check("max_amount")
        .if((value, { req }) => req.body.salary_type === 'RANGE')
        .isFloat({ min: 0 }).withMessage("Maximum amount must be a positive number")
        .custom((value, { req }) => {
            if (parseFloat(value) < parseFloat(req.body.min_amount)) {
                throw new Error('Maximum amount must be ≥ minimum amount');
            }
            return true;
        }),
    check("incentive_details")
        .if((value, { req }) => req.body.salary_type === 'FIXED_INCENTIVE')
        .trim().notEmpty().withMessage("Incentive details are required for fixed+incentive type"),
    check("is_salary_hidden").optional().isBoolean().withMessage("Must be true or false"),
    check("is_negotiable").optional().isBoolean().withMessage("Must be true or false"),
    check("currency").optional().isString().isLength({ min: 3, max: 3 }).withMessage("Currency must be 3-letter ISO code"),
    check("salary_period").optional().isIn(['MONTH', 'YEAR', 'HOUR', 'WEEK']).withMessage("Invalid salary period"),
    check("job_deadline").trim().notEmpty().withMessage("Job Deadline is required"),
    check("job_description").trim().notEmpty().withMessage("Job Description is required"),
    check("job_skills").isArray({ min: 1 }).withMessage("Job Skills are required"),
    check("categories").isArray({ min: 1 }).custom(async (categories) => {
            if (categories.length > 10) {
                throw new Error('You cannot have more than 10 categories');
            }
        })
        .withMessage("Job Categories are required"),
    check("job_facilities").isArray({ min: 1 }).withMessage("Job Facilities are required"),
    check("job_contact").trim().notEmpty().withMessage("Job contact is required"),

    check("eligibility").isInt({ min: 1, max: 3 }).withMessage("Invalid eligibility value"),
    
    check("student_currently_studying")
        .if((value, { req }) => req.body.eligibility === 1)
        .notEmpty().withMessage("Student currently studying status is required for college students")
        .isBoolean().withMessage("Must be true or false"),
    
    check("year_selection")
        .if((value, { req }) => req.body.eligibility === 2)
        .isArray({ min: 1 }).withMessage("At least one year must be selected for freshers")
        .custom((years) => {
            const validYears = ['All', '2023', '2024', '2025', '2026', '2027', 
                              '2028', '2029', '2030', '2031', '2032',
                              '2033', '2034', '2035'];
            
            if (years.includes('All') && years.length > 1) {
                throw new Error('Cannot select "All" with other years');
            }
            
            for (const year of years) {
                if (!validYears.includes(year)) {
                    throw new Error(`Invalid year: ${year}`);
                }
            }
            return true;
        }),
    
    check("experience_min")
        .if((value, { req }) => req.body.eligibility === 3)
        .isFloat({ min: 0 }).withMessage("Minimum experience must be a positive number"),
    
    check("experience_max")
        .if((value, { req }) => req.body.eligibility === 3)
        .isFloat({ min: 0 }).withMessage("Maximum experience must be a positive number")
        .custom((value, { req }) => {
            if (parseFloat(value) < parseFloat(req.body.experience_min)) {
                throw new Error('Maximum experience must be ≥ minimum experience');
            }
            return true;
        })
];

exports.checkJobStatusUpdate = [
    check("visibility_status").isInt({ min: 1, max: 4 }).withMessage("Invalid visibility status"),
    check("admin_comment").optional().isString().withMessage("Comment must be a string"),
];