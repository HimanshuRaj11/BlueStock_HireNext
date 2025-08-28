const express = require("express");
const router = express.Router();
const CategoryController = require("../Controller/CategoryController");
const { userAuthorizationHandler } = require("../Middleware/UserAuthorizationMiddleware");
const { clientPlatform } = require("../Middleware/clientPlatform");

router.get("/search", userAuthorizationHandler(1,2), clientPlatform, CategoryController.searchCategories);
router.get("/:id", userAuthorizationHandler(1,2), clientPlatform, CategoryController.getCategoryById);
router.get("/slug/:slug", userAuthorizationHandler(1,2), clientPlatform, CategoryController.getCategoryBySlug);
router.post("/by-ids", userAuthorizationHandler(1,2,3), clientPlatform, CategoryController.getCategoriesByIds);
router.get("/", userAuthorizationHandler(1,2), clientPlatform, CategoryController.getAllCategories);
router.get("/suggested", userAuthorizationHandler(1,2), clientPlatform, CategoryController.getSuggestedCategories);

module.exports = router;
