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
        const user = await db.User.findByPk(data.userId);
        let user_message = await db.User_Message.findOne({
            where: {
                userId: data.userId,
                messageId: data.messageId
            }
        });
        if (user_message) {
            user_message.received = true;
            await user_message.save();
        } else {
            user_message = await db.User_Message.create({
                userId: data.userId,
                messageId: data.messageId,
                seen: false,
                received: true,
            });
        }
        io.emit(`TELL_CLIENTS_MESSAGE_IS_RECEIVED_${data.messageId}`, { user_message: user_message, user: user });
    });

    socket.on('TELL_SERVER_MESSAGE_IS_SEEN', async (data) => {
        const user = await db.User.findByPk(data.userId);
        let user_message = await db.User_Message.findOne({
            where: {
                userId: data.userId,
                messageId: data.messageId
            }
        });
        if (user_message) {
            user_message.received = true;
            user_message.seen = true;
            await user_message.save();
        } else {
            user_message = await db.User_Message.create({
                userId: data.userId,
                messageId: data.messageId,
                seen: true,
                received: true,
            });
        }
        io.emit(`TELL_CLIENTS_MESSAGE_IS_SEEN_${data.messageId}`, { user_message: user_message, user: user });
    });

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
    });
};