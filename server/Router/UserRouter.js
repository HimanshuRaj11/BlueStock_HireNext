const express = require("express");
const UserRouter = express.Router();

// Import controller methods
const {
    getAllUser,
    getSingleUser,
    getMe,
    logOut,
    addUser,
    loginUser,
    updateResume,
    updateMobileVerification,
    updateMobileEdit,
    updateUser,
    deleteUser,
    deleteAllUser,
    addRecruiter
} = require("../Controller/UserController");

const { clientPlatform } = require("../Middleware/clientPlatform");

// Import validation and middleware
const {
    checkRegisterInput,
    checkLoginInput,
    checkUserUpdateInput,
} = require("../Validation/UserDataRules");

const {
    inputValidationMiddleware,
} = require("../Validation/ValidationMiddleware");

const {
    userAuthorizationHandler,
} = require("../Middleware/UserAuthorizationMiddleware");

// User management routes
UserRouter.route("/")
    .get(userAuthorizationHandler(1), getAllUser)
    .delete(userAuthorizationHandler(1), deleteAllUser);

// Authentication routes
UserRouter.post("/register",
    clientPlatform,
    checkRegisterInput,
    inputValidationMiddleware,
    addUser
);
UserRouter.post("/register-recruiter",
    clientPlatform,
    checkRegisterInput,
    inputValidationMiddleware,
    addRecruiter
);

UserRouter.patch("/update-mobile-verification",
    clientPlatform,
    userAuthorizationHandler(1, 2, 3),
    express.json(),
    updateMobileVerification
);

UserRouter.patch("/update-mobile-edit",
    clientPlatform,
    userAuthorizationHandler(1, 2, 3),
    express.json(),
    updateMobileEdit
);

UserRouter.patch("/update-resume",
    clientPlatform,
    userAuthorizationHandler(1,2,3),
    express.json(),
    updateResume
);

UserRouter.post("/login",
    clientPlatform,
    checkLoginInput,
    inputValidationMiddleware,
    loginUser
);
UserRouter.post("/login-recruiter",
    clientPlatform,
    checkLoginInput,
    inputValidationMiddleware,
    loginUser
);

UserRouter.get("/me",
    clientPlatform,
    userAuthorizationHandler(2, 3),
    getMe
);

UserRouter.get("/logout",
    clientPlatform,
    logOut
);

// User profile update
UserRouter.patch("/update",
    clientPlatform,
    userAuthorizationHandler(1,2,3),
    express.json(),
    checkUserUpdateInput,
    inputValidationMiddleware,
    updateUser
);

// User management by ID
UserRouter.route("/:id")
    .get(userAuthorizationHandler(1, 2), getSingleUser)
    .delete(userAuthorizationHandler(1), deleteUser);

module.exports = UserRouter;