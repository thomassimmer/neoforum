const controller = require("../controllers/user.controller");

module.exports = function (app) {
    // GET index --> List all users
    app.get('/users/index', controller.findAll);

    // POST index --> Create new user
    app.post('/users/index', controller.create);

    // GET --> Get current user
    app.get('/users/me', controller.getCurrentUser);

    // GET --> Get user based on his id
    app.get('/users/:userId', controller.findByPk);

    // PUT --> Modify user based on his id
    app.put('/users/:userId', controller.update);

    // DELETE --> Delete user based on his id
    app.delete('/users/:usersId', controller.delete);
};