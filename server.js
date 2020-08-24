const express = require("express");
const bodyParser = require('body-parser');
require('dotenv').config()
var authroute = require("./src/routes/authRoute");
var dataroute = require("./src/routes/dataRoute");

var app = express();
app.use(require('body-parser').urlencoded({ extended: false }));
app.use(express.json());
const port = 3030;

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/auth', authroute);
app.use('/music', dataroute);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});