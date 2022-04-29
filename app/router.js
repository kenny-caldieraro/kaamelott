const express = require('express');

const routerWeb = require('./routers/web');
const routerQuotes = require('./routers/quotes');
const routerSound = require('./routers/sounds');

const router = express.Router();

router.use('/api/v1/quote', routerQuotes);
router.use('/api/v1/sound', routerSound);
router.use('/', routerWeb);

module.exports = router;
