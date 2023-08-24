const express = require('express');
const quoteController = require('../../controllers/quote/quoteController');
const error = require('../../controllers/quote/errorController');

const router = express.Router();

router.get('/all', quoteController.getQuotes);

router.get('/random', quoteController.randomQuote);

router.get('/:id', quoteController.getQuote);

router.get('/coffee', quoteController.easterEgg);

router.use(error.error404);

module.exports = router;
