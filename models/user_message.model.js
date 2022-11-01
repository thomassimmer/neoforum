module.exports = (sequelize, Sequelize) => {
    const User_Message = sequelize.define("User_Message", {
        seen: Sequelize.BOOLEAN,
        received: Sequelize.BOOLEAN,
    });
    return User_Message;
};