module.exports = (sequelize, Sequelize) => {
    const Channel = sequelize.define("channels", {
        name: {
            type: Sequelize.STRING,
            unique: true,
        },
        image: {
            type: Sequelize.STRING,
        },
        isPrivate: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });
    return Channel;
};