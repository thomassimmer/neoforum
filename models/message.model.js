module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define("messages", {
        content: {
            type: Sequelize.STRING,
        },
        attachment: {
            type: Sequelize.STRING,
        },
    });
    return Message;
};