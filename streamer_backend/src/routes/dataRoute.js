const dataController = require("../controllers/dataController");
const express = require("express");
const dataRouter = express.Router();

dataRouter.get('/top', dataController.topCharts);
dataRouter.get('/getLikeCount', dataController.getLikeCountForSong);
dataRouter.get('/getFavourites', dataController.getFavourites);
dataRouter.post('/addFavourites', dataController.addToFavourites);
dataRouter.post('/removeFavourites', dataController.removeFavourites);
dataRouter.post('/addLikes', dataController.updateLikes);

module.exports = dataRouter;