require('dotenv').config();

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    process.env.DATABASE_URL,
    {
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user.model")(sequelize, Sequelize);
db.Role = require("./role.model")(sequelize, Sequelize);
db.Message = require("./message.model")(sequelize, Sequelize);
db.Channel = require("./channel.model")(sequelize, Sequelize);
db.RefreshToken = require("./refreshToken.model.js")(sequelize, Sequelize);
db.User_Message = require("./user_message.model.js")(sequelize, Sequelize);

db.User.hasMany(db.Message, {
    as: "messages"
});

db.User.belongsToMany(db.Role, { through: "User_Roles" });
db.Role.belongsToMany(db.User, { through: "User_Roles" });

db.Message.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    foreignKey: {
        allowNull: false
    }
});

db.Message.belongsTo(db.Channel, {
    foreignKey: "channelId",
    as: "channel",
    foreignKey: {
        allowNull: false
    }
});

db.Message.belongsTo(db.Message, {
    foreignKey: "messageId",
    as: "replyTo",
});

db.Channel.hasMany(db.Message, {
    as: "messages"
});

db.User.belongsToMany(db.Message, { through: db.User_Message });
db.Message.belongsToMany(db.User, { through: db.User_Message });

db.User.belongsToMany(db.Channel, { through: 'SubscribedChannels' });
db.Channel.belongsToMany(db.User, { through: 'SubscribedChannels' });

db.RefreshToken.belongsTo(db.User, {
    foreignKey: 'userId', targetKey: 'id'
});

db.User.hasOne(db.RefreshToken, {
    foreignKey: 'userId', targetKey: 'id'
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;