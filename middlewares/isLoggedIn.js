const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.redirect("/signin");
        }

        const decoded = jwt.verify(token, process.env.jwtsecret);
        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.redirect("/signin");
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("Auth error:", err.message);

        if (err.name === "TokenExpiredError") {
            return res.status(401).send("Session expired. Please login again.");
        } else if (err.name === "JsonWebTokenError") {
            return res.status(401).send("Invalid token.");
        }

        return res.status(500).send("Error in login");
    }
}
