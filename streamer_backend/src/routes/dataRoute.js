const dataController = require("../controllers/dataController");
const express = require("express");
const dataRouter = express.Router();

dataRouter.get('/top', dataController.topCharts);
dataRouter.get('/getFavourites', dataController.getFavourites);
dataRouter.post('/addFavourites', dataController.addToFavourites);
dataRouter.put('/addLikes', dataController.updateLikes);
dataRouter.put('/addDislikes', dataController.updateDislikes);

module.exports = dataRouter;