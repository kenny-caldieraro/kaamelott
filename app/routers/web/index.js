const express = require('express');
const mainController = require('../../controllers/web/mainController');
const characterController = require('../../controllers/web/characterController');
const error = require('../../controllers/web/errorController');

const router = express.Router();

router.get('/', mainController.mainUrl);
router.get('/personnages', characterController.index);
router.get('/personnages/:slug', characterController.show);
router.get('/robots.txt', mainController.robots);
router.get('/sitemap.xml', mainController.sitemap);

router.use(error.error404);

module.exports = router;
