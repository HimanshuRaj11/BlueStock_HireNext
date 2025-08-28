const express = require("express");
const CertificateRouter = express.Router();
const {
    addCertificateRecord,
    getUserCertificates,
    updateCertificateRecord,
    getCertificatesByUserId,
    deleteCertificateRecord
} = require("../Controller/CertificateController");
const { clientPlatform } = require("../Middleware/clientPlatform");
const {
    userAuthorizationHandler,
} = require("../Middleware/UserAuthorizationMiddleware");
const {
    checkCertificateInput,
} = require("../Validation/CertificateDataRules");
const {
    inputValidationMiddleware,
} = require("../Validation/ValidationMiddleware");

CertificateRouter.use((req, res, next) => {
  console.log(`[CERT-ROUTER] ${req.method} ${req.path}`);
  next();
});

CertificateRouter.route("/")
    .get(
        clientPlatform,
        userAuthorizationHandler(3),
        getUserCertificates
    )
    .post(
        clientPlatform,
        userAuthorizationHandler(3),
        express.json(),
        checkCertificateInput,
        inputValidationMiddleware,
        addCertificateRecord
    );

CertificateRouter.get("/user/:userId",
    clientPlatform,
    userAuthorizationHandler(2), 
    getCertificatesByUserId
);

CertificateRouter.route("/:id")
    .patch(
        clientPlatform,
        userAuthorizationHandler(3),
        express.json(),
        checkCertificateInput,
        inputValidationMiddleware,
        updateCertificateRecord
    )
    .delete(
        clientPlatform,
        userAuthorizationHandler(3),
        deleteCertificateRecord
    );

module.exports = CertificateRouter;