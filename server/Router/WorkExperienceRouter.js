const express = require("express");
const router = express.Router();
const WorkExperienceController = require("../Controller/WorkExperienceController");
const { checkWorkExperienceInput } = require("../Validation/WorkExperienceValidation");
const { userAuthorizationHandler } = require("../Middleware/UserAuthorizationMiddleware");
const { clientPlatform } = require("../Middleware/clientPlatform");

router.use(clientPlatform, userAuthorizationHandler(2, 3));

router.post("/", checkWorkExperienceInput, WorkExperienceController.createWorkExperience, userAuthorizationHandler(2, 3));
router.get("/", WorkExperienceController.getWorkExperiences, userAuthorizationHandler(2, 3));
router.patch("/:id", checkWorkExperienceInput, WorkExperienceController.updateWorkExperience, userAuthorizationHandler(2, 3));
router.delete("/:id", WorkExperienceController.deleteWorkExperience, userAuthorizationHandler(2, 3));

module.exports = router;