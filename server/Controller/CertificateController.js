const createError = require("http-errors");
const {
    addCertificate,
    getCertificatesByUser,
    updateCertificate,
    deleteCertificate
} = require("../Model/CertificateModel");
const { pool } = require("../Utils/DBconnect");

const addCertificateRecord = async (req, res, next) => {
    try {
        if (req.user.role !== 3) {
            throw createError(403, "Only regular users can add certificate records");
        }
        const certificate = await addCertificate(req.user.id, req.body);
        res.status(201).json({ status: true, result: certificate });
    } catch (error) {
        next(error);
    }
};

const getUserCertificates = async (req, res, next) => {
    try {
        const certificates = await getCertificatesByUser(req.user.id);
        res.status(200).json({ status: true, result: certificates });
    } catch (error) {
        next(error);
    }
};

const getCertificatesByUserId = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        
        // Verify the user exists
        const userCheck = await pool.query(
            "SELECT id FROM users WHERE id = $1",
            [userId]
        );
        
        if (userCheck.rowCount === 0) {
            return next(createError(404, "User not found"));
        }

        // Get certificate records
        const { rows } = await pool.query(
            "SELECT * FROM user_certificates WHERE user_id = $1 ORDER BY issue_date DESC",
            [userId]
        );

        res.status(200).json({
            status: true,
            result: rows
        });
    } catch (error) {
        console.error("Error fetching certificates:", error);
        next(createError(500, "Failed to fetch certificate records"));
    }
};

const updateCertificateRecord = async (req, res, next) => {
    try {
        if (req.user.role !== 3) {
            throw createError(403, "Only regular users can update certificate records");
        }
        const updated = await updateCertificate(
            req.params.id,
            req.user.id,
            req.body
        );
        if (!updated) throw createError(404, "Certificate record not found");
        res.status(200).json({ status: true, result: updated });
    } catch (error) {
        next(error);
    }
};

const deleteCertificateRecord = async (req, res, next) => {
    try {
        if (req.user.role !== 3) {
            throw createError(403, "Only regular users can delete certificate records");
        }
        const deleted = await deleteCertificate(req.params.id, req.user.id);
        if (!deleted) throw createError(404, "Certificate record not found");
        res.status(200).json({ status: true, message: "Certificate record deleted" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addCertificateRecord,
    getUserCertificates,
    updateCertificateRecord,
    getCertificatesByUserId,
    deleteCertificateRecord
};