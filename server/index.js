// server/index.js
const path = require('path');
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const { isAuthenticated } = require('../authentication/middleware');

const PORT = process.env.PORT || 3001;

const app = express();

var corsOptions = {
    origin: "http://localhost:3001"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

const db = require("../authentication/models");
const Role = db.role;

db.sequelize.sync();
// Force true will drop tables
// db.sequelize.sync({ force: true }).then(() => {
//   console.log('Drop and Resync Db');
//   initial();
// });

// routes
require('../authentication/routes/auth.routes')(app);
require('../authentication/routes/user.routes')(app);

app.get('/api/users', isAuthenticated, async (req, res) => {
    const users = await db.user.findAll({
        attributes: ['username']
    });
    if(!req.user){
        return res.json({message:'No user found'})
    }
    res.status(200).send({
        users: users,
        user: req.user
    });
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

function initial() {
    Role.create({
        id: 1,
        name: "user"
    });

    Role.create({
        id: 2,
        name: "moderator"
    });

    Role.create({
        id: 3,
        name: "admin"
    });
}
