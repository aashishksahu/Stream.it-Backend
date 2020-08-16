const express = require("express");
const bodyParser = require('body-parser');

var authroute = require("./src/routes/authRoute");

var app = express();
const port = 3030;

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/auth', authroute);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});