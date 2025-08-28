// Created by Soumyadip Roy

const clientPlatform = (req, res, next) => {
    try {
        const userAgent = req.headers["user-agent"] || "";
        let platform = "unknown";

        if (/postman/i.test(userAgent)) {
            platform = "postman";
        } else if (/mobile/i.test(userAgent)) {
            platform = "mobile";
        } else if (/mozilla/i.test(userAgent)) {
            platform = "browser";
        }

        req.clientPlatform = platform;
        console.log(`[Client Platform] → ${platform}`);

        next(); 
    } catch (error) {
        console.error("clientPlatform middleware error:", error.message);
        next();
    }
};

module.exports = { clientPlatform };