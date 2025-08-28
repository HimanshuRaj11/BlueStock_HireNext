const { check } = require("express-validator");
const moment = require("moment");

exports.checkProjectInput = [
    check("title")
        .trim()
        .notEmpty()
        .withMessage("Project title is required")
        .isLength({ max: 255 })
        .withMessage("Title too long"),

    check("description")
        .optional({ checkFalsy: true })
        .isLength({ max: 2000 })
        .withMessage("Description too long"),

    // Updated validation for skill IDs
    check("skills")
        .optional({ checkFalsy: true })
        .isArray()
        .withMessage("Skills must be an array")
        .custom((skills) => {
            if (skills && !skills.every(skill => Number.isInteger(parseInt(skill)))) {
                throw new Error("All skills must be valid IDs (integers)");
            }
            return true;
        }),

    check("project_url")
        .optional({ checkFalsy: true })
        .isURL()
        .withMessage("Invalid URL format"),

    check("start_date")
        .isDate()
        .withMessage("Invalid start date")
        .custom((value) => {
            if (moment(value).isAfter(moment())) {
                throw new Error("Start date cannot be in the future");
            }
            return true;
        }),

    check("end_date")
        .optional({ checkFalsy: true })
        .isDate()
        .withMessage("Invalid end date")
        .custom((value, { req }) => {
            if (value && !req.body.is_ongoing && moment(value).isBefore(moment(req.body.start_date))) {
                throw new Error("End date must be after start date");
            }
            return true;
        }),

    check("is_ongoing")
        .optional()
        .isBoolean()
        .withMessage("Invalid value for ongoing status")
];