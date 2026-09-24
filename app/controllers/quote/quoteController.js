const { Sequelize } = require('sequelize');
const Quote = require('../../models/quotes');

const handleError = (res, error) => {
  res.status(500).json({ error: error.message });
};

const quoteController = {
  async getQuotes(_, res) {
    try {
      const quotes = await Quote.findAll();
      res.json(quotes);
    } catch (error) {
      handleError(res, error);
    }
  },

  async randomQuote(_, res) {
    try {
      const quote = await Quote.findOne({
        order: [Sequelize.fn('RAND')],
      });
      res.set('Cache-Control', 'no-store');
      res.json(quote);
    } catch (error) {
      handleError(res, error);
    }
  },

  async getQuote(req, res, next) {
    try {
      const quoteId = Number(req.params.id);
      if (!Number.isInteger(quoteId)) {
        return next();
      }
      const quote = await Quote.findByPk(quoteId);
      if (!quote) {
        return next();
      }
      return res.json(quote);
    } catch (error) {
      return handleError(res, error);
    }
  },

  easterEgg(_, res) {
    res.status(418).json({ error: "I'm a teapot" });
  },
};

module.exports = quoteController;
