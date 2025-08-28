const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const { pool } = require("../Utils/DBconnect"); // PostgreSQL connection

exports.authenticateUser = async (req, res, next) => {
    const token = req.signedCookies[process.env.COOKIE_NAME];

    if (!token) {
        return next(createHttpError(401, "Unauthorized User"));
    }

    try {
        const { ID, role } = jwt.verify(token, process.env.JWT_SECRET);

        // Query the PostgreSQL user table
        const result = await pool.query(
            "SELECT id, username, email, full_name, profile_photo, location, gender, role, dob, preference, mobile_no, resume FROM users WHERE id = $1 AND role = $2",
            [ID, role]
        );

        if (result.rows.length === 0) {
            return next(createHttpError(401, "Unauthorized User"));
        }

        req.user = result.rows[0]; // attach user info to request
        next();
    } catch (error) {
        return next(createHttpError(401, "Unauthorized User"));
    }
};
