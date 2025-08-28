const express = require("express");
const router = express.Router();
const UserProfileController = require("../Controller/UserProfileController");
const { checkUserProfileInput, checkAboutInput, checkSocialLinksInput } = require("../Validation/UserProfileDataRules");
const { userAuthorizationHandler } = require("../Middleware/UserAuthorizationMiddleware");
const { clientPlatform } = require("../Middleware/clientPlatform");
const { checkSkillsInput } = require("../Validation/UserProfileDataRules");

router.use(clientPlatform, userAuthorizationHandler(3)); // Only for regular users (role 3)

router.get("/", UserProfileController.getUserProfile);
router.post("/", checkUserProfileInput, UserProfileController.createUserProfile);
router.patch("/", checkUserProfileInput, UserProfileController.updateUserProfile);
router.patch("/about", checkAboutInput, UserProfileController.updateAbout);
router.patch("/social-links", checkSocialLinksInput, UserProfileController.updateSocialLinks);
router.get("/skills", UserProfileController.getSkills);
router.post("/skills", checkSkillsInput, UserProfileController.addSkills);
router.patch("/skills", checkSkillsInput, UserProfileController.updateSkills);
router.delete("/skills", UserProfileController.removeSkill);

module.exports = router;