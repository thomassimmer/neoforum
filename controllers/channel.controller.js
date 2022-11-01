const db = require("../models");


// GET index --> List all channels
exports.findAll = (req, res) => {
    db.Channel.findAll({
        include: [
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