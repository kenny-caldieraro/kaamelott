const mainController = {
  error404(req, res, next) {
    res.status(404).render("404");
  },

  logUrl(req, res, next) {
    console.log(req.url);
    next();
  },

  mainUrl(req, res) {
    res.render("index", {
      var1: "Dossier de base",
      var2: "Node.js, Express.js, ejs",
    });
  },
};

module.exports = mainController;
