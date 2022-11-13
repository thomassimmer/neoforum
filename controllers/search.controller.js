var Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require("../models");

// GET --> List all username / channels that contains the parameter
exports.findContaining = async (req, res) => {
    try {
        const users = await db.User.findAll({
            where: {
                username: {
                    [Op.iLike]: '%' + req.params.slug + '%'
                }
            }
        });
        const channels = await db.Channel.findAll({
            where: {
                name: {
                    [Op.iLike]: '%' + req.params.slug + '%'
                },
                isPrivate: false,
            }
        });
        res.status(200).send({ users: users, channels: channels });
    } catch (err) {
        console.error(err);
    }
};

