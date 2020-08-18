const dataController = require("../controllers/dataController");
const express = require("express");
const dataRouter = express.Router();

dataRouter.get('/top', dataController.topCharts);

module.exports = dataRouter;