const db = require("../models");
const Message = db.Message;

// GET index --> List all users
exports.findAll = (req, res) => {
    Message.findAll({
        include: ["user", "favoritedBy"],
    }).then((messages) => {
        res.send(messages);
    }).catch((err) => {
        console.log(">> Error while getting messages : ", err);
    });
};

// POST index --> Create new message
exports.create = (req, res) => {
    Message.create({
        content: req.body.content,
    }).then((message) => {
        res.send(message);
    }).catch((err) => {
        console.log(">> Error while creating message : ", err);
    });
};

// GET --> Show message based on his id
exports.findByPk = (req, res) => {
    Message.findByPk(req.params.messageId, {
        include: ["user", "favoritedBy"],
    }).then((message) => {
        res.send(message);
    }).catch((err) => {
        console.log(">> Error while getting message : ", err);
    });
};

// PUT --> Modify message based on his id
exports.update = (req, res) => {
    const id = req.params.messageId;
    Message.update(
        { content: req.body.content },
        { where: { id: req.params.messageId } }
    ).then(() => {
        res.status(200).send({ message: "updated successfully a message with id = " + id });
    }).catch((err) => {
        console.log(">> Error while updating message : ", err);
    });
};

// TODO: Make this available ?
// DELETE --> Delete message based on his id
// exports.delete = (req, res) => {
//     const id = req.params.messageId;
//     Message.destroy({
//         where: { id: id },
//     }).then(() => {
//         res.status(200).send({ message: "deleted successfully a message with id = " + id });
//     }).catch((err) => {
//         console.log(">> Error while deleting message : ", err);
//     });
// };
