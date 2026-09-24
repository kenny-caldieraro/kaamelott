const express = require('express');

const routerWeb = require('./routers/web');
const routerQuotes = require('./routers/quotes');
const routerSound = require('./routers/sounds');
const error = require('./controllers/web/errorController');

const router = express.Router();

router.use('/api/v1/quote', routerQuotes);
router.use('/api/v1/sound', routerSound);
router.use('/', routerWeb);
router.use(error.error500);

module.exports = router;
