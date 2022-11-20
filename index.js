const path = require('path');
const express = require("express");
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');

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

app.use(
    fileUpload({
        useTempFiles: true,
        safeFileNames: true,
        preserveExtension: true,
        tempFileDir: `${__dirname}/public/files/temp`,
        limits: {
            fileSize: 10000000,  // 10 mb max.
        },
        abortOnLimit: true,
    })
);

const db = require("./models");

db.sequelize.sync();
// Force true will drop tables
// db.sequelize.sync({ force: true }).then(() => {
//     require('./models/init')(db);
// });


// Initialize socket events handling
const http = require('http').Server(app);
const io = require('socket.io')(http, corsOptions);
const registerMessageHandlers = require('./middleware/messageHandler');

io.on('connection', (socket) => {
    registerMessageHandlers(io, socket);
});


require('./routes/auth.routes')(app);

// What comes after need authentication
app.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    verifyToken(req, res, next);
});

// routes
require('./routes/search.routes')(app);
require('./routes/message.routes')(app);
require('./routes/user.routes')(app);
require('./routes/channel.routes')(app);

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
