var mysql = require('mysql');

var connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});


connection.connect(function (err) {
    if (err) throw err;
    console.log("[SERVER] Database connection established..");
});

module.exports = connection;