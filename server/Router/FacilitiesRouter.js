const express = require("express");
const router = express.Router();
const FacilitiesController = require("../Controller/FacilitiesController");
const { userAuthorizationHandler } = require("../Middleware/UserAuthorizationMiddleware");
const { clientPlatform } = require("../Middleware/clientPlatform");

router.get("/search", userAuthorizationHandler(2,3), clientPlatform, FacilitiesController.searchFacilities);
router.post("/by-ids", userAuthorizationHandler(1,2,3), clientPlatform, FacilitiesController.getFacilitiesByIds);
router.get("/", userAuthorizationHandler(2,3), clientPlatform, FacilitiesController.getAllFacilities);
router.get("/:id", userAuthorizationHandler(2,3), clientPlatform, FacilitiesController.getFacilitiesById);

module.exports = router;