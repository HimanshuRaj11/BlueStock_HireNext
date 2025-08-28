const { pool } = require("../Utils/DBconnect");
const createError = require("http-errors");
const dayjs = require("dayjs");

exports.getCandidateAppliedJobs = async (req, res, next) => {
    try {
        const applicant_id = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;

        const result = await pool.query(
            `SELECT 
                a.id AS application_id,
                a.status,
                a.resume,
                a.date_of_application,
                j.id AS job_id,
                j.position,
                j.company
             FROM applications a
             JOIN jobs j ON a.job_id = j.id
             WHERE a.applicant_id = $1
             ORDER BY a.created_at DESC
             LIMIT $2 OFFSET $3`,
            [applicant_id, limit, offset]
        );

        const totalJobsRes = await pool.query(
            "SELECT COUNT(*) FROM applications WHERE applicant_id = $1",
            [applicant_id]
        );

        const formattedResult = result.rows.map((row) => ({
            id: row.application_id,
            status: row.status,
            resume: row.resume,
            date_of_application: row.date_of_application,
            job: {
                id: row.job_id,
                position: row.position,
                company: row.company,
            },
        }));

        res.status(200).json({
            status: true,
            result: formattedResult,
            totalJobs: parseInt(totalJobsRes.rows[0].count),
            currentPage: page,
            pageCount: Math.ceil(totalJobsRes.rows[0].count / limit),
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};

exports.getRecruiterPostJobs = async (req, res, next) => {
    try {
        const recruiter_id = req.user.id;

        const result = await pool.query(
            `SELECT 
                a.id AS application_id,
                a.status,
                a.resume,
                a.applicant_id,
                j.id AS job_id,
                j.position,
                j.company 
            FROM applications a 
            JOIN jobs j ON a.job_id = j.id 
            WHERE a.recruiter_id = $1`,  
            [recruiter_id]
        );

        res.status(200).json({
            status: true,
            totalJobs: result.rowCount,
            result: result.rows,
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};

exports.applyInJob = async (req, res, next) => {
    try {
        const { applicant_id, recruiter_id, job_id, resume } = req.body;

        const alreadyApplied = await pool.query(
            "SELECT id FROM applications WHERE applicant_id = $1 AND job_id = $2",
            [applicant_id, job_id]
        );

        if (alreadyApplied.rowCount > 0) {
            return next(createError(400, "Already Applied"));
        }

        await pool.query(
            `INSERT INTO applications (applicant_id, recruiter_id, job_id, resume) 
             VALUES ($1, $2, $3, $4)`,
            [applicant_id, recruiter_id, job_id, resume]
        );

        res.status(201).json({
            status: true,
            message: "Applied Successfully",
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};

exports.updateJobStatus = async (req, res, next) => {
    const { id } = req.params;
    const { status, date_of_joining } = req.body; 
    try {
        const verifyRes = await pool.query(
            `SELECT id FROM applications 
             WHERE id = $1 AND recruiter_id = $2`,
            [id, req.user.id] 
        );

        if (verifyRes.rowCount === 0) {
            return next(createError(403, "Unauthorized user to update job"));
        }

        // Then perform the update
        const updateRes = await pool.query(
            `UPDATE applications SET status = $1, date_of_joining = $2 WHERE id = $3`,
            [status, date_of_joining, id]
        );

        res.status(200).json({
            status: true,
            message: "Status Updated Successfully",
        });
    } catch (error) {
        next(createError(500, `Something went wrong: ${error.message}`));
    }
};