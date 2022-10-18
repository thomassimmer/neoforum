const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token'];
        if (!token) {
            res.status(500).json({ errors: [{ name: "NoTokenError"}] });
        }
        const verify = await jwt.verify(token, config.secret);
        req.user = await db.user.findByPk(verify.id);
        next();
    } catch (error) {
        res.status(500).json({ errors: [error] });
    }
}

module.exports = {
    authJwt,
    verifySignUp,
    isAuthenticated
};