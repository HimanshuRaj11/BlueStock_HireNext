const { check } = require("express-validator");

exports.checkEducationInput = [
    check("course_name")
        .trim()
        .notEmpty()
        .withMessage("Course name is required")
        .isLength({ max: 100 })
        .withMessage("Course name too long"),

    check("specialization")
        .trim()
        .isLength({ max: 100 })
        .withMessage("Specialization too long"),

    check("college_name")
        .trim()
        .notEmpty()
        .withMessage("College name is required")
        .isLength({ max: 255 })
        .withMessage("College name too long"),

    check("percentage_cgpa")
        .trim()
        .notEmpty()
        .withMessage("Percentage/CGPA is required")
        .isLength({ max: 20 })
        .withMessage("Invalid percentage format"),

    check("start_year")
        .isInt({ min: 1900, max: new Date().getFullYear() })
        .withMessage("Invalid start year"),

    check("end_year")
        .isInt({ min: 1900, max: new Date().getFullYear() + 5 })
        .withMessage("Invalid end year")
        .custom((value, { req }) => {
            if (value < req.body.start_year) {
                throw new Error("End year must be after start year");
            }
            return true;
        })
];