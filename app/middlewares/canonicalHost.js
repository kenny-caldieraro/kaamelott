const { siteUrl } = require('../config');

const canonical = new URL(siteUrl);
const bareHost = canonical.host.replace(/^www\./, '');

// Redirige en 301 vers l'adresse officielle (SITE_URL) :
// - www <-> sans www
// - http -> https, quand un proxy l'indique via X-Forwarded-Proto
// Les autres hôtes (localhost, IP…) ne sont pas touchés.
module.exports = (req, res, next) => {
  const host = (req.headers.host || '').toLowerCase();
  if (host.replace(/^www\./, '') !== bareHost) return next();

  const wrongHost = host !== canonical.host;
  const wrongProtocol = canonical.protocol === 'https:' && req.headers['x-forwarded-proto'] === 'http';

  if (wrongHost || wrongProtocol) {
    return res.redirect(301, `${canonical.origin}${req.originalUrl}`);
  }
  return next();
};
