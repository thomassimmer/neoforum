const controller = require("../controllers/channel.controller");

module.exports = function (app) {
    // GET index --> List all channels
    app.get('/channels/index', controller.findAll);

    // POST index --> Create new channel
    app.post('/channels/index', controller.create);

    // GET --> Get channel based on his id
    app.get('/channels/:channelId', controller.findByPk);

    // PUT --> Modify channel based on his id
    app.put('/channels/:channelId', controller.update);

    // DELETE --> Delete channel based on his id
    app.delete('/channels/:channelsId', controller.delete);

    // GET private --> Get conversation of request user with given user
    app.get('/channels/private/:userId', controller.findPrivateChannelWithUser);

    // GET join --> Join a conversation
    app.get('/channels/join/:channelId', controller.join);
};