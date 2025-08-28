const express = require("express");
const JobRouter = express.Router();

// Controllers
const {
    getAllJobs,
    getSingleJob,
    addJob,
    updateSingleJob,
    deleteSingleJob,
    deleteAllJobs,
    getMyJobs,
    getJobsForReview,
    updateJobStatus,
} = require("../Controller/JobController");

// Validation
const { checkJobInput, checkJobStatusUpdate } = require("../Validation/JobDataRules");
const { inputValidationMiddleware } = require("../Validation/ValidationMiddleware");

const { clientPlatform } = require("./../Middleware/clientPlatform");

// Middleware
const { userAuthorizationHandler } = require("../Middleware/UserAuthorizationMiddleware");

// Routes
JobRouter.route("/")
    .get(getAllJobs)
    .post(
        clientPlatform,
        userAuthorizationHandler(2),
        checkJobInput,
        inputValidationMiddleware,
        addJob
    )
    .delete(userAuthorizationHandler(1), deleteAllJobs);

JobRouter.get("/my-jobs", clientPlatform, userAuthorizationHandler(2, 3), getMyJobs);
JobRouter.get("/review", clientPlatform, userAuthorizationHandler(1), getJobsForReview);

JobRouter.route("/:id")
    .get(getSingleJob)
    .patch(
        clientPlatform,
        userAuthorizationHandler(2),
        checkJobInput,
        inputValidationMiddleware,
        updateSingleJob
    )
    .delete(userAuthorizationHandler(1, 2), deleteSingleJob);

JobRouter.patch("/:id/status",
    clientPlatform,
    userAuthorizationHandler(1),
    checkJobStatusUpdate,
    inputValidationMiddleware,
    updateJobStatus
);

module.exports = JobRouter;