const { Sequelize } = require('sequelize');
const Quote = require('../../models/quotes');
const sounds = require('../../services/sounds');
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
      const [quote, soundList] = await Promise.all([getInitialQuote(), sounds.list()]);
      res.render('index', {
        quote,
        sounds: soundList,
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

  sitemap(_, res) {
    const lastmod = new Date().toISOString().split('T')[0];
    // La CSP bloque les styles du visualiseur XML des navigateurs
    res.removeHeader('Content-Security-Policy');
    res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`);
  },
};

module.exports = mainController;
