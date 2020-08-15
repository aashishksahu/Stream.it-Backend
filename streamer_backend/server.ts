const express = require('express');
var cors = require('cors');
const app = express();
const port = 3030;

app.use(cors());

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});