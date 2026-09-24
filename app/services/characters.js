const { Sequelize, Op } = require('sequelize');
const Quote = require('../models/quotes');
const descriptions = require('../data/characters');
const { slugify, clean } = require('../utils');

// En dessous de ce nombre de citations, la page n'est pas indexée (contenu trop mince)
const MIN_INDEXABLE = 3;
const CACHE_TTL = 60 * 60 * 1000;

let cache = null;
let cachedAt = 0;

const ROMAN = {
  I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7,
};

const bookNumber = (season) => ROMAN[clean(season).replace(/^Livre\s+/i, '')] || 99;
const episodeNumber = (episode) => parseInt(clean(episode), 10) || 999;

async function list() {
  if (cache && Date.now() - cachedAt < CACHE_TTL) return cache;

  const rows = await Quote.findAll({
    attributes: ['characts', 'actor', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
    where: { characts: { [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: '' }] } },
    group: ['characts', 'actor'],
    raw: true,
  });

  // Regroupe par personnage (un même personnage peut apparaître avec plusieurs interprètes)
  const bySlug = new Map();
  rows.forEach((row) => {
    const name = clean(row.characts);
    const slug = slugify(name);
    if (!slug) return;
    const entry = bySlug.get(slug) || {
      slug, name, dbNames: new Set(), count: 0, actors: new Map(),
    };
    entry.dbNames.add(row.characts);
    entry.count += Number(row.count);
    const actor = clean(row.actor);
    if (actor) entry.actors.set(actor, (entry.actors.get(actor) || 0) + Number(row.count));
    bySlug.set(slug, entry);
  });

  cache = [...bySlug.values()]
    .map((entry) => ({
      slug: entry.slug,
      name: entry.name,
      dbNames: [...entry.dbNames],
      count: entry.count,
      actor: [...entry.actors.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || null,
      description: descriptions[entry.slug] || null,
      indexable: entry.count >= MIN_INDEXABLE,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'fr'));
  cachedAt = Date.now();
  return cache;
}

async function find(slug) {
  const characters = await list();
  return characters.find((character) => character.slug === slug) || null;
}

async function quotesOf(character) {
  const quotes = await Quote.findAll({
    where: { characts: { [Op.in]: character.dbNames } },
    raw: true,
  });
  return quotes
    .map((quote) => ({
      id: quote.id,
      content: clean(quote.content),
      actor: clean(quote.actor),
      season: clean(quote.season),
      episode: clean(quote.episode),
    }))
    .sort((a, b) => bookNumber(a.season) - bookNumber(b.season)
      || episodeNumber(a.episode) - episodeNumber(b.episode)
      || a.id - b.id);
}

module.exports = {
  list, find, quotesOf, slugify,
};
