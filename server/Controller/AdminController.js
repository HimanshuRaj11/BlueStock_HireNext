const { pool } = require("../Utils/DBconnect");
const createError = require("http-errors");
const dayjs = require("dayjs");

exports.getAllInfo = async (req, res, next) => {
    try {
        const [usersRes, adminRes, recruiterRes, applicantRes, jobsRes,
            interviewRes, pendingRes, declinedRes] = await Promise.all([
            pool.query("SELECT COUNT(*) FROM users"),
            pool.query("SELECT COUNT(*) FROM users WHERE role = 1"),
            pool.query("SELECT COUNT(*) FROM users WHERE role = 2"),
            pool.query("SELECT COUNT(*) FROM users WHERE role = 3"),
            pool.query("SELECT COUNT(*) FROM jobs"),
            pool.query("SELECT COUNT(*) FROM jobs WHERE job_status = 'interview'"),
            pool.query("SELECT COUNT(*) FROM jobs WHERE job_status = 'pending'"),
            pool.query("SELECT COUNT(*) FROM jobs WHERE job_status = 'declined'")
        ]);

        res.status(200).json({
            user: parseInt(usersRes.rows[0].count),
            admin: parseInt(adminRes.rows[0].count),
            recruiter: parseInt(recruiterRes.rows[0].count),
            applicant: parseInt(applicantRes.rows[0].count),
            job: parseInt(jobsRes.rows[0].count),
            interview: parseInt(interviewRes.rows[0].count),
            pending: parseInt(pendingRes.rows[0].count),
            declined: parseInt(declinedRes.rows[0].count),
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};

exports.monthlyInfo = async (req, res, next) => {
    try {
        const statsRes = await pool.query(
            "SELECT job_status, COUNT(*) FROM jobs GROUP BY job_status"
        );

        const stats = {};
        statsRes.rows.forEach(({ job_status, count }) => {
            stats[job_status] = parseInt(count);
        });

        const defaultStats = [
            { name: "pending", value: stats.pending || 0 },
            { name: "interview", value: stats.interview || 0 },
            { name: "declined", value: stats.declined || 0 },
        ];

        const monthlyRes = await pool.query(
            `SELECT DATE_TRUNC('month', created_at) AS month, COUNT(*) 
             FROM jobs 
             GROUP BY month 
             ORDER BY month DESC 
             LIMIT 6`
        );

        const monthly_stats = monthlyRes.rows.map(({ month, count }) => ({
            date: dayjs(month).format("MMM YY"),
            count: parseInt(count),
        })).reverse();

        res.status(200).json({ defaultStats, monthly_stats });
    } catch (error) {
        next(createError(500, error.message));
    }
};

exports.updateUserRole = async (req, res, next) => {
    const { id, role } = req.body;
    try {
        const updateRes = await pool.query(
            "UPDATE users SET role = $1 WHERE id = $2 RETURNING id",
            [role, id]
        );

        if (updateRes.rowCount === 0) {
            next(createError(404, "User not found"));
        } else {
            res.status(200).json({
                status: true,
                message: "Role Updated",
            });
        }
    } catch (error) {
        next(createError(500, `Something went wrong: ${error.message}`));
    }
};