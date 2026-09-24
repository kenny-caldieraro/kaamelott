const express = require('express');
const quoteController = require('../../controllers/quote/quoteController');
const error = require('../../controllers/quote/errorController');

const router = express.Router();

router.get('/all', quoteController.getQuotes);

router.get('/random', quoteController.randomQuote);

// Déclarée avant '/:id' pour ne pas être masquée par le paramètre
router.get('/coffee', quoteController.easterEgg);

router.get('/:id', quoteController.getQuote);

router.use(error.error404);

module.exports = router;
