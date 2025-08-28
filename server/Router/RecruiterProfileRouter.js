const express = require("express");
const RecruiterProfileRouter = express.Router();

const {
    getProfile,
    updateProfile,
    addSkills,
    updateSkills,
    getSkills,
    removeSkill
} = require("../Controller/RecruiterProfileController");

const { 
    checkRecruiterProfileInput,
    checkRecruiterSkillsInput 
} = require("../Validation/RecruiterProfileDataRules");
const { inputValidationMiddleware } = require("../Validation/ValidationMiddleware");
const { userAuthorizationHandler } = require("../Middleware/UserAuthorizationMiddleware");
const { clientPlatform } = require("../Middleware/clientPlatform");

RecruiterProfileRouter.use(clientPlatform, userAuthorizationHandler(2));

RecruiterProfileRouter.route("/")
    .get(getProfile)
    .patch(
        express.json(),
        inputValidationMiddleware,
        updateProfile
    );

RecruiterProfileRouter.get("/skills", 
    express.json(),
    getSkills
);

RecruiterProfileRouter.post("/skills", 
    express.json(),
    inputValidationMiddleware,
    addSkills
);

RecruiterProfileRouter.patch("/skills", 
    express.json(),
    inputValidationMiddleware,
    updateSkills
);

RecruiterProfileRouter.delete("/skills", 
    express.json(),
    removeSkill
);

module.exports = RecruiterProfileRouter;