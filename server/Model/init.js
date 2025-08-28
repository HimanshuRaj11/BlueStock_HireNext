const { createUserTable } = require('./UserModel');
const { createJobTable } = require('./JobModel');
const { createApplicationTable } = require('./ApplicationModel');
const { createEducationTable } = require('./EducationModel');
const { createRecruiterProfileTable } = require('./RecruiterProfileModel');
const { createWorkExperienceTable } = require('./WorkExperienceModel');
const { createUserProfileTable } = require('./UserProfileModel');

async function initializeDatabase() {
    await createUserTable();
    await createJobTable();
    await createApplicationTable();
    await createRecruiterProfileTable()
    await createEducationTable();
    await createWorkExperienceTable();
    await createUserProfileTable();
    console.log("✅ All tables created successfully");
}

initializeDatabase().catch(console.error);