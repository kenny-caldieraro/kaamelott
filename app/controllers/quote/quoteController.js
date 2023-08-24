const { Sequelize } = require('sequelize');
const Quote = require('../../models/quotes');

const quoteController = {
  async getQuotes(_, res) {
    try {
      const quotes = await Quote.findAll();
      res.json(quotes);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  },

  async randomQuote(_, res) {
    try {
      const quote = await Quote.findOne({
        order: [Sequelize.fn('RAND')],
      });
      res.json(quote);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  },

  async getQuote(req, res, next) {
    try {
      const quoteId = Number(req.params.id);
      if (isNaN(quoteId)) {
        return next();
      }
      const quote = await Quote.findOne({
        where: {
          id: quoteId,
        },
      });
      if (!quote) {
        return next();
      }
      res.json(quote);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  },

  async easterEgg(_, res) {
    res.status(418).json({ error: "I'm a teapot" });
  },
};

module.exports = quoteController;
