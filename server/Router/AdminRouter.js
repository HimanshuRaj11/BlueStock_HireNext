const express = require("express");
const AdminRouter = express.Router(); 
const {
    userAuthorizationHandler,
} = require("./../Middleware/UserAuthorizationMiddleware");
const {
    authenticateUser,
} = require("./../Middleware/UserAuthenticationMiddleware");

// Controllers
const AdminController = require("../Controller/AdminController");

const {
    clientPlatform,
} = require("./../Middleware/clientPlatform");

// Authentication routes
AdminRouter.get(
    "/info",
    clientPlatform,
    userAuthorizationHandler(1),
    AdminController.getAllInfo
);
AdminRouter.get(
    "/stats",  
    clientPlatform,
    userAuthorizationHandler(1),
    AdminController.monthlyInfo
);
AdminRouter.patch(
    "/update-role",
    clientPlatform,
    userAuthorizationHandler(1),
    AdminController.updateUserRole
);
module.exports = AdminRouter;
