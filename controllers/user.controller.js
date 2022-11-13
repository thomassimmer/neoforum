const db = require("../models");

// GET index --> List all users
exports.findAll = (req, res) => {
    db.User.findAll({
        include: ["messages", "User_Channels", "favoriteMessages"],
    }).then(users => {
        res.send(users);
    }).catch((err) => {
        console.log(">> Error while getting users : ", err);
    });
};

// POST index --> Create new user
exports.create = (req, res) => {
    db.User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }).then(async user => {
        const generic_channel = await db.Channel.findByPk(1);
        await user.addChannel(generic_channel);
        res.send(user);
    }).catch((err) => {
        console.log(">> Error while creating user : ", err);
    });
};

// GET --> Get current user info
exports.getCurrentUser = (req, res) => {
    if (!req.userId) {
        return res.status(403).json({
            errors: {
                authentication: ['No user found']
            }
        });
    }
    db.User.findByPk(req.userId, {
        include: [
            db.Message,
            {
                model: db.Channel,
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
        ],
    }).then(user => {
        if (user)
            res.status(200).send({ user: user });
        else
            return res.status(403).json({
                errors: {
                    authentication: ['No user found']
                }
            });
    }).catch((err) => {
        console.log(">> Error while getting user : ", err);
    });
};

// GET --> Get user based on his id
exports.findByPk = async (req, res) => {
    try {
        const user = await db.User.findByPk(req.params.userId, {
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
        })
        res.status(200).send({ user: user });
    } catch (err) {
        console.log(">> Error while getting user : ", err);
    };
};

// PUT --> Modify user based on his id
exports.update = (req, res) => {
    const id = req.params.userId;
    db.User.update({ username: req.body.username, email: req.body.email },
        { where: { id: req.params.userId } }
    ).then(() => {
        res.status(200).send({ message: 'updated successfully a user with id = ' + id });
    }).catch((err) => {
        console.log(">> Error while updating user : ", err);
    });
};

// DELETE --> Delete user based on his id
exports.delete = (req, res) => {
    const id = req.params.userId;
    db.User.destroy({
        where: { id: id }
    }).then(() => {
        res.status(200).send({ message: 'deleted successfully a user with id = ' + id });
    }).catch((err) => {
        console.log(">> Error while deleting user : ", err);
    });
};