const db = require("../models");
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

// GET index --> List all channels
exports.findAll = (req, res) => {
    db.Channel.findAll({
        include: [
            { model: db.User },
            { model: db.Message, as: "messages" },
        ],
    }).then(channels => {
        res.send(channels);
    }).catch((err) => {
        console.log(">> Error while getting channels : ", err);
    });
};

// POST index --> Create new channel
exports.create = (req, res) => {
    db.Channel.create({
        name: req.body.channelName,
    }).then(channel => {
        res.send(channel);
    }).catch((err) => {
        console.log(">> Error while creating channel : ", err);
    });
};

// GET --> Get channel based on his id
exports.findByPk = (req, res) => {
    db.Channel.findByPk(req.params.channelId, {
        include: [
            { model: db.User },
            {
                model: db.Message,
                as: "messages",
                include: [
                    { model: db.User, as: "user" },
                    { model: db.User },
                ]
            }
        ],
    }).then(channel => {
        res.status(200).send({
            channel: channel
        });
    }).catch((err) => {
        console.log(">> Error while getting channel : ", err);
    });
};

// PUT --> Modify channel based on his id
exports.update = (req, res) => {
    const id = req.params.channelId;
    db.Channel.update({ name: req.body.channelName },
        { where: { id: id } }
    ).then(() => {
        res.status(200).send({ message: 'Updated successfully a channel with id = ' + id });
    }).catch((err) => {
        console.log(">> Error while updating channel : ", err);
    });
};

// DELETE --> Delete channel based on his id
exports.delete = (req, res) => {
    const id = req.params.channelId;
    db.Channel.destroy({
        where: { id: id }
    }).then(() => {
        res.status(200).send({ message: 'Deleted successfully a channel with id = ' + id });
    }).catch((err) => {
        console.log(">> Error while deleting channel : ", err);
    });
};

// GET --> Get conversation with user who has id equal to req.params.userId
exports.findPrivateChannelWithUser = async (req, res) => {
    let channel;
    const channelName =  `channel_${[req.params.userId, req.userId].sort().join('_')}`;
    try {
        channel = await db.Channel.findOne(
            {
                where: {
                    name: channelName,
                }
            },
            {
                include: [
                    { model: db.User },
                    {
                        model: db.Message,
                        as: "messages",
                        include: [
                            { model: db.User, as: "user" },
                            { model: db.User },
                        ]
                    }
                ],
            }
        );
        if (channel === null) {
            channel = await db.Channel.create({
                name: channelName,
                isPrivate: true,
            });
            channel.messages = [];
            channel.users = [];
        }
        const user = await db.User.findByPk(req.params.userId);
        res.status(200).send({ channel: channel, user: user });
    } catch (err) {
        console.log(">> Error while getting user : ", err);
    };
};

// All users who are in the channel's name join this channel
// Returns the users added.
exports.join = async (req, res) => {
    try {
        const channel = await db.Channel.findByPk(req.params.channelId);
        const userIds = channel.name.matchAll(/(\d+)/gm);
        let users = [];
        
        for (let userId of userIds) {
            const user = await db.User.findByPk(userId[0]);
            try {
                if (!users.map(u => u.id).includes(user.id)) {
                    await channel.addUser(user);
                    users.push(user);    
                }
            } catch (err) {
                continue;
            }
        }
        res.status(200).json({ users: users});
    } catch (err) {
        res.status(500).send(err);
    }
}