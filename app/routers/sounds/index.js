const express = require('express');
const soundController = require('../../controllers/sound/soundController');
const error = require('../../controllers/sound/errorController');

const router = express.Router();

router.get('/all', soundController.getSounds);

router.get('/random', soundController.randomSound);

router.get('/:name', soundController.getSound);

router.use(error.error404);

module.exports = router;
