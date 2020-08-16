const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');

var app = express();
const port = 3030;

app.use(cors());
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});