const { pool } = require("../Utils/DBconnect");

async function createJobTable() {
    const query = `
        CREATE TYPE salary_type AS ENUM (
          'FIXED',
          'RANGE',
          'FIXED_INCENTIVE',
          'UNPAID'
        );

        CREATE TABLE IF NOT EXISTS jobs (
            id SERIAL PRIMARY KEY,
            company VARCHAR(100) NOT NULL 
                CHECK (LENGTH(TRIM(company)) >= 5 AND LENGTH(TRIM(company)) <= 100),
            position VARCHAR(200) NOT NULL 
                CHECK (LENGTH(TRIM(position)) >= 5 AND LENGTH(TRIM(position)) <= 200),
            job_status TEXT NOT NULL DEFAULT 'pending' 
                CHECK (job_status IN ('pending', 'interview', 'declined')),
            job_type TEXT NOT NULL DEFAULT 'full-time' 
                CHECK (job_type IN ('full-time', 'part-time', 'internship', 'contract')),
            job_location TEXT,
            workplace_type INTEGER NOT NULL
                CHECK (workplace_type BETWEEN 1 AND 4),
            created_by INTEGER NOT NULL 
                REFERENCES users(id) ON DELETE CASCADE,
            job_vacancy TEXT NOT NULL 
                CHECK (LENGTH(TRIM(job_vacancy)) > 0),
            job_deadline DATE NOT NULL 
                CHECK (job_deadline >= CURRENT_DATE),
            job_description TEXT NOT NULL 
                CHECK (LENGTH(TRIM(job_description)) >= 10),
            job_contact TEXT NOT NULL 
                CHECK (LENGTH(TRIM(job_contact)) > 0 AND job_contact ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
            visibility_status INTEGER NOT NULL DEFAULT 1 
                CHECK (visibility_status BETWEEN 1 AND 4),
            admin_comment TEXT,
            eligibility INTEGER NOT NULL DEFAULT 1
                CHECK (eligibility BETWEEN 1 AND 3),
            student_currently_studying BOOLEAN,
            year_selection year_enum[],
            experience_min NUMERIC,
            experience_max NUMERIC,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS salary_details (
          id INTEGER PRIMARY KEY REFERENCES jobs(id) ON DELETE CASCADE,
          salary_type salary_type NOT NULL,

          fixed_amount NUMERIC(12, 2),
          min_amount NUMERIC(12, 2),
          max_amount NUMERIC(12, 2),
          incentive_details TEXT,

          is_salary_hidden BOOLEAN DEFAULT FALSE,
          is_negotiable BOOLEAN DEFAULT FALSE,

          currency VARCHAR(3) DEFAULT 'INR',
          salary_period VARCHAR(50) DEFAULT 'MONTH',

          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

          CONSTRAINT valid_salary CHECK (
            (salary_type = 'FIXED' AND fixed_amount IS NOT NULL AND min_amount IS NULL AND max_amount IS NULL AND incentive_details IS NULL) OR
            (salary_type = 'RANGE' AND fixed_amount IS NULL AND min_amount IS NOT NULL AND max_amount IS NOT NULL AND incentive_details IS NULL AND min_amount <= max_amount) OR
            (salary_type = 'FIXED_INCENTIVE' AND fixed_amount IS NOT NULL AND min_amount IS NULL AND max_amount IS NULL AND incentive_details IS NOT NULL) OR
            (salary_type = 'UNPAID' AND fixed_amount IS NULL AND min_amount IS NULL AND max_amount IS NULL AND incentive_details IS NULL)
          ),

          CONSTRAINT valid_currency CHECK (currency ~ '^[A-Z]{3}$'),

          CONSTRAINT valid_salary_period CHECK (salary_period IN ('MONTH', 'YEAR', 'HOUR', 'WEEK'))
        );

        CREATE TABLE IF NOT EXISTS job_skill_map (
            job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
            skill_id INTEGER REFERENCES master_skills_list(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (job_id, skill_id)
        );

        CREATE TABLE IF NOT EXISTS job_category_map (
            job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
            category_id INTEGER REFERENCES master_job_category_list(category_id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (job_id, category_id)
        );

        CREATE TABLE IF NOT EXISTS job_facility_map (
            job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
            facility_id INTEGER REFERENCES facilities(facilities_id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (job_id, facility_id)
        );
    `;
    await pool.query(query);
}

module.exports = {
    createJobTable
};