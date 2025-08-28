const express = require("express");
const ApplicationRouter = express.Router();

const {
    authenticateUser,
} = require("./../Middleware/UserAuthenticationMiddleware");

// Controllers
const ApplicationController = require("../Controller/ApplicationController");

// Middlewares
const { checkInput } = require("../Validation/ApplicationDataRules");
const {
    inputValidationMiddleware,
} = require("../Validation/ValidationMiddleware");
const {
    userAuthorizationHandler,
} = require("./../Middleware/UserAuthorizationMiddleware");

const { clientPlatform } = require("../Middleware/clientPlatform");

// Authentication routes

ApplicationRouter.get(
    "/applicant-jobs",
    clientPlatform,
    userAuthorizationHandler(3),
    ApplicationController.getCandidateAppliedJobs
);

ApplicationRouter.post(
    "/apply",
    clientPlatform,
    checkInput,
    inputValidationMiddleware,
    userAuthorizationHandler(3),
    ApplicationController.applyInJob
);

ApplicationRouter.get(
    "/recruiter-jobs",
    clientPlatform,
    userAuthorizationHandler(2),
    ApplicationController.getRecruiterPostJobs
);

ApplicationRouter.patch(
    "/:id",
    clientPlatform,
    userAuthorizationHandler(2),
    ApplicationController.updateJobStatus
);

module.exports = ApplicationRouter;
