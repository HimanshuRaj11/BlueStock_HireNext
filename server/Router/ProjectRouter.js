const express = require("express");
const ProjectRouter = express.Router();
const {
    addProjectRecord,
    getUserProjects,
    updateProjectRecord,
    getProjectsByUserId,
    deleteProjectRecord
} = require("../Controller/ProjectController");
const { clientPlatform } = require("../Middleware/clientPlatform");
const {
    userAuthorizationHandler,
} = require("../Middleware/UserAuthorizationMiddleware");
const {
    checkProjectInput,
} = require("../Validation/ProjectDataRules");
const {
    inputValidationMiddleware,
} = require("../Validation/ValidationMiddleware");

ProjectRouter.use((req, res, next) => {
  console.log(`[PROJ-ROUTER] ${req.method} ${req.path}`);
  next();
});

ProjectRouter.route("/")
    .get(
        clientPlatform,
        userAuthorizationHandler(3),
        getUserProjects
    )
    .post(
        clientPlatform,
        userAuthorizationHandler(3),
        express.json(),
        checkProjectInput,
        inputValidationMiddleware,
        addProjectRecord
    );

ProjectRouter.get("/user/:userId",
    clientPlatform,
    userAuthorizationHandler(2), 
    getProjectsByUserId
);

ProjectRouter.route("/:id")
    .patch(
        clientPlatform,
        userAuthorizationHandler(3),
        express.json(),
        checkProjectInput,
        inputValidationMiddleware,
        updateProjectRecord
    )
    .delete(
        clientPlatform,
        userAuthorizationHandler(3),
        deleteProjectRecord
    );

module.exports = ProjectRouter;