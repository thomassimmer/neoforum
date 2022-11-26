const db = require("../models");
const config = require("../config/auth.config");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    try {
        // Save User to Database
        const user = await db.User.create({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8)
        });

        // Add user in two default channels
        const generic_channel = await db.Channel.findOne({
            where: { name: "General" }
        });

        const support_channel = await db.Channel.findOne({
            where: { name: "Support" }
        });

        user.addChannel(generic_channel);
        user.addChannel(support_channel);

        // Set "user" role by default
        await user.setRoles([1]);

        const token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // 24 hours
        });

        let refreshToken = await db.RefreshToken.createToken(user);

        let authorities = [];
        const roles = await user.getRoles();

        for (let i = 0; i < roles.length; i++) {
            authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token,
            refreshToken: refreshToken,
            message: "User was registered successfully!"
        });

    } catch (err) {
        console.log("Error:", err.message)
        res.status(500).json({ message: err.message });
    };
};

exports.signin = async (req, res) => {
    try {
        const user = await db.User.findOne({
            where: {
                username: req.body.username
            }
        });

        if (!user) {
            return res.status(404).send({
                message: {
                    username: "User not found"
                }
            });
        }

        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: {
                    password: "Invalid Password"
                }
            });
        }

        const token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // 24 hours
        });

        let refreshToken = await db.RefreshToken.createToken(user);

        var authorities = [];
        const roles = user.getRoles()

        for (let i = 0; i < roles.length; i++) {
            authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token,
            refreshToken: refreshToken,
            image: user.image,
        });

    } catch (err) {
        console.log(err.message)
        res.status(500).send({ message: err.message });
    };
};

exports.refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body;

    if (requestToken == null) {
        return res.status(403).json({ message: "Refresh Token is required!" });
    }

    try {
        let refreshToken = await db.RefreshToken.findOne({ where: { token: requestToken } });

        if (!refreshToken) {
            res.status(403).json({ message: "Refresh token is not in database!" });
            return;
        }

        if (db.RefreshToken.verifyExpiration(refreshToken)) {
            db.RefreshToken.destroy({ where: { id: refreshToken.id } });

            res.status(403).json({
                message: "Refresh token was expired. Please make a new signin request",
            });
            return;
        }

        const user = await refreshToken.getUser();
        let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: config.jwtExpiration,
        });

        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        });
    } catch (err) {
        return res.status(500).send({ message: err });
    }
};