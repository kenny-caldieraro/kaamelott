const sounds = require('../../services/sounds');

const handleError = (res, error) => {
  res.status(500).json({ error: error.message });
};

const soundController = {
  async getSounds(_, res) {
    try {
      const list = await sounds.list();
      res.json(list.map(sounds.toJSON));
    } catch (error) {
      handleError(res, error);
    }
  },

  async getSound(req, res, next) {
    try {
      const sound = await sounds.search(req.params.name);
      if (!sound) {
        return next();
      }
      return res.json(sounds.toJSON(sound));
    } catch (error) {
      return handleError(res, error);
    }
  },

  async randomSound(_, res) {
    try {
      const sound = await sounds.random();
      res.set('Cache-Control', 'no-store');
      res.json(sounds.toJSON(sound));
    } catch (error) {
      handleError(res, error);
    }
  },
};

module.exports = soundController;
