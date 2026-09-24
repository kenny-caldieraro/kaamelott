const fs = require('node:fs/promises');
const path = require('node:path');
const { apiUrl } = require('../config');

const SOUNDS_DIR = path.join(__dirname, '../../public/sounds');

let cache = null;

const normalize = (text) => text
  .toLowerCase()
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

// "j_ai_le_droit_d_etre_4_jours.mp3" -> "J ai le droit d etre 4 jours"
const toTitle = (file) => {
  const label = file
    .replace(/\.mp3$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s*\d+$/, '')
    .trim();
  return label.charAt(0).toUpperCase() + label.slice(1);
};

const toSound = (file) => ({
  name: file,
  title: toTitle(file),
  path: `${apiUrl}sounds/${encodeURIComponent(file)}`,
  keywords: normalize(file.replace(/\.mp3$/i, '')),
});

async function list() {
  if (!cache) {
    const files = await fs.readdir(SOUNDS_DIR);
    cache = files
      .filter((file) => file.toLowerCase().endsWith('.mp3'))
      .sort((a, b) => a.localeCompare(b, 'fr'))
      .map(toSound);
  }
  return cache;
}

async function random() {
  const sounds = await list();
  return sounds[Math.floor(Math.random() * sounds.length)];
}

// Retourne le son dont le nom correspond le mieux aux mots recherchés
async function search(query) {
  const sounds = await list();
  const words = normalize(query).split(' ').filter(Boolean);
  if (!words.length) return null;

  const exact = sounds.find((sound) => sound.keywords === words.join(' '));
  if (exact) return exact;

  let best = null;
  let bestScore = 0;
  sounds.forEach((sound) => {
    const score = words.filter((word) => sound.keywords.includes(word)).length;
    if (score > bestScore) {
      best = sound;
      bestScore = score;
    }
  });
  return best;
}

// Format historique de l'API : { name, path }
const toJSON = ({ name, path: soundPath }) => ({ name, path: soundPath });

module.exports = {
  list, random, search, toJSON,
};
