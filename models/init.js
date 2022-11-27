require('dotenv').config();

var bcrypt = require("bcryptjs");

module.exports = async (db) => {
    const generic_channel = await db.Channel.create({
        name: "General"
    });

    const support_channel = await db.Channel.create({
        name: "Support"
    });

    const neoforum = await db.User.create({
        username: 'neoforum',
        email: 'neoforum@gmail.com',
        password: bcrypt.hashSync(process.env.PASSWORD_NEOFORUM, 8),
        image: 'neoforum-logo.png'
    });

    neoforum.addChannel(generic_channel);
    neoforum.addChannel(support_channel);

    const me = await db.User.create({
        username: 'thomas',
        email: 'thomas@gmail.com',
        password: bcrypt.hashSync(process.env.PASSWORD_THOMAS, 8),
    });

    me.addChannel(generic_channel);
    me.addChannel(support_channel);

    const first_message = await db.Message.create({
        content: `Welcome to Neoforum. 🚀 \n
        This is THE place to communicate. It is FREE, without ads, and secure. 💯 \n
        Create channels, follow existing ones and start sharing your thoughts with the world. 💭`,
        channelId: generic_channel.id,
        userId: neoforum.id,
    });

    const second_message = await db.Message.create({
        content: `You can start by searching for interesting channels in the search bar on the left.👈`,
        channelId: generic_channel.id,
        userId: neoforum.id,
    });

    const third_message = await db.Message.create({
        content: `You faced a problem on the platform ? Please, write us. 🆘`,
        channelId: support_channel.id,
        userId: neoforum.id,
    });

    const user_message1 = await db.User_Message.create({
        userId: me.id,
        messageId: first_message.id,
        seen: false,
        received: false
    });

    const user_message2 = await db.User_Message.create({
        userId: me.id,
        messageId: second_message.id,
        seen: false,
        received: false
    });

    const user_message3 = await db.User_Message.create({
        userId: me.id,
        messageId: third_message.id,
        seen: false,
        received: false
    });

    db.Role.create({
        name: "user"
    });

    db.Role.create({
        name: "moderator"
    });

    db.Role.create({
        name: "admin"
    });
}
