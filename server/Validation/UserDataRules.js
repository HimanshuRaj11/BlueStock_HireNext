const { check } = require("express-validator");
const { parsePhoneNumberFromString } = require("libphonenumber-js");
const { pool } = require("../Utils/DBconnect");

const nameRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\u00c0-\u00ff\s'-]{2,50}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

exports.checkRegisterInput = [
    check("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .matches(emailRegex).withMessage("Invalid email format")
        .normalizeEmail()
        .custom(async (email) => {
            const { rows } = await pool.query(
                "SELECT id FROM users WHERE email = $1 AND signup_type != 'g'", 
                [email.toLowerCase()]
            );
            if (rows.length > 0) {
                throw new Error("Email already registered (non-Google account)");
            }
            return true;
        }),

    check("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password is too short (min 8)"),
];

exports.checkLoginInput = [
    check("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email"),

    check("password").trim().notEmpty().withMessage("Password is required"),
];

exports.checkGoogleAuthInput = [
    check("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email"),
    check("google_uid").trim().notEmpty().withMessage("Google UID is required"),
];

exports.checkUserUpdateInput = [
    check('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores')
        .custom(async (username, { req }) => {
            // Only check if username is actually being changed
            if (username && username !== req.user.username) {
                const { rows } = await pool.query(
                    'SELECT id FROM users WHERE username = $1 AND id != $2', 
                    [username, req.user.id]
                );
                if (rows.length > 0) {
                    throw new Error('Username already taken');
                }
            }
            return true;
        }),
    check("email").trim(),
    check("heading")
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Heading must be 200 characters or less')
        .customSanitizer(value => value === '' ? null : value),
    check("location").trim(),
    check("gender").trim(),
    check("role").trim(),
    check("resume").trim(),
    check("dob").optional().isDate().withMessage("Invalid date format"),
    check("preference").optional().isInt({ min: 1, max: 3 }).withMessage("Preference must be 1, 2, or 3"),
    check("mobile_no").optional().custom((value) => {
        if (!value) return true;
        const phoneNumber = parsePhoneNumberFromString(value);
        return phoneNumber && phoneNumber.isValid();
    }).withMessage("Invalid phone number format. Please use international format (+XX...)")
];