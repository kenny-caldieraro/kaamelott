const { Sequelize } = require('sequelize');
const Quote = require('../../models/quotes');
const sounds = require('../../services/sounds');
const characters = require('../../services/characters');
const { siteUrl } = require('../../config');

// Évite de bloquer l'affichage de la page si la base de données est lente
const withTimeout = (promise, ms) => Promise.race([
  promise,
  new Promise((resolve) => { setTimeout(() => resolve(null), ms); }),
]);

async function getInitialQuote() {
  try {
    return await withTimeout(Quote.findOne({ order: [Sequelize.fn('RAND')] }), 1500);
  } catch {
    return null;
  }
}

const mainController = {
  async mainUrl(_, res, next) {
    try {
      const [quote, soundList, characterList] = await Promise.all([
        getInitialQuote(),
        sounds.list(),
        withTimeout(characters.list(), 1500).catch(() => null),
      ]);
      res.render('index', {
        quote,
        sounds: soundList,
        characters: (characterList || []).filter((character) => character.indexable),
        page: {
          canonical: `${siteUrl}/`,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  robots(_, res) {
    res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
  },

  async sitemap(_, res) {
    const lastmod = new Date().toISOString().split('T')[0];
    let characterList = [];
    try {
      characterList = (await characters.list()).filter((character) => character.indexable);
    } catch {
      // La base est indisponible : on sert au moins la page d'accueil
    }
    const urls = [
      { loc: `${siteUrl}/`, changefreq: 'weekly', priority: '1.0' },
      { loc: `${siteUrl}/personnages`, changefreq: 'weekly', priority: '0.8' },
      ...characterList.map((character) => ({
        loc: `${siteUrl}/personnages/${character.slug}`,
        changefreq: 'monthly',
        priority: '0.7',
      })),
    ];
    // La CSP bloque les styles du visualiseur XML des navigateurs
    res.removeHeader('Content-Security-Policy');
    res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>
`);
  },
};

module.exports = mainController;
