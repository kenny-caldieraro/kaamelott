const characters = require('../../services/characters');
const { siteUrl } = require('../../config');

const characterController = {
  async index(_, res, next) {
    try {
      const list = await characters.list();
      res.render('characters', {
        characters: list,
        page: {
          title: 'Les personnages de Kaamelott et leurs citations cultes',
          description: `Retrouvez les citations cultes des ${list.length} personnages de Kaamelott : Arthur, Perceval, Léodagan, Karadoc, Kadoc, Merlin et toute la Table ronde.`,
          canonical: `${siteUrl}/personnages`,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async show(req, res, next) {
    try {
      const character = await characters.find(req.params.slug);
      if (!character) return next();

      const [quotes, list] = await Promise.all([characters.quotesOf(character), characters.list()]);
      const others = list.filter((other) => other.slug !== character.slug && other.indexable).slice(0, 12);
      const plural = quotes.length > 1 ? 's' : '';

      return res.render('character', {
        character,
        quotes,
        others,
        page: {
          title: `Citations de ${character.name} – Kaamelott`,
          description: `${quotes.length} citation${plural} culte${plural} de ${character.name}${character.actor ? ` (${character.actor})` : ''} dans Kaamelott, classées par livre et par épisode. « ${quotes[0].content.slice(0, 90)}${quotes[0].content.length > 90 ? '…' : ''} »`,
          canonical: `${siteUrl}/personnages/${character.slug}`,
          noindex: !character.indexable,
        },
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = characterController;
