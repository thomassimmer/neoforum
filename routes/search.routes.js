const controller = require("../controllers/search.controller");

module.exports = function (app) {

    // GET --> List all usernames / channels that contains the parameter slug
    app.get('/search/:slug', controller.findContaining);
};