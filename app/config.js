require('dotenv').config({ quiet: true });

const trimSlash = (url) => url.replace(/\/+$/, '');

const siteUrl = trimSlash(process.env.SITE_URL || 'https://kaamelott.xyz');

module.exports = {
  port: process.env.PORT || 3000,
  siteUrl,
  // URL publique utilisée pour construire les liens vers les fichiers audio
  apiUrl: `${trimSlash(process.env.URL_API || siteUrl)}/`,
  isProd: process.env.NODE_ENV === 'production',
};
