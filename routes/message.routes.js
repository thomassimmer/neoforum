const controller = require("../controllers/message.controller");

module.exports = function (app) {
    // GET index --> List all users
    app.get('/messages/index', controller.findAll);

    // POST index --> Create new message
    app.post('/messages/index', controller.create);

    // GET --> Show message based on his id
    app.get('/messages/:messageId', controller.findByPk);

    // PUT --> Modify message based on his id
    app.put('/messages/:messageId', controller.update);

    // DELETE --> Delete message based on his id
    app.delete('/messages/:messageId', controller.delete);
}