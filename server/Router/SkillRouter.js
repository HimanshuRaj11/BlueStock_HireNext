const express = require("express");
const router = express.Router();
const SkillController = require("../Controller/SkillController");
const { userAuthorizationHandler } = require("../Middleware/UserAuthorizationMiddleware");
const { clientPlatform } = require("../Middleware/clientPlatform");

router.use(clientPlatform);

router.get("/search", SkillController.searchSkills, userAuthorizationHandler(1,2,3));
router.post("/by-ids", SkillController.getSkillsByIds, userAuthorizationHandler(1,2,3));
router.get("/", SkillController.getAllSkills, userAuthorizationHandler(1,2,3));
router.get('/suggested', SkillController.getSuggestedSkills, userAuthorizationHandler(1,2,3));

module.exports = router;