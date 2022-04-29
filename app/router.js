const express = require("express");
const mainController = require("./controllers/mainController");
const router = express.Router();

router.use(mainController.logUrl);

router.get("/", mainController.mainUrl);

router.use(mainController.error404);

module.exports = router;
