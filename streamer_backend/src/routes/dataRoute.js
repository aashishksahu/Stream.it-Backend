const dataController = require("../controllers/dataController");

router.get('/top', dataController.topCharts);

module.exports = router;