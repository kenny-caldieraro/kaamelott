const stripAccents = (text) => text.normalize('NFD').replace(/[̀-ͯ]/g, '');

// "Le Maître d'Armes" -> "le-maitre-d-armes"
const slugify = (text) => stripAccents(String(text))
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const clean = (value) => (value || '').trim();

module.exports = { stripAccents, slugify, clean };
