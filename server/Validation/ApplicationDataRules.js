const { check } = require("express-validator");
const { STATUS } = require("../Utils/ApplicationConstants");

exports.checkInput = [
    check("applicant_id")
        .trim()
        .notEmpty()
        .withMessage("Application must have an Applicant ID")
        .isInt()
        .withMessage("Invalid Applicant ID format")
        .toInt(),

    check("recruiter_id")
        .trim()
        .notEmpty()
        .withMessage("Application must have a Recruiter ID")
        .isInt()
        .withMessage("Invalid Recruiter ID format")
        .toInt(),

    check("job_id")
        .trim()
        .notEmpty()
        .withMessage("Application must have a Job ID")
        .isInt()
        .withMessage("Invalid Job ID format")
        .toInt(),

    check("status")
        .isIn(Object.values(STATUS))
        .withMessage("Invalid job status"),

    check("dateOfApplication")
        .notEmpty()
        .withMessage("Application Date is required")
        .isISO8601()
        .withMessage("Invalid date format. Please use ISO8601 date."),

    check("resume")
        .notEmpty()
        .withMessage("Applicant's Resume is required")
        .isURL()
        .withMessage("Invalid URL. Please provide a valid URL."),
];
