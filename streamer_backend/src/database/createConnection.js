var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'testuser',
    password: 'password',
    database: 'streamer'
});


connection.connect(function (err) {
    if (err) throw err;
    console.log("[SERVER] Database connection established..");
});

module.exports = connection;