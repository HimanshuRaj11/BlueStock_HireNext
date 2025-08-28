const { pool } = require("../Utils/DBconnect");
const createError = require("http-errors");
const { VISIBILITY_STATUS } = require("../Utils/JobConstants");

// Helper function to insert mapped records
async function insertMappedRecords(jobId, records, tableName, fieldName) {
    if (!records || records.length === 0) return;
    
    const values = records.map((recordId, index) => 
        `($${index * 2 + 1}, $${index * 2 + 2})`
    ).join(', ');

    const query = `
        INSERT INTO ${tableName} (job_id, ${fieldName})
        VALUES ${values}
        ON CONFLICT DO NOTHING
    `;
    
    const params = records.flatMap(recordId => [jobId, recordId]);
    await pool.query(query, params);
}

// Helper function to delete mapped records
async function deleteMappedRecords(jobId, records, tableName, fieldName) {
    if (!records || records.length === 0) return;
    
    const query = `
        DELETE FROM ${tableName}
        WHERE job_id = $1 AND ${fieldName} = ANY($2::int[])
    `;
    
    await pool.query(query, [jobId, records]);
}

// Helper function to get mapped records
async function getMappedRecords(jobId, tableName, fieldName) {
    const query = `
        SELECT ${fieldName} 
        FROM ${tableName} 
        WHERE job_id = $1
    `;
    
    const result = await pool.query(query, [jobId]);
    return result.rows.map(row => row[fieldName]);
}

// Helper to get job with all mapped data
async function getFullJobData(jobId) {
    const jobQuery = `
        SELECT j.*, 
               sd.salary_type, sd.fixed_amount, sd.min_amount, sd.max_amount,
               sd.incentive_details, sd.is_salary_hidden, sd.is_negotiable,
               sd.currency, sd.salary_period
        FROM jobs j
        LEFT JOIN salary_details sd ON j.id = sd.id
        WHERE j.id = $1`;
    
    const jobResult = await pool.query(jobQuery, [jobId]);
    
    if (jobResult.rows.length === 0) {
        return null;
    }
    
    const job = jobResult.rows[0];
    
    // Get all mapped data
    job.job_skills = await getMappedRecords(jobId, 'job_skill_map', 'skill_id');
    job.categories = await getMappedRecords(jobId, 'job_category_map', 'category_id');
    job.job_facilities = await getMappedRecords(jobId, 'job_facility_map', 'facility_id');
    
    return job;
}

