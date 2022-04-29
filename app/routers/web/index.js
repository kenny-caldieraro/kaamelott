const express = require('express');
const mainController = require('../../controllers/web/mainController');
const error = require('../../controllers/web/errorController');

const router = express.Router();

router.get('/', mainController.mainUrl);

router.use(error.error404);

module.exports = router;
