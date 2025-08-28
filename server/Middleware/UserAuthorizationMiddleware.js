const userAuthorizationHandler = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req?.user?.role;

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                status: false,
                message: "You don't have permission to perform this action.",
            });
        }

        next();
    };
};

module.exports = {
    userAuthorizationHandler,
};
