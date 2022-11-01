module.exports = (sequelize, Sequelize) => {
    const Channel = sequelize.define("channels", {
        name: {
            type: Sequelize.STRING,
        },
        image: {
            type: Sequelize.STRING,
        }
    });
    return Channel;
};