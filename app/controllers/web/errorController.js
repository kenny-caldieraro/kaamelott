module.exports = {
  error404(_, res) {
    res.status(404).render('404', {
      page: {
        title: 'Page introuvable | Kaamelott API',
        noindex: true,
      },
    });
  },

  // eslint-disable-next-line no-unused-vars
  error500(error, req, res, next) {
    console.error(error);
    if (req.originalUrl.startsWith('/api/')) {
      return res.status(500).json({ error: '500', message: 'Internal server error' });
    }
    return res.status(500).render('404', {
      page: {
        title: 'Erreur serveur | Kaamelott API',
        noindex: true,
      },
      status: 500,
    });
  },
};
