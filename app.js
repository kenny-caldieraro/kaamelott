const compression = require('compression');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const path = require('node:path');

const config = require('./app/config');
const canonicalHost = require('./app/middlewares/canonicalHost');
const router = require('./app/router');
const { version } = require('./package.json');

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));

app.locals.siteUrl = config.siteUrl;
app.locals.assetVersion = version;

app.use(canonicalHost);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'"],
      'style-src': ["'self'", 'https://fonts.googleapis.com'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
      'img-src': ["'self'", 'data:'],
      'media-src': ["'self'", config.apiUrl],
      'connect-src': ["'self'"],
    },
  },
  // Les sons et l'API sont consommés depuis d'autres sites
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(compression());
app.use(cors({ origin: '*' }));

app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: config.isProd ? '7d' : 0,
  setHeaders(res, filePath) {
    if (/\.(mp3|webp|jpg|png|ico)$/.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=2592000');
    }
  },
}));

app.use(router);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
