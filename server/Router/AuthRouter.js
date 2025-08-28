const express = require("express");
const AuthRouter = express.Router();
const {
    authenticateUser,
} = require("./../Middleware/UserAuthenticationMiddleware");

// Controllers
const UserController = require("../Controller/UserController");

const {
    checkRegisterInput,
    checkLoginInput,
} = require("../Validation/UserDataRules");

const {
    inputValidationMiddleware,
} = require("../Validation/ValidationMiddleware");

const { clientPlatform } = require("../Middleware/clientPlatform");
const { userAuthorizationHandler } = require("../Middleware/UserAuthorizationMiddleware");

AuthRouter.get('/cookie-test', (req, res) => {
    res.status(200).json({ message: 'Cookie test successful' });
});

// Authentication routes
AuthRouter.post("/logout", clientPlatform, authenticateUser, UserController.logOut);
AuthRouter.patch("/hibernate", clientPlatform, userAuthorizationHandler(3), UserController.hibernateAccount);
AuthRouter.patch("/delete", clientPlatform, userAuthorizationHandler(3), UserController.deleteAccountPermanently);
AuthRouter.get("/me", clientPlatform, authenticateUser, UserController.getMe);

AuthRouter.post(
    "/register",
    clientPlatform,
    checkRegisterInput,
    inputValidationMiddleware,
    UserController.addUser
);
AuthRouter.post(
    "/register-recruiter",
    clientPlatform,
    checkRegisterInput,
    inputValidationMiddleware,
    UserController.addRecruiter
);
AuthRouter.post(
    "/login",
    clientPlatform,
    checkLoginInput,
    inputValidationMiddleware,
    UserController.loginUser
);
AuthRouter.post(
    "/login-recruiter",
    clientPlatform,
    checkLoginInput,
    inputValidationMiddleware,
    UserController.loginUser
);

AuthRouter.post("/google", clientPlatform, UserController.googleAuth);
AuthRouter.post("/google-recruiter", clientPlatform, UserController.googleAuthRecruiter);

AuthRouter.patch(
    "/status",
    clientPlatform,
    authenticateUser,
    userAuthorizationHandler(3),
    UserController.updateAcStatus
);
module.exports = AuthRouter;