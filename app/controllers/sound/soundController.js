const fs = require('fs-extra');

const soundController = {
  async getSounds(_, res) {
    try {
      const sounds = await fs.readdirSync('./public/sounds');
      const paths = sounds.map((sound) => ({
        name: sound,
        path: `${process.env.URL_API}sounds/${sound}`,
      }));
      res.json(paths);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  },

  async getSound(req, res, next) {
    try {
      const soundName = req.params.name;

      // const checkSound = await fs.pathExists(`./public/sounds/${soundName}`);
      // if (!checkSound) {
      //   res.status(404).render('404');
      // }
      const response = {};
      const sounds = await fs.readdirSync('./public/sounds');

      soundName.split(' ').find((word) => {
        const sound = sounds.find((data) => data.includes(word));
        if (sound) {
          response.name = sound;
          response.path = `${process.env.URL_API}sounds/${sound}`;
        }
      });

      if (!response.name) {
        return next();
      }

      res.json({
        ...response,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  },

  async randomSound(_, res) {
    try {
      const sounds = await fs.readdirSync('./public/sounds');
      const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
      const soundPath = `${process.env.URL_API}sounds/${randomSound}`;
      res.json({
        name: randomSound,
        path: soundPath,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  },
};

module.exports = soundController;