// Get all jobs with filters, sorting, and pagination
module.exports.getAllJobs = async (req, res, next) => {
    try {
        let baseQuery = `
            SELECT j.*, 
                sd.salary_type, sd.fixed_amount, sd.min_amount, sd.max_amount,
                sd.incentive_details, sd.is_salary_hidden, sd.is_negotiable,
                sd.currency, sd.salary_period,
                ARRAY(SELECT skill_id FROM job_skill_map WHERE job_id = j.id) AS job_skills,
                ARRAY(SELECT category_id FROM job_category_map WHERE job_id = j.id) AS categories,
                ARRAY(SELECT facility_id FROM job_facility_map WHERE job_id = j.id) AS job_facilities
            FROM jobs j
            LEFT JOIN salary_details sd ON j.id = sd.id
            WHERE 1=1
        `;
        
        let countQuery = "SELECT COUNT(*) FROM jobs WHERE 1=1";
        const params = [];
        const countParams = [];
        let paramIndex = 1;

        // Add visibility filter based on user role
        if (req.user.role === 3) { // Regular user
            baseQuery += ` AND visibility_status = $${paramIndex}`;
            countQuery += ` AND visibility_status = $${paramIndex}`;
            params.push(VISIBILITY_STATUS.ACCEPTED);
            countParams.push(VISIBILITY_STATUS.ACCEPTED);
            paramIndex++;
        } else if (req.user.role === 2) { // Recruiter
            baseQuery += ` AND (visibility_status = $${paramIndex} OR created_by = $${paramIndex + 1})`;
            countQuery += ` AND (visibility_status = $${paramIndex} OR created_by = $${paramIndex + 1})`;
            params.push(VISIBILITY_STATUS.ACCEPTED, req.user.id);
            countParams.push(VISIBILITY_STATUS.ACCEPTED, req.user.id);
            paramIndex += 2;
        }

        // Search
        if (req.query.search) {
            const search = `%${req.query.search}%`;
            const condition = ` AND (company ILIKE $${paramIndex} OR position ILIKE $${paramIndex} OR job_status ILIKE $${paramIndex} OR job_type ILIKE $${paramIndex} OR job_location ILIKE $${paramIndex})`;
            baseQuery += condition;
            countQuery += condition;
            params.push(search);
            countParams.push(search);
            paramIndex++;
        }

        // Sorting
        if (req.query.sort) {
            const sortMap = {
                "newest": "created_at DESC",
                "oldest": "created_at ASC",
                "a-z": "position ASC",
                "z-a": "position DESC",
            };
            const sortSQL = sortMap[req.query.sort] || "created_at DESC";
            baseQuery += ` ORDER BY ${sortSQL}`;
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 5;
        const offset = (page - 1) * limit;
        baseQuery += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);

        // Execute queries
        const jobsResult = await pool.query(baseQuery, params);
        const countResult = await pool.query(countQuery, countParams);
        const totalJobs = parseInt(countResult.rows[0].count, 10);
        const pageCount = Math.ceil(totalJobs / limit);

        if (jobsResult.rows.length === 0) {
            return next(createError(404, "No jobs found"));
        }

        res.status(200).json({
            status: true,
            result: jobsResult.rows,
            totalJobs,
            currentPage: page,
            pageCount,
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};

module.exports.getJobsForReview = async (req, res, next) => {
    try {
        const query = `
            SELECT j.*, u.username, u.email,
                   ARRAY(SELECT skill_id FROM job_skill_map WHERE job_id = j.id) AS job_skills,
                   ARRAY(SELECT category_id FROM job_category_map WHERE job_id = j.id) AS categories,
                   ARRAY(SELECT facility_id FROM job_facility_map WHERE job_id = j.id) AS job_facilities
            FROM jobs j
            JOIN users u ON j.created_by = u.id
            ORDER BY j.created_at DESC`;
        
        const result = await pool.query(query);

        res.status(200).json({
            status: true,
            result: result.rows
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};

module.exports.updateJobStatus = async (req, res, next) => {
    const { id } = req.params;
    const { visibility_status, admin_comment } = req.body;
    
    try {
        // Check if job exists
        const job = await getFullJobData(id);
        if (!job) {
            return next(createError(404, "Job not found"));
        }

        // Update job status and comment
        const query = `
            UPDATE jobs 
            SET visibility_status = $1, 
                admin_comment = $2, 
                updated_at = NOW()
            WHERE id = $3
            RETURNING *`;

        const result = await pool.query(query, [visibility_status, admin_comment, id]);
        
        // Get the updated job with all mapped data
        const updatedJob = await getFullJobData(id);

        res.status(200).json({
            status: true,
            message: "Job status updated successfully",
            result: updatedJob
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};

// Get jobs posted by the current recruiter
module.exports.getMyJobs = async (req, res, next) => {
    try {
        const query = `
            SELECT j.*, u.username, u.email,
                   ARRAY(SELECT skill_id FROM job_skill_map WHERE job_id = j.id) AS job_skills,
                   ARRAY(SELECT category_id FROM job_category_map WHERE job_id = j.id) AS categories,
                   ARRAY(SELECT facility_id FROM job_facility_map WHERE job_id = j.id) AS job_facilities
            FROM jobs j
            JOIN users u ON j.created_by = u.id
            WHERE j.created_by = $1
            ORDER BY j.created_at DESC`;
        
        const result = await pool.query(query, [req.user.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No jobs found for this user"
            });
        }

        res.status(200).json({
            status: true,
            result: result.rows
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};

// Get single job by ID
module.exports.getSingleJob = async (req, res, next) => {
    const { id } = req.params;
    try {
        const job = await getFullJobData(id);
        
        if (!job) {
            return next(createError(404, "Job not found"));
        }

        res.status(200).json({
            status: true,
            result: job
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};

// Add a new job
module.exports.addJob = async (req, res, next) => {
    const jobData = req.body;
    const currentCategories = jobData.categories || [];
    
    if (currentCategories.length > 10) {
        return next(createError(400, "You can only add up to 10 categories"));
    }

    if (!jobData.job_facilities || jobData.job_facilities.length === 0) {
        return next(createError(400, "At least one facility must be selected"));
    }

    if (!jobData.job_skills || jobData.job_skills.length === 0) {
        return next(createError(400, "At least one skill must be selected"));
    }

    try {
        // Check if job already exists
        const existsQuery = await pool.query(
            "SELECT id FROM jobs WHERE company = $1 AND position = $2",
            [jobData.company, jobData.position]
        );

        if (existsQuery.rowCount > 0) {
            return next(createError(409, "Job already exists"));
        }

        if (jobData.eligibility === 2 && (!jobData.year_selection || jobData.year_selection.length === 0)) {
            return next(createError(400, "Year selection is required for freshers"));
        }

        if (jobData.eligibility === 3) {
            if (!jobData.experience_min || !jobData.experience_max) {
                return next(createError(400, "Experience range is required for experienced candidates"));
            }
            if (parseFloat(jobData.experience_max) < parseFloat(jobData.experience_min)) {
                return next(createError(400, "Maximum experience must be greater than or equal to minimum experience"));
            }
        }

        // Start transaction
        await pool.query('BEGIN');

        try {
            // Insert main job record
            const jobQuery = `
                INSERT INTO jobs (
                    company, position, job_status, job_type, job_location,
                    workplace_type, created_by, job_vacancy, job_deadline,
                    job_description, job_contact,
                    visibility_status, eligibility, student_currently_studying,
                    year_selection, experience_min, experience_max
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
                RETURNING *`;

            const jobValues = [
                jobData.company,
                jobData.position,
                jobData.job_status,
                jobData.job_type,
                jobData.workplace_type === 1 ? null : jobData.job_location,
                jobData.workplace_type,
                req.user.id,
                jobData.job_vacancy,
                jobData.job_deadline,
                jobData.job_description,
                jobData.job_contact,
                VISIBILITY_STATUS.UNDER_REVIEW,
                jobData.eligibility || 1,
                jobData.eligibility === 1 ? jobData.student_currently_studying : 
                    (jobData.student_currently_studying || null),
                jobData.eligibility === 2 ? jobData.year_selection : null,
                jobData.eligibility === 3 ? jobData.experience_min : null,
                jobData.eligibility === 3 ? jobData.experience_max : null
            ];

            const jobResult = await pool.query(jobQuery, jobValues);
            const jobId = jobResult.rows[0].id;

            const salaryQuery = `
                INSERT INTO salary_details (
                    id, salary_type, fixed_amount, min_amount, max_amount,
                    incentive_details, is_salary_hidden, is_negotiable,
                    currency, salary_period
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
            
            const salaryValues = [
                jobId,
                jobData.salary_type,
                jobData.salary_type === 'RANGE' ? null : jobData.fixed_amount,
                jobData.salary_type === 'RANGE' ? jobData.min_amount : null,
                jobData.salary_type === 'RANGE' ? jobData.max_amount : null,
                jobData.salary_type === 'FIXED_INCENTIVE' ? jobData.incentive_details : null,
                jobData.is_salary_hidden || false,
                jobData.is_negotiable || false,
                jobData.currency || 'INR',
                jobData.salary_period || 'MONTH'
            ];
            
            await pool.query(salaryQuery, salaryValues);

            // Insert mapped records
            await insertMappedRecords(jobId, jobData.job_skills, 'job_skill_map', 'skill_id');
            await insertMappedRecords(jobId, jobData.categories, 'job_category_map', 'category_id');
            await insertMappedRecords(jobId, jobData.job_facilities, 'job_facility_map', 'facility_id');

            // Commit transaction
            await pool.query('COMMIT');

            // Get the full job data with all mappings
            const fullJobData = await getFullJobData(jobId);

            res.status(201).json({
                status: true,
                result: fullJobData
            });
        } catch (error) {
            // Rollback transaction on error
            await pool.query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        next(createError(500, error.message));
    }
};

// Update a job
module.exports.updateSingleJob = async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;
    const currentCategories = data.categories || [];
    
    if (currentCategories.length > 10) {
        return next(createError(400, "You can only update up to 10 categories"));
    }
    
    if (!data.job_facilities || data.job_facilities.length === 0) {
        return next(createError(400, "At least one facility must be selected"));
    }
    
    if (!data.job_skills || data.job_skills.length === 0) {
        return next(createError(400, "At least one skill must be selected"));
    }
    
    try {
        // Check if job exists
        const checkQuery = await pool.query("SELECT * FROM jobs WHERE id = $1", [id]);
        if (checkQuery.rowCount === 0) {
            return next(createError(404, "Job not found"));
        }

        // Verify the user is the creator or admin
        if (checkQuery.rows[0].created_by !== req.user.id && req.user.role !== 1) {
            return next(createError(403, "Not authorized to update this job"));
        }

        if (data.eligibility === 2 && (!data.year_selection || data.year_selection.length === 0)) {
            return next(createError(400, "Year selection is required for freshers"));
        }

        if (data.eligibility === 3) {
            if (!data.experience_min || !data.experience_max) {
                return next(createError(400, "Experience range is required for experienced candidates"));
            }
            if (parseFloat(data.experience_max) < parseFloat(data.experience_min)) {
                return next(createError(400, "Maximum experience must be greater than or equal to minimum experience"));
            }
        }

        // Start transaction
        await pool.query('BEGIN');

        try {
            // Update main job record
            const query = `
                UPDATE jobs 
                SET company = $1, position = $2, job_status = $3, job_type = $4, 
                    job_location = $5, workplace_type = $6, job_vacancy = $7, 
                    job_deadline = $8, job_description = $9, 
                    job_contact = $10, eligibility = $11, student_currently_studying = $12,
                    year_selection = $13, experience_min = $14, experience_max = $15,
                    updated_at = NOW()
                WHERE id = $16
                RETURNING *`;

            const values = [
                data.company,
                data.position,
                data.job_status,
                data.job_type,
                data.workplace_type === 1 ? null : data.job_location,
                data.workplace_type,
                data.job_vacancy,
                data.job_deadline,
                data.job_description,
                data.job_contact,
                data.eligibility || checkQuery.rows[0].eligibility || 1,
                data.eligibility === 1 ? data.student_currently_studying : 
                    (data.student_currently_studying !== undefined ? data.student_currently_studying : checkQuery.rows[0].student_currently_studying),
                data.eligibility === 2 ? data.year_selection : 
                    (data.eligibility !== 2 ? null : checkQuery.rows[0].year_selection),
                data.eligibility === 3 ? data.experience_min : 
                    (data.eligibility !== 3 ? null : checkQuery.rows[0].experience_min),
                data.eligibility === 3 ? data.experience_max : 
                    (data.eligibility !== 3 ? null : checkQuery.rows[0].experience_max),
                id
            ];

            await pool.query(query, values);

            // Update salary details
            const salaryQuery = `
                UPDATE salary_details
                SET salary_type = $1,
                    fixed_amount = $2,
                    min_amount = $3,
                    max_amount = $4,
                    incentive_details = $5,
                    is_salary_hidden = $6,
                    is_negotiable = $7,
                    currency = $8,
                    salary_period = $9,
                    updated_at = NOW()
                WHERE id = $10`;
                
            const salaryValues = [
                data.salary_type,
                data.salary_type === 'RANGE' ? null : data.fixed_amount,
                data.salary_type === 'RANGE' ? data.min_amount : null,
                data.salary_type === 'RANGE' ? data.max_amount : null,
                data.salary_type === 'FIXED_INCENTIVE' ? data.incentive_details : null,
                data.is_salary_hidden || false,
                data.is_negotiable || false,
                data.currency || 'INR',
                data.salary_period || 'MONTH',
                id
            ];

            await pool.query(salaryQuery, salaryValues);

            // Update mapped records - first delete existing ones
            await pool.query('DELETE FROM job_skill_map WHERE job_id = $1', [id]);
            await pool.query('DELETE FROM job_category_map WHERE job_id = $1', [id]);
            await pool.query('DELETE FROM job_facility_map WHERE job_id = $1', [id]);

            // Then insert new ones
            await insertMappedRecords(id, data.job_skills, 'job_skill_map', 'skill_id');
            await insertMappedRecords(id, data.categories, 'job_category_map', 'category_id');
            await insertMappedRecords(id, data.job_facilities, 'job_facility_map', 'facility_id');

            // Commit transaction
            await pool.query('COMMIT');

            // Get the full updated job data
            const updatedJob = await getFullJobData(id);

            res.status(200).json({
                status: true,
                message: "Job updated successfully",
                result: updatedJob
            });
        } catch (error) {
            // Rollback transaction on error
            await pool.query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        next(createError(500, error.message));
    }
};

// Delete a single job
module.exports.deleteSingleJob = async (req, res, next) => {
    const { id } = req.params;
    try {
        // Check if job exists
        const checkQuery = await pool.query("SELECT * FROM jobs WHERE id = $1", [id]);
        if (checkQuery.rowCount === 0) {
            return next(createError(404, "Job not found"));
        }

        // Verify the user is the creator or admin
        if (checkQuery.rows[0].created_by !== req.user.id && req.user.role !== 1) {
            return next(createError(403, "Not authorized to delete this job"));
        }

        // Start transaction
        await pool.query('BEGIN');

        try {
            // Delete associated applications first
            await pool.query("DELETE FROM applications WHERE job_id = $1", [id]);

            // Delete mapped records
            await pool.query("DELETE FROM job_skill_map WHERE job_id = $1", [id]);
            await pool.query("DELETE FROM job_category_map WHERE job_id = $1", [id]);
            await pool.query("DELETE FROM job_facility_map WHERE job_id = $1", [id]);

            // Then delete the job
            await pool.query("DELETE FROM jobs WHERE id = $1", [id]);

            // Commit transaction
            await pool.query('COMMIT');

            res.status(200).json({
                status: true,
                message: "Job and associated data deleted successfully"
            });
        } catch (error) {
            // Rollback transaction on error
            await pool.query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        next(createError(500, error.message));
    }
};

// Delete all jobs (admin only)
module.exports.deleteAllJobs = async (req, res, next) => {
    try {
        // Start transaction
        await pool.query('BEGIN');

        try {
            // First delete all applications
            await pool.query("DELETE FROM applications");

            // Then delete all mapped records
            await pool.query("DELETE FROM job_skill_map");
            await pool.query("DELETE FROM job_category_map");
            await pool.query("DELETE FROM job_facility_map");

            // Then delete all jobs
            const result = await pool.query("DELETE FROM jobs RETURNING *");

            // Commit transaction
            await pool.query('COMMIT');

            res.status(200).json({
                status: true,
                message: "All jobs and associated data deleted successfully",
                count: result.rowCount
            });
        } catch (error) {
            // Rollback transaction on error
            await pool.query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        next(createError(500, error.message));
    }
};