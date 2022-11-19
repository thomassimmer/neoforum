const db = require("../models");

module.exports = (io, socket) => {

    // Save and sends the message to all the users on the server
    socket.on('SEND_MESSAGE_TO_SERVER', async (data) => {
        const user = await db.User.findByPk(data.userId);
        if (user) {
            const message = await db.Message.create({
                content: data.content,
                channelId: data.channelId,
                userId: data.userId,
            });
            io.emit(`SEND_MESSAGE_TO_CLIENTS_${data.channelId}`, { message: message, user: user });
        }
    });

    socket.on('TELL_SERVER_MESSAGE_IS_RECEIVED', async (data) => {
        try {
            const user = await db.User.findByPk(data.userId);
            const result = await db.sequelize.transaction(async (t) => {
                let user_message = await db.User_Message.findOne({
                    where: {
                        userId: data.userId,
                        messageId: data.messageId
                    },
                    transaction: t
                });
                if (user_message) {
                    user_message.received = true;
                    await user_message.save({ transaction: t });
                } else {
                    user_message = await db.User_Message.create({
                        userId: data.userId,
                        messageId: data.messageId,
                        seen: false,
                        received: true,
                    }, { transaction: t });
                }
                return user_message;
            });
            io.emit(`TELL_CLIENTS_MESSAGE_IS_RECEIVED_${data.messageId}`, { user_message: result, user: user });
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('TELL_SERVER_MESSAGE_IS_SEEN', async (data) => {
        try {
            const user = await db.User.findByPk(data.userId);
            const result = await db.sequelize.transaction(async (t) => {
                let user_message = await db.User_Message.findOne({
                    where: {
                        userId: data.userId,
                        messageId: data.messageId
                    },
                    transaction: t
                });
                if (user_message) {
                    user_message.received = true;
                    user_message.seen = true;
                    await user_message.save({ transaction: t });
                } else {
                    user_message = await db.User_Message.create({
                        userId: data.userId,
                        messageId: data.messageId,
                        seen: true,
                        received: true,
                    }, { transaction: t });
                }
                return user_message;
            });
            io.emit(`TELL_CLIENTS_MESSAGE_IS_SEEN_${data.messageId}`, { user_message: result, user: user });
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('TELL_SERVER_YOU_JOINED_A_CHANNEL', async (data) => {
        const users = data.users;
        const channel = await db.Channel.findByPk(
            data.channelId,
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
        for (let user of users) {
            io.emit(`${user.id}_JOINED_A_CHANNEL`, { channel: channel });
        }
    })

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
    });
};