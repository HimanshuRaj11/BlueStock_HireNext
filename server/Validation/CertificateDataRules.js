const { check } = require("express-validator");
const moment = require("moment");

exports.checkCertificateInput = [
    check("title")
        .trim()
        .notEmpty()
        .withMessage("Certificate title is required")
        .isLength({ max: 255 })
        .withMessage("Title too long"),

    check("issuing_organization")
        .trim()
        .notEmpty()
        .withMessage("Issuing organization is required")
        .isLength({ max: 255 })
        .withMessage("Organization name too long"),

    check("issue_date")
        .isDate()
        .withMessage("Invalid issue date")
        .custom((value) => {
            if (moment(value).isAfter(moment())) {
                throw new Error("Issue date cannot be in the future");
            }
            return true;
        }),

    check("expiry_date")
        .optional({ checkFalsy: true })
        .isDate()
        .withMessage("Invalid expiry date")
        .custom((value, { req }) => {
            if (value && moment(value).isBefore(moment(req.body.issue_date))) {
                throw new Error("Expiry date must be after issue date");
            }
            return true;
        }),

    check("credential_id")
        .optional({ checkFalsy: true })
        .isLength({ max: 100 })
        .withMessage("Credential ID too long"),

    check("credential_url")
        .optional({ checkFalsy: true })
        .isURL()
        .withMessage("Invalid URL format"),

    check("description")
        .optional({ checkFalsy: true })
        .isLength({ max: 2000 })
        .withMessage("Description too long")
];